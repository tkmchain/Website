import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'content', 'en');
const dist = path.join(root, 'dist');
const config = JSON.parse(await fs.readFile(path.join(root, 'site.config.json'), 'utf8'));

// Each route has its own generated page tree. The catalog filename can differ
// from the public route (zh uses the zh-CN catalog).
const languages = [
  { route: 'en', catalog: 'en', htmlLang: 'en', label: 'English' },
  { route: 'zh', catalog: 'zh-CN', htmlLang: 'zh-CN', label: '中文' },
  { route: 'ru', catalog: 'ru', htmlLang: 'ru', label: 'Русский' },
  { route: 'ja', catalog: 'ja', htmlLang: 'ja', label: '日本語' },
  { route: 'ko', catalog: 'ko', htmlLang: 'ko', label: '한국어' },
  { route: 'es', catalog: 'es', htmlLang: 'es', label: 'Español' },
  { route: 'ar', catalog: 'ar', htmlLang: 'ar', label: 'العربية' },
  { route: 'fr', catalog: 'fr', htmlLang: 'fr', label: 'Français' },
  { route: 'de', catalog: 'de', htmlLang: 'de', label: 'Deutsch' },
  { route: 'pt', catalog: 'pt', htmlLang: 'pt', label: 'Português' },
  { route: 'hi', catalog: 'hi', htmlLang: 'hi', label: 'हिन्दी' },
  { route: 'id', catalog: 'id', htmlLang: 'id', label: 'Bahasa Indonesia' },
  { route: 'tr', catalog: 'tr', htmlLang: 'tr', label: 'Türkçe' },
  { route: 'it', catalog: 'it', htmlLang: 'it', label: 'Italiano' },
  { route: 'vi', catalog: 'vi', htmlLang: 'vi', label: 'Tiếng Việt' },
  { route: 'th', catalog: 'th', htmlLang: 'th', label: 'ไทย' },
  { route: 'uk', catalog: 'uk', htmlLang: 'uk', label: 'Українська' },
  { route: 'pl', catalog: 'pl', htmlLang: 'pl', label: 'Polski' },
  { route: 'nl', catalog: 'nl', htmlLang: 'nl', label: 'Nederlands' },
  { route: 'sw', catalog: 'sw', htmlLang: 'sw', label: 'Kiswahili' },
];

const escapeHTML = (value) => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const slugify = (value) => value.toLowerCase().replace(/<[^>]+>/g, '').trim()
  .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

function inline(value) {
  let text = escapeHTML(value);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  const links = [];
  text = text.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, (_m, label, href) => {
    const safe = /^(?:javascript:|data:)/i.test(href) ? '#' : href;
    const token = `\u0000LINK${links.length}\u0000`;
    links.push(`<a href="${escapeHTML(safe)}">${label}</a>`);
    return token;
  });
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  return text.replace(/\u0000LINK(\d+)\u0000/g, (_m, index) => links[Number(index)]);
}

function parseDocument(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const front = {};
  let body = raw;
  if (match) {
    for (const line of match[1].split('\n')) {
      const index = line.indexOf(':');
      if (index > 0) front[line.slice(0, index).trim()] = line.slice(index + 1).trim();
    }
    body = match[2];
  }
  return { front, body };
}

function interpolate(markdown, assetPrefix) {
  const values = {
    '{{TKM_VERSION}}': config.tkmchain.version,
    '{{TKM_RELEASE_URL}}': config.tkmchain.releaseUrl,
    '{{XMRIG_VERSION}}': config.xmrig.version,
    '{{XMRIG_RELEASE_URL}}': config.xmrig.releaseUrl,
    '{{TKM_LINUX_AMD64}}': `${assetPrefix}download/linux-amd64.tar.gz`,
    '{{TKM_LINUX_ARM64}}': `${assetPrefix}download/linux-arm64.tar.gz`,
    '{{TKM_WINDOWS_AMD64}}': `${assetPrefix}download/windows-amd64.zip`,
    '{{TKM_MACOS_AMD64}}': `${assetPrefix}download/darwin-amd64.tar.gz`,
    '{{TKM_MACOS_ARM64}}': `${assetPrefix}download/darwin-arm64.tar.gz`,
    '{{TKM_ANDROID}}': `${assetPrefix}download/app-release.apk`,
    '{{XMRIG_LINUX_X64}}': `${assetPrefix}download/miner/linux-amd64.tar.gz`,
    '{{XMRIG_LINUX_ARM64}}': `${assetPrefix}download/miner/linux-arm64.tar.gz`,
    '{{XMRIG_LINUX_ARMV7}}': `${assetPrefix}download/miner/linux-armv7.tar.gz`,
    '{{XMRIG_WINDOWS_X64}}': `${assetPrefix}download/miner/windows-amd64.zip`,
  };
  return Object.entries(values).reduce((result, [token, value]) => result.replaceAll(token, value), markdown);
}

function renderMarkdown(markdown, pageSlug, catalog = {}) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const out = [];
  let paragraph = [];
  let list = null;
  let code = null;
  let block = 0;
  const content = catalog.content || {};
  const nextKey = () => `content.${pageSlug}.block${++block}`;
  const localized = (text, key) => {
    const candidate = content[key];
    // Keep source links intact unless a catalog supplies a translated link too.
    if (typeof candidate !== 'string' || !candidate.trim()) return text;
    if (/\[[^\]]+\]\([^)]*\)/.test(text) && !/\[[^\]]+\]\([^)]*\)/.test(candidate)) return text;
    return candidate;
  };
  const flushParagraph = () => {
    if (paragraph.length) {
      const key = nextKey();
      out.push(`<p data-i18n-key="${key}">${inline(localized(paragraph.join(' '), key))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.kind}>${list.items.map((item) => `<li data-i18n-key="${item.key}">${inline(localized(item.text, item.key))}</li>`).join('')}</${list.kind}>`);
    list = null;
  };
  for (const line of lines) {
    if (line.startsWith('```')) {
      flushParagraph(); flushList();
      if (code) {
        out.push(`<pre data-i18n-key="${nextKey()}"><code>${escapeHTML(code.join('\n'))}</code></pre>`);
        code = null;
      } else code = [];
      continue;
    }
    if (code) { code.push(line); continue; }
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const level = heading[1].length;
      const key = nextKey();
      const text = localized(heading[2].trim(), key);
      out.push(`<h${level} id="${slugify(text)}" data-i18n-key="${key}">${inline(text)}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const kind = unordered ? 'ul' : 'ol';
      if (!list || list.kind !== kind) { flushList(); list = { kind, items: [] }; }
      list.items.push({ text: (unordered || ordered)[1], key: nextKey() });
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph(); flushList();
      const key = nextKey();
      out.push(`<blockquote data-i18n-key="${key}">${inline(localized(line.slice(2), key))}</blockquote>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph(); flushList();
  if (code) out.push(`<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`);
  return out.join('\n');
}

function pageFile(slug) {
  return slug === 'index' ? 'index.html' : `${slug}.html`;
}

function languageOptions(selected) {
  return [
    '<option value="auto">Auto-detect</option>',
    ...languages.map((language) => `<option value="${language.route}" data-catalog="${language.catalog}"${language.route === selected ? ' selected' : ''}>${language.label}</option>`),
  ].join('');
}

function layout(front, content, { language, assetPrefix, siteRoute }) {
  const title = escapeHTML(front.title || 'TKMChain');
  const description = escapeHTML(front.description || 'TKMChain');
  const kind = escapeHTML(front.kind || 'standard');
  const href = (slug) => `${assetPrefix}${pageFile(slug)}`;
  const direction = language.catalog === 'ar' ? 'rtl' : 'ltr';
  return `<!doctype html>
<html lang="${escapeHTML(language.htmlLang)}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#111a2d">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2312171c'/%3E%3Cpath d='M17 16h30v8H36v24h-8V24H17z' fill='%23f0b90b'/%3E%3Cpath d='M13 48h38v4H13z' fill='%2327b782'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="${assetPrefix}assets/site.css">
</head>
<body data-page="${escapeHTML(front.slug || 'page')}" data-locale="${escapeHTML(language.route)}" data-site-route="${escapeHTML(siteRoute)}" data-catalog="${escapeHTML(language.catalog)}">
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="${href('index')}" aria-label="TKMChain home"><span class="brandmark">TK</span><span>TKMChain</span></a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="${href('privacy')}" data-i18n="nav.privacy">Privacy</a>
        <a href="${href('network')}" data-i18n="nav.network">Network</a>
        <a href="${href('communications')}" data-i18n="nav.communications">Communications</a>
        <a href="${href('developers')}" data-i18n="nav.developers">Developers</a>
        <a href="${href('governance')}" data-i18n="nav.governance">Governance</a>
        <a href="${href('download')}" data-i18n="nav.downloads">Downloads</a>
        <a href="https://block.tkmchain.site" data-i18n="nav.explorer">Explorer</a>
        <a class="nav-cta" href="https://wallet.tkmchain.site" data-i18n="nav.wallet">Open wallet</a>
      </nav>
      <div class="nav-tools">
        <label class="language-picker"><span class="sr-only" data-i18n="language.label">Language</span><select id="language-select" aria-label="Language">${languageOptions(language.route)}</select></label>
        <button class="menu" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
      </div>
    </div>
    <div id="language-status" class="language-status" role="status" aria-live="polite"></div>
  </header>
  <main class="container page-shell kind-${kind}">
    <article class="markdown-content">
${content}
    </article>
  </main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div><div class="brand"><span class="brandmark">TK</span><span>TKMChain</span></div><p data-i18n="footer.tagline">Private programmable money, open infrastructure, and encrypted communications.</p></div>
      <div><h2 data-i18n="footer.use">Use</h2><a href="https://wallet.tkmchain.site" data-i18n="nav.wallet">Wallet</a><a href="https://block.tkmchain.site" data-i18n="nav.explorer">Explorer</a><a href="https://wallet.tkmchain.site/mail/">EmailVM</a></div>
      <div><h2 data-i18n="footer.learn">Learn</h2><a href="${href('privacy')}">Shield3</a><a href="${href('network')}">Tor network</a><a href="${href('smart-accounts')}">Smart accounts</a><a href="${href('governance')}">Governance</a><a href="https://github.com/tkmchain/go-tkmchain">GitHub</a></div>
    </div>
    <div class="container footer-fine"><span>© 2026 TKMChain · ${escapeHTML(config.tkmchain.version)}</span><span>Chain ID 8979 · Finality through block 41913</span></div>
  </footer>
  <script src="${assetPrefix}assets/translator.js" defer></script>
</body>
</html>`;
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await fs.cp(path.join(root, 'download'), path.join(dist, 'download'), { recursive: true });
for (const file of ['CNAME', '.nojekyll']) await fs.copyFile(path.join(root, file), path.join(dist, file));

const catalogCache = new Map();
for (const language of languages) {
  const raw = await fs.readFile(path.join(root, 'assets', 'i18n', `${language.catalog}.json`), 'utf8');
  catalogCache.set(language.catalog, JSON.parse(raw));
}
const files = (await fs.readdir(source)).filter((file) => file.endsWith('.md')).sort();
const documents = [];
for (const file of files) {
  const raw = await fs.readFile(path.join(source, file), 'utf8');
  const parsed = parseDocument(raw);
  documents.push({ file, ...parsed, slug: parsed.front.slug || file.replace(/\.md$/, '') });
}

async function writeTree(language, nested) {
  const assetPrefix = nested ? '../' : '';
  const siteRoute = nested ? language.route : 'root';
  const outputDir = nested ? path.join(dist, language.route) : dist;
  const catalog = catalogCache.get(language.catalog);
  for (const document of documents) {
    const body = interpolate(document.body, assetPrefix);
    const html = layout({ ...document.front, slug: document.slug }, renderMarkdown(body, document.slug, catalog), { language, assetPrefix, siteRoute });
    await fs.writeFile(path.join(outputDir, pageFile(document.slug)), html);
  }
}

// Preserve the existing root URLs as English while adding /en/, /zh/, /ru/…
await writeTree(languages[0], false);
for (const language of languages) {
  await fs.mkdir(path.join(dist, language.route), { recursive: true });
  await writeTree(language, true);
}
console.log(`Built ${documents.length} pages for ${languages.length} language routes plus the English root into ${path.relative(root, dist)}/`);

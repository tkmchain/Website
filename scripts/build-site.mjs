import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'content', 'en');
const dist = path.join(root, 'dist');

const languages = [
  ['auto', 'Auto-detect'], ['zh-CN', '中文'], ['ru', 'Русский'], ['en', 'English'],
  ['ja', '日本語'], ['ko', '한국어'], ['es', 'Español'], ['ar', 'العربية'],
  ['fr', 'Français'], ['de', 'Deutsch'], ['pt', 'Português'], ['hi', 'हिन्दी'],
  ['id', 'Bahasa Indonesia'], ['tr', 'Türkçe'], ['it', 'Italiano'], ['vi', 'Tiếng Việt'],
  ['th', 'ไทย'], ['uk', 'Українська'], ['pl', 'Polski'], ['nl', 'Nederlands'], ['sw', 'Kiswahili'],
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

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const out = [];
  let paragraph = [];
  let list = null;
  let code = null;
  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.kind}>${list.items.map((item) => `<li>${inline(item)}</li>`).join('')}</${list.kind}>`);
    list = null;
  };
  for (const line of lines) {
    if (line.startsWith('```')) {
      flushParagraph(); flushList();
      if (code) {
        out.push(`<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`);
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
      const text = heading[2].trim();
      out.push(`<h${level} id="${slugify(text)}">${inline(text)}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const kind = unordered ? 'ul' : 'ol';
      if (!list || list.kind !== kind) { flushList(); list = { kind, items: [] }; }
      list.items.push((unordered || ordered)[1]);
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph(); flushList();
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph(); flushList();
  if (code) out.push(`<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`);
  return out.join('\n');
}

const languageOptions = languages.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');

function layout(front, content) {
  const title = escapeHTML(front.title || 'TKMChain');
  const description = escapeHTML(front.description || 'TKMChain');
  const kind = escapeHTML(front.kind || 'standard');
  const home = front.slug === 'index';
  const prefix = home ? '' : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#111a2d">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2312171c'/%3E%3Cpath d='M17 16h30v8H36v24h-8V24H17z' fill='%23f0b90b'/%3E%3Cpath d='M13 48h38v4H13z' fill='%2327b782'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="${prefix}assets/site.css">
</head>
<body data-page="${escapeHTML(front.slug || 'page')}">
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="${prefix}index.html" aria-label="TKMChain home"><span class="brandmark">TK</span><span>TKMChain</span></a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="${prefix}index.html#shield3-private-transactions" data-i18n="nav.privacy">Privacy</a>
        <a href="${prefix}index.html#a-more-private-network-path" data-i18n="nav.network">Network</a>
        <a href="${prefix}index.html#money-identity-and-messages" data-i18n="nav.communications">Communications</a>
        <a href="${prefix}smart-accounts.html" data-i18n="nav.accounts">Accounts</a>
        <a href="${prefix}download.html" data-i18n="nav.downloads">Downloads</a>
        <a href="https://block.tkmchain.site" data-i18n="nav.explorer">Explorer</a>
        <a class="nav-cta" href="https://wallet.tkmchain.site" data-i18n="nav.wallet">Open wallet</a>
      </nav>
      <div class="nav-tools">
        <label class="language-picker"><span class="sr-only" data-i18n="language.label">Language</span><select id="language-select" aria-label="Language">${languageOptions}</select></label>
        <button class="menu" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
      </div>
    </div>
    <div id="language-status" class="language-status" role="status" aria-live="polite"></div>
    <div id="google_translate_element" aria-hidden="true"></div>
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
      <div><h2 data-i18n="footer.learn">Learn</h2><a href="${prefix}index.html#shield3-private-transactions">Shield3</a><a href="https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/TOR_INSTALLATION.md">Tor guide</a><a href="https://github.com/tkmchain/go-tkmchain">GitHub</a></div>
    </div>
    <div class="container footer-fine"><span>© 2026 TKMChain</span><span>Chain ID 8979 · Finality through block 41913</span></div>
  </footer>
  <script src="${prefix}assets/translator.js" defer></script>
</body>
</html>`;
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await fs.cp(path.join(root, 'download'), path.join(dist, 'download'), { recursive: true });
for (const file of ['CNAME', '.nojekyll']) {
  await fs.copyFile(path.join(root, file), path.join(dist, file));
}
const files = (await fs.readdir(source)).filter((file) => file.endsWith('.md')).sort();
for (const file of files) {
  const raw = await fs.readFile(path.join(source, file), 'utf8');
  const { front, body } = parseDocument(raw);
  const slug = front.slug || file.replace(/\.md$/, '');
  const output = slug === 'index' ? 'index.html' : `${slug}.html`;
  await fs.writeFile(path.join(dist, output), layout({ ...front, slug }, renderMarkdown(body)));
}
console.log(`Built ${files.length} Markdown pages into ${path.relative(root, dist)}/`);

(() => {
  const select = document.getElementById('language-select');
  const status = document.getElementById('language-status');
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  const body = document.body;
  const currentRoute = body?.dataset.locale || 'en';
  const siteRoute = body?.dataset.siteRoute || 'root';
  const pageSlug = body?.dataset.page || 'index';
  const catalogs = new Map();
  const options = [...(select?.options || [])];
  const supported = options.filter((option) => option.value !== 'auto');
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* private browsing */ } },
  };

  const normalize = (value) => {
    const language = String(value || 'en').trim().replace('_', '-').toLowerCase();
    if (language === 'zh' || language.startsWith('zh-')) return 'zh';
    const exact = supported.find((option) => option.value.toLowerCase() === language);
    if (exact) return exact.value;
    const base = language.split('-')[0];
    return supported.find((option) => option.value.toLowerCase() === base)?.value || 'en';
  };

  const browserLanguage = () => {
    const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
    return normalize(candidates.find(Boolean) || 'en');
  };

  const catalogName = (route) => supported.find((option) => option.value === route)?.dataset.catalog || route;
  const languageName = (route) => supported.find((option) => option.value === route)?.textContent || route;
  const pageFile = pageSlug === 'index' ? 'index.html' : `${pageSlug}.html`;

  const siteRoot = () => siteRoute === 'root'
    ? new URL('./', window.location.href)
    : new URL('../', window.location.href);

  const pageUrl = (route) => new URL(`${route}/${pageFile}`, siteRoot()).href;
  const catalogUrl = (route) => {
    const assetRoot = siteRoute === 'root' ? new URL('assets/', window.location.href) : new URL('../assets/', window.location.href);
    return new URL(`i18n/${encodeURIComponent(catalogName(route))}.json`, assetRoot).href;
  };

  const catalogFor = async (route) => {
    if (!catalogs.has(route)) {
      catalogs.set(route, fetch(catalogUrl(route), { cache: 'no-cache' })
        .then((response) => response.ok ? response.json() : null)
        .catch(() => null));
    }
    return catalogs.get(route);
  };

  const applyCatalog = (catalog) => {
    const ui = catalog?.ui || {};
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const source = element.dataset.i18nSource || element.innerHTML;
      element.dataset.i18nSource = source;
      const value = ui[element.dataset.i18n];
      element.innerHTML = typeof value === 'string' && value.trim() ? value : source;
    });
    document.documentElement.lang = catalog?.locale || body?.dataset.locale || 'en';
    document.documentElement.dir = catalog?.direction || 'ltr';
  };

  const navigateTo = (route) => {
    const effectiveCurrent = siteRoute === 'root' ? 'en' : currentRoute;
    if (route === effectiveCurrent) return false;
    window.location.assign(pageUrl(route));
    return true;
  };

  const translate = async (requested) => {
    const route = requested === 'auto' ? browserLanguage() : normalize(requested);
    storage.set('tkm-language', requested);
    if (navigateTo(route)) return;
    const catalog = await catalogFor(route);
    applyCatalog(catalog);
    if (status) status.textContent = `Language: ${languageName(route)} · ${route}/ page`;
  };

  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
  }

  if (select) {
    const saved = storage.get('tkm-language') || 'auto';
    select.value = [...select.options].some((option) => option.value === saved) ? saved : 'auto';
    select.addEventListener('change', () => { void translate(select.value); });
    void translate(select.value);
  }
})();

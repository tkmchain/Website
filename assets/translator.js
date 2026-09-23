(() => {
  const select = document.getElementById('language-select');
  const status = document.getElementById('language-status');
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  const catalogPath = 'assets/i18n/';
  const supported = [...(select?.options || [])]
    .map((option) => option.value)
    .filter((value) => value !== 'auto');
  const catalogs = new Map();

  const normalize = (value) => {
    const language = String(value || 'en').trim().replace('_', '-');
    const lower = language.toLowerCase();
    if (lower === 'zh' || lower.startsWith('zh-')) return 'zh-CN';
    const exact = supported.find((item) => item.toLowerCase() === lower);
    if (exact) return exact;
    const base = lower.split('-')[0];
    return supported.find((item) => item.toLowerCase() === base) || 'en';
  };

  const browserLanguage = () => {
    const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
    return candidates.find(Boolean) || 'en';
  };

  const catalogFor = async (locale) => {
    if (!catalogs.has(locale)) {
      const request = fetch(`${catalogPath}${encodeURIComponent(locale)}.json`, { cache: 'no-cache' })
        .then((response) => {
          if (!response.ok) throw new Error(`Could not load ${locale} translation catalog`);
          return response.json();
        })
        .catch(() => null);
      catalogs.set(locale, request);
    }
    return catalogs.get(locale);
  };

  const sourceMarkup = (element) => {
    if (!element.dataset.i18nSource) element.dataset.i18nSource = element.innerHTML;
    return element.dataset.i18nSource;
  };

  const applyCatalog = (catalog) => {
    const ui = catalog?.ui || {};
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const source = sourceMarkup(element);
      const value = ui[element.dataset.i18n];
      if (typeof value === 'string' && value.trim()) element.textContent = value;
      else element.innerHTML = source;
    });

    let translated = 0;
    let fallback = 0;
    const content = catalog?.content || {};
    document.querySelectorAll('[data-i18n-key]').forEach((element) => {
      const source = sourceMarkup(element);
      const value = content[element.dataset.i18nKey];
      // Keep blocks containing links in their source markup so labels and URLs stay together.
      if (element.querySelector('a')) {
        element.innerHTML = source;
        fallback += 1;
      } else if (typeof value === 'string' && value.trim()) {
        element.textContent = value;
        translated += 1;
      } else {
        element.innerHTML = source;
        fallback += 1;
      }
    });
    return { translated, fallback };
  };

  const languageName = (locale) => {
    const option = [...(select?.options || [])].find((item) => item.value === locale);
    return option?.textContent || locale;
  };

  const translate = async (requested) => {
    const detected = normalize(browserLanguage());
    const locale = normalize(requested === 'auto' ? detected : requested);
    const catalog = await catalogFor(locale);
    const result = applyCatalog(catalog);
    document.documentElement.lang = locale;
    document.documentElement.dir = catalog?.direction || 'ltr';
    if (status) {
      const selected = requested === 'auto' ? `Auto-detect (${locale})` : languageName(locale);
      const suffix = result.translated ? ` · ${result.translated} sections translated` : ' · source language';
      status.textContent = `Language: ${selected}${suffix}`;
    }
    localStorage.setItem('tkm-language', requested);
  };

  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
  }

  if (select) {
    const saved = localStorage.getItem('tkm-language') || 'auto';
    select.value = [...select.options].some((option) => option.value === saved) ? saved : 'auto';
    select.addEventListener('change', () => { void translate(select.value); });
    void translate(select.value);
  }
})();

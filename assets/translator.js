(() => {
  const select = document.getElementById('language-select');
  const status = document.getElementById('language-status');
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  const translations = {
    en: { 'nav.privacy': 'Privacy', 'nav.network': 'Network', 'nav.communications': 'Communications', 'nav.accounts': 'Accounts', 'nav.downloads': 'Downloads', 'nav.explorer': 'Explorer', 'nav.wallet': 'Open wallet', 'nav.developers': 'Developers', 'nav.governance': 'Governance', 'language.label': 'Language', 'footer.use': 'Use', 'footer.learn': 'Learn', 'footer.tagline': 'Private programmable money, open infrastructure, and encrypted communications.' },
    'zh-CN': { 'nav.privacy': '隐私', 'nav.network': '网络', 'nav.communications': '通信', 'nav.accounts': '账户', 'nav.downloads': '下载', 'nav.explorer': '区块浏览器', 'nav.wallet': '打开钱包', 'nav.developers': '开发者', 'nav.governance': '治理', 'language.label': '语言', 'footer.use': '使用', 'footer.learn': '了解更多', 'footer.tagline': '私密的可编程货币、开放基础设施和加密通信。' },
    ru: { 'nav.privacy': 'Приватность', 'nav.network': 'Сеть', 'nav.communications': 'Связь', 'nav.accounts': 'Аккаунты', 'nav.downloads': 'Загрузки', 'nav.explorer': 'Обозреватель', 'nav.wallet': 'Открыть кошелёк', 'nav.developers': 'Разработчики', 'nav.governance': 'Управление', 'language.label': 'Язык', 'footer.use': 'Использовать', 'footer.learn': 'Узнать больше', 'footer.tagline': 'Приватные программируемые деньги, открытая инфраструктура и зашифрованная связь.' },
    ja: { 'nav.privacy': 'プライバシー', 'nav.network': 'ネットワーク', 'nav.communications': '通信', 'nav.accounts': 'アカウント', 'nav.downloads': 'ダウンロード', 'nav.explorer': 'エクスプローラー', 'nav.wallet': 'ウォレットを開く', 'nav.developers': '開発者', 'nav.governance': 'ガバナンス', 'language.label': '言語', 'footer.use': '使う', 'footer.learn': '詳しく見る', 'footer.tagline': 'プライベートなプログラム可能通貨、オープンな基盤、暗号化通信。' },
    ko: { 'nav.privacy': '프라이버시', 'nav.network': '네트워크', 'nav.communications': '커뮤니케이션', 'nav.accounts': '계정', 'nav.downloads': '다운로드', 'nav.explorer': '익스플로러', 'nav.wallet': '지갑 열기', 'nav.developers': '개발자', 'nav.governance': '거버넌스', 'language.label': '언어', 'footer.use': '사용', 'footer.learn': '더 알아보기', 'footer.tagline': '비공개 프로그래밍 화폐, 개방형 인프라, 암호화 통신.' },
    es: { 'nav.privacy': 'Privacidad', 'nav.network': 'Red', 'nav.communications': 'Comunicaciones', 'nav.accounts': 'Cuentas', 'nav.downloads': 'Descargas', 'nav.explorer': 'Explorador', 'nav.wallet': 'Abrir cartera', 'nav.developers': 'Desarrolladores', 'nav.governance': 'Gobernanza', 'language.label': 'Idioma', 'footer.use': 'Usar', 'footer.learn': 'Más información', 'footer.tagline': 'Dinero programable privado, infraestructura abierta y comunicaciones cifradas.' },
    fr: { 'nav.privacy': 'Confidentialité', 'nav.network': 'Réseau', 'nav.communications': 'Communications', 'nav.accounts': 'Comptes', 'nav.downloads': 'Téléchargements', 'nav.explorer': 'Explorateur', 'nav.wallet': 'Ouvrir le portefeuille', 'nav.developers': 'Développeurs', 'nav.governance': 'Gouvernance', 'language.label': 'Langue', 'footer.use': 'Utiliser', 'footer.learn': 'En savoir plus', 'footer.tagline': 'Monnaie programmable privée, infrastructure ouverte et communications chiffrées.' },
    de: { 'nav.privacy': 'Privatsphäre', 'nav.network': 'Netzwerk', 'nav.communications': 'Kommunikation', 'nav.accounts': 'Konten', 'nav.downloads': 'Downloads', 'nav.explorer': 'Explorer', 'nav.wallet': 'Wallet öffnen', 'nav.developers': 'Entwickler', 'nav.governance': 'Governance', 'language.label': 'Sprache', 'footer.use': 'Verwenden', 'footer.learn': 'Mehr erfahren', 'footer.tagline': 'Private programmierbare Währung, offene Infrastruktur und verschlüsselte Kommunikation.' },
    pt: { 'nav.privacy': 'Privacidade', 'nav.network': 'Rede', 'nav.communications': 'Comunicações', 'nav.accounts': 'Contas', 'nav.downloads': 'Downloads', 'nav.explorer': 'Explorador', 'nav.wallet': 'Abrir carteira', 'nav.developers': 'Desenvolvedores', 'nav.governance': 'Governança', 'language.label': 'Idioma', 'footer.use': 'Usar', 'footer.learn': 'Saiba mais', 'footer.tagline': 'Dinheiro programável privado, infraestrutura aberta e comunicações criptografadas.' },
    ar: { 'nav.privacy': 'الخصوصية', 'nav.network': 'الشبكة', 'nav.communications': 'الاتصالات', 'nav.accounts': 'الحسابات', 'nav.downloads': 'التنزيلات', 'nav.explorer': 'المستكشف', 'nav.wallet': 'فتح المحفظة', 'nav.developers': 'المطورون', 'nav.governance': 'الحوكمة', 'language.label': 'اللغة', 'footer.use': 'استخدام', 'footer.learn': 'تعرّف أكثر', 'footer.tagline': 'أموال خاصة قابلة للبرمجة، وبنية مفتوحة، واتصالات مشفرة.' },
  };

  const applyLocalLabels = (language) => {
    const key = language.toLowerCase().startsWith('zh') ? 'zh-CN' : language;
    const values = translations[key] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = values[element.dataset.i18n];
      if (value) element.textContent = value;
    });
  };

  const googleLanguage = (language) => language === 'zh-CN' ? 'zh-CN' : language.split('-')[0];
  const loadGoogle = () => {
    if (window.google?.translate?.TranslateElement) return window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
    window.googleTranslateElementInit = () => {
      window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
      window.setTimeout(() => translate(select?.value || 'auto'), 250);
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  };

  const translate = (language) => {
    const selected = language === 'auto' ? (navigator.language || 'en') : language;
    const normalized = selected.toLowerCase().startsWith('zh') ? 'zh-CN' : selected.split('-')[0];
    const google = document.querySelector('.goog-te-combo');
    document.documentElement.lang = normalized;
    applyLocalLabels(language === 'auto' ? normalized : language);
    if (google) {
      google.value = language === 'en' || (language === 'auto' && normalized === 'en') ? 'en' : googleLanguage(language === 'auto' ? normalized : language);
      google.dispatchEvent(new Event('change'));
    }
    if (status) status.textContent = language === 'auto' ? `Language: ${selected}` : `Language: ${select.options[select.selectedIndex].text}`;
    localStorage.setItem('tkm-language', language);
  };

  if (menu && links) menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  if (select) {
    const saved = localStorage.getItem('tkm-language') || 'auto';
    select.value = [...select.options].some((option) => option.value === saved) ? saved : 'auto';
    select.addEventListener('change', () => translate(select.value));
    loadGoogle();
    window.setTimeout(() => translate(select.value), 700);
    window.setInterval(() => { if (select.value !== 'en' && !document.querySelector('.goog-te-combo')) loadGoogle(); }, 2000);
  }
})();

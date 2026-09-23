# TKMChain website

The website is authored in Markdown and published as generated HTML on GitHub Pages.

## Edit content

- `content/en/index.md` — landing page
- `content/en/smart-accounts.md` — smart-account guide
- `content/en/download.md` — downloads and node setup
- `content/en/privacy.md` — Shield3 privacy
- `content/en/network.md` — Tor-only networking
- `content/en/communications.md` — Phone and EmailVM
- `content/en/developers.md` — developer tools
- `content/en/governance.md` — governance and finality
- `site.config.json` — current TKMChain and XMRig release versions and release URLs

The download page uses direct assets from the configured GitHub releases. It does not proxy or duplicate release archives through GitHub Pages.

Keep page metadata in the front matter at the top of each file. Links, headings, lists, and fenced code blocks are rendered by the dependency-free builder.

## Build locally

```sh
node scripts/build-site.mjs
```

The generated site is written to `dist/`. It includes the legacy root English URLs plus localized trees such as `dist/en/`, `dist/zh/`, and `dist/ru/`. It is intentionally ignored by Git because the Pages workflow builds it on every deployment.

## Languages

The header includes automatic language detection and twenty selectable languages. The build creates a complete page tree for every route (`/en/`, `/zh/`, `/ru/`, and the other language routes), so page headings and body content are translated before delivery rather than translated only in the browser. Translation data lives in the versioned JSON catalogs in `assets/i18n/`; missing blocks safely fall back to the English source. English Markdown in `content/en/` remains canonical, while reviewed translations can be added incrementally to any catalog.

## GitHub Pages

`.github/workflows/pages.yml` builds the Markdown source, validates the generated HTML and JavaScript, and deploys only `dist/`. This keeps old hand-authored HTML out of the published source path and makes every page reproducible from the Markdown files.

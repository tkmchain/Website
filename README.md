# TKMChain website

The website is authored in Markdown and published as generated HTML on GitHub Pages.

## Edit content

- `content/en/index.md` — landing page
- `content/en/smart-accounts.md` — smart-account guide
- `content/en/download.md` — downloads and node setup

Keep page metadata in the front matter at the top of each file. Links, headings, lists, and fenced code blocks are rendered by the dependency-free builder.

## Build locally

```sh
node scripts/build-site.mjs
```

The generated site is written to `dist/`. It is intentionally ignored by Git because the Pages workflow builds it on every deployment.

## Languages

The header includes automatic language detection and twenty selectable languages. The selector uses Google’s client-side translation for the Markdown-rendered page and keeps a local translation for the navigation and footer labels. The canonical content remains English Markdown; adding `content/<locale>/` pages is supported when a reviewed human translation is ready.

## GitHub Pages

`.github/workflows/pages.yml` builds the Markdown source, validates the generated HTML and JavaScript, and deploys only `dist/`. This keeps old hand-authored HTML out of the published source path and makes every page reproducible from the Markdown files.

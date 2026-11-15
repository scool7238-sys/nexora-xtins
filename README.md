# NEXORA XTINS — Official Website

Official product and download website for **NEXORA XTINS**, a Windows desktop browser built around privacy, control, and customization.

## Configuration

All download links, external links, and configurable answers live in a single file:

- `src/config/siteConfig.ts`
  - `XTINS_DOWNLOAD_URL`: Replace `"REPLACE_WITH_OFFICIAL_DOWNLOAD_URL"` with the official Windows installer URL. Every Download CTA across the navigation bar, hero, feature cards, experience sequence, download section, final CTA, and footer uses this single value.
  - `SITE_CONFIG.githubUrl`, `SITE_CONFIG.contactUrl`, `SITE_CONFIG.termsUrl`: Replace placeholder values with official URLs.
  - `SITE_CONFIG.pricingAnswer`: Replace with the official licensing/pricing text for the FAQ.

## Product Screenshots

All 7 interface slots in `SCREENSHOT_SLOTS` inside `src/config/siteConfig.ts` are wired to the real NEXORA XTINS captures in `public/assets/aistudio/` using relative paths for GitHub Pages compatibility. You can swap or add additional captures by placing images in `public/` and updating `SCREENSHOT_SLOTS` (setting `imageSrc: null` on a slot displays a labeled placeholder).

## Development & Static Build

```bash
npm install
npm run dev
npm run build
```

## GitHub Pages Deployment

`vite.config.ts` is configured with `base: './'` so all compiled assets resolve cleanly under repository subpaths such as:

`https://USERNAME.github.io/NEXORA-XTINS-WEBSITE/`

Deploy the generated `dist/` directory via GitHub Actions or your GitHub Pages branch.

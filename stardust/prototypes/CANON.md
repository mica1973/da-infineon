# Infineon replica — shared canon

Authored with the first archetype (`index`, landing). Every later archetype prototype links
`canon.css` (+ `canon.js`) first, then its own `<slug>.css`, and copies the header/footer markup
from `index-proposed.html` (German pages: same markup, German strings/hrefs from the /de capture).

## Files
- `canon.css` — tokens, fonts, base type, icon glyphs, buttons, container model, header, footer,
  digital-assistant launcher, header menu layer (generated icon-glyph block at the end).
- `canon.js` — header behaviour only (main-nav item toggles its `.mega` panel).
- `assets/fonts/` — Source Sans 3 400/600/900 (OFL, self-hosted) + `infineon-icons.woff2`.
- `assets/icons/` — logo.svg, Infineon_Logo_Inverted.svg (footer), tiktok.svg, online-event.svg,
  da-chat.svg (Ask-AI launcher), app-*.svg (white 48px application icons).

## Tokens (`:root`)
`--ifx-canvas #fff`, `--ifx-ink #1d1d1d`, `--ifx-teal #0a8276`, `--ifx-teal-deep #08665c`,
`--ifx-teal-tint #31968c`, `--ifx-stone-text #575352`, `--ifx-stone-mid #8d8786`,
`--ifx-border #bfbbbb`, `--ifx-rule #ccc`, `--ifx-surface-muted #eeeded`, `--ifx-surface-band #f7f7f7`,
`--ifx-font` (Source Sans 3 first, Arial-class fallbacks), `--ifx-icon-font`, `--ifx-radius-sm 4px`,
`--ifx-radius-btn 1px`, `--ifx-card-ring`, `--ifx-shell 1400px`, `--ifx-gutter` (76px; 16px ≤991px),
`--ifx-header-h` (67.2px; 61px ≤991px). Breakpoint: one step at `max-width: 991px` (gated at 1440/360).

## Classes
- Container: `.ifx-shell` (1400 max, centred, no padding), `.ifx-fixed` (1400 max + gutters → 1248
  content at 1440), bands `.ifx-band-grey` (#f7f7f7), `.ifx-band-teal`.
- Type: `.eyebrow` / `.eyebrow--line` (14/24 600, 3.2px tracking, uppercase, 48px rule),
  `.h-display` 56/64, `.h-44`, `.h-36`, `.h-28`, `.h-20` (mobile steps built in).
- Links/buttons: `.link-arrow` (teal 18/26 600 + `icon-arrow-right`), `.btn` + `.btn--primary`
  (teal, 1px radius), `.btn--white`, `.btn--outline`.
- Icons: `<span class="icon icon-NAME">` (infineon-icons glyphs; codepoints lifted from
  clientlib-head), `.ico ico-*` for menu/product glyphs, `.icon-online-event` (svg background).
- Header: `header.site-header > .site-header__bar` with `__logo`, `__nav`, `__search`, `__tools`
  (`__tool`, `__tool--cart`, `__login`, `__login-text`, `__login-toggle`), `__mobile`
  (`.m-search`, `.m-cart`, `.m-user`, `.m-menu`); then `.site-header__menus` holding five hidden
  `.mega` panels (`#mega-0..4`, one per nav item) and `.site-header__aux` (account, cart, language,
  currency, mobile-search layers) — generated verbatim from the captured nav by
  `stardust/.work/index/gen-header.cjs`; the content-diff header root inventories this hidden layer,
  so it must be present on every page (German pages: regenerate from the /de capture).
- Footer: `footer.site-footer > .ifx-fixed > nav.site-footer__nav` (`__logo`, 4× `ul.site-footer__list`
  with `p.site-footer__title`), `.site-footer__legal` (`__legal-left` with `ul.links` + dividers +
  `.site-footer__copy`, `__legal-right` with `ul.site-footer__social`).
- Fixed widget: `.da-launcher` (`__tip`, `__btn`) — the "Ask AI" launcher present on every live page.

## Content-root convention (gate `--main`)
Live AEM pages put `<header>` inside `<main>`, so the content root is a list of the page's
top-level containers, mirrored by class on the prototype:

```
--main ".root > .cmp-container > .ifxcontainer.ifx-fluid, #pzn-home-teaser-row-cards-offer, .root > .cmp-container > .ifxcontainer.ifx-extra-fluid, .offrampcareer"
```

Prototype skeleton: `<main class="root"><div class="cmp-container">` + one wrapper per live
top-level column carrying the same class (`ifxcontainer ifx-fluid|ifx-extra-fluid|ifx-fixed`,
component classes such as `offrampcareer`). Each comma-separated selector resolves to ONE element
(first match) on each side, so give every live top-level column its own selector. The header and
footer roots are compared automatically (`header`, `footer`).

## Lifted facts worth reusing
- Section rhythm: `marginTop80/marginBottom80` = 80px desktop, 32px ≤991px; band padding 80/76
  (64/16 mobile); product band 48/76 (48/16).
- Cards: 4px `#bfbbbb` left border; story images clip `polygon(0 0,100% 0,100% 50%,100% 95%,28% 84%,0 93%)`.
- Live gate captures the hero stage after its 15 s auto-advance can fire — see progress.json captureState.

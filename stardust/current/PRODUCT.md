<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-18T02:30:00Z
mode: prep (descriptive current state)
sources: stardust/current/pages/*.json (60 live Playwright captures), stardust/current/_computed-styles.json, stardust/current/_computed-styles-2.json, stardust/current/_vision-check.json
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engineers, buyers and decision makers in automotive, industrial, consumer and data-center electronics; job seekers; investors, press and partners. The in-scope pages are the English home page (`/`) and the German locale (`/de/...`): the German home, company and support pages, and 43 "Our stories" editorial pages.

_provenance: inferred — basis: navigation labels (Products, Applications, Design Resources, Support & Training, About), page titles and CTA labels captured on the home page and the /de pages._

## Product Purpose

Corporate and product-marketing site of Infineon Technologies AG, a semiconductor manufacturer ("Semiconductor & System Solutions"). The home page presents product news, events, press releases and technology stories; the German "Our stories" section carries long-form articles on decarbonization, digitalization, mobility, AI and IoT.

## Positioning

"We shape key markets with advanced semiconductor solutions" (home hero, verbatim). Story pages frame the company around energy, mobility and IoT ("Immerse yourself in our world of energy, mobility and IoT").

## Capabilities and Constraints

- AEM-based site (components such as `mainnavigation`, `articlehero`, `teaserrowcards`, `inpagenavigation`, `footerstandard`), hydrated client-side; myInfineon login popups, OneTrust consent, video players, accordions, carousels, a Google map on the contact page and a filterable FAQ.
- Locale switcher (English, 中文, 日本語, Deutsch). Only `/` (English) and `/de/...` pages are in scope.
- `/de/gated` redirects to the site's 404 page (`/errorpages/404-page-not-found`) on the source; it has no content of its own.
- `/de/config` is an internal configuration page (settings tables), captured as served.

## Brand Commitments

- Register: `brand` (marketing / corporate site).
- Personality observed: engineered, calm, precise — white canvas, near-black text (#1d1d1d), a single teal brand colour (#0a8276) for links, buttons and bands, Source Sans 3 throughout, small 4px radii, diagonal-cut image shapes on company pages.
- Anti-references observed: no gradients-as-decoration, no playful illustration outside the utility pages, no dark theme.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 60 page records and rendered DOMs.
- `stardust/current/assets/screenshots/<slug>.png` — full-page captures at 1440.
- `stardust/current/_computed-styles.json`, `_computed-styles-2.json` — computed-style census at 1440 and 360.
- `stardust/current/_components.tsv` — AEM component inventory per page.
- `stardust/current/_vision-check.json` — per-page vision verdicts and templates.
- `stardust/current/assets/css/`, `assets/fonts/` — stylesheets and font files served to the browser.

## Product Principles

_provenance: inferred — basis: the consistent structure across the 43 story pages and the home page._

- Content is organised by market theme (energy, mobility, IoT, AI), each story ending with related stories and a newsletter offer.
- Every page shares one header (mega navigation, locale switch, myInfineon login) and one footer.

## Accessibility & Inclusion

Not audited in this extraction. Observed: visible focus styles not recorded; images carry alt text inconsistently.

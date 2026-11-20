# Dynamic features — www.infineon.com (replica, 60 pages)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (70 draft rows, 7 archetypes + home,
reach over the 60 captured pages). Hands-off run: every non-`self` row ships its interim tier and is named
in the decision batch; nothing here is `decided-out` by assumption.

## Listings contract
No index-backed listing blocks. Every card set the detector flagged (L rows) is a curated, editor-picked
set on its page (carousels, teaser grids, icon collections), not a query result: the cards ship as authored
block rows (document-first). Pages emit `title`, `description`, `og:image` metadata for the search index
(`helix-query.yaml`, row 14).

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | martech-stack | Tag stack: GTM, Adobe Analytics/ECID, Adobe Target, session replay, ad/retargeting pixels (LinkedIn, Reddit, Spotify, TikTok, Facebook, Google), Ahrefs, Eloqua (img.en25.com), VoC survey badge | T | 60/60 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner enables each route in `stardust/martech-contract.json` | draft rows 1–7, 52–66; `stardust/martech/` |
| 2 | consent-onetrust | Consent: OneTrust CMP (+ its first-party template/consent JSON under /etc/clientlibs/onetrustrow) | T | 60/60 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner enables `consent.cmp`, confirms the domain script id for the new host | draft rows 19–21, 53, 67 (srcless iframe = CMP/tag frame) |
| 3 | settings-globals | AEM runtime globals (dataLayer, Granite, CQ) | A | 60/60 | static-snapshot | runtime | self | interim | read-settings | reason: author-runtime objects with no consumer on migrated pages; dataLayer is re-created by the martech scaffold when tags are enabled. Unfreeze: owner enables tags | draft rows 8–10 |
| 4 | rum | Operational telemetry (rum.hlx.page) | T | 60/60 | rebuild-native | runtime | self | delivered-by-platform | — | none — native to the target platform | draft row 52 |
| 5 | s7-video | Dynamic Media (Scene7) video viewer + share/email/embed dialogs | V | 2/7 archetypes (story pages) | embed-passthrough | content | self | planned | media-as-url | — | draft rows 11–14, 46–48, 68 |
| 6 | tabs | Tab buttons (client-rendered tab set) | CR | 1/7 | rebuild-native | block | self | planned | settled-dom-snapshot | — | draft row 15 |
| 7 | article-event-cards | Article / event / document card rails (React/JS-fed: /dataApi/*.ifxarticles, *.ifxeventscard, *.marketingcarousel, *.product-document) | CR/D | 4/60 | static-snapshot | block | self | planned | settled-dom-snapshot | reason: settled DOM ships as authored rows; unfreeze when an owner-run feed replaces the source dataApi | draft rows 16–18, 25–27, 29 |
| 8 | ui-dictionary | UI string dictionaries (de/en.json, cq i18n dict) | D | 58/60 | static-snapshot | runtime | self | planned | — | reason: labels baked into block JS/placeholders | draft rows 23, 24, 28 |
| 9 | geolocation | Geolocation-based locale hint (/content/ifx/en.geolocation.json) | D | 60/60 | static-snapshot | runtime | needs-business-decision | interim | — | undecided — revisit at rollout (locale scope, row 12) | draft row 22 |
| 10 | csrf | Author CSRF token fetch | D | 1/60 | static-snapshot | — | self | interim | — | reason: AEM author-session artefact, no consumer on migrated pages | draft row 30 |
| 11 | modals-chrome | Header/menu disclosures and modal triggers (aria-haspopup) | M | 60/60 | rebuild-native | runtime | self | planned | chrome-interaction / modal-loader | — (header contract `stardust/chrome/`) | draft rows 44–45, 49–50 |
| 12 | locales | Locale variants (x-default, en, ja, zh) | I18N | 60/60 | rebuild-native | content | needs-business-decision | interim | locale-tree | which locales move; interim: plan scope only (/ and /de), hreflang alternates point at the source | draft row 32 |
| 13 | forms-pardot | Form backend Salesforce/Pardot (script signal; no form element on the archetypes) | F | 0 forms seen | rebuild-native | widget | needs-backend | interim | forms | backend decision if a form page is added; interim: none to rebuild in scope | draft row 31 |
| 14 | site-search | Header search (hosted search service) | S | 60/60 | index-backed | widget | self | planned | search-index-backed | parity note: corpus = the 60 migrated pages | draft row 51 |
| 15 | curated-card-sets | Curated card sets / carousels (11 listing candidates) | L | 7/7 | static-snapshot | block | self | planned | — | reason: editor-curated, authored rows | draft rows 33–43 |
| 16 | account | Sign-in / myInfineon account links | X | 60/60 | embed-passthrough | widget | needs-backend | interim | — | links kept to the source's account host; owner decides the backend | draft row 69 |
| 17 | commerce | Cart / shop signals (cart: true, no prices) | X | 60/60 | embed-passthrough | widget | needs-backend | interim | — | cart link kept to the source shop; owner decides | draft row 70 |

## Decision batch
One message to the owner (hands-off: each is a named assumption, interim tier ships):
- **Tags and consent** (rows 1–2): every route and the CMP ship disabled in `stardust/martech-contract.json`; enable per `stardust/martech-handoff.md`.
- **Locales** (rows 9, 12): only the planned pages move; other locale alternates keep pointing at the source.
- **Backends** (rows 13, 16, 17): forms, account and cart stay on the source's systems via links.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement yet | — |

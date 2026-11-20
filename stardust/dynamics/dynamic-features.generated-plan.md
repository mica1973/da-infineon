<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-18T05:54:16.381Z · input stardust/current/_dynamics.json (7 pages, 73 findings) · target probe https://main--938eead7--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-cookies-data-onetrust-io | A | unknown third-party host cookies-data.onetrust.io | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-pixels-spotify-com | A | unknown third-party host pixels.spotify.com | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-pixel-config-reddit-com | A | unknown third-party host pixel-config.reddit.com | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-alb-reddit-com | A | unknown third-party host alb.reddit.com | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-experimentation-adobe-target | A | experimentation: Adobe Target | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which experiments move to the new host |  |
| 7 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 7/7 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 7/7 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 9 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 7/7 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 10 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 7/7 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 11 | cr-client-rendered-slot-s7container | CR | client-rendered slot s7container | 2/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-s7emaildialog | CR | client-rendered slot s7emaildialog | 2/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-client-rendered-slot-s7embeddialog | CR | client-rendered slot s7embeddialog | 2/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | cr-client-rendered-slot-s7linkdialog | CR | client-rendered slot s7linkdialog | 2/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-js-tab-buttons-tab-buttons-active | CR | client-rendered slot js-tab-buttons tab-buttons active | 1/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-articles-card-ifx-ifx-articles-card- | CR | client-rendered slot articles_card_ifx ifx_articles_card add-gaps | 1/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-events-card-ifx-ifx-events-card-add- | CR | client-rendered slot events_card_ifx ifx_events_card add-gaps | 1/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-client-rendered-slot-documents-ifx-react-mounted | CR | client-rendered slot documents_ifx _react_mounted | 1/7 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 19 | d-first-party-data-file-get-etc-clientlibs-onetrustrow-onetr | D | first-party data file GET /etc/clientlibs/onetrustrow/oneTrust-production/scripttemplates/202610.1.0/assets/otCenterRounded.json | 7/7 (reach 60/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 20 | d-first-party-data-file-get-etc-clientlibs-onetrustrow-onetr | D | first-party data file GET /etc/clientlibs/onetrustrow/oneTrust-production/consent/{uuid}/{uuid}.json | 7/7 (reach 60/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 21 | d-first-party-data-file-get-etc-clientlibs-onetrustrow-onetr | D | first-party data file GET /etc/clientlibs/onetrustrow/oneTrust-production/consent/{uuid}/{uuid}/en.json | 7/7 (reach 60/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 22 | d-first-party-data-file-get-content-ifx-en-geolocation-json | D | first-party data file GET /content/ifx/en.geolocation.json | 7/7 (reach 60/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 23 | d-first-party-data-file-get-etc-clientlibs-ifx-clientlibs-cl | D | first-party data file GET /etc.clientlibs/ifx/clientlibs/clientlib-base/resources/dictionary/de.json | 6/7 (reach 58/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 24 | d-first-party-data-file-get-etc-clientlibs-ifx-clientlibs-cl | D | first-party data file GET /etc.clientlibs/ifx/clientlibs/clientlib-base/resources/dictionary/en.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 25 | d-first-party-data-file-get-dataapi-en-marketingcarousel-jso | D | first-party data file GET /dataApi/en.marketingcarousel.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 26 | d-first-party-data-file-get-dataapi-en-ifxarticles-json | D | first-party data file GET /dataApi/en.ifxarticles.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 27 | d-first-party-data-file-get-dataapi-de-about-ifxeventscard-j | D | first-party data file GET /dataApi/de/about.ifxeventscard.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 28 | d-first-party-data-file-get-libs-cq-i18n-dict-de-json | D | first-party data file GET /libs/cq/i18n/dict.de.json | 1/7 (reach 2/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 29 | d-first-party-data-file-get-dataapi-de-package-overview-prod | D | first-party data file GET /dataApi/de/package-overview.product-document.de.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 30 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 1/7 (reach 1/60) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 31 | f-form-backend-salesforce-pardot | F | form backend: Salesforce / Pardot | 7/7 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 32 | i18n-locale-variants-x-default-en-ja-zh | I18N | locale variants x-default,en,ja,zh | 7/7 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.infineon.com/de" |
| 33 | l-listing-candidate-banner-left-side-3-cards | L | listing candidate banner-left-side (3 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 34 | l-listing-candidate-aem-grid-aem-grid-12-5-cards | L | listing candidate aem-Grid aem-Grid--12 (5 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 35 | l-listing-candidate-swiper-wrapper-cmp-productcarousel-track | L | listing candidate swiper-wrapper cmp-productcarousel__track (9 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 36 | l-listing-candidate-image-container-teasercard-6-cards | L | listing candidate image-container teaserCard (6 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 37 | l-listing-candidate-swiper-slide-all-swiper-wrapper-7-cards | L | listing candidate swiper-slide-all swiper-wrapper (7 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 38 | l-listing-candidate-selected-icon-iconcollection-row-6-cards | L | listing candidate selected-icon iconcollection-row (6 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 39 | l-listing-candidate-aem-grid-aem-grid-12-6-cards | L | listing candidate aem-Grid aem-Grid--12 (6 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 40 | l-listing-candidate-selected-icon-col-lg-12-8-cards | L | listing candidate selected-icon col-lg-12 (8 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 41 | l-listing-candidate-selected-icon-col-lg-12-6-cards | L | listing candidate selected-icon col-lg-12 (6 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 42 | l-listing-candidate-selected-icon-col-lg-12-7-cards | L | listing candidate selected-icon col-lg-12 (7 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 43 | l-listing-candidate-cmp-container-tablet-margin0-4-cards | L | listing candidate cmp-container tablet-margin0 (4 cards) | 1/7 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 44 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 3/7 (reach 242/60) | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "$ US-Dollar" |
| 45 | m-modal-trigger-aria-haspopup-menu-content-button-content | M | modal trigger aria-haspopup → menu:content/button:content | 2/7 (reach 242/60) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "$ US-Dollar" |
| 46 | m-modal-trigger-s7dialogaddemailbutton-button-content | M | modal trigger s7dialogaddemailbutton → button:content | 2/7 | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "Add Another Email Address" |
| 47 | m-modal-trigger-s7dialogcancelbutton-chrome-only-button-cont | M | modal trigger s7dialogcancelbutton (chrome only) → button:content | 2/7 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 48 | m-modal-trigger-s7dialogactionbutton-chrome-only-button-cont | M | modal trigger s7dialogactionbutton (chrome only) → button:content | 2/7 | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Send Email" |
| 49 | m-modal-trigger-aria-haspopup-chrome-only-div-content-button | M | modal trigger aria-haspopup (chrome only) → div:content/button:content | 1/7 (reach 242/60) | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "$ U. S. Dollar (USD)" |
| 50 | m-modal-trigger-aria-haspopup-button-content | M | modal trigger aria-haspopup → button:content | 1/7 (reach 242/60) | rebuild-native | runtime | self | delivered-by-capture | modal-loader | none | output already carries "$ US-Dollar" |
| 51 | s-search-hosted-search-service | S | search: hosted search service | 7/7 | index-backed | widget | self | pending | search-index-backed | replace the hosted search service? |  |
| 52 | t-unknown-third-party-host-rum-hlx-page | T | unknown third-party host rum.hlx.page | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-consent-onetrust | T | consent: OneTrust | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 54 | t-unknown-third-party-host-patches-ahrefs-com | T | unknown third-party host patches.ahrefs.com | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-feedback-survey-voc-badge | T | feedback: survey / VoC badge | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | t-unknown-third-party-host-img-en25-com | T | unknown third-party host img.en25.com | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 58 | t-unknown-third-party-host-pixel-byspotify-com | T | unknown third-party host pixel.byspotify.com | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-unknown-third-party-host-www-redditstatic-com | T | unknown third-party host www.redditstatic.com | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 60 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 61 | t-analytics-session-replay | T | analytics: session replay | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 62 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 63 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 7/7 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 64 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 7/7 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 65 | t-unknown-third-party-host-analytics-ipv6-tiktokw-us | T | unknown third-party host analytics-ipv6.tiktokw.us | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 66 | t-unknown-third-party-host-px4-ads-linkedin-com | T | unknown third-party host px4.ads.linkedin.com | 7/7 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 67 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 7/7 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 68 | v-player-element-div | V | player element <div> | 2/7 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |
| 69 | x-sign-in-account-links | X | sign-in / account links | 7/7 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 70 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 7/7 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 71 | chrome-menu | M | header menu: menu, Produkte, Applikationen, Designressourcen, Support & Training, Über uns, English 中文 日本語 Deutsch, Currency (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 72 | chrome-cart | X | header cart: Cart (chrome only) | 1/1 | rebuild-native | widget | needs-backend | pending | chrome-interaction | the commerce backend on the new host (the drawer ships per the contract either way) |  |
| 73 | chrome-drawer | M | header drawer: Toggle navigation (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 28 row(s) — read-settings, settled-dom-snapshot, sheet-sync, chrome-interaction, search-index-backed, media-as-url.
- **One owner decision batch:** 34 row(s) — inspect the XHR, add a vendor row · which experiments move to the new host · production backend (vendor form id + field mapping) · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 9 row(s) — no work.
- **Host-bound on the target:** 12 of 9 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 16
- **data** — 12
- **listings** — 11
- **interactive** — 10
- **detect** — 9
- **capture** — 8
- **register** — 2
- **forms** — 1
- **locale wave** — 1
- **search** — 1
- **embeds** — 1
- **media** — 1

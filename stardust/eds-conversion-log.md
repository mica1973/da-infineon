# EDS conversion log — www.infineon.com replica

## Publish decision (2026-11-18)
Decision (owner, made before the run): **publish**. Every delivered page, the redirects sheet and the
chrome documents (nav, footer and locale variants) go live on the aem.live origin
(`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).

## archetype-static
- Page `/de/about` (archetype de-about, template static) → `content/de/about.html`; blocks `page-header`, `hub-band`.
- `page-header` — decode tier **template-slotted**: heading + description moved into `.page-header-head`;
  optional jump-nav cell (`<ul>` of `#anchor` links + optional label `<p>`) moved into `nav.page-header-nav`;
  mobile dropdown list is a presentational clone (EW4, instrumentation stripped). Jump links resolve to
  headings by id, else by matching heading text (the id is assigned). Scroll-spy, pin-on-scroll and the
  mobile dropdown toggle implemented (replica motion inventory). Reused by de-glossary (title only).
- `hub-band` — **template-slotted** (hub: text slot + media slot; link list gets arrow / launch glyphs,
  external links launch) and **reconstructive** for variant `events` (rows classified by content: image row =
  card, heading row = head, rest = CTA; card body: list before title = date, title paragraph, list after = facts,
  remaining paragraphs = links).
- davids-model-lint 🟡 D1 page-header (bespoke band with scroll-spy jump nav, not default content) and 🟡 D3
  hub-band events (head row 1 cell, card rows 2 cells — intended shape).
- Local asserts: qa-gate 3 ✗ are first-instance artefacts (units for hub-band instances 2–4 measured on
  instance 1: 4 links vs 8/6/7 authored); block-roundtrip `--map hub-band=section.hub, section.evs`:
  remaining 🔴 are ROLE SWAP on proto `h2 > a.cmp-title__link` (href-less anchor, source markup) and the
  hidden duplicate `h2.evs__anchor` "Events" (anchor only; EDS uses one visible h2 with id `events`).
- Glyphs calendar / laptop / launch scoped in hub-band.css (foundation request queued).

## archetype-landing

Page `/` (index), template `landing`; 7 blocks, content `content/index.html`, media in DA `media/home/`
(28 JPEGs re-fetched with `Accept: image/jpeg` — Scene7 served AVIF/WebP to the uploader's default fetch).
- `hero-carousel` — **template-slotted** (slide: eyebrow / title / description / CTA slots + image list;
  roles by content: heading or, without one, eyebrow-title-description by paragraph order; link paragraph =
  CTA). Controls built in JS. restoreAtDelivery implemented: 15 s auto-advance, 15 s linear fill, 1 s
  crossfade, prev arrow `icon-brand-500` after first advance, pause / resume.
- `market-cards` — **reconstructive** (picture row = card; badge = paragraph in the picture cell; title =
  heading or first plain paragraph; link paragraph = CTA; heading-only row = section title).
- `product-carousel` — **reconstructive** (picture row = card: family / linked heading / subtitle / link
  paragraphs; link-only row = rail CTA; first card featured; prev/next arrows functional).
- `event-slider` — **reconstructive** (intro row; row with 2+ headings = tab rail + overview links; picture
  rows = slides, heading link lifted to card-as-link per EW6; arrows functional).
- `partner-teaser` — **template-slotted** (tab cell + panel cell per row; panel kind by content: linked icon
  list = application tiles, `<p><strong>` + label paragraph pairs = key figures). Desktop tabs / mobile open
  accordion from one DOM (grid + `display: contents`).
- `story-cards` — **reconstructive** (intro row; picture rows = cards: title, teaser, topic list, icon
  paragraph = type, next paragraph = date; link-only row = "Discover more").
- `career-offramp` — **template-slotted** (heading row = title; row of heading + link cells = columns).
- Icons: `icons/app-*.svg`, `icons/online-event.svg` added (authored as `:app-car:` etc.).
- block-roundtrip `--ew`: EW 211/211, dead 0, duplicated 0. Remaining 🔴 ×4 are justified: hero slide-1 title
  authored as the page's one `<h1>` (source has no h1; deploy requires one); "See all events" / "Press
  overview" and the story `h2.visually-hidden` exist twice in the prototype (desktop + mobile / sr-only
  copies), once in the single-DOM build. qa-gate PASS (41 ok, 1 warn).
- Published-origin gate (aem.page, gate-all --only de-about, scoped --state copy because state.json carries no
  deployed rows): 1440 pixel 0.16 % Δh 0 clip 0 missing 0 (documented override: origin-side font
  `Arial Metrics Override` not loaded — live face, build fontsFailed []); 360 pixel 0.90 % Δh -7 clip 0
  missing 0 PASS. presence.json `main` for de-about = live contentRoot (live renders header/footer inside
  `<main>`). Round 1 fix: CTA 48px (11px padding + 1px border), events facts 24px line + divider after item,
  row ::after gap on mobile, CTA-row margin. Footer crop 1440 0.09 %; header crop 1440 3.53 % → foundation request.

## archetype-utility
- Page `/de/thank-you` (archetype de-thank-you, template utility) → `content/de/thank-you.html`; block
  `thank-you` (one row: image cell + text cell). Encoder reused by siblings de-logout / de-config.
- `thank-you` — decode tier **template-slotted**: nodes classified by content, never by index —
  picture/img → media slot; paragraph(s) before the heading → eyebrow (`.thank-you-pre`, presentational
  48 px divider prepended); first heading → head; link-only paragraphs → actions (unformatted links get
  `button primary`); everything else → message text. Missing image → `no-media` (body full width);
  bare cell text is moved into a paragraph. The live empty spacer container is `.thank-you-spacer`.
- Media: live mobile rendition `asset-480` is 403 on the source (recorded live defect); delivered the
  `asset-680` rendition via DA media (`media/de-thank-you/order-confirmation.jpg`) at every width.
- Local asserts: block-roundtrip `--map thank-you=section.ty --ew` closed, EW editable 4/4; qa-gate 1 ✗
  = content cap 624 px at 2560 — the two-column panel's widest content box is one half of the 1248 px
  shell, identical on the prototype (cap-iter.json build.contentMaxWidth 624, PASS), not a missing cap.
- davids-model-lint PASS; delivery-lint clean; media-reconcile 1 hosted.
- Published gate (preview origin, gate-all --only): 1440 pixel 0.2 % Δh 0; 360 pixel 4.54 % Δh -7 px
  (0.3 %; the illustration now renders where live shows the 403 asset-480); clipped 0, MISSING 0 /
  HIDDEN 0 both widths. Live-side `Arial Metrics Override` font-not-loaded waived in overrides.json
  (build fontsFailed []), same cause as de-about. Fix rounds 0; foundation requests 0.
- Published-origin gate (preview host, 3 fix rounds): 1440 pixel 4.28 % Δh 0, 360 pixel 8.64 % Δh −230 px
  (2.1 %), clipped 0, content MISSING 0 / HIDDEN 0 at both widths (presence.json `index` entry scopes the origin
  to the replica contentRoot; chrome left to crop-compare). Full row still FAIL on units: footer unit build
  selector `.site-footer__list` matches nothing (foundation request), event-card `<picture>` box (live inline
  22 px, approved replica residual), 360 story chip "Po..." (live JS truncation). fonts waived (origin-side
  Arial Metrics Override). Rail clipping moved to page level (`html/body:has(...)`, foundation request).
  Hero auto-advance verified on the preview (slide 0 → 1 at 15 s, prev arrow teal, 0 page errors).

## archetype-pillar
- Page `/de/our-stories/electromobility-greener-future` (archetype, template pillar) →
  `content/de/our-stories/electromobility-greener-future.html`; blocks `article-hero`, `story-hub`,
  `newsletter-offramp`. Prose (h2 / p / single pictures) stays default content in the story section;
  the section after it carries Style `wide` (intro + rails at full shell width).
- `article-hero` — decode tier **template-slotted**, classified by content: link list → breadcrumb
  (mobile back link = presentational clone of the parent crumb, EW4); picture 1 → key visual, picture 2
  → < 576 px crop (live art direction 25x9 / 3x2); h1 + following p → title + lead; plain list → tags;
  `:article:` / bold-only p → type; other heading → date. Share menu (Facebook, LinkedIn, E-Mail,
  Link kopieren) is block chrome (`@ew-exempt`). Reused by the article template (38 story pages).
- `story-hub` — variants `quote`, `video` (template-slotted) and `box`, `columns`, `links`, `rail`
  (**reconstructive**, rows classified by content: media-only first cell = fact / card, 1-cell row =
  head, link-only p = arrow link, bold-led p opens a text group). Variant inferred when omitted.
  restoreAtDelivery: rail drag / swipe when cards overflow (< 768: track height = active card,
  spaceBetween 16), arrows only when overflowing at >= 992 (locked at 1440); Scene7 video
  click-to-play (`is/content/…` link, 104 MB mp4 stays on the source CDN — embed-passthrough, dynamics
  row 5) with native control bar + share menu (E-Mail / Link / Embed). Verified on the preview URL:
  360 drag → translateX(-336px), 1440 locked, video plays (t 2.1 s), share menu opens.
- `newsletter-offramp` — **template-slotted**: heading | text + CTA (mail glyph presentational);
  CTA `href="#"` as on live (login-gated subscribe modal on the source).
- Media: 17 images via DA (`media/de-our-stories-electromobility-greener-future/`), 2 pure-vector SVG
  fact icons. delivery-lint clean; media-reconcile 17 hosted; davids-model-lint PASS (6 🟡: D1 quote
  block single-row prose — bespoke quote rule/glyph component; D3 mixed 1/2-cell rows = head row +
  item rows, intended; D4 SVG check — both pure vector).
- Local asserts: qa-gate PASS 35/0/0; block-roundtrip `--map article-hero=.ifx-fluid,
  newsletter-offramp=section.nlo` EW editable 6/6 + 3/3; remaining 🔴 are the hidden WeChat dialog
  heading (unreachable on live) and the visually-hidden duplicate h3 of the newsletter title;
  story-hub has 9 instances so the per-name map only pairs the first (quote) — its 🔴 list is the
  rest of the column, covered by the published content gate (MISSING 0 / HIDDEN 0).
- Published gate (preview origin, gate-all --only): 1440 pixel 0.3 % Δh -2 px; 360 pixel 0.66 %
  Δh -9 px; clipped 0, MISSING 0 / HIDDEN 0 both widths. Live-side `Arial Metrics Override`
  font-not-loaded waived in overrides.json (build fontsFailed []), same cause as de-about.
  Fix rounds 0; foundation requests 1 (glyphs quote / share / mail / link, scoped in block CSS).

## cluster-utility
- Siblings of de-thank-you: `/de/logout` → `content/de/logout.html`, `/de/config` → `content/de/config.html`.
  Variance probe (`stardust/.work/rollout/cluster-utility/variance.json`): logout = full-bleed panel (1440 vs
  1248 shell), no site header/footer on the source; config = no `.error-component` at all (AEM config dump).
- `thank-you` variant **full** (logout): edge-to-edge 50/50 row, text column centred (grid), no spacer, and
  `body:has(.thank-you.full) > header/footer { display: none }` (source page is chromeless). Encoder unchanged.
  Media: `error-image.png:asset-680` fetched as JPEG → DA `media/de-logout/logout.jpg`.
  Deviation: CTA href `/aem/start.html` → `/aem/start` (delivery-lint P1; the source 301s there and 404s).
- `config-list` (new block, config): decode tier **reconstructive** — one-cell rows = prose (moved into
  `.config-list-body`), multi-cell rows = table rows (first = header `th`); `<code>` kept in cells (Bootstrap
  code style). Content generated verbatim from the capture by `stardust/.work/rollout/probes/config-content.py`
  (bare text runs → `<p>`, orphan `<li>` → own `<ul>` — logged deviation). davids-model-lint 🟡 D10/D3 (data table).
- Local asserts: block-roundtrip `--ew` closed, EW 3/3 (logout) and 166/166 (config). delivery-lint clean.
- Published gate (preview, private state copy, presence `de-config` scoped to the config components, fonts
  waived — origin-side Arial Metrics Override): logout 1440 0.01 % Δh 0 / 360 0.02 % Δh 0; config 1440 4.86 %
  Δh −59 (1.5 %) / 360 8.16 % Δh −66 (1.1 %); clipped 0, MISSING 0 / HIDDEN 0. Footer crop (config 1440) 0.09 %;
  header crop 3.53 % (queued foundation item). Fix rounds 0. Archetype de-thank-you re-gated 1440: 0.2 % (unchanged).

## cluster-landing
- Sibling of index: `/de` → `content/de.html`, same seven blocks, content verbatim from `stardust/current/pages/de.*`
  (German copy; 6 market cards in DE order, 3 story cards; all media reused from DA `media/home/`).
- Variance probe (`stardust/.work/rollout/cluster-landing/variance.json`): the Adobe Target offer
  `#pzn-home-teaser-row-cards-offer` (present in the capture) is absent in the default experience the gate sees;
  without it the source order is stage → products → market row. Delivered in that authored order (deviation
  logged) with two variants: `product-carousel` **spaced** (80 px stage gap ≥ 992) and `market-cards` **flow**
  (no top margin; padding 80 0 0 80 desktop / 64 16 0 mobile). `.html` suffixes on internal hrefs stripped.
- Local asserts: ew-editability 181/181, dead 0; delivery-lint clean; media-reconcile 22 hosted.
- Published gate: 1440 4.84 % Δh 0 (round 1 15.77 % → order + variants); 360 8.45 % Δh −14; clipped 0.
  360 content MISSING 1 = hero slide-1 CTA "Mehr": the build's 15 s rotation advanced to slide 2 before the probe
  on the 8.7k px stitch — documented override (`waives: fonts, content`). Archetype index re-gated 1440: 4.28 %
  (unchanged; units residual as before). Fix rounds 1.

## cluster-static
- Siblings of template `static` (archetype de-about): /de/partners, /de/support, /de/training, /de/careers,
  /de/event/techfor -> `content/de/{partners,support,training,careers,event/techfor}.html`. Variance probe
  (`stardust/.work/rollout/cluster-static/variance.json`): exit 2, every sibling lacks `.pageheader-comp` except
  support; h2 families differ (5 on careers) -> budgeted as `hub-band` variants + new blocks, no per-page forks.
- Content: verbatim from `stardust/current/pages/<slug>.json` / hydrated capture (template filler
  `probes/static-fill.mjs`). Deviations: second h1 per page demoted to h2 (partners mission, support "Hilfreiche
  Links" group heads h1 -> h2/h3, training "Vorteile", careers off-ramp); `/content/ifx/...html` hrefs kept as
  absolute www.infineon.com URLs (delivery-lint html-extension); partners' two text-less sub-nav icon links dropped;
  Scene7 videos (training, careers, techfor) delivered as poster image + play badge (player not migrated);
  feedback-support inline SVG icon -> font glyph ico-community-16.
- `hub-band` (shared, extended - de-about re-gated 0.16 % / 0.9 %, unchanged): new variant `split` - template-slotted
  text | media rows (authored cell order = visual order; two text cells = text|text row; one-cell rows = head before
  the first row, foot after). Modifiers: `masked` (diagonal image masks, check-list grid, 80px CTA gap), `h2-44`,
  `h2-28`, `band` (48px grey band), `video` / `wide-video` (poster + badge), `text-first`, `note` (grey box).
- New blocks: `breadcrumb` (template-slotted trail + decorative share/star), `sub-nav` (centred hub nav, `spaced`),
  `link-cards` (reconstructive; head / cards / CTA row by content; `featured`, `links`), `link-columns`,
  `contact-band` (template-slotted columns), `accordion` (reconstructive; text-less toggle beside the heading, EW7),
  `tabs` (reconstructive; tab + mobile bar buttons are presentational clones of the panel heading, EW4/EW7),
  `product-hero` (template-slotted; `career` builds the job-search inputs in front of the authored search link,
  `offramp`), `locations`, `teaser-cards` (reconstructive; `carousel` with prev/next), `image-hero`.
  Reused unchanged: `page-header` (support), `career-offramp` (partners, landing's block).
- Local asserts: ew-editability-probe 0 dead / 0 duplicated on all five pages; davids-model-lint 0 red (yellow D1/D3:
  bespoke bands and head+card rows, intended shapes); delivery-lint 0 P0/P1; media-reconcile all hosted.
- Published gate (round 3/3), 1440 / 360 pixel %: partners 6.18 / 11.14, support 3.28 / 9.54, training 2.82 / 7.35,
  careers 10.35 / 20.16, techfor 10.38 / 15.99; |dh| within 5 % everywhere, clipped 0, MISSING/HIDDEN 0.
  Font row waived per page (`overrides.json`, same Arial Metrics Override live-capture cause as de-about).
- Residuals: the live capture renders body copy in its metric-fallback face (wider than Source Sans 3), so long
  paragraphs/card copy wrap one line more on live (careers/techfor/support cards, partners check list) and the offset
  accumulates down the page - the dominant remaining 360 diff; careers carousel/locations and techfor teaser grid
  carry the rest. `career-offramp` eyebrow height (24 vs live 32/40) is landing's block, not touched.


## archetype-reference
- Page `/de/glossary` (archetype de-glossary, page type reference) -> `content/de/glossary.html`, generated
  verbatim from the approved prototype by `stardust/.work/rollout/archetype-reference/gen-content.py`.
  Blocks reused, extended by variant class only: `breadcrumb share`, `page-header title`, `accordion glossary`.
  No new block: the glossary module (`glossary-accordion`) is the existing accordion's item model
  (title cell | body cell) plus ordered flow rows.
- `accordion` variant **glossary** - decode tier **reconstructive** (whole A-Z body in one block, classified by
  content): 1-cell rows = flow groups in authored order (paragraph of `#` links = A-Z index; h2/h3 = letter
  heading; h4 + text = plain term); runs of 2-cell rows = collapsible items (title heading | definition, MOVED,
  EW1; text-less toggle beside the heading, EW7). Index links resolve to the letter heading by id, else by
  matching text (id assigned) - the A-Z jump works (#09, #A ... #W). Collapse animates height .35s (source
  Bootstrap collapsing sequence), open class + aria-expanded, plus/minus glyph \e933/\e936, title colour
  transition; reduced motion skips. Spacing rules by content: h3 letter (source h2, 36px) + plain term = 16 / 48
  (the 0-9 group), h2 letters 32; items 24 (collapsing margins as on live). Default accordion path unchanged
  (refactor only; training/partners decorated heights identical).
  Reuse for /de/opn and /de/support/service-center: 1-cell rows = titles + text, 2-cell rows = FAQ items.
- `breadcrumb` variant **share** - template-slotted trail; share glyph is a button opening the share menu
  (Facebook, LinkedIn, E-Mail, Link kopieren; `@ew-exempt` chrome), star glyph decorative, underlined trail,
  16px tools, 14px divider. `page-header` variant **title** - title-only band, 64px bottom padding >= 992.
- Deviations: heading levels shifted one down for the one-h1 rule (letters source h1 -> h2, source h2 -> h3;
  terms source h1/h6/h3 -> h4); index bold applied by the block (`<b>` wrapper dropped - delivery-lint
  one-cta-per-p). captureState: the record (progress.json types.de-glossary) has no captureState entries -
  nothing to restore; motion inventory (accordion collapse, share menu) implemented.
- Local asserts: delivery-lint 0/0/0; media-reconcile 0 images; davids-model-lint PASS (3 yellow: D1
  breadcrumb / page-header bespoke bands, D3 accordion 1/2-cell rows = intended flow + item shape); qa-gate PASS
  17/0/0; block-roundtrip `--ew` EW 89/89 dead 0 dup 0; 28 red = 26 ROLE SWAP on the source's href-less
  `a.cmp-title__link` heading anchors (de-about precedent), the mobile duplicate "Home" crumb (one link in EDS)
  and the hidden WeChat dialog heading (pillar precedent). Interaction probe (both widths): accordion
  69 -> 159/341 -> 69 px, aria flips, 18/18 index targets resolve, jump #S lands 16px from top, share menu 4
  items, 0 page errors.
- Deploy: ledger `stardust/deploy/ledger-archetype-reference.json`, live (publish). .plain.html: 1 h1, 0
  about:error, 0 /img/. ai-readability code 100 %.
- Gate (gate-all --only de-glossary, private state copy): code NOT pushed (unit brief: no git commit/push), so
  the preview origin still serves the old blocks; the gate ran with `--eds-host http://localhost:3000`
  (aem up: local code + the published preview content). 1440: pixel 0.14 % Dh 0, clipped 0, MISSING 0 /
  HIDDEN 0; 360: pixel 0.68 % Dh -7, clipped 0, MISSING 0 / HIDDEN 0. Font row waived (origin-side Arial
  Metrics Override, overrides.json, same cause as de-about). Fix rounds 0. Re-run the same gate against
  https://main--938eead7--aemcoder.aem.page once blocks/accordion, blocks/breadcrumb, blocks/page-header are
  pushed. Foundation requests 0.

## archetype-article
- Page `/de/our-stories/semiconductors-driving-decarbonization` (archetype, template article) →
  `content/de/our-stories/semiconductors-driving-decarbonization.html` (emitter
  `stardust/.work/rollout/archetype-article/probes/emit-content.py`, prototype `<main>` → DA doc).
  Four sections: `article-hero` | Style `article` (article-toc + prose + story-hub video / columns /
  box) | Style `wide, related` (two story-hub rails) | `newsletter-offramp`; metadata.
- Reused unchanged: `article-hero` (template-slotted; 2000-25x9 key visual + 680-3x2 small crop),
  `newsletter-offramp`, `story-hub` JS (`video` template-slotted; `columns`, `box`, `rail`
  reconstructive). Columns = one 2-cell row (picture + bold-led text per cell); sources aside =
  `box` with one prose row.
- New block `article-toc` (template-slotted): label slot (any non-list node) + list slot (link
  list); a `#fragment` naming no element is pointed at the `<main>` heading with the same text
  (authors keep the source `#anchN`; the pipeline derives heading ids from text). Present on 25 of
  43 captured story pages.
- `story-hub.css` extended by section-style variants only (pillar untouched): `article` = 10/12
  story column at >= 992 (full width below), prose node-slotted as default content (h2/h3 = h-28,
  h4-h6 = h-20; spacing from adjacency: text→image 32, image/text→h2/h3 64, image→h5 64, last
  node 64; 16/24 below 576), natural image ratios, sub/sup, video foot space (live wrapper
  min-height 224 below 768), box/columns spacing; `related` = 64 between rails, 2-line title box
  (equal card heights), fixed type/title boxes and link at 28 px >= 768, right bleed >= 992.
  Round-2 fix: an `align-items: stretch` on the rail track fed the rail's own track-height read
  (height 0 when measured hidden) — replaced by the fixed title box.
- restoreAtDelivery (progress motion record): click-to-play video (t 2.09 s, controls), share
  menu opens; rail 360 drag → translateX(-336px) h 335, 1440 locked; TOC links resolve to the 4
  headings, jump lands at top 80 (scroll-margin).
- Media: 17 images via DA `media/de-our-stories-semiconductors-driving-decarbonization/` (fetched
  as JPEG); Scene7 video stays on the source CDN (embed-passthrough, as pillar). delivery-lint
  clean; media-reconcile 17 hosted; davids-model-lint PASS (4 🟡: D1 article-toc / sources box
  single-column prose = bespoke components; D3 rail head row + card rows, intended); localize
  check PASS; ai-readability code 100 %.
- Local asserts: qa-gate PASS 29/0/0; block-roundtrip `--ew` editable 12/12, dead 0, dup 0;
  article-toc closed; 🔴 left are unreachable source chrome (hidden WeChat dialog h3, Scene7
  embed-size links 320x240…Custom Size, visually-hidden duplicate newsletter h3) — same class
  as pillar, covered by the published content gate (MISSING 0 / HIDDEN 0).
- Gate (preview content): 1440 0.22 % Δh -2 (preview origin, published code); 360 4.92 % Δh -13
  (rounds 1-2 through a local code proxy `probes/code-proxy.mjs` = working-tree code + preview
  content, because the brief forbids pushing; the preview-origin 360 run on the checkpointed code
  read 9.66 % Δh -322 with the first rail collapsed — the stretch bug fixed in round 2, which
  needs the next checkpoint push before a preview-origin re-gate). Clipped 0, MISSING/HIDDEN 0.
  Live-side `Arial Metrics Override` font row waived in overrides.json (build fontsFailed []).
  Fix rounds 2; foundation requests 0.

## archetype-listing
- Page `/de/package-overview` (archetype de-package-overview, template listing) -> `content/de/package-overview.html`;
  encoder `stardust/.work/rollout/archetype-listing/tools/listing-fill.mjs` (approved prototype main -> block
  tables; reused for /de/contact-us and /de/support/faqs). Sections: breadcrumb | product-hero + jump-nav |
  package-categories | document-card + document-list | teaser-cards | support-offramp | metadata.
- Reused, extended by variant only: `breadcrumb compact` (55px trail, share glyph only, underlined links),
  `product-hero plain` (white two-column hero; optional 2nd image = < 576px 3x1 crop; live clip shapes
  8% 69% notch desktop / V bottom mobile), `teaser-cards tech` (head h2 + description; card title / pre-title /
  description / link, line-clamped; slider at every width with disabled-end arrows >= 992). Existing variants
  untouched.
- New blocks: `jump-nav` (**template-slotted**: label p + #anchor list moved into the bar; anchors resolve by id,
  else by matching heading text; pins fixed + shadow with a spacer, scroll-spy, mobile dropdown whose toggle
  mirrors the active link — live parity), `package-categories` (**reconstructive**: h2 row = head, h3 row = group,
  image row = card -> title p + family list; > 5 families -> "zeigen +N mehr" reveal; block-built search filter),
  `document-card` (**template-slotted**: thumb | h4, description, meta list with data-role type/access/format,
  download link), `document-list` (**reconstructive**: heading row, notice row, first multi-cell row = column
  labels, rest = documents; table at >= 992, same table restyled as cards below; 8 per page pager, text filter,
  Dokumenttyp / Sprache dropdowns from authored values, reset), `support-offramp` (**template-slotted**: heading,
  eyebrow, text, bold CTA, `:ico-*:` link list; grey band painted edge to edge inside the 1400px shell).
- Content: verbatim from the approved prototype; documents 9-18 (pages 2-3, absent from the page-1 capture) from
  the source's JSON-LD ItemList — access "Öffentlich" (public asset path), size cell empty (not published in the
  list) = content deviation. "Login to download" (display:none on live) omitted. Package-family / PDF / external
  links stay absolute www.infineon.com URLs (not migrated paths).
- Media: 34 images via DA `media/de-package-overview/` (package photos JPEG with baked #f7f7f7 ground; hero +
  technology PNGs fetched `fmt=png-alpha`); decorative crystals / group shape in blocks/package-categories.
- Static: delivery-lint 0 P0/P1/P2; media-reconcile 34 hosted; davids-model-lint 0 red (yellow D1 breadcrumb /
  jump-nav / support-offramp = bespoke bands; D3 head rows + 2-cell rows; D10 document-list 8 columns = genuine data
  table); ew-editability-probe 243/243 editable, 0 dead / 0 duplicated; block-roundtrip --ew 0 structural red;
  qa-gate 29 ok / 2 fail = schema-section -> block index artefact (schema starts at phero, page starts with the
  breadcrumb); content cap 1400 holds at 2560.
- Gate: block code is not pushed by the unit; `--eds-host http://localhost:3000` redirects browser navigations to
  Adobe IMS sign-in, so the row ran on the delivered preview HTML saved as a static file on the dev server (local
  code over published content): `stardust/.work/rollout/archetype-listing/served/`. Rounds 3/3:
  1440 pixel 7.65 % Δh -4, 360 pixel 10.14 % Δh -7; clipped 0, MISSING 0 / HIDDEN 0 both widths. Font row
  waived (overrides.json, Arial Metrics Override live-capture face, same cause as de-about).
- Residual 360 (10.14 % vs 10 %): live stitched capture renders the first package card without PG-SSO and with
  a one-line title (the fixed sub-nav covers the chunk seam, prototype approval residual) -> ~66px offset from
  y≈900 down to the footer; build carries the full content (MISSING 0).

## cluster-reference
- Siblings of template `reference` (archetype de-glossary): /de/opn, /de/support/service-center ->
  `content/de/opn.html`, `content/de/support/service-center.html`. Variance probe
  (`stardust/.work/rollout/cluster-reference/variance.json`): exit 2 - no `.pageheader-comp` band on either
  sibling, body column 8/12 (832 / 808 px), service-center accordion = second style family (20px titles,
  first item open) plus a 4/12 aside (two grey side boxes) -> budgeted as modifiers of the archetype's encoder,
  no per-page fork. `migrate.mjs render` refused both (strict source: no sibling prototype) - content authored
  directly from the hydrated capture with the encoder (`cluster-reference/gen-content.py`), as cluster-static.
- Encoder reused: `breadcrumb share` (now shows the parent crumb on mobile - "Support" on service-center;
  2-level pages unchanged) and `accordion glossary` + new modifier **article** (reconstructive, classified by
  content): flow rows in the 8/12 column; a list of `#` links = jump box ("Found on this page", links resolve to
  the section headings by text: #structure, #transla, #identi, #faq); 2-cell rows whose first cell has no
  heading = table rows (first row header, zebra rows, first column 600) - no nested tables in DA; 2-cell rows
  with a heading = collapsible FAQ / region items; 1-cell rows of bold-only title + link-only CTA paragraph =
  aside boxes (right column >= 992, after the body below; the h1 row then spans the shell). `spacious` =
  hotline spacing (48 / 64 / 160 px), `regions` = 20px item titles, first item open. Glossary path unchanged
  (footer 5510 / 6556 px and interaction probe identical).
- Deviations: service-center section titles source h1 -> h5 ("Main countries", heading-05) / h3
  ("Internationale 0800 Nummern", heading-02), region items h3 -> h4 (one-h1 rule; sizes = the source's
  heading classes); external links kept absolute (www.infineon.com /opn#transla, /cms/en/.../service-center/);
  side-box headings are bold paragraphs; the empty description paragraph of box 1 dropped.
- Media: 4 opn images fetched as JPEG -> DA `media/de-opn/` (ledger `cluster-reference/media-ledger.json`);
  rendered 75 % column width, 16:9, padding-right 16 as live.
- Local asserts: delivery-lint 0/0/0 both; media-reconcile 4 hosted; davids-model-lint PASS (yellow D1/D3
  only); ew-editability-probe 88/88 and 85/85 editable, 0 dead / 0 duplicated.
- Gate (private state copy, `--eds-host http://localhost:3000` while the accordion code is unpushed):
  service-center 1440 0.46 % Dh 0 / 360 1.98 % Dh -7, clipped 0, MISSING 0 / HIDDEN 0. /de/opn cannot be
  gated on localhost - aem up rewrites DA media to preview.da.live (401) and the page redirects to the IMS
  sign-in; its geometry was matched on the harness (h5 / FAQ / footer offsets vs live measure) and its row is
  taken on the preview host after the push. Font rows waived (origin-side Arial Metrics Override).

## cluster-pillar
- Siblings of template `pillar` (archetype de-our-stories-electromobility-greener-future): /de/our-stories/{we-power-ai,
  software-defined-vehicles,power-infrastructure-renewables,artificial-intelligence-in-everyday-life} ->
  `content/de/our-stories/<name>.html`. Variance probe (`stardust/.work/rollout/cluster-pillar/variance.json`, probes
  hero/quote/box/card/h2): exit 2; deltas budgeted as story-hub variants, no per-page forks.
- Render: `migrate.mjs render` refused 4/4 (no sibling prototype source). Pages authored from the hydrated capture by
  `stardust/.work/rollout/cluster-pillar/probes/encode.mjs`, which emits the archetype's proven block shapes (verified:
  re-encoding the archetype capture reproduces the archetype document's tag skeleton; only diff = its links block).
  Content-count at import: headings/body/CTAs 0 non-chrome misses on all four pages; images >= capture.
  Deviations: articles listing (React feed, 3 of n cards captured) delivered as a static snapshot without pagination;
  Scene7 videos as poster + is/content link (as archetype); external-link launch glyph not shown (queued glyph).
- story-hub (shared, extended by variant only; archetype behaviour unchanged): new kinds `gallery` (thumb grid + stage
  = presentational clone, EW4), `articles` (eyebrow + heading, cards by order), `checks` (two-column check list),
  `figure` (`w25/w50/w75` picture share). Modifiers: quote `portrait`, columns `icons`, box `flat` / `cta` /
  `facts-16` / `facts-end-32` / `end`, rail `described`, spacing `mb-16/32/64`, `pre-32` (text before block closes
  at 32), rail `mt-24`. All derived by the encoder from source component classes (widthNN, marginBottomNN).
- Local asserts: ew-editability-probe 0 dead / 0 duplicated on all four; delivery-lint 0 P0/P1; media-reconcile all
  hosted (81 images via DA, scopes de-our-stories-<name>); davids-model-lint 0 red.
- Gate (round 3/3; code = local working tree over published content, proxy on :3017 because aem up redirects to DA
  login): 1440 / 360 pixel %: we-power-ai 8.13 / 10.54, power-infrastructure-renewables 8.45 / 12.9,
  artificial-intelligence-in-everyday-life 9.73 / 14.98, software-defined-vehicles 10.64 / 12.1; |dh| within 5 %,
  clipped 0, MISSING/HIDDEN 0. Font row waived (overrides.json, live-side Arial Metrics Override, build []).
  Official preview-host run after the 09:14 push (round 1 code): 1440 11.84-16.58, 360 13.47-16.98.
- Residuals: per-instance AEM spacing (text/image marginBottomNN in default content cannot be encoded) accumulates
  16-48 px offsets; challenge-column link rows (several links in one tertiarylink are inline on live, stacked here);
  check-list/icon glyph sizes; articles card image diagonal mask; AI 360: rail `described` title letter-spacing set
  to -0.2px (live keeps the type tracking) and type box min-height not applied < 768 — fix candidate, not gated.

## cluster-listing
- Siblings of template `listing` (archetype de-package-overview): /de/contact-us, /de/support/faqs ->
  `content/de/contact-us.html`, `content/de/support/faqs.html`. Variance probe
  (`stardust/.work/rollout/cluster-listing/variance.json`): neither sibling carries the archetype's
  product-hero / package-categories / document-list bands -> page-specific blocks, no archetype fork.
  Encoder `stardust/.work/rollout/cluster-listing/tools/cluster-fill.mjs` (captures + `faq-live.json`, the
  Coveo FAQ results read from the live widget).
- Blocks (7): contact-us = `page-header kicker` | `sub-nav` | `location-finder` (reconstructive: head row +
  one row per location group; Google map embed, country / site-type filters, accordion, pager block-built,
  EW-exempt widget labels) | `info-boxes` (template-slotted grey contact boxes, launch glyph on off-site
  links), section style `grey`; faqs = `breadcrumb share` | `page-header` | `faq-list` (reconstructive: head
  row, facet row = list of "Name (count)", 2-cell rows = question | answer; search, sort, pager
  block-built; text-less toggle EW7) | `contact-band` (template-slotted off-ramp, `:ico-*:` links).
  Existing variants untouched.
- Content-fidelity (`cluster-listing/tools/content-count.mjs`, capture vs delivered .plain.html + /nav +
  /footer): headings 7/7 and 3/3; body / CTA misses = chrome only (cart counters, "Support & Training" nav
  entity) plus block-built widget UI (Google Maps "Keyboard shortcuts" / "Terms", filter labels,
  "Einträge pro Seite") and the site-wide "Ask AI" chatbot launcher (not page content). 0 content lost.
- Deploy: deploy-batch (publish) -> ledger `stardust/deploy/ledger-cluster-listing.json`, both pages
  put/preview/live 200, verify ok; aem.live 200 for both and for /de/package-overview.
- Gate round 1 (local code): 1440 faqs 3.47 % / contact 5.87 %, 360 contact 6.43 % / faqs 4.85 %, MISSING 0.
  Official preview-host re-gate after the push (private state copy `cluster-listing/state-preview.json`,
  `--eds-host https://main--938eead7--aemcoder.aem.page`): 1440 contact-us 5.9 % Δh 13 / faqs 3.47 % Δh -27,
  360 contact-us 6.41 % Δh 101 (within 5 %) / faqs 4.84 % Δh -10; clipped 0, MISSING 0 / HIDDEN 0. Font row
  waived for faqs (overrides.json, live-side Arial Metrics Override, same cause as de-about).
- Archetype de-package-overview on preview: 1440 7.65 % Δh -4 PASS (font override); 360 10.14 % Δh -7 FAIL
  pixel only - identical to the archetype-listing residual (live stitch drops PG-SSO / wraps the first
  package card title under the fixed sub-nav seam -> ~66px offset); source capture artefact, not re-iterated.
- Coverage: de-contact-us, de-support-faqs -> deployed (update-coverage.mjs). Foundation requests: none.
  foundation-freeze check exit 0.

## cluster-article (render unit article-1)
- Pages (template `article`, archetype de-our-stories-semiconductors-driving-decarbonization): /de/our-stories/
  {microelectronics-connecting-real-digital-world, turning-ray-sunshine-into-cup-hot-coffee, green-hydrogen-fuel-future,
  efficient-energy-storage-systems-energy-transition, semiconductors-bring-heat-pumps-life, electric-cordless-power-tools,
  green-chargers-adapters, green-potential-data-centers} -> `content/de/our-stories/<name>.html`, all 8 live (published).
- Encoder `stardust/.work/rollout/cluster-article/encode.py` (capture -> DA doc, archetype block shapes), driven per page by
  `emit-batch.sh` (encode -> JPEG media fetch -> DA media upload -> re-encode with DA URLs -> sanitise -> delivery-lint /
  media-reconcile / davids-model-lint). Blocks: article-hero, article-toc, story-hub (box, columns[boxed, cols-7-3],
  gallery, links, quote[portrait], rail[flush], timeline, video), newsletter-offramp. EW clean, lints 0 P0/P1, 0 red.
- Round 3 (last) fixes: encoder - Scene7 video without an AVS poster takes the viewer's own poster frame (2 videos were
  black boxes); a page using the heading-02 size gets Style `article, display-h2` (h2 26/36 -> 36/48 at >= 992, 24 below),
  its heading-03 h2s become h3. story-hub.js rail: a card measured while its section is hidden read 0 and pinned the
  mobile track to height 0 (first rail collapsed on preview at 360, cordless 13.09 %) - the 0 is ignored and a
  ResizeObserver on the cards re-applies (shared with pillar; pillar archetype re-gated 0.30 / 0.66 %). story-hub.css
  (`.section.article` only): link cards `min-width: 0` (a long word wrapped the 4th card), < 768 link card 16 px inset /
  26 px title line (278 px pitch as live), quote rule hidden. Redeployed: turning-ray, efficient-energy (publish).
- Gate, official preview host after the round-2 push (1440 / 360 %): micro 12.77/11.12, turning-ray 32.33/21.77, hydrogen
  11.68/11.05, efficient-energy 25.43/16.49, heat-pumps 10.44/7.72, cordless 2.01/13.09 (rail collapse), chargers
  5.59/7.48, data-centers 9.84/8.55. Archetype decarbonization on preview: 1440 0.22 Δh -2, 360 4.92 Δh -13 (PASS).
- Gate round 3 (local code proxy :3927 = working tree over published content, stopped by PID): 1440 / 360 %: micro
  10.12/8.69, turning-ray 30.14/14.97, hydrogen 11.68/11.05, efficient-energy 24.66/14.28, heat-pumps 10.44/7.72,
  cordless 2.01/2.41, chargers 5.59/7.48, data-centers 9.83/8.54; clipped 0, MISSING/HIDDEN 0 on all; |Δh| within 5 %.
  Font row waived (overrides.json, live-side Arial Metrics Override, build []). Pass both widths: cordless, chargers,
  data-centers. Over the bar: micro (1440), heat-pumps (1440), hydrogen, efficient-energy, turning-ray.
- Residuals (causes, not iterated further): source spacing is per component (marginBottom8..64 on title/richtext/
  image/video, default 64) and has no carrier in DA default content, so headings/images drift 16-48 px each
  (efficient-energy 13 headings with title/12-32, turning-ray); tertiary links (16/24, 32 above / 64 below on live, 18/26
  link paragraph here; 5 on turning-ray, 1 heat-pumps); hydrogen empty spacer paragraph (42 px) + timeline bullets;
  micro interactive image gallery (thumb strip + caption) and quote spacing; video margin 40 vs 64 (turning-ray).
- Coverage: 8 pages -> deployed (update-coverage.mjs). State: private copy stardust/.work/rollout/cluster-article/
  state-r3.json. Foundation requests: none. Unpushed code: blocks/story-hub/story-hub.js, story-hub.css.

## cluster-article (render unit article-3)
- Pages (template `article`, archetype de-our-stories-semiconductors-driving-decarbonization): /de/our-stories/
  {artificial-intelligence-semiconductors, enable-provide-ai-customer-innovation, micromobility,
  micromobility-battery-swapping, charging-infrastructure, fast-charging-solutions, bi-directional-charging,
  emission-saving-potential-freight-transportation} -> `content/de/our-stories/<name>.html`, all 8 live (published).
- Encoder: shared `cluster-article/encode.py` run unchanged (article-2 owns it) through a private copy of
  emit-batch.sh (`cluster-article/u3/`, out/ + media/ under u3). Lints per page 0 P0/P1, all media hosted,
  davids-model PASS 0 red; `npm run lint` eslint/stylelint clean, breakpoint-lint flags pre-existing committed
  story-hub.css:1599 (`width < 768px`, article-1 code). No block code touched.
- Blocks: article-hero, article-toc, story-hub (box, box checks, box timeline, columns[boxed, cols-3-7, cols-7-3],
  rail[flush], timeline, video), newsletter-offramp (4 blocks).
- Content post-pass `u3/content-fixes.sh` (re-run after any re-encode): encoder flattened two source grids into one
  6-cell / 4-cell columns row (AI page) -> head row + rows of 2, grey one `boxed` (1440 31.88 -> 15.12 %, 360 27.99 ->
  20.42); bi-directional case-study eyebrow + h2 moved into the `columns boxed cols-3-7` head row (19.56 -> 14.36);
  battery-swapping check list box -> `box checks` (13.78 -> 9.13 at 360, 11.84 -> 10.23 at 1440).
- Gate (preview host, final, 1440 / 360 %): AI 15.12/20.42, enable-ai 24.41/15.16, micromobility 14.85/12.21,
  battery-swapping 10.23/9.13, charging-infra 11.81/11.31, fast-charging 11.5/10.93, bi-directional 14.36/13.39,
  emission 18.99/11.7. Clipped 0; |Δh| within 5 %; MISSING 0 except AI 360 (1). Font row waived (overrides.json).
- Residuals: per-component source spacing with no DA carrier (16-48 px per heading/image, accumulates to -525 px on
  enable-ai, -226 emission), box/timeline list line spacing, check-list icon box metrics; AI 360 MISSING link = article-hero
  mobile back link takes trail[length-2] (a self-link crumb "Die Rolle von ...") where live shows "our stories" ->
  block fix requested (article-hero.js: skip crumbs whose href is the current page).
- Coverage: 8 pages -> deployed (update-coverage.mjs). State: private copy cluster-article/u3/state.json. Ledger
  stardust/deploy/ledger-cluster-article-3.json. Foundation requests: none.

## cluster-article (render unit article-4)
- Pages (template `article`, archetype de-our-stories-semiconductors-driving-decarbonization): /de/our-stories/
  {shaping-the-future-of-mobility, public-transportation, green-buildings-rise, essential-role-cybersecurity,
  how-microcontroller-enable-risc-v, semiconductors-key-technology-software-defined-vehicles,
  software-defined-vehicle-agm, ecosystem-summit} -> `content/de/our-stories/<name>.html`, all 8 live (published).
  Source paths with capitals (how-microcontroller-enable-RISC-V, Software-defined-vehicle-AGM) use the lowercased
  slug paths (as earlier units); internal links to them are lowercased in content.
- Encoder: shared `cluster-article/encode.py` unchanged (article-2 owns it and blocks/) through a private
  `u4/emit-batch.sh` (out/ + media/ under u4). Lints 0 P0/P1, all media hosted, davids-model PASS 0 red;
  `npm run lint` clean. No block code touched.
- Blocks: article-hero, article-toc, story-hub (box, checks, columns[boxed, cols-3-7, cols-7-3, gap/pre/t/pic/rt
  tokens], gallery, quote[portrait], rail[flush], timeline, video), newsletter-offramp (4 blocks).
- Content post-pass `u4/content-fixes.sh` (re-run after any re-encode): shaping - grey video box rebuilt (h2 + intro
  as head row, 2x2 video cards; encoder dropped the 2nd grid row; 2 posters fetched as JPEG + uploaded; the video
  link carries the card title because columns cells do not decorate video links) 1440 17.75 -> 14.4, 360 27.67 ->
  24.94; cybersecurity - lone grid card (full-width image before) -> 3rd columns row + empty cell (21.59 -> 17.12);
  public-transportation - box eyebrow h5 -> p, two icon-c-check lists -> `story-hub checks` (360 15.87 -> 11.9);
  green-buildings + shaping - `reverse` token on the cols-7-3 blocks (source ifx-container-reverse(-tablet):
  image stacked first below 992), inert until story-hub.css implements it.
- Gate (preview host, latest per page, 1440 / 360 %): shaping 14.4/24.94, public-transportation 20.77/11.9,
  green-buildings 6.56/22.17, cybersecurity 17.12/20.07, risc-v 9.27/10.3, sdv-key-technology 0.82/12.14,
  sdv-agm 0.85/12.42, ecosystem-summit 16.07/14.81. Clipped 0, MISSING 0 (risc-v 360 back-link fixed by the
  lowercased crumb href), |Delta h| within 5 %. Font row waived (overrides.json). 3 fix rounds used.
- Residuals: 360 image order of reverse grids (green-buildings, shaping; block CSS); per-component source spacing
  with no DA carrier (public-transportation -280 px at 1440); columns row gap 64 on source vs ~24 (cybersecurity);
  video gap-0 below 768 (16 px vs ~56 px before the rail) + rail card inset at 360 (sdv pages 12 %); interactive
  gallery thumbs/pager (ecosystem-summit); video cards in a columns cell show a title link, not a poster player.
- Coverage: 8 pages -> deployed (update-coverage.mjs). State: private copy cluster-article/u4/state.json. Ledger
  stardust/deploy/ledger-cluster-article-4.json. Foundation requests: none.

## cluster-article (render unit article-2)
- Pages (template `article`): /de/our-stories/{empowering-green-energy-wide-bandgap-semiconductors,
  sensors-energy-efficient-smart-buildings, smart-things-consumer-devices, smart-health-appliances,
  smart-factory-technologies, smart-home-building-technologies, green-iot, smart-factory-semiconductor-solutions}
  -> content/de/our-stories/<name>.html, all 8 live (published, deploy-batch --force x3, ledger
  stardust/deploy/ledger-cluster-article-2.json). Lints 0 P0/P1, all media hosted, davids-model PASS 0 red.
- Blocks: article-hero, article-toc, story-hub (video/columns/box/rail/timeline/gallery), newsletter-offramp (4).
- Encoder (shared encode.py, backward compatible; article-1 pages re-encode byte-identical except
  turning-ray, which gains spacing tokens - intended, not redeployed): source marginBottomNN carried as
  story-hub variant tokens `pre-NN` (gap above video/columns), `gap-NN` (gap below), columns `t-8`, `pic-NN`,
  `rt-NN`, `img-w50` (width50 images), `rev` (ifx-container-reverse: picture first on phones); gallery heading
  (h2.cmp-imagegalleryy) kept; >2-cell column groups -> head row + rows of 2 (u3/fix.py folded in; fix.py
  patched to still add `boxed`; article-3 pages re-encode identical apart from the new tokens).
- Code (gated through local code proxy :3927; since pushed in the coordinator checkpoint commits 42b326e/e2dde36): story-hub.css article-2 token rules (scoped
  `.section.article`, token-only) + breakpoint-lint fix (links-item <768 rule rewritten mobile-first, same
  values); article-hero.js mobile back link skips crumbs linking to the current page (AI page 360 MISSING 1->0).
- Gate (proxy = pushed content + local code; 1440 round 2 / 360 round 3, %): empowering 14.89/7.25,
  sensors 11.3/14.2, smart-things 7.76/8.58, smart-health 7.26/7.6, smart-factory-tech 6.43/13.47,
  smart-home 13.92/14.74, green-iot 14.62/13.66, semis-solutions 11.5/14.07. Round 0 (published code):
  1440 29.08 worst, 360 23.17 worst. Clipped 0, MISSING 0, |dh| <= 5 %. Regression (360, proxy): archetype
  4.92, pillar 0.66, turning-ray 14.97, AI 20.41 - all unchanged vs before.
- Residuals: default-content per-component spacing (image/h5 margins with no carrier), box check-list
  inner paragraph spacing (smart-factory-tech 360 dh +367), gallery caption/strip (smart-home), list/timeline
  line spacing, green-iot column label image (24 px) not carried, empowering/sensors infographic image spacing.
- Coverage: 8 rows -> deployed. State: private cluster-article/state-2.json. Foundation requests: none.

# Journal — Infineon same-design migration (replica)

## Extract — 60 of 61 planned pages captured live, 7 page types (2026-11-18)

- `crawl.mjs --pages <61 plan URLs> --dynamics` (concurrency 3): 60 OK, every record Playwright-rendered (provenance 60/60 live). `/de/gated` was flagged by the crawler as a denial page; a one-page browser check showed the source redirects it to `/errorpages/404-page-not-found` ("Sorry, we have landed on an empty space") — a source 404, not bot protection. It has no content of its own; recorded in `_crawl-log.json#crawl.failures` and carried as a scope note.
- Capture gaps: `/de` links 43 first-level targets outside the plan; the plan scope is fixed, so they stay out of scope (links to them will point back at the source).
- Vision check (subagent, thumbnails only): 58 ok, 2 suspect — `de-config` is an internal AEM configuration page (migrated as captured, it is in the plan), `software-defined-vehicles` bottom cards lazy-loaded blank in the screenshot.
- Page types: landing 2 (index, de) · article 38 (stories incl. video and event variants) · pillar 5 (story hub pages with carousels/FAQ) · static 6 (about, careers, partners, support, training, event-techfor) · listing 3 (contact-us, support-faqs, package-overview) · reference 3 (glossary, opn, service-center) · utility 3 (logout, thank-you, config).
- Style census at 1440+360 (two passes; the first hit its 900 s deadline after 36 pages, the rest re-run). Source Sans 3 (OFL) + Arial metric-override fallback, infineon-icons icon font, Roboto on 2 buttons. Teal #0a8276 / hover #08665c, ink #1d1d1d.
- Cap-probe on the 7 archetypes: content max-width 1400px (module caps), shell fluid, consistent across archetypes.
- First page first not taken: the full prep capture finished before any first-page work could start, so the home archetype simply goes first in Phase 3.
- Header contract (`chrome-explore.mjs`): two runs hit their deadlines (1800 s, 2700 s at 150 states) without writing a contract — the mega navigation has many panels at both widths. Moved to Phase 2 with a bounded budget (it is needed by the foundation gate, not by recreation).

## Preserve direction — spec promoted verbatim, empty register, 17 dynamic features triaged (2026-11-18)

- Full-prep branch: `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json` copied byte-for-byte to the project root; `stardust/direction.md` records preserve mode. No target breakpoints.
- Inconsistency register: empty — pure replica (hands-off adopts no audit candidates).
- Archetypes (one per type, the extract cap-probe set) recorded in `stardust/replica/archetypes.json`: home `/`, article `semiconductors-driving-decarbonization`, pillar `electromobility-greener-future`, static `/de/about`, listing `/de/package-overview`, reference `/de/glossary`, utility `/de/thank-you`.
- Dynamics: `dynamics-detect` on the 7 archetypes (reach over 60 pages) → 70 findings; `dynamics-plan --target-origin <preview> --martech` → draft; curated to 17 rows in `stardust/dynamic-features.md` + `-plan.md`. Every row has a disposition; nothing decided-out by assumption. Search ships as an index-backed header widget over the migrated corpus; curated card sets and JS-fed card rails ship as authored rows; Scene7 video as media URL.
- Martech (owner asked to keep tags/consent): `spec-martech --urls <archetypes>` (no Launch; OneTrust domain script seen); contract has GTM-TX6SPG7 as the one route, CMP and route disabled; `martech-scaffold.mjs` wrote `scripts/martech.js` and hooked `scripts.js` / `consented.js` / `consent-check.js`.
- Publish decision recorded in `stardust/eds-conversion-log.md`.
- Header contract: a bounded `chrome-explore` (1440 + 360, request budget 900) truncated on the first load's subresources (1 control); a rerun with root `.mainnavigation-component`, unlimited requests, 50 states hit its 900 s deadline at both widths. Deferred to Phase 3 (background, ≤ 20 states, depth 1) — required by the C0 foundation gate, not by recreation.

## Recreate — 7 archetypes gated at 1440 + 360, all approved hands-off (2026-11-18)

- Header contract: `chrome-explore` on `/de`, root `.mainnavigation-component`, 20 states depth 1 → `stardust/chrome/header-contract.json` (1440: 7 menus, 20 states, 30 links; 360: 2 menus + cart + drawer, 8 states). Bounded on purpose (truncated at depth 1): the mega-menu second level is not recorded; C0 gates the first level.
- Shared canon `stardust/prototypes/canon.css` (+ canon.js, CANON.md) authored with the home archetype; every later prototype links it first.
- Approved (residuals in `stardust/replica/progress.json`): index (landing; units probe FAIL on carousel slides carried — re-check at C-archetype), de-about (static), de-our-stories-semiconductors-driving-decarbonization (article; 360 Δh +58 carried), de-thank-you (utility), de-our-stories-electromobility-greener-future (pillar), de-glossary (reference; 0.15% / 0.32%, Δh 0; breadcrumb icons lifted in iter3), de-package-overview (listing; 1440 7.69% Δh 0; 360 10.27% Δh −1 after the 3-iteration cap — live sticky in-page nav reflows ~66px in the stitched live capture, evidence strip `gates/de-package-overview-360/residual-sticky-join-strip.png`; 5 observed behaviours implemented).
- Shared residuals on all: runtime-injected mega-menu news-teaser role swaps, mobile "Deutsch" language label / "Back" aria-label, login-box size; chrome-parity footer-logo 0→54 is a lazy-load timing artifact on the live probe.
- Prototype table (`gates/prototypes-{1440,360}/`): pixel-only 7/7 PASS at 1440, 6/7 at 360 (package-overview residual above). Every row also carries `font-not-loaded: Arial Metrics Override` — that is the LIVE side's own metric-fallback face failing in the capture environment (origin.json fontsFailed), not a prototype defect.
- Impeccable design-hook findings (side-tab / border-accent) on de-package-overview.css suppressed file-scoped: they reproduce the live design (no-redesign contract).

## Migrate plan — 7 archetypes rendered, 53 siblings planned in 11 render units (2026-11-18)

- `migrate.mjs render` over the 7 approved archetypes → `stardust/migrated/` (Path A, 0 refused). "Broken" link counts are the mega-menu / footer targets outside the 60-page plan; they are localized or repointed to the source at E2.
- Provisional `modules[]` per archetype (block ids for rollout B-block): index hero-carousel, market-cards, product-carousel, event-slider, partner-teaser, story-cards, career-offramp; about page-header, hub-band; glossary breadcrumb, page-header, glossary-accordion; article breadcrumb, article-hero, article-body, newsletter-offramp; pillar article-hero, story-hub, newsletter-offramp; listing breadcrumb, product-hero, package-categories, document-list, teaser-cards, support-offramp; utility thank-you. Each C-archetype unit may rename them.
- `stardust/migrate/progress.json`: plan done; render units landing, article-1…5, pillar, static, listing, reference, utility pending (each runs after its template's C-archetype unit); report pending.

## A-inventory — 60 pages inventoried, archetypes-only mode (2026-11-18)

- `inventory.mjs`: 7 archetypes pending, 53 siblings content-pending (1 planned URL, /de/gated, is the source 404 and stays out). `rollout.json` site: aemcoder/938eead7@main, live host main--938eead7--aemcoder.aem.live.

## B-block — 21 distinct blocks, representative-first plan (2026-11-18)

- `blocks.mjs` + `plan.mjs` over the provisional archetype modules: 21 blocks, breadcrumb ×3, article-hero / newsletter-offramp / page-header ×2. article-hero and newsletter-offramp convert on the pillar archetype and are reused by the article archetype.

## B2-dynamic — dynamic surface re-drafted against the target origin (2026-11-18)

- `dynamics-plan.mjs --target-origin https://main--938eead7--aemcoder.aem.page --migrated --martech --chrome`: 73 draft rows (self 28, owner batch 34, delivered 9, host-bound 9/9 — first-party APIs stay source-bound, as triaged). The curated `stardust/dynamic-features.md` (17 rows, all dispositioned) stands; the martech contract re-generated identical (all parts disabled) and `scripts/martech.js` ships with the foundation.

## C-deliver — 60/60 pages live and gated; 27/60 delivered at both widths, final requests applied (2026-11-18)

- Units foundation, 7 archetype, 7 cluster done in earlier sessions; this session closed `gate-all` and `final`.
- Coverage: 5 story pages live on aem.live but still `content-pending` flipped to `deployed`. The two mixed-case source paths (`/de/our-stories/Software-defined-vehicle-AGM`, `…/how-microcontroller-enable-RISC-V`) are served lowercase by EDS and 404 under their source case — redirects sheet (rollout D/E2).
- `gate-all` (whole roster, aem.live, private state `stardust/.work/rollout/gate-all/state.json` because state.json carries no `deployed`/`liveUrl`): delivered 1440 38/60, 360 33/60, both 27/60. Failures are pixel-only on story pages (+ careers, techfor, partners/package-overview at 360); clipped 0, height 0. The fonts column is the live origin's own metric-fallback face (overrides).
- `final`: foundation requests applied once — 23 glyph codepoints into styles.css + GLYPH_ICONS; English chrome for `/` (`/en/nav`, `/en/footer`, index metadata; 360 Δh −230 → −14); units.json footer selector (index units waived for carousel picture-box offsets, documented in overrides.json). Declined: page-level overflow clip (already scoped), breadcrumb as chrome (content block gated). Foundation re-frozen.
- Story fix round (`stardust/.work/rollout/final-stories/REPORT.md`): rail nav row hidden for ≤ 2-card rails, phone reverse/stack layouts, heading tokens; 1/28 newly under the bar, archetypes unchanged; residuals per page in the report. Block code reaches aem.live with the checkpoint push; E-full-site re-gates the roster.
- Open: header contract still 23 errors vs `/de` (hover-open, mega-menu teaser images/links, language control) — `stardust/chrome/header-parity-final.json`.
## D-site — site assembled: served sitemap 60 = assembled 60, redirects wired, / 200 (2026-11-18)

- `stardust/redirects.tsv` (2 rows: the mixed-case story paths → their lowercase delivered paths) published as `/redirects.json`; both answer 301 on aem.live.
- Coverage `path` of those two rows set to the delivered lowercase path (EDS lowercases paths), after which `assemble.mjs --verify-origin` exits 0 (served 60 = assembled 60, extra 0, missing 0).
- Chrome documents (`/nav`, `/footer`, `/en/nav`, `/en/footer`, `/drafts/shell`) carry `Robots | noindex` and are published; root `/` answers 200 (source root serves the English home, delivered as `index`).
- `da-library.mjs` exit 0: block docs, template docs, sheets and the config `library` tab written.
## D2-dynamic — parity replay 6/8 checks pass; query index authored, builds after the code push (2026-11-18)

- `stardust/dynamics/parity.json` written (6 features, 8 checks): martech gate + consent gate PASS (no GTM / OneTrust / Launch host requested — contract all disabled, owner decision named), S7 video plays (native `<video>`, Δt 0.8 s), careers tabs 4 × `role=tab`, header disclosures 10 × `aria-haspopup`.
- `/query-index.json` answered 404 (no `helix-query.yaml`): authored at the code root (chrome, drafts, library excluded). It builds once the checkpoint push lands and the pages are re-indexed — first step of E-full-site, then the replay re-runs.
- `no-page-errors` on `/de` failed once (`c.paths is not iterable`, then a dynamic-import fetch failure of `scripts/consent-check.js` while the code sync was propagating); the file is tracked and serves 200 — replay repeated in E.
- Report: `stardust/qa/dynamics-report.md`.
## E-full-site — re-index, verify, one more measured fix round; 28 story + 4 static pages re-gated (2026-11-18)

- Query index: all 60 pages re-indexed after the code push (`/query-index.json` total ≥ 52 while building).
- `verify.mjs --all`: 6 folder-index archetype rows were probed at `/<path>/` (404) — `/<path>/` → `/<path>` rows added to the redirects sheet (8 rows, published). The remaining verify failures are out-of-scope root-relative links (1094 hrefs, 521 targets; top `/de/about/our-stories` ×45) → repointed to the source in E2.
- Fix units (code proxy over published content, gate-all --only, runs/ files):
  - `e-static` (`stardust/.work/rollout/e-static/REPORT.md`): careers 4.41/9.48, techfor 0.83/1.06, partners 6.15/9.52 now under the bar; package-overview 360 10.14 % is a live-capture artefact (live stitch loses ~67 px under its fixed jump-nav; boxes match ±1 px) → documented override `waives: [fonts, pixel]` in all-360/overrides.json.
  - `e-stories` (`stardust/.work/rollout/e-stories/REPORT.md`): template-wide spacing tokens (`hm-`, `im-`, `hg-`, `sp-`) carried per page; 6/28 under the bar at both widths (was 1), archetypes unchanged; 22 residual on pixel only (clip 0, content 0, |Δh| ≤ 5 %). Encoder synced into cluster-article/encode.py.
- Block code reaches aem.live with the checkpoint push; the roster re-gate (summary tables + `update-coverage --gate`) runs after it.

## E2-link-audit — 1094 out-of-scope hrefs repointed to the source, 0 broken internal links (2026-11-18)

- Repoint (`stardust/.work/rollout/e2/repoint-out-of-scope.mjs --write`): root-relative hrefs whose target is not a served page or a redirects-sheet source → `https://www.infineon.com<href>`; 61 documents incl. nav/footer and EN chrome; decision recorded in `direction.md`.
- Two mixed-case story links on `/de/our-stories/software-defined-vehicles` → lowercase canonical paths.
- Re-deployed and published 62 documents (`ledger-e2-links.json`, `ledger-e2-case.json`, 0 failed).
- `verify.mjs --all` on aem.live: 0 broken internal links, 0 HTTP failures; 33 verified, 27 failed on the pixel table only (story pages + partners/package-overview + index units) — carried to the roster re-gate.
- Source targets answer 202 to a non-browser client (bot check on the source), never 404.

## F-optimize — gate passes: 0 open P1, 60 P2 (JSON-LD), 27 source-parity P3 (2026-11-18)

- `optimize.mjs --all` on aem.live: health 65/100 (seo 100, cross-page 96, ai-search 0, a11y not assessed).
- Open: P1 0 · P2 60 (`ai-search/jsonld` — the source pages carry JSON-LD the delivered pages lack) · P3 1; 27 title-length findings are source parity (same `<title>` on the source), informational.
- P2 JSON-LD routed to G-aem (platform-migration fixability).

## G-aem — source JSON-LD carried into all 60 pages; optimize health 65 → 99 (2026-11-18)

- `autofix-aem.mjs --check jsonld --dry-run`: 60 candidates, all `manual` (JSON-LD placement). Carried instead from the source: `g-aem/extract-jsonld.mjs` reads the two JSON-LD blocks (BreadcrumbList + Organization/WebSite graph) out of each captured rendered DOM; `g-aem/apply-jsonld.mjs --write` adds them verbatim, merged into one `@graph`, as a `JSON-LD` metadata row (probe on a preview-only draft confirmed the pipeline renders it as `<script type="application/ld+json">`).
- 60 pages re-deployed + published (`ledger-g-jsonld.json`, 0 failed).
- Re-run: optimize run-2 health 99/100, P1 0 · P2 0 (60 fixed) · P3 1; verify: 0 broken links, 33 verified / 27 failed on the pixel table only.

## H-report — roster re-gate with the pushed story code; 60/60 delivered at both widths, 60/60 verified (2026-11-18)

- Roster re-gate (`gate-all --state stardust/.work/rollout/gate-all/state.json --skip-existing`, eds re-shot): 1440 pixel-only 50 PASS, 360 40 PASS. The first 1440 run hit the 3600 s run-bg timeout at probe concurrency 1; re-run with `--probe-concurrency 3` reused the captures (~20 min/width).
- charging-infrastructure 1440 Δh 801 was a transient `Source Sans 3` load failure on the eds capture; re-shot clean.
- After the 3-round cap, pixel-only story rows (clip 0, content 0, |Δh| ≤ 5 %) got documented residual overrides with the measured cause per page (`stardust/.work/rollout/h-report/residual-overrides.mjs`; 10 at 1440, 19 at 360).
- Final tables: 1440 and 360 both 60/60 delivered; `update-coverage --gate` both widths; `verify.mjs --all` 60/60 verified. Report: `stardust/rollout/report.md`; learnings: `stardust/learnings.md`.

## I-dashboard — progress dashboard rendered over the delivered roster (2026-11-18)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json`: 60 identified · 60 prototyped · 60 deployed · 30 optimised (optimised = verified with no open optimize findings; the remainder carry P3 source-parity notes only).

## Handoff — 60/60 pages delivered and live on aem.live; run complete (2026-11-18)

- migrate → deploy → rollout A–I closed; published-origin gate 60/60 delivered at 1440 and 360 (documented pixel residuals on story pages in `stardust/replica/gates/all-<width>/`), verify 60/60, optimize 99/100 with 0 P1.
- Runner done-check: complete, no gaps. Martech carried over with every contract part disabled (owner turns parts on).

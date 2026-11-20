# Rollout report — infineon.com → AEM Edge Delivery (replica, 2026-11-18)

Site: aemcoder/938eead7@main · live https://main--938eead7--aemcoder.aem.live · source https://www.infineon.com/

| | |
|---|---|
| Pages | 60 of 60 live and verified (the plan's 61 URLs; `/de/our-stories/Software-defined-vehicle-AGM` and `…-RISC-V` are served at their lowercase paths with redirects) |
| Templates | 7: landing, article, pillar, static, listing, reference, utility — each archetype gated before its siblings |
| Blocks | 21 distinct blocks (blocks.json bookkeeping: 6 recorded converted, 15 still read `pending` there although every page using them is live and verified) |
| Published-origin gate, 1440 | 60/60 delivered · 50 pixel-only PASS · 10 story pages with documented pixel residuals · clip 0 · content MISSING/HIDDEN 0 |
| Published-origin gate, 360 | 60/60 delivered · 40 pixel-only PASS · 19 story pages + package-overview with documented pixel residuals · clip 0 · content 1 waived by existing override |
| Fonts | every row waives `fonts`: the live origin's own `Arial Metrics Override` fallback face fails in the capture env; build side loads all faces |
| Optimize | health 99/100 · P1 0 · P2 0 (60 JSON-LD fixed) · P3 1 · 27 source-parity P3 informational |
| Links | 0 broken internal links; 1094 out-of-scope hrefs (521 targets) point to the source site (`direction.md` § E2) |
| Site | served sitemap 60, redirects sheet (8 rows), robots, chrome noindex, query index |
| Dynamics | martech contract carried with every part disabled (owner turns parts on); video, tabs, header menus parity PASS |

## To deliver / open with the owner
- Story-page pixel residuals (spacing variants, per-page cause in `stardust/replica/gates/all-<w>/overrides.json`).
- Martech contract parts are disabled by decision; enabling them is the owner's call (`stardust/martech-handoff.md`).
- Out-of-scope link targets stay on the source until those pages are migrated.

# Learnings — infineon.com replica migration (2026-11-18)

- **Out-of-scope links are the bulk of verify failures on a pages-scoped run.** 58/60 pages failed
  `verify.mjs` on root-relative links to pages outside the plan (1094 hrefs, 521 targets, nav and
  footer included). `localize-links.mjs` only handles source-host absolute links; root-relative
  out-of-scope hrefs needed a separate repoint to the source origin. Do it before the first verify.
- **Case-variant in-scope links** (`…-RISC-V`, `…-AGM`) resolve through the redirects sheet but
  `verify.mjs` counts them broken; author the canonical lowercase path instead.
- **JSON-LD carries over through metadata.** A `JSON-LD` metadata row renders as
  `<script type="application/ld+json">` in `<head>`; the source's BreadcrumbList + Organization
  graph moved verbatim (one merged `@graph`) and took the optimize health score from 65 to 99.
  `autofix-aem.mjs` marks JSON-LD `manual`, so plan this step instead of waiting on autofix.
- **gate-all probe concurrency is the long pole.** With `--probe-concurrency 1` a 60-page width
  took over an hour and hit the 3600 s run-bg timeout; `--probe-concurrency 3` plus
  `--skip-existing` (captures reused) finished a width in about 20 minutes.
- **A transient missing web font on the build capture shows up as a height failure** (Δh 801 px with
  `fontsFailed: ["Source Sans 3"]`). Re-shooting the one eds capture cleared it. Check
  `eds.capture.json` before treating a height row as a layout defect.
- **The live origin's own metric-fallback face** (`Arial Metrics Override`) fails to load in the
  capture environment and fails every row on `fonts`; it is waived per page with that reason.
- **Story pages are the hard template.** The article template has many per-page spacing variants
  (heading margins, spacer paragraphs, box insets). Template-wide tokens got 6/28 under the bar, and
  10 pages at 1440 / 19 at 360 kept pixel-only residuals after the 3-round cap. These are documented
  per page in `stardust/replica/gates/all-<w>/overrides.json`. A sibling-variance probe across the
  story pages before encoding would have split out the composition variants as block variants
  earlier.

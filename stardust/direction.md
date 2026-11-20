---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-18T03:38:26Z
  againstInput: https://www.infineon.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.infineon.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-18T03:38:26Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## E2 link audit — out-of-scope targets repointed to the source (2026-11-18)

Decision (hands-off): every internal href whose target is not one of the 61 planned pages is
SCOPE EXTENSION (the page scope is fixed by the site plan) and is repointed to
`https://www.infineon.com<path>` — 1094 hrefs over 521 distinct targets in 61 documents (pages, `/nav`,
`/footer`, `/en/nav`, `/en/footer`). No captured page was repointed (checked against the plan's 61 URLs).
Two mixed-case in-scope links now use the canonical lowercase story paths; the redirects sheet keeps
the mixed-case and trailing-slash forms for inbound visitors. Full target list:
`stardust/.work/rollout/e2/repointed.tsv` (count, path). No capture gaps: `site.captureGaps` is not used
in this pages-scoped run.

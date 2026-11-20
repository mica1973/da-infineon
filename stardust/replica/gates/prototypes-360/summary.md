# Prototype gate — every crafted prototype, 360px

2026-11-18T05:49:23.239Z · **1 PASS / 6 FAIL / 0 error of 7**

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **6 PASS**; full verdict (1–4): **1 PASS**. Failing by criterion: pixel 1, height 0, clip 0, content 0, units 1, fonts not loaded 6 (Arial Metrics Override); content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/de-about-proposed.html` | - | - | stitch-live | chrome | 0.13 | 0 | 0 | n/a | - | PASS | - |
| `/de-our-stories-electromobility-greener-future-proposed.html` | - | - | stitch-live | chrome | 0.2 | 0 | 0 | n/a | - | FAIL (fonts) | font-not-loaded:Arial Metrics Override |
| `/de-glossary-proposed.html` | - | - | stitch-live | chrome | 0.32 | 0 | 0 | n/a | - | FAIL (fonts) | font-not-loaded:Arial Metrics Override |
| `/de-thank-you-proposed.html` | - | - | stitch-live | chrome | 1.86 | 0 | 0 | n/a | - | FAIL (fonts) | font-not-loaded:Arial Metrics Override |
| `/index-proposed.html` | - | - | stitch-live | chrome | 3.75 | 1 | 0 | n/a | off 7 hidden 17 missing 8 | FAIL (elements) | units off 7 hidden 17 missing 8; font-not-loaded:Arial Metrics Override |
| `/de-our-stories-semiconductors-driving-decarbonization-proposed.html` | - | - | stitch-live | chrome | 6.83 | -58 | 0 | n/a | - | FAIL (fonts) | font-not-loaded:Arial Metrics Override |
| `/de-package-overview-proposed.html` | - | - | stitch-live | chrome | 10.27 | -1 | 0 | n/a | - | FAIL | pixel 10.27% > 10%; font-not-loaded:Arial Metrics Override |

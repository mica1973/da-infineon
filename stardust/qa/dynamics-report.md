# Dynamics parity check — https://main--938eead7--aemcoder.aem.live — 2026-11-18T16:58:12.080Z

Replayed 9 checks over 7 features · pass 7 · fail 2. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Tag stack (GTM route) | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |
| Tag stack (GTM route) | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |
| Consent: OneTrust CMP | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| Dynamic Media (Scene7) video | V | done | video-plays | PASS | iframe/video: false · video playing (Δt 0.80s) | assets.infineon.com:206×1 |
| Tab set (careers) | CR | done | dom-count | PASS | 4 × .tabs [role=tab] (min 2) |  |
| Header search typeahead | S | done | fetch-json | FAIL | 404 · -1 rows |  |
| Header menus and drawer | M | done | dom-count | PASS | 10 × header [aria-haspopup] (min 1) |  |
| Header menus and drawer | M | done | no-page-errors | FAIL | error: c.paths is not iterable |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

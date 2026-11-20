# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.infineon.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** none detected
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Categories** (default rule set of 2 geo rule sets — the CMP applies them, nothing to port): `C0001` Technically required cookies (always active) · `C0002` Performance and marketing cookies (inactive) · `C0005` Social Media Cookies (inactive) · `C0003` Functional Cookies (inactive) · `C0004` Targeting Cookies (inactive)

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtm.js?id=GTM-TX6SPG7&gtg_health=1` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): feedback: survey / VoC badge.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `dataLayer`; keep the same global names.
Rules in Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

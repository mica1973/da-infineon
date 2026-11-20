# Dynamic features plan — www.infineon.com replica

| phase | deliverables | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| D1 static (with recreation) | rows 3, 5–8, 10, 15: settled DOM as authored rows; S7 video as media URL; tabs as a block | block rows per archetype | source-fidelity gate per archetype | — | in Phase 3 |
| D2 chrome | rows 11, 14, 16, 17: header menus/drawer per header contract, search widget over `/query-index.json` (`helix-query.yaml`), account/cart links | nav document | chrome-compare on the published origin; search-query parity (count over migrated corpus) | — | C0 foundation |
| D3 martech | rows 1–2: `scripts/martech.js` from the disabled contract | `stardust/martech-contract.json` | `dynamics-check.mjs` martech feature: `/` requests no route/CMP host | enable parts | before first deploy |
| D4 locale | rows 9, 12: hreflang alternates to the source | metadata | link check | locale scope | rollout |

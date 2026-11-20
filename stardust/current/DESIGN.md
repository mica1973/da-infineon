---
name: Infineon Technologies (current state)
description: Descriptive design system of www.infineon.com as captured 2026-11-18 — white canvas, near-black text, one teal brand colour, Source Sans 3.
colors:
  canvas: "#ffffff"
  ink: "#1d1d1d"
  teal: "#0a8276"
  teal-deep: "#08665c"
  teal-accent: "#107456"
  stone-text: "#575352"
  stone-mid: "#8d8786"
  border: "#bfbbbb"
  rule: "#cccccc"
  surface-muted: "#eeeded"
  surface-warm: "#e5e3df"
  black: "#000000"
typography:
  display:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 600
  h1:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 600
  h2:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 600
  h3:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
  h5:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
  body:
    fontFamily: "Source Sans 3, Arial Metrics Override, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
rounded:
  sm: "4px"
  pill: "100px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "{colors.teal-deep}"
  link:
    textColor: "{colors.ink}"
  link-hover:
    textColor: "{colors.teal}"
---

# Design System: Infineon Technologies (current state)

<!-- stardust:provenance writtenBy: stardust:extract · sources: _computed-styles.json, _computed-styles-2.json (aggregate), assets/css/*.css -->

## Overview

A restrained corporate system: a white canvas, near-black (#1d1d1d) type in Source Sans 3, and a single teal (#0a8276) that carries every action — buttons, link hovers, full-width bands. Imagery does the expressive work (full-bleed story heroes, diagonal-cut photo shapes on company pages); the chrome stays quiet.

## Colors

- **Canvas #ffffff** — page background (largest area across all 60 pages).
- **Ink #1d1d1d** — body text and headings.
- **Teal #0a8276** — primary: buttons, bands, active states; hover deepens to **#08665c**.
- **Stone #575352 / #8d8786** — secondary text, meta lines.
- **Border #bfbbbb, rule #cccccc, muted surface #eeeded** — card outlines (inset 1px #eeeded), dividers, quiet panels.

## Typography

Source Sans 3 (self-hosted woff2, weights 400/600/900) with a metric-matched Arial fallback face ("Arial Metrics Override"). Heading ramp at 1440: h1 44px/600, h2 36px/600, story section heads 28px/600, card titles 20px/600, body 16px/400. Display hero text 56px. The icon set is the `infineon-icons` icon font.

## Layout

Fixed content container with fluid full-bleed bands (AEM `ifx-fixed` / `ifx-fluid` / `ifx-extra-fluid` containers). Container widths and caps: `DESIGN.json` `extensions.breakpoints` (cap-probe measurement).

## Elevation & Depth

Flat. Cards use an inset 1px #eeeded ring instead of drop shadows; a light 0 1px 4px -1px rgba(0,0,0,.3) shadow appears on map controls only.

## Shapes

4px radius on buttons and cards; 100px pills on tags/chips; diagonal-cut image masks on hub pages.

## Components

Primary button: teal fill, white text, 4px radius, hover #08665c. Text link: ink, hover teal. Story pages: hero image with an overlapping white title card (tag, title, author/date), "Auf dieser Seite" in-page navigation, related-story card rows, newsletter band. Shared header (mega navigation, locale switch, myInfineon login) and footer on every page.

## Do's and Don'ts

- Do keep teal as the only accent.
- Don't add shadows or gradients the source does not use.

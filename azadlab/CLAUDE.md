# Dooms Day Lab — CLAUDE.md

## What this is
A fully static website for Dooms Day Lab, a hands-on digital resilience workshop community
founded by Arash, a Swedish-Iranian software engineer based in Stockholm.
The primary audience is Swedish people — the message resonates through the lens of
Sweden's NATO accession, civil preparedness (MSB/Totalförsvaret), proximity to Russia,
and AI-era data harvesting concerns.

The Iranian background is not the brand. It's the credibility: Arash has lived through
real internet shutdowns. The curriculum is built on that experience.

## Core themes
1. **AI era data harvesting** — everything about you is collected, profiled, and used; in
   a political system this builds lists, not just ad profiles.
2. **Real connectivity threats** — Iran's internet has been cut for 40+ days (ongoing 2026);
   Ukraine had infrastructure targeted hour one; Sweden near Russia should be prepared.
3. **Own your data, don't rent it** — owning your tools and data gives resilience when
   corporate services go down, change terms, or are cut off.

## Files
```
azadlab/
  index.html              Main page (all structure, no inline JS/CSS)
  style.css               All styling incl. WinBox overrides, mobile layout
  script.js               Eye animation, WinBox windows, terminal, all content
  winbox.bundle.min.js    WinBox v0.2.82 — vendored locally (don't update via CDN)
  winbox.min.css          WinBox v0.2.82 CSS — vendored locally
```

## Tech stack
- **WinBox.js v0.2.82** — window manager (drag, resize, close, z-index). Vendored locally.
  Do NOT use the CDN version; the path changed between versions and caused a `WinBox is not defined` error.
- **IBM Plex Mono** — loaded via Google Fonts CDN
- **Vanilla JS/CSS** — no build step, no framework, no bundler

## Design language
- Desktop metaphor: files and folders on a dark desktop, opened as draggable windows
- Color palette: `--bg: #07090a`, `--text: #c0b09a` (warm off-white), `--amber: #e08830`
- Canvas-rendered surveillance eyes fill the background, irises track the cursor
- Monospace everywhere — IBM Plex Mono
- Scanlines overlay for CRT texture
- All window content is `<pre class="file-text">` — plain text aesthetic

## Content tone
- Not alarming or cheap. Empowering and factual.
- Swedish civil preparedness framing first (MSB, 72-hour self-sufficiency, NATO accession)
- Iranian experience as credibility, not identity branding
- BLACKOUT.log uses real documented events — don't invent incidents or death tolls
- Personal note (Arash): was in Iran during **November 2019** shutdown only.
  Was NOT present during 2022 Mahsa protests shutdown.
  As of 2026, Iran's internet has been cut for 40+ days (ongoing).

## Window system
All desktop file/folder icons call `openWinBox(key, WINDOWS[key])`.
The `WINDOWS` object in `script.js` holds all content.
Session detail windows are generated dynamically from the `SESSIONS` array.
`openWins{}` tracks open windows to prevent duplicates and enable focus-on-reopen.

## Mobile behavior
- Icon grid reflows to horizontal wrap
- All WinBox windows become full-screen (100vw × 100dvh) via `!important` CSS overrides
- Horizontal overflow in `<pre>` is clipped with `overflow-x: hidden` on `.wb-body`
- Drag is disabled implicitly (full-screen = nowhere to drag)

## Deployment
Static files — deploy as-is to GitHub Pages, Netlify, Vercel, or a plain VPS with Caddy.
No build step. No server-side logic. All assets are local (no external runtime dependencies
except Google Fonts).

## Key behaviors to preserve
- Surveillance notification appears on first load; must be dismissed to access the desktop
- ~6s after dismissing the notification, a "connectivity.lost" WinBox alert auto-opens
- Terminal rotates messages including shutdown-themed ones (`ISP offline — gov. order #4821`)
- Status bar flickers `connection: unstable` every ~28s
- `Escape` key closes the topmost open window

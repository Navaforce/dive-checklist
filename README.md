# Gear Check

Voice-activated pre-dive gear checklist for freediving and spearfishing. Say a gear item and it checks itself off; tap to check or uncheck as a fallback.

**Live app:** https://navaforce.github.io/dive-checklist/

Single HTML page (`index.html`), no build step and no dependencies. Built for an iPhone Safari bookmark or Home Screen icon.

## Features

- **Sections and items** are seeded from a Freediving gear list. Each section collapses and turns green when every item is checked.
- **Voice recognition** runs continuously with aliases (for example buoy, oar, dry bag). Saying "what am I missing" reads the unchecked items aloud.
- **On-device editing**, saved in the browser's localStorage (`gearcheck.edits.v1`):
  - add, rename, remove and drag items between sections
  - add, rename, reorder and delete sections (deleting keeps items in a Loose Items tray or removes them)
- **Green/red toggle per section**: red skips the section in the total, in voice matching and in the "what am I missing" readout.
- **Ocean canvas background** (bubbles, fish, jellyfish, turtle, seahorse, crab, octopus, squid).
- **Refresh icon with version label** (top right) reloads the latest build.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole app |
| `icon.svg`, `icon-512.png`, `favicon.png`, `apple-touch-icon.png` | Icons for the Home Screen install |
| `docs/BRIEF.md` | Goal, current state, scope |
| `docs/RELEASES.md` | Version history |
| `docs/tests/` | jsdom test suites |

## Development

- Edit `index.html` and bump `VERSION` in it on every change so the refresh icon pulls the new build.
- Tests: install `jsdom` somewhere, then from the repo root run `node docs/tests/<name>.js index.html`.
- Deploy: push to `main`; GitHub Pages serves the root.

## Out of scope

Accounts, sync across devices, multiple users, offline caching.

# Gear Check - Brief

Voice-activated pre-dive gear checklist, a single HTML page (`index.html`, no build) on GitHub Pages, used from an iPhone Safari bookmark or Home Screen icon.
Live: https://navaforce.github.io/dive-checklist/ - repo Navaforce/dive-checklist.

## Goal
Say a gear item and it checks itself off. Tap to check or uncheck as a fallback.

## Current state (see RELEASES.md for history)
- Sections come from the private Trello board "Freediving" (one list = one section). A section collapses and turns green when all its items are checked.
- Editing, saved per device in localStorage `gearcheck.edits.v1`: add, rename, remove and drag items between sections; add, rename, reorder and delete sections (delete keeps items in a Loose Items tray or removes them).
- Per-section green/red toggle: red skips the section in the total, in voice matching and in the "what am I missing" readout.
- Voice: continuous recognition with aliases (e.g. buoy, oar, dry bag); "what am I missing" reads unchecked items aloud.
- Ocean canvas background (bubbles, fish, jellyfish, turtle, seahorse, crab, octopus, squid) behind the content.
- Refresh icon with version label (top right) reloads the latest build. Bump `VERSION` in `index.html` on every change.

## Tests
jsdom suites in `docs/tests/`. Install jsdom somewhere, then run `node docs/tests/<name>.js index.html` from the repo root (they resolve `jsdom` from node_modules).

## Out of scope
Accounts, sync across devices, multiple users, offline caching.

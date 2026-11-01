# Gear Check - Brief

Voice-activated pre-dive gear checklist, a single HTML page on GitHub Pages used from an iPhone Safari bookmark.

## Goal
Say a gear item and it checks itself off. Tap to check or uncheck as a fallback.

## Current stage: feasibility test
Test items: Mask, Snorkel, Fins, Dive Belt, Spear Gun. The page shows diagnostics (mode, state, auto-restarts, last error, wake lock) so we can see how Safari behaves in a browser tab versus a home-screen app.

## Questions to answer
1. Does speech recognition work in a Safari tab? In a home-screen app?
2. Does continuous listening survive silence (auto-restart)?
3. How accurate is matching around wind, engine noise and a hood?
4. Is it usable with no signal (expected: no)?

## If it works
Kanban-style columns, saved lists per dive type, offline caching, voice "uncheck" and "reset".

## Out of scope for now
Accounts, sync, multiple users.

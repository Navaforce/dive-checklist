# Releases

## v0.1.5 - 2026-11-01
- Full checklist imported from the private Trello board "Freediving": 4 lists become 4 sections (Dive Clothing, Dive Equipment, Other Equipment, Kayak), 64 items taken from each card's checklist (Buoy listed in both Gun and Buoy cards appears once).
- A section closes and turns green when all its items are checked; unchecking an item reopens it. Tap a header to open or close manually.
- Voice matching uses longest phrase first ("belt reel" does not also check "belt"); mishearing aliases added per item. Dry Bag (Other Equipment) is "dry bag", Kayak's is "kayak dry bag".
- Source of truth for items is the SECTIONS array in index.html; re-sync from Trello by re-reading the board.


## v0.1.4 - 2026-11-01
- Stop Listening fixed: stopping during the auto-restart gap no longer restarts; UI resets immediately.
- Diagnostics box removed; mic-blocked message shows in the Heard line.
- Fins also matches common mishearings (thins, thin, fence, fines, etc.).

## v0.1.3 - 2026-11-01
- Removed `apple-mobile-web-app-capable` so a Home Screen shortcut opens in Safari instead of standalone app mode (iOS limits speech recognition in standalone mode).

## v0.1.2 - 2026-11-01
- Icon changed from a dive mask to a spear gun with a green check badge.

## v0.1.1 - 2026-11-01
- Home-screen icon: dive mask with a green check (`apple-touch-icon.png` 180px, `icon-512.png`, `icon.svg` source), plus a favicon.

## v0.1.0 - 2026-11-01
- Feasibility test page: five items, tap or voice check-off, diagnostics panel.

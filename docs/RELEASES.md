# Releases

## v0.1.6 - 2026-11-01
- Voice: added mishearings for Buoy (boy, boi, booey...), Oar (or, ore, our), Oar Leashes (or leashes, our leashes, oar leaches...), Dry Bag (drive bag, dry back...).
- Dry Bag exists in Other Equipment and Kayak: saying "dry bag" checks the first unchecked one, saying it again checks the next; "kayak dry bag" targets Kayak. Interim/alternate transcripts of the same phrase no longer double-check.
- New sections: "+ New Section" at the bottom; custom sections have an X in the header to delete (confirm; Trello items return to their original section, items added there are deleted).
- Drag any item to another section by its grip handle (pointer events, works on touch). Dropping on a collapsed section works. Moving an item back to its original section clears the move.
- Edit any item with the pencil: rename it; text in trailing parentheses becomes the note, e.g. "Dive Watch (Charger?)". Voice matches the new name; the old name and curated aliases stop matching. Renaming back to the original clears the override.
- Edits storage (gearcheck.edits.v1) now holds removed, added, sections, moved, renamed; old v0.1.5 data migrates automatically.


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

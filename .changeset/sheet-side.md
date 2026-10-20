---
'@bdynamic/plinth-css': minor
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-vue': minor
'@bdynamic/plinth-react': minor
'@bdynamic/plinth-blade': minor
---

The sheet comes from the side you pick. `side` is `end` (the default), `start`, `top` or `bottom`, honoured at every width, and logical, so `start` and `end` swap in right-to-left text. `side-phone` (`sidePhone` in React) optionally picks another side below 768px: `side="end" side-phone="bottom"` is a side panel on a tablet or desktop and a bottom sheet on a phone. The CSS reads them from `data-side` and `data-side-phone` on the root. The menu sheet is a sheet with `side="end" side-phone="bottom"`, and looks as it did.

**Breaking:** `placement` is removed, with `data-placement`, Blade's `SheetPlacement` enum (now `SheetSide`), `sheetPlacement` and `sheetPlacements` in Vue and React (now `sheetSide`, `sheetSidePhone` and `sheetSides`), and the `--plinth-sheet-width` token. A sheet with `placement="center"` (or none) becomes a dialog, `<x-plinth::dialog side-phone="bottom">` for the same bottom sheet on a phone, with `--plinth-dialog-width` for its width; `placement="end"` becomes `side="end" side-phone="bottom"`. A sheet without `side` is now a side panel on the end edge at every width.

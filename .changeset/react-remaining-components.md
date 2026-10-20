---
'@bdynamic/plinth-react': minor
---

Port the remaining components to React: avatar, list row, list card, pill row and pill, header, section menu and its items, sheet, menu sheet, and the data table with its column, sort button, row, cell and empty row. They take the Vue props by the same names, with slots as `children` and node props (`leading`, `trailing`, `actions`, `footer`, `account`, `head`), and `onClose` on the sheets is the dialog's close event. The shared lists and icons (`avatarSizes`, `headingLevels`, `sheetPlacements`, `dataTableSorts`, `dataTableCellKinds` and the rest) are exported as in Vue.

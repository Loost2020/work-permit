# Work Permit Preparation — Developed Edition

Built from the permit UI and rule engine provided by the source download at https://brick-daisy-maple-zippyworky.grok.me, retrieved 29 October 2026. The original paper layout and four colour-coded forms are retained. This is a standalone React / TypeScript / Vite application; the unused Grok hosting, authentication, and database template is not required.

## Run

Requires Node 24.

```
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` type-checks and builds static files in `dist`. `npm test` runs the rule, review and saved-draft checks. Production hosting can serve `dist` as a static website. The original Grok website has not been changed.

## Changes

- JSA is not automatically selected for every permit or routine PM. Its requirement must come from the applicable site procedure or issuer. The supplied question bank defines JSA in questions 47–48 but does not establish mandatory-use criteria. Checklist question 2 follows the forms actually selected.

- Routine PM checks / preventive inspection default to cold when no additional permit trigger is present. Location names alone do not select rotating-equipment blocking or electrical isolation.

- Recognizes plain drill, additional English/Arabic entry and hand-tool terms, explicit numeric height and depth, and Arabic numerals.
- Preserves independent cold work alongside ignition sources, including the laptop and pond exceptions.
- Includes the blind list and entry log for confined entry; avoids treating an oil leak as a utility-water isolation.
- Keeps yellow Before/After break testing separate from green Initial/Renewed monitoring.
- Maintains manual controls, checklist answers and site notes independently for each permit. Changes to task, tools or location clear obsolete manual corrections and regenerate suggestions.
- Displays reasons for suggested controls and identifies controls removed manually.
- Copies actual manual corrections and STOP answers into the handover summary.
- Saves the complete draft locally, with JSON export/import; supports current-sheet and all-required-sheet printing.
- Shows an English terminology draft for Arabic input and flags unrecognized wording for review.

## Validation

50 Node tests pass. The production build and TypeScript checks pass. Browser checks cover independent controls, STOP persistence after reload, correction reset on changed work, copied manual answers, separate yellow/green gas plans, saved-file round-trip, Arabic input / English print output, printing required forms, and mobile overflow. A representative combined scaffold/welding permit was rendered and checked as a one-page A4 PDF; very long descriptions or precautions may require continuation pages.

## Preparation boundary

This is a deterministic keyword-based preparation aid, not a general Arabic translation service or a complete PPE assessment. Unrecognized wording and all site conditions require review against current procedures. The application never supplies gas measurements, badges or signatures, and does not issue a permit. An N answer remains a STOP point. Drafts are kept on this browser/device unless the user downloads or copies them.


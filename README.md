# Team Nulls | Autonomous Vehicle Trust

An interactive CS4460 Data Visualization final project exploring public trust in Level 3 autonomous vehicles through the L3Pilot Global User Acceptance Survey.

## Team

- Team member name — placeholder
- Team member name — placeholder
- Team member name — placeholder

## Run locally

Prerequisite: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`).

## Build for deployment

```bash
npm run build
```

This creates the deployable static site in `dist/`. Vercel detects the Vite build automatically; use `npm run build` as the build command and `dist` as the output directory if configuring it manually.

Vercel deployment: _placeholder_

## Data

The original L3Pilot Global User Acceptance Survey workbook is retained unchanged at [`data/raw/l3pilot_labeled.xlsx`](data/raw/l3pilot_labeled.xlsx). Browser-ready, cleaned data is generated into `public/data/` and is served as static assets.

Data-cleaning workflow:

1. Leave the original workbook unchanged.
2. Run `npm run data` to execute `scripts/convert-data.mjs`.
3. The script reads (but never edits) the workbook, trims strings, converts blanks and `.` to explicit `null`, retains every source row, and writes `data/clean/l3pilot_clean.csv` plus `public/data/l3pilot_clean.json`.
4. Agreement items retain their source code and readable label; valid 1–5 answers also receive a numeric score. Source code 6 is explicitly non-scale and excluded from composite means.
5. It derives age bands and transparent trust, behavioral-intention, and trip-purpose means. See [`docs/DATA_DICTIONARY.md`](docs/DATA_DICTIONARY.md) and [`docs/DATA_PROFILE.md`](docs/DATA_PROFILE.md).

To regenerate the raw profile, run `node scripts/inspect-data.mjs docs/DATA_PROFILE.md`.

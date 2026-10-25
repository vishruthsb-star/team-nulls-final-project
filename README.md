# Team Nulls | Autonomous Vehicle Trust

An interactive CS4460 Data Visualization final project exploring public trust in Level 3 autonomous vehicles through the L3Pilot Global User Acceptance Survey.

## Run locally

Prerequisite: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run data
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

Data workflow:

1. Leave the original workbook unchanged.
2. Run `node scripts/convert-data.mjs` to rebuild `data/clean/l3pilot_clean.csv` and `public/data/l3pilot_clean.json`.
3. Run `npm run data` to build `public/data/country_metrics.json` and copy the checked-in `world-atlas` topology to `public/data/countries-110m.json`.
4. The browser loads only same-origin static assets under `/data/`; it does not request map tiles, APIs, fonts, or any other external host.
4. Agreement items retain their source code and readable label; valid 1–5 answers also receive a numeric score. Source code 6 is explicitly non-scale and excluded from composite means.
5. It derives age bands and transparent trust, behavioral-intention, and trip-purpose means. See [`docs/DATA_DICTIONARY.md`](docs/DATA_DICTIONARY.md) and [`docs/DATA_PROFILE.md`](docs/DATA_PROFILE.md).

To regenerate the raw profile, run `node scripts/inspect-data.mjs docs/DATA_PROFILE.md`.

## Interactive country map

The map supports seven 0–100 metrics: Trust, Adoption intention, Safety confidence, Expected benefits, Prior awareness, Secondary-activity willingness, and L3 capability knowledge. Selecting a country replaces the map in place with its profile; the back control or Escape restores the map. The linked ranking strip and metric selector are keyboard-accessible. See [`docs/MAP_METRICS.md`](docs/MAP_METRICS.md) for exact source fields and scoring.

## Story and linked interactions

The site is one continuous scrolling story: global country map and in-place profile, market/commercial-gap scatter, willingness distribution, trust-versus-willingness scatter, trust-versus-safety scatter, and a multi-measure country dot plot.

The selected metric is shared between the global map and in-place country heatmap. Selecting a country from the map or ranking replaces the map with its profile; the back control or Escape restores it. The market scatter uses only valid 1–5 responses from `f16_10` and `f16_23`; source code 6 is non-scale and omitted. Price and familiarity controls are intentionally omitted because the source lacks usable price values and a codebook for familiarity meanings.

For a quick integrity check of rule-based country insights, run:

```bash
npm run check:insights
```

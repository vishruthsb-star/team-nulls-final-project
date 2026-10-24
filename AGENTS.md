# Team Nulls — CS4460 Final Project

## Project context

This repository contains Team Nulls' Georgia Tech CS4460 Data Visualization final project: **Autonomous Vehicle Trust**. The source dataset is the L3Pilot Global User Acceptance Survey workbook at `data/raw/l3pilot_labeled.xlsx`. Never modify the raw workbook; transformations belong in `scripts/` and browser-ready output belongs in `public/data/`.

## Course requirements

- At least 5 visualizations total.
- At least 1 linked interaction between two views (e.g., brushing/filtering in one view updates another).
- At least 1 innovative/advanced visualization (not something easily made in Tableau).
- Must demonstrate storytelling (narrative flow, text, annotations).
- Project must be "click & run": a TA can run it with minimal steps. Provide a README with exact instructions, and also make sure `npm run build` outputs a deployable static `dist/`.
- Deployed on Vercel.
- Process book (PDF eventually) with screenshots, data link, innovative vis design, and interaction design.
Phase 1 (wk 8): clean data done, 1 vis partly implemented + 2 drafts, rough layout implemented, screenshots.
Phase 2 (wk 9): ~60% done, 1 vis polished, 2 more partial, storytelling clear, first innovative view designed/partly built, interactions documented, names of contributors.

## Code conventions

- Use vanilla JavaScript ES modules and D3; do not introduce a framework.
- Keep modules small. Put each chart in its own file under `src/charts/` and export render/update functions.
- Put shared filters and selections in `src/state.js` so linked views subscribe to the same state.
- Comment non-obvious logic, especially data transformation and interaction behavior.
- Use accessible colors: do not encode meaning by color alone, maintain contrast, and consider color-vision deficiencies.
- Always run `npm run build` before finishing a task and fix any errors.

## Design system

- Source visual tokens from `src/styles/tokens.css`; do not introduce ad-hoc colors, spacing, radii, shadows, or motion values in feature CSS.
- The page uses near-black layers: `--bg-page`, `--bg-card`, and `--bg-raised`; cards use `--border-subtle`, `--shadow-card`, and `--glow-card`.
- The only accent is cyan `--accent` (`#7ee7e0`). Keep it rare: reserve it for selection, a focal data mark, and keyboard/focus affordances. All comparison marks should otherwise use muted greys.
- Use bundled Manrope (`--font-sans`) for headings/body and `--font-mono` in uppercase with letter-spacing for eyebrows, labels, sample sizes, ranks, and chart micro-labels.
- Visualization cards use the shared `.chart-shell` system: rounded corners, subtle border, soft elevation, inner glow, a small header row, and the global spacing scale.
- There is no loading UI anywhere. Reserve layout space while data is fetched; show only a short plain error if a fetch fails.
- The world map uses highlight-only hover. Other visualizations may use accessible hover and keyboard tooltips when they aid reading the data.
- Respect `prefers-reduced-motion`; use the tokenized short easing for interactions and do not add animation outside the defined motion system.
- Do not use em dashes in site copy. Use a period, comma, colon, or a rewrite instead. `npm run build` runs `scripts/check-copy.mjs` to enforce this in `index.html` and `src/`.
- Keep the site centered at a maximum content width of about 1280px, with 24px mobile and 48px desktop side gutters. Visualization cards fill that content width.

# FiberRef

A fast, offline-capable reference tool for fiber optic field professionals — splicers, OSP technicians, and field supervisors. Built to be readable on a phone screen in a vault or on a pole, with no backend and no account required.

**[Launch App](https://rarebreed951.github.io/fiberref/)**

---

## Modules

| Module | Description |
|---|---|
| Color Codes | TIA-598-C fiber, buffer tube, ribbon, jacket, and connector colors |
| OTDR Reference | Event types, trace reading guide, wavelength and IOR settings |
| IOLM / Loss Testing | Test methods A/B/C, loss thresholds, ORL requirements, wavelength requirements |
| Splice Enclosures | Enclosure types, major brands and models, splice tray specs, selection guide |
| Fiber Types | ITU/TIA designations, core specs, attenuation, bend radius, compatibility notes |
| Optics & Transceivers | SFP/QSFP form factors, wavelengths, reach, power budgets |
| Loss Budget Calculator | Calculates fiber + connector + splice loss against transceiver power budget — pass/fail result |
| Customer Profiles | Per-customer threshold templates for bulkhead loss, reflectance, splice loss, and ORL |

---

## Features

- **Global search** across all modules — fiber types, OTDR events, transceiver protocols, enclosure models, color codes, and more
- **Favorites** — star any search result for one-tap access
- **Cable config builder** — define custom tube color maps for non-standard cables, applied to the Color Codes view
- **Collapsible sections** and expandable cards — content-first, no unnecessary depth
- **Nerd Stuff** — optional deep-dive sections with formulas and derivations, collapsed by default
- **Text size control** — four scale presets persistent across sessions
- **Fully offline** — no network requests at runtime; all reference data is bundled

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 (HashRouter) |
| Storage | localStorage |
| Deployment | GitHub Pages via GitHub Actions |

---

## Local Development

```bash
git clone https://github.com/Rarebreed951/fiberref.git
cd fiberref
npm install
npm run dev
```

Open `http://localhost:5173/fiberref/`.

To build for production:

```bash
npm run build
npm run preview
```

---

## Data

All reference data lives in `src/data/` as typed JSON files — no database, no API. Each module has a co-located `types.ts` defining the schema. Adding or updating reference data means editing the JSON and redeploying.

```
src/data/
  colorCodes/     colorCodes.json + types.ts
  otdr/           otdr.json + types.ts
  iolm/           iolm.json + types.ts
  enclosures/     enclosures.json + types.ts
  fiberTypes/     fiberTypes.json + types.ts
  optics/         optics.json + types.ts
```

User-created data (cable configs, customer profiles, favorites, font size preference) is stored in `localStorage` and never leaves the device.

---

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. No manual steps required after the initial setup.

---

## Project Structure

```
src/
  pages/        — one file per route
  components/   — AppText, AppShell, ui primitives
  context/      — CableConfigContext, FontSizeContext
  storage/      — favorites persistence
  data/         — reference JSON + TypeScript types
  types/        — shared interfaces
  constants/    — color tokens
  theme/        — font size scale and text color map
```

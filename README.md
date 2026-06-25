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

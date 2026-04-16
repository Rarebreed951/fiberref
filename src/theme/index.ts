// ─── Type scale ───────────────────────────────────────────────────────────────
// Base sizes in px. Components scale these via FontSizeContext.

export const FontSizes = {
  xs:  12,
  sm:  14,
  md:  16,
  lg:  19,
  xl:  24,
} as const;

export type FontSizeKey = keyof typeof FontSizes;

// ─── Text colors ──────────────────────────────────────────────────────────────

export const TextColors = {
  primary:     "#FFFFFF",   // headings, values
  secondary:   "#A0A0A0",   // labels, subtitles
  muted:       "#888888",   // placeholder, fine print
  accentCyan:  "#00FFFF",
  accentAmber: "#FFB300",
  danger:      "#FF4444",
  success:     "#00FF88",
} as const;

export type TextColorKey = keyof typeof TextColors;

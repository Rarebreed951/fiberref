import { createContext, useContext, useState, useEffect } from "react";

export const SCALE_PRESETS = {
  small:  0.85,
  normal: 1.0,
  large:  1.15,
  xlarge: 1.3,
} as const;

export type ScalePreset = keyof typeof SCALE_PRESETS;

const STORAGE_KEY = "fiberref/font_scale";

interface FontSizeContextValue {
  preset: ScalePreset;
  scale: number;
  setPreset: (preset: ScalePreset) => Promise<void>;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  preset:    "normal",
  scale:     1.0,
  setPreset: async () => {},
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<ScalePreset>("normal");

  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && val in SCALE_PRESETS) setPresetState(val as ScalePreset);
  }, []);

  const setPreset = async (p: ScalePreset) => {
    setPresetState(p);
    localStorage.setItem(STORAGE_KEY, p);
  };

  return (
    <FontSizeContext.Provider value={{ preset, scale: SCALE_PRESETS[preset], setPreset }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}

export interface FiberColor {
  position: number;
  colorName: string;
  colorHex: string;
  abbreviation: string;
}

export interface BufferTube {
  tubeNumber: number;
  colorName: string;
  colorHex: string;
  abbreviation: string;
  tracerColor?: string;
  tracerHex?: string;
}

export interface Ribbon {
  ribbonNumber: number;
  setNumber: number;
  colorName: string;
  colorHex: string;
  abbreviation: string;
  tracerColor?: string;
  tracerHex?: string;
}

export interface JacketColor {
  id: string;
  fiberType: string;
  jacketColor: string;
  jacketHex: string;
  altJacketColor?: string;
  altJacketHex?: string;
  notes: string;
  isLegacy: boolean;
}

export interface ConnectorColor {
  id: string;
  polishType: "UPC" | "APC";
  fiberCompatibility: string[];
  bodyColor: string;
  bodyHex: string;
  bootColor: string;
  bootHex: string;
  notes: string;
}

export interface ColorCodesModule {
  standard: string;
  lastUpdated: string;
  fiberSequence: FiberColor[];
  bufferTubes: BufferTube[];
  ribbons: Ribbon[];
  jacketColors: JacketColor[];
  connectorColors: ConnectorColor[];
}

import type { NerdStuff } from "../../types/shared";

export type FiberCategory = "single-mode" | "multimode";

export interface FiberTypeSpec {
  id: string;
  ituDesignation: string;
  tiaDesignation?: string;
  commonNames: string[];
  category: FiberCategory;
  coreDiameterMicron: number;
  claddingDiameterMicron: number;
  mfdAt1310nmMicron?: number;
  mfdAt1550nmMicron?: number;
  na?: number;
  attenuationAt1310nmMax?: number;
  attenuationAt1550nmMax?: number;
  minBendRadiusMm: number;
  activelyInstalled: boolean;
  primaryUseCase: string;
  compatibilityNotes: string;
  nerdStuff?: NerdStuff;
}

export interface FiberTypesModule {
  lastUpdated: string;
  fiberTypes: FiberTypeSpec[];
}

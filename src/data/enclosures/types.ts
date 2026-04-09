import type { NerdStuff } from "../../types/shared";

export interface EnclosureType {
  id: string;
  name: string;
  commonAliases: string[];
  mountingEnvironments: string[];
  spliceCapacityRange: string;
  maxFiberCountRange: string;
  keyFeatures: string[];
  fieldNotes: string;
  nerdStuff?: NerdStuff;
}

export interface EnclosureModel {
  modelName: string;
  enclosureTypeId: string;
  maxSpliceTrays: number;
  maxFibers: number;
  environments: string[];
  notes: string;
}

export interface EnclosureBrand {
  id: string;
  manufacturer: string;
  notableModels: EnclosureModel[];
  notes: string;
}

export interface SpliceTray {
  id: string;
  name: string;
  fusionCapacity: number;
  ribbonCapable: boolean;
  compatibleManufacturers: string[];
  notes: string;
}

export interface EnclosureSelectionGuide {
  scenario: string;
  recommendedTypeId: string;
  notes: string;
}

export interface EnclosuresModule {
  lastUpdated: string;
  enclosureTypes: EnclosureType[];
  brands: EnclosureBrand[];
  spliceTrays: SpliceTray[];
  selectionGuide: EnclosureSelectionGuide[];
}

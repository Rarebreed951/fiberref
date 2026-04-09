import type { NerdStuff } from "../../types/shared";

export type TestMethodId = "method-a" | "method-b" | "method-c";

export interface IOLMTestMethod {
  id: TestMethodId;
  name: string;
  standardRefs: string[];
  referenceSetupSteps: string[];
  whatItMeasures: string;
  includesNearEndConnector: boolean;
  includesFarEndConnector: boolean;
  primaryUseCase: string;
  fieldNotes: string;
  nerdStuff?: NerdStuff;
}

export interface LossThreshold {
  component: string;
  maxLossdB: number;
  typicalGooddB?: number;
  standard: string;
  notes: string;
}

export interface ORLRequirement {
  applicationContext: string;
  minORLdB: number;
  notes: string;
}

export interface WavelengthTestRequirement {
  wavelengthNm: number;
  fiberCategory: string;
  requiredFor: string[];
  standard: string;
  notes: string;
}

export interface IOLMModule {
  lastUpdated: string;
  primaryReference: string;
  testMethods: IOLMTestMethod[];
  lossThresholds: LossThreshold[];
  orlRequirements: ORLRequirement[];
  wavelengthTestRequirements: WavelengthTestRequirement[];
  fieldNotes: string[];
}

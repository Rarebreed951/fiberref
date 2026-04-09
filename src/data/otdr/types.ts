import type { NerdStuff } from "../../types/shared";

export type EventCategory =
  | "reflective"
  | "non-reflective"
  | "ghost"
  | "end-of-fiber";

export interface OTDREvent {
  id: string;
  name: string;
  category: EventCategory;
  traceAppearance: string;
  commonCauses: string[];
  fieldNotes: string;
  warningFlag?: string;
  nerdStuff?: NerdStuff;
}

export interface PulseWidthGuidance {
  pulseWidthNs: number;
  typicalRangeKm: string;
  deadZoneImpact: string;
  useCase: string;
}

export interface IOREntry {
  fiberType: string;
  ituDesignation: string;
  ior1310: number;
  ior1550: number;
  ior1625?: number;
  exfoProfileName?: string;
  notes: string;
}

export interface WavelengthGuide {
  wavelengthNm: number;
  name: string;
  primaryUse: string;
  reveals: string[];
  limitations: string[];
  liveTrafficSafe: boolean;
  notes: string;
  nerdStuff?: NerdStuff;
}

export interface TraceSettingsGuide {
  pulseWidthGuidance: PulseWidthGuidance[];
  rangeSetting: {
    rule: string;
    exampleNote: string;
  };
  averagingTime: {
    shortSeconds: string;
    shortUse: string;
    longSeconds: string;
    longUse: string;
    exfoAutoNote: string;
  };
  iorTable: IOREntry[];
  wavelengthGuide: WavelengthGuide[];
}

export interface DeadZone {
  type: "event" | "attenuation";
  abbreviation: "EDZ" | "ADZ";
  definition: string;
  telcordiaDefinition: string;
  typicalValueSM: string;
  typicalValueMM: string;
  keyFact: string;
  nerdStuff?: NerdStuff;
}

export interface BidirectionalGuide {
  whyRequired: string;
  whatIsGainer: string;
  realWorldExample: string;
  procedure: string[];
  standard: string;
  nerdStuff?: NerdStuff;
}

export interface FileFormat {
  extension: string;
  fullName: string;
  owner: string;
  standard?: string | null;
  isOpenStandard: boolean;
  compatibility: string;
  notes: string;
}

export interface TerminologyEntry {
  concept: string;
  exfo: string;
  viavi: string;
  anritsu: string;
  afl: string;
  notes?: string;
}

export interface LaunchCableGuide {
  purpose: string;
  minimumLengthSM: string;
  minimumLengthMM: string;
  longHaulMinimum: string;
  exfoFormula: string;
  mustMatchFiberType: boolean;
  notes: string;
}

export interface OTDRModule {
  lastUpdated: string;
  primaryReference: string;
  events: OTDREvent[];
  traceSettings: TraceSettingsGuide;
  deadZones: DeadZone[];
  bidirectionalGuide: BidirectionalGuide;
  fileFormats: FileFormat[];
  terminologyCrossReference: TerminologyEntry[];
  launchCableGuide: LaunchCableGuide;
}

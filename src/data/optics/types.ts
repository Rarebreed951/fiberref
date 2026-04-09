import type { NerdStuff } from "../../types/shared";

export interface TransceiverFormFactor {
  id: string;
  name: string;
  lanesCount: number;
  maxLineRateGbps: number;
  commonRatesGbps: number[];
  hotSwappable: boolean;
  notes: string;
}

export interface TransceiverSpec {
  id: string;
  formFactorId: string;
  protocol: string;
  lineRateGbps: number;
  wavelengthNm: number | number[];
  fiberTypes: string[];
  connectorType: string;
  maxReachM: number;
  txPowerDbmMin: number;
  txPowerDbmMax: number;
  rxSensitivityDbm: number;
  rxOverloadDbm: number;
  isBidi: boolean;
  isWdm: boolean;
  fieldNotes: string;
  nerdStuff?: NerdStuff;
}

export interface OpticsModule {
  lastUpdated: string;
  formFactors: TransceiverFormFactor[];
  transceivers: TransceiverSpec[];
  generalFieldNotes: string[];
}

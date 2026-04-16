export interface TubeEntry {
  tubeNumber: number;
  fiberCount: number;
  colorName: string;
  colorHex: string;
  tracerColorName?: string;
  tracerColorHex?: string;
}

export interface CableConfig {
  id: string;
  name: string;
  totalFibers: number;
  tubes: TubeEntry[];
  createdAt: number;
}

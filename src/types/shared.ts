// Shared types used across all data modules

export interface Formula {
  name: string;
  expression: string;
  variables: { symbol: string; meaning: string }[];
  example?: string;
}

export interface NerdStuff {
  title: string;
  formulas?: Formula[];
  explanation: string;
}

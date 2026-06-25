import React, { createContext, useContext, useEffect, useState } from "react";
import type { CableConfig } from "../types/cableConfig";

const CONFIGS_KEY = "fiberref/cable_configs";
const ACTIVE_KEY  = "fiberref/active_config_id";
const MAX_CONFIGS = 10;

interface CableConfigContextValue {
  configs: CableConfig[];
  activeConfigId: string | null;
  activeConfig: CableConfig | null;
  setActiveConfig: (id: string | null) => void;
  saveConfig: (config: CableConfig) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  canAddMore: boolean;
}

const CableConfigContext = createContext<CableConfigContextValue>(
  {} as CableConfigContextValue
);

export function CableConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<CableConfig[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawConfigs = localStorage.getItem(CONFIGS_KEY);
      const rawActive  = localStorage.getItem(ACTIVE_KEY);
      if (rawConfigs) setConfigs(JSON.parse(rawConfigs));
      if (rawActive)  setActiveConfigId(rawActive);
    } catch {
      // corrupt storage — start fresh
    }
  }, []);

  const setActiveConfig = (id: string | null) => {
    setActiveConfigId(id);
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else    localStorage.removeItem(ACTIVE_KEY);
  };

  const saveConfig = async (config: CableConfig) => {
    setConfigs((prev) => {
      const idx = prev.findIndex((c) => c.id === config.id);
      const isUpdate = idx >= 0;
      if (!isUpdate && prev.length >= MAX_CONFIGS) return prev;
      const next = isUpdate
        ? prev.map((c) => (c.id === config.id ? config : c))
        : [...prev, config];
      localStorage.setItem(CONFIGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteConfig = async (id: string) => {
    setConfigs((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(CONFIGS_KEY, JSON.stringify(next));
      return next;
    });
    if (activeConfigId === id) setActiveConfig(null);
  };

  const activeConfig = configs.find((c) => c.id === activeConfigId) ?? null;

  return (
    <CableConfigContext.Provider
      value={{
        configs,
        activeConfigId,
        activeConfig,
        setActiveConfig,
        saveConfig,
        deleteConfig,
        canAddMore: configs.length < MAX_CONFIGS,
      }}
    >
      {children}
    </CableConfigContext.Provider>
  );
}

export function useCableConfig() {
  return useContext(CableConfigContext);
}

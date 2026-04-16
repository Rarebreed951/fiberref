import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CableConfig } from "../types/cableConfig";

const CONFIGS_KEY = "@fiberref/cable_configs";
const ACTIVE_KEY  = "@fiberref/active_config_id";
const MAX_CONFIGS = 10;

interface CableConfigContextValue {
  configs: CableConfig[];
  activeConfigId: string | null; // null = standard (locked)
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
    AsyncStorage.multiGet([CONFIGS_KEY, ACTIVE_KEY]).then(
      ([[, rawConfigs], [, rawActive]]) => {
        if (rawConfigs) setConfigs(JSON.parse(rawConfigs));
        if (rawActive) setActiveConfigId(rawActive);
      }
    );
  }, []);

  const setActiveConfig = (id: string | null) => {
    setActiveConfigId(id);
    if (id) AsyncStorage.setItem(ACTIVE_KEY, id);
    else AsyncStorage.removeItem(ACTIVE_KEY);
  };

  const saveConfig = async (config: CableConfig) => {
    setConfigs((prev) => {
      const idx = prev.findIndex((c) => c.id === config.id);
      const next =
        idx >= 0
          ? prev.map((c) => (c.id === config.id ? config : c))
          : [...prev, config];
      AsyncStorage.setItem(CONFIGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteConfig = async (id: string) => {
    setConfigs((prev) => {
      const next = prev.filter((c) => c.id !== id);
      AsyncStorage.setItem(CONFIGS_KEY, JSON.stringify(next));
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

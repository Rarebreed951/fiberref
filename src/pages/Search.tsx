import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { loadFavorites, toggleFavorite, type FavoriteEntry } from "../storage/favorites";

import colorData    from "../data/colorCodes/colorCodes.json";
import fiberData    from "../data/fiberTypes/fiberTypes.json";
import otdrData     from "../data/otdr/otdr.json";
import iolmData     from "../data/iolm/iolm.json";
import enclosureData from "../data/enclosures/enclosures.json";
import opticsData   from "../data/optics/optics.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchEntry {
  id: string;
  module: string;
  route: string;
  title: string;
  subtitle: string;
}

function entry(id: string, module: string, route: string, title: string, subtitle: string): SearchEntry {
  return { id, module, route, title, subtitle };
}

// ─── Index builder ────────────────────────────────────────────────────────────

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const f of colorData.fiberSequence)
    entries.push(entry(`color-fiber-${f.position}`, "Color Codes", "/color-codes", `${f.colorName} (${f.abbreviation})`, `Fiber position ${f.position}`));
  for (const j of colorData.jacketColors)
    entries.push(entry(`color-jacket-${j.id}`, "Color Codes", "/color-codes", j.fiberType, j.notes));
  for (const c of colorData.connectorColors)
    entries.push(entry(`color-connector-${c.id}`, "Color Codes", "/color-codes", `${c.polishType} connector — ${c.bodyColor}`, c.notes));

  for (const f of fiberData.fiberTypes)
    entries.push(entry(`fiber-${f.id}`, "Fiber Types", "/fiber-types", `${f.ituDesignation} — ${f.tiaDesignation}`, [f.commonNames.join(", "), f.primaryUseCase].join(" · ")));

  for (const e of otdrData.events)
    entries.push(entry(`otdr-event-${e.id}`, "OTDR", "/otdr", e.name, e.fieldNotes));
  for (const w of otdrData.traceSettings.wavelengthGuide)
    entries.push(entry(`otdr-wavelength-${w.wavelengthNm}`, "OTDR", "/otdr", `${w.wavelengthNm} nm — ${w.name}`, w.primaryUse));
  for (const t of otdrData.terminologyCrossReference)
    entries.push(entry(`otdr-term-${t.concept}`, "OTDR", "/otdr", t.concept, `EXFO: ${t.exfo} · VIAVI: ${t.viavi} · ${t.notes}`));
  for (const f of otdrData.fileFormats)
    entries.push(entry(`otdr-format-${f.extension}`, "OTDR", "/otdr", `${f.extension} — ${f.fullName}`, f.notes));

  for (const m of iolmData.testMethods)
    entries.push(entry(`iolm-method-${m.id}`, "IOLM", "/iolm", m.name, [m.whatItMeasures, m.primaryUseCase].join(" · ")));
  for (const t of iolmData.lossThresholds)
    entries.push(entry(`iolm-threshold-${t.component}`, "IOLM", "/iolm", `Loss threshold — ${t.component}`, `Max ${t.maxLossdB} dB · ${t.standard}`));

  for (const t of enclosureData.enclosureTypes)
    entries.push(entry(`enc-type-${t.id}`, "Enclosures", "/enclosures", t.name, [t.commonAliases.join(", "), t.fieldNotes].join(" · ")));
  for (const b of enclosureData.brands) {
    entries.push(entry(`enc-brand-${b.id}`, "Enclosures", "/enclosures", b.manufacturer, b.notes));
    for (const m of b.notableModels)
      entries.push(entry(`enc-model-${b.id}-${m.modelName}`, "Enclosures", "/enclosures", `${b.manufacturer} ${m.modelName}`, m.notes));
  }
  for (const t of enclosureData.spliceTrays)
    entries.push(entry(`enc-tray-${t.id}`, "Enclosures", "/enclosures", `Splice tray — ${t.name}`, t.notes));

  for (const ff of opticsData.formFactors)
    entries.push(entry(`optics-ff-${ff.id}`, "Optics", "/optics", ff.name, ff.notes));
  for (const t of opticsData.transceivers)
    entries.push(entry(`optics-tx-${t.id}`, "Optics", "/optics", t.protocol, t.fieldNotes));

  return entries;
}

const SEARCH_INDEX = buildIndex();

// ─── Module colors ────────────────────────────────────────────────────────────

const MODULE_COLORS: Record<string, string> = {
  "Color Codes": "#FF88CC",
  "Fiber Types": "#00FF88",
  "OTDR":        "#FFB300",
  "IOLM":        "#00FFFF",
  "Enclosures":  "#FF8844",
  "Optics":      "#AA88FF",
};
const MODULES = Object.keys(MODULE_COLORS);

// ─── Module filter ────────────────────────────────────────────────────────────

function ModuleFilterRow({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (module: string | null) => void;
}) {
  return (
    <div className="overflow-x-auto flex-shrink-0">
      <div className="flex flex-row px-3 pb-2 gap-1.5" style={{ minWidth: "max-content" }}>
        {MODULES.map((mod) => {
          const color = MODULE_COLORS[mod];
          const isSelected = selected === mod;
          return (
            <button
              key={mod}
              type="button"
              onClick={() => onSelect(isSelected ? null : mod)}
              style={{
                borderColor: isSelected ? color : "#2A2A2A",
                backgroundColor: isSelected ? `${color}22` : "#111111",
              }}
              className="border rounded-full px-2 py-1.5 whitespace-nowrap"
            >
              <span style={{ color: isSelected ? color : "#555555", fontSize: 11, fontWeight: 600 }}>
                {mod}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Search logic ─────────────────────────────────────────────────────────────

function searchIndex(query: string, module: string | null): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return SEARCH_INDEX.filter((e) => {
    if (module !== null && e.module !== module) return false;
    return (
      e.title.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.module.toLowerCase().includes(q)
    );
  });
}

// ─── Result components ────────────────────────────────────────────────────────

function ModuleBadge({ module }: { module: string }) {
  const color = MODULE_COLORS[module] ?? "#555555";
  return (
    <span style={{ borderColor: `${color}55`, backgroundColor: `${color}15` }} className="border rounded px-1.5 py-0.5 mr-2">
      <AppText size="xs" color={color} className="font-semibold">{module}</AppText>
    </span>
  );
}

function ResultCard({
  entry: e,
  isFavorite,
  onToggleFavorite,
}: {
  entry: SearchEntry;
  isFavorite: boolean;
  onToggleFavorite: (entry: SearchEntry) => void;
}) {
  const navigate = useNavigate();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(e.route)}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") navigate(e.route); }}
      className="w-full mx-3 mb-2 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-3 text-left active:opacity-70 cursor-pointer"
    >
      <div className="flex flex-row items-center mb-1">
        <ModuleBadge module={e.module} />
        <AppText size="sm" color="primary" className="font-semibold flex-1" numberOfLines={1}>
          {e.title}
        </AppText>
        <button
          type="button"
          onClick={(ev) => { ev.stopPropagation(); onToggleFavorite(e); }}
          className="ml-2 p-2"
          aria-label={isFavorite ? `Remove ${e.title} from favorites` : `Add ${e.title} to favorites`}
        >
          <span style={{ color: isFavorite ? "#FFB300" : "#333333", fontSize: 16 }}>★</span>
        </button>
      </div>
      <AppText size="xs" color="muted" className="leading-4" numberOfLines={2}>{e.subtitle}</AppText>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery]               = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds]   = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFavorites().then((entries) => setFavoriteIds(new Set(entries.map((e) => e.id))));
  }, []);

  const results = useMemo(() => searchIndex(query, selectedModule), [query, selectedModule]);

  const handleToggleFavorite = useCallback(async (e: SearchEntry) => {
    const { favorites } = await toggleFavorite(e as FavoriteEntry);
    setFavoriteIds(new Set(favorites.map((f) => f.id)));
  }, []);

  const showHint  = query.trim().length < 2;
  const showEmpty = !showHint && results.length === 0;
  const placeholder = selectedModule ? `Search ${selectedModule}…` : "Search all modules…";

  return (
    <AppShell showAd={false}>
      <div className="px-3 pt-3 pb-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-[#1A1A1A] text-white border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm outline-none"
        />
      </div>
      <ModuleFilterRow selected={selectedModule} onSelect={setSelectedModule} />

      {showHint && (
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          {selectedModule && MODULE_COLORS[selectedModule] ? (
            <AppText size="sm" color={MODULE_COLORS[selectedModule]} className="text-center block">
              Searching {selectedModule}
            </AppText>
          ) : (
            <AppText size="sm" color="muted" className="text-center leading-5 block">
              Search fiber types, OTDR events, transceiver protocols, enclosure
              models, color codes, and more.
            </AppText>
          )}
        </div>
      )}

      {showEmpty && (
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <AppText size="sm" color="muted" className="text-center block">
            No results for "{query.trim()}"
          </AppText>
        </div>
      )}

      {!showHint && !showEmpty && (
        <div style={{ paddingTop: 4, paddingBottom: 24 }}>
          <AppText size="xs" color="muted" className="mx-3 mb-2 block">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </AppText>
          {results.map((e) => (
            <ResultCard
              key={e.id}
              entry={e}
              isFavorite={favoriteIds.has(e.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

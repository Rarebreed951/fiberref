import { useState, useMemo } from "react";
import { ScrollView, View, Text, TextInput, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";

import colorData from "../src/data/colorCodes/colorCodes.json";
import fiberData from "../src/data/fiberTypes/fiberTypes.json";
import otdrData from "../src/data/otdr/otdr.json";
import iolmData from "../src/data/iolm/iolm.json";
import enclosureData from "../src/data/enclosures/enclosures.json";
import opticsData from "../src/data/optics/optics.json";

// ─── Index types ──────────────────────────────────────────────────────────────

interface SearchEntry {
  id: string;
  module: string;
  route: string;
  title: string;
  subtitle: string;
}

// ─── Index builders ───────────────────────────────────────────────────────────

function entry(
  id: string,
  module: string,
  route: string,
  title: string,
  subtitle: string
): SearchEntry {
  return { id, module, route, title, subtitle };
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // ── Color Codes ────────────────────────────────────────────────────────────
  for (const f of colorData.fiberSequence) {
    entries.push(
      entry(
        `color-fiber-${f.position}`,
        "Color Codes",
        "/color-codes",
        `${f.colorName} (${f.abbreviation})`,
        `Fiber position ${f.position}`
      )
    );
  }
  for (const j of colorData.jacketColors) {
    entries.push(
      entry(
        `color-jacket-${j.id}`,
        "Color Codes",
        "/color-codes",
        j.fiberType,
        j.notes
      )
    );
  }
  for (const c of colorData.connectorColors) {
    entries.push(
      entry(
        `color-connector-${c.id}`,
        "Color Codes",
        "/color-codes",
        `${c.polishType} connector — ${c.bodyColor}`,
        c.notes
      )
    );
  }

  // ── Fiber Types ────────────────────────────────────────────────────────────
  for (const f of fiberData.fiberTypes) {
    entries.push(
      entry(
        `fiber-${f.id}`,
        "Fiber Types",
        "/fiber-types",
        `${f.ituDesignation} — ${f.tiaDesignation}`,
        [f.commonNames.join(", "), f.primaryUseCase].join(" · ")
      )
    );
  }

  // ── OTDR ───────────────────────────────────────────────────────────────────
  for (const e of otdrData.events) {
    entries.push(
      entry(
        `otdr-event-${e.id}`,
        "OTDR",
        "/otdr",
        e.name,
        e.fieldNotes
      )
    );
  }
  for (const w of otdrData.traceSettings.wavelengthGuide) {
    entries.push(
      entry(
        `otdr-wavelength-${w.wavelengthNm}`,
        "OTDR",
        "/otdr",
        `${w.wavelengthNm} nm — ${w.name}`,
        w.primaryUse
      )
    );
  }
  for (const t of otdrData.terminologyCrossReference) {
    entries.push(
      entry(
        `otdr-term-${t.concept}`,
        "OTDR",
        "/otdr",
        t.concept,
        `EXFO: ${t.exfo} · VIAVI: ${t.viavi} · ${t.notes}`
      )
    );
  }
  for (const f of otdrData.fileFormats) {
    entries.push(
      entry(
        `otdr-format-${f.extension}`,
        "OTDR",
        "/otdr",
        `${f.extension} — ${f.fullName}`,
        f.notes
      )
    );
  }

  // ── IOLM ───────────────────────────────────────────────────────────────────
  for (const m of iolmData.testMethods) {
    entries.push(
      entry(
        `iolm-method-${m.id}`,
        "IOLM",
        "/iolm",
        m.name,
        [m.whatItMeasures, m.primaryUseCase].join(" · ")
      )
    );
  }
  for (const t of iolmData.lossThresholds) {
    entries.push(
      entry(
        `iolm-threshold-${t.component}`,
        "IOLM",
        "/iolm",
        `Loss threshold — ${t.component}`,
        `Max ${t.maxLossdB} dB · ${t.standard}`
      )
    );
  }

  // ── Enclosures ─────────────────────────────────────────────────────────────
  for (const t of enclosureData.enclosureTypes) {
    entries.push(
      entry(
        `enc-type-${t.id}`,
        "Enclosures",
        "/enclosures",
        t.name,
        [t.commonAliases.join(", "), t.fieldNotes].join(" · ")
      )
    );
  }
  for (const b of enclosureData.brands) {
    entries.push(
      entry(
        `enc-brand-${b.id}`,
        "Enclosures",
        "/enclosures",
        b.manufacturer,
        b.notes
      )
    );
    for (const m of b.notableModels) {
      entries.push(
        entry(
          `enc-model-${b.id}-${m.modelName}`,
          "Enclosures",
          "/enclosures",
          `${b.manufacturer} ${m.modelName}`,
          m.notes
        )
      );
    }
  }
  for (const t of enclosureData.spliceTrays) {
    entries.push(
      entry(
        `enc-tray-${t.id}`,
        "Enclosures",
        "/enclosures",
        `Splice tray — ${t.name}`,
        t.notes
      )
    );
  }

  // ── Optics ─────────────────────────────────────────────────────────────────
  for (const ff of opticsData.formFactors) {
    entries.push(
      entry(
        `optics-ff-${ff.id}`,
        "Optics",
        "/optics",
        ff.name,
        ff.notes
      )
    );
  }
  for (const t of opticsData.transceivers) {
    entries.push(
      entry(
        `optics-tx-${t.id}`,
        "Optics",
        "/optics",
        t.protocol,
        t.fieldNotes
      )
    );
  }

  return entries;
}

// ─── Module-level index (built once at load time) ─────────────────────────────

const SEARCH_INDEX = buildIndex();

// ─── Search logic ─────────────────────────────────────────────────────────────

function search(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return SEARCH_INDEX.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.module.toLowerCase().includes(q)
  );
}

// ─── Result components ────────────────────────────────────────────────────────

const MODULE_COLORS: Record<string, string> = {
  "Color Codes": "#FF88CC",
  "Fiber Types": "#00FF88",
  "OTDR":        "#FFB300",
  "IOLM":        "#00FFFF",
  "Enclosures":  "#FF8844",
  "Optics":      "#AA88FF",
};

function ModuleBadge({ module }: { module: string }) {
  const color = MODULE_COLORS[module] ?? "#555555";
  return (
    <View style={{ borderColor: `${color}55`, backgroundColor: `${color}15` }}
      className="border rounded px-1.5 py-0.5 mr-2">
      <Text style={{ color }} className="text-[10px] font-semibold">
        {module}
      </Text>
    </View>
  );
}

function ResultCard({ entry: e }: { entry: SearchEntry }) {
  return (
    <Pressable
      onPress={() => router.push(e.route as never)}
      className="mx-3 mb-2 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-3 active:opacity-70"
    >
      <View className="flex-row items-center mb-1">
        <ModuleBadge module={e.module} />
        <Text className="text-white text-sm font-semibold flex-1" numberOfLines={1}>
          {e.title}
        </Text>
      </View>
      <Text className="text-[#555555] text-xs leading-4" numberOfLines={2}>
        {e.subtitle}
      </Text>
    </Pressable>
  );
}

function ResultList({ results }: { results: SearchEntry[] }) {
  if (results.length === 0) return null;
  return (
    <>
      <Text className="text-[#444444] text-xs mx-3 mb-2">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </Text>
      {results.map((e) => (
        <ResultCard key={e.id} entry={e} />
      ))}
    </>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-[#333333] text-sm text-center">
        No results for "{query}"
      </Text>
    </View>
  );
}

function Hint() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-[#2A2A2A] text-sm text-center leading-5">
        Search fiber types, OTDR events, transceiver protocols, enclosure models,
        color codes, and more.
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => search(query), [query]);

  const showHint = query.trim().length < 2;
  const showEmpty = !showHint && results.length === 0;

  return (
    <AppShell showAd={false}>
      <Stack.Screen options={{ title: "Search", headerRight: undefined }} />
      <View className="px-3 pt-3 pb-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search all modules…"
          placeholderTextColor="#444444"
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
          className="bg-[#1A1A1A] text-white border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm"
        />
      </View>

      {showHint && <Hint />}
      {showEmpty && <EmptyResults query={query.trim()} />}
      {!showHint && !showEmpty && (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <ResultList results={results} />
        </ScrollView>
      )}
    </AppShell>
  );
}

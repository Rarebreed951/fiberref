import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
import {
  SectionHeader,
  SpecRow,
  NerdStuffSection,
} from "../src/components/ui";
import fiberData from "../src/data/fiberTypes/fiberTypes.json";
import type { FiberTypeSpec } from "../src/data/fiberTypes/types";
import type { NerdStuff } from "../src/types/shared";

// ─── Fiber Card ───────────────────────────────────────────────────────────────

function FiberCard({ fiber }: { fiber: FiberTypeSpec }) {
  const [expanded, setExpanded] = useState(false);
  const isSingleMode = fiber.category === "single-mode";

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {/* Collapsed header */}
      <Pressable onPress={() => setExpanded((v) => !v)} className="px-4 py-3">
        <View className="flex-row items-center">
          <View className="flex-row items-center flex-wrap flex-1 gap-2 mr-2">
            <AppText size="md" color="accentCyan" className="font-bold">
              {fiber.ituDesignation}
            </AppText>
            {fiber.tiaDesignation && (
              <View className="bg-[#00FFFF20] border border-[#00FFFF55] rounded px-1.5 py-0.5">
                <AppText size="xs" color="accentCyan" className="font-semibold">
                  {fiber.tiaDesignation}
                </AppText>
              </View>
            )}
            {!fiber.activelyInstalled && (
              <View className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                <AppText size="xs" color="accentAmber" className="font-semibold">LEGACY</AppText>
              </View>
            )}
          </View>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </View>
        <AppText size="xs" color="secondary" className="mt-0.5">
          {fiber.commonNames.join(" · ")}
        </AppText>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* Specs */}
          <View className="mt-2 mb-3">
            <SpecRow
              label="Core / Cladding"
              value={`${fiber.coreDiameterMicron} / ${fiber.claddingDiameterMicron} µm`}
            />
            {isSingleMode && fiber.mfdAt1310nmMicron != null && (
              <SpecRow label="MFD @ 1310 nm" value={`${fiber.mfdAt1310nmMicron} µm`} />
            )}
            {isSingleMode && fiber.mfdAt1550nmMicron != null && (
              <SpecRow label="MFD @ 1550 nm" value={`${fiber.mfdAt1550nmMicron} µm`} />
            )}
            {!isSingleMode && fiber.na != null && (
              <SpecRow label="Numerical Aperture" value={fiber.na.toFixed(3)} />
            )}
            {fiber.attenuationAt1310nmMax != null && (
              <SpecRow
                label="Atten. @ 1310 nm"
                value={`≤ ${fiber.attenuationAt1310nmMax} dB/km`}
              />
            )}
            {fiber.attenuationAt1550nmMax != null && (
              <SpecRow
                label="Atten. @ 1550 nm"
                value={`≤ ${fiber.attenuationAt1550nmMax} dB/km`}
              />
            )}
            <SpecRow label="Min. Bend Radius" value={`${fiber.minBendRadiusMm} mm`} />
          </View>

          {/* Use case */}
          <AppText size="xs" color="secondary" className="leading-4 mb-2">
            {fiber.primaryUseCase}
          </AppText>

          {/* Compatibility */}
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424]">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              Compatibility
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4">
              {fiber.compatibilityNotes}
            </AppText>
          </View>

          {/* Nerd Stuff */}
          {fiber.nerdStuff && (
            <NerdStuffSection nerd={fiber.nerdStuff as NerdStuff} />
          )}
        </View>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const fibers = fiberData.fiberTypes as FiberTypeSpec[];
const singleMode = fibers.filter((f) => f.category === "single-mode");
const multimode = fibers.filter((f) => f.category === "multimode");

export default function FiberTypesScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "Fiber Types" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <SectionHeader title="Single-Mode Fiber" />
        {singleMode.map((fiber) => (
          <FiberCard key={fiber.id} fiber={fiber} />
        ))}

        <SectionHeader title="Multimode Fiber" />
        {multimode.map((fiber) => (
          <FiberCard key={fiber.id} fiber={fiber} />
        ))}
      </ScrollView>
    </AppShell>
  );
}

import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
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
  const isSingleMode = fiber.category === "single-mode";

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      {/* Header */}
      <View className="flex-row items-start mb-2">
        <View className="flex-1">
          <View className="flex-row items-center flex-wrap gap-2 mb-0.5">
            <Text className="text-[#00FFFF] text-base font-bold">
              {fiber.ituDesignation}
            </Text>
            {fiber.tiaDesignation && (
              <View className="bg-[#00FFFF20] border border-[#00FFFF55] rounded px-1.5 py-0.5">
                <Text className="text-[#00FFFF] text-[10px] font-semibold">
                  {fiber.tiaDesignation}
                </Text>
              </View>
            )}
            {!fiber.activelyInstalled && (
              <View className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                <Text className="text-[#FFB300] text-[10px] font-semibold">LEGACY</Text>
              </View>
            )}
          </View>
          <Text className="text-[#A0A0A0] text-xs">
            {fiber.commonNames.join(" · ")}
          </Text>
        </View>
      </View>

      {/* Specs */}
      <View className="mb-3">
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
      <Text className="text-[#A0A0A0] text-xs leading-4 mb-2">
        {fiber.primaryUseCase}
      </Text>

      {/* Compatibility */}
      <View className="bg-[#111111] rounded-lg p-2 border border-[#242424]">
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
          Compatibility
        </Text>
        <Text className="text-[#A0A0A0] text-xs leading-4">
          {fiber.compatibilityNotes}
        </Text>
      </View>

      {/* Nerd Stuff */}
      {fiber.nerdStuff && (
        <NerdStuffSection nerd={fiber.nerdStuff as NerdStuff} />
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

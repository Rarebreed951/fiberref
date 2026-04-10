import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import {
  SectionCard,
  SectionHeader,
  Divider,
  NerdStuffSection,
} from "../src/components/ui";
import enclosureData from "../src/data/enclosures/enclosures.json";
import type {
  EnclosureType,
  EnclosureBrand,
  EnclosureModel,
  SpliceTray,
  EnclosureSelectionGuide,
} from "../src/data/enclosures/types";
import type { NerdStuff } from "../src/types/shared";

// ─── Environment tag ──────────────────────────────────────────────────────────

function EnvTag({ label }: { label: string }) {
  return (
    <View className="border border-[#2A2A2A] rounded px-1.5 py-0.5 mr-1 mb-1">
      <Text className="text-[#555555] text-[10px]">{label}</Text>
    </View>
  );
}

// ─── Enclosure Type Card ──────────────────────────────────────────────────────

function EnclosureTypeCard({ enclosureType }: { enclosureType: EnclosureType }) {
  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <Text className="text-[#00FFFF] text-base font-bold mb-0.5">{enclosureType.name}</Text>
      <Text className="text-[#A0A0A0] text-xs mb-2">
        {enclosureType.commonAliases.join(" · ")}
      </Text>

      {/* Environments */}
      <View className="flex-row flex-wrap mb-2">
        {enclosureType.mountingEnvironments.map((env) => (
          <EnvTag key={env} label={env} />
        ))}
      </View>

      {/* Capacity */}
      <View className="flex-row mb-3">
        <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
          <Text className="text-[#555555] text-[10px] uppercase tracking-wider mb-0.5">
            Splice Capacity
          </Text>
          <Text className="text-white text-xs font-semibold">{enclosureType.spliceCapacityRange}</Text>
        </View>
        <View className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
          <Text className="text-[#555555] text-[10px] uppercase tracking-wider mb-0.5">
            Max Fiber Count
          </Text>
          <Text className="text-white text-xs font-semibold">{enclosureType.maxFiberCountRange}</Text>
        </View>
      </View>

      {/* Key features */}
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Key Features
      </Text>
      {enclosureType.keyFeatures.map((feature) => (
        <View key={feature} className="flex-row mb-0.5">
          <Text className="text-[#555555] text-xs mr-1.5">·</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1 leading-4">{feature}</Text>
        </View>
      ))}

      {/* Field notes */}
      <Text className="text-[#A0A0A0] text-xs leading-4 mt-2">{enclosureType.fieldNotes}</Text>

      {enclosureType.nerdStuff && <NerdStuffSection nerd={enclosureType.nerdStuff as NerdStuff} />}
    </View>
  );
}

// ─── Brand + Models ───────────────────────────────────────────────────────────

function ModelRow({ model }: { model: EnclosureModel }) {
  return (
    <View className="py-2">
      <View className="flex-row items-baseline mb-0.5">
        <Text className="text-white text-xs font-bold mr-2">{model.modelName}</Text>
        <View className="flex-row flex-wrap flex-1">
          {model.environments.map((env) => (
            <EnvTag key={env} label={env} />
          ))}
        </View>
      </View>
      <View className="flex-row mb-1">
        <View className="flex-row mr-3">
          <Text className="text-[#555555] text-xs mr-1">Trays</Text>
          <Text className="text-[#A0A0A0] text-xs">{model.maxSpliceTrays}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-[#555555] text-xs mr-1">Max fibers</Text>
          <Text className="text-[#A0A0A0] text-xs">{model.maxFibers}F</Text>
        </View>
      </View>
      <Text className="text-[#555555] text-[10px] leading-4 italic">{model.notes}</Text>
    </View>
  );
}

function BrandCard({ brand }: { brand: EnclosureBrand }) {
  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <Text className="text-[#00FFFF] text-base font-bold mb-2">
        {brand.manufacturer}
      </Text>

      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Notable Models
      </Text>
      {brand.notableModels.map((model, index) => (
        <View key={model.modelName}>
          <ModelRow model={model} />
          {index < brand.notableModels.length - 1 && <Divider />}
        </View>
      ))}

      <View className="mt-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
        <Text className="text-[#A0A0A0] text-xs leading-4">{brand.notes}</Text>
      </View>
    </View>
  );
}

// ─── Splice Trays ─────────────────────────────────────────────────────────────

function SpliceTrayTable({ trays }: { trays: SpliceTray[] }) {
  return (
    <>
      {trays.map((tray, index) => (
        <View key={tray.id}>
          <View className="py-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-white text-xs font-bold flex-1">{tray.name}</Text>
              <View
                className={`border rounded px-1.5 py-0.5 ${
                  tray.ribbonCapable
                    ? "border-[#00FFFF55] bg-[#00FFFF15]"
                    : "border-[#44444455] bg-[#44444415]"
                }`}
              >
                <Text
                  className={`text-[10px] font-semibold ${
                    tray.ribbonCapable ? "text-[#00FFFF]" : "text-[#555555]"
                  }`}
                >
                  {tray.ribbonCapable ? "Ribbon capable" : "Single-fiber only"}
                </Text>
              </View>
            </View>
            <View className="flex-row mb-1">
              <Text className="text-[#555555] text-xs w-28">Fusion capacity</Text>
              <Text className="text-[#A0A0A0] text-xs">
                {tray.fusionCapacity} splices
              </Text>
            </View>
            <View className="flex-row mb-1">
              <Text className="text-[#555555] text-xs w-28">Compatible with</Text>
              <Text className="text-[#A0A0A0] text-xs flex-1">
                {tray.compatibleManufacturers.join(", ")}
              </Text>
            </View>
            <Text className="text-[#555555] text-[10px] leading-4 italic">{tray.notes}</Text>
          </View>
          {index < trays.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Selection Guide ──────────────────────────────────────────────────────────

const TYPE_NAME_MAP: Record<string, string> = {
  dome: "Dome Closure",
  "inline-horizontal": "Inline / Horizontal Closure",
  "wall-mount": "Wall-Mount / BET",
  "rack-mount": "Rack-Mount",
  "fiber-distribution-hub": "Fiber Distribution Hub (FDH)",
};

function SelectionGuideTable({ guide }: { guide: EnclosureSelectionGuide[] }) {
  return (
    <>
      {guide.map((entry, index) => (
        <View key={entry.scenario}>
          <View className="py-2">
            <Text className="text-white text-xs font-semibold mb-1">{entry.scenario}</Text>
            <View className="flex-row items-center mb-1">
              <Text className="text-[#555555] text-xs mr-1.5">→</Text>
              <Text className="text-[#00FFFF] text-xs font-semibold">
                {TYPE_NAME_MAP[entry.recommendedTypeId] ?? entry.recommendedTypeId}
              </Text>
            </View>
            <Text className="text-[#555555] text-[10px] leading-4 italic">{entry.notes}</Text>
          </View>
          {index < guide.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EnclosuresScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "Splice Enclosures" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <SectionHeader title="Enclosure Types" />
        {(enclosureData.enclosureTypes as EnclosureType[]).map((enclosureType) => (
          <EnclosureTypeCard key={enclosureType.id} enclosureType={enclosureType} />
        ))}

        <SectionHeader title="Brands & Notable Models" />
        {(enclosureData.brands as EnclosureBrand[]).map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}

        <SectionHeader title="Splice Trays" />
        <SectionCard title="Tray Types">
          <SpliceTrayTable trays={enclosureData.spliceTrays as SpliceTray[]} />
        </SectionCard>

        <SectionHeader title="Selection Guide" />
        <SectionCard title="Recommended Enclosure by Scenario">
          <SelectionGuideTable
            guide={enclosureData.selectionGuide as EnclosureSelectionGuide[]}
          />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

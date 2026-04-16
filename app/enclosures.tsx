import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
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
      <AppText size="xs" color="muted">{label}</AppText>
    </View>
  );
}

// ─── Enclosure Type Card ──────────────────────────────────────────────────────

function EnclosureTypeCard({ enclosureType }: { enclosureType: EnclosureType }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <Pressable onPress={() => setExpanded((v) => !v)} className="px-4 py-3">
        <View className="flex-row items-center">
          <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">
            {enclosureType.name}
          </AppText>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </View>
        <AppText size="xs" color="secondary" className="mt-0.5">
          {enclosureType.commonAliases.join(" · ")}
        </AppText>
        <View className="flex-row flex-wrap mt-1.5">
          {enclosureType.mountingEnvironments.map((env) => (
            <EnvTag key={env} label={env} />
          ))}
        </View>
      </Pressable>

      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* Capacity */}
          <View className="flex-row mt-3 mb-3">
            <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5">
                Splice Capacity
              </AppText>
              <AppText size="xs" color="primary" className="font-semibold">
                {enclosureType.spliceCapacityRange}
              </AppText>
            </View>
            <View className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5">
                Max Fiber Count
              </AppText>
              <AppText size="xs" color="primary" className="font-semibold">
                {enclosureType.maxFiberCountRange}
              </AppText>
            </View>
          </View>

          {/* Key features */}
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            Key Features
          </AppText>
          {enclosureType.keyFeatures.map((feature) => (
            <View key={feature} className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{feature}</AppText>
            </View>
          ))}

          {/* Field notes */}
          <AppText size="xs" color="secondary" className="leading-4 mt-2">
            {enclosureType.fieldNotes}
          </AppText>

          {enclosureType.nerdStuff && (
            <NerdStuffSection nerd={enclosureType.nerdStuff as NerdStuff} />
          )}
        </View>
      )}
    </View>
  );
}

// ─── Brand + Models ───────────────────────────────────────────────────────────

function ModelRow({ model }: { model: EnclosureModel }) {
  return (
    <View className="py-2">
      <View className="flex-row items-baseline mb-0.5">
        <AppText size="xs" color="primary" className="font-bold mr-2">{model.modelName}</AppText>
        <View className="flex-row flex-wrap flex-1">
          {model.environments.map((env) => (
            <EnvTag key={env} label={env} />
          ))}
        </View>
      </View>
      <View className="flex-row mb-1">
        <View className="flex-row mr-3">
          <AppText size="xs" color="muted" className="mr-1">Trays</AppText>
          <AppText size="xs" color="secondary">{model.maxSpliceTrays}</AppText>
        </View>
        <View className="flex-row">
          <AppText size="xs" color="muted" className="mr-1">Max fibers</AppText>
          <AppText size="xs" color="secondary">{model.maxFibers}F</AppText>
        </View>
      </View>
      <AppText size="xs" color="muted" className="leading-4 italic">{model.notes}</AppText>
    </View>
  );
}

function BrandCard({ brand }: { brand: EnclosureBrand }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center px-4 py-3"
      >
        <AppText size="md" color="accentCyan" className="font-bold flex-1">
          {brand.manufacturer}
        </AppText>
        <AppText size="xs" color="muted" style={{ marginLeft: 8 }}>
          {expanded ? "▲" : "▼"}
        </AppText>
      </Pressable>

      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 mt-3">
            Notable Models
          </AppText>
          {brand.notableModels.map((model, index) => (
            <View key={model.modelName}>
              <ModelRow model={model} />
              {index < brand.notableModels.length - 1 && <Divider />}
            </View>
          ))}

          <View className="mt-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
            <AppText size="xs" color="secondary" className="leading-4">{brand.notes}</AppText>
          </View>
        </View>
      )}
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
              <AppText size="xs" color="primary" className="font-bold flex-1">{tray.name}</AppText>
              <View
                className={`border rounded px-1.5 py-0.5 ${
                  tray.ribbonCapable
                    ? "border-[#00FFFF55] bg-[#00FFFF15]"
                    : "border-[#44444455] bg-[#44444415]"
                }`}
              >
                <AppText
                  size="xs"
                  color={tray.ribbonCapable ? "accentCyan" : "muted"}
                  className="font-semibold"
                >
                  {tray.ribbonCapable ? "Ribbon capable" : "Single-fiber only"}
                </AppText>
              </View>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Fusion capacity</AppText>
              <AppText size="xs" color="secondary">
                {tray.fusionCapacity} splices
              </AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Compatible with</AppText>
              <AppText size="xs" color="secondary" className="flex-1">
                {tray.compatibleManufacturers.join(", ")}
              </AppText>
            </View>
            <AppText size="xs" color="muted" className="leading-4 italic">{tray.notes}</AppText>
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
            <AppText size="xs" color="primary" className="font-semibold mb-1">{entry.scenario}</AppText>
            <View className="flex-row items-center mb-1">
              <AppText size="xs" color="muted" className="mr-1.5">→</AppText>
              <AppText size="xs" color="accentCyan" className="font-semibold">
                {TYPE_NAME_MAP[entry.recommendedTypeId] ?? entry.recommendedTypeId}
              </AppText>
            </View>
            <AppText size="xs" color="muted" className="leading-4 italic">{entry.notes}</AppText>
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
        <SectionCard title="Tray Types" collapsible defaultOpen={false}>
          <SpliceTrayTable trays={enclosureData.spliceTrays as SpliceTray[]} />
        </SectionCard>

        <SectionHeader title="Selection Guide" />
        <SectionCard title="Recommended Enclosure by Scenario" collapsible defaultOpen={false}>
          <SelectionGuideTable
            guide={enclosureData.selectionGuide as EnclosureSelectionGuide[]}
          />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

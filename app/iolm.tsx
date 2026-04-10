import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import {
  SectionCard,
  SectionHeader,
  Divider,
  NerdStuffSection,
  InfoBox,
} from "../src/components/ui";
import iolmData from "../src/data/iolm/iolm.json";
import type {
  IOLMTestMethod,
  LossThreshold,
  ORLRequirement,
  WavelengthTestRequirement,
} from "../src/data/iolm/types";
import type { NerdStuff } from "../src/types/shared";

// ─── Test Methods ─────────────────────────────────────────────────────────────

function ConnectorIncludedBadge({ included, label }: { included: boolean; label: string }) {
  return (
    <View
      className={`border rounded px-1.5 py-0.5 mr-1.5 ${
        included
          ? "border-[#00FF8855] bg-[#00FF8815]"
          : "border-[#44444455] bg-[#44444415]"
      }`}
    >
      <Text
        className={`text-[10px] font-semibold ${
          included ? "text-[#00FF88]" : "text-[#555555]"
        }`}
      >
        {label} {included ? "included" : "excluded"}
      </Text>
    </View>
  );
}

function TestMethodCard({ method }: { method: IOLMTestMethod }) {
  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      {/* Header */}
      <Text className="text-[#00FFFF] text-base font-bold mb-1">{method.name}</Text>
      <View className="flex-row flex-wrap mb-2">
        {method.standardRefs.map((ref) => (
          <View key={ref} className="border border-[#2A2A2A] rounded px-1.5 py-0.5 mr-1.5 mb-1">
            <Text className="text-[#555555] text-[10px]">{ref}</Text>
          </View>
        ))}
      </View>

      {/* What it measures */}
      <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
          What It Measures
        </Text>
        <Text className="text-[#A0A0A0] text-xs leading-4">{method.whatItMeasures}</Text>
      </View>

      {/* Connector inclusion */}
      <View className="flex-row mb-3">
        <ConnectorIncludedBadge included={method.includesNearEndConnector} label="Near-end connector" />
        <ConnectorIncludedBadge included={method.includesFarEndConnector} label="Far-end connector" />
      </View>

      {/* Reference setup */}
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
        Reference Setup Steps
      </Text>
      {method.referenceSetupSteps.map((step, i) => (
        <View key={i} className="flex-row mb-1.5">
          <Text className="text-[#00FFFF] text-xs font-bold w-5">{i + 1}.</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1 leading-4">{step}</Text>
        </View>
      ))}

      {/* Use case & field notes */}
      <View className="mt-2">
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
          Primary Use Case
        </Text>
        <Text className="text-[#A0A0A0] text-xs leading-4 mb-2">{method.primaryUseCase}</Text>
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
          Field Notes
        </Text>
        <Text className="text-[#A0A0A0] text-xs leading-4">{method.fieldNotes}</Text>
      </View>

      {method.nerdStuff && <NerdStuffSection nerd={method.nerdStuff as NerdStuff} />}
    </View>
  );
}

// ─── Loss Thresholds ──────────────────────────────────────────────────────────

function LossThresholdTable({ thresholds }: { thresholds: LossThreshold[] }) {
  return (
    <>
      {thresholds.map((t, index) => (
        <View key={t.component}>
          <View className="py-2">
            <Text className="text-white text-xs font-semibold mb-1">{t.component}</Text>
            <View className="flex-row mb-0.5">
              <Text className="text-[#555555] text-xs w-28">Max (spec)</Text>
              <Text className="text-[#FF4444] text-xs font-bold">≤ {t.maxLossdB} dB</Text>
            </View>
            {t.typicalGooddB != null && (
              <View className="flex-row mb-0.5">
                <Text className="text-[#555555] text-xs w-28">Typical good</Text>
                <Text className="text-[#00FF88] text-xs">{t.typicalGooddB} dB</Text>
              </View>
            )}
            <View className="flex-row mb-1">
              <Text className="text-[#555555] text-xs w-28">Standard</Text>
              <Text className="text-[#A0A0A0] text-xs flex-1">{t.standard}</Text>
            </View>
            <Text className="text-[#555555] text-[10px] leading-4 italic">{t.notes}</Text>
          </View>
          {index < thresholds.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── ORL Requirements ─────────────────────────────────────────────────────────

function ORLTable({ requirements }: { requirements: ORLRequirement[] }) {
  return (
    <>
      {requirements.map((req, index) => (
        <View key={req.applicationContext}>
          <View className="py-2">
            <View className="flex-row items-baseline mb-1">
              <Text className="text-white text-xs font-semibold flex-1 mr-2">
                {req.applicationContext}
              </Text>
              <Text className="text-[#00FFFF] text-sm font-bold">
                ≥ {req.minORLdB} dB
              </Text>
            </View>
            <Text className="text-[#555555] text-[10px] leading-4 italic">{req.notes}</Text>
          </View>
          {index < requirements.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Wavelength Requirements ──────────────────────────────────────────────────

function WavelengthRows({ items }: { items: WavelengthTestRequirement[] }) {
  return (
    <>
      {items.map((row, index) => (
        <View key={row.wavelengthNm}>
          <View className="py-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-[#00FFFF] text-sm font-bold mr-2">
                {row.wavelengthNm} nm
              </Text>
              <Text className="text-[#555555] text-[10px]">{row.standard}</Text>
            </View>
            <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
              Required For
            </Text>
            {row.requiredFor.map((use) => (
              <View key={use} className="flex-row mb-0.5">
                <Text className="text-[#555555] text-xs mr-1.5">·</Text>
                <Text className="text-[#A0A0A0] text-xs flex-1">{use}</Text>
              </View>
            ))}
            <Text className="text-[#555555] text-[10px] leading-4 italic mt-1">
              {row.notes}
            </Text>
          </View>
          {index < items.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

function WavelengthRequirementTable({ rows }: { rows: WavelengthTestRequirement[] }) {
  const smf = rows.filter((r) => r.fiberCategory === "SMF");
  const mmf = rows.filter((r) => r.fiberCategory === "MMF");

  return (
    <>
      <Text className="text-[#FFB300] text-xs font-semibold mb-1">
        Single-Mode Fiber (SMF)
      </Text>
      <WavelengthRows items={smf} />
      <View className="h-3" />
      <Text className="text-[#FFB300] text-xs font-semibold mb-1">
        Multimode Fiber (MMF)
      </Text>
      <WavelengthRows items={mmf} />
    </>
  );
}

// ─── Field Notes ──────────────────────────────────────────────────────────────

function FieldNotesCard({ notes }: { notes: string[] }) {
  return (
    <SectionCard title="Field Notes">
      {notes.map((note, i) => (
        <View key={i} className="flex-row mb-2.5">
          <Text className="text-[#00FFFF] text-xs font-bold w-5">{i + 1}.</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1 leading-4">{note}</Text>
        </View>
      ))}
    </SectionCard>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function IolmScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "IOLM / Loss Testing" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <View className="mx-3 mb-3">
          <InfoBox text={`Reference: ${iolmData.primaryReference}`} />
        </View>

        {/* Test Methods */}
        <SectionHeader title="Test Methods" />
        {(iolmData.testMethods as IOLMTestMethod[]).map((method) => (
          <TestMethodCard key={method.id} method={method} />
        ))}

        {/* Loss Thresholds */}
        <SectionHeader title="Loss Thresholds" />
        <SectionCard title="Component Loss Limits">
          <LossThresholdTable thresholds={iolmData.lossThresholds as LossThreshold[]} />
        </SectionCard>

        {/* ORL */}
        <SectionHeader title="ORL Requirements" />
        <SectionCard title="Optical Return Loss by Application">
          <ORLTable requirements={iolmData.orlRequirements as ORLRequirement[]} />
        </SectionCard>

        {/* Wavelength Requirements */}
        <SectionHeader title="Wavelength Requirements" />
        <SectionCard title="Test Wavelengths by Fiber Type">
          <WavelengthRequirementTable
            rows={iolmData.wavelengthTestRequirements as WavelengthTestRequirement[]}
          />
        </SectionCard>

        {/* Field Notes */}
        <SectionHeader title="Field Notes" />
        <FieldNotesCard notes={iolmData.fieldNotes} />
      </ScrollView>
    </AppShell>
  );
}

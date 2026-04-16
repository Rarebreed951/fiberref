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
      <AppText
        size="xs"
        color={included ? "success" : "muted"}
        className="font-semibold"
      >
        {label} {included ? "included" : "excluded"}
      </AppText>
    </View>
  );
}

function TestMethodCard({ method }: { method: IOLMTestMethod }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {/* Collapsed header */}
      <Pressable onPress={() => setExpanded((v) => !v)} className="px-4 py-3">
        <View className="flex-row items-center">
          <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">
            {method.name}
          </AppText>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </View>
        <View className="flex-row flex-wrap mt-1.5">
          {method.standardRefs.map((ref) => (
            <View key={ref} className="border border-[#2A2A2A] rounded px-1.5 py-0.5 mr-1.5 mb-1">
              <AppText size="xs" color="muted">{ref}</AppText>
            </View>
          ))}
        </View>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* What it measures */}
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              What It Measures
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4">{method.whatItMeasures}</AppText>
          </View>

          {/* Connector inclusion */}
          <View className="flex-row mb-3">
            <ConnectorIncludedBadge included={method.includesNearEndConnector} label="Near-end connector" />
            <ConnectorIncludedBadge included={method.includesFarEndConnector} label="Far-end connector" />
          </View>

          {/* Reference setup */}
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1.5">
            Reference Setup Steps
          </AppText>
          {method.referenceSetupSteps.map((step, i) => (
            <View key={i} className="flex-row mb-1.5">
              <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{step}</AppText>
            </View>
          ))}

          {/* Use case & field notes */}
          <View className="mt-2">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              Primary Use Case
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4 mb-2">{method.primaryUseCase}</AppText>
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              Field Notes
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4">{method.fieldNotes}</AppText>
          </View>

          {method.nerdStuff && <NerdStuffSection nerd={method.nerdStuff as NerdStuff} />}
        </View>
      )}
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
            <AppText size="xs" color="primary" className="font-semibold mb-1">{t.component}</AppText>
            <View className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-28">Max (spec)</AppText>
              <AppText size="xs" color="danger" className="font-bold">≤ {t.maxLossdB} dB</AppText>
            </View>
            {t.typicalGooddB != null && (
              <View className="flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-28">Typical good</AppText>
                <AppText size="xs" color="success">{t.typicalGooddB} dB</AppText>
              </View>
            )}
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Standard</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{t.standard}</AppText>
            </View>
            <AppText size="xs" color="muted" className="leading-4 italic">{t.notes}</AppText>
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
              <AppText size="xs" color="primary" className="font-semibold flex-1 mr-2">
                {req.applicationContext}
              </AppText>
              <AppText size="sm" color="accentCyan" className="font-bold">
                ≥ {req.minORLdB} dB
              </AppText>
            </View>
            <AppText size="xs" color="muted" className="leading-4 italic">{req.notes}</AppText>
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
              <AppText size="sm" color="accentCyan" className="font-bold mr-2">
                {row.wavelengthNm} nm
              </AppText>
              <AppText size="xs" color="muted">{row.standard}</AppText>
            </View>
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              Required For
            </AppText>
            {row.requiredFor.map((use) => (
              <View key={use} className="flex-row mb-0.5">
                <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
                <AppText size="xs" color="secondary" className="flex-1">{use}</AppText>
              </View>
            ))}
            <AppText size="xs" color="muted" className="leading-4 italic mt-1">
              {row.notes}
            </AppText>
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
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1">
        Single-Mode Fiber (SMF)
      </AppText>
      <WavelengthRows items={smf} />
      <View className="h-3" />
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1">
        Multimode Fiber (MMF)
      </AppText>
      <WavelengthRows items={mmf} />
    </>
  );
}

// ─── Field Notes ──────────────────────────────────────────────────────────────

function FieldNotesCard({ notes }: { notes: string[] }) {
  return (
    <SectionCard title="Field Notes" collapsible defaultOpen={false}>
      {notes.map((note, i) => (
        <View key={i} className="flex-row mb-2.5">
          <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
          <AppText size="xs" color="secondary" className="flex-1 leading-4">{note}</AppText>
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
        <SectionCard title="Component Loss Limits" collapsible defaultOpen={false}>
          <LossThresholdTable thresholds={iolmData.lossThresholds as LossThreshold[]} />
        </SectionCard>

        {/* ORL */}
        <SectionHeader title="ORL Requirements" />
        <SectionCard title="Optical Return Loss by Application" collapsible defaultOpen={false}>
          <ORLTable requirements={iolmData.orlRequirements as ORLRequirement[]} />
        </SectionCard>

        {/* Wavelength Requirements */}
        <SectionHeader title="Wavelength Requirements" />
        <SectionCard title="Test Wavelengths by Fiber Type" collapsible defaultOpen={false}>
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

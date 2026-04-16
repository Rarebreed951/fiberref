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
import opticsData from "../src/data/optics/optics.json";
import type {
  TransceiverFormFactor,
  TransceiverSpec,
} from "../src/data/optics/types";
import type { NerdStuff } from "../src/types/shared";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatWavelength(wavelengthNm: number | number[]): string {
  if (Array.isArray(wavelengthNm)) {
    return wavelengthNm.map((w) => `${w} nm`).join(" / ");
  }
  return `${wavelengthNm} nm`;
}

function formatReach(maxReachM: number): string {
  if (maxReachM >= 1000) {
    return `${maxReachM / 1000} km`;
  }
  return `${maxReachM} m`;
}

// ─── Form Factor Card ─────────────────────────────────────────────────────────

function FormFactorCard({ ff }: { ff: TransceiverFormFactor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center px-4 py-3"
      >
        <AppText size="md" color="accentCyan" className="font-bold flex-1">
          {ff.name}
        </AppText>
        <AppText size="xs" color="muted" style={{ marginLeft: 8 }}>
          {expanded ? "▲" : "▼"}
        </AppText>
      </Pressable>

      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          <View className="flex-row mt-3 mb-3">
            <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5">
                Lanes
              </AppText>
              <AppText size="xs" color="primary" className="font-semibold">{ff.lanesCount}</AppText>
            </View>
            <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5">
                Max Rate
              </AppText>
              <AppText size="xs" color="primary" className="font-semibold">{ff.maxLineRateGbps} G</AppText>
            </View>
            <View className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5">
                Hot-swap
              </AppText>
              <AppText size="xs" color="primary" className="font-semibold">
                {ff.hotSwappable ? "Yes" : "No"}
              </AppText>
            </View>
          </View>

          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            Common Rates
          </AppText>
          <AppText size="xs" color="secondary" className="mb-2">
            {ff.commonRatesGbps.map((r) => `${r}G`).join(", ")}
          </AppText>

          <AppText size="xs" color="secondary" className="leading-4">{ff.notes}</AppText>
        </View>
      )}
    </View>
  );
}

// ─── Transceiver Card ─────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: "cyan" | "amber" }) {
  const borderColor = color === "cyan" ? "border-[#00FFFF55]" : "border-[#FFB30055]";
  const bgColor = color === "cyan" ? "bg-[#00FFFF15]" : "bg-[#FFB30015]";
  const appColor = color === "cyan" ? "accentCyan" : "accentAmber";
  return (
    <View className={`border rounded px-1.5 py-0.5 mr-1.5 ${borderColor} ${bgColor}`}>
      <AppText size="xs" color={appColor} className="font-semibold">{label}</AppText>
    </View>
  );
}

function TransceiverCard({ spec }: { spec: TransceiverSpec }) {
  const [expanded, setExpanded] = useState(false);
  const powerBudgetDb =
    Math.round((spec.txPowerDbmMin - spec.rxSensitivityDbm) * 10) / 10;

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {/* Collapsed header */}
      <Pressable onPress={() => setExpanded((v) => !v)} className="px-4 py-3">
        <View className="flex-row items-center">
          <View className="flex-row items-center flex-1 flex-wrap gap-2 mr-2">
            <AppText size="md" color="accentCyan" className="font-bold">
              {spec.protocol}
            </AppText>
            <AppText size="xs" color="muted">{spec.lineRateGbps} Gbps</AppText>
            {spec.isBidi && <Badge label="BiDi" color="amber" />}
            {spec.isWdm && <Badge label="WDM" color="cyan" />}
          </View>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </View>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* Spec block */}
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Wavelength</AppText>
              <AppText size="xs" color="primary" className="flex-1">
                {formatWavelength(spec.wavelengthNm)}
              </AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Connector</AppText>
              <AppText size="xs" color="primary" className="flex-1">{spec.connectorType}</AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Fiber types</AppText>
              <AppText size="xs" color="primary" className="flex-1">{spec.fiberTypes.join(", ")}</AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Max reach</AppText>
              <AppText size="xs" color="primary" className="flex-1">{formatReach(spec.maxReachM)}</AppText>
            </View>
            <Divider />
            <View className="flex-row mt-1 mb-1">
              <AppText size="xs" color="muted" className="w-28">TX power</AppText>
              <AppText size="xs" color="secondary" className="flex-1">
                {spec.txPowerDbmMin} to {spec.txPowerDbmMax} dBm
              </AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">RX sensitivity</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{spec.rxSensitivityDbm} dBm</AppText>
            </View>
            <View className="flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">RX overload</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{spec.rxOverloadDbm} dBm</AppText>
            </View>
            <View className="flex-row">
              <AppText size="xs" color="muted" className="w-28">Power budget</AppText>
              <AppText size="xs" color="success" className="font-semibold flex-1">
                {powerBudgetDb} dB
              </AppText>
            </View>
          </View>

          {/* Field notes */}
          <AppText size="xs" color="secondary" className="leading-4">{spec.fieldNotes}</AppText>

          {spec.nerdStuff && <NerdStuffSection nerd={spec.nerdStuff as NerdStuff} />}
        </View>
      )}
    </View>
  );
}

// ─── Transceiver Group ────────────────────────────────────────────────────────

function TransceiverGroup({
  ff,
  specs,
}: {
  ff: TransceiverFormFactor;
  specs: TransceiverSpec[];
}) {
  if (specs.length === 0) return null;
  return (
    <>
      <SectionHeader title={ff.name} />
      {specs.map((spec) => (
        <TransceiverCard key={spec.id} spec={spec} />
      ))}
    </>
  );
}

// ─── Field Notes ──────────────────────────────────────────────────────────────

function GeneralFieldNotes({ notes }: { notes: string[] }) {
  return (
    <SectionCard title="General Field Notes" collapsible defaultOpen={false}>
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

const formFactors = opticsData.formFactors as TransceiverFormFactor[];
const transceivers = opticsData.transceivers as TransceiverSpec[];

export default function OpticsScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "Optics & Transceivers" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <SectionHeader title="Form Factors" />
        {formFactors.map((ff) => (
          <FormFactorCard key={ff.id} ff={ff} />
        ))}

        <SectionHeader title="Transceivers" />
        {formFactors.map((ff) => (
          <TransceiverGroup
            key={ff.id}
            ff={ff}
            specs={transceivers.filter((t) => t.formFactorId === ff.id)}
          />
        ))}

        <SectionHeader title="Field Notes" />
        <GeneralFieldNotes notes={opticsData.generalFieldNotes} />
      </ScrollView>
    </AppShell>
  );
}

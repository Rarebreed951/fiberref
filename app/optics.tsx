import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
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
  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <Text className="text-[#00FFFF] text-base font-bold mb-2">{ff.name}</Text>

      <View className="flex-row mb-3">
        <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
          <Text className="text-[#555555] text-[10px] uppercase tracking-wider mb-0.5">
            Lanes
          </Text>
          <Text className="text-white text-xs font-semibold">{ff.lanesCount}</Text>
        </View>
        <View className="flex-1 mr-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
          <Text className="text-[#555555] text-[10px] uppercase tracking-wider mb-0.5">
            Max Rate
          </Text>
          <Text className="text-white text-xs font-semibold">{ff.maxLineRateGbps} G</Text>
        </View>
        <View className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
          <Text className="text-[#555555] text-[10px] uppercase tracking-wider mb-0.5">
            Hot-swap
          </Text>
          <Text className="text-white text-xs font-semibold">
            {ff.hotSwappable ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Common Rates
      </Text>
      <Text className="text-[#A0A0A0] text-xs mb-2">
        {ff.commonRatesGbps.map((r) => `${r}G`).join(", ")}
      </Text>

      <Text className="text-[#A0A0A0] text-xs leading-4">{ff.notes}</Text>
    </View>
  );
}

// ─── Transceiver Card ─────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: "cyan" | "amber" }) {
  const borderColor = color === "cyan" ? "border-[#00FFFF55]" : "border-[#FFB30055]";
  const bgColor = color === "cyan" ? "bg-[#00FFFF15]" : "bg-[#FFB30015]";
  const textColor = color === "cyan" ? "text-[#00FFFF]" : "text-[#FFB300]";
  return (
    <View className={`border rounded px-1.5 py-0.5 mr-1.5 ${borderColor} ${bgColor}`}>
      <Text className={`text-[10px] font-semibold ${textColor}`}>{label}</Text>
    </View>
  );
}

function TransceiverCard({ spec }: { spec: TransceiverSpec }) {
  const powerBudgetDb =
    Math.round((spec.txPowerDbmMin - spec.rxSensitivityDbm) * 10) / 10;

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      {/* Header */}
      <Text className="text-[#00FFFF] text-base font-bold mb-0.5">{spec.protocol}</Text>
      <Text className="text-[#555555] text-xs mb-2">{spec.lineRateGbps} Gbps</Text>

      {/* Badges */}
      {(spec.isBidi || spec.isWdm) && (
        <View className="flex-row mb-2">
          {spec.isBidi && <Badge label="BiDi" color="amber" />}
          {spec.isWdm && <Badge label="WDM" color="cyan" />}
        </View>
      )}

      {/* Spec block */}
      <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">Wavelength</Text>
          <Text className="text-white text-xs flex-1">
            {formatWavelength(spec.wavelengthNm)}
          </Text>
        </View>
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">Connector</Text>
          <Text className="text-white text-xs flex-1">{spec.connectorType}</Text>
        </View>
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">Fiber types</Text>
          <Text className="text-white text-xs flex-1">{spec.fiberTypes.join(", ")}</Text>
        </View>
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">Max reach</Text>
          <Text className="text-white text-xs flex-1">{formatReach(spec.maxReachM)}</Text>
        </View>
        <Divider />
        <View className="flex-row mt-1 mb-1">
          <Text className="text-[#555555] text-xs w-28">TX power</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1">
            {spec.txPowerDbmMin} to {spec.txPowerDbmMax} dBm
          </Text>
        </View>
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">RX sensitivity</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1">{spec.rxSensitivityDbm} dBm</Text>
        </View>
        <View className="flex-row mb-1">
          <Text className="text-[#555555] text-xs w-28">RX overload</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1">{spec.rxOverloadDbm} dBm</Text>
        </View>
        <View className="flex-row">
          <Text className="text-[#555555] text-xs w-28">Power budget</Text>
          <Text className="text-[#00FF88] text-xs font-semibold flex-1">
            {powerBudgetDb} dB
          </Text>
        </View>
      </View>

      {/* Field notes */}
      <Text className="text-[#A0A0A0] text-xs leading-4">{spec.fieldNotes}</Text>

      {spec.nerdStuff && <NerdStuffSection nerd={spec.nerdStuff as NerdStuff} />}
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
    <SectionCard title="General Field Notes">
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

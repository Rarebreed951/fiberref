import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import {
  SectionCard,
  SectionHeader,
  Divider,
  TableHeader,
  NerdStuffSection,
  WarningBox,
  InfoBox,
} from "../src/components/ui";
import otdrData from "../src/data/otdr/otdr.json";
import type {
  OTDREvent,
  EventCategory,
  PulseWidthGuidance,
  IOREntry,
  WavelengthGuide,
  DeadZone,
  FileFormat,
  TerminologyEntry,
} from "../src/data/otdr/types";
import type { NerdStuff } from "../src/types/shared";

// ─── Event category badges ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<
  EventCategory,
  { text: string; border: string; bg: string; label: string }
> = {
  reflective: { text: "#00FFFF", border: "#00FFFF55", bg: "#00FFFF15", label: "Reflective" },
  "non-reflective": { text: "#FFB300", border: "#FFB30055", bg: "#FFB30015", label: "Non-Reflective" },
  ghost: { text: "#AA88FF", border: "#AA88FF55", bg: "#AA88FF15", label: "Ghost" },
  "end-of-fiber": { text: "#A0A0A0", border: "#44444455", bg: "#44444415", label: "End of Fiber" },
};

function CategoryBadge({ category }: { category: EventCategory }) {
  const c = CATEGORY_COLORS[category];
  return (
    <View style={{ borderColor: c.border, backgroundColor: c.bg }}
      className="border rounded px-1.5 py-0.5">
      <Text style={{ color: c.text }} className="text-[10px] font-semibold">
        {c.label}
      </Text>
    </View>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: OTDREvent }) {
  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-[#00FFFF] text-base font-bold flex-1 mr-2">{event.name}</Text>
        <CategoryBadge category={event.category} />
      </View>

      {/* Trace appearance */}
      <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
        <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
          Trace Appearance
        </Text>
        <Text className="text-[#A0A0A0] text-xs leading-4">{event.traceAppearance}</Text>
      </View>

      {/* Common causes */}
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Common Causes
      </Text>
      {event.commonCauses.map((cause) => (
        <View key={cause} className="flex-row mb-0.5">
          <Text className="text-[#555555] text-xs mr-1.5">·</Text>
          <Text className="text-[#A0A0A0] text-xs flex-1">{cause}</Text>
        </View>
      ))}

      {/* Field notes */}
      <Text className="text-[#A0A0A0] text-xs leading-4 mt-2">{event.fieldNotes}</Text>

      {/* Warning */}
      {event.warningFlag && <WarningBox text={event.warningFlag} />}

      {/* Nerd Stuff */}
      {event.nerdStuff && <NerdStuffSection nerd={event.nerdStuff as NerdStuff} />}
    </View>
  );
}

// ─── Pulse Width ──────────────────────────────────────────────────────────────

function PulseWidthTable({ rows }: { rows: PulseWidthGuidance[] }) {
  return (
    <>
      <TableHeader columns={["Pulse", "Range", "Use Case"]} />
      {rows.map((row, index) => (
        <View key={row.pulseWidthNs}>
          <View className="py-2">
            <View className="flex-row items-baseline">
              <Text className="text-white text-sm font-bold w-16">{row.pulseWidthNs} ns</Text>
              <Text className="text-[#A0A0A0] text-xs flex-1">{row.typicalRangeKm}</Text>
            </View>
            <Text className="text-[#A0A0A0] text-xs leading-4 mt-0.5 ml-16">
              {row.useCase}
            </Text>
            <Text className="text-[#555555] text-[10px] leading-4 mt-0.5 ml-16 italic">
              {row.deadZoneImpact}
            </Text>
          </View>
          {index < rows.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── IOR Table ────────────────────────────────────────────────────────────────

function IORTable({ rows }: { rows: IOREntry[] }) {
  return (
    <>
      {rows.map((row, index) => (
        <View key={row.ituDesignation}>
          <View className="py-2">
            <Text className="text-white text-xs font-semibold mb-1">{row.ituDesignation}</Text>
            <View className="flex-row mb-0.5">
              <Text className="text-[#555555] text-xs w-28">@ 1310 nm</Text>
              <Text className="text-[#A0A0A0] text-xs">{row.ior1310}</Text>
            </View>
            <View className="flex-row mb-0.5">
              <Text className="text-[#555555] text-xs w-28">@ 1550 nm</Text>
              <Text className="text-[#A0A0A0] text-xs">{row.ior1550}</Text>
            </View>
            {row.ior1625 && (
              <View className="flex-row mb-0.5">
                <Text className="text-[#555555] text-xs w-28">@ 1625 nm</Text>
                <Text className="text-[#A0A0A0] text-xs">{row.ior1625}</Text>
              </View>
            )}
            {row.exfoProfileName && (
              <View className="flex-row mb-0.5">
                <Text className="text-[#555555] text-xs w-28">EXFO Profile</Text>
                <Text className="text-[#A0A0A0] text-xs">{row.exfoProfileName}</Text>
              </View>
            )}
            <Text className="text-[#555555] text-[10px] leading-4 mt-1 italic">
              {row.notes}
            </Text>
          </View>
          {index < rows.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Wavelength Guide ─────────────────────────────────────────────────────────

function WavelengthCard({ wl }: { wl: WavelengthGuide }) {
  return (
    <View className="mb-3 bg-[#111111] rounded-lg border border-[#242424] p-3">
      <View className="flex-row items-baseline mb-1">
        <Text className="text-[#00FFFF] text-sm font-bold mr-2">{wl.wavelengthNm} nm</Text>
        <Text className="text-[#A0A0A0] text-xs">{wl.name}</Text>
        {wl.liveTrafficSafe && (
          <View className="ml-auto bg-[#00FF8815] border border-[#00FF8855] rounded px-1.5 py-0.5">
            <Text className="text-[#00FF88] text-[10px] font-semibold">Live-Safe</Text>
          </View>
        )}
      </View>
      <Text className="text-[#A0A0A0] text-xs leading-4 mb-2">{wl.primaryUse}</Text>
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Reveals
      </Text>
      {wl.reveals.map((r) => (
        <View key={r} className="flex-row mb-0.5">
          <Text className="text-[#555555] text-xs mr-1.5">·</Text>
          <Text className="text-[#A0A0A0] text-xs">{r}</Text>
        </View>
      ))}
      {wl.limitations.length > 0 && (
        <>
          <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mt-2 mb-1">
            Limitations
          </Text>
          {wl.limitations.map((l) => (
            <View key={l} className="flex-row mb-0.5">
              <Text className="text-[#555555] text-xs mr-1.5">·</Text>
              <Text className="text-[#A0A0A0] text-xs">{l}</Text>
            </View>
          ))}
        </>
      )}
      {wl.nerdStuff && <NerdStuffSection nerd={wl.nerdStuff as NerdStuff} />}
    </View>
  );
}

// ─── Dead Zones ───────────────────────────────────────────────────────────────

function DeadZoneCard({ dz }: { dz: DeadZone }) {
  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-1">
        <Text className="text-[#00FFFF] text-sm font-bold mr-2">{dz.abbreviation}</Text>
        <Text className="text-[#A0A0A0] text-xs capitalize">{dz.type} Dead Zone</Text>
      </View>
      <Text className="text-[#A0A0A0] text-xs leading-4 mb-2">{dz.definition}</Text>
      <View className="flex-row mb-0.5">
        <Text className="text-[#555555] text-xs w-32">Single-mode typical</Text>
        <Text className="text-white text-xs flex-1">{dz.typicalValueSM}</Text>
      </View>
      <View className="flex-row mb-0.5">
        <Text className="text-[#555555] text-xs w-32">Multimode typical</Text>
        <Text className="text-white text-xs flex-1">{dz.typicalValueMM}</Text>
      </View>
      <InfoBox text={dz.keyFact} />
      {dz.nerdStuff && <NerdStuffSection nerd={dz.nerdStuff as NerdStuff} />}
    </View>
  );
}

// ─── File Formats ─────────────────────────────────────────────────────────────

function FileFormatsTable({ formats }: { formats: FileFormat[] }) {
  return (
    <>
      {formats.map((fmt, index) => (
        <View key={fmt.extension}>
          <View className="py-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-white text-sm font-bold w-24">{fmt.extension}</Text>
              <View className={`border rounded px-1.5 py-0.5 ${fmt.isOpenStandard
                ? "border-[#00FF8855] bg-[#00FF8815]"
                : "border-[#44444455] bg-[#44444415]"}`}>
                <Text className={`text-[10px] font-semibold ${fmt.isOpenStandard ? "text-[#00FF88]" : "text-[#555555]"}`}>
                  {fmt.isOpenStandard ? "Open Standard" : "Proprietary"}
                </Text>
              </View>
            </View>
            <Text className="text-[#A0A0A0] text-xs mb-1">{fmt.fullName} — {fmt.owner}</Text>
            <Text className="text-[#555555] text-xs leading-4">{fmt.notes}</Text>
          </View>
          {index < formats.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Terminology Cross-Reference ──────────────────────────────────────────────

function TerminologyTable({ rows }: { rows: TerminologyEntry[] }) {
  const manufacturers = ["EXFO", "VIAVI", "Anritsu", "AFL"] as const;
  const keys: (keyof TerminologyEntry)[] = ["exfo", "viavi", "anritsu", "afl"];

  return (
    <>
      {rows.map((row, index) => (
        <View key={row.concept}>
          <View className="py-2">
            <Text className="text-white text-xs font-semibold mb-2">{row.concept}</Text>
            {manufacturers.map((mfr, i) => (
              <View key={mfr} className="flex-row mb-0.5">
                <Text className="text-[#555555] text-xs w-16">{mfr}</Text>
                <Text className="text-[#A0A0A0] text-xs flex-1">{row[keys[i]] as string}</Text>
              </View>
            ))}
            {row.notes && (
              <Text className="text-[#555555] text-[10px] leading-4 mt-1 italic">
                {row.notes}
              </Text>
            )}
          </View>
          {index < rows.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OtdrScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "OTDR Reference" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        {/* Events */}
        <SectionHeader title="Events" />
        {(otdrData.events as OTDREvent[]).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}

        {/* Trace Settings */}
        <SectionHeader title="Trace Settings" />

        <SectionCard title="Pulse Width">
          <PulseWidthTable rows={otdrData.traceSettings.pulseWidthGuidance as PulseWidthGuidance[]} />
        </SectionCard>

        <SectionCard title="Range Setting">
          <Text className="text-white text-xs font-semibold mb-1 mt-1">
            {otdrData.traceSettings.rangeSetting.rule}
          </Text>
          <Text className="text-[#A0A0A0] text-xs leading-4">
            {otdrData.traceSettings.rangeSetting.exampleNote}
          </Text>
        </SectionCard>

        <SectionCard title="Averaging Time">
          <View className="py-1.5">
            <View className="flex-row mb-0.5">
              <Text className="text-[#555555] text-xs w-24">Quick check</Text>
              <Text className="text-white text-xs">{otdrData.traceSettings.averagingTime.shortSeconds}</Text>
            </View>
            <Text className="text-[#A0A0A0] text-xs ml-24 mb-2 leading-4">
              {otdrData.traceSettings.averagingTime.shortUse}
            </Text>
            <Divider />
            <View className="flex-row mt-2 mb-0.5">
              <Text className="text-[#555555] text-xs w-24">Acceptance</Text>
              <Text className="text-white text-xs">{otdrData.traceSettings.averagingTime.longSeconds}</Text>
            </View>
            <Text className="text-[#A0A0A0] text-xs ml-24 mb-2 leading-4">
              {otdrData.traceSettings.averagingTime.longUse}
            </Text>
            <InfoBox text={otdrData.traceSettings.averagingTime.exfoAutoNote} />
          </View>
        </SectionCard>

        <SectionCard title="IOR Settings by Fiber Type">
          <IORTable rows={otdrData.traceSettings.iorTable as IOREntry[]} />
        </SectionCard>

        <SectionCard title="Wavelength Guide">
          <View className="pt-1">
            {(otdrData.traceSettings.wavelengthGuide as WavelengthGuide[]).map((wl) => (
              <WavelengthCard key={wl.wavelengthNm} wl={wl} />
            ))}
          </View>
        </SectionCard>

        {/* Dead Zones */}
        <SectionHeader title="Dead Zones" />
        <SectionCard title="Event Dead Zone (EDZ) & Attenuation Dead Zone (ADZ)">
          {(otdrData.deadZones as DeadZone[]).map((dz, index) => (
            <View key={dz.abbreviation}>
              <DeadZoneCard dz={dz} />
              {index < otdrData.deadZones.length - 1 && <Divider />}
            </View>
          ))}
        </SectionCard>

        {/* Bidirectional Testing */}
        <SectionHeader title="Bidirectional Testing" />
        <SectionCard title="Why Bidirectional Testing Is Required">
          <Text className="text-[#A0A0A0] text-xs leading-4 mt-1 mb-3">
            {otdrData.bidirectionalGuide.whyRequired}
          </Text>
          <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
            What Is a Gainer?
          </Text>
          <Text className="text-[#A0A0A0] text-xs leading-4 mb-3">
            {otdrData.bidirectionalGuide.whatIsGainer}
          </Text>
          <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
            Real-World Example
          </Text>
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
            <Text className="text-[#A0A0A0] text-xs leading-4">
              {otdrData.bidirectionalGuide.realWorldExample}
            </Text>
          </View>
          <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
            Procedure
          </Text>
          {otdrData.bidirectionalGuide.procedure.map((step, i) => (
            <View key={i} className="flex-row mb-1.5">
              <Text className="text-[#00FFFF] text-xs font-bold w-5">{i + 1}.</Text>
              <Text className="text-[#A0A0A0] text-xs flex-1 leading-4">{step}</Text>
            </View>
          ))}
          <Text className="text-[#555555] text-[10px] mt-2 italic">
            Standard: {otdrData.bidirectionalGuide.standard}
          </Text>
          {otdrData.bidirectionalGuide.nerdStuff && (
            <NerdStuffSection nerd={otdrData.bidirectionalGuide.nerdStuff as NerdStuff} />
          )}
        </SectionCard>

        {/* Launch Cable */}
        <SectionHeader title="Launch Cable" />
        <SectionCard title="Launch Cable Guide">
          <Text className="text-[#A0A0A0] text-xs leading-4 mt-1 mb-3">
            {otdrData.launchCableGuide.purpose}
          </Text>
          <View className="flex-row mb-0.5">
            <Text className="text-[#555555] text-xs w-32">SM minimum</Text>
            <Text className="text-white text-xs flex-1">{otdrData.launchCableGuide.minimumLengthSM}</Text>
          </View>
          <View className="flex-row mb-0.5">
            <Text className="text-[#555555] text-xs w-32">MM minimum</Text>
            <Text className="text-white text-xs flex-1">{otdrData.launchCableGuide.minimumLengthMM}</Text>
          </View>
          <View className="flex-row mb-0.5">
            <Text className="text-[#555555] text-xs w-32">Long-haul</Text>
            <Text className="text-white text-xs flex-1">{otdrData.launchCableGuide.longHaulMinimum}</Text>
          </View>
          <View className="flex-row mb-0.5 mt-1">
            <Text className="text-[#555555] text-xs w-32">EXFO formula</Text>
            <Text className="text-white text-xs flex-1 font-mono">{otdrData.launchCableGuide.exfoFormula}</Text>
          </View>
          <WarningBox text="Launch cable MUST match fiber type (SM or MM, same IOR) as the fiber under test." />
        </SectionCard>

        {/* File Formats */}
        <SectionHeader title="File Formats" />
        <SectionCard title="OTDR File Formats">
          <FileFormatsTable formats={otdrData.fileFormats as FileFormat[]} />
        </SectionCard>

        {/* Terminology */}
        <SectionHeader title="Terminology Cross-Reference" />
        <SectionCard title="EXFO / VIAVI / Anritsu / AFL">
          <TerminologyTable rows={otdrData.terminologyCrossReference as TerminologyEntry[]} />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

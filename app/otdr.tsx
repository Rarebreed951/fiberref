import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
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
      <AppText size="xs" color={c.text} className="font-semibold">
        {c.label}
      </AppText>
    </View>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: OTDREvent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {/* ── Header row — always visible ── */}
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center px-4 py-3"
      >
        <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">
          {event.name}
        </AppText>
        <CategoryBadge category={event.category} />
        <AppText size="xs" color="muted" style={{ marginLeft: 10 }}>
          {expanded ? "▲" : "▼"}
        </AppText>
      </Pressable>

      {/* ── Expanded detail ── */}
      {expanded && (
        <View className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* Trace appearance */}
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
              Trace Appearance
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4">{event.traceAppearance}</AppText>
          </View>

          {/* Common causes */}
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            Common Causes
          </AppText>
          {event.commonCauses.map((cause) => (
            <View key={cause} className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{cause}</AppText>
            </View>
          ))}

          {/* Field notes */}
          <AppText size="xs" color="secondary" className="leading-4 mt-2">{event.fieldNotes}</AppText>

          {/* Warning */}
          {event.warningFlag && <WarningBox text={event.warningFlag} />}

          {/* Nerd Stuff */}
          {event.nerdStuff && <NerdStuffSection nerd={event.nerdStuff as NerdStuff} />}
        </View>
      )}
    </View>
  );
}

// ─── Pulse Width ──────────────────────────────────────────────────────────────

function PulseWidthTable({ rows }: { rows: PulseWidthGuidance[] }) {
  return (
    <>
      <TableHeader columns={[
        { label: "Pulse",    className: "w-16" },
        { label: "Range",    className: "w-24" },
        { label: "Use Case", className: "flex-1" },
      ]} />
      {rows.map((row, index) => (
        <View key={row.pulseWidthNs}>
          <View className="py-2">
            <View className="flex-row items-baseline">
              <AppText size="sm" color="primary" className="font-bold w-16">{row.pulseWidthNs} ns</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{row.typicalRangeKm}</AppText>
            </View>
            <AppText size="xs" color="secondary" className="leading-4 mt-0.5 ml-16">
              {row.useCase}
            </AppText>
            <AppText size="xs" color="muted" className="leading-4 mt-0.5 ml-16 italic">
              {row.deadZoneImpact}
            </AppText>
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
            <AppText size="xs" color="primary" className="font-semibold mb-1">{row.ituDesignation}</AppText>
            <View className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-28">@ 1310 nm</AppText>
              <AppText size="xs" color="secondary">{row.ior1310}</AppText>
            </View>
            <View className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-28">@ 1550 nm</AppText>
              <AppText size="xs" color="secondary">{row.ior1550}</AppText>
            </View>
            {row.ior1625 && (
              <View className="flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-28">@ 1625 nm</AppText>
                <AppText size="xs" color="secondary">{row.ior1625}</AppText>
              </View>
            )}
            {row.exfoProfileName && (
              <View className="flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-28">EXFO Profile</AppText>
                <AppText size="xs" color="secondary">{row.exfoProfileName}</AppText>
              </View>
            )}
            <AppText size="xs" color="muted" className="leading-4 mt-1 italic">
              {row.notes}
            </AppText>
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
        <AppText size="sm" color="accentCyan" className="font-bold mr-2">{wl.wavelengthNm} nm</AppText>
        <AppText size="xs" color="secondary">{wl.name}</AppText>
        {wl.liveTrafficSafe && (
          <View className="ml-auto bg-[#00FF8815] border border-[#00FF8855] rounded px-1.5 py-0.5">
            <AppText size="xs" color="success" className="font-semibold">Live-Safe</AppText>
          </View>
        )}
      </View>
      <AppText size="xs" color="secondary" className="leading-4 mb-2">{wl.primaryUse}</AppText>
      <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
        Reveals
      </AppText>
      {wl.reveals.map((r) => (
        <View key={r} className="flex-row mb-0.5">
          <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
          <AppText size="xs" color="secondary">{r}</AppText>
        </View>
      ))}
      {wl.limitations.length > 0 && (
        <>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mt-2 mb-1">
            Limitations
          </AppText>
          {wl.limitations.map((l) => (
            <View key={l} className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary">{l}</AppText>
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
        <AppText size="sm" color="accentCyan" className="font-bold mr-2">{dz.abbreviation}</AppText>
        <AppText size="xs" color="secondary" className="capitalize">{dz.type} Dead Zone</AppText>
      </View>
      <AppText size="xs" color="secondary" className="leading-4 mb-2">{dz.definition}</AppText>
      <View className="flex-row mb-0.5">
        <AppText size="xs" color="muted" className="w-32">Single-mode typical</AppText>
        <AppText size="xs" color="primary" className="flex-1">{dz.typicalValueSM}</AppText>
      </View>
      <View className="flex-row mb-0.5">
        <AppText size="xs" color="muted" className="w-32">Multimode typical</AppText>
        <AppText size="xs" color="primary" className="flex-1">{dz.typicalValueMM}</AppText>
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
              <AppText size="sm" color="primary" className="font-bold w-24">{fmt.extension}</AppText>
              <View className={`border rounded px-1.5 py-0.5 ${fmt.isOpenStandard
                ? "border-[#00FF8855] bg-[#00FF8815]"
                : "border-[#44444455] bg-[#44444415]"}`}>
                <AppText
                  size="xs"
                  color={fmt.isOpenStandard ? "success" : "muted"}
                  className="font-semibold"
                >
                  {fmt.isOpenStandard ? "Open Standard" : "Proprietary"}
                </AppText>
              </View>
            </View>
            <AppText size="xs" color="secondary" className="mb-1">{fmt.fullName} — {fmt.owner}</AppText>
            <AppText size="xs" color="muted" className="leading-4">{fmt.notes}</AppText>
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
            <AppText size="xs" color="primary" className="font-semibold mb-2">{row.concept}</AppText>
            {manufacturers.map((mfr, i) => (
              <View key={mfr} className="flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-16">{mfr}</AppText>
                <AppText size="xs" color="secondary" className="flex-1">{row[keys[i]] as string}</AppText>
              </View>
            ))}
            {row.notes && (
              <AppText size="xs" color="muted" className="leading-4 mt-1 italic">
                {row.notes}
              </AppText>
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

        <SectionCard collapsible defaultOpen={false} title="Pulse Width">
          <PulseWidthTable rows={otdrData.traceSettings.pulseWidthGuidance as PulseWidthGuidance[]} />
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Range Setting">
          <AppText size="xs" color="primary" className="font-semibold mb-1 mt-1">
            {otdrData.traceSettings.rangeSetting.rule}
          </AppText>
          <AppText size="xs" color="secondary" className="leading-4">
            {otdrData.traceSettings.rangeSetting.exampleNote}
          </AppText>
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Averaging Time">
          <View className="py-1.5">
            <View className="flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-24">Quick check</AppText>
              <AppText size="xs" color="primary">{otdrData.traceSettings.averagingTime.shortSeconds}</AppText>
            </View>
            <AppText size="xs" color="secondary" className="ml-24 mb-2 leading-4">
              {otdrData.traceSettings.averagingTime.shortUse}
            </AppText>
            <Divider />
            <View className="flex-row mt-2 mb-0.5">
              <AppText size="xs" color="muted" className="w-24">Acceptance</AppText>
              <AppText size="xs" color="primary">{otdrData.traceSettings.averagingTime.longSeconds}</AppText>
            </View>
            <AppText size="xs" color="secondary" className="ml-24 mb-2 leading-4">
              {otdrData.traceSettings.averagingTime.longUse}
            </AppText>
            <InfoBox text={otdrData.traceSettings.averagingTime.exfoAutoNote} />
          </View>
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="IOR Settings by Fiber Type">
          <IORTable rows={otdrData.traceSettings.iorTable as IOREntry[]} />
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Wavelength Guide">
          <View className="pt-1">
            {(otdrData.traceSettings.wavelengthGuide as WavelengthGuide[]).map((wl) => (
              <WavelengthCard key={wl.wavelengthNm} wl={wl} />
            ))}
          </View>
        </SectionCard>

        {/* Dead Zones */}
        <SectionHeader title="Dead Zones" />
        <SectionCard collapsible defaultOpen={false} title="Event Dead Zone (EDZ) & Attenuation Dead Zone (ADZ)">
          {(otdrData.deadZones as DeadZone[]).map((dz, index) => (
            <View key={dz.abbreviation}>
              <DeadZoneCard dz={dz} />
              {index < otdrData.deadZones.length - 1 && <Divider />}
            </View>
          ))}
        </SectionCard>

        {/* Bidirectional Testing */}
        <SectionHeader title="Bidirectional Testing" />
        <SectionCard collapsible defaultOpen={false} title="Why Bidirectional Testing Is Required">
          <AppText size="xs" color="secondary" className="leading-4 mt-1 mb-3">
            {otdrData.bidirectionalGuide.whyRequired}
          </AppText>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            What Is a Gainer?
          </AppText>
          <AppText size="xs" color="secondary" className="leading-4 mb-3">
            {otdrData.bidirectionalGuide.whatIsGainer}
          </AppText>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            Real-World Example
          </AppText>
          <View className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
            <AppText size="xs" color="secondary" className="leading-4">
              {otdrData.bidirectionalGuide.realWorldExample}
            </AppText>
          </View>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1">
            Procedure
          </AppText>
          {otdrData.bidirectionalGuide.procedure.map((step, i) => (
            <View key={i} className="flex-row mb-1.5">
              <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{step}</AppText>
            </View>
          ))}
          <AppText size="xs" color="muted" className="mt-2 italic">
            Standard: {otdrData.bidirectionalGuide.standard}
          </AppText>
          {otdrData.bidirectionalGuide.nerdStuff && (
            <NerdStuffSection nerd={otdrData.bidirectionalGuide.nerdStuff as NerdStuff} />
          )}
        </SectionCard>

        {/* Launch Cable */}
        <SectionHeader title="Launch Cable" />
        <SectionCard collapsible defaultOpen={false} title="Launch Cable Guide">
          <AppText size="xs" color="secondary" className="leading-4 mt-1 mb-3">
            {otdrData.launchCableGuide.purpose}
          </AppText>
          <View className="flex-row mb-0.5">
            <AppText size="xs" color="muted" className="w-32">SM minimum</AppText>
            <AppText size="xs" color="primary" className="flex-1">{otdrData.launchCableGuide.minimumLengthSM}</AppText>
          </View>
          <View className="flex-row mb-0.5">
            <AppText size="xs" color="muted" className="w-32">MM minimum</AppText>
            <AppText size="xs" color="primary" className="flex-1">{otdrData.launchCableGuide.minimumLengthMM}</AppText>
          </View>
          <View className="flex-row mb-0.5">
            <AppText size="xs" color="muted" className="w-32">Long-haul</AppText>
            <AppText size="xs" color="primary" className="flex-1">{otdrData.launchCableGuide.longHaulMinimum}</AppText>
          </View>
          <View className="flex-row mb-0.5 mt-1">
            <AppText size="xs" color="muted" className="w-32">EXFO formula</AppText>
            <AppText size="xs" color="primary" className="flex-1 font-mono">{otdrData.launchCableGuide.exfoFormula}</AppText>
          </View>
          <WarningBox text="Launch cable MUST match fiber type (SM or MM, same IOR) as the fiber under test." />
        </SectionCard>

        {/* File Formats */}
        <SectionHeader title="File Formats" />
        <SectionCard collapsible defaultOpen={false} title="OTDR File Formats">
          <FileFormatsTable formats={otdrData.fileFormats as FileFormat[]} />
        </SectionCard>

        {/* Terminology */}
        <SectionHeader title="Terminology Cross-Reference" />
        <SectionCard collapsible defaultOpen={false} title="EXFO / VIAVI / Anritsu / AFL">
          <TerminologyTable rows={otdrData.terminologyCrossReference as TerminologyEntry[]} />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

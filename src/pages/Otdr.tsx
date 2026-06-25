import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import {
  SectionCard, SectionHeader, Divider,
  NerdStuffSection, WarningBox, InfoBox,
} from "../components/ui";
import otdrData from "../data/otdr/otdr.json";
import type {
  OTDREvent, EventCategory, PulseWidthGuidance,
  IOREntry, WavelengthGuide, DeadZone,
  FileFormat, TerminologyEntry,
} from "../data/otdr/types";
import type { NerdStuff } from "../types/shared";

// ─── Category badges ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<EventCategory, { text: string; border: string; bg: string; label: string }> = {
  reflective:       { text: "#00FFFF", border: "#00FFFF55", bg: "#00FFFF15", label: "Reflective" },
  "non-reflective": { text: "#FFB300", border: "#FFB30055", bg: "#FFB30015", label: "Non-Reflective" },
  ghost:            { text: "#AA88FF", border: "#AA88FF55", bg: "#AA88FF15", label: "Ghost" },
  "end-of-fiber":   { text: "#A0A0A0", border: "#44444455", bg: "#44444415", label: "End of Fiber" },
};

function CategoryBadge({ category }: { category: EventCategory }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span style={{ borderColor: c.border, backgroundColor: c.bg }} className="border rounded px-1.5 py-0.5">
      <AppText size="xs" color={c.text} className="font-semibold">{c.label}</AppText>
    </span>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: OTDREvent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-row items-center px-4 py-3 text-left"
      >
        <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">{event.name}</AppText>
        <CategoryBadge category={event.category} />
        <AppText size="xs" color="muted" style={{ marginLeft: 10 }}>{expanded ? "▲" : "▼"}</AppText>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Trace Appearance</AppText>
            <AppText size="xs" color="secondary" className="leading-4 block">{event.traceAppearance}</AppText>
          </div>

          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Common Causes</AppText>
          {event.commonCauses.map((cause) => (
            <div key={cause} className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{cause}</AppText>
            </div>
          ))}

          <AppText size="xs" color="secondary" className="leading-4 mt-2 block">{event.fieldNotes}</AppText>
          {event.warningFlag && <WarningBox text={event.warningFlag} />}
          {event.nerdStuff && <NerdStuffSection nerd={event.nerdStuff as NerdStuff} />}
        </div>
      )}
    </div>
  );
}

// ─── Pulse Width ──────────────────────────────────────────────────────────────

function PulseWidthTable({ rows }: { rows: PulseWidthGuidance[] }) {
  return (
    <>
      <div className="flex flex-row gap-3 py-2 border-b border-[#333333]">
        <AppText size="xs" color="muted" className="font-semibold w-16">Pulse</AppText>
        <AppText size="xs" color="muted" className="font-semibold w-24">Range</AppText>
        <AppText size="xs" color="muted" className="font-semibold flex-1">Use Case</AppText>
      </div>
      {rows.map((row, index) => (
        <div key={row.pulseWidthNs}>
          <div className="py-2">
            <div className="flex flex-row items-baseline">
              <AppText size="sm" color="primary" className="font-bold w-16">{row.pulseWidthNs} ns</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{row.typicalRangeKm}</AppText>
            </div>
            <AppText size="xs" color="secondary" className="leading-4 mt-0.5 ml-16 block">{row.useCase}</AppText>
            <AppText size="xs" color="muted" className="leading-4 mt-0.5 ml-16 italic block">{row.deadZoneImpact}</AppText>
          </div>
          {index < rows.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── IOR Table ────────────────────────────────────────────────────────────────

function IORTable({ rows }: { rows: IOREntry[] }) {
  return (
    <>
      {rows.map((row, index) => (
        <div key={row.ituDesignation}>
          <div className="py-2">
            <AppText size="xs" color="primary" className="font-semibold mb-1 block">{row.ituDesignation}</AppText>
            {[
              { label: "@ 1310 nm", value: row.ior1310 },
              { label: "@ 1550 nm", value: row.ior1550 },
              ...(row.ior1625 ? [{ label: "@ 1625 nm", value: row.ior1625 }] : []),
              ...(row.exfoProfileName ? [{ label: "EXFO Profile", value: row.exfoProfileName }] : []),
            ].map((r) => (
              <div key={r.label} className="flex flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-28">{r.label}</AppText>
                <AppText size="xs" color="secondary">{r.value}</AppText>
              </div>
            ))}
            <AppText size="xs" color="muted" className="leading-4 mt-1 italic block">{row.notes}</AppText>
          </div>
          {index < rows.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Wavelength Guide ─────────────────────────────────────────────────────────

function WavelengthCard({ wl }: { wl: WavelengthGuide }) {
  return (
    <div className="mb-3 bg-[#111111] rounded-lg border border-[#242424] p-3">
      <div className="flex flex-row items-baseline mb-1">
        <AppText size="sm" color="accentCyan" className="font-bold mr-2">{wl.wavelengthNm} nm</AppText>
        <AppText size="xs" color="secondary">{wl.name}</AppText>
        {wl.liveTrafficSafe && (
          <span className="ml-auto bg-[#00FF8815] border border-[#00FF8855] rounded px-1.5 py-0.5">
            <AppText size="xs" color="success" className="font-semibold">Live-Safe</AppText>
          </span>
        )}
      </div>
      <AppText size="xs" color="secondary" className="leading-4 mb-2 block">{wl.primaryUse}</AppText>
      <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Reveals</AppText>
      {wl.reveals.map((r) => (
        <div key={r} className="flex flex-row mb-0.5">
          <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
          <AppText size="xs" color="secondary">{r}</AppText>
        </div>
      ))}
      {wl.limitations.length > 0 && (
        <>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mt-2 mb-1 block">Limitations</AppText>
          {wl.limitations.map((l) => (
            <div key={l} className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary">{l}</AppText>
            </div>
          ))}
        </>
      )}
      {wl.nerdStuff && <NerdStuffSection nerd={wl.nerdStuff as NerdStuff} />}
    </div>
  );
}

// ─── Dead Zones ───────────────────────────────────────────────────────────────

function DeadZoneCard({ dz }: { dz: DeadZone }) {
  return (
    <div className="mb-3">
      <div className="flex flex-row items-center mb-1">
        <AppText size="sm" color="accentCyan" className="font-bold mr-2">{dz.abbreviation}</AppText>
        <AppText size="xs" color="secondary" className="capitalize">{dz.type} Dead Zone</AppText>
      </div>
      <AppText size="xs" color="secondary" className="leading-4 mb-2 block">{dz.definition}</AppText>
      {[
        { label: "Single-mode typical", value: dz.typicalValueSM },
        { label: "Multimode typical",   value: dz.typicalValueMM },
      ].map((r) => (
        <div key={r.label} className="flex flex-row mb-0.5">
          <AppText size="xs" color="muted" className="w-32">{r.label}</AppText>
          <AppText size="xs" color="primary" className="flex-1">{r.value}</AppText>
        </div>
      ))}
      <InfoBox text={dz.keyFact} />
      {dz.nerdStuff && <NerdStuffSection nerd={dz.nerdStuff as NerdStuff} />}
    </div>
  );
}

// ─── File Formats ─────────────────────────────────────────────────────────────

function FileFormatsTable({ formats }: { formats: FileFormat[] }) {
  return (
    <>
      {formats.map((fmt, index) => (
        <div key={fmt.extension}>
          <div className="py-2">
            <div className="flex flex-row items-center mb-1">
              <AppText size="sm" color="primary" className="font-bold w-24">{fmt.extension}</AppText>
              <span className={`border rounded px-1.5 py-0.5 ${
                fmt.isOpenStandard
                  ? "border-[#00FF8855] bg-[#00FF8815]"
                  : "border-[#44444455] bg-[#44444415]"
              }`}>
                <AppText size="xs" color={fmt.isOpenStandard ? "success" : "muted"} className="font-semibold">
                  {fmt.isOpenStandard ? "Open Standard" : "Proprietary"}
                </AppText>
              </span>
            </div>
            <AppText size="xs" color="secondary" className="mb-1 block">{fmt.fullName} — {fmt.owner}</AppText>
            <AppText size="xs" color="muted" className="leading-4 block">{fmt.notes}</AppText>
          </div>
          {index < formats.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Terminology ──────────────────────────────────────────────────────────────

function TerminologyTable({ rows }: { rows: TerminologyEntry[] }) {
  const manufacturers = ["EXFO", "VIAVI", "Anritsu", "AFL"] as const;
  const keys: (keyof TerminologyEntry)[] = ["exfo", "viavi", "anritsu", "afl"];

  return (
    <>
      {rows.map((row, index) => (
        <div key={row.concept}>
          <div className="py-2">
            <AppText size="xs" color="primary" className="font-semibold mb-2 block">{row.concept}</AppText>
            {manufacturers.map((mfr, i) => (
              <div key={mfr} className="flex flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-16">{mfr}</AppText>
                <AppText size="xs" color="secondary" className="flex-1">{row[keys[i]] as string}</AppText>
              </div>
            ))}
            {row.notes && (
              <AppText size="xs" color="muted" className="leading-4 mt-1 italic block">{row.notes}</AppText>
            )}
          </div>
          {index < rows.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OtdrScreen() {
  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <SectionHeader title="Events" />
        {(otdrData.events as OTDREvent[]).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}

        <SectionHeader title="Trace Settings" />

        <SectionCard collapsible defaultOpen={false} title="Pulse Width">
          <PulseWidthTable rows={otdrData.traceSettings.pulseWidthGuidance as PulseWidthGuidance[]} />
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Range Setting">
          <AppText size="xs" color="primary" className="font-semibold mb-1 mt-1 block">
            {otdrData.traceSettings.rangeSetting.rule}
          </AppText>
          <AppText size="xs" color="secondary" className="leading-4 block">
            {otdrData.traceSettings.rangeSetting.exampleNote}
          </AppText>
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Averaging Time">
          <div className="py-1.5">
            <div className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-24">Quick check</AppText>
              <AppText size="xs" color="primary">{otdrData.traceSettings.averagingTime.shortSeconds}</AppText>
            </div>
            <AppText size="xs" color="secondary" className="ml-24 mb-2 leading-4 block">
              {otdrData.traceSettings.averagingTime.shortUse}
            </AppText>
            <Divider />
            <div className="flex flex-row mt-2 mb-0.5">
              <AppText size="xs" color="muted" className="w-24">Acceptance</AppText>
              <AppText size="xs" color="primary">{otdrData.traceSettings.averagingTime.longSeconds}</AppText>
            </div>
            <AppText size="xs" color="secondary" className="ml-24 mb-2 leading-4 block">
              {otdrData.traceSettings.averagingTime.longUse}
            </AppText>
            <InfoBox text={otdrData.traceSettings.averagingTime.exfoAutoNote} />
          </div>
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="IOR Settings by Fiber Type">
          <IORTable rows={otdrData.traceSettings.iorTable as IOREntry[]} />
        </SectionCard>

        <SectionCard collapsible defaultOpen={false} title="Wavelength Guide">
          <div className="pt-1">
            {(otdrData.traceSettings.wavelengthGuide as WavelengthGuide[]).map((wl) => (
              <WavelengthCard key={wl.wavelengthNm} wl={wl} />
            ))}
          </div>
        </SectionCard>

        <SectionHeader title="Dead Zones" />
        <SectionCard collapsible defaultOpen={false} title="Event Dead Zone (EDZ) & Attenuation Dead Zone (ADZ)">
          {(otdrData.deadZones as DeadZone[]).map((dz, index) => (
            <div key={dz.abbreviation}>
              <DeadZoneCard dz={dz} />
              {index < otdrData.deadZones.length - 1 && <Divider />}
            </div>
          ))}
        </SectionCard>

        <SectionHeader title="Bidirectional Testing" />
        <SectionCard collapsible defaultOpen={false} title="Why Bidirectional Testing Is Required">
          <AppText size="xs" color="secondary" className="leading-4 mt-1 mb-3 block">
            {otdrData.bidirectionalGuide.whyRequired}
          </AppText>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">What Is a Gainer?</AppText>
          <AppText size="xs" color="secondary" className="leading-4 mb-3 block">{otdrData.bidirectionalGuide.whatIsGainer}</AppText>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Real-World Example</AppText>
          <div className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3">
            <AppText size="xs" color="secondary" className="leading-4 block">{otdrData.bidirectionalGuide.realWorldExample}</AppText>
          </div>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Procedure</AppText>
          {otdrData.bidirectionalGuide.procedure.map((step, i) => (
            <div key={i} className="flex flex-row mb-1.5">
              <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{step}</AppText>
            </div>
          ))}
          <AppText size="xs" color="muted" className="mt-2 italic block">
            Standard: {otdrData.bidirectionalGuide.standard}
          </AppText>
          {otdrData.bidirectionalGuide.nerdStuff && (
            <NerdStuffSection nerd={otdrData.bidirectionalGuide.nerdStuff as NerdStuff} />
          )}
        </SectionCard>

        <SectionHeader title="Launch Cable" />
        <SectionCard collapsible defaultOpen={false} title="Launch Cable Guide">
          <AppText size="xs" color="secondary" className="leading-4 mt-1 mb-3 block">
            {otdrData.launchCableGuide.purpose}
          </AppText>
          {[
            { label: "SM minimum",  value: otdrData.launchCableGuide.minimumLengthSM },
            { label: "MM minimum",  value: otdrData.launchCableGuide.minimumLengthMM },
            { label: "Long-haul",   value: otdrData.launchCableGuide.longHaulMinimum },
            { label: "EXFO formula", value: otdrData.launchCableGuide.exfoFormula },
          ].map((r) => (
            <div key={r.label} className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-32">{r.label}</AppText>
              <AppText size="xs" color="primary" className="flex-1 font-mono">{r.value}</AppText>
            </div>
          ))}
          <WarningBox text="Launch cable MUST match fiber type (SM or MM, same IOR) as the fiber under test." />
        </SectionCard>

        <SectionHeader title="File Formats" />
        <SectionCard collapsible defaultOpen={false} title="OTDR File Formats">
          <FileFormatsTable formats={otdrData.fileFormats as FileFormat[]} />
        </SectionCard>

        <SectionHeader title="Terminology Cross-Reference" />
        <SectionCard collapsible defaultOpen={false} title="EXFO / VIAVI / Anritsu / AFL">
          <TerminologyTable rows={otdrData.terminologyCrossReference as TerminologyEntry[]} />
        </SectionCard>
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import {
  SectionCard, SectionHeader, Divider,
  NerdStuffSection, InfoBox,
} from "../components/ui";
import iolmData from "../data/iolm/iolm.json";
import type {
  IOLMTestMethod, LossThreshold,
  ORLRequirement, WavelengthTestRequirement,
} from "../data/iolm/types";
import type { NerdStuff } from "../types/shared";

function ConnectorIncludedBadge({ included, label }: { included: boolean; label: string }) {
  return (
    <span className={`border rounded px-1.5 py-0.5 mr-1.5 ${
      included ? "border-[#00FF8855] bg-[#00FF8815]" : "border-[#44444455] bg-[#44444415]"
    }`}>
      <AppText size="xs" color={included ? "success" : "muted"} className="font-semibold">
        {label} {included ? "included" : "excluded"}
      </AppText>
    </span>
  );
}

function TestMethodCard({ method }: { method: IOLMTestMethod }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full px-4 py-3 text-left">
        <div className="flex flex-row items-center">
          <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">{method.name}</AppText>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </div>
        <div className="flex flex-row flex-wrap mt-1.5">
          {method.standardRefs.map((ref) => (
            <span key={ref} className="border border-[#2A2A2A] rounded px-1.5 py-0.5 mr-1.5 mb-1">
              <AppText size="xs" color="muted">{ref}</AppText>
            </span>
          ))}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">What It Measures</AppText>
            <AppText size="xs" color="secondary" className="leading-4 block">{method.whatItMeasures}</AppText>
          </div>

          <div className="flex flex-row mb-3">
            <ConnectorIncludedBadge included={method.includesNearEndConnector} label="Near-end connector" />
            <ConnectorIncludedBadge included={method.includesFarEndConnector}  label="Far-end connector" />
          </div>

          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1.5 block">Reference Setup Steps</AppText>
          {method.referenceSetupSteps.map((step, i) => (
            <div key={i} className="flex flex-row mb-1.5">
              <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{step}</AppText>
            </div>
          ))}

          <div className="mt-2">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Primary Use Case</AppText>
            <AppText size="xs" color="secondary" className="leading-4 mb-2 block">{method.primaryUseCase}</AppText>
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Field Notes</AppText>
            <AppText size="xs" color="secondary" className="leading-4 block">{method.fieldNotes}</AppText>
          </div>

          {method.nerdStuff && <NerdStuffSection nerd={method.nerdStuff as NerdStuff} />}
        </div>
      )}
    </div>
  );
}

function LossThresholdTable({ thresholds }: { thresholds: LossThreshold[] }) {
  return (
    <>
      {thresholds.map((t, index) => (
        <div key={t.component}>
          <div className="py-2">
            <AppText size="xs" color="primary" className="font-semibold mb-1 block">{t.component}</AppText>
            <div className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="w-28">Max (spec)</AppText>
              <AppText size="xs" color="danger" className="font-bold">≤ {t.maxLossdB} dB</AppText>
            </div>
            {t.typicalGooddB != null && (
              <div className="flex flex-row mb-0.5">
                <AppText size="xs" color="muted" className="w-28">Typical good</AppText>
                <AppText size="xs" color="success">{t.typicalGooddB} dB</AppText>
              </div>
            )}
            <div className="flex flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Standard</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{t.standard}</AppText>
            </div>
            <AppText size="xs" color="muted" className="leading-4 italic block">{t.notes}</AppText>
          </div>
          {index < thresholds.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

function ORLTable({ requirements }: { requirements: ORLRequirement[] }) {
  return (
    <>
      {requirements.map((req, index) => (
        <div key={req.applicationContext}>
          <div className="py-2">
            <div className="flex flex-row items-baseline mb-1">
              <AppText size="xs" color="primary" className="font-semibold flex-1 mr-2">{req.applicationContext}</AppText>
              <AppText size="sm" color="accentCyan" className="font-bold">≥ {req.minORLdB} dB</AppText>
            </div>
            <AppText size="xs" color="muted" className="leading-4 italic block">{req.notes}</AppText>
          </div>
          {index < requirements.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

function WavelengthRows({ items }: { items: WavelengthTestRequirement[] }) {
  return (
    <>
      {items.map((row, index) => (
        <div key={row.wavelengthNm}>
          <div className="py-2">
            <div className="flex flex-row items-center mb-1">
              <AppText size="sm" color="accentCyan" className="font-bold mr-2">{row.wavelengthNm} nm</AppText>
              <AppText size="xs" color="muted">{row.standard}</AppText>
            </div>
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Required For</AppText>
            {row.requiredFor.map((use) => (
              <div key={use} className="flex flex-row mb-0.5">
                <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
                <AppText size="xs" color="secondary" className="flex-1">{use}</AppText>
              </div>
            ))}
            <AppText size="xs" color="muted" className="leading-4 italic mt-1 block">{row.notes}</AppText>
          </div>
          {index < items.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

function WavelengthRequirementTable({ rows }: { rows: WavelengthTestRequirement[] }) {
  const smf = rows.filter((r) => r.fiberCategory === "SMF");
  const mmf = rows.filter((r) => r.fiberCategory === "MMF");
  return (
    <>
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1 block">Single-Mode Fiber (SMF)</AppText>
      <WavelengthRows items={smf} />
      <div className="h-3" />
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1 block">Multimode Fiber (MMF)</AppText>
      <WavelengthRows items={mmf} />
    </>
  );
}

export default function IolmScreen() {
  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <div className="mx-3 mb-3">
          <InfoBox text={`Reference: ${iolmData.primaryReference}`} />
        </div>

        <SectionHeader title="Test Methods" />
        {(iolmData.testMethods as IOLMTestMethod[]).map((method) => (
          <TestMethodCard key={method.id} method={method} />
        ))}

        <SectionHeader title="Loss Thresholds" />
        <SectionCard title="Component Loss Limits" collapsible defaultOpen={false}>
          <LossThresholdTable thresholds={iolmData.lossThresholds as LossThreshold[]} />
        </SectionCard>

        <SectionHeader title="ORL Requirements" />
        <SectionCard title="Optical Return Loss by Application" collapsible defaultOpen={false}>
          <ORLTable requirements={iolmData.orlRequirements as ORLRequirement[]} />
        </SectionCard>

        <SectionHeader title="Wavelength Requirements" />
        <SectionCard title="Test Wavelengths by Fiber Type" collapsible defaultOpen={false}>
          <WavelengthRequirementTable rows={iolmData.wavelengthTestRequirements as WavelengthTestRequirement[]} />
        </SectionCard>

        <SectionHeader title="Field Notes" />
        <SectionCard title="Field Notes" collapsible defaultOpen={false}>
          {iolmData.fieldNotes.map((note, i) => (
            <div key={i} className="flex flex-row mb-2.5">
              <AppText size="xs" color="accentCyan" className="font-bold w-5">{i + 1}.</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{note}</AppText>
            </div>
          ))}
        </SectionCard>
      </div>
    </AppShell>
  );
}

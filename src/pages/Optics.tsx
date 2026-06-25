import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { SectionCard, SectionHeader, Divider, NerdStuffSection } from "../components/ui";
import opticsData from "../data/optics/optics.json";
import type { TransceiverFormFactor, TransceiverSpec } from "../data/optics/types";
import type { NerdStuff } from "../types/shared";

function formatWavelength(wavelengthNm: number | number[]): string {
  if (Array.isArray(wavelengthNm)) return wavelengthNm.map((w) => `${w} nm`).join(" / ");
  return `${wavelengthNm} nm`;
}

function formatReach(maxReachM: number): string {
  return maxReachM >= 1000 ? `${maxReachM / 1000} km` : `${maxReachM} m`;
}

function FormFactorCard({ ff }: { ff: TransceiverFormFactor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-row items-center px-4 py-3 text-left"
      >
        <AppText size="md" color="accentCyan" className="font-bold flex-1">{ff.name}</AppText>
        <AppText size="xs" color="muted" style={{ marginLeft: 8 }}>{expanded ? "▲" : "▼"}</AppText>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="flex flex-row mt-3 mb-3 gap-2">
            {[
              { label: "Lanes",    value: String(ff.lanesCount) },
              { label: "Max Rate", value: `${ff.maxLineRateGbps} G` },
              { label: "Hot-swap", value: ff.hotSwappable ? "Yes" : "No" },
            ].map((item) => (
              <div key={item.label} className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
                <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5 block">{item.label}</AppText>
                <AppText size="xs" color="primary" className="font-semibold block">{item.value}</AppText>
              </div>
            ))}
          </div>
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Common Rates</AppText>
          <AppText size="xs" color="secondary" className="mb-2 block">{ff.commonRatesGbps.map((r) => `${r}G`).join(", ")}</AppText>
          <AppText size="xs" color="secondary" className="leading-4 block">{ff.notes}</AppText>
        </div>
      )}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "cyan" | "amber" }) {
  const borderColor = color === "cyan" ? "border-[#00FFFF55]" : "border-[#FFB30055]";
  const bgColor     = color === "cyan" ? "bg-[#00FFFF15]"    : "bg-[#FFB30015]";
  const appColor    = color === "cyan" ? "accentCyan"         : "accentAmber";
  return (
    <span className={`border rounded px-1.5 py-0.5 mr-1.5 ${borderColor} ${bgColor}`}>
      <AppText size="xs" color={appColor} className="font-semibold">{label}</AppText>
    </span>
  );
}

function TransceiverCard({ spec }: { spec: TransceiverSpec }) {
  const [expanded, setExpanded] = useState(false);
  const powerBudgetDb = Math.round((spec.txPowerDbmMin - spec.rxSensitivityDbm) * 10) / 10;

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 text-left"
      >
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center flex-1 flex-wrap gap-2 mr-2">
            <AppText size="md" color="accentCyan" className="font-bold">{spec.protocol}</AppText>
            <AppText size="xs" color="muted">{spec.lineRateGbps} Gbps</AppText>
            {spec.isBidi && <Badge label="BiDi" color="amber" />}
            {spec.isWdm  && <Badge label="WDM"  color="cyan"  />}
          </div>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="bg-[#111111] rounded-lg p-2 border border-[#242424] mb-3 mt-3">
            {[
              { label: "Wavelength",    value: formatWavelength(spec.wavelengthNm) },
              { label: "Connector",     value: spec.connectorType },
              { label: "Fiber types",   value: spec.fiberTypes.join(", ") },
              { label: "Max reach",     value: formatReach(spec.maxReachM) },
            ].map((row) => (
              <div key={row.label} className="flex flex-row mb-1">
                <AppText size="xs" color="muted" className="w-28">{row.label}</AppText>
                <AppText size="xs" color="primary" className="flex-1">{row.value}</AppText>
              </div>
            ))}
            <Divider />
            <div className="flex flex-row mt-1 mb-1">
              <AppText size="xs" color="muted" className="w-28">TX power</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{spec.txPowerDbmMin} to {spec.txPowerDbmMax} dBm</AppText>
            </div>
            <div className="flex flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">RX sensitivity</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{spec.rxSensitivityDbm} dBm</AppText>
            </div>
            <div className="flex flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">RX overload</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{spec.rxOverloadDbm} dBm</AppText>
            </div>
            <div className="flex flex-row">
              <AppText size="xs" color="muted" className="w-28">Power budget</AppText>
              <AppText size="xs" color="success" className="font-semibold flex-1">{powerBudgetDb} dB</AppText>
            </div>
          </div>
          <AppText size="xs" color="secondary" className="leading-4 block">{spec.fieldNotes}</AppText>
          {spec.nerdStuff && <NerdStuffSection nerd={spec.nerdStuff as NerdStuff} />}
        </div>
      )}
    </div>
  );
}

function TransceiverGroup({ ff, specs }: { ff: TransceiverFormFactor; specs: TransceiverSpec[] }) {
  if (specs.length === 0) return null;
  return (
    <>
      <SectionHeader title={ff.name} />
      {specs.map((spec) => <TransceiverCard key={spec.id} spec={spec} />)}
    </>
  );
}

const formFactors  = opticsData.formFactors  as TransceiverFormFactor[];
const transceivers = opticsData.transceivers as TransceiverSpec[];

export default function OpticsScreen() {
  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <SectionHeader title="Form Factors" />
        {formFactors.map((ff) => <FormFactorCard key={ff.id} ff={ff} />)}

        <SectionHeader title="Transceivers" />
        {formFactors.map((ff) => (
          <TransceiverGroup
            key={ff.id}
            ff={ff}
            specs={transceivers.filter((t) => t.formFactorId === ff.id)}
          />
        ))}

        <SectionHeader title="Field Notes" />
        <SectionCard title="General Field Notes" collapsible defaultOpen={false}>
          {opticsData.generalFieldNotes.map((note, i) => (
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

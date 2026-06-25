import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { SectionHeader, SpecRow, NerdStuffSection } from "../components/ui";
import fiberData from "../data/fiberTypes/fiberTypes.json";
import type { FiberTypeSpec } from "../data/fiberTypes/types";
import type { NerdStuff } from "../types/shared";

function FiberCard({ fiber }: { fiber: FiberTypeSpec }) {
  const [expanded, setExpanded] = useState(false);
  const isSingleMode = fiber.category === "single-mode";

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full text-left px-4 py-3">
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center flex-wrap flex-1 gap-2 mr-2">
            <AppText size="md" color="accentCyan" className="font-bold">{fiber.ituDesignation}</AppText>
            {fiber.tiaDesignation && (
              <span className="bg-[#00FFFF20] border border-[#00FFFF55] rounded px-1.5 py-0.5">
                <AppText size="xs" color="accentCyan" className="font-semibold">{fiber.tiaDesignation}</AppText>
              </span>
            )}
            {!fiber.activelyInstalled && (
              <span className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                <AppText size="xs" color="accentAmber" className="font-semibold">LEGACY</AppText>
              </span>
            )}
          </div>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </div>
        <AppText size="xs" color="secondary" className="mt-0.5 block">
          {fiber.commonNames.join(" · ")}
        </AppText>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="mt-2 mb-3">
            <SpecRow label="Core / Cladding" value={`${fiber.coreDiameterMicron} / ${fiber.claddingDiameterMicron} µm`} />
            {isSingleMode && fiber.mfdAt1310nmMicron != null && (
              <SpecRow label="MFD @ 1310 nm" value={`${fiber.mfdAt1310nmMicron} µm`} />
            )}
            {isSingleMode && fiber.mfdAt1550nmMicron != null && (
              <SpecRow label="MFD @ 1550 nm" value={`${fiber.mfdAt1550nmMicron} µm`} />
            )}
            {!isSingleMode && fiber.na != null && (
              <SpecRow label="Numerical Aperture" value={fiber.na.toFixed(3)} />
            )}
            {fiber.attenuationAt1310nmMax != null && (
              <SpecRow label="Atten. @ 1310 nm" value={`≤ ${fiber.attenuationAt1310nmMax} dB/km`} />
            )}
            {fiber.attenuationAt1550nmMax != null && (
              <SpecRow label="Atten. @ 1550 nm" value={`≤ ${fiber.attenuationAt1550nmMax} dB/km`} />
            )}
            <SpecRow label="Min. Bend Radius" value={`${fiber.minBendRadiusMm} mm`} />
          </div>

          <AppText size="xs" color="secondary" className="leading-4 mb-2 block">{fiber.primaryUseCase}</AppText>

          <div className="bg-[#111111] rounded-lg p-2 border border-[#242424]">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">
              Compatibility
            </AppText>
            <AppText size="xs" color="secondary" className="leading-4 block">{fiber.compatibilityNotes}</AppText>
          </div>

          {fiber.nerdStuff && <NerdStuffSection nerd={fiber.nerdStuff as NerdStuff} />}
        </div>
      )}
    </div>
  );
}

const fibers     = fiberData.fiberTypes as FiberTypeSpec[];
const singleMode = fibers.filter((f) => f.category === "single-mode");
const multimode  = fibers.filter((f) => f.category === "multimode");

export default function FiberTypesScreen() {
  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <SectionHeader title="Single-Mode Fiber" />
        {singleMode.map((fiber) => <FiberCard key={fiber.id} fiber={fiber} />)}
        <SectionHeader title="Multimode Fiber" />
        {multimode.map((fiber) => <FiberCard key={fiber.id} fiber={fiber} />)}
      </div>
    </AppShell>
  );
}

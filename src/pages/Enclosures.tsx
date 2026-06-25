import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import {
  SectionCard, SectionHeader, Divider, NerdStuffSection,
} from "../components/ui";
import enclosureData from "../data/enclosures/enclosures.json";
import type {
  EnclosureType, EnclosureBrand, EnclosureModel,
  SpliceTray, EnclosureSelectionGuide,
} from "../data/enclosures/types";
import type { NerdStuff } from "../types/shared";

function EnvTag({ label }: { label: string }) {
  return (
    <span className="border border-[#2A2A2A] rounded px-1.5 py-0.5 mr-1 mb-1">
      <AppText size="xs" color="muted">{label}</AppText>
    </span>
  );
}

function EnclosureTypeCard({ enclosureType }: { enclosureType: EnclosureType }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full px-4 py-3 text-left">
        <div className="flex flex-row items-center">
          <AppText size="md" color="accentCyan" className="font-bold flex-1 mr-2">{enclosureType.name}</AppText>
          <AppText size="xs" color="muted">{expanded ? "▲" : "▼"}</AppText>
        </div>
        <AppText size="xs" color="secondary" className="mt-0.5 block">{enclosureType.commonAliases.join(" · ")}</AppText>
        <div className="flex flex-row flex-wrap mt-1.5">
          {enclosureType.mountingEnvironments.map((env) => <EnvTag key={env} label={env} />)}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="flex flex-row mt-3 mb-3 gap-2">
            <div className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5 block">Splice Capacity</AppText>
              <AppText size="xs" color="primary" className="font-semibold block">{enclosureType.spliceCapacityRange}</AppText>
            </div>
            <div className="flex-1 bg-[#111111] rounded-lg p-2 border border-[#242424]">
              <AppText size="xs" color="muted" className="uppercase tracking-wider mb-0.5 block">Max Fiber Count</AppText>
              <AppText size="xs" color="primary" className="font-semibold block">{enclosureType.maxFiberCountRange}</AppText>
            </div>
          </div>

          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Key Features</AppText>
          {enclosureType.keyFeatures.map((feature) => (
            <div key={feature} className="flex flex-row mb-0.5">
              <AppText size="xs" color="muted" className="mr-1.5">·</AppText>
              <AppText size="xs" color="secondary" className="flex-1 leading-4">{feature}</AppText>
            </div>
          ))}

          <AppText size="xs" color="secondary" className="leading-4 mt-2 block">{enclosureType.fieldNotes}</AppText>
          {enclosureType.nerdStuff && <NerdStuffSection nerd={enclosureType.nerdStuff as NerdStuff} />}
        </div>
      )}
    </div>
  );
}

function ModelRow({ model }: { model: EnclosureModel }) {
  return (
    <div className="py-2">
      <div className="flex flex-row items-baseline mb-0.5">
        <AppText size="xs" color="primary" className="font-bold mr-2">{model.modelName}</AppText>
        <div className="flex flex-row flex-wrap flex-1">
          {model.environments.map((env) => <EnvTag key={env} label={env} />)}
        </div>
      </div>
      <div className="flex flex-row mb-1">
        <div className="flex flex-row mr-3">
          <AppText size="xs" color="muted" className="mr-1">Trays</AppText>
          <AppText size="xs" color="secondary">{model.maxSpliceTrays}</AppText>
        </div>
        <div className="flex flex-row">
          <AppText size="xs" color="muted" className="mr-1">Max fibers</AppText>
          <AppText size="xs" color="secondary">{model.maxFibers}F</AppText>
        </div>
      </div>
      <AppText size="xs" color="muted" className="leading-4 italic block">{model.notes}</AppText>
    </div>
  );
}

function BrandCard({ brand }: { brand: EnclosureBrand }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full flex flex-row items-center px-4 py-3 text-left">
        <AppText size="md" color="accentCyan" className="font-bold flex-1">{brand.manufacturer}</AppText>
        <AppText size="xs" color="muted" style={{ marginLeft: 8 }}>{expanded ? "▲" : "▼"}</AppText>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 mt-3 block">Notable Models</AppText>
          {brand.notableModels.map((model, index) => (
            <div key={model.modelName}>
              <ModelRow model={model} />
              {index < brand.notableModels.length - 1 && <Divider />}
            </div>
          ))}
          <div className="mt-2 bg-[#111111] rounded-lg p-2 border border-[#242424]">
            <AppText size="xs" color="secondary" className="leading-4 block">{brand.notes}</AppText>
          </div>
        </div>
      )}
    </div>
  );
}

function SpliceTrayTable({ trays }: { trays: SpliceTray[] }) {
  return (
    <>
      {trays.map((tray, index) => (
        <div key={tray.id}>
          <div className="py-2">
            <div className="flex flex-row items-center mb-1">
              <AppText size="xs" color="primary" className="font-bold flex-1">{tray.name}</AppText>
              <span className={`border rounded px-1.5 py-0.5 ${
                tray.ribbonCapable
                  ? "border-[#00FFFF55] bg-[#00FFFF15]"
                  : "border-[#44444455] bg-[#44444415]"
              }`}>
                <AppText size="xs" color={tray.ribbonCapable ? "accentCyan" : "muted"} className="font-semibold">
                  {tray.ribbonCapable ? "Ribbon capable" : "Single-fiber only"}
                </AppText>
              </span>
            </div>
            <div className="flex flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Fusion capacity</AppText>
              <AppText size="xs" color="secondary">{tray.fusionCapacity} splices</AppText>
            </div>
            <div className="flex flex-row mb-1">
              <AppText size="xs" color="muted" className="w-28">Compatible with</AppText>
              <AppText size="xs" color="secondary" className="flex-1">{tray.compatibleManufacturers.join(", ")}</AppText>
            </div>
            <AppText size="xs" color="muted" className="leading-4 italic block">{tray.notes}</AppText>
          </div>
          {index < trays.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

const TYPE_NAME_MAP: Record<string, string> = {
  "dome":                    "Dome Closure",
  "inline-horizontal":       "Inline / Horizontal Closure",
  "wall-mount":              "Wall-Mount / BET",
  "rack-mount":              "Rack-Mount",
  "fiber-distribution-hub":  "Fiber Distribution Hub (FDH)",
};

function SelectionGuideTable({ guide }: { guide: EnclosureSelectionGuide[] }) {
  return (
    <>
      {guide.map((entry, index) => (
        <div key={entry.scenario}>
          <div className="py-2">
            <AppText size="xs" color="primary" className="font-semibold mb-1 block">{entry.scenario}</AppText>
            <div className="flex flex-row items-center mb-1">
              <AppText size="xs" color="muted" className="mr-1.5">→</AppText>
              <AppText size="xs" color="accentCyan" className="font-semibold">
                {TYPE_NAME_MAP[entry.recommendedTypeId] ?? entry.recommendedTypeId}
              </AppText>
            </div>
            <AppText size="xs" color="muted" className="leading-4 italic block">{entry.notes}</AppText>
          </div>
          {index < guide.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

export default function EnclosuresScreen() {
  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <SectionHeader title="Enclosure Types" />
        {(enclosureData.enclosureTypes as EnclosureType[]).map((enclosureType) => (
          <EnclosureTypeCard key={enclosureType.id} enclosureType={enclosureType} />
        ))}

        <SectionHeader title="Brands & Notable Models" />
        {(enclosureData.brands as EnclosureBrand[]).map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}

        <SectionHeader title="Splice Trays" />
        <SectionCard title="Tray Types" collapsible defaultOpen={false}>
          <SpliceTrayTable trays={enclosureData.spliceTrays as SpliceTray[]} />
        </SectionCard>

        <SectionHeader title="Selection Guide" />
        <SectionCard title="Recommended Enclosure by Scenario" collapsible defaultOpen={false}>
          <SelectionGuideTable guide={enclosureData.selectionGuide as EnclosureSelectionGuide[]} />
        </SectionCard>
      </div>
    </AppShell>
  );
}

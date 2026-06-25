import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { SectionCard, TableHeader, Divider } from "../components/ui";
import colorData from "../data/colorCodes/colorCodes.json";
import type {
  FiberColor, BufferTube, Ribbon, JacketColor, ConnectorColor,
} from "../data/colorCodes/types";
import { useCableConfig } from "../context/CableConfigContext";
import type { TubeEntry } from "../types/cableConfig";

function Swatch({ hex, size = 18 }: { hex: string; size?: number }) {
  const borderColor = hex === "#FFFFFF" || hex === "#FFD700" ? "#444444" : "transparent";
  return (
    <div
      style={{
        width: size, height: size, backgroundColor: hex,
        borderRadius: 3, border: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Config Selector ──────────────────────────────────────────────────────────

function ConfigSelector() {
  const navigate = useNavigate();
  const { configs, activeConfigId, activeConfig, setActiveConfig, canAddMore } = useCableConfig();

  return (
    <div className="mx-3 mb-3">
      <div className="bg-[#1A1A1A] rounded-[10px] border border-[#2A2A2A] p-3 flex flex-row items-center">
        <div className="flex-1">
          <AppText size="xs" color="muted" className="mb-0.5 block">Active Config</AppText>
          <div className="flex flex-row items-center gap-1.5">
            {!activeConfigId && <AppText size="xs" color="muted">🔒</AppText>}
            <AppText size="sm" color="primary" className="font-semibold">
              {activeConfig?.name ?? "Standard (TIA-598)"}
            </AppText>
          </div>
        </div>
        {activeConfigId && (
          <button
            type="button"
            onClick={() => navigate(`/cable-config?id=${activeConfigId}`)}
            className="border border-[#333] rounded-lg px-2.5 py-1.5 mr-2"
          >
            <AppText size="xs" color="secondary">Edit</AppText>
          </button>
        )}
        {canAddMore && (
          <button
            type="button"
            onClick={() => navigate("/cable-config")}
            className="border border-[#00FFFF66] rounded-lg px-2.5 py-1.5"
          >
            <AppText size="xs" color="accentCyan">+ New</AppText>
          </button>
        )}
      </div>

      {configs.length > 0 && (
        <div className="flex flex-row overflow-x-auto mt-2 gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveConfig(null)}
            className={`border rounded-full px-3 py-1.5 whitespace-nowrap ${
              !activeConfigId ? "border-[#00FFFF] bg-[#00FFFF15]" : "border-[#333] bg-[#111]"
            }`}
          >
            <AppText size="xs" color={!activeConfigId ? "accentCyan" : "secondary"}>Standard</AppText>
          </button>
          {configs.map((cfg) => (
            <button
              key={cfg.id}
              type="button"
              onClick={() => setActiveConfig(cfg.id)}
              className={`border rounded-full px-3 py-1.5 whitespace-nowrap ${
                activeConfigId === cfg.id ? "border-[#00FFFF] bg-[#00FFFF15]" : "border-[#333] bg-[#111]"
              }`}
            >
              <AppText size="xs" color={activeConfigId === cfg.id ? "accentCyan" : "secondary"}>
                {cfg.name}
              </AppText>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Fiber Sequence ───────────────────────────────────────────────────────────

function FiberSequenceTable({ fibers }: { fibers: FiberColor[] }) {
  return (
    <>
      <TableHeader columns={[
        { label: "#",    className: "w-8" },
        { label: "",     className: "w-8" },
        { label: "Name", className: "flex-1" },
        { label: "Abbr", className: "w-12" },
      ]} />
      {fibers.map((fiber, index) => (
        <div key={fiber.position}>
          <div className="flex flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-8">{fiber.position}</AppText>
            <div className="w-8"><Swatch hex={fiber.colorHex} /></div>
            <AppText size="sm" color="primary" className="flex-1">{fiber.colorName}</AppText>
            <AppText size="sm" color="secondary" className="w-12">{fiber.abbreviation}</AppText>
          </div>
          {index < fibers.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Buffer Tubes ─────────────────────────────────────────────────────────────

const TRACER_GROUPS = [
  { label: "No tracer (tubes 1–12)",     start: 1,  end: 12 },
  { label: "Black tracer (tubes 13–24)", start: 13, end: 24 },
  { label: "Orange tracer (tubes 25–36)", start: 25, end: 36 },
  { label: "Green tracer (tubes 37–48)", start: 37, end: 48 },
];

function StandardBufferTubeTable({ tubes }: { tubes: BufferTube[] }) {
  return (
    <>
      {TRACER_GROUPS.map((group, groupIndex) => {
        const groupTubes = tubes.filter((t) => t.tubeNumber >= group.start && t.tubeNumber <= group.end);
        if (groupTubes.length === 0) return null;
        return (
          <div key={group.label}>
            {groupIndex > 0 && <div className="h-3" />}
            <AppText size="xs" color="accentAmber" className="font-semibold mb-1 block">{group.label}</AppText>
            <TableHeader columns={[
              { label: "#",      className: "w-8" },
              { label: "",       className: "w-8" },
              { label: "Tracer", className: "w-14" },
              { label: "Name",   className: "flex-1" },
            ]} />
            {groupTubes.map((tube, index) => (
              <div key={tube.tubeNumber}>
                <div className="flex flex-row gap-3 items-center py-2">
                  <AppText size="sm" color="secondary" className="w-8">{tube.tubeNumber}</AppText>
                  <div className="w-8"><Swatch hex={tube.colorHex} /></div>
                  <div className="w-14">
                    {tube.tracerHex ? <Swatch hex={tube.tracerHex} /> : <AppText size="xs" color="muted">—</AppText>}
                  </div>
                  <AppText size="sm" color="primary" className="flex-1">
                    {tube.tracerColor ? `${tube.colorName} / ${tube.tracerColor}` : tube.colorName}
                  </AppText>
                </div>
                {index < groupTubes.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

function CustomBufferTubeTable({ tubes }: { tubes: TubeEntry[] }) {
  return (
    <>
      <TableHeader columns={[
        { label: "#",      className: "w-8" },
        { label: "",       className: "w-8" },
        { label: "Trcr",   className: "w-8" },
        { label: "Name",   className: "flex-1" },
        { label: "Fibers", className: "w-14" },
      ]} />
      {tubes.map((tube, index) => (
        <div key={tube.tubeNumber}>
          <div className="flex flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-8">{tube.tubeNumber}</AppText>
            <div className="w-8"><Swatch hex={tube.colorHex} /></div>
            <div className="w-8">
              {tube.tracerColorHex ? <Swatch hex={tube.tracerColorHex} /> : <AppText size="xs" color="muted">—</AppText>}
            </div>
            <AppText size="sm" color="primary" className="flex-1">
              {tube.tracerColorName ? `${tube.colorName} / ${tube.tracerColorName}` : tube.colorName}
            </AppText>
            <AppText size="sm" color="secondary" className="w-14">{tube.fiberCount}f</AppText>
          </div>
          {index < tubes.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Ribbons ──────────────────────────────────────────────────────────────────

function RibbonTable({ ribbons }: { ribbons: Ribbon[] }) {
  return (
    <>
      <TableHeader columns={[
        { label: "Ribbon", className: "w-14" },
        { label: "Color",  className: "w-12" },
        { label: "Name",   className: "flex-1" },
        { label: "Abbr",   className: "w-12" },
      ]} />
      {ribbons.map((ribbon, index) => (
        <div key={ribbon.ribbonNumber}>
          <div className="flex flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-14">{ribbon.ribbonNumber}</AppText>
            <div className="w-12"><Swatch hex={ribbon.colorHex} /></div>
            <AppText size="sm" color="primary" className="flex-1">{ribbon.colorName}</AppText>
            <AppText size="sm" color="secondary" className="w-12">{ribbon.abbreviation}</AppText>
          </div>
          {index < ribbons.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Jacket Colors ────────────────────────────────────────────────────────────

function JacketColorTable({ jackets }: { jackets: JacketColor[] }) {
  return (
    <>
      {jackets.map((jacket, index) => (
        <div key={jacket.id}>
          <div className="py-3">
            <div className="flex flex-row items-center mb-1">
              <Swatch hex={jacket.jacketHex} size={16} />
              {jacket.altJacketHex && (
                <>
                  <AppText size="xs" color="muted" className="mx-1">or</AppText>
                  <Swatch hex={jacket.altJacketHex} size={16} />
                </>
              )}
              <AppText size="sm" color="primary" className="font-semibold ml-2 flex-1">{jacket.fiberType}</AppText>
              {jacket.isLegacy && (
                <span className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                  <AppText size="xs" color="accentAmber" className="font-semibold">LEGACY</AppText>
                </span>
              )}
            </div>
            <AppText size="xs" color="secondary" className="leading-4 mt-1 block">{jacket.notes}</AppText>
          </div>
          {index < jackets.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Connector Colors ─────────────────────────────────────────────────────────

function ConnectorColorTable({ connectors }: { connectors: ConnectorColor[] }) {
  return (
    <>
      {connectors.map((connector, index) => (
        <div key={connector.id}>
          <div className="py-3">
            <div className="flex flex-row items-center mb-1">
              <Swatch hex={connector.bodyHex} size={16} />
              <AppText size="sm" color="primary" className="font-semibold ml-2">{connector.polishType}</AppText>
              <AppText size="xs" color="secondary" className="ml-2">{connector.fiberCompatibility.join(", ")}</AppText>
            </div>
            <AppText size="xs" color="secondary" className="leading-4 block">Body: {connector.bodyColor}</AppText>
            {connector.polishType === "APC" && (
              <div className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
                <AppText size="xs" color="danger" className="font-semibold">
                  NEVER mix APC with UPC — physical damage to fiber ends will result.
                </AppText>
              </div>
            )}
            <AppText size="xs" color="secondary" className="leading-4 mt-1 block">{connector.notes}</AppText>
          </div>
          {index < connectors.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ColorCodesScreen() {
  const { activeConfig } = useCableConfig();

  return (
    <AppShell>
      <div style={{ paddingTop: 12, paddingBottom: 24 }}>
        <AppText size="xs" color="muted" className="text-center mb-4 block">{colorData.standard}</AppText>

        <ConfigSelector />

        <SectionCard title="Fiber Sequence" collapsible defaultOpen={false}>
          <FiberSequenceTable fibers={colorData.fiberSequence as FiberColor[]} />
        </SectionCard>

        <SectionCard title="Buffer Tubes" collapsible defaultOpen={false}>
          {activeConfig
            ? <CustomBufferTubeTable tubes={activeConfig.tubes} />
            : <StandardBufferTubeTable tubes={colorData.bufferTubes as BufferTube[]} />
          }
        </SectionCard>

        <SectionCard title="Ribbons" collapsible defaultOpen={false}>
          <RibbonTable ribbons={colorData.ribbons as Ribbon[]} />
        </SectionCard>

        <SectionCard title="Jacket Colors" collapsible defaultOpen={false}>
          <JacketColorTable jackets={colorData.jacketColors as JacketColor[]} />
        </SectionCard>

        <SectionCard title="Connector Colors" collapsible defaultOpen={false}>
          <ConnectorColorTable connectors={colorData.connectorColors as ConnectorColor[]} />
        </SectionCard>
      </div>
    </AppShell>
  );
}

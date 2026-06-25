import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { SectionCard, Divider } from "../components/ui";
import { useCableConfig } from "../context/CableConfigContext";
import type { TubeEntry, CableConfig } from "../types/cableConfig";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIA_COLORS = [
  { name: "Blue",   hex: "#0070C0" },
  { name: "Orange", hex: "#FF6600" },
  { name: "Green",  hex: "#00B050" },
  { name: "Brown",  hex: "#7B3F00" },
  { name: "Slate",  hex: "#708090" },
  { name: "White",  hex: "#FFFFFF" },
  { name: "Red",    hex: "#FF0000" },
  { name: "Black",  hex: "#000000" },
  { name: "Yellow", hex: "#FFD700" },
  { name: "Violet", hex: "#8B00FF" },
  { name: "Rose",   hex: "#FF66CC" },
  { name: "Aqua",   hex: "#00FFFF" },
];

const FIBER_COUNT_OPTIONS = [1, 2, 4, 6, 8, 10, 12, 24, 36, 48, 60, 72, 96, 144, 192, 288];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateTubes(totalFibers: number, defaultCount: number): TubeEntry[] {
  if (totalFibers <= 0 || defaultCount <= 0) return [];
  const tubes: TubeEntry[] = [];
  let remaining = totalFibers;
  let num = 1;
  while (remaining > 0 && num <= 200) {
    const fiberCount = Math.min(defaultCount, remaining);
    const color = TIA_COLORS[(num - 1) % TIA_COLORS.length];
    tubes.push({ tubeNumber: num, fiberCount, colorName: color.name, colorHex: color.hex });
    remaining -= fiberCount;
    num++;
  }
  return tubes;
}

// ─── Color Picker Modal ───────────────────────────────────────────────────────

type PickerTarget = "base" | "tracer";

function ColorPickerModal({
  visible,
  target,
  onSelect,
  onNone,
  onDismiss,
}: {
  visible: boolean;
  target: PickerTarget;
  onSelect: (name: string, hex: string) => void;
  onNone: () => void;
  onDismiss: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[#1A1A1A] rounded-t-[20px] p-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <AppText size="md" color="accentCyan" className="font-bold mb-5 text-center block">
          {target === "tracer" ? "Select Tracer Color" : "Select Tube Color"}
        </AppText>
        <div className="flex flex-row flex-wrap gap-4 justify-center">
          {TIA_COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color.name, color.hex)}
              className="flex flex-col items-center w-14"
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: color.hex,
                  border: `2px solid ${color.hex === "#FFFFFF" || color.hex === "#FFD700" ? "#666" : "#2A2A2A"}`,
                }}
              />
              <AppText size="xs" color="secondary" className="mt-1 text-center block">{color.name}</AppText>
            </button>
          ))}
          {target === "tracer" && (
            <button type="button" onClick={onNone} className="flex flex-col items-center w-14">
              <div
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: "#111", border: "2px solid #555",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <AppText size="md" color="muted">—</AppText>
              </div>
              <AppText size="xs" color="muted" className="mt-1 text-center block">None</AppText>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Count Picker Modal ───────────────────────────────────────────────────────

function CountPickerModal({
  visible,
  current,
  onSelect,
  onDismiss,
}: {
  visible: boolean;
  current: number;
  onSelect: (n: number) => void;
  onDismiss: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[#1A1A1A] rounded-t-[20px] p-5 pb-10 max-h-[400px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <AppText size="md" color="accentCyan" className="font-bold mb-3 text-center block">
          Fibers Per Tube
        </AppText>
        <div className="overflow-y-auto flex-1">
          {FIBER_COUNT_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full flex flex-row items-center justify-between px-4 py-3 rounded-lg border mb-1 ${
                item === current
                  ? "bg-[#00FFFF15] border-[#00FFFF]"
                  : "bg-transparent border-transparent"
              }`}
            >
              <AppText size="sm" color={item === current ? "accentCyan" : "primary"}>
                {item} fibers
              </AppText>
              {item === current && <AppText size="sm" color="accentCyan">✓</AppText>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tube Row ─────────────────────────────────────────────────────────────────

function TubeRow({
  tube,
  onColorPress,
  onTracerPress,
  onCountPress,
}: {
  tube: TubeEntry;
  onColorPress: () => void;
  onTracerPress: () => void;
  onCountPress: () => void;
}) {
  const needsBorder = tube.colorHex === "#FFFFFF" || tube.colorHex === "#FFD700";
  const needsTracerBorder = tube.tracerColorHex === "#FFFFFF";

  return (
    <div className="flex flex-row items-center py-2.5 gap-3">
      <AppText size="sm" color="secondary" className="w-7">{tube.tubeNumber}</AppText>

      <button type="button" onClick={onColorPress}>
        <div style={{
          width: 30, height: 30, borderRadius: 15,
          backgroundColor: tube.colorHex,
          border: `2px solid ${needsBorder ? "#666" : "#333"}`,
        }} />
      </button>

      <AppText size="sm" color="primary" className="flex-1">{tube.colorName}</AppText>

      <button type="button" onClick={onTracerPress}>
        {tube.tracerColorHex ? (
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            backgroundColor: tube.tracerColorHex,
            border: `2px solid ${needsTracerBorder ? "#666" : "#333"}`,
          }} />
        ) : (
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            backgroundColor: "#111", border: "1px solid #444",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AppText size="xs" color="muted">+</AppText>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={onCountPress}
        className="border border-[#333] bg-[#111] rounded-md px-2 py-1 min-w-[44px] flex items-center justify-center"
      >
        <AppText size="xs" color="secondary">{tube.fiberCount}f</AppText>
      </button>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CableConfigScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined; // null → undefined for downstream ternary

  const { configs, saveConfig, deleteConfig, setActiveConfig } = useCableConfig();
  const existing = id ? configs.find((c) => c.id === id) : undefined;

  const [name, setName]                       = useState(existing?.name ?? "");
  const [totalFibersText, setTotalFibersText] = useState(existing ? String(existing.totalFibers) : "");
  const [defaultCount, setDefaultCount]       = useState(12);
  const [tubes, setTubes]                     = useState<TubeEntry[]>(existing?.tubes ?? []);

  const [colorPickerVisible, setColorPickerVisible]     = useState(false);
  const [pickerTarget, setPickerTarget]                 = useState<PickerTarget>("base");
  const [pickerTubeIndex, setPickerTubeIndex]           = useState(0);
  const [countPickerVisible, setCountPickerVisible]     = useState(false);
  const [countPickerIndex, setCountPickerIndex]         = useState(0);
  const [defaultCountPickerVisible, setDefaultCountPickerVisible] = useState(false);

  const openColorPicker = (index: number, target: PickerTarget) => {
    setPickerTubeIndex(index);
    setPickerTarget(target);
    setColorPickerVisible(true);
  };

  const handleColorSelect = (colorName: string, hex: string) => {
    setTubes((prev) =>
      prev.map((t, i) => {
        if (i !== pickerTubeIndex) return t;
        if (pickerTarget === "base") return { ...t, colorName, colorHex: hex };
        return { ...t, tracerColorName: colorName, tracerColorHex: hex };
      })
    );
    setColorPickerVisible(false);
  };

  const handleTracerNone = () => {
    setTubes((prev) =>
      prev.map((t, i) =>
        i === pickerTubeIndex
          ? { ...t, tracerColorName: undefined, tracerColorHex: undefined }
          : t
      )
    );
    setColorPickerVisible(false);
  };

  const handleCountSelect = (n: number) => {
    setTubes((prev) => prev.map((t, i) => (i === countPickerIndex ? { ...t, fiberCount: n } : t)));
    setCountPickerVisible(false);
  };

  const handleGenerate = () => {
    const total = parseInt(totalFibersText, 10);
    if (isNaN(total) || total <= 0) {
      window.alert("Please enter a valid fiber count first.");
      return;
    }
    const doGenerate = () => setTubes(generateTubes(total, defaultCount));
    if (tubes.length > 0) {
      if (window.confirm("Replace Tubes?\nThis will replace your current tube list.")) doGenerate();
    } else {
      doGenerate();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      window.alert("Please enter a name for this config.");
      return;
    }
    const total = parseInt(totalFibersText, 10);
    const config: CableConfig = {
      id:          existing?.id ?? generateId(),
      name:        name.trim(),
      totalFibers: isNaN(total) ? 0 : total,
      tubes,
      createdAt:   existing?.createdAt ?? Date.now(),
    };
    await saveConfig(config);
    setActiveConfig(config.id);
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (window.confirm(`Delete "${existing.name}"?\nThis config will be permanently removed.`)) {
      await deleteConfig(existing.id);
      navigate(-1);
    }
  };

  const totalFromTubes = tubes.reduce((sum, t) => sum + t.fiberCount, 0);
  const totalFibers    = parseInt(totalFibersText, 10);
  const mismatch       = !isNaN(totalFibers) && totalFibers > 0 && totalFromTubes !== totalFibers;

  return (
    <AppShell showAd={false}>
      <div className="overflow-y-auto" style={{ paddingTop: 16, paddingBottom: 48 }}>
        {/* Config Details */}
        <SectionCard title="Config Details">
          <AppText size="xs" color="muted" className="mb-1.5 block">Name</AppText>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Job 47 – AT&T trunk"
            className="w-full text-white text-sm border border-[#333] rounded-lg px-3 py-2.5 bg-[#111] mb-4 outline-none"
          />
          <AppText size="xs" color="muted" className="mb-1.5 block">Total Fibers (from cable label)</AppText>
          <input
            type="text"
            inputMode="numeric"
            value={totalFibersText}
            onChange={(e) => setTotalFibersText(e.target.value)}
            placeholder="e.g. 144"
            className="w-full text-white text-sm border border-[#333] rounded-lg px-3 py-2.5 bg-[#111] outline-none"
          />
        </SectionCard>

        {/* Quick Generate */}
        <SectionCard title="Quick Generate">
          <AppText size="xs" color="secondary" className="mb-3.5 leading-[18px] block">
            Generates the full tube list using a default fiber count. You can override individual tubes after generating.
          </AppText>
          <AppText size="xs" color="muted" className="mb-2 block">Default fibers per tube</AppText>
          <button
            type="button"
            onClick={() => setDefaultCountPickerVisible(true)}
            className="w-full border border-[#333] rounded-lg px-3 py-2.5 bg-[#111] mb-3.5 flex flex-row items-center justify-between"
          >
            <AppText size="sm" color="primary">{defaultCount} fibers</AppText>
            <AppText size="xs" color="muted">▼</AppText>
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full bg-[#00FFFF15] border border-[#00FFFF] rounded-[10px] py-3 flex items-center justify-center"
          >
            <AppText size="sm" color="accentCyan" className="font-bold">Generate Tubes</AppText>
          </button>
        </SectionCard>

        {/* Tube List */}
        {tubes.length > 0 && (
          <SectionCard title={`Tubes  ·  ${tubes.length} tubes  ·  ${totalFromTubes}f total`}>
            {mismatch && (
              <div className="mb-2.5 bg-[#FF444420] border border-[#FF4444] rounded-md p-2">
                <AppText size="xs" color="danger">
                  Tube total ({totalFromTubes}f) doesn't match cable label ({totalFibers}f).
                  Adjust individual tubes or re-generate.
                </AppText>
              </div>
            )}
            <div className="flex flex-row items-center pb-1.5 border-b border-[#333] gap-3 mb-0.5">
              <AppText size="xs" color="muted" className="w-7">#</AppText>
              <AppText size="xs" color="muted" className="w-[30px]"></AppText>
              <AppText size="xs" color="muted" className="flex-1">Color</AppText>
              <AppText size="xs" color="muted" className="w-6 text-center">Trcr</AppText>
              <AppText size="xs" color="muted" className="w-11 text-center">Count</AppText>
            </div>
            {tubes.map((tube, index) => (
              <div key={tube.tubeNumber}>
                <TubeRow
                  tube={tube}
                  onColorPress={() => openColorPicker(index, "base")}
                  onTracerPress={() => openColorPicker(index, "tracer")}
                  onCountPress={() => { setCountPickerIndex(index); setCountPickerVisible(true); }}
                />
                {index < tubes.length - 1 && <Divider />}
              </div>
            ))}
          </SectionCard>
        )}

        {/* Action Buttons */}
        <div className="px-4 flex flex-col gap-2.5 mt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-[#00FFFF15] border border-[#00FFFF] rounded-xl py-3.5 flex items-center justify-center"
          >
            <AppText size="md" color="accentCyan" className="font-bold">Save Config</AppText>
          </button>

          {existing && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-[#FF444415] border border-[#FF4444] rounded-xl py-3.5 flex items-center justify-center"
            >
              <AppText size="md" color="danger" className="font-bold">Delete Config</AppText>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3.5 flex items-center justify-center"
          >
            <AppText size="sm" color="muted">Cancel</AppText>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ColorPickerModal
        visible={colorPickerVisible}
        target={pickerTarget}
        onSelect={handleColorSelect}
        onNone={handleTracerNone}
        onDismiss={() => setColorPickerVisible(false)}
      />
      <CountPickerModal
        visible={countPickerVisible}
        current={tubes[countPickerIndex]?.fiberCount ?? 12}
        onSelect={handleCountSelect}
        onDismiss={() => setCountPickerVisible(false)}
      />
      <CountPickerModal
        visible={defaultCountPickerVisible}
        current={defaultCount}
        onSelect={(n) => { setDefaultCount(n); setDefaultCountPickerVisible(false); }}
        onDismiss={() => setDefaultCountPickerVisible(false)}
      />
    </AppShell>
  );
}

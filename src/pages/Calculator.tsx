import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";

// ─── Constants ────────────────────────────────────────────────────────────────

interface FiberPreset {
  label: string;
  lossDbPerKm: number;
}

const FIBER_PRESETS: FiberPreset[] = [
  { label: "SMF 1310 nm", lossDbPerKm: 0.35 },
  { label: "SMF 1550 nm", lossDbPerKm: 0.20 },
  { label: "SMF 1625 nm", lossDbPerKm: 0.23 },
  { label: "SMF 1650 nm", lossDbPerKm: 0.25 },
  { label: "MMF 850 nm",  lossDbPerKm: 3.50 },
  { label: "MMF 1300 nm", lossDbPerKm: 1.50 },
];

const DEFAULT_CONNECTOR_LOSS = "0.5";
const DEFAULT_SPLICE_LOSS    = "0.1";
const DEFAULT_SYSTEM_MARGIN  = "3.0";

function parseDb(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-2 block">
      {title}
    </AppText>
  );
}

function DbInput({
  label,
  value,
  onChangeText,
  unit = "dBm",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
}) {
  return (
    <div className="flex flex-row items-center mb-2">
      <AppText size="xs" color="secondary" className="flex-1">{label}</AppText>
      <div className="flex flex-row items-center bg-[#111111] border border-[#2A2A2A] rounded-lg px-2 py-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="bg-transparent text-white text-xs w-16 text-right outline-none"
        />
        <AppText size="xs" color="muted" className="ml-1.5">{unit}</AppText>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex flex-row items-center mb-2">
      <AppText size="xs" color="secondary" className="flex-1">{label}</AppText>
      <div className="flex flex-row items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <AppText size="md" color="accentCyan" className="font-bold">−</AppText>
        </button>
        <AppText size="sm" color="primary" className="font-semibold w-8 text-center">{value}</AppText>
        <button
          type="button"
          onClick={onIncrement}
          className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <AppText size="md" color="accentCyan" className="font-bold">+</AppText>
        </button>
      </div>
    </div>
  );
}

function FiberPresetSelector({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-row flex-wrap mb-3">
      {FIBER_PRESETS.map((preset, i) => {
        const isSelected = i === selectedIndex;
        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(i)}
            className={`border rounded-lg px-2 py-1.5 mr-2 mb-2 text-left ${
              isSelected
                ? "border-[#00FFFF] bg-[#00FFFF15]"
                : "border-[#2A2A2A] bg-[#111111]"
            }`}
          >
            <AppText size="xs" color={isSelected ? "accentCyan" : "muted"} className="font-semibold block">
              {preset.label}
            </AppText>
            <AppText size="xs" color="muted" className="block">
              {preset.lossDbPerKm} dB/km
            </AppText>
          </button>
        );
      })}
    </div>
  );
}

function ResultRow({
  label,
  value,
  unit = "dB",
  dimmed = false,
}: {
  label: string;
  value: number;
  unit?: string;
  dimmed?: boolean;
}) {
  return (
    <div className="flex flex-row items-center py-1.5">
      <AppText size="xs" color={dimmed ? "muted" : "secondary"} className="flex-1">
        {label}
      </AppText>
      <AppText size="xs" color={dimmed ? "muted" : "primary"} className="font-semibold">
        {value.toFixed(2)} {unit}
      </AppText>
    </div>
  );
}

function MarginResult({ margin }: { margin: number }) {
  const pass = margin >= 0;
  return (
    <div className={`border rounded-xl p-3 mt-2 ${pass ? "border-[#00FF8855] bg-[#00FF8810]" : "border-[#FF444455] bg-[#FF444410]"}`}>
      <div className="flex flex-row items-center">
        <AppText size="sm" color={pass ? "success" : "danger"} className="font-bold flex-1">
          {pass ? "PASS" : "FAIL"} — Link Margin
        </AppText>
        <AppText size="lg" color={pass ? "success" : "danger"} className="font-bold">
          {margin >= 0 ? "+" : ""}{margin.toFixed(2)} dB
        </AppText>
      </div>
      {!pass && (
        <AppText size="xs" color="danger" className="mt-1 leading-4 block">
          Link loss exceeds power budget. Reduce distance, reduce component count,
          or select a higher-power transceiver.
        </AppText>
      )}
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CalculatorScreen() {
  const [txPower, setTxPower]               = useState("-3");
  const [rxSensitivity, setRxSensitivity]   = useState("-14");
  const [fiberPresetIndex, setFiberPresetIndex] = useState(0);
  const [distanceKm, setDistanceKm]         = useState("1.0");
  const [numConnectors, setNumConnectors]   = useState(2);
  const [connectorLoss, setConnectorLoss]   = useState(DEFAULT_CONNECTOR_LOSS);
  const [numSplices, setNumSplices]         = useState(0);
  const [spliceLoss, setSpliceLoss]         = useState(DEFAULT_SPLICE_LOSS);
  const [additionalLoss, setAdditionalLoss] = useState("0");
  const [systemMargin, setSystemMargin]     = useState(DEFAULT_SYSTEM_MARGIN);

  const txDb        = parseDb(txPower);
  const rxDb        = parseDb(rxSensitivity);
  const powerBudget = txDb - rxDb;

  const fiberLoss   = FIBER_PRESETS[fiberPresetIndex].lossDbPerKm * parseDb(distanceKm);
  const connLoss    = numConnectors * parseDb(connectorLoss);
  const splcLoss    = numSplices * parseDb(spliceLoss);
  const addLoss     = parseDb(additionalLoss);
  const totalLoss   = fiberLoss + connLoss + splcLoss + addLoss;

  const requiredMargin = parseDb(systemMargin);
  const linkMargin     = powerBudget - totalLoss - requiredMargin;

  return (
    <AppShell showAd={false}>
      <div className="overflow-y-auto" style={{ paddingTop: 12, paddingBottom: 32 }}>
        {/* Transceiver */}
        <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
          <SectionLabel title="Transceiver" />
          <DbInput label="TX power"      value={txPower}       onChangeText={setTxPower} />
          <DbInput label="RX sensitivity" value={rxSensitivity} onChangeText={setRxSensitivity} />
          <div className="flex flex-row items-center mt-1">
            <AppText size="xs" color="muted" className="flex-1">Power budget</AppText>
            <AppText size="xs" color="accentCyan" className="font-semibold">
              {powerBudget.toFixed(2)} dB
            </AppText>
          </div>
        </div>

        {/* Fiber */}
        <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
          <SectionLabel title="Fiber" />
          <FiberPresetSelector selectedIndex={fiberPresetIndex} onSelect={setFiberPresetIndex} />
          <DbInput label="Distance" value={distanceKm} onChangeText={setDistanceKm} unit="km" />
        </div>

        {/* Components */}
        <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
          <SectionLabel title="Components" />
          <Stepper
            label="Connectors"
            value={numConnectors}
            onDecrement={() => setNumConnectors((n) => Math.max(0, n - 1))}
            onIncrement={() => setNumConnectors((n) => n + 1)}
          />
          <DbInput label="Loss per connector" value={connectorLoss} onChangeText={setConnectorLoss} unit="dB" />
          <div className="h-3" />
          <Stepper
            label="Fusion splices"
            value={numSplices}
            onDecrement={() => setNumSplices((n) => Math.max(0, n - 1))}
            onIncrement={() => setNumSplices((n) => n + 1)}
          />
          <DbInput label="Loss per splice"  value={spliceLoss}     onChangeText={setSpliceLoss}     unit="dB" />
          <div className="h-3" />
          <DbInput label="Additional loss"  value={additionalLoss} onChangeText={setAdditionalLoss} unit="dB" />
        </div>

        {/* System Margin */}
        <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
          <SectionLabel title="Safety Margin" />
          <DbInput label="Required system margin" value={systemMargin} onChangeText={setSystemMargin} unit="dB" />
          <AppText size="xs" color="muted" className="leading-4 mt-1 block">
            Typically 3 dB. Accounts for aging, repair splices, and measurement uncertainty.
          </AppText>
        </div>

        {/* Results */}
        <div className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
          <SectionLabel title="Loss Breakdown" />
          <ResultRow label="Fiber loss"      value={fiberLoss} />
          <ResultRow label="Connector loss"  value={connLoss} />
          <ResultRow label="Splice loss"     value={splcLoss} />
          {addLoss !== 0 && <ResultRow label="Additional loss" value={addLoss} />}
          <div className="h-[1px] bg-[#242424] my-2" />
          <ResultRow label="Total link loss"  value={totalLoss} />
          <ResultRow label="Power budget"     value={powerBudget}    unit="dBm diff" dimmed />
          <ResultRow label="Required margin"  value={requiredMargin} dimmed />
          <MarginResult margin={linkMargin} />
        </div>
      </div>
    </AppShell>
  );
}

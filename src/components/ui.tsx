import { useState } from "react";
import AppText from "./AppText";
import type { Formula, NerdStuff } from "../types/shared";

// ─── Layout ───────────────────────────────────────────────────────────────────

export function SectionCard({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <div className="px-4 py-3 border-b border-[#2A2A2A] flex flex-row items-center">
      <AppText size="md" color="accentCyan" className="font-bold flex-1">{title}</AppText>
      {collapsible && (
        <AppText size="xs" color="muted">{open ? "▲" : "▼"}</AppText>
      )}
    </div>
  );

  return (
    <div className="mx-3 mb-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {collapsible ? (
        <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left">
          {header}
        </button>
      ) : (
        header
      )}
      {(!collapsible || open) && (
        <div className="px-4 py-2">{children}</div>
      )}
    </div>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mx-3 mb-2 mt-2">
      <AppText size="xs" color="accentCyan" className="font-bold tracking-widest uppercase">
        {title}
      </AppText>
      <div className="h-[1px] bg-[#2A2A2A] mt-1" />
    </div>
  );
}

export function Divider() {
  return <div className="h-[1px] bg-[#242424]" />;
}

// ─── Table primitives ─────────────────────────────────────────────────────────

type ColDef = { label: string; className: string };

export function TableHeader({ columns }: { columns: ColDef[] }) {
  return (
    <div className="flex flex-row gap-3 py-2 border-b border-[#333333]">
      {columns.map((col, i) => (
        <AppText key={i} size="xs" color="muted" className={`font-semibold ${col.className}`}>
          {col.label}
        </AppText>
      ))}
    </div>
  );
}

export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row py-1.5 border-b border-[#242424]">
      <AppText size="xs" color="muted" className="w-36">{label}</AppText>
      <AppText size="xs" color="primary" className="flex-1">{value}</AppText>
    </div>
  );
}

// ─── Nerd Stuff ───────────────────────────────────────────────────────────────

export function FormulaBlock({ formula }: { formula: Formula }) {
  return (
    <div className="mb-3 bg-[#111111] rounded-lg p-3 border border-[#2A2A2A]">
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1 block">{formula.name}</AppText>
      <AppText size="xs" color="primary" className="font-mono mb-2 block">{formula.expression}</AppText>
      {formula.variables.map((v) => (
        <AppText key={v.symbol} size="xs" color="secondary" className="block">
          {v.symbol} — {v.meaning}
        </AppText>
      ))}
      {formula.example && (
        <AppText size="xs" color="secondary" className="mt-2 italic block">{formula.example}</AppText>
      )}
    </div>
  );
}

export function NerdStuffSection({ nerd }: { nerd: NerdStuff }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 border-t border-[#2A2A2A] pt-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex flex-row items-center py-1 w-full"
      >
        <AppText size="xs" color="muted" className="mr-1">⚙</AppText>
        <AppText size="xs" color="muted" className="font-semibold">Nerd Stuff</AppText>
        <AppText size="xs" color="muted" className="ml-auto">{expanded ? "▲" : "▼"}</AppText>
      </button>

      {expanded && (
        <div className="mt-2">
          <AppText size="xs" color="secondary" className="font-semibold mb-2 block">{nerd.title}</AppText>
          {nerd.formulas?.map((f) => (
            <FormulaBlock key={f.name} formula={f} />
          ))}
          <AppText size="xs" color="secondary" className="leading-5 block">{nerd.explanation}</AppText>
        </div>
      )}
    </div>
  );
}

// ─── Warning / Info boxes ─────────────────────────────────────────────────────

export function WarningBox({ text }: { text: string }) {
  return (
    <div className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
      <AppText size="xs" color="danger" className="font-semibold">{text}</AppText>
    </div>
  );
}

export function InfoBox({ text }: { text: string }) {
  return (
    <div className="mt-2 bg-[#FFB30015] border border-[#FFB300] rounded px-2 py-1.5">
      <AppText size="xs" color="accentAmber">{text}</AppText>
    </div>
  );
}

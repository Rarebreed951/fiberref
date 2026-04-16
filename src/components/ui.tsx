import { useState } from "react";
import { View, Pressable } from "react-native";
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
    <View className="px-4 py-3 border-b border-[#2A2A2A] flex-row items-center">
      <AppText size="md" color="accentCyan" className="font-bold flex-1">{title}</AppText>
      {collapsible && (
        <AppText size="xs" color="muted">{open ? "▲" : "▼"}</AppText>
      )}
    </View>
  );

  return (
    <View className="mx-3 mb-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      {collapsible ? (
        <Pressable onPress={() => setOpen((v) => !v)}>{header}</Pressable>
      ) : (
        header
      )}
      {(!collapsible || open) && (
        <View className="px-4 py-2">{children}</View>
      )}
    </View>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mx-3 mb-2 mt-2">
      <AppText size="xs" color="accentCyan" className="font-bold tracking-widest uppercase">
        {title}
      </AppText>
      <View className="h-[1px] bg-[#2A2A2A] mt-1" />
    </View>
  );
}

export function Divider() {
  return <View className="h-[1px] bg-[#242424]" />;
}

// ─── Table primitives ─────────────────────────────────────────────────────────

type ColDef = { label: string; className: string };

export function TableHeader({ columns }: { columns: ColDef[] }) {
  return (
    <View className="flex-row gap-3 py-2 border-b border-[#333333]">
      {columns.map((col, i) => (
        <AppText key={i} size="xs" color="muted" className={`font-semibold ${col.className}`} numberOfLines={1}>
          {col.label}
        </AppText>
      ))}
    </View>
  );
}

export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row py-1.5 border-b border-[#242424]">
      <AppText size="xs" color="muted" className="w-36">{label}</AppText>
      <AppText size="xs" color="primary" className="flex-1">{value}</AppText>
    </View>
  );
}

// ─── Nerd Stuff ───────────────────────────────────────────────────────────────

export function FormulaBlock({ formula }: { formula: Formula }) {
  return (
    <View className="mb-3 bg-[#111111] rounded-lg p-3 border border-[#2A2A2A]">
      <AppText size="xs" color="accentAmber" className="font-semibold mb-1">{formula.name}</AppText>
      <AppText size="xs" color="primary" className="font-mono mb-2">{formula.expression}</AppText>
      {formula.variables.map((v) => (
        <AppText key={v.symbol} size="xs" color="secondary">
          {v.symbol} — {v.meaning}
        </AppText>
      ))}
      {formula.example && (
        <AppText size="xs" color="secondary" className="mt-2 italic">{formula.example}</AppText>
      )}
    </View>
  );
}

export function NerdStuffSection({ nerd }: { nerd: NerdStuff }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mt-3 border-t border-[#2A2A2A] pt-2">
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="flex-row items-center py-1"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <AppText size="xs" color="muted" className="mr-1">⚙</AppText>
        <AppText size="xs" color="muted" className="font-semibold">Nerd Stuff</AppText>
        <AppText size="xs" color="muted" className="ml-auto">{expanded ? "▲" : "▼"}</AppText>
      </Pressable>

      {expanded && (
        <View className="mt-2">
          <AppText size="xs" color="secondary" className="font-semibold mb-2">{nerd.title}</AppText>
          {nerd.formulas?.map((f) => (
            <FormulaBlock key={f.name} formula={f} />
          ))}
          <AppText size="xs" color="secondary" className="leading-5">{nerd.explanation}</AppText>
        </View>
      )}
    </View>
  );
}

// ─── Warning / Info boxes ─────────────────────────────────────────────────────

export function WarningBox({ text }: { text: string }) {
  return (
    <View className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
      <AppText size="xs" color="danger" className="font-semibold">{text}</AppText>
    </View>
  );
}

export function InfoBox({ text }: { text: string }) {
  return (
    <View className="mt-2 bg-[#FFB30015] border border-[#FFB300] rounded px-2 py-1.5">
      <AppText size="xs" color="accentAmber">{text}</AppText>
    </View>
  );
}

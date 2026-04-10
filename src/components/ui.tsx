import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Formula, NerdStuff } from "../types/shared";

// ─── Layout ───────────────────────────────────────────────────────────────────

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mx-3 mb-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <View className="px-4 py-3 border-b border-[#2A2A2A]">
        <Text className="text-[#00FFFF] text-base font-bold">{title}</Text>
      </View>
      <View className="px-4 py-2">{children}</View>
    </View>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mx-3 mb-2 mt-2">
      <Text className="text-[#00FFFF] text-xs font-bold tracking-widest uppercase">
        {title}
      </Text>
      <View className="h-[1px] bg-[#2A2A2A] mt-1" />
    </View>
  );
}

export function Divider() {
  return <View className="h-[1px] bg-[#242424]" />;
}

// ─── Table primitives ─────────────────────────────────────────────────────────

export function TableHeader({ columns }: { columns: string[] }) {
  return (
    <View className="flex-row py-2 border-b border-[#333333]">
      {columns.map((col) => (
        <Text key={col} className="text-[#555555] text-xs font-semibold flex-1">
          {col}
        </Text>
      ))}
    </View>
  );
}

export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row py-1.5 border-b border-[#242424]">
      <Text className="text-[#555555] text-xs w-36">{label}</Text>
      <Text className="text-white text-xs flex-1">{value}</Text>
    </View>
  );
}

// ─── Nerd Stuff ───────────────────────────────────────────────────────────────

export function FormulaBlock({ formula }: { formula: Formula }) {
  return (
    <View className="mb-3 bg-[#111111] rounded-lg p-3 border border-[#2A2A2A]">
      <Text className="text-[#FFB300] text-xs font-semibold mb-1">{formula.name}</Text>
      <Text className="text-white text-xs font-mono mb-2">{formula.expression}</Text>
      {formula.variables.map((v) => (
        <Text key={v.symbol} className="text-[#A0A0A0] text-xs">
          {v.symbol} — {v.meaning}
        </Text>
      ))}
      {formula.example && (
        <Text className="text-[#A0A0A0] text-xs mt-2 italic">{formula.example}</Text>
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
        <Text className="text-[#555555] text-xs mr-1">⚙</Text>
        <Text className="text-[#555555] text-xs font-semibold">Nerd Stuff</Text>
        <Text className="text-[#555555] text-xs ml-auto">{expanded ? "▲" : "▼"}</Text>
      </Pressable>

      {expanded && (
        <View className="mt-2">
          <Text className="text-[#A0A0A0] text-xs font-semibold mb-2">{nerd.title}</Text>
          {nerd.formulas?.map((f) => (
            <FormulaBlock key={f.name} formula={f} />
          ))}
          <Text className="text-[#A0A0A0] text-xs leading-5">{nerd.explanation}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Warning / Info boxes ─────────────────────────────────────────────────────

export function WarningBox({ text }: { text: string }) {
  return (
    <View className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
      <Text className="text-[#FF4444] text-xs font-semibold">{text}</Text>
    </View>
  );
}

export function InfoBox({ text }: { text: string }) {
  return (
    <View className="mt-2 bg-[#FFB30015] border border-[#FFB300] rounded px-2 py-1.5">
      <Text className="text-[#FFB300] text-xs">{text}</Text>
    </View>
  );
}

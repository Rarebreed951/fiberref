import { ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import { SectionCard, TableHeader, Divider } from "../src/components/ui";
import colorData from "../src/data/colorCodes/colorCodes.json";
import type {
  FiberColor,
  BufferTube,
  Ribbon,
  JacketColor,
  ConnectorColor,
} from "../src/data/colorCodes/types";

// ─── Primitives ──────────────────────────────────────────────────────────────

function Swatch({ hex, size = 18 }: { hex: string; size?: number }) {
  const borderColor = hex === "#FFFFFF" || hex === "#FFD700" ? "#444444" : "transparent";
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: hex,
        borderRadius: 3,
        borderWidth: 1,
        borderColor,
      }}
    />
  );
}

// ─── Fiber Sequence ───────────────────────────────────────────────────────────

function FiberSequenceTable({ fibers }: { fibers: FiberColor[] }) {
  return (
    <>
      <TableHeader columns={["#", "Color", "Name", "Abbr"]} />
      {fibers.map((fiber, index) => (
        <View key={fiber.position}>
          <View className="flex-row items-center py-2">
            <Text className="text-[#A0A0A0] text-sm w-6">{fiber.position}</Text>
            <View className="w-8">
              <Swatch hex={fiber.colorHex} />
            </View>
            <Text className="text-white text-sm flex-1">{fiber.colorName}</Text>
            <Text className="text-[#A0A0A0] text-sm w-8">{fiber.abbreviation}</Text>
          </View>
          {index < fibers.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Buffer Tubes ─────────────────────────────────────────────────────────────

const TRACER_GROUPS = [
  { label: "No tracer (tubes 1–12)", start: 1, end: 12 },
  { label: "Black tracer (tubes 13–24)", start: 13, end: 24 },
  { label: "Orange tracer (tubes 25–36)", start: 25, end: 36 },
  { label: "Green tracer (tubes 37–48)", start: 37, end: 48 },
];

function BufferTubeTable({ tubes }: { tubes: BufferTube[] }) {
  return (
    <>
      {TRACER_GROUPS.map((group, groupIndex) => {
        const groupTubes = tubes.filter(
          (t) => t.tubeNumber >= group.start && t.tubeNumber <= group.end
        );
        return (
          <View key={group.label}>
            {groupIndex > 0 && <View className="h-3" />}
            <Text className="text-[#FFB300] text-xs font-semibold mb-1">
              {group.label}
            </Text>
            <TableHeader columns={["#", "Base", "Tracer", "Name"]} />
            {groupTubes.map((tube, index) => (
              <View key={tube.tubeNumber}>
                <View className="flex-row items-center py-2">
                  <Text className="text-[#A0A0A0] text-sm w-8">{tube.tubeNumber}</Text>
                  <View className="w-8">
                    <Swatch hex={tube.colorHex} />
                  </View>
                  <View className="w-8">
                    {tube.tracerHex ? (
                      <Swatch hex={tube.tracerHex} />
                    ) : (
                      <Text className="text-[#444444] text-xs">—</Text>
                    )}
                  </View>
                  <Text className="text-white text-sm flex-1">{tube.colorName}</Text>
                </View>
                {index < groupTubes.length - 1 && <Divider />}
              </View>
            ))}
          </View>
        );
      })}
    </>
  );
}

// ─── Ribbons ──────────────────────────────────────────────────────────────────

function RibbonTable({ ribbons }: { ribbons: Ribbon[] }) {
  return (
    <>
      <TableHeader columns={["Ribbon", "Color", "Name", "Abbr"]} />
      {ribbons.map((ribbon, index) => (
        <View key={ribbon.ribbonNumber}>
          <View className="flex-row items-center py-2">
            <Text className="text-[#A0A0A0] text-sm w-12">{ribbon.ribbonNumber}</Text>
            <View className="w-8">
              <Swatch hex={ribbon.colorHex} />
            </View>
            <Text className="text-white text-sm flex-1">{ribbon.colorName}</Text>
            <Text className="text-[#A0A0A0] text-sm w-8">{ribbon.abbreviation}</Text>
          </View>
          {index < ribbons.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Jacket Colors ────────────────────────────────────────────────────────────

function JacketColorTable({ jackets }: { jackets: JacketColor[] }) {
  return (
    <>
      {jackets.map((jacket, index) => (
        <View key={jacket.id}>
          <View className="py-3">
            <View className="flex-row items-center mb-1">
              <Swatch hex={jacket.jacketHex} size={16} />
              {jacket.altJacketHex && (
                <>
                  <Text className="text-[#555555] text-xs mx-1">or</Text>
                  <Swatch hex={jacket.altJacketHex} size={16} />
                </>
              )}
              <Text className="text-white text-sm font-semibold ml-2 flex-1">
                {jacket.fiberType}
              </Text>
              {jacket.isLegacy && (
                <View className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                  <Text className="text-[#FFB300] text-[10px] font-semibold">LEGACY</Text>
                </View>
              )}
            </View>
            <Text className="text-[#A0A0A0] text-xs leading-4 mt-1">{jacket.notes}</Text>
          </View>
          {index < jackets.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Connector Colors ─────────────────────────────────────────────────────────

function ConnectorColorTable({ connectors }: { connectors: ConnectorColor[] }) {
  return (
    <>
      {connectors.map((connector, index) => (
        <View key={connector.id}>
          <View className="py-3">
            <View className="flex-row items-center mb-1">
              <Swatch hex={connector.bodyHex} size={16} />
              <Text className="text-white text-sm font-semibold ml-2">
                {connector.polishType}
              </Text>
              <Text className="text-[#A0A0A0] text-xs ml-2">
                {connector.fiberCompatibility.join(", ")}
              </Text>
            </View>
            <Text className="text-[#A0A0A0] text-xs leading-4">
              Body: {connector.bodyColor}
            </Text>
            {connector.polishType === "APC" && (
              <View className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
                <Text className="text-[#FF4444] text-xs font-semibold">
                  NEVER mix APC with UPC — physical damage to fiber ends will result.
                </Text>
              </View>
            )}
            <Text className="text-[#A0A0A0] text-xs leading-4 mt-1">
              {connector.notes}
            </Text>
          </View>
          {index < connectors.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ColorCodesScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "Color Codes" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <Text className="text-[#444444] text-xs text-center mb-4">
          {colorData.standard}
        </Text>

        <SectionCard title="Fiber Sequence">
          <FiberSequenceTable fibers={colorData.fiberSequence as FiberColor[]} />
        </SectionCard>

        <SectionCard title="Buffer Tubes">
          <BufferTubeTable tubes={colorData.bufferTubes as BufferTube[]} />
        </SectionCard>

        <SectionCard title="Ribbons">
          <RibbonTable ribbons={colorData.ribbons as Ribbon[]} />
        </SectionCard>

        <SectionCard title="Jacket Colors">
          <JacketColorTable jackets={colorData.jacketColors as JacketColor[]} />
        </SectionCard>

        <SectionCard title="Connector Colors">
          <ConnectorColorTable
            connectors={colorData.connectorColors as ConnectorColor[]}
          />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

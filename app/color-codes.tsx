import { ScrollView, View, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
import { SectionCard, TableHeader, Divider } from "../src/components/ui";
import colorData from "../src/data/colorCodes/colorCodes.json";
import type {
  FiberColor,
  BufferTube,
  Ribbon,
  JacketColor,
  ConnectorColor,
} from "../src/data/colorCodes/types";
import { useCableConfig } from "../src/context/CableConfigContext";
import type { TubeEntry } from "../src/types/cableConfig";

// ─── Primitives ──────────────────────────────────────────────────────────────

function Swatch({ hex, size = 18 }: { hex: string; size?: number }) {
  const borderColor =
    hex === "#FFFFFF" || hex === "#FFD700" ? "#444444" : "transparent";
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

// ─── Config Selector ─────────────────────────────────────────────────────────

function ConfigSelector() {
  const { configs, activeConfigId, activeConfig, setActiveConfig, canAddMore } =
    useCableConfig();

  return (
    <View style={{ marginHorizontal: 12, marginBottom: 12 }}>
      {/* Active config bar */}
      <View
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#2A2A2A",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText size="xs" color="muted" style={{ marginBottom: 2 }}>
            Active Config
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {!activeConfigId && (
              <AppText size="xs" color="muted">🔒</AppText>
            )}
            <AppText size="sm" color="primary" style={{ fontWeight: "600" }}>
              {activeConfig?.name ?? "Standard (TIA-598)"}
            </AppText>
          </View>
        </View>

        {activeConfigId && (
          <Pressable
            onPress={() => router.push(`/cable-config?id=${activeConfigId}`)}
            style={{
              borderWidth: 1,
              borderColor: "#333",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginRight: 8,
            }}
          >
            <AppText size="xs" color="secondary">Edit</AppText>
          </Pressable>
        )}

        {canAddMore && (
          <Pressable
            onPress={() => router.push("/cable-config")}
            style={{
              borderWidth: 1,
              borderColor: "#00FFFF66",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <AppText size="xs" color="accentCyan">+ New</AppText>
          </Pressable>
        )}
      </View>

      {/* Switcher pills — only shown when custom configs exist */}
      {configs.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
        >
          <Pressable
            onPress={() => setActiveConfig(null)}
            style={{
              borderWidth: 1,
              borderColor: !activeConfigId ? "#00FFFF" : "#333",
              backgroundColor: !activeConfigId ? "#00FFFF15" : "#111",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <AppText size="xs" color={!activeConfigId ? "accentCyan" : "secondary"}>
              Standard
            </AppText>
          </Pressable>

          {configs.map((cfg) => (
            <Pressable
              key={cfg.id}
              onPress={() => setActiveConfig(cfg.id)}
              style={{
                borderWidth: 1,
                borderColor: activeConfigId === cfg.id ? "#00FFFF" : "#333",
                backgroundColor: activeConfigId === cfg.id ? "#00FFFF15" : "#111",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <AppText
                size="xs"
                color={activeConfigId === cfg.id ? "accentCyan" : "secondary"}
              >
                {cfg.name}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
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
        <View key={fiber.position}>
          <View className="flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-8">{fiber.position}</AppText>
            <View className="w-8">
              <Swatch hex={fiber.colorHex} />
            </View>
            <AppText size="sm" color="primary" className="flex-1">{fiber.colorName}</AppText>
            <AppText size="sm" color="secondary" className="w-12">{fiber.abbreviation}</AppText>
          </View>
          {index < fibers.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Buffer Tubes (standard — grouped by tracer) ──────────────────────────────

const TRACER_GROUPS = [
  { label: "No tracer (tubes 1–12)",    start: 1,  end: 12 },
  { label: "Black tracer (tubes 13–24)", start: 13, end: 24 },
  { label: "Orange tracer (tubes 25–36)", start: 25, end: 36 },
  { label: "Green tracer (tubes 37–48)", start: 37, end: 48 },
];

function StandardBufferTubeTable({ tubes }: { tubes: BufferTube[] }) {
  return (
    <>
      {TRACER_GROUPS.map((group, groupIndex) => {
        const groupTubes = tubes.filter(
          (t) => t.tubeNumber >= group.start && t.tubeNumber <= group.end
        );
        if (groupTubes.length === 0) return null;
        return (
          <View key={group.label}>
            {groupIndex > 0 && <View className="h-3" />}
            <AppText size="xs" color="accentAmber" className="font-semibold mb-1">
              {group.label}
            </AppText>
            <TableHeader columns={[
              { label: "#",      className: "w-8" },
              { label: "",       className: "w-8" },
              { label: "Tracer", className: "w-14" },
              { label: "Name",   className: "flex-1" },
            ]} />
            {groupTubes.map((tube, index) => (
              <View key={tube.tubeNumber}>
                <View className="flex-row gap-3 items-center py-2">
                  <AppText size="sm" color="secondary" className="w-8">{tube.tubeNumber}</AppText>
                  <View className="w-8">
                    <Swatch hex={tube.colorHex} />
                  </View>
                  <View className="w-14">
                    {tube.tracerHex ? (
                      <Swatch hex={tube.tracerHex} />
                    ) : (
                      <AppText size="xs" color="muted">—</AppText>
                    )}
                  </View>
                  <AppText size="sm" color="primary" className="flex-1">
                    {tube.tracerColor
                      ? `${tube.colorName} / ${tube.tracerColor}`
                      : tube.colorName}
                  </AppText>
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

// ─── Buffer Tubes (custom config — flat list) ─────────────────────────────────

function CustomBufferTubeTable({ tubes }: { tubes: TubeEntry[] }) {
  return (
    <>
      <TableHeader columns={[
        { label: "#",     className: "w-8" },
        { label: "",      className: "w-8" },
        { label: "Trcr",  className: "w-8" },
        { label: "Name",  className: "flex-1" },
        { label: "Fibers", className: "w-14" },
      ]} />
      {tubes.map((tube, index) => (
        <View key={tube.tubeNumber}>
          <View className="flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-8">{tube.tubeNumber}</AppText>
            <View className="w-8">
              <Swatch hex={tube.colorHex} />
            </View>
            <View className="w-8">
              {tube.tracerColorHex ? (
                <Swatch hex={tube.tracerColorHex} />
              ) : (
                <AppText size="xs" color="muted">—</AppText>
              )}
            </View>
            <AppText size="sm" color="primary" className="flex-1">
              {tube.tracerColorName
                ? `${tube.colorName} / ${tube.tracerColorName}`
                : tube.colorName}
            </AppText>
            <AppText size="sm" color="secondary" className="w-14">{tube.fiberCount}f</AppText>
          </View>
          {index < tubes.length - 1 && <Divider />}
        </View>
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
        <View key={ribbon.ribbonNumber}>
          <View className="flex-row gap-3 items-center py-2">
            <AppText size="sm" color="secondary" className="w-14">{ribbon.ribbonNumber}</AppText>
            <View className="w-12">
              <Swatch hex={ribbon.colorHex} />
            </View>
            <AppText size="sm" color="primary" className="flex-1">{ribbon.colorName}</AppText>
            <AppText size="sm" color="secondary" className="w-12">{ribbon.abbreviation}</AppText>
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
                  <AppText size="xs" color="muted" className="mx-1">or</AppText>
                  <Swatch hex={jacket.altJacketHex} size={16} />
                </>
              )}
              <AppText size="sm" color="primary" className="font-semibold ml-2 flex-1">
                {jacket.fiberType}
              </AppText>
              {jacket.isLegacy && (
                <View className="bg-[#FFB30020] border border-[#FFB300] rounded px-1.5 py-0.5">
                  <AppText size="xs" color="accentAmber" className="font-semibold">LEGACY</AppText>
                </View>
              )}
            </View>
            <AppText size="xs" color="secondary" className="leading-4 mt-1">
              {jacket.notes}
            </AppText>
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
              <AppText size="sm" color="primary" className="font-semibold ml-2">
                {connector.polishType}
              </AppText>
              <AppText size="xs" color="secondary" className="ml-2">
                {connector.fiberCompatibility.join(", ")}
              </AppText>
            </View>
            <AppText size="xs" color="secondary" className="leading-4">
              Body: {connector.bodyColor}
            </AppText>
            {connector.polishType === "APC" && (
              <View className="mt-2 bg-[#FF444420] border border-[#FF4444] rounded px-2 py-1.5">
                <AppText size="xs" color="danger" className="font-semibold">
                  NEVER mix APC with UPC — physical damage to fiber ends will result.
                </AppText>
              </View>
            )}
            <AppText size="xs" color="secondary" className="leading-4 mt-1">
              {connector.notes}
            </AppText>
          </View>
          {index < connectors.length - 1 && <Divider />}
        </View>
      ))}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ColorCodesScreen() {
  const { activeConfig } = useCableConfig();

  return (
    <AppShell>
      <Stack.Screen options={{ title: "Color Codes" }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        <AppText size="xs" color="muted" className="text-center mb-4">
          {colorData.standard}
        </AppText>

        <ConfigSelector />

        <SectionCard title="Fiber Sequence" collapsible defaultOpen={false}>
          <FiberSequenceTable fibers={colorData.fiberSequence as FiberColor[]} />
        </SectionCard>

        <SectionCard title="Buffer Tubes" collapsible defaultOpen={false}>
          {activeConfig ? (
            <CustomBufferTubeTable tubes={activeConfig.tubes} />
          ) : (
            <StandardBufferTubeTable tubes={colorData.bufferTubes as BufferTube[]} />
          )}
        </SectionCard>

        <SectionCard title="Ribbons" collapsible defaultOpen={false}>
          <RibbonTable ribbons={colorData.ribbons as Ribbon[]} />
        </SectionCard>

        <SectionCard title="Jacket Colors" collapsible defaultOpen={false}>
          <JacketColorTable jackets={colorData.jacketColors as JacketColor[]} />
        </SectionCard>

        <SectionCard title="Connector Colors" collapsible defaultOpen={false}>
          <ConnectorColorTable
            connectors={colorData.connectorColors as ConnectorColor[]}
          />
        </SectionCard>
      </ScrollView>
    </AppShell>
  );
}

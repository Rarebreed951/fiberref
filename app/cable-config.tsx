import { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
import { SectionCard, Divider } from "../src/components/ui";
import { useCableConfig } from "../src/context/CableConfigContext";
import type { TubeEntry, CableConfig } from "../src/types/cableConfig";

// ─── Constants ────────────────────────────────────────────────────────────────

export const TIA_COLORS = [
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

const FIBER_COUNT_OPTIONS = [
  1, 2, 4, 6, 8, 10, 12, 24, 36, 48, 60, 72, 96, 144, 192, 288,
];

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
    tubes.push({
      tubeNumber: num,
      fiberCount,
      colorName: color.name,
      colorHex: color.hex,
    });
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" }}
        onPress={onDismiss}
      >
        <Pressable
          style={{
            backgroundColor: "#1A1A1A",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: 40,
          }}
          onPress={() => {}}
        >
          <AppText
            size="md"
            color="accentCyan"
            style={{ fontWeight: "700", marginBottom: 20, textAlign: "center" }}
          >
            {target === "tracer" ? "Select Tracer Color" : "Select Tube Color"}
          </AppText>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {TIA_COLORS.map((color) => (
              <Pressable
                key={color.name}
                onPress={() => onSelect(color.name, color.hex)}
                style={{ alignItems: "center", width: 56 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: color.hex,
                    borderWidth: 2,
                    borderColor:
                      color.hex === "#FFFFFF" || color.hex === "#FFD700"
                        ? "#666"
                        : "#2A2A2A",
                  }}
                />
                <AppText size="xs" color="secondary" style={{ marginTop: 4, textAlign: "center" }}>
                  {color.name}
                </AppText>
              </Pressable>
            ))}

            {target === "tracer" && (
              <Pressable onPress={onNone} style={{ alignItems: "center", width: 56 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "#111",
                    borderWidth: 2,
                    borderColor: "#555",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText size="md" color="muted">—</AppText>
                </View>
                <AppText size="xs" color="muted" style={{ marginTop: 4, textAlign: "center" }}>
                  None
                </AppText>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" }}
        onPress={onDismiss}
      >
        <Pressable
          style={{
            backgroundColor: "#1A1A1A",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: 40,
            maxHeight: 400,
          }}
          onPress={() => {}}
        >
          <AppText
            size="md"
            color="accentCyan"
            style={{ fontWeight: "700", marginBottom: 12, textAlign: "center" }}
          >
            Fibers Per Tube
          </AppText>
          <FlatList
            data={FIBER_COUNT_OPTIONS}
            keyExtractor={(n) => String(n)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: item === current ? "#00FFFF15" : "transparent",
                  borderWidth: 1,
                  borderColor: item === current ? "#00FFFF" : "transparent",
                  marginBottom: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <AppText size="sm" color={item === current ? "accentCyan" : "primary"}>
                  {item} fibers
                </AppText>
                {item === current && (
                  <AppText size="sm" color="accentCyan">✓</AppText>
                )}
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
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
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 }}>
      <AppText size="sm" color="secondary" style={{ width: 28 }}>
        {tube.tubeNumber}
      </AppText>

      {/* Base color swatch — tap to change */}
      <Pressable onPress={onColorPress} hitSlop={8}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: tube.colorHex,
            borderWidth: 2,
            borderColor:
              tube.colorHex === "#FFFFFF" || tube.colorHex === "#FFD700"
                ? "#666"
                : "#333",
          }}
        />
      </Pressable>

      <AppText size="sm" color="primary" style={{ flex: 1 }}>
        {tube.colorName}
      </AppText>

      {/* Tracer swatch — tap to change, + to add */}
      <Pressable onPress={onTracerPress} hitSlop={8}>
        {tube.tracerColorHex ? (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: tube.tracerColorHex,
              borderWidth: 2,
              borderColor: tube.tracerColorHex === "#FFFFFF" ? "#666" : "#333",
            }}
          />
        ) : (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#111",
              borderWidth: 1,
              borderColor: "#444",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText size="xs" color="muted">+</AppText>
          </View>
        )}
      </Pressable>

      {/* Fiber count — tap to change */}
      <Pressable
        onPress={onCountPress}
        hitSlop={8}
        style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#333",
          backgroundColor: "#111",
          minWidth: 44,
          alignItems: "center",
        }}
      >
        <AppText size="xs" color="secondary">{tube.fiberCount}f</AppText>
      </Pressable>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CableConfigScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { configs, saveConfig, deleteConfig, setActiveConfig } = useCableConfig();
  const existing = id ? configs.find((c) => c.id === id) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [totalFibersText, setTotalFibersText] = useState(
    existing ? String(existing.totalFibers) : ""
  );
  const [defaultCount, setDefaultCount] = useState(12);
  const [tubes, setTubes] = useState<TubeEntry[]>(existing?.tubes ?? []);

  // Color picker state
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>("base");
  const [pickerTubeIndex, setPickerTubeIndex] = useState(0);

  // Count picker state
  const [countPickerVisible, setCountPickerVisible] = useState(false);
  const [countPickerIndex, setCountPickerIndex] = useState(0);
  const [defaultCountPickerVisible, setDefaultCountPickerVisible] = useState(false);

  const openColorPicker = (index: number, target: PickerTarget) => {
    setPickerTubeIndex(index);
    setPickerTarget(target);
    setColorPickerVisible(true);
  };

  const handleColorSelect = (name: string, hex: string) => {
    setTubes((prev) =>
      prev.map((t, i) => {
        if (i !== pickerTubeIndex) return t;
        if (pickerTarget === "base") return { ...t, colorName: name, colorHex: hex };
        return { ...t, tracerColorName: name, tracerColorHex: hex };
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
    setTubes((prev) =>
      prev.map((t, i) => (i === countPickerIndex ? { ...t, fiberCount: n } : t))
    );
    setCountPickerVisible(false);
  };

  const handleGenerate = () => {
    const total = parseInt(totalFibersText, 10);
    if (isNaN(total) || total <= 0) {
      Alert.alert("Enter total fibers", "Please enter a valid fiber count first.");
      return;
    }
    const doGenerate = () => setTubes(generateTubes(total, defaultCount));
    if (tubes.length > 0) {
      Alert.alert("Replace Tubes?", "This will replace your current tube list.", [
        { text: "Cancel", style: "cancel" },
        { text: "Replace", style: "destructive", onPress: doGenerate },
      ]);
    } else {
      doGenerate();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a name for this config.");
      return;
    }
    const total = parseInt(totalFibersText, 10);
    const config: CableConfig = {
      id: existing?.id ?? generateId(),
      name: name.trim(),
      totalFibers: isNaN(total) ? 0 : total,
      tubes,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    await saveConfig(config);
    setActiveConfig(config.id);
    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      "Delete Config?",
      `"${existing.name}" will be permanently removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteConfig(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  const totalFromTubes = tubes.reduce((sum, t) => sum + t.fiberCount, 0);
  const totalFibers = parseInt(totalFibersText, 10);
  const mismatch =
    !isNaN(totalFibers) && totalFibers > 0 && totalFromTubes !== totalFibers;

  return (
    <AppShell showAd={false}>
      <Stack.Screen options={{ title: existing ? "Edit Config" : "New Config" }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Config Details ────────────────────────────────────────── */}
        <SectionCard title="Config Details">
          <AppText size="xs" color="muted" style={{ marginBottom: 6 }}>Name</AppText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Job 47 – AT&T trunk"
            placeholderTextColor="#555"
            style={{
              color: "#FFF",
              fontSize: 15,
              borderWidth: 1,
              borderColor: "#333",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: "#111",
              marginBottom: 16,
            }}
          />

          <AppText size="xs" color="muted" style={{ marginBottom: 6 }}>
            Total Fibers (from cable label)
          </AppText>
          <TextInput
            value={totalFibersText}
            onChangeText={setTotalFibersText}
            placeholder="e.g. 144"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            style={{
              color: "#FFF",
              fontSize: 15,
              borderWidth: 1,
              borderColor: "#333",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: "#111",
            }}
          />
        </SectionCard>

        {/* ── Quick Generate ───────────────────────────────────────── */}
        <SectionCard title="Quick Generate">
          <AppText size="xs" color="secondary" style={{ marginBottom: 14, lineHeight: 18 }}>
            Generates the full tube list using a default fiber count. You can
            override individual tubes after generating.
          </AppText>

          <AppText size="xs" color="muted" style={{ marginBottom: 8 }}>
            Default fibers per tube
          </AppText>
          <Pressable
            onPress={() => setDefaultCountPickerVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: "#333",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: "#111",
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AppText size="sm" color="primary">{defaultCount} fibers</AppText>
            <AppText size="xs" color="muted">▼</AppText>
          </Pressable>

          <Pressable
            onPress={handleGenerate}
            style={{
              backgroundColor: "#00FFFF15",
              borderWidth: 1,
              borderColor: "#00FFFF",
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <AppText size="sm" color="accentCyan" style={{ fontWeight: "700" }}>
              Generate Tubes
            </AppText>
          </Pressable>
        </SectionCard>

        {/* ── Tube List ────────────────────────────────────────────── */}
        {tubes.length > 0 && (
          <SectionCard title={`Tubes  ·  ${tubes.length} tubes  ·  ${totalFromTubes}f total`}>
            {mismatch && (
              <View
                style={{
                  marginBottom: 10,
                  backgroundColor: "#FF444420",
                  borderWidth: 1,
                  borderColor: "#FF4444",
                  borderRadius: 6,
                  padding: 8,
                }}
              >
                <AppText size="xs" color="danger">
                  Tube total ({totalFromTubes}f) doesn't match cable label ({totalFibers}f).
                  Adjust individual tubes or re-generate.
                </AppText>
              </View>
            )}

            {/* Column header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 6,
                borderBottomWidth: 1,
                borderColor: "#333",
                gap: 12,
                marginBottom: 2,
              }}
            >
              <AppText size="xs" color="muted" style={{ width: 28 }}>#</AppText>
              <AppText size="xs" color="muted" style={{ width: 30 }}></AppText>
              <AppText size="xs" color="muted" style={{ flex: 1 }}>Color</AppText>
              <AppText size="xs" color="muted" style={{ width: 24, textAlign: "center" }}>Trcr</AppText>
              <AppText size="xs" color="muted" style={{ width: 44, textAlign: "center" }}>Count</AppText>
            </View>

            {tubes.map((tube, index) => (
              <View key={tube.tubeNumber}>
                <TubeRow
                  tube={tube}
                  onColorPress={() => openColorPicker(index, "base")}
                  onTracerPress={() => openColorPicker(index, "tracer")}
                  onCountPress={() => {
                    setCountPickerIndex(index);
                    setCountPickerVisible(true);
                  }}
                />
                {index < tubes.length - 1 && <Divider />}
              </View>
            ))}
          </SectionCard>
        )}

        {/* ── Action Buttons ───────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 4 }}>
          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: "#00FFFF15",
              borderWidth: 1,
              borderColor: "#00FFFF",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <AppText size="md" color="accentCyan" style={{ fontWeight: "700" }}>
              Save Config
            </AppText>
          </Pressable>

          {existing && (
            <Pressable
              onPress={handleDelete}
              style={{
                backgroundColor: "#FF444415",
                borderWidth: 1,
                borderColor: "#FF4444",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <AppText size="md" color="danger" style={{ fontWeight: "700" }}>
                Delete Config
              </AppText>
            </Pressable>
          )}

          <Pressable
            onPress={() => router.back()}
            style={{ paddingVertical: 14, alignItems: "center" }}
          >
            <AppText size="sm" color="muted">Cancel</AppText>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── Modals ───────────────────────────────────────────────────── */}
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
        onSelect={(n) => {
          setDefaultCount(n);
          setDefaultCountPickerVisible(false);
        }}
        onDismiss={() => setDefaultCountPickerVisible(false)}
      />
    </AppShell>
  );
}

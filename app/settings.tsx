import { View, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
import { useFontSize, SCALE_PRESETS, ScalePreset } from "../src/context/FontSizeContext";

// ─── Preset list ──────────────────────────────────────────────────────────────

const PRESETS: { key: ScalePreset; label: string }[] = [
  { key: "small",  label: "S"  },
  { key: "normal", label: "M"  },
  { key: "large",  label: "L"  },
  { key: "xlarge", label: "XL" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { preset, setPreset } = useFontSize();

  const selectedLabel = {
    small:  "Small",
    normal: "Normal",
    large:  "Large",
    xlarge: "X-Large",
  }[preset];

  const selectedPx = Math.round(SCALE_PRESETS[preset] * 16);

  return (
    <AppShell showAd={false}>
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 28 }}>

        {/* ── Text Size ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 12, gap: 8 }}>
          <AppText size="xs" color="muted" style={{ fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
            Text Size
          </AppText>
          <AppText size="xs" color="muted">
            {selectedLabel} · {selectedPx}px
          </AppText>
        </View>

        {/* Segmented control */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#111111",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#2A2A2A",
            padding: 3,
            marginBottom: 8,
          }}
        >
          {PRESETS.map(({ key, label }) => {
            const isSelected = preset === key;
            return (
              <Pressable
                key={key}
                onPress={() => setPreset(key)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: isSelected ? "#00FFFF20" : "transparent",
                  borderWidth: 1,
                  borderColor: isSelected ? "#00FFFF55" : "transparent",
                  alignItems: "center",
                }}
              >
                <AppText
                  size="sm"
                  color={isSelected ? "accentCyan" : "secondary"}
                  style={{ fontWeight: isSelected ? "700" : "400" }}
                >
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText size="xs" color="muted" style={{ marginBottom: 36 }}>
          Changes apply immediately across all screens.
        </AppText>

        {/* ── Submit Feedback ────────────────────────────────────────── */}
        <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 12 }}>
          <AppText size="xs" color="muted" style={{ fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
            Support
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push("/feedback")}
          style={{
            borderWidth: 1,
            borderColor: "#2A2A2A",
            backgroundColor: "#111111",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AppText size="md" color="primary">Submit Feedback</AppText>
          <AppText size="lg" color="muted">›</AppText>
        </Pressable>

      </View>
    </AppShell>
  );
}

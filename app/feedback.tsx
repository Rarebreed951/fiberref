import { useState } from "react";
import { View, TextInput, ScrollView, Pressable, Linking, Alert } from "react-native";
import { Stack } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";

// ─── Config ───────────────────────────────────────────────────────────────────

// TODO: Replace with your feedback email address before publishing
const FEEDBACK_EMAIL = "";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "bug",       label: "Bug Report",  description: "Something isn't working" },
  { key: "data",      label: "Data Error",  description: "Incorrect or missing specs" },
  { key: "suggestion", label: "Suggestion", description: "Feature or improvement idea" },
  { key: "other",     label: "Other",       description: "Anything else" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FeedbackScreen() {
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [description, setDescription] = useState("");

  const canSubmit = category !== null && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const selectedLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;
    const subject = encodeURIComponent(`FiberRef Feedback: ${selectedLabel}`);
    const body = encodeURIComponent(
      `Category: ${selectedLabel}\n\n${description.trim()}`
    );
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert(
        "No email app found",
        "We couldn't open an email client on this device. Please send your feedback manually."
      );
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <AppShell showAd={false}>
      <Stack.Screen options={{ title: "Submit Feedback" }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <AppText size="md" color="primary" style={{ fontWeight: "600", marginBottom: 6 }}>
          Help us improve FiberRef
        </AppText>
        <AppText size="sm" color="secondary" style={{ marginBottom: 24, lineHeight: 20 }}>
          Use this form to report a bug, flag incorrect or missing specs, or
          suggest a new feature. Select a category below, describe the issue or
          idea, and tap to open an email draft — nothing is sent automatically.
        </AppText>

        {/* ── Category ───────────────────────────────────────────────── */}
        <AppText size="sm" color="primary" style={{ fontWeight: "600", marginBottom: 10 }}>
          Category
        </AppText>

        {CATEGORIES.map(({ key, label, description: desc }) => {
          const selected = category === key;
          return (
            <Pressable
              key={key}
              onPress={() => setCategory(key)}
              style={{
                borderWidth: 1,
                borderColor: selected ? "#00FFFF" : "#2A2A2A",
                backgroundColor: selected ? "#00FFFF15" : "#111111",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <AppText size="sm" color={selected ? "accentCyan" : "primary"}>
                  {label}
                </AppText>
                <AppText size="xs" color="muted" style={{ marginTop: 2 }}>
                  {desc}
                </AppText>
              </View>
              {selected && (
                <AppText size="md" color="accentCyan">✓</AppText>
              )}
            </Pressable>
          );
        })}

        {/* ── Description ────────────────────────────────────────────── */}
        <AppText
          size="sm"
          color="primary"
          style={{ fontWeight: "600", marginTop: 20, marginBottom: 10 }}
        >
          Description
        </AppText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue or idea in as much detail as you can..."
          placeholderTextColor="#555"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{
            color: "#FFF",
            fontSize: 14,
            borderWidth: 1,
            borderColor: description.length > 0 ? "#444" : "#2A2A2A",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: "#111111",
            minHeight: 130,
            lineHeight: 20,
          }}
        />
        <AppText size="xs" color="muted" style={{ marginTop: 6, textAlign: "right" }}>
          {description.trim().length} characters
        </AppText>

        {/* ── Submit ─────────────────────────────────────────────────── */}
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={{
            marginTop: 24,
            borderWidth: 1,
            borderColor: canSubmit ? "#00FFFF" : "#2A2A2A",
            backgroundColor: canSubmit ? "#00FFFF15" : "#111111",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <AppText
            size="md"
            color={canSubmit ? "accentCyan" : "muted"}
            style={{ fontWeight: "700" }}
          >
            Open Email Draft
          </AppText>
        </Pressable>

        <AppText size="xs" color="muted" style={{ marginTop: 12, textAlign: "center", lineHeight: 18 }}>
          Tapping above opens your email app with your feedback pre-filled.
          Nothing is sent automatically.
        </AppText>
      </ScrollView>
    </AppShell>
  );
}

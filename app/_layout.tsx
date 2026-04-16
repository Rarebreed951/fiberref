import "../global.css";
import { Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontSizeProvider } from "../src/context/FontSizeContext";
import { CableConfigProvider } from "../src/context/CableConfigContext";

// ─── Header buttons ───────────────────────────────────────────────────────────

function HeaderRightButtons() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingRight: 4 }}>
      <Pressable
        onPress={() => router.push("/favorites")}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{ borderWidth: 1, borderColor: "#FFB30066", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center", justifyContent: "center" }}
        accessibilityRole="button"
        accessibilityLabel="Favorites"
      >
        <Text style={{ color: "#FFB300", fontSize: 16 }}>★</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/search")}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{ borderWidth: 1, borderColor: "#00FFFF66", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center", justifyContent: "center" }}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Text style={{ color: "#00FFFF", fontSize: 14, fontWeight: "600" }}>Search</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/settings")}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{ borderWidth: 1, borderColor: "#55555566", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center", justifyContent: "center" }}
        accessibilityRole="button"
        accessibilityLabel="Settings"
      >
        <Text style={{ color: "#888888", fontSize: 14 }}>⚙</Text>
      </Pressable>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <FontSizeProvider>
      <CableConfigProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0D0D0D" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { color: "#ffffff", fontWeight: "600" },
            headerRight: () => <HeaderRightButtons />,
            contentStyle: { backgroundColor: "#0D0D0D" },
          }}
        >
          <Stack.Screen name="calculator"   options={{ headerRight: undefined }} />
          <Stack.Screen name="search"       options={{ headerRight: undefined }} />
          <Stack.Screen name="settings"     options={{ headerRight: undefined }} />
          <Stack.Screen name="cable-config" options={{ headerRight: undefined }} />
          <Stack.Screen name="feedback"     options={{ headerRight: undefined }} />
        </Stack>
      </CableConfigProvider>
    </FontSizeProvider>
  );
}

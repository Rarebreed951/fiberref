import "../global.css";
import { Pressable, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Dark header background — component form avoids passing backgroundColor as a
// native string prop directly, which triggers a JSI type error in new arch.
function DarkHeaderBg() {
  return <View style={{ flex: 1, backgroundColor: "#0D0D0D" }} />;
}

// Search button shown in every screen's header except the search screen itself.
function HeaderSearchButton() {
  return (
    <Pressable
      onPress={() => router.push("/search")}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{ paddingRight: 4 }}
    >
      <Text style={{ color: "#00FFFF", fontSize: 14, fontWeight: "600" }}>
        Search
      </Text>
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          // iOS-safe dark header: use headerBackground instead of
          // headerStyle.backgroundColor to avoid new-arch JSI type conflicts.
          headerBackground: DarkHeaderBg,
          headerShadowVisible: false,
          // Tints back chevron and back-title on iOS.
          headerTintColor: "#00FFFF",
          headerTitleStyle: {
            color: "#FFFFFF",
            fontWeight: "600",
          },
          headerRight: HeaderSearchButton,
          // Content sits below the header; background matches the app dark theme.
          contentStyle: { backgroundColor: "#0D0D0D" },
        }}
      />
    </>
  );
}

import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTintColor: "#00FFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: "#0D0D0D" },
        }}
      />
    </>
  );
}

import { FlatList, Pressable, Text } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";

const MODULES = [
  {
    id: "color-codes",
    name: "Color Codes",
    description: "TIA-598-C fiber, tube, ribbon & connector colors",
    route: "/color-codes",
  },
  {
    id: "otdr",
    name: "OTDR Reference",
    description: "Event types, trace reading, settings guide",
    route: "/otdr",
  },
  {
    id: "iolm",
    name: "IOLM / Loss Testing",
    description: "Test methods A/B/C, thresholds, reference setups",
    route: "/iolm",
  },
  {
    id: "enclosures",
    name: "Splice Enclosures",
    description: "Types, capacities, major brands & models",
    route: "/enclosures",
  },
  {
    id: "fiber-types",
    name: "Fiber Types",
    description: "ITU/TIA designations, specs, use cases",
    route: "/fiber-types",
  },
  {
    id: "optics",
    name: "Optics & Transceivers",
    description: "SFP/QSFP form factors, wavelengths, distances",
    route: "/optics",
  },
  {
    id: "calculator",
    name: "Loss Budget Calculator",
    description: "Calculated vs. allowable loss — pass/fail",
    route: "/calculator",
  },
  {
    id: "profiles",
    name: "Customer Profiles",
    description: "Per-customer threshold templates",
    route: "/profiles",
  },
] as const;

type Module = (typeof MODULES)[number];

function ModuleCard({ item }: { item: Module }) {
  return (
    <Pressable
      className="flex-1 m-2 p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] active:opacity-60"
      onPress={() => router.push(item.route)}
    >
      <Text className="text-[#00FFFF] text-base font-bold mb-1">
        {item.name}
      </Text>
      <Text className="text-[#A0A0A0] text-xs leading-4">
        {item.description}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <AppShell>
      <Stack.Screen options={{ title: "FiberRef" }} />
      <FlatList
        data={MODULES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 6 }}
        renderItem={({ item }) => <ModuleCard item={item} />}
      />
    </AppShell>
  );
}

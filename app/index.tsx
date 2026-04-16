import { FlatList, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";

const MODULES = [
  {
    id: "color-codes",
    name: "Color Codes",
    description: "TIA-598-C fiber, tube, ribbon & connector colors",
    route: "/color-codes",
    color: "#FF88CC",
  },
  {
    id: "otdr",
    name: "OTDR Reference",
    description: "Event types, trace reading, settings guide",
    route: "/otdr",
    color: "#FFB300",
  },
  {
    id: "iolm",
    name: "IOLM / Loss Testing",
    description: "Test methods A/B/C, thresholds, reference setups",
    route: "/iolm",
    color: "#00FFFF",
  },
  {
    id: "enclosures",
    name: "Splice Enclosures",
    description: "Types, capacities, major brands & models",
    route: "/enclosures",
    color: "#FF8844",
  },
  {
    id: "fiber-types",
    name: "Fiber Types",
    description: "ITU/TIA designations, specs, use cases",
    route: "/fiber-types",
    color: "#00FF88",
  },
  {
    id: "optics",
    name: "Optics & Transceivers",
    description: "SFP/QSFP form factors, wavelengths, distances",
    route: "/optics",
    color: "#AA88FF",
  },
  {
    id: "calculator",
    name: "Loss Budget Calculator",
    description: "Calculated vs. allowable loss — pass/fail",
    route: "/calculator",
    color: "#88CCFF",
  },
  {
    id: "profiles",
    name: "Customer Profiles",
    description: "Per-customer threshold templates",
    route: "/profiles",
    color: "#FFAA44",
  },
] as const;

type Module = (typeof MODULES)[number];

function ModuleCard({ item }: { item: Module }) {
  return (
    <Pressable
      style={{
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${item.color}44`,
      }}
      onPress={() => router.push(item.route)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name} — ${item.description}`}
    >
      <AppText size="md" color={item.color} style={{ fontWeight: "700", marginBottom: 4 }}>
        {item.name}
      </AppText>
      <AppText size="xs" color="secondary" style={{ lineHeight: 16 }}>
        {item.description}
      </AppText>
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

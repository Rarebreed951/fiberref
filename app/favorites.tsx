import { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import AppShell from "../src/components/AppShell";
import AppText from "../src/components/AppText";
import {
  loadFavorites,
  toggleFavorite,
  type FavoriteEntry,
} from "../src/storage/favorites";

// ─── Header button ────────────────────────────────────────────────────────────

// Favorites screen suppresses the ★ button — use Search only.
function HeaderSearchButton() {
  return (
    <Pressable
      onPress={() => router.push("/search")}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{ paddingRight: 4 }}
      accessibilityRole="button"
      accessibilityLabel="Search"
    >
      <AppText size="sm" color="accentCyan" className="font-semibold">
        Search
      </AppText>
    </Pressable>
  );
}

// ─── Module colors (matches search.tsx) ──────────────────────────────────────

const MODULE_COLORS: Record<string, string> = {
  "Color Codes": "#FF88CC",
  "Fiber Types": "#00FF88",
  "OTDR":        "#FFB300",
  "IOLM":        "#00FFFF",
  "Enclosures":  "#FF8844",
  "Optics":      "#AA88FF",
};

// ─── Components ───────────────────────────────────────────────────────────────

function ModuleBadge({ module }: { module: string }) {
  const color = MODULE_COLORS[module] ?? "#555555";
  return (
    <View
      style={{ borderColor: `${color}55`, backgroundColor: `${color}15` }}
      className="border rounded px-1.5 py-0.5 mr-2"
    >
      <AppText size="xs" color={color} className="font-semibold">
        {module}
      </AppText>
    </View>
  );
}

function FavoriteCard({
  entry,
  onRemove,
}: {
  entry: FavoriteEntry;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={() => router.push(entry.route as never)}
      className="mx-3 mb-2 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-3 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`${entry.title}, ${entry.module}`}
    >
      <View className="flex-row items-center mb-1">
        <ModuleBadge module={entry.module} />
        <AppText
          size="sm"
          color="primary"
          className="font-semibold flex-1"
          numberOfLines={1}
        >
          {entry.title}
        </AppText>
        <Pressable
          onPress={onRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="ml-2"
          accessibilityRole="button"
          accessibilityLabel={`Remove ${entry.title} from favorites`}
        >
          <Text style={{ color: "#FFB300", fontSize: 16 }}>★</Text>
        </Pressable>
      </View>
      <AppText size="xs" color="muted" className="leading-4" numberOfLines={2}>
        {entry.subtitle}
      </AppText>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text style={{ color: "#2A2A2A", fontSize: 48 }} className="mb-4">
        ★
      </Text>
      <AppText size="sm" color="muted" className="font-semibold text-center mb-1">
        No favorites yet
      </AppText>
      <AppText size="xs" color="muted" className="text-center leading-4">
        Tap ★ on any Search result to save it here for one-tap access.
      </AppText>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

  const handleRemove = useCallback(async (entry: FavoriteEntry) => {
    const { favorites: updated } = await toggleFavorite(entry);
    setFavorites(updated);
  }, []);

  return (
    <AppShell>
      <Stack.Screen
        options={{ title: "Favorites", headerRight: HeaderSearchButton }}
      />

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        >
          {favorites.map((entry) => (
            <FavoriteCard
              key={entry.id}
              entry={entry}
              onRemove={() => handleRemove(entry)}
            />
          ))}
        </ScrollView>
      )}
    </AppShell>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@fiberref/favorites";

export interface FavoriteEntry {
  id: string;
  module: string;
  route: string;
  title: string;
  subtitle: string;
}

export async function loadFavorites(): Promise<FavoriteEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as FavoriteEntry[]) : [];
}

async function persist(entries: FavoriteEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
}

// Returns the full updated list and whether the entry is now favorited.
export async function toggleFavorite(
  entry: FavoriteEntry
): Promise<{ favorites: FavoriteEntry[]; isNowFavorite: boolean }> {
  const current = await loadFavorites();
  const exists = current.some((e) => e.id === entry.id);
  const updated = exists
    ? current.filter((e) => e.id !== entry.id)
    : [entry, ...current];
  await persist(updated);
  return { favorites: updated, isNowFavorite: !exists };
}

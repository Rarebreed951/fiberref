const KEY = "fiberref/favorites";

export interface FavoriteEntry {
  id: string;
  module: string;
  route: string;
  title: string;
  subtitle: string;
}

export async function loadFavorites(): Promise<FavoriteEntry[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FavoriteEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: FavoriteEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export async function toggleFavorite(
  entry: FavoriteEntry
): Promise<{ favorites: FavoriteEntry[]; isNowFavorite: boolean }> {
  const current = await loadFavorites();
  const exists = current.some((e) => e.id === entry.id);
  const updated = exists
    ? current.filter((e) => e.id !== entry.id)
    : [entry, ...current];
  persist(updated);
  return { favorites: updated, isNowFavorite: !exists };
}

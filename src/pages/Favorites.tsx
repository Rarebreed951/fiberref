import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { loadFavorites, toggleFavorite, type FavoriteEntry } from "../storage/favorites";

const MODULE_COLORS: Record<string, string> = {
  "Color Codes": "#FF88CC",
  "Fiber Types": "#00FF88",
  "OTDR":        "#FFB300",
  "IOLM":        "#00FFFF",
  "Enclosures":  "#FF8844",
  "Optics":      "#AA88FF",
};

function ModuleBadge({ module }: { module: string }) {
  const color = MODULE_COLORS[module] ?? "#555555";
  return (
    <span
      style={{ borderColor: `${color}55`, backgroundColor: `${color}15` }}
      className="border rounded px-1.5 py-0.5 mr-2"
    >
      <AppText size="xs" color={color} className="font-semibold">{module}</AppText>
    </span>
  );
}

function FavoriteCard({
  entry,
  onRemove,
}: {
  entry: FavoriteEntry;
  onRemove: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(entry.route)}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") navigate(entry.route); }}
      className="w-full mx-3 mb-2 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-3 text-left active:opacity-70 cursor-pointer"
      aria-label={`${entry.title}, ${entry.module}`}
    >
      <div className="flex flex-row items-center mb-1">
        <ModuleBadge module={entry.module} />
        <AppText size="sm" color="primary" className="font-semibold flex-1" numberOfLines={1}>
          {entry.title}
        </AppText>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-2 p-2"
          aria-label={`Remove ${entry.title} from favorites`}
        >
          <span style={{ color: "#FFB300", fontSize: 16 }}>★</span>
        </button>
      </div>
      <AppText size="xs" color="muted" className="leading-4" numberOfLines={2}>
        {entry.subtitle}
      </AppText>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
      <span style={{ color: "#2A2A2A", fontSize: 48 }} className="mb-4">★</span>
      <AppText size="sm" color="muted" className="font-semibold text-center mb-1 block">
        No favorites yet
      </AppText>
      <AppText size="xs" color="muted" className="text-center leading-4 block">
        Tap ★ on any Search result to save it here for one-tap access.
      </AppText>
    </div>
  );
}

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
      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ paddingTop: 8, paddingBottom: 24 }}>
          {favorites.map((entry) => (
            <FavoriteCard
              key={entry.id}
              entry={entry}
              onRemove={() => handleRemove(entry)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

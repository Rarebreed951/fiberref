import { useState } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";

const FEEDBACK_EMAIL = "";

const CATEGORIES = [
  { key: "bug",        label: "Bug Report",  description: "Something isn't working" },
  { key: "data",       label: "Data Error",  description: "Incorrect or missing specs" },
  { key: "suggestion", label: "Suggestion",  description: "Feature or improvement idea" },
  { key: "other",      label: "Other",       description: "Anything else" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function FeedbackScreen() {
  const [category, setCategory]       = useState<CategoryKey | null>(null);
  const [description, setDescription] = useState("");

  const canSubmit = category !== null && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const selectedLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;
    const subject = encodeURIComponent(`FiberRef Feedback: ${selectedLabel}`);
    const body    = encodeURIComponent(`Category: ${selectedLabel}\n\n${description.trim()}`);
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <AppShell showAd={false}>
      <div className="overflow-y-auto p-5 pb-12">
        <AppText size="md" color="primary" className="font-semibold mb-1.5 block">
          Help us improve FiberRef
        </AppText>
        <AppText size="sm" color="secondary" className="mb-6 leading-5 block">
          Use this form to report a bug, flag incorrect or missing specs, or suggest a new feature.
          Select a category below, describe the issue or idea, and tap to open an email draft —
          nothing is sent automatically.
        </AppText>

        {/* Category */}
        <AppText size="sm" color="primary" className="font-semibold mb-2.5 block">Category</AppText>
        {CATEGORIES.map(({ key, label, description: desc }) => {
          const selected = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`w-full border rounded-xl px-4 py-3 mb-2 flex flex-row items-center justify-between text-left ${
                selected ? "border-[#00FFFF] bg-[#00FFFF15]" : "border-[#2A2A2A] bg-[#111111]"
              }`}
            >
              <div>
                <AppText size="sm" color={selected ? "accentCyan" : "primary"} className="block">{label}</AppText>
                <AppText size="xs" color="muted" className="mt-0.5 block">{desc}</AppText>
              </div>
              {selected && <AppText size="md" color="accentCyan">✓</AppText>}
            </button>
          );
        })}

        {/* Description */}
        <AppText size="sm" color="primary" className="font-semibold mt-5 mb-2.5 block">Description</AppText>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue or idea in as much detail as you can..."
          rows={6}
          className="w-full bg-[#111111] rounded-xl px-3.5 py-3 text-white text-sm resize-none outline-none leading-5"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: description.length > 0 ? "#444" : "#2A2A2A",
            minHeight: 130,
          }}
        />
        <AppText size="xs" color="muted" className="mt-1.5 block text-right">
          {description.trim().length} characters
        </AppText>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full mt-6 border rounded-xl py-3.5 flex items-center justify-center ${
            canSubmit ? "border-[#00FFFF] bg-[#00FFFF15]" : "border-[#2A2A2A] bg-[#111111]"
          }`}
        >
          <AppText size="md" color={canSubmit ? "accentCyan" : "muted"} className="font-bold">
            Open Email Draft
          </AppText>
        </button>

        <AppText size="xs" color="muted" className="mt-3 text-center leading-[18px] block">
          Tapping above opens your email app with your feedback pre-filled.
          Nothing is sent automatically.
        </AppText>
      </div>
    </AppShell>
  );
}

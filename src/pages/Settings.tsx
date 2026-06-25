import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";
import { useFontSize, SCALE_PRESETS, ScalePreset } from "../context/FontSizeContext";

const PRESETS: { key: ScalePreset; label: string }[] = [
  { key: "small",  label: "S"  },
  { key: "normal", label: "M"  },
  { key: "large",  label: "L"  },
  { key: "xlarge", label: "XL" },
];

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { preset, setPreset } = useFontSize();

  const selectedLabel = {
    small:  "Small",
    normal: "Normal",
    large:  "Large",
    xlarge: "X-Large",
  }[preset];

  const selectedPx = Math.round(SCALE_PRESETS[preset] * 16);

  return (
    <AppShell showAd={false}>
      <div className="px-4 pt-7">
        {/* Text Size */}
        <div className="flex flex-row items-baseline mb-3 gap-2">
          <AppText size="xs" color="muted" className="font-semibold tracking-wider uppercase">
            Text Size
          </AppText>
          <AppText size="xs" color="muted">
            {selectedLabel} · {selectedPx}px
          </AppText>
        </div>

        <div className="flex flex-row bg-[#111111] rounded-[10px] border border-[#2A2A2A] p-[3px] mb-2">
          {PRESETS.map(({ key, label }) => {
            const isSelected = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`flex-1 py-2 rounded-lg border flex items-center justify-center ${
                  isSelected
                    ? "bg-[#00FFFF20] border-[#00FFFF55]"
                    : "bg-transparent border-transparent"
                }`}
              >
                <AppText
                  size="sm"
                  color={isSelected ? "accentCyan" : "secondary"}
                  className={isSelected ? "font-bold" : "font-normal"}
                >
                  {label}
                </AppText>
              </button>
            );
          })}
        </div>

        <AppText size="xs" color="muted" className="mb-9 block">
          Changes apply immediately across all screens.
        </AppText>

        {/* Support */}
        <div className="flex flex-row items-baseline mb-3">
          <AppText size="xs" color="muted" className="font-semibold tracking-wider uppercase">
            Support
          </AppText>
        </div>

        <button
          type="button"
          onClick={() => navigate("/feedback")}
          className="w-full border border-[#2A2A2A] bg-[#111111] rounded-xl px-4 py-3.5 flex flex-row items-center justify-between"
        >
          <AppText size="md" color="primary">Submit Feedback</AppText>
          <AppText size="lg" color="muted">›</AppText>
        </button>
      </div>
    </AppShell>
  );
}

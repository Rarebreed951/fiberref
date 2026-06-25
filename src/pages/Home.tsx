import { useNavigate } from "react-router-dom";
import AppText from "../components/AppText";

const MODULES = [
  { id: "color-codes",  name: "Color Codes",           description: "TIA-598-C fiber, tube, ribbon & connector colors",        route: "/color-codes",  color: "#FF88CC" },
  { id: "otdr",         name: "OTDR Reference",         description: "Event types, trace reading, settings guide",             route: "/otdr",         color: "#FFB300" },
  { id: "iolm",         name: "IOLM / Loss Testing",    description: "Test methods A/B/C, thresholds, reference setups",       route: "/iolm",         color: "#00FFFF" },
  { id: "enclosures",   name: "Splice Enclosures",      description: "Types, capacities, major brands & models",              route: "/enclosures",   color: "#FF8844" },
  { id: "fiber-types",  name: "Fiber Types",            description: "ITU/TIA designations, specs, use cases",                route: "/fiber-types",  color: "#00FF88" },
  { id: "optics",       name: "Optics & Transceivers",  description: "SFP/QSFP form factors, wavelengths, distances",         route: "/optics",       color: "#AA88FF" },
  { id: "calculator",   name: "Loss Budget Calculator", description: "Calculated vs. allowable loss — pass/fail",             route: "/calculator",   color: "#88CCFF" },
  { id: "profiles",     name: "Customer Profiles",      description: "Per-customer threshold templates",                      route: "/profiles",     color: "#FFAA44" },
] as const;

type Module = (typeof MODULES)[number];

function ModuleCard({ item }: { item: Module }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(item.route)}
      className="m-2 p-4 bg-[#1A1A1A] rounded-xl border text-left active:opacity-70 transition-opacity"
      style={{ borderColor: `${item.color}44` }}
      aria-label={`${item.name} — ${item.description}`}
    >
      <AppText size="md" color={item.color} className="font-bold mb-1 block">{item.name}</AppText>
      <AppText size="xs" color="secondary" className="leading-4 block">{item.description}</AppText>
    </button>
  );
}

export default function HomeScreen() {
  return (
    <div className="p-1 grid grid-cols-2">
      {MODULES.map((item) => (
        <ModuleCard key={item.id} item={item} />
      ))}
    </div>
  );
}

import { HashRouter, Routes, Route, useNavigate, useLocation, Outlet } from "react-router-dom";
import { FontSizeProvider } from "./context/FontSizeContext";
import { CableConfigProvider } from "./context/CableConfigContext";

import Home        from "./pages/Home";
import ColorCodes  from "./pages/ColorCodes";
import Otdr        from "./pages/Otdr";
import Iolm        from "./pages/Iolm";
import Enclosures  from "./pages/Enclosures";
import FiberTypes  from "./pages/FiberTypes";
import Optics      from "./pages/Optics";
import Calculator  from "./pages/Calculator";
import Profiles    from "./pages/Profiles";
import Search      from "./pages/Search";
import Favorites   from "./pages/Favorites";
import Settings    from "./pages/Settings";
import Feedback    from "./pages/Feedback";
import CableConfig from "./pages/CableConfig";

// ─── Route metadata ───────────────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/":             "FiberRef",
  "/color-codes":  "Color Codes",
  "/otdr":         "OTDR Reference",
  "/iolm":         "IOLM / Loss Testing",
  "/enclosures":   "Splice Enclosures",
  "/fiber-types":  "Fiber Types",
  "/optics":       "Optics & Transceivers",
  "/calculator":   "Loss Budget Calculator",
  "/profiles":     "Customer Profiles",
  "/search":       "Search",
  "/favorites":    "Favorites",
  "/settings":     "Settings",
  "/feedback":     "Submit Feedback",
  "/cable-config": "Cable Config",
};

// Screens that suppress the standard ★ / Search / ⚙ right nav
const NO_RIGHT_NAV = new Set(["/calculator", "/settings", "/cable-config", "/feedback"]);

// ─── Header right buttons ─────────────────────────────────────────────────────

function HeaderRight({ path }: { path: string }) {
  const navigate = useNavigate();

  if (NO_RIGHT_NAV.has(path)) return null;

  if (path === "/search") {
    return (
      <button
        type="button"
        onClick={() => navigate("/favorites")}
        className="border border-[#FFB30066] rounded-xl px-2 py-1"
        aria-label="Favorites"
      >
        <span style={{ color: "#FFB300", fontSize: 16 }}>★</span>
      </button>
    );
  }

  if (path === "/favorites") {
    return (
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="border border-[#00FFFF66] rounded-xl px-2 py-1"
        aria-label="Search"
      >
        <span style={{ color: "#00FFFF", fontSize: 14, fontWeight: 600 }}>Search</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => navigate("/favorites")}
        className="border border-[#FFB30066] rounded-xl px-2 py-1"
        aria-label="Favorites"
      >
        <span style={{ color: "#FFB300", fontSize: 16 }}>★</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="border border-[#00FFFF66] rounded-xl px-2 py-1"
        aria-label="Search"
      >
        <span style={{ color: "#00FFFF", fontSize: 14, fontWeight: 600 }}>Search</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/settings")}
        className="border border-[#55555566] rounded-xl px-2 py-1"
        aria-label="Settings"
      >
        <span style={{ color: "#888888", fontSize: 14 }}>⚙</span>
      </button>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const path     = location.pathname;
  const isHome   = path === "/";
  const title    = ROUTE_TITLES[path] ?? "FiberRef";

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <header className="sticky top-0 z-40 h-12 bg-[#0D0D0D] border-b border-[#1A1A1A] flex items-center px-4 gap-2">
        {!isHome && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-white text-2xl leading-none"
            aria-label="Go back"
          >
            ‹
          </button>
        )}
        <span className="text-white font-semibold text-base flex-1 truncate">{title}</span>
        <HeaderRight path={path} />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <FontSizeProvider>
      <CableConfigProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"            element={<Home />} />
              <Route path="/color-codes" element={<ColorCodes />} />
              <Route path="/otdr"        element={<Otdr />} />
              <Route path="/iolm"        element={<Iolm />} />
              <Route path="/enclosures"  element={<Enclosures />} />
              <Route path="/fiber-types" element={<FiberTypes />} />
              <Route path="/optics"      element={<Optics />} />
              <Route path="/calculator"  element={<Calculator />} />
              <Route path="/profiles"    element={<Profiles />} />
              <Route path="/search"      element={<Search />} />
              <Route path="/favorites"   element={<Favorites />} />
              <Route path="/settings"    element={<Settings />} />
              <Route path="/feedback"    element={<Feedback />} />
              <Route path="/cable-config" element={<CableConfig />} />
            </Route>
          </Routes>
        </HashRouter>
      </CableConfigProvider>
    </FontSizeProvider>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Film, Dna, Tag, Trophy, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import { useTMNT } from "@/context/TMNTContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/highlights", label: "Highlights", icon: Film },
  { to: "/player-dna", label: "Player DNA", icon: Dna },
  { to: "/brands", label: "Brands", icon: Tag },
  { to: "/sports", label: "Sports", icon: Trophy },
  { to: "/voice-lab", label: "Voice Lab", icon: Mic },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { tmntMode, toggleTMNT } = useTMNT();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 bg-[hsl(222_47%_5%)] border-r border-border transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {/* Logo area */}
        <div className="p-4 flex items-center gap-3">
          <img
            src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg"
            alt="Courtana"
            className={`h-8 transition-opacity ${collapsed ? "hidden" : ""}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.courtana.com/static/brand/logo_combined.svg";
            }}
          />
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">C</div>
          )}
        </div>

        {!collapsed && (
          <div className="px-4 pb-2">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
              {tmntMode ? "🐢 COWABUNGA SPORTS INTEL 🍕" : "Pickle DaaS"}
            </span>
          </div>
        )}

        {/* TMNT Toggle */}
        <div className="px-3 pb-3">
          <button
            onClick={toggleTMNT}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tmntMode
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(145_100%_45%/0.3)]"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🐢 {!collapsed && (tmntMode ? "TMNT MODE ON" : "TMNT MODE")}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "text-primary bg-primary/10 border-l-2 border-primary nav-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                }`}
              >
                <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-3 text-muted-foreground hover:text-foreground transition-colors border-t border-border"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!collapsed && (
            <p className="text-[10px] text-muted-foreground">
              Powered by <span className="text-foreground">Courtana</span>
              <br />v4.0 · AI-Driven Sports Intelligence
            </p>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(222_47%_5%)] border-t border-border flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] justify-center relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} />
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary absolute -bottom-0.5" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;

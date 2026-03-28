import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/highlights", label: "Highlights" },
  { to: "/player-dna", label: "Player DNA" },
  { to: "/brands", label: "Brands" },
  { to: "/voice-lab", label: "Voice Lab" },
];

const TopNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur" style={{ borderBottom: "1px solid hsl(145 100% 45% / 0.1)" }}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg"
            alt="Courtana"
            className="h-8"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-primary font-bold text-sm tracking-wider">Pickle DaaS</span>
          <span className="text-muted-foreground text-[10px]">Data as a Service for Pickleball</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-sm font-medium ${
                location.pathname === link.to ? "text-primary bg-secondary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TopNav;

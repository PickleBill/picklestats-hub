import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/highlights", label: "Highlights" },
  { to: "/player-dna", label: "Player DNA" },
  { to: "/brands", label: "Brands" },
  { to: "/voice-lab", label: "Voice Lab" },
];

const TopNav = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg"
            alt="Courtana"
            className="h-8"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
          <span className="hidden text-electric font-bold text-lg">Courtana</span>
        </div>

        <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground hidden md:block">
          Pickle DaaS
        </span>

        <div className="flex items-center gap-1">
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
      </div>
    </nav>
  );
};

export default TopNav;

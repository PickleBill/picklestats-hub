import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Keyboard, X } from "lucide-react";

const shortcuts = [
  { key: "1", action: "Dashboard" },
  { key: "2", action: "Highlights" },
  { key: "3", action: "Player DNA" },
  { key: "4", action: "Brands" },
  { key: "5", action: "Sports" },
  { key: "6", action: "Voice Lab" },
  { key: "B", action: "Toggle Broadcast Mode" },
  { key: "Space", action: "Play/Pause Video" },
  { key: "← →", action: "Prev/Next Clip (Broadcast)" },
  { key: "?", action: "Toggle Shortcuts" },
];

const routes = ["/", "/highlights", "/player-dna", "/brands", "/sports", "/voice-lab"];

const KeyboardShortcuts = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handler = useCallback((e: KeyboardEvent) => {
    // Don't capture if typing in input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

    if (e.key === "?") { e.preventDefault(); setShow((p) => !p); return; }

    const num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
      e.preventDefault();
      navigate(routes[num - 1]);
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  return (
    <>
      {/* ? button */}
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-20 left-4 md:bottom-4 md:left-auto md:right-16 z-50 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm"
        title="Keyboard shortcuts"
      >
        <Keyboard size={14} />
      </button>

      {/* Overlay */}
      {show && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setShow(false)}>
          <div className="bg-card border border-border rounded-xl p-6 w-80 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-bold">Keyboard Shortcuts</h3>
              <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-sm">
                  <kbd className="bg-secondary text-foreground px-2 py-0.5 rounded text-xs font-mono border border-border">{s.key}</kbd>
                  <span className="text-muted-foreground text-xs">{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;

import { useState, useCallback } from "react";
import { toast } from "sonner";

const PizzaEasterEgg = () => {
  const [pizzas, setPizzas] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    toast.success("PIZZA DELIVERY IN PROGRESS 🍕", { duration: 3000 });

    // Web Audio beep
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}

    // Confetti pizzas
    const newPizzas = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() - 0.5) * 200,
      y: e.clientY + (Math.random() - 0.5) * 200,
    }));
    setPizzas(newPizzas);
    setTimeout(() => setPizzas([]), 1500);
  }, []);

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-20 right-4 md:bottom-4 z-50 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg"
        title="Pizza Time!"
      >
        🍕
      </button>
      {pizzas.map((p) => (
        <span
          key={p.id}
          className="fixed text-2xl pointer-events-none z-[100] animate-pizza"
          style={{ left: p.x, top: p.y }}
        >
          🍕
        </span>
      ))}
    </>
  );
};

export default PizzaEasterEgg;

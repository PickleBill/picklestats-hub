import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { playTTS, stopTTS } from "@/lib/tts";
import { useTMNT } from "@/context/TMNTContext";

interface CommentaryTabsProps {
  commentary: {
    espn: string;
    hype: string;
    ronBurgundy: string;
    chuckNorris: string;
    coach?: string;
  };
  clipName?: string;
}

const classicTabs = [
  { key: "espn", label: "ESPN", icon: "🎙️" },
  { key: "hype", label: "Hype", icon: "🔥" },
  { key: "ronBurgundy", label: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris", label: "Chuck Norris", icon: "💪" },
  { key: "coach", label: "Coach", icon: "🎯" },
];

const tmntTabs = [
  { key: "leonardo", label: "LEO", icon: "🐢", color: "hsl(210 100% 50%)" },
  { key: "raphael", label: "RAPH", icon: "🔴", color: "hsl(0 80% 55%)" },
  { key: "michelangelo", label: "MIKEY", icon: "🟠", color: "hsl(25 100% 55%)" },
  { key: "donatello", label: "DON", icon: "🟣", color: "hsl(270 60% 55%)" },
  { key: "splinter", label: "SPLINTER", icon: "🥋", color: "hsl(48 100% 50%)" },
];

const tmntGen: Record<string, (base: string) => string> = {
  leonardo: (base) => `Discipline and focus are the keys to victory. ${base}`,
  raphael: (base) => `Yo, listen up! ${base} That's how we do it in Brooklyn, no mercy!`,
  michelangelo: (base) => `DUDE! COWABUNGA! ${base} That was TOTALLY RADICAL! 🍕`,
  donatello: (base) => `Analyzing the data... ${base} The statistics confirm a 94.7% effectiveness rating.`,
  splinter: (base) => `My students, observe carefully. ${base} In patience, the way reveals itself.`,
};

const Waveform = ({ color = "hsl(145 100% 45%)" }: { color?: string }) => (
  <div className="flex items-center gap-[3px] h-5">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="waveform-bar" style={{ background: color, animationDelay: `${i * 0.075}s` }} />
    ))}
  </div>
);

const CommentaryTabs = ({ commentary, clipName }: CommentaryTabsProps) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("classic");
  const { tmntMode } = useTMNT();

  const handlePlay = (key: string) => {
    let text = "";
    if (classicTabs.some((t) => t.key === key)) {
      text = commentary[key as keyof typeof commentary] || "";
    } else if (tmntGen[key]) {
      const base = commentary.espn || commentary.coach || commentary.hype || "";
      text = tmntGen[key](base);
    }
    if (!text) return;
    if (playing === key) {
      stopTTS();
      setPlaying(null);
      return;
    }
    stopTTS();
    setPlaying(key);
    playTTS(text, key, undefined, () => setPlaying(null));
  };

  const getText = (key: string) => {
    if (classicTabs.some((t) => t.key === key)) {
      return commentary[key as keyof typeof commentary] || "";
    }
    const base = commentary.espn || commentary.coach || commentary.hype || "";
    return tmntGen[key] ? tmntGen[key](base) : "";
  };

  const renderTabContent = (tabs: typeof classicTabs) =>
    tabs.map((t) => {
      const text = getText(t.key);
      const color = "color" in t ? (t as any).color : undefined;
      return (
        <TabsContent key={t.key} value={t.key} className="mt-3">
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">
            {text || "No commentary available."}
          </p>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePlay(t.key)}
              className="text-xs"
              disabled={!text || (playing !== null && playing !== t.key)}
              style={color ? { borderColor: color, color } : {}}
            >
              {playing === t.key ? "⏹️ Stop" : "🔊 Play Voice"}
            </Button>
            {playing === t.key && <Waveform color={color} />}
          </div>
        </TabsContent>
      );
    });

  if (!tmntMode) {
    return (
      <Tabs defaultValue="espn" className="w-full">
        <TabsList className="bg-secondary w-full justify-start flex-wrap h-auto gap-1 p-1">
          {classicTabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground text-xs">
              {t.icon} {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {renderTabContent(classicTabs)}
      </Tabs>
    );
  }

  // TMNT mode — show pack switcher
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("classic")}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === "classic" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
        >
          Classic Pack
        </button>
        <button
          onClick={() => setActiveTab("tmnt")}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === "tmnt" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
        >
          🐢 TMNT Pack
        </button>
      </div>

      {activeTab === "classic" ? (
        <Tabs defaultValue="espn" className="w-full">
          <TabsList className="bg-secondary w-full justify-start flex-wrap h-auto gap-1 p-1">
            {classicTabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground text-xs">
                {t.icon} {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {renderTabContent(classicTabs)}
        </Tabs>
      ) : (
        <Tabs defaultValue="leonardo" className="w-full">
          <TabsList className="bg-secondary w-full justify-start flex-wrap h-auto gap-1 p-1">
            {tmntTabs.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="data-[state=active]:bg-muted text-muted-foreground text-xs"
                style={{ color: t.color }}
              >
                {t.icon} {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {renderTabContent(tmntTabs)}
        </Tabs>
      )}
    </div>
  );
};

export default CommentaryTabs;

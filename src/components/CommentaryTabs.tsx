import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { playTTS, stopTTS } from "@/lib/tts";

interface CommentaryTabsProps {
  commentary: {
    espn: string;
    hype: string;
    ronBurgundy: string;
    chuckNorris: string;
    coach?: string;
  };
}

const tabs = [
  { key: "espn" as const, label: "ESPN", icon: "🎙️" },
  { key: "hype" as const, label: "Hype", icon: "🔥" },
  { key: "ronBurgundy" as const, label: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris" as const, label: "Chuck Norris", icon: "💪" },
  { key: "coach" as const, label: "Coach", icon: "🎯" },
];

const Waveform = () => (
  <div className="flex items-center gap-[3px] h-5">
    <div className="waveform-bar" />
    <div className="waveform-bar" />
    <div className="waveform-bar" />
    <div className="waveform-bar" />
  </div>
);

const CommentaryTabs = ({ commentary }: CommentaryTabsProps) => {
  const [playing, setPlaying] = useState<string | null>(null);

  const handlePlay = (key: string) => {
    const text = commentary[key as keyof typeof commentary];
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

  return (
    <Tabs defaultValue="espn" className="w-full">
      <TabsList className="bg-secondary w-full justify-start flex-wrap h-auto gap-1 p-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground text-xs">
            {t.icon} {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => {
        const text = commentary[t.key as keyof typeof commentary];
        return (
          <TabsContent key={t.key} value={t.key} className="mt-3">
            <p className="text-sm text-foreground/90 leading-relaxed mb-3">
              {text || "No commentary available for this persona."}
            </p>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePlay(t.key)}
                className="text-xs"
                disabled={!text || (playing !== null && playing !== t.key)}
              >
                {playing === t.key ? "⏹️ Stop" : "🔊 Play Voice"}
              </Button>
              {playing === t.key && <Waveform />}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default CommentaryTabs;

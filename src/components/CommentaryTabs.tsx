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
  };
}

const tabs = [
  { key: "espn" as const, label: "ESPN", icon: "🎙️" },
  { key: "hype" as const, label: "Hype", icon: "🔥" },
  { key: "ronBurgundy" as const, label: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris" as const, label: "Chuck Norris", icon: "💪" },
];

const CommentaryTabs = ({ commentary }: CommentaryTabsProps) => {
  const [playing, setPlaying] = useState<string | null>(null);

  const handlePlay = (key: string) => {
    if (playing === key) {
      stopTTS();
      setPlaying(null);
      return;
    }
    stopTTS();
    setPlaying(key);
    playTTS(
      commentary[key as keyof typeof commentary],
      key,
      undefined,
      () => setPlaying(null)
    );
  };

  return (
    <Tabs defaultValue="espn" className="w-full">
      <TabsList className="bg-secondary w-full justify-start">
        {tabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground text-xs">
            {t.icon} {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.key} value={t.key} className="mt-3">
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">{commentary[t.key]}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePlay(t.key)}
            className="text-xs"
            disabled={playing !== null && playing !== t.key}
          >
            {playing === t.key ? "⏹️ Stop" : "🔊 Play Voice"}
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CommentaryTabs;

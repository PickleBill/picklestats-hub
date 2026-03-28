import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface CommentaryTabsProps {
  commentary: {
    espn: string;
    hype: string;
    ronBurgundy: string;
    chuckNorris: string;
  };
}

const speak = (text: string) => {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
};

const tabs = [
  { key: "espn" as const, label: "ESPN", icon: "🎙️" },
  { key: "hype" as const, label: "Hype", icon: "🔥" },
  { key: "ronBurgundy" as const, label: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris" as const, label: "Chuck Norris", icon: "💪" },
];

const CommentaryTabs = ({ commentary }: CommentaryTabsProps) => (
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
          onClick={() => speak(commentary[t.key])}
          className="text-xs"
        >
          🔊 Play Voice
        </Button>
      </TabsContent>
    ))}
  </Tabs>
);

export default CommentaryTabs;

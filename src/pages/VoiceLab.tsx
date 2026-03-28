import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePickleDaas } from "@/context/PickleDaasContext";
import { useTMNT } from "@/context/TMNTContext";
import { playTTS, stopTTS } from "@/lib/tts";
import { toast } from "sonner";

const classicVoices = [
  { key: "espn", name: "ESPN", icon: "🎙️", desc: "Professional sports broadcaster" },
  { key: "hype", name: "Hype", icon: "🔥", desc: "High-energy hype commentator" },
  { key: "ronBurgundy", name: "Ron Burgundy", icon: "🥃", desc: "Stay classy, San Diego" },
  { key: "chuckNorris", name: "Chuck Norris", icon: "💪", desc: "Facts don't need sources" },
];

const tmntVoices = [
  { key: "leonardo", name: "Leonardo", icon: "🐢", color: "hsl(210 100% 50%)", desc: "Disciplined leader · Katanas", tagline: "Focus. Discipline. Victory." },
  { key: "raphael", name: "Raphael", icon: "🐢", color: "hsl(0 80% 55%)", desc: "Hot-headed brawler · Sai", tagline: "Talk is cheap. Let's play." },
  { key: "donatello", name: "Donatello", icon: "🐢", color: "hsl(270 60% 55%)", desc: "Tech genius · Bo Staff", tagline: "The data doesn't lie." },
  { key: "michelangelo", name: "Michelangelo", icon: "🐢", color: "hsl(25 100% 55%)", desc: "Party dude · Nunchucks", tagline: "COWABUNGA!" },
  { key: "splinter", name: "Splinter", icon: "🥋", color: "hsl(48 100% 50%)", desc: "Wise sensei · Staff", tagline: "In patience, victory." },
];

const tmntCommentaryFallback: Record<string, (name: string) => string> = {
  leonardo: (name) => `Discipline and focus are the foundation of this play. ${name} — a perfect example of controlled court mastery. Train hard, fight easy.`,
  raphael: (name) => `Yo, that rally in ${name}? BRUTAL. No mercy on that court. That's how you SMASH it — no holding back!`,
  donatello: (name) => `Analyzing ${name}: trajectory optimization is off the charts. The spin-to-speed ratio suggests a 94.7% unreturnable probability.`,
  michelangelo: (name) => `DUUUDE! ${name} is TOTALLY RADICAL! That shot was like a pizza — hot, cheesy, and EVERYBODY wants a slice! COWABUNGA! 🍕`,
  splinter: (name) => `My students, observe the patience in ${name}. The paddle is an extension of the mind. In stillness, the way reveals itself.`,
};

const pipeline = [
  { name: "Gemini 2.5 Flash Analysis", status: "✅", detail: "8 clips · gemini-2.5-flash" },
  { name: "ElevenLabs TTS", status: "✅", detail: "9 voices · Creator tier" },
  { name: "TMNT Voice Pack", status: "✅", detail: "5 turtle personas mapped" },
  { name: "Database", status: "✅", detail: "3 tables deployed" },
  { name: "GitHub Data Pipeline", status: "✅", detail: "Live JSON feed" },
  { name: "Multi-Sport Browser", status: "✅", detail: "Pickleball + Hockey + Golf" },
  { name: "Auto-Voice on New Clips", status: "🔜", detail: "Coming soon" },
  { name: "Realtime Feed", status: "🔜", detail: "Live updates" },
];

const Waveform = ({ color = "hsl(145 100% 45%)" }: { color?: string }) => (
  <div className="flex items-center gap-[3px] h-5">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="waveform-bar" style={{ background: color, animationDelay: `${i * 0.075}s` }} />
    ))}
  </div>
);

const VoiceLab = () => {
  const { clips } = usePickleDaas();
  const { tmntMode } = useTMNT();
  const [selectedClipId, setSelectedClipId] = useState<string>("");
  const [playing, setPlaying] = useState<string | null>(null);

  const effectiveId = selectedClipId || clips[0]?.id || "";
  const selectedClip = clips.find((c) => c.id === effectiveId) || clips[0];

  const getCommentary = (key: string) => {
    if (!selectedClip) return "";
    const c = selectedClip.commentary;
    const map: Record<string, string> = {
      espn: c?.espn || `${selectedClip.name}: ${selectedClip.caption}`,
      hype: c?.hype || selectedClip.caption.toUpperCase() + " 🔥🔥🔥",
      ronBurgundy: c?.ron_burgundy || selectedClip.ron_burgundy_quote,
      chuckNorris: c?.chuck_norris || "Chuck Norris once played this rally. The ball is still in orbit.",
    };
    if (tmntCommentaryFallback[key]) {
      return tmntCommentaryFallback[key](selectedClip.name);
    }
    return map[key] || "";
  };

  const handlePlay = (key: string) => {
    const text = getCommentary(key);
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {tmntMode ? "🐢 TMNT Voice Lab" : "AI Commentary Voice Lab"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real ElevenLabs voices · 9 personas · Classic + TMNT packs</p>
      </div>

      {/* Clip Selector */}
      <select
        value={effectiveId}
        onChange={(e) => setSelectedClipId(e.target.value)}
        className="w-full md:w-96 bg-card text-foreground border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
      >
        {clips.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Classic Voices */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 section-title">Classic Voices</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classicVoices.map((v) => (
            <Card key={v.key} className={`card-surface ${playing === v.key ? "card-surface-active" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <span className="text-2xl">{v.icon}</span> {v.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-foreground/80 leading-relaxed min-h-[60px] line-clamp-4">
                  {getCommentary(v.key)}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => handlePlay(v.key)}
                    disabled={playing !== null && playing !== v.key}
                    className={playing === v.key ? "bg-destructive hover:bg-destructive/80" : "bg-primary hover:bg-primary/80 text-primary-foreground"}
                  >
                    {playing === v.key ? "⏹️ Stop" : "▶ Play"}
                  </Button>
                  {playing === v.key && <Waveform />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TMNT Pack */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 section-title">🐢 TMNT Pack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tmntVoices.map((v) => (
            <Card
              key={v.key}
              className={`card-surface ${playing === v.key ? "card-surface-active" : ""}`}
              style={playing === v.key ? { borderColor: v.color, boxShadow: `0 0 20px ${v.color}33` } : {}}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <span className="text-xl">{v.icon}</span> {v.name}
                </CardTitle>
                <p className="text-[10px]" style={{ color: v.color }}>{v.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[11px] text-foreground/80 leading-relaxed min-h-[50px] line-clamp-3">
                  {getCommentary(v.key)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePlay(v.key)}
                    disabled={playing !== null && playing !== v.key}
                    style={playing !== v.key ? { background: v.color, color: "#fff" } : {}}
                    className={`text-xs ${playing === v.key ? "bg-destructive hover:bg-destructive/80" : "hover:opacity-80"}`}
                  >
                    {playing === v.key ? "⏹" : "▶"}
                  </Button>
                  {playing === v.key && <Waveform color={v.color} />}
                </div>
                {v.key === "michelangelo" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    style={{ borderColor: v.color, color: v.color }}
                    onClick={() => {
                      stopTTS();
                      setPlaying("michelangelo");
                      playTTS("COWABUNGA!", "michelangelo", undefined, () => setPlaying(null));
                    }}
                    disabled={playing !== null && playing !== "michelangelo"}
                  >
                    🍕 COWABUNGA!
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TMNT Mode YouTube embed */}
      {tmntMode && (
        <Card className="card-surface overflow-hidden">
          <CardHeader>
            <CardTitle className="text-foreground text-base section-title">🐢 TMNT Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              width="100%"
              height="80"
              src="https://www.youtube.com/embed/LFhN8vRBSzs?autoplay=1&mute=1"
              title="TMNT Theme"
              allow="autoplay"
              className="rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Pipeline Status */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-foreground text-base section-title">Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pipeline.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm font-medium text-foreground">{p.status} {p.name}</span>
                <span className="text-xs text-muted-foreground">{p.detail}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceLab;

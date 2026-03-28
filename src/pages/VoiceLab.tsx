import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePickleDaas } from "@/context/PickleDaasContext";
import { playTTS, stopTTS } from "@/lib/tts";
import { toast } from "sonner";

const voices = [
  { key: "espn" as const, name: "ESPN", icon: "🎙️", voiceId: "TxGEqnHWrfWFTfGW9XjX" },
  { key: "hype" as const, name: "Hype", icon: "🔥", voiceId: "ErXwobaYiN019PkySvjV" },
  { key: "ronBurgundy" as const, name: "Ron Burgundy", icon: "🥃", voiceId: "pNInz6obpgDQGcFmaJgB" },
  { key: "chuckNorris" as const, name: "Chuck Norris", icon: "💪", voiceId: "VR6AewLTigWG4xSOukaG" },
];

const pipeline = [
  { name: "Gemini 2.5 Flash Analysis", status: "✅", detail: "8 clips processed · gemini-2.5-flash" },
  { name: "ElevenLabs TTS", status: "✅", detail: "32 MP3s generated · Creator tier · 110k chars" },
  { name: "Supabase Database", status: "✅", detail: "3 tables · pickle_daas_analyses deployed" },
  { name: "GitHub Data Pipeline", status: "✅", detail: "Live at github.com/PickleBill/pickle-daas-data" },
  { name: "Auto-Voice on New Clips", status: "🔜", detail: "Triggers when new Gemini analysis runs" },
  { name: "Supabase Realtime", status: "🔜", detail: "Live clip feed as PickleBill uploads" },
];

const Waveform = () => (
  <div className="flex items-center gap-[3px] h-5">
    <div className="waveform-bar" />
    <div className="waveform-bar" />
    <div className="waveform-bar" />
    <div className="waveform-bar" />
  </div>
);

const VoiceLab = () => {
  const { clips } = usePickleDaas();
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
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Commentary Voice Lab</h1>
        <p className="text-muted-foreground mt-1">Real ElevenLabs voices · 32 MP3s already generated</p>
      </div>

      {/* Clip Selector */}
      <select
        value={effectiveId}
        onChange={(e) => setSelectedClipId(e.target.value)}
        className="w-full md:w-96 bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
      >
        {clips.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* 4 Voice Cards - 2x2 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {voices.map((v) => (
          <Card key={v.key} className="card-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <span className="text-2xl">{v.icon}</span> {v.name}
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-mono">{v.voiceId}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/80 leading-relaxed min-h-[80px]">
                {getCommentary(v.key)}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePlay(v.key)}
                  className="text-xs"
                  disabled={playing !== null && playing !== v.key}
                >
                  {playing === v.key ? "⏹️ Stop" : "🔊 Play"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground"
                  onClick={() => toast.info("Coming soon — MP3 downloads")}
                >
                  ⬇️ Download MP3
                </Button>
                {playing === v.key && <Waveform />}
              </div>
              <Badge className="bg-primary/20 text-primary border-0 text-[10px]">ElevenLabs Live</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Status */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-foreground">Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
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

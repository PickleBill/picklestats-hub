import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClips } from "@/hooks/useClips";
import { playTTS, stopTTS } from "@/lib/tts";

const voices = [
  { key: "espn" as const, name: "ESPN", icon: "🎙️" },
  { key: "hype" as const, name: "Hype", icon: "🔥" },
  { key: "ronBurgundy" as const, name: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris" as const, name: "Chuck Norris", icon: "💪" },
];

const pipeline = [
  { name: "Gemini Analysis", status: "✅ Active", detail: "6 clips processed" },
  { name: "ElevenLabs TTS", status: "✅ Connected", detail: "4 voices active" },
  { name: "Lovable Cloud", status: "✅ Live", detail: "3 tables deployed" },
  { name: "Firecrawl", status: "✅ Connected", detail: "Brand enrichment ready" },
];

const VoiceLab = () => {
  const { data: clips = [] } = useClips();
  const [selectedClipId, setSelectedClipId] = useState<string>("");
  const [playing, setPlaying] = useState<string | null>(null);

  const effectiveId = selectedClipId || clips[0]?.id || "";
  const selectedClip = clips.find((c) => c.id === effectiveId) || clips[0];

  const handlePlay = (key: string) => {
    if (!selectedClip) return;
    if (playing === key) {
      stopTTS();
      setPlaying(null);
      return;
    }
    stopTTS();
    setPlaying(key);
    playTTS(
      selectedClip.commentary[key as keyof typeof selectedClip.commentary],
      key,
      undefined,
      () => setPlaying(null)
    );
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Commentary Voice Lab</h1>
        <p className="text-muted-foreground mt-1">Generate voice commentary for any highlight using ElevenLabs AI voices</p>
      </div>

      <select
        value={effectiveId}
        onChange={(e) => setSelectedClipId(e.target.value)}
        className="w-full md:w-96 bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
      >
        {clips.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {voices.map((v) => (
          <Card key={v.key} className="card-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <span className="text-2xl">{v.icon}</span> {v.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/80 leading-relaxed min-h-[80px]">
                {selectedClip?.commentary[v.key]}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePlay(v.key)}
                className="w-full text-xs"
                disabled={playing !== null && playing !== v.key}
              >
                {playing === v.key ? "⏹️ Stop" : "🔊 Play"}
              </Button>
              <p className="text-xs text-electric text-center">ElevenLabs AI Voice</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-foreground">Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{p.status}</Badge>
                  {p.detail && <span className="text-xs text-muted-foreground">{p.detail}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceLab;

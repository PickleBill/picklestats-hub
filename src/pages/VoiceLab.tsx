import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clips } from "@/data/clips";

const voices = [
  { key: "espn" as const, name: "ESPN", icon: "🎙️" },
  { key: "hype" as const, name: "Hype", icon: "🔥" },
  { key: "ronBurgundy" as const, name: "Ron Burgundy", icon: "🥃" },
  { key: "chuckNorris" as const, name: "Chuck Norris", icon: "💪" },
];

const pipeline = [
  { name: "Gemini Analysis", status: "✅ Active", detail: "6 clips processed" },
  { name: "ElevenLabs TTS", status: "🔜 API Key Needed", detail: "" },
  { name: "Supabase Storage", status: "🔜 Schema Ready", detail: "Awaiting Deploy" },
  { name: "Auto-Voice Pipeline", status: "🔜 Waiting", detail: "on ElevenLabs" },
];

const speak = (text: string) => {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
};

const VoiceLab = () => {
  const [selectedClipId, setSelectedClipId] = useState(clips[0].id);
  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Commentary Voice Lab</h1>
        <p className="text-muted-foreground mt-1">Generate voice commentary for any highlight using AI</p>
      </div>

      {/* Clip selector */}
      <select
        value={selectedClipId}
        onChange={(e) => setSelectedClipId(e.target.value)}
        className="w-full md:w-96 bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
      >
        {clips.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Voice Cards */}
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
                {selectedClip.commentary[v.key]}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => speak(selectedClip.commentary[v.key])}
                className="w-full text-xs"
              >
                🔊 Play
              </Button>
              <p className="text-xs text-muted-foreground text-center">Coming Soon: ElevenLabs</p>
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

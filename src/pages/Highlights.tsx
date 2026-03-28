import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClipModal from "@/components/ClipModal";
import { usePickleDaas, type RawClip } from "@/context/PickleDaasContext";

const arcColorMap: Record<string, string> = {
  athletic_highlight: "bg-purple-500",
  grind_rally: "bg-blue-500",
  teaching_moment: "bg-primary/80",
  pure_fun: "bg-yellow-500",
  error_highlight: "bg-destructive",
};

const viralColor = (score: number) => {
  if (score >= 7) return "bg-destructive text-destructive-foreground";
  if (score >= 5) return "bg-accent text-accent-foreground";
  return "bg-muted text-muted-foreground";
};

const HighlightCard = ({ clip, onClick }: { clip: RawClip; onClick: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card
      className="card-surface cursor-pointer group overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative aspect-video">
        <video ref={videoRef} src={clip.video_url} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-0 font-bold">{clip.quality_score}/10</Badge>
        <Badge className={`absolute top-2 left-2 ${viralColor(clip.viral_score)} border-0 font-bold`}>{clip.viral_score}/10</Badge>
      </div>
      <CardContent className="pt-4 space-y-2">
        <Badge className={`${arcColorMap[clip.story_arc] || "bg-muted"} text-foreground border-0 text-[10px]`}>{clip.story_arc.replace(/_/g, " ")}</Badge>
        <h3 className="font-semibold text-foreground">{clip.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 border-l-2 border-primary/40 pl-2 italic">
          {clip.ron_burgundy_quote}
        </p>
        <div className="flex gap-1 flex-wrap">
          {clip.brands.map((b, i) => (
            <Badge key={b} variant="outline" className={`text-[10px] ${i === 0 ? "border-accent text-accent" : ""}`}>{b}</Badge>
          ))}
        </div>
        {clip.top_badge && (
          <Badge className="bg-primary/20 text-primary border-0 text-[10px]">{clip.top_badge}</Badge>
        )}
      </CardContent>
    </Card>
  );
};

const Highlights = () => {
  const { clips } = usePickleDaas();
  const [selected, setSelected] = useState<RawClip | null>(null);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Highlights</h1>
      <p className="text-muted-foreground mb-8">AI-analyzed pickleball clips with commentary and brand detection</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip) => (
          <HighlightCard key={clip.id} clip={clip} onClick={() => setSelected(clip)} />
        ))}
      </div>
      <ClipModal clip={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
};

export default Highlights;

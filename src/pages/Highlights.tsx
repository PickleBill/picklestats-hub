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
  if (score >= 7) return "bg-[hsl(18_100%_60%)] text-white";
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
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-0 font-bold rounded-full px-2 py-0.5">{clip.quality_score}/10</Badge>
        <Badge className={`absolute top-2 left-2 ${viralColor(clip.viral_score)} border-0 font-bold rounded-full px-2 py-0.5`}>{clip.viral_score}/10</Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <Badge className={`${arcColorMap[clip.story_arc] || "bg-muted"} text-foreground border-0 text-[10px]`}>{clip.story_arc.replace(/_/g, " ")}</Badge>
        <h3 className="font-semibold text-foreground text-sm">{clip.name}</h3>
        <div className="border-l-2 border-primary/40 pl-3 bg-card/50 py-2 rounded-r-md">
          <p className="text-xs text-muted-foreground italic line-clamp-2">
            "{clip.ron_burgundy_quote}"
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {clip.brands.map((b, i) => (
            <Badge key={b} variant="outline" className={`text-[10px] ${i === 0 ? "border-accent/50 text-accent" : "border-border text-muted-foreground"}`}>{b}</Badge>
          ))}
        </div>
        {clip.caption && (
          <p className="text-xs text-muted-foreground line-clamp-2">{clip.caption}</p>
        )}
      </CardContent>
    </Card>
  );
};

const Highlights = () => {
  const { clips } = usePickleDaas();
  const [selected, setSelected] = useState<RawClip | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 page-enter">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Highlights</h1>
      <p className="text-muted-foreground text-sm mb-8">AI-analyzed pickleball clips with commentary and brand detection</p>
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

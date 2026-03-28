import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClipModal from "@/components/ClipModal";
import { useClips } from "@/hooks/useClips";
import { type Clip } from "@/data/clips";

const HighlightCard = ({ clip, onClick }: { clip: Clip; onClick: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card
      className="card-surface cursor-pointer group overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative aspect-video">
        <video ref={videoRef} src={clip.video} muted loop playsInline className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-0 font-bold">{clip.quality}/10</Badge>
        <Badge className={`absolute top-2 left-2 ${clip.arcColor} border-0 text-foreground`}>{clip.arc}</Badge>
      </div>
      <CardContent className="pt-4 space-y-2">
        <h3 className="font-semibold text-foreground">{clip.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{clip.commentary.ronBurgundy}</p>
        <div className="flex gap-1 flex-wrap">
          {clip.badges.map((b) => (<Badge key={b} variant="outline" className="text-xs">{b}</Badge>))}
          {clip.brands.map((b) => (<Badge key={b} variant="secondary" className="text-xs">{b}</Badge>))}
        </div>
        <p className="text-xs text-muted-foreground">Viral: <span className="text-gold font-semibold">{clip.viral}/10</span></p>
      </CardContent>
    </Card>
  );
};

const Highlights = () => {
  const { data: clips = [] } = useClips();
  const [selected, setSelected] = useState<Clip | null>(null);

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

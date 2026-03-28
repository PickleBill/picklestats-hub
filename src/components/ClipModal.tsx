import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CommentaryTabs from "./CommentaryTabs";
import { type RawClip } from "@/context/PickleDaasContext";
import { toast } from "sonner";

interface ClipModalProps {
  clip: RawClip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function clipCommentary(clip: RawClip) {
  return {
    espn: clip.commentary?.espn || `${clip.name}: ${clip.caption}`,
    hype: clip.commentary?.hype || clip.caption.toUpperCase() + " 🔥🔥🔥",
    ronBurgundy: clip.commentary?.ron_burgundy || clip.ron_burgundy_quote,
    chuckNorris: clip.commentary?.chuck_norris || "Chuck Norris once played this rally. The ball is still in orbit.",
    coach: clip.commentary?.coach || clip.daas_signals?.coaching_breakdown || "",
  };
}

const arcColorMap: Record<string, string> = {
  athletic_highlight: "bg-purple-500",
  grind_rally: "bg-blue-500",
  teaching_moment: "bg-primary/80",
  pure_fun: "bg-yellow-500",
  error_highlight: "bg-destructive",
};

const ClipModal = ({ clip, open, onOpenChange }: ClipModalProps) => {
  if (!clip) return null;

  const badges = clip.daas_signals?.badge_intelligence?.predicted_badges || (clip.top_badge ? [clip.top_badge] : []);
  const hashtags = clip.daas_signals?.hashtags || [];

  const scoreChips = [
    { label: "Quality", value: `${clip.quality_score}/10`, color: "bg-primary/20 text-primary" },
    { label: "Viral", value: `${clip.viral_score}/10`, color: "bg-accent/20 text-accent" },
    { label: "Watchability", value: `${clip.daas_signals?.watchability_score ?? clip.quality_score}/10`, color: "bg-blue-500/20 text-blue-400" },
    { label: "Cinematic", value: `${clip.daas_signals?.cinematic_score ?? clip.quality_score}/10`, color: "bg-purple-500/20 text-purple-400" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{clip.name}</DialogTitle>
        </DialogHeader>

        <video src={clip.video_url} controls className="w-full rounded-lg aspect-video bg-background" />

        {/* Score strip */}
        <div className="flex gap-2 flex-wrap">
          {scoreChips.map((chip) => (
            <Badge key={chip.label} className={`score-chip ${chip.color} border-0 text-xs px-3 py-1`}>
              {chip.label} {chip.value}
            </Badge>
          ))}
        </div>

        {/* Commentary */}
        <CommentaryTabs commentary={clipCommentary(clip)} />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-2">
            <p className="section-title">Badges</p>
            <div className="flex gap-2 flex-wrap">
              {badges.map((b) => (
                <Badge key={b} className="bg-primary/20 text-primary border-0 px-3 py-1.5">{b}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        <div className="space-y-2">
          <p className="section-title">Brands Detected</p>
          <div className="flex gap-2 flex-wrap">
            <Badge className={`${arcColorMap[clip.story_arc] || "bg-muted"} text-foreground border-0 text-xs`}>{clip.story_arc.replace(/_/g, " ")}</Badge>
            {clip.brands.map((b) => (
              <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="space-y-2">
            <p className="section-title">Hashtags</p>
            <div className="flex gap-2 flex-wrap">
              {hashtags.map((h) => (
                <Badge
                  key={h}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    navigator.clipboard.writeText(h);
                    toast.success("Copied!");
                  }}
                >
                  {h}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Caption */}
        {clip.caption && (
          <div className="space-y-1">
            <p className="section-title">Caption</p>
            <p className="text-sm text-foreground/80 italic leading-relaxed">{clip.caption}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClipModal;

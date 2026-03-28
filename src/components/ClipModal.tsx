import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CommentaryTabs from "./CommentaryTabs";
import { Clip } from "@/data/clips";

interface ClipModalProps {
  clip: Clip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClipModal = ({ clip, open, onOpenChange }: ClipModalProps) => {
  if (!clip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{clip.name}</DialogTitle>
        </DialogHeader>
        <video src={clip.video} controls className="w-full rounded-lg aspect-video bg-background" />
        <div className="flex gap-2 flex-wrap mt-2">
          <Badge className={`${clip.arcColor} text-foreground border-0`}>{clip.arc}</Badge>
          {clip.badges.map((b) => (
            <Badge key={b} variant="outline">{b}</Badge>
          ))}
          {clip.brands.map((b) => (
            <Badge key={b} variant="secondary">{b}</Badge>
          ))}
        </div>
        <div className="flex gap-4 text-sm mt-1">
          <span>Quality: <span className="text-electric font-bold">{clip.quality}/10</span></span>
          <span>Viral: <span className="text-gold font-bold">{clip.viral}/10</span></span>
        </div>
        <CommentaryTabs commentary={clip.commentary} />
      </DialogContent>
    </Dialog>
  );
};

export default ClipModal;

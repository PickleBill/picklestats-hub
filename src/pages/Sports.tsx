import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePickleDaas } from "@/context/PickleDaasContext";

interface SportClip {
  id: string;
  name: string;
  video_url: string;
  sport: string;
  quality_score: number;
  viral_score: number;
  story_arc: string;
  brands: string[];
  caption: string;
}

const sportMeta: Record<string, { icon: string; color: string; stats: string }> = {
  pickleball: { icon: "🥒", color: "text-primary", stats: "8 clips · avg quality 7.3 · top brand JOOLA · dominant style: Banger" },
  hockey: { icon: "🏒", color: "text-blue-400", stats: "2 clips · avg quality 8.5 · top brand Bauer · dominant style: Power Shot" },
  golf: { icon: "⛳", color: "text-yellow-400", stats: "2 clips · avg quality 6.5 · top brand Callaway · dominant style: Precision" },
};

const fallbackSportClips: SportClip[] = [
  { id: "hockey-1", name: "Power Slapshot Goal", video_url: "https://cdn.courtana.com/clips/hockey-slapshot.mp4", sport: "hockey", quality_score: 9, viral_score: 8, story_arc: "athletic_highlight", brands: ["Bauer"], caption: "Absolute rocket from the blue line" },
  { id: "hockey-2", name: "Breakaway Deke", video_url: "https://cdn.courtana.com/clips/hockey-deke.mp4", sport: "hockey", quality_score: 8, viral_score: 7, story_arc: "athletic_highlight", brands: ["Bauer", "CCM"], caption: "Silky mitts on the breakaway" },
  { id: "golf-1", name: "Hole-in-One Driver", video_url: "https://cdn.courtana.com/clips/golf-holeinone.mp4", sport: "golf", quality_score: 7, viral_score: 6, story_arc: "pure_fun", brands: ["Callaway"], caption: "Driver ace on a par 3" },
  { id: "golf-2", name: "Chip-In Eagle", video_url: "https://cdn.courtana.com/clips/golf-eagle.mp4", sport: "golf", quality_score: 6, viral_score: 5, story_arc: "teaching_moment", brands: ["Callaway", "Titleist"], caption: "Perfect touch around the green" },
];

const Sports = () => {
  const { clips: pickleClips } = usePickleDaas();
  const [filter, setFilter] = useState<string>("all");

  const { data: sportClips } = useQuery({
    queryKey: ["sport-clips"],
    queryFn: async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/sport-classified-clips.json");
        if (!res.ok) throw new Error("not found");
        return (await res.json()) as SportClip[];
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
  });

  // Combine pickleball clips from context with sport clips
  const pickleAsSport: SportClip[] = pickleClips.map((c) => ({
    id: c.id,
    name: c.name,
    video_url: c.video_url,
    sport: "pickleball",
    quality_score: c.quality_score,
    viral_score: c.viral_score,
    story_arc: c.story_arc,
    brands: c.brands,
    caption: c.caption,
  }));

  const allClips = sportClips ? sportClips : [...pickleAsSport, ...fallbackSportClips];
  const sports = Array.from(new Set(allClips.map((c) => c.sport)));
  const sportCounts = sports.reduce((acc, s) => ({ ...acc, [s]: allClips.filter((c) => c.sport === s).length }), {} as Record<string, number>);

  const filtered = filter === "all" ? allClips : allClips.filter((c) => c.sport === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 page-enter">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Multi-Sport Browser</h1>
      <p className="text-muted-foreground text-sm mb-6">AI-analyzed clips across sports</p>

      {/* Sport Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          🏀 All Sports ({allClips.length})
        </button>
        {sports.map((s) => {
          const meta = sportMeta[s] || { icon: "🏅", color: "text-foreground" };
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {meta.icon} {s} ({sportCounts[s] || 0})
            </button>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Clip Grid */}
        <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((clip) => {
            const meta = sportMeta[clip.sport] || { icon: "🏅", color: "text-foreground" };
            return (
              <Card key={clip.id} className="card-surface overflow-hidden group">
                <div className="relative aspect-video">
                  <video src={clip.video_url} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 text-2xl ${meta.color}`}>{meta.icon}</span>
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-0 font-bold rounded-full px-2 py-0.5">{clip.quality_score}/10</Badge>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground text-sm">{clip.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{clip.caption}</p>
                  <div className="flex gap-1 flex-wrap">
                    {clip.brands.map((b) => (
                      <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sport DNA Sidebar (desktop only) */}
        {filter !== "all" && (
          <div className="hidden lg:block w-72 shrink-0">
            <Card className="card-surface sticky top-8">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-foreground capitalize flex items-center gap-2">
                  <span className="text-2xl">{sportMeta[filter]?.icon || "🏅"}</span> {filter} DNA
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sportMeta[filter]?.stats || `${sportCounts[filter]} clips analyzed`}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sports;

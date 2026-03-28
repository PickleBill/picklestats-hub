import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePickleDaas } from "@/context/PickleDaasContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const radarKeyMap: Record<string, string> = {
  court_coverage: "Court Coverage",
  kitchen_mastery: "Kitchen Mastery",
  power_game: "Power Game",
  touch_feel: "Touch & Feel",
  athleticism: "Athleticism",
  creativity: "Creativity",
  court_iq: "Court IQ",
};

const arcColors: Record<string, string> = {
  grind_rally: "#3b82f6",
  teaching_moment: "#00E676",
  pure_fun: "#eab308",
  athletic_highlight: "#a855f7",
  error_highlight: "#ef4444",
};

const styleSize: Record<string, string> = {
  banger: "text-xl px-6 py-3",
  "consistent driver": "text-lg px-5 py-2.5",
  baseliner: "text-base px-4 py-2",
  "net rusher": "text-base px-4 py-2",
  "aggressive baseliner": "text-sm px-3 py-1.5",
};

const PlayerDNA = () => {
  const { player, clips } = usePickleDaas();

  const radarData = Object.entries(player.skill_radar).map(([k, v]) => ({
    stat: radarKeyMap[k] || k,
    value: v,
  }));

  const stats = [
    { label: "Rank", value: `#${player.rank} Global` },
    { label: "XP", value: player.xp.toLocaleString() },
    { label: "Level", value: String(player.level) },
    { label: "Tier", value: player.rank_tier },
    { label: "Badges", value: String(player.badges_count) },
  ];

  // Story arc donut
  const arcBreakdown = player.story_arc_breakdown || {};
  const hasArcs = Object.keys(arcBreakdown).length > 0;
  // If no breakdown from player, compute from clips
  const arcData = hasArcs
    ? Object.entries(arcBreakdown).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v, fill: arcColors[k] || "#888" }))
    : (() => {
        const counts: Record<string, number> = {};
        clips.forEach((c) => { counts[c.story_arc] = (counts[c.story_arc] || 0) + 1; });
        return Object.entries(counts).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v, fill: arcColors[k] || "#888" }));
      })();

  return (
    <div className="container py-8 space-y-8">
      {/* Header Card */}
      <Card className="card-surface">
        <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-secondary text-[60px] font-bold text-primary leading-none">
            PB
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">{player.username}</h1>
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
              {stats.map((s) => (
                <span key={s.label} className="text-sm">
                  <span className="text-muted-foreground">{s.label}</span>{" "}
                  <span className="text-primary font-semibold">{s.value}</span>
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Clips Analyzed: {player.clips_analyzed} | Dominant Shot: {player.dominant_shot} | Style: {player.play_style.slice(0, 2).join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Radar + Play Styles */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground">Skill Radar</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(215 30% 22%)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(214 60% 92%)", fontSize: 12 }} />
                <Radar dataKey="value" stroke="hsl(145 100% 45%)" fill="hsl(145 100% 45%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground">Play Style DNA</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3 items-start content-start">
            {player.play_style.map((s) => (
              <Badge key={s} className={`bg-primary/20 text-primary border border-primary/40 font-semibold capitalize ${styleSize[s] || "text-sm px-3 py-1.5"}`}>
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Coaching Insights */}
      <Card className="card-surface" style={{ borderLeft: "3px solid hsl(145 100% 45%)" }}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">🎯 AI Coaching Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {player.coaching_insights.map((note) => (
              <li key={note} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span> {note}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Story Arc Donut */}
      {arcData.length > 0 && (
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground">Story Arc Distribution</CardTitle></CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={arcData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {arcData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(215 40% 12%)", border: "1px solid hsl(215 30% 22%)", borderRadius: 8, color: "hsl(214 60% 92%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 ml-4">
              {arcData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                  <span className="text-foreground/80 capitalize">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signature Clips */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Signature Clips</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {clips.map((clip) => (
            <Card key={clip.id} className="card-surface overflow-hidden">
              <video src={clip.video_url} muted preload="metadata" className="w-full aspect-video object-cover" />
              <CardContent className="pt-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground truncate">{clip.name}</p>
                <div className="flex gap-1">
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px]">{clip.quality_score}/10</Badge>
                  <Badge className={`${
                    { athletic_highlight: "bg-purple-500", grind_rally: "bg-blue-500", teaching_moment: "bg-primary/80", pure_fun: "bg-yellow-500", error_highlight: "bg-destructive" }[clip.story_arc] || "bg-muted"
                  } text-foreground border-0 text-[10px]`}>{clip.story_arc.replace(/_/g, " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerDNA;

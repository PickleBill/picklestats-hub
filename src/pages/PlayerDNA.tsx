import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePickleDaas } from "@/context/PickleDaasContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Brain } from "lucide-react";

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

const styleColors = ["bg-primary", "bg-primary/80", "bg-primary/60", "bg-primary/50", "bg-primary/40"];
const styleSizes = ["text-lg px-5 py-2.5", "text-base px-4 py-2", "text-sm px-3 py-1.5", "text-sm px-3 py-1.5", "text-xs px-2.5 py-1"];

const PlayerDNA = () => {
  const { player, clips } = usePickleDaas();

  const radarData = Object.entries(player.skill_radar).map(([k, v]) => ({
    stat: radarKeyMap[k] || k,
    value: v,
  }));

  const stats = [
    { label: "Rank", value: `#${player.rank}` },
    { label: "XP", value: player.xp.toLocaleString() },
    { label: "Level", value: String(player.level) },
    { label: "Tier", value: player.rank_tier },
    { label: "Badges", value: String(player.badges_count) },
  ];

  const arcBreakdown = player.story_arc_breakdown || {};
  const hasArcs = Object.keys(arcBreakdown).length > 0;
  const arcData = hasArcs
    ? Object.entries(arcBreakdown).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v, fill: arcColors[k] || "#888" }))
    : (() => {
        const counts: Record<string, number> = {};
        clips.forEach((c) => { counts[c.story_arc] = (counts[c.story_arc] || 0) + 1; });
        return Object.entries(counts).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v, fill: arcColors[k] || "#888" }));
      })();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 page-enter">
      {/* Profile Header */}
      <Card className="card-surface overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(217 40% 11%) 0%, hsl(222 47% 6%) 100%)" }}>
        <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-secondary text-4xl font-bold text-primary">
            PB
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{player.username}</h1>
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-muted-foreground">{s.label}</span>
                  <span className="text-primary font-bold text-lg" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
              <Badge className="bg-primary/20 text-primary border-0">🎯 {player.dominant_shot}</Badge>
              <Badge className="bg-primary/20 text-primary border-0">📊 {player.clips_analyzed} clips</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar + Play Styles */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base section-title">Skill Radar</CardTitle></CardHeader>
          <CardContent className="h-80 radar-animate">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(215 30% 22%)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(214 60% 95%)", fontSize: 12 }} />
                <Radar dataKey="value" stroke="hsl(187 100% 42%)" fill="hsl(145 100% 45%)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base section-title">Play Style DNA</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3 items-start content-start">
            {player.play_style.map((s, i) => (
              <Badge
                key={s}
                className={`${styleColors[i] || "bg-primary/30"} text-primary-foreground border-0 font-semibold capitalize ${styleSizes[i] || "text-xs px-2.5 py-1"}`}
              >
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Coaching Insights */}
      <Card className="card-surface" style={{ borderLeft: "4px solid hsl(145 100% 45%)" }}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-base">
            <Brain size={18} className="text-primary" />
            AI Coaching Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {player.coaching_insights.map((note) => (
              <div key={note} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-sm text-foreground/90">{note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Arc Donut */}
      {arcData.length > 0 && (
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base section-title">Story Arc Distribution</CardTitle></CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={arcData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {arcData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(217 40% 11%)", border: "1px solid hsl(145 100% 45% / 0.1)", borderRadius: 8, color: "hsl(214 60% 95%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
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
    </div>
  );
};

export default PlayerDNA;

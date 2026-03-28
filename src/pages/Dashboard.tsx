import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentaryTabs from "@/components/CommentaryTabs";
import { usePickleDaas, type RawClip } from "@/context/PickleDaasContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, PieChart, Pie } from "recharts";
import { Play, Film, Star, Tag, TrendingUp } from "lucide-react";

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

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.round(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  const display = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
  return <>{display}{suffix && <span className="text-sm text-muted-foreground font-normal ml-1">{suffix}</span>}</>;
};

function clipCommentary(clip: RawClip) {
  return {
    espn: clip.commentary?.espn || `${clip.name}: ${clip.caption}`,
    hype: clip.commentary?.hype || clip.caption.toUpperCase() + " 🔥🔥🔥",
    ronBurgundy: clip.commentary?.ron_burgundy || clip.ron_burgundy_quote,
    chuckNorris: clip.commentary?.chuck_norris || "Chuck Norris once played this rally. The ball is still in orbit.",
    coach: clip.commentary?.coach || clip.daas_signals?.coaching_breakdown || "",
  };
}

const Dashboard = () => {
  const { dashboard, clips, player } = usePickleDaas();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const featured = clips.find((c) => c.id === "ce00696b") || clips[0];

  const kpiIcons = [Film, Star, Tag, TrendingUp];
  const kpis = [
    { label: "Clips Analyzed", value: dashboard.kpis.clips_analyzed, isInt: true, sub: "" },
    { label: "Avg Quality", value: dashboard.kpis.avg_quality_score, isInt: false, sub: "/ 10" },
    { label: "Top Brand", value: 0, isInt: true, sub: "", text: dashboard.kpis.top_brand },
    { label: "Viral Potential", value: dashboard.kpis.avg_viral_score, isInt: false, sub: "avg" },
  ];

  const radarData = Object.entries(dashboard.analytics.skill_radar).length > 0
    ? Object.entries(dashboard.analytics.skill_radar).map(([k, v]) => ({ stat: radarKeyMap[k] || k, value: v }))
    : Object.entries(player.skill_radar).map(([k, v]) => ({ stat: radarKeyMap[k] || k, value: v }));

  const brandData = dashboard.analytics.top_brands.map((b) => ({ name: b.brand, count: b.count }));

  const arcBreakdown = dashboard.analytics.story_arc_breakdown || {};
  const arcData = Object.entries(arcBreakdown).map(([k, v]) => ({
    name: k.replace(/_/g, " "),
    value: v,
    fill: arcColors[k] || "#888",
  }));

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  const scoreChips = featured ? [
    { label: "Quality", value: `${featured.quality_score}/10`, color: "bg-primary/20 text-primary" },
    { label: "Viral", value: `${featured.viral_score}/10`, color: "bg-accent/20 text-accent" },
    { label: "Watchability", value: `${featured.daas_signals?.watchability_score ?? featured.quality_score}/10`, color: "bg-cyan/20 text-cyan" },
    { label: "Cinematic", value: `${featured.daas_signals?.cinematic_score ?? featured.quality_score}/10`, color: "bg-purple-500/20 text-purple-400" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 page-enter">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = kpiIcons[i];
          return (
            <Card key={k.label} className="card-surface glow-green p-6">
              <CardContent className="p-0">
                <Icon size={18} className="text-primary mb-2" />
                <p className="kpi-number mt-1">
                  {k.text ? k.text : <CountUp target={k.value} suffix={k.sub} />}
                </p>
                <p className="text-[10px] font-semibold tracking-[0.05em] uppercase text-muted-foreground mt-1">{k.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Highlight */}
      {featured && (
        <Card className="card-surface overflow-hidden">
          <CardContent className="p-0 flex flex-col lg:flex-row">
            <div className="lg:w-[60%]">
              <div className="relative aspect-video cursor-pointer" onClick={handleVideoClick}>
                <video
                  ref={videoRef}
                  src={featured.video_url}
                  className="w-full h-full object-cover"
                  onEnded={() => setVideoPlaying(false)}
                />
                {/* Courtana watermark */}
                <img
                  src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg"
                  alt=""
                  className="absolute top-4 left-4 h-6 opacity-20 pointer-events-none"
                />
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-sm font-semibold text-foreground">{featured.name}</p>
                  <div className="flex gap-2 mt-1">
                    {scoreChips.map((chip) => (
                      <Badge key={chip.label} className={`score-chip ${chip.color} border-0 text-[10px] px-2 py-0.5`}>
                        {chip.label} {chip.value}
                      </Badge>
                    ))}
                  </div>
                </div>
                {!videoPlaying && (
                  <div className="video-play-overlay">
                    <div className="play-circle">
                      <Play size={28} fill="white" color="white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-[40%] p-6">
              <CommentaryTabs commentary={clipCommentary(featured)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base section-title">Skill Radar</CardTitle></CardHeader>
          <CardContent className="h-72 radar-animate">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(215 30% 22%)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="hsl(187 100% 42%)" fill="hsl(145 100% 45%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {arcData.length > 0 ? (
          <Card className="card-surface">
            <CardHeader><CardTitle className="text-foreground text-base section-title">Story Arc Distribution</CardTitle></CardHeader>
            <CardContent className="h-72 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={arcData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2}>
                    {arcData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
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
        ) : (
          <Card className="card-surface">
            <CardHeader><CardTitle className="text-foreground text-base section-title">Brand Frequency</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} width={150} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {brandData.map((_, i) => (
                      <Cell key={i} fill="hsl(145 100% 45%)" className="slide-in" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Brand Frequency (always show if we have arc data above) */}
      {arcData.length > 0 && brandData.length > 0 && (
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base section-title">Brand Frequency</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} width={150} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {brandData.map((_, i) => (
                    <Cell key={i} fill="hsl(145 100% 45%)" className="slide-in" style={{ animationDelay: `${i * 200}ms` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

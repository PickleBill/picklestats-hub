import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentaryTabs from "@/components/CommentaryTabs";
import { usePickleDaas, type RawClip } from "@/context/PickleDaasContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { Play } from "lucide-react";

const radarKeyMap: Record<string, string> = {
  court_coverage: "Court Coverage",
  kitchen_mastery: "Kitchen Mastery",
  power_game: "Power Game",
  touch_feel: "Touch & Feel",
  athleticism: "Athleticism",
  creativity: "Creativity",
  court_iq: "Court IQ",
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
    { label: "Watchability", value: `${featured.daas_signals?.watchability_score ?? featured.quality_score}/10`, color: "bg-blue-500/20 text-blue-400" },
    { label: "Cinematic", value: `${featured.daas_signals?.cinematic_score ?? featured.quality_score}/10`, color: "bg-purple-500/20 text-purple-400" },
  ] : [];

  return (
    <div className="container py-8 space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="card-surface glow-green">
            <CardContent className="pt-6">
              <p className="section-title">{k.label}</p>
              <p className="kpi-number mt-1">
                {k.text ? k.text : <CountUp target={k.value} suffix={k.sub} />}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Highlight */}
      {featured && (
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-foreground">Featured Highlight</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[60%] space-y-3">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-background cursor-pointer" onClick={handleVideoClick}>
                <video
                  ref={videoRef}
                  src={featured.video_url}
                  className="w-full h-full object-cover"
                  onEnded={() => setVideoPlaying(false)}
                />
                {!videoPlaying && (
                  <div className="video-play-overlay">
                    <div className="play-circle">
                      <Play size={28} fill="white" color="white" />
                    </div>
                  </div>
                )}
              </div>
              {/* Score strip */}
              <div className="flex gap-2 flex-wrap">
                {scoreChips.map((chip) => (
                  <Badge key={chip.label} className={`score-chip ${chip.color} border-0 text-xs px-3 py-1`}>
                    {chip.label} {chip.value}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="lg:w-[40%]">
              <CommentaryTabs commentary={clipCommentary(featured)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Radar + Brand Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base">Player Radar</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(215 30% 22%)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(214 60% 92%)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="hsl(145 100% 45%)" fill="hsl(145 100% 45%)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-surface">
          <CardHeader><CardTitle className="text-foreground text-base">Brand Frequency</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fill: "hsl(214 60% 92%)", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "hsl(214 60% 92%)", fontSize: 11 }} width={150} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {brandData.map((_, i) => (
                    <Cell key={i} fill="hsl(145 100% 45%)" className="slide-in" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import CommentaryTabs from "@/components/CommentaryTabs";
import { usePickleDaas, type RawClip } from "@/context/PickleDaasContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, PieChart, Pie } from "recharts";
import { Play, Pause, Film, Star, Tag, TrendingUp, Monitor, BarChart3 } from "lucide-react";

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
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setVal(eased * target);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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

/* ─── Broadcast Mode ─── */
const BroadcastMode = ({ clips, initialClip }: { clips: RawClip[]; initialClip: RawClip }) => {
  const [active, setActive] = useState(initialClip);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const filmstripRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setActive(initialClip); }, [initialClip]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
      const idx = clips.findIndex((c) => c.id === active.id);
      if (e.key === "ArrowRight" && idx < clips.length - 1) setActive(clips[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setActive(clips[idx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  // Scroll filmstrip to center active
  useEffect(() => {
    const el = filmstripRef.current?.querySelector(`[data-id="${active.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline:1 === 1 ? "center" : "center", block: "nearest" });
  }, [active.id]);

  const ticker = `PICKLE DaaS LIVE • ${active.name} • Quality: ${active.quality_score}/10 • ${active.brands.join(", ")} • Powered by Courtana AI • `;

  return (
    <div className="space-y-0">
      {/* Hero video */}
      <div className="flex flex-col lg:flex-row gap-0">
        <div className="lg:w-[70%]">
          <div className="relative cursor-pointer rounded-xl overflow-hidden" style={{ height: "70vh" }} onClick={togglePlay}>
            <video
              ref={videoRef}
              src={active.video_url}
              className="w-full h-full object-cover"
              onEnded={() => setPlaying(false)}
            />
            <img src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg" alt="" className="absolute top-4 left-4 h-6 opacity-20 pointer-events-none" />
            {!playing && (
              <div className="video-play-overlay">
                <div className="play-circle"><Play size={32} fill="white" color="white" /></div>
              </div>
            )}
            {/* Live badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-destructive/90 px-2 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:w-[30%] bg-card p-4 space-y-4 lg:rounded-r-xl border-l border-border overflow-y-auto" style={{ maxHeight: "70vh" }}>
          {/* Live stats */}
          <div className="bg-background rounded-lg p-3 font-mono text-xs text-primary glow-green space-y-1">
            <p>Quality: {active.quality_score}/10 | Viral: {active.viral_score}/10</p>
            <p>Arc: {active.story_arc.replace(/_/g, " ")}</p>
            <p>Brands: {active.brands.join(", ")}</p>
            {active.daas_signals?.watchability_score && <p>Watch: {active.daas_signals.watchability_score}/10 | Cine: {active.daas_signals.cinematic_score}/10</p>}
          </div>
          {/* Commentary */}
          <CommentaryTabs commentary={clipCommentary(active)} clipName={active.name} />
        </div>
      </div>

      {/* Filmstrip */}
      <div ref={filmstripRef} className="flex gap-2 overflow-x-auto py-3 px-1 scrollbar-hide">
        {clips.map((c) => (
          <button
            key={c.id}
            data-id={c.id}
            onClick={() => { setActive(c); setPlaying(false); }}
            className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              c.id === active.id ? "border-primary glow-green" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <video src={c.video_url} muted preload="metadata" className="h-16 w-28 object-cover pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Bottom ticker[marquee] */}
      <div className="bg-background border-t border-border overflow-hidden h-10 flex items-center">
        <div className="animate-marquee whitespace-nowrap font-mono text-xs text-primary">
          {ticker.repeat(4)}
        </div>
      </div>
    </div>
  );
};

/* ─── Standard Dashboard ─── */
const StandardDashboard = ({ kpis, kpiIcons, featured, scoreChips, radarData, arcData, brandData, handleVideoClick, videoRef, videoPlaying }: any) => (
  <>
    {/* KPIs */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((k: any, i: number) => {
        const Icon = kpiIcons[i];
        return (
          <Card key={k.label} className="card-surface glow-green p-6">
            <CardContent className="p-0">
              <Icon size={18} className="text-primary mb-2" />
              <p className="kpi-number mt-1">{k.text ? k.text : <CountUp target={k.value} suffix={k.sub} />}</p>
              <p className="text-[10px] font-semibold tracking-[0.05em] uppercase text-muted-foreground mt-1">{k.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Featured */}
    {featured && (
      <Card className="card-surface overflow-hidden">
        <CardContent className="p-0 flex flex-col lg:flex-row">
          <div className="lg:w-[60%]">
            <div className="relative aspect-video cursor-pointer" onClick={handleVideoClick}>
              <video ref={videoRef} src={featured.video_url} className="w-full h-full object-cover" onEnded={() => {}} />
              <img src="https://cdn.courtana.com/assets/logos/fulllogo-dark-transparent-grad.svg" alt="" className="absolute top-4 left-4 h-6 opacity-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-sm font-semibold text-foreground">{featured.name}</p>
                <div className="flex gap-2 mt-1">
                  {scoreChips.map((chip: any) => (
                    <Badge key={chip.label} className={`score-chip ${chip.color} border-0 text-[10px] px-2 py-0.5`}>{chip.label} {chip.value}</Badge>
                  ))}
                </div>
              </div>
              {!videoPlaying && (
                <div className="video-play-overlay"><div className="play-circle"><Play size={28} fill="white" color="white" /></div></div>
              )}
            </div>
          </div>
          <div className="lg:w-[40%] p-6">
            <CommentaryTabs commentary={clipCommentary(featured)} clipName={featured.name} />
          </div>
        </CardContent>
      </Card>
    )}

    {/* Charts */}
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
              <PieChart><Pie data={arcData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2}>{arcData.map((e: any, i: number) => <Cell key={i} fill={e.fill} />)}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {arcData.map((d: any) => (
                <div key={d.name} className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full" style={{ background: d.fill }} /><span className="text-foreground/80 capitalize">{d.name} ({d.value})</span></div>
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
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>{brandData.map((_: any, i: number) => <Cell key={i} fill="hsl(145 100% 45%)" className="slide-in" />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>

    {arcData.length > 0 && brandData.length > 0 && (
      <Card className="card-surface">
        <CardHeader><CardTitle className="text-foreground text-base section-title">Brand Frequency</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(214 60% 95%)", fontSize: 11 }} width={150} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>{brandData.map((_: any, i: number) => <Cell key={i} fill="hsl(145 100% 45%)" className="slide-in" style={{ animationDelay: `${i * 200}ms` }} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )}
  </>
);

/* ─── Main Dashboard ─── */
const Dashboard = () => {
  const { dashboard, clips, player } = usePickleDaas();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);

  const featured = clips.find((c) => c.id === "ce00696b") || clips[0];

  // Keyboard: B toggles broadcast
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "b" || e.key === "B") setBroadcastMode((p) => !p);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const kpiIcons = [Film, Star, Tag, TrendingUp];
  const kpis = [
    { label: "Clips Analyzed", value: dashboard.kpis.clips_analyzed, isInt: true, sub: "" },
    { label: "Avg Quality", value: dashboard.kpis.avg_quality_score, isInt: false, sub: "/ 10" },
    { label: "Top Brand", value: 0, isInt: true, sub: "", text: dashboard.kpis.top_brand },
    { label: "Viral Potential", value: dashboard.kpis.avg_viral_score, isInt: false, sub: "avg" },
  ];

  const radarData = useMemo(() => {
    const src = Object.entries(dashboard.analytics.skill_radar).length > 0 ? dashboard.analytics.skill_radar : player.skill_radar;
    return Object.entries(src).map(([k, v]) => ({ stat: radarKeyMap[k] || k, value: v }));
  }, [dashboard.analytics.skill_radar, player.skill_radar]);

  const brandData = useMemo(() => dashboard.analytics.top_brands.map((b) => ({ name: b.brand, count: b.count })), [dashboard.analytics.top_brands]);

  const arcData = useMemo(() => {
    const arcBreakdown = dashboard.analytics.story_arc_breakdown || {};
    return Object.entries(arcBreakdown).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v, fill: arcColors[k] || "#888" }));
  }, [dashboard.analytics.story_arc_breakdown]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false); }
    else { videoRef.current.play(); setVideoPlaying(true); }
  };

  const scoreChips = featured ? [
    { label: "Quality", value: `${featured.quality_score}/10`, color: "bg-primary/20 text-primary" },
    { label: "Viral", value: `${featured.viral_score}/10`, color: "bg-accent/20 text-accent" },
    { label: "Watchability", value: `${featured.daas_signals?.watchability_score ?? featured.quality_score}/10`, color: "bg-cyan/20 text-cyan" },
    { label: "Cinematic", value: `${featured.daas_signals?.cinematic_score ?? featured.quality_score}/10`, color: "bg-purple-500/20 text-purple-400" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 page-enter">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {broadcastMode ? <><Monitor size={22} className="inline text-primary mr-2" />Broadcast Mode</> : <><BarChart3 size={22} className="inline text-primary mr-2" />Dashboard</>}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Standard</span>
          <Switch checked={broadcastMode} onCheckedChange={setBroadcastMode} />
          <span className="text-xs text-muted-foreground">Broadcast</span>
        </div>
      </div>

      {broadcastMode && featured ? (
        <BroadcastMode clips={clips} initialClip={featured} />
      ) : (
        <StandardDashboard
          kpis={kpis}
          kpiIcons={kpiIcons}
          featured={featured}
          scoreChips={scoreChips}
          radarData={radarData}
          arcData={arcData}
          brandData={brandData}
          handleVideoClick={handleVideoClick}
          videoRef={videoRef}
          videoPlaying={videoPlaying}
        />
      )}
    </div>
  );
};

export default Dashboard;

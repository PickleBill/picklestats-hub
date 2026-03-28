import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentaryTabs from "@/components/CommentaryTabs";
import { featuredClip, radarData, brandData } from "@/data/clips";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

const kpis = [
  { label: "Clips Analyzed", value: "6", sub: "" },
  { label: "Avg Quality", value: "7.3", sub: "/ 10" },
  { label: "Top Brand", value: "JOOLA", sub: "" },
  { label: "Viral Potential", value: "6.2", sub: "avg" },
];

const Dashboard = () => (
  <div className="container py-8 space-y-8">
    {/* KPI Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <Card key={k.label} className="card-surface glow-green">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{k.label}</p>
            <p className="text-3xl font-bold text-electric mt-1">
              {k.value} <span className="text-sm text-muted-foreground font-normal">{k.sub}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Featured Highlight */}
    <Card className="card-surface">
      <CardHeader>
        <CardTitle className="text-foreground">Featured Highlight</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[60%]">
          <video
            src={featuredClip.video}
            controls
            className="w-full rounded-lg aspect-video bg-background"
          />
        </div>
        <div className="lg:w-[40%]">
          <CommentaryTabs commentary={featuredClip.commentary} />
        </div>
      </CardContent>
    </Card>

    {/* Bottom Charts */}
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Player Radar</CardTitle>
        </CardHeader>
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
        <CardHeader>
          <CardTitle className="text-foreground text-base">Brand Frequency</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: "hsl(214 60% 92%)", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(214 60% 92%)", fontSize: 11 }} width={150} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {brandData.map((_, i) => (
                  <Cell key={i} fill="hsl(145 100% 45%)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;

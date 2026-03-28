import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { radarData, clips } from "@/data/clips";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Rank", value: "#1 Global" },
  { label: "XP", value: "283,950" },
  { label: "Level", value: "17" },
  { label: "Tier", value: "Gold III" },
  { label: "Badges", value: "82" },
];

const styles = ["banger", "consistent driver", "baseliner", "net rusher", "aggressive baseliner"];

const coachingNotes = [
  "Incorporate more soft game",
  "Approach the net more often",
  "Transition speed needs work",
  "Keep paddle in ready position",
  "Stabilize before contact on volleys",
];

const PlayerDNA = () => (
  <div className="container py-8 space-y-8">
    {/* Header */}
    <Card className="card-surface">
      <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center bg-secondary text-3xl font-bold text-electric">
          PB
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-foreground">PickleBill</h1>
          <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
            {stats.map((s) => (
              <span key={s.label} className="text-sm">
                <span className="text-muted-foreground">{s.label}</span>{" "}
                <span className="text-electric font-semibold">{s.value}</span>
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Clips Analyzed: 3 | Dominant Shot: Drive | Style: Banger, Net Rusher
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Radar + Styles */}
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
        <CardHeader><CardTitle className="text-foreground">Play Style</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3 items-start">
          {styles.map((s) => (
            <Badge key={s} className="text-sm px-4 py-2 bg-primary/20 text-electric border border-primary/40">
              {s}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Coaching Notes */}
    <Card className="card-surface border-l-4 border-l-primary">
      <CardHeader><CardTitle className="text-foreground">AI Coaching Insights</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {coachingNotes.map((note) => (
            <li key={note} className="text-sm text-foreground/80 flex items-start gap-2">
              <span className="text-electric mt-0.5">▸</span> {note}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {/* Signature Clips */}
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Signature Clips</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <Card key={clip.id} className="card-surface overflow-hidden">
            <video src={clip.video} muted className="w-full aspect-video object-cover" />
            <CardContent className="pt-3">
              <p className="text-sm font-semibold text-foreground">{clip.name}</p>
              <p className="text-xs text-electric">{clip.quality}/10</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default PlayerDNA;

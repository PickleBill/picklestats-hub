import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePickleDaas } from "@/context/PickleDaasContext";
import { toast } from "sonner";

const brandEmoji: Record<string, string> = {
  JOOLA: "🎾",
  "LIFE TIME PICKLEBALL": "🏟️",
  CRBN: "🏓",
};

const Brands = () => {
  const { brands, clips } = usePickleDaas();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 page-enter">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Brand Detection Registry</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-detected brands across 8 analyzed highlights · Powered by Gemini Vision</p>
      </div>

      {/* Brand Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {brands.brands.map((brand) => {
          const pct = brand.presence_percentage;
          return (
            <Card key={brand.brand_name} className="card-surface glow-green p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{brandEmoji[brand.brand_name] || "📦"}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{brand.brand_name}</h3>
                    <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-muted-foreground">{brand.category}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>{brand.appearances}</p>
                  <p className="text-[10px] font-semibold tracking-[0.05em] uppercase text-muted-foreground mt-1">Appearances</p>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bar-fill bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{pct}% presence</span>
                  <Badge className="bg-primary/20 text-primary border-primary/40 text-[10px]">{brand.confidence}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sponsorship ROI Callout */}
      <Card className="card-surface" style={{ borderLeft: "4px solid hsl(48 100% 50%)" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-accent">💡 Sponsorship ROI</CardTitle>
          <Badge className="bg-accent/10 text-accent border-0 text-[10px]">AI Generated</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/90 leading-relaxed text-sm">
            {brands.sponsorship_insight || "JOOLA and LIFE TIME PICKLEBALL have 100% presence across all 8 analyzed clips. Courtana can tell brands exactly how many seconds their equipment appears per clip — turning every highlight into a measurable sponsorship asset."}
          </p>
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10"
            onClick={() => toast.info("Coming soon — full PDF report")}
          >
            Download Sponsor Report
          </Button>
        </CardContent>
      </Card>

      {/* Brand Detection Heatmap */}
      <Card className="card-surface overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-foreground text-base section-title">Brand Detection Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground py-2 pr-4 font-medium text-xs">Clip</th>
                {brands.brands.map((b) => (
                  <th key={b.brand_name} className="text-center text-muted-foreground py-2 px-3 font-medium text-xs">{b.brand_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clips.map((clip) => (
                <tr key={clip.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-2 pr-4 text-foreground/80 text-xs truncate max-w-[200px]">{clip.name}</td>
                  {brands.brands.map((b) => (
                    <td key={b.brand_name} className="text-center py-2 px-3">
                      {clip.brands.includes(b.brand_name) ? (
                        <span className="text-primary text-lg">●</span>
                      ) : (
                        <span className="text-muted-foreground/20">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Brands;

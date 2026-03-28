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

const barColors: Record<string, string> = {
  JOOLA: "hsl(145 100% 45%)",
  "LIFE TIME PICKLEBALL": "hsl(48 100% 50%)",
  CRBN: "hsl(145 100% 45%)",
};

const Brands = () => {
  const { brands, clips } = usePickleDaas();

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Brand Detection Registry</h1>
        <p className="text-muted-foreground mt-1">AI-detected brands across 8 analyzed highlights · Powered by Gemini Vision</p>
      </div>

      {/* 3 Brand Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {brands.brands.map((brand) => {
          const pct = brand.presence_percentage;
          return (
            <Card key={brand.brand_name} className="card-surface glow-green">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-3">
                  <span className="text-3xl">{brandEmoji[brand.brand_name] || "📦"}</span>
                  {brand.brand_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Appearances</span>
                  <span className="text-primary font-bold text-2xl">{brand.appearances}/8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-foreground">{brand.category}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Confidence</span>
                  <Badge className="bg-primary/20 text-primary border-primary/40">{brand.confidence}</Badge>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 slide-in"
                    style={{ width: `${pct}%`, background: barColors[brand.brand_name] || "hsl(145 100% 45%)" }}
                  />
                </div>
                {/* Clip dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < brand.appearances ? "bg-primary" : "bg-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {brand.roi_insight || `${brandEmoji[brand.brand_name] || "📦"} ${brand.category} — ${pct}% visibility across all clips`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Brand Detection Heatmap */}
      <Card className="card-surface overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-foreground text-base">Brand Detection Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground py-2 pr-4 font-medium">Clip</th>
                {brands.brands.map((b) => (
                  <th key={b.brand_name} className="text-center text-muted-foreground py-2 px-3 font-medium text-xs">{b.brand_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clips.map((clip) => (
                <tr key={clip.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-foreground/80 text-xs truncate max-w-[200px]">{clip.name}</td>
                  {brands.brands.map((b) => (
                    <td key={b.brand_name} className="text-center py-2 px-3">
                      {clip.brands.includes(b.brand_name) ? (
                        <span className="text-primary text-lg">●</span>
                      ) : (
                        <span className="text-muted-foreground/30">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Sponsorship ROI Callout */}
      <Card className="card-surface" style={{ border: "1px solid hsl(48 100% 50%)" }}>
        <CardHeader>
          <CardTitle className="text-accent">💡 Sponsorship ROI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/90 leading-relaxed">
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
    </div>
  );
};

export default Brands;

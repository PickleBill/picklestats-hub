import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const brands = [
  {
    name: "JOOLA",
    appearances: 3,
    category: "Paddle",
    clips: ["Clip 1", "Clip 2", "Clip 3"],
    confidence: "High",
    icon: "🏓",
  },
  {
    name: "LIFE TIME PICKLEBALL",
    appearances: 3,
    category: "Venue / Apparel",
    clips: ["Clip 1", "Clip 2", "Clip 3"],
    confidence: "High",
    icon: "🏟️",
  },
];

const Brands = () => (
  <div className="container py-8 space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Brand Detection Registry</h1>
      <p className="text-muted-foreground mt-1">AI-detected brands across all analyzed highlights</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {brands.map((brand) => (
        <Card key={brand.name} className="card-surface glow-green">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-3">
              <span className="text-3xl">{brand.icon}</span>
              {brand.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Appearances</span>
                <p className="text-2xl font-bold text-electric">{brand.appearances}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="text-foreground font-medium">{brand.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence</span>
                <Badge className="bg-primary/20 text-electric border-primary/40 mt-1">{brand.confidence}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Detected In</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {brand.clips.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Sponsorship Insight */}
    <Card className="card-surface border-2 border-gold">
      <CardHeader>
        <CardTitle className="text-gold">💡 Sponsorship Insight</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed">
          These 2 brands have <span className="text-electric font-bold">100% presence</span> across all analyzed clips.
          This data powers sponsorship ROI measurement — Courtana can tell brands exactly how often their equipment
          appears in player highlights.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default Brands;

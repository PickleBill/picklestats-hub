import { useQuery } from "@tanstack/react-query";
import { clips as fallbackClips, featuredClip as fallbackFeatured, type Clip } from "@/data/clips";

const CLIPS_URL =
  "https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/lovable-package/clips-metadata.json";

const arcColorMap: Record<string, string> = {
  athletic_highlight: "bg-amber-500",
  grind_rally: "bg-primary",
  teaching_moment: "bg-blue-500",
  pure_fun: "bg-cyan-500",
  error_highlight: "bg-destructive",
};

interface RawClip {
  id: string;
  name: string;
  video_url: string;
  quality_score: number;
  viral_score: number;
  story_arc: string;
  ron_burgundy_quote: string;
  top_badge: string | null;
  brands: string[];
  caption: string;
}

const mapRaw = (r: RawClip): Clip => ({
  id: r.id,
  name: r.name,
  video: r.video_url,
  quality: r.quality_score,
  viral: r.viral_score,
  arc: r.story_arc,
  arcColor: arcColorMap[r.story_arc] || "bg-muted",
  brands: r.brands,
  badges: r.top_badge ? [r.top_badge] : [],
  commentary: {
    espn: `${r.name}: ${r.caption}`,
    hype: r.caption.toUpperCase() + " 🔥🔥🔥",
    ronBurgundy: r.ron_burgundy_quote,
    chuckNorris: `Chuck Norris once played this rally. The ball is still in orbit.`,
  },
});

export const useClips = () =>
  useQuery({
    queryKey: ["clips-github"],
    queryFn: async () => {
      const res = await fetch(CLIPS_URL);
      if (!res.ok) throw new Error("Failed to fetch clips");
      const raw: RawClip[] = await res.json();
      return raw.map(mapRaw);
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackClips,
  });

export const useFeaturedClip = () => {
  const { data: clips } = useClips();
  const featured = clips?.find((c) => c.id === "ce00696b");
  return featured
    ? { video: featured.video, commentary: featured.commentary }
    : fallbackFeatured;
};

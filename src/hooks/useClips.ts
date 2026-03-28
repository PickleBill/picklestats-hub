import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clips as fallbackClips, featuredClip as fallbackFeatured, type Clip } from "@/data/clips";

interface DbAnalysis {
  id: string;
  clip_url: string;
  name: string;
  quality_score: number;
  viral_score: number;
  arc_type: string;
  arc_color: string;
  brands_detected: string[];
  badges: string[];
  commentary: {
    espn: string;
    hype: string;
    ronBurgundy: string;
    chuckNorris: string;
  };
}

const mapToClip = (row: DbAnalysis): Clip => ({
  id: row.id,
  name: row.name,
  video: row.clip_url,
  quality: Number(row.quality_score),
  viral: Number(row.viral_score),
  arc: row.arc_type,
  arcColor: row.arc_color,
  brands: row.brands_detected as string[],
  badges: row.badges as string[],
  commentary: row.commentary as Clip["commentary"],
});

export const useClips = () =>
  useQuery({
    queryKey: ["clips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pickle_daas_analyses")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return fallbackClips;
      return (data as unknown as DbAnalysis[]).map(mapToClip);
    },
  });

export const useFeaturedClip = () => {
  const { data: clips } = useClips();
  return clips?.[0]
    ? { video: clips[0].video, commentary: clips[0].commentary }
    : fallbackFeatured;
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  name: string;
  appearances: number;
  category: string;
  clips: string[];
  confidence: string;
  icon: string;
  logo_url?: string | null;
}

const fallbackBrands: Brand[] = [
  { name: "JOOLA", appearances: 3, category: "Paddle", clips: ["Clip 1", "Clip 2", "Clip 3"], confidence: "High", icon: "🏓" },
  { name: "LIFE TIME PICKLEBALL", appearances: 3, category: "Venue / Apparel", clips: ["Clip 1", "Clip 2", "Clip 3"], confidence: "High", icon: "🏟️" },
];

export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pickle_daas_brands")
        .select("*")
        .order("appearance_count", { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return fallbackBrands;
      return data.map((b) => ({
        name: b.brand_name,
        appearances: b.appearance_count,
        category: b.category,
        clips: b.detected_in_clips as string[],
        confidence: b.confidence,
        icon: b.icon,
        logo_url: b.logo_url,
      })) as Brand[];
    },
  });

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlayerDNA {
  username: string;
  rank_label: string;
  xp: number;
  level: number;
  tier: string;
  badge_count: number;
  dominant_shot: string;
  radar_stats: { stat: string; value: number }[];
  play_styles: string[];
  coaching_notes: string[];
}

const fallback: PlayerDNA = {
  username: "PickleBill",
  rank_label: "#1 Global",
  xp: 283950,
  level: 17,
  tier: "Gold III",
  badge_count: 82,
  dominant_shot: "Drive",
  radar_stats: [
    { stat: "Court Coverage", value: 6.0 },
    { stat: "Kitchen Mastery", value: 5.0 },
    { stat: "Power Game", value: 6.0 },
    { stat: "Touch & Feel", value: 5.3 },
    { stat: "Athleticism", value: 6.3 },
    { stat: "Creativity", value: 4.0 },
    { stat: "Court IQ", value: 5.7 },
  ],
  play_styles: ["banger", "consistent driver", "baseliner", "net rusher", "aggressive baseliner"],
  coaching_notes: [
    "Incorporate more soft game",
    "Approach the net more often",
    "Transition speed needs work",
    "Keep paddle in ready position",
    "Stabilize before contact on volleys",
  ],
};

export const usePlayerDNA = () =>
  useQuery({
    queryKey: ["playerDNA"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pickle_daas_player_dna")
        .select("*")
        .eq("username", "PickleBill")
        .maybeSingle();

      if (error) throw error;
      if (!data) return fallback;
      return {
        username: data.username,
        rank_label: data.rank_label,
        xp: data.xp,
        level: data.level,
        tier: data.tier,
        badge_count: data.badge_count,
        dominant_shot: data.dominant_shot,
        radar_stats: data.radar_stats as PlayerDNA["radar_stats"],
        play_styles: data.play_styles as string[],
        coaching_notes: data.coaching_notes as string[],
      } as PlayerDNA;
    },
  });

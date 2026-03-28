import { useQuery } from "@tanstack/react-query";

const PLAYER_URL =
  "https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/lovable-package/player-dna.json";

interface PlayerDNA {
  username: string;
  rank_label: string;
  xp: number;
  level: number;
  tier: string;
  badge_count: number;
  dominant_shot: string;
  clips_analyzed: number;
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
  clips_analyzed: 8,
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
    "Incorporate more soft game and dinking at the kitchen",
    "Approach the net more often after third shot drops",
    "Transition speed from baseline to kitchen needs work",
    "Keep paddle in ready position between shots",
    "Stabilize before contact on volleys for more consistency",
  ],
};

interface RawPlayer {
  username: string;
  rank: number;
  xp: number;
  level: number;
  rank_tier: string;
  badges_count: number;
  clips_analyzed: number;
  dominant_shot: string;
  play_style: string[];
  skill_radar: Record<string, number>;
  coaching_insights: string[];
}

const radarKeyMap: Record<string, string> = {
  court_coverage: "Court Coverage",
  kitchen_mastery: "Kitchen Mastery",
  power_game: "Power Game",
  touch_feel: "Touch & Feel",
  athleticism: "Athleticism",
  creativity: "Creativity",
  court_iq: "Court IQ",
};

export const usePlayerDNA = () =>
  useQuery({
    queryKey: ["playerDNA-github"],
    queryFn: async () => {
      const res = await fetch(PLAYER_URL);
      if (!res.ok) throw new Error("Failed to fetch player DNA");
      const r: RawPlayer = await res.json();
      return {
        username: r.username,
        rank_label: `#${r.rank} Global`,
        xp: r.xp,
        level: r.level,
        tier: r.rank_tier,
        badge_count: r.badges_count,
        dominant_shot: r.dominant_shot,
        clips_analyzed: r.clips_analyzed,
        radar_stats: Object.entries(r.skill_radar).map(([k, v]) => ({
          stat: radarKeyMap[k] || k,
          value: v,
        })),
        play_styles: r.play_style,
        coaching_notes: r.coaching_insights,
      } as PlayerDNA;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallback,
  });

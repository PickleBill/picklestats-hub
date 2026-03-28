import { useQuery } from "@tanstack/react-query";

const DASHBOARD_URL =
  "https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/lovable-package/dashboard-data.json";

interface DashboardData {
  kpis: {
    clips_analyzed: number;
    avg_quality_score: number;
    top_brand: string;
    avg_viral_score: number;
  };
  analytics: {
    top_brands: { brand: string; count: number }[];
    skill_radar: Record<string, number>;
    story_arc_breakdown: Record<string, number>;
  };
}

const fallback: DashboardData = {
  kpis: { clips_analyzed: 8, avg_quality_score: 7.3, top_brand: "JOOLA", avg_viral_score: 5.5 },
  analytics: {
    top_brands: [
      { brand: "JOOLA", count: 8 },
      { brand: "LIFE TIME PICKLEBALL", count: 8 },
      { brand: "CRBN", count: 2 },
    ],
    skill_radar: {},
    story_arc_breakdown: {},
  },
};

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard-github"],
    queryFn: async () => {
      const res = await fetch(DASHBOARD_URL);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const raw = await res.json();
      return raw as DashboardData;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallback,
  });

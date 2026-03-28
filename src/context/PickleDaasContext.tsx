import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

const BASE = "https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/lovable-package";

export interface RawClip {
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
  commentary?: {
    espn?: string;
    hype?: string;
    ron_burgundy?: string;
    chuck_norris?: string;
    coach?: string;
  };
  daas_signals?: {
    coaching_breakdown?: string;
    badge_intelligence?: { predicted_badges?: string[] };
    hashtags?: string[];
    watchability_score?: number;
    cinematic_score?: number;
  };
}

export interface DashboardData {
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

export interface RawPlayer {
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
  story_arc_breakdown?: Record<string, number>;
}

export interface RawBrand {
  brand_name: string;
  category: string;
  appearances: number;
  clips: string[];
  confidence: string;
  presence_percentage: number;
  roi_insight?: string;
}

export interface BrandRegistry {
  brands: RawBrand[];
  sponsorship_insight: string;
}

export interface VoiceManifest {
  voices: Record<string, { voice_id: string; name: string }>;
  clips: Record<string, Record<string, { file: string; chars: number }>>;
  total_chars?: number;
}

interface PickleDaasData {
  clips: RawClip[];
  dashboard: DashboardData;
  player: RawPlayer;
  brands: BrandRegistry;
  voiceManifest: VoiceManifest | null;
  isLoading: boolean;
}

const defaultData: PickleDaasData = {
  clips: [],
  dashboard: {
    kpis: { clips_analyzed: 8, avg_quality_score: 7.3, top_brand: "JOOLA", avg_viral_score: 5.5 },
    analytics: { top_brands: [], skill_radar: {}, story_arc_breakdown: {} },
  },
  player: {
    username: "PickleBill", rank: 1, xp: 283950, level: 17, rank_tier: "Gold III",
    badges_count: 82, clips_analyzed: 8, dominant_shot: "Drive",
    play_style: ["banger", "consistent driver", "baseliner", "net rusher", "aggressive baseliner"],
    skill_radar: {}, coaching_insights: [],
  },
  brands: { brands: [], sponsorship_insight: "" },
  voiceManifest: null,
  isLoading: true,
};

const PickleDaasContext = createContext<PickleDaasData>(defaultData);

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}

export const PickleDaasProvider = ({ children }: { children: ReactNode }) => {
  const clips = useQuery({ queryKey: ["pdaas-clips"], queryFn: () => fetchJSON<RawClip[]>("clips-metadata.json"), staleTime: Infinity });
  const dashboard = useQuery({ queryKey: ["pdaas-dash"], queryFn: () => fetchJSON<DashboardData>("dashboard-data.json"), staleTime: Infinity });
  const player = useQuery({ queryKey: ["pdaas-player"], queryFn: () => fetchJSON<RawPlayer>("player-dna.json"), staleTime: Infinity });
  const brands = useQuery({ queryKey: ["pdaas-brands"], queryFn: () => fetchJSON<BrandRegistry>("brand-registry.json"), staleTime: Infinity });
  const voice = useQuery({ queryKey: ["pdaas-voice"], queryFn: () => fetchJSON<VoiceManifest>("voice-manifest.json").catch(() => null), staleTime: Infinity });

  const value: PickleDaasData = {
    clips: clips.data ?? [],
    dashboard: dashboard.data ?? defaultData.dashboard,
    player: player.data ?? defaultData.player,
    brands: brands.data ?? defaultData.brands,
    voiceManifest: voice.data ?? null,
    isLoading: clips.isLoading || dashboard.isLoading || player.isLoading || brands.isLoading,
  };

  return <PickleDaasContext.Provider value={value}>{children}</PickleDaasContext.Provider>;
};

export const usePickleDaas = () => useContext(PickleDaasContext);

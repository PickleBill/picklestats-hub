import { useQuery } from "@tanstack/react-query";

const BRANDS_URL =
  "https://raw.githubusercontent.com/PickleBill/pickle-daas-data/main/output/lovable-package/brand-registry.json";

export interface Brand {
  name: string;
  appearances: number;
  category: string;
  clips: string[];
  confidence: string;
  icon: string;
  logo_url?: string | null;
  presence_percentage?: number;
}

const iconMap: Record<string, string> = {
  JOOLA: "🏓",
  "LIFE TIME PICKLEBALL": "🏟️",
  CRBN: "🏸",
};

interface RawBrand {
  brand_name: string;
  category: string;
  appearances: number;
  clips: string[];
  confidence: string;
  presence_percentage: number;
}

const fallbackBrands: Brand[] = [
  { name: "JOOLA", appearances: 8, category: "Paddle/Net", clips: [], confidence: "High", icon: "🏓" },
  { name: "LIFE TIME PICKLEBALL", appearances: 8, category: "Venue/Apparel", clips: [], confidence: "High", icon: "🏟️" },
  { name: "CRBN", appearances: 2, category: "Paddle", clips: [], confidence: "Medium", icon: "🏸" },
];

export const useBrands = () =>
  useQuery({
    queryKey: ["brands-github"],
    queryFn: async () => {
      const res = await fetch(BRANDS_URL);
      if (!res.ok) throw new Error("Failed to fetch brands");
      const raw: { brands: RawBrand[]; sponsorship_insight: string } = await res.json();
      return raw.brands.map((b) => ({
        name: b.brand_name,
        appearances: b.appearances,
        category: b.category,
        clips: b.clips,
        confidence: b.confidence,
        icon: iconMap[b.brand_name] || "📦",
        presence_percentage: b.presence_percentage,
      })) as Brand[];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackBrands,
  });

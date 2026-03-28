-- Create table for analyzed clips
CREATE TABLE public.pickle_daas_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clip_url TEXT NOT NULL,
  name TEXT NOT NULL,
  quality_score NUMERIC NOT NULL DEFAULT 0,
  viral_score NUMERIC NOT NULL DEFAULT 0,
  arc_type TEXT NOT NULL DEFAULT 'pure_fun',
  arc_color TEXT NOT NULL DEFAULT 'bg-blue-500',
  brands_detected JSONB NOT NULL DEFAULT '[]'::jsonb,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  commentary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for brand detection registry
CREATE TABLE public.pickle_daas_brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  appearance_count INTEGER NOT NULL DEFAULT 0,
  confidence TEXT NOT NULL DEFAULT 'High',
  detected_in_clips JSONB NOT NULL DEFAULT '[]'::jsonb,
  icon TEXT NOT NULL DEFAULT '🏓',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for player profiles
CREATE TABLE public.pickle_daas_player_dna (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  rank_label TEXT NOT NULL DEFAULT '#1 Global',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  tier TEXT NOT NULL DEFAULT 'Gold III',
  badge_count INTEGER NOT NULL DEFAULT 0,
  dominant_shot TEXT NOT NULL DEFAULT 'Drive',
  radar_stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  play_styles JSONB NOT NULL DEFAULT '[]'::jsonb,
  coaching_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pickle_daas_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickle_daas_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickle_daas_player_dna ENABLE ROW LEVEL SECURITY;

-- Public read access (public-facing analytics dashboard)
CREATE POLICY "Anyone can read analyses" ON public.pickle_daas_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can read brands" ON public.pickle_daas_brands FOR SELECT USING (true);
CREATE POLICY "Anyone can read player dna" ON public.pickle_daas_player_dna FOR SELECT USING (true);
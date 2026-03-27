CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'Analysis',
  card_type text NOT NULL DEFAULT 'sticky',
  summary text,
  content text,
  cover_image text,
  color text DEFAULT 'hsl(48 80% 88%)',
  tags text[],
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.case_studies FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON public.case_studies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON public.case_studies FOR DELETE TO authenticated USING (true);
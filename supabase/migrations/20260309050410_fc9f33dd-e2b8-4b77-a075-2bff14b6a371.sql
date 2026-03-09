
-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Allow anyone to read from uploads
CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow admins to upload
CREATE POLICY "Admins can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update
CREATE POLICY "Admins can update uploads" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete
CREATE POLICY "Admins can delete uploads" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Homepage sections table
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  label text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  page_group text NOT NULL DEFAULT 'about',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Admins can insert sections" ON public.homepage_sections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update sections" ON public.homepage_sections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete sections" ON public.homepage_sections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Seed default sections
INSERT INTO public.homepage_sections (section_key, label, sort_order, page_group) VALUES
  ('hero', 'Hero', 0, 'about'),
  ('marquee', 'Marquee', 1, 'about'),
  ('beliefs', 'Beliefs', 2, 'about'),
  ('work', 'Selected Work', 3, 'work'),
  ('story', 'Story', 4, 'work'),
  ('connect', 'Connect', 5, 'connect'),
  ('footer', 'Footer', 6, 'connect');

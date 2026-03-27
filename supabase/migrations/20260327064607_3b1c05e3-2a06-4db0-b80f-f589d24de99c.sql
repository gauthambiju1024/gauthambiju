
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS contribution text,
  ADD COLUMN IF NOT EXISTS stack text,
  ADD COLUMN IF NOT EXISTS impact text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'hsl(215 20% 30%)',
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Generate slugs for existing rows
UPDATE public.projects SET slug = lower(replace(replace(title, ' ', '-'), '.', '')) WHERE slug IS NULL;

-- Now make slug not null and unique
ALTER TABLE public.projects ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.projects ADD CONSTRAINT projects_slug_unique UNIQUE (slug);

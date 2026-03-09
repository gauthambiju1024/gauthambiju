import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Json } from '@/integrations/supabase/types';

// Projects hook
export function useProjects() {
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { setProjects(data ?? []); setLoading(false); });
  }, []);

  return { projects, loading };
}

// Blog posts hook
export function useBlogPosts(publishedOnly = true) {
  const [posts, setPosts] = useState<Tables<'blog_posts'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    if (publishedOnly) query = query.eq('is_published', true);
    query.then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, [publishedOnly]);

  return { posts, loading };
}

// Single blog post hook
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<Tables<'blog_posts'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle()
      .then(({ data }) => { setPost(data); setLoading(false); });
  }, [slug]);

  return { post, loading };
}

// Site content hook
export function useSiteContent(section: string, key: string) {
  const [value, setValue] = useState<Json | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_content').select('value').eq('section', section).eq('key', key).maybeSingle()
      .then(({ data }) => { setValue(data?.value ?? null); setLoading(false); });
  }, [section, key]);

  return { value, loading };
}

// Social links hook
export function useSocialLinks() {
  const [links, setLinks] = useState<Tables<'social_links'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('social_links').select('*').order('sort_order')
      .then(({ data }) => { setLinks(data ?? []); setLoading(false); });
  }, []);

  return { links, loading };
}

// Homepage sections hook
export function useHomepageSections() {
  const [sections, setSections] = useState<{ section_key: string; page_group: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('homepage_sections').select('section_key, page_group')
      .eq('is_visible', true).order('sort_order')
      .then(({ data }) => { setSections((data as any[]) ?? []); setLoading(false); });
  }, []);

  return { sections, loading };
}

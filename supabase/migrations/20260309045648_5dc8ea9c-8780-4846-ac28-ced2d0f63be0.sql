
-- Fix RLS policies: drop restrictive ones and recreate as permissive

-- blog_posts
DROP POLICY "Anyone can view published posts" ON public.blog_posts;
DROP POLICY "Admins can insert posts" ON public.blog_posts;
DROP POLICY "Admins can update posts" ON public.blog_posts;
DROP POLICY "Admins can delete posts" ON public.blog_posts;

CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- projects
DROP POLICY "Anyone can view active projects" ON public.projects;
DROP POLICY "Admins can insert projects" ON public.projects;
DROP POLICY "Admins can update projects" ON public.projects;
DROP POLICY "Admins can delete projects" ON public.projects;

CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- site_content
DROP POLICY "Anyone can view site content" ON public.site_content;
DROP POLICY "Admins can insert site content" ON public.site_content;
DROP POLICY "Admins can update site content" ON public.site_content;
DROP POLICY "Admins can delete site content" ON public.site_content;

CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site content" ON public.site_content FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- social_links
DROP POLICY "Anyone can view social links" ON public.social_links;
DROP POLICY "Admins can insert social links" ON public.social_links;
DROP POLICY "Admins can update social links" ON public.social_links;
DROP POLICY "Admins can delete social links" ON public.social_links;

CREATE POLICY "Anyone can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can insert social links" ON public.social_links FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update social links" ON public.social_links FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete social links" ON public.social_links FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY "Admins can view all roles" ON public.user_roles;
DROP POLICY "Users can view own role" ON public.user_roles;

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

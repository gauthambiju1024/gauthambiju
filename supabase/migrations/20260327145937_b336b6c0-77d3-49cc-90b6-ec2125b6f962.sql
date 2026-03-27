DROP POLICY "Auth insert" ON public.case_studies;
DROP POLICY "Auth update" ON public.case_studies;
DROP POLICY "Auth delete" ON public.case_studies;
CREATE POLICY "Admins can insert case studies" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update case studies" ON public.case_studies FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete case studies" ON public.case_studies FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
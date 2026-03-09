import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, FileText, Type, Link2 } from 'lucide-react';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ projects: 0, posts: 0, content: 0, links: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const [projects, posts, content, links] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
        supabase.from('social_links').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        projects: projects.count ?? 0,
        posts: posts.count ?? 0,
        content: content.count ?? 0,
        links: links.count ?? 0,
      });
    }
    fetchCounts();
  }, []);

  const stats = [
    { label: 'Projects', count: counts.projects, icon: FolderOpen },
    { label: 'Blog Posts', count: counts.posts, icon: FileText },
    { label: 'Content Items', count: counts.content, icon: Type },
    { label: 'Social Links', count: counts.links, icon: Link2 },
  ];

  return (
    <div>
      <h1 className="font-handwritten text-3xl mb-6 text-card-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, count, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

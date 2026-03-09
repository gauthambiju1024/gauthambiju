import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type BlogPost = Tables<'blog_posts'>;

const emptyPost: TablesInsert<'blog_posts'> = {
  title: '', slug: '', content: '', excerpt: '', cover_image: '', tags: [], is_published: false,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<TablesInsert<'blog_posts'>>(emptyPost);
  const [tagsInput, setTagsInput] = useState('');

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyPost);
    setTagsInput('');
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt, cover_image: p.cover_image, tags: p.tags, is_published: p.is_published });
    setTagsInput((p.tags ?? []).join(', '));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Post updated');
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Post created');
    }
    setDialogOpen(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Post deleted');
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-handwritten text-3xl text-card-foreground">Blog Posts</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />New Post</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{p.slug}</TableCell>
                <TableCell>{p.is_published ? '✓' : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No posts yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) }); }} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Excerpt</Label><Input value={form.excerpt ?? ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div><Label>Cover Image URL</Label><Input value={form.cover_image ?? ''} onChange={e => setForm({ ...form, cover_image: e.target.value })} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} /></div>
            <div><Label>Content (Markdown)</Label><Textarea rows={12} value={form.content ?? ''} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published ?? false} onCheckedChange={v => setForm({ ...form, is_published: v })} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

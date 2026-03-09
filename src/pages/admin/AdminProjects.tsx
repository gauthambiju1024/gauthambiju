import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';

type Project = Tables<'projects'>;

const emptyProject: TablesInsert<'projects'> = {
  title: '', subtitle: '', tags: [], year: '', url: '', sort_order: 0, is_active: true,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<TablesInsert<'projects'>>(emptyProject);
  const [tagsInput, setTagsInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data ?? []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setTagsInput('');
    setThumbnail('');
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, subtitle: p.subtitle, tags: p.tags, year: p.year, url: p.url, sort_order: p.sort_order, is_active: p.is_active });
    setTagsInput((p.tags ?? []).join(', '));
    setThumbnail('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Project updated');
    } else {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Project created');
    }
    setDialogOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Project deleted');
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-handwritten text-3xl text-card-foreground">Projects</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Project</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}<br /><span className="text-muted-foreground text-xs">{p.subtitle}</span></TableCell>
                <TableCell>{p.year}</TableCell>
                <TableCell>{(p.tags ?? []).join(', ')}</TableCell>
                <TableCell>{p.is_active ? '✓' : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No projects yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle ?? ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Year</Label><Input value={form.year ?? ''} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div><Label>URL</Label><Input value={form.url ?? ''} onChange={e => setForm({ ...form, url: e.target.value })} /></div>
            <div>
              <Label>Thumbnail</Label>
              <ImageUpload value={thumbnail} onChange={setThumbnail} folder="projects" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active ?? true} onCheckedChange={v => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
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

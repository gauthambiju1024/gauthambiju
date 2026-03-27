import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import { Textarea } from '@/components/ui/textarea';

const PRESET_COLORS = [
  { name: 'Teal', value: 'hsl(170 25% 28%)' },
  { name: 'Burgundy', value: 'hsl(350 28% 30%)' },
  { name: 'Navy', value: 'hsl(215 28% 28%)' },
  { name: 'Olive', value: 'hsl(85 18% 28%)' },
  { name: 'Rust', value: 'hsl(15 30% 30%)' },
  { name: 'Plum', value: 'hsl(280 18% 30%)' },
  { name: 'Slate', value: 'hsl(200 12% 32%)' },
  { name: 'Amber', value: 'hsl(35 25% 30%)' },
  { name: 'Forest', value: 'hsl(140 20% 25%)' },
  { name: 'Charcoal', value: 'hsl(220 8% 22%)' },
];

type Project = Tables<'projects'>;

const emptyProject: TablesInsert<'projects'> = {
  title: '', slug: '', subtitle: '', tags: [], year: '', url: '', sort_order: 0, is_active: true,
  category: 'General', color: 'hsl(215 20% 30%)', problem: '', role: '', contribution: '', stack: '', impact: '', description: '',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<TablesInsert<'projects'>>(emptyProject);
  const [tagsInput, setTagsInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects(data ?? []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setTagsInput('');
    setThumbnailUrl('');
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, subtitle: p.subtitle, tags: p.tags, year: p.year, url: p.url,
      sort_order: p.sort_order, is_active: p.is_active, category: p.category, color: p.color,
      problem: p.problem, role: p.role, contribution: p.contribution, stack: p.stack, impact: p.impact,
      description: p.description,
    });
    setTagsInput((p.tags ?? []).join(', '));
    setThumbnailUrl(p.thumbnail_url ?? '');
    setDialogOpen(true);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      thumbnail_url: thumbnailUrl || null,
      slug: form.slug || generateSlug(form.title),
    };
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
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.title}<br /><span className="text-muted-foreground text-xs">{p.subtitle}</span>
                </TableCell>
                <TableCell className="text-xs">{p.category}</TableCell>
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
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No projects yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
            </div>
            <div><Label>Subtitle</Label><Input value={form.subtitle ?? ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Category</Label><Input value={form.category ?? 'General'} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Year</Label><Input value={form.year ?? ''} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div><Label>Tags (comma separated)</Label><Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>URL</Label><Input value={form.url ?? ''} onChange={e => setForm({ ...form, url: e.target.value })} /></div>
              <div>
                <Label>Spine Color</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.value })}
                      className="relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center"
                      style={{
                        backgroundColor: c.value,
                        borderColor: form.color === c.value ? 'hsl(var(--primary))' : 'transparent',
                        boxShadow: form.color === c.value ? '0 0 0 2px hsl(var(--primary) / 0.3)' : 'none',
                      }}
                      title={c.name}
                    >
                      {form.color === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const custom = prompt('Enter custom HSL color:', form.color ?? '');
                      if (custom) setForm({ ...form, color: custom });
                    }}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground text-xs font-mono flex items-center justify-center hover:border-primary/50 transition-colors"
                    title="Custom color"
                  >
                    +
                  </button>
                </div>
                {form.color && !PRESET_COLORS.some(c => c.value === form.color) && (
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">Custom: {form.color}</p>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Case Study Details</p>
            </div>
            <div><Label>Problem</Label><Textarea value={form.problem ?? ''} onChange={e => setForm({ ...form, problem: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Role</Label><Input value={form.role ?? ''} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
              <div><Label>Stack</Label><Input value={form.stack ?? ''} onChange={e => setForm({ ...form, stack: e.target.value })} /></div>
            </div>
            <div><Label>Contribution</Label><Textarea value={form.contribution ?? ''} onChange={e => setForm({ ...form, contribution: e.target.value })} rows={2} /></div>
            <div><Label>Impact</Label><Textarea value={form.impact ?? ''} onChange={e => setForm({ ...form, impact: e.target.value })} rows={2} /></div>
            <div><Label>Description (Markdown)</Label><Textarea value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={6} /></div>
            <div>
              <Label>Thumbnail</Label>
              <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} folder="projects" />
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

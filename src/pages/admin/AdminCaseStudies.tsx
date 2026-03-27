import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';

type CaseStudy = Tables<'case_studies'>;

const PRESET_COLORS = [
  { name: 'Yellow', value: 'hsl(48 80% 88%)' },
  { name: 'Cream', value: 'hsl(48 70% 90%)' },
  { name: 'Ice', value: 'hsl(210 20% 95%)' },
  { name: 'Cloud', value: 'hsl(200 15% 94%)' },
  { name: 'White', value: 'hsl(0 0% 98%)' },
  { name: 'Blush', value: 'hsl(350 30% 93%)' },
  { name: 'Mint', value: 'hsl(160 20% 92%)' },
  { name: 'Lavender', value: 'hsl(270 20% 93%)' },
];

const emptyStudy: TablesInsert<'case_studies'> = {
  title: '', slug: '', category: 'Analysis', card_type: 'sticky', summary: '',
  content: '', cover_image: '', color: 'hsl(48 80% 88%)', tags: [], sort_order: 0, is_published: true,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStudy);
  const [tagsInput, setTagsInput] = useState('');

  const fetchStudies = async () => {
    const { data } = await supabase.from('case_studies').select('*').order('sort_order');
    setStudies(data ?? []);
  };

  useEffect(() => { fetchStudies(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyStudy); setTagsInput(''); setOpen(true); };
  const openEdit = (s: CaseStudy) => {
    setEditing(s.id);
    setForm({ ...s });
    setTagsInput((s.tags ?? []).join(', '));
    setOpen(true);
  };

  const handleSave = async () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags };
    if (editing) {
      const { error } = await supabase.from('case_studies').update(payload).eq('id', editing);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('case_studies').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setOpen(false);
    fetchStudies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return;
    await supabase.from('case_studies').delete().eq('id', id);
    toast.success('Deleted');
    fetchStudies();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Case Studies</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Case Study</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studies.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.title}</TableCell>
              <TableCell>{s.category}</TableCell>
              <TableCell><Badge variant="outline">{s.card_type}</Badge></TableCell>
              <TableCell>{s.sort_order}</TableCell>
              <TableCell>{s.is_published ? '✓' : '—'}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {studies.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No case studies yet</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'New'} Case Study</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Input value={form.category ?? ''} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>Card Type</Label>
                <Select value={form.card_type ?? 'sticky'} onValueChange={v => setForm({ ...form, card_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sticky">Sticky</SelectItem>
                    <SelectItem value="framework">Framework</SelectItem>
                    <SelectItem value="diagram">Diagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div>
              <Label>Summary</Label>
              <Textarea value={form.summary ?? ''} onChange={e => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>

            <div>
              <Label>Content (Markdown)</Label>
              <Textarea value={form.content ?? ''} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} className="font-mono text-xs" />
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="UX, Strategy, Product" />
            </div>

            <div>
              <Label>Cover Image</Label>
              <ImageUpload value={form.cover_image ?? ''} onChange={url => setForm({ ...form, cover_image: url })} folder="case-studies" />
            </div>

            <div>
              <Label>Card Color</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {PRESET_COLORS.map(c => (
                  <button key={c.value} title={c.name}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${form.color === c.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setForm({ ...form, color: c.value })}
                  />
                ))}
              </div>
              <Input value={form.color ?? ''} onChange={e => setForm({ ...form, color: e.target.value })} className="mt-2" placeholder="hsl(48 80% 88%)" />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.is_published ?? true} onCheckedChange={v => setForm({ ...form, is_published: v })} />
              <Label>Published</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

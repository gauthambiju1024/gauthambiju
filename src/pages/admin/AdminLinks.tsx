import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type SocialLink = Tables<'social_links'>;

const emptyLink: TablesInsert<'social_links'> = {
  name: '', url: '', icon: '', label: '', sort_order: 0,
};

export default function AdminLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<TablesInsert<'social_links'>>(emptyLink);

  const fetchLinks = async () => {
    const { data } = await supabase.from('social_links').select('*').order('sort_order');
    setLinks(data ?? []);
  };

  useEffect(() => { fetchLinks(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyLink); setDialogOpen(true); };
  const openEdit = (l: SocialLink) => {
    setEditing(l);
    setForm({ name: l.name, url: l.url, icon: l.icon, label: l.label, sort_order: l.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from('social_links').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Link updated');
    } else {
      const { error } = await supabase.from('social_links').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Link created');
    }
    setDialogOpen(false);
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Link deleted');
    fetchLinks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-handwritten text-3xl text-card-foreground">Social Links</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Link</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-muted-foreground">{l.icon}</TableCell>
                <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">{l.url}</TableCell>
                <TableCell>{l.sort_order}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No links yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Link' : 'New Link'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. GitHub" /></div>
            <div><Label>Icon (lucide name)</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g. Github" /></div>
            <div><Label>URL</Label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Label</Label><Input value={form.label ?? ''} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. @username" /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
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

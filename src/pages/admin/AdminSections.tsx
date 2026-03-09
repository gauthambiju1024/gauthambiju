import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Section {
  id: string;
  section_key: string;
  label: string;
  is_visible: boolean;
  sort_order: number;
  page_group: string;
}

export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const fetchSections = async () => {
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order');
    setSections((data as Section[]) ?? []);
  };

  useEffect(() => { fetchSections(); }, []);

  const toggle = (id: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, is_visible: !sec.is_visible } : sec));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const arr = [...sections];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(dropIndex, 0, moved);
    arr.forEach((s, i) => (s.sort_order = i));
    setSections(arr);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const saveAll = async () => {
    for (const s of sections) {
      const { error } = await supabase
        .from('homepage_sections')
        .update({ is_visible: s.is_visible, sort_order: s.sort_order })
        .eq('id', s.id);
      if (error) { toast.error(error.message); return; }
    }
    toast.success('Sections saved');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-handwritten text-3xl text-card-foreground">Homepage Sections</h1>
        <Button onClick={saveAll}><Save className="h-4 w-4 mr-2" />Save Order</Button>
      </div>

      <div className="space-y-2">
        {sections.map((s, i) => (
          <Card
            key={s.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={[
              'transition-all duration-150',
              dragIndex === i ? 'opacity-40 scale-95' : '',
              overIndex === i && dragIndex !== i ? 'border-primary ring-2 ring-primary/30' : '',
              !s.is_visible ? 'opacity-50' : '',
            ].join(' ')}
          >
            <CardContent className="flex items-center gap-4 py-3 px-4">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.section_key} · {s.page_group}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={s.is_visible} onCheckedChange={() => toggle(s.id)} />
                <Label className="text-sm">{s.is_visible ? 'Visible' : 'Hidden'}</Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

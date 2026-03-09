import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowUp, ArrowDown } from 'lucide-react';
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

  const move = (index: number, dir: -1 | 1) => {
    const arr = [...sections];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    arr.forEach((s, i) => (s.sort_order = i));
    setSections(arr);
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

  const groups = ['about', 'work', 'connect'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-handwritten text-3xl text-card-foreground">Homepage Sections</h1>
        <Button onClick={saveAll}><Save className="h-4 w-4 mr-2" />Save Order</Button>
      </div>

      <div className="space-y-2">
        {sections.map((s, i) => (
          <Card key={s.id} className={!s.is_visible ? 'opacity-50' : ''}>
            <CardContent className="flex items-center gap-4 py-3 px-4">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(i, 1)} disabled={i === sections.length - 1}>
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
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

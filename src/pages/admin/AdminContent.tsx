import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import ImageUpload from '@/components/admin/ImageUpload';
import AboutJourneyEditor, { JourneyData } from '@/components/admin/AboutJourneyEditor';

type ContentMap = Record<string, Json>;

export default function AdminContent() {
  const [heroContent, setHeroContent] = useState<ContentMap>({});
  const [beliefs, setBeliefs] = useState<{ number: string; title: string; body: string }[]>([]);
  const [story, setStory] = useState<ContentMap>({});
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [rotatingWords, setRotatingWords] = useState<string[]>([]);
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
  const [journey, setJourney] = useState<JourneyData>({});
  const [skillGroups, setSkillGroups] = useState<{ title: string; icon: 'wrench' | 'gear' | 'caliper'; skills: { name: string; context: string; project?: string }[] }[]>([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data } = await supabase.from('site_content').select('*');
    if (!data) return;
    for (const row of data) {
      const val = row.value as any;
      if (row.section === 'hero' && row.key === 'main') setHeroContent(val);
      if (row.section === 'hero' && row.key === 'rotating_words') setRotatingWords(val as string[]);
      if (row.section === 'beliefs' && row.key === 'items') setBeliefs(val);
      if (row.section === 'story' && row.key === 'main') setStory(val);
      if (row.section === 'story' && row.key === 'stats') setStats(val);
      if (row.section === 'marquee' && row.key === 'items') setMarqueeItems(val as string[]);
      if (row.section === 'about' && row.key === 'journey') setJourney((val as JourneyData) || {});
      if (row.section === 'skills' && row.key === 'groups') setSkillGroups((val?.groups as any) || []);
    }
  };

  const saveContent = async (section: string, key: string, value: Json) => {
    const { error } = await supabase.from('site_content').upsert(
      { section, key, value },
      { onConflict: 'section,key' }
    );
    if (error) { toast.error(error.message); return; }
    toast.success(`${section} → ${key} saved`);
  };

  return (
    <div>
      <h1 className="font-handwritten text-3xl mb-6 text-card-foreground">Site Content</h1>

      <Tabs defaultValue="hero">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="marquee">Marquee</TabsTrigger>
          <TabsTrigger value="journey">About / Journey</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Name</Label><Input value={(heroContent as any).name ?? ''} onChange={e => setHeroContent({ ...heroContent, name: e.target.value })} /></div>
              <div><Label>Tagline</Label><Input value={(heroContent as any).tagline ?? ''} onChange={e => setHeroContent({ ...heroContent, tagline: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={(heroContent as any).location ?? ''} onChange={e => setHeroContent({ ...heroContent, location: e.target.value })} /></div>
              <div>
                <Label>Hero Portrait</Label>
                <ImageUpload
                  value={(heroContent as any).portrait ?? ''}
                  onChange={url => setHeroContent({ ...heroContent, portrait: url })}
                  folder="hero"
                />
              </div>
              <div>
                <Label>Rotating Words (one per line)</Label>
                <Textarea rows={4} value={rotatingWords.join('\n')} onChange={e => setRotatingWords(e.target.value.split('\n').filter(Boolean))} />
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-base">ID Badge (right side of hero)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Card Name</Label>
                    <Input value={(heroContent as any).badge?.name ?? ''} placeholder="GAUTHAM BIJU"
                      onChange={e => setHeroContent({ ...heroContent, badge: { ...(heroContent as any).badge, name: e.target.value } })} />
                  </div>
                  <div>
                    <Label className="text-xs">ID Label</Label>
                    <Input value={(heroContent as any).badge?.idLabel ?? ''} placeholder="ID · 0024"
                      onChange={e => setHeroContent({ ...heroContent, badge: { ...(heroContent as any).badge, idLabel: e.target.value } })} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Card Title (use \n for line break)</Label>
                  <Input value={(heroContent as any).badge?.title ?? ''} placeholder="BUILDER · THINKER · MAKER"
                    onChange={e => setHeroContent({ ...heroContent, badge: { ...(heroContent as any).badge, title: e.target.value } })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Ribbon Text (left strand)</Label>
                    <Input value={(heroContent as any).badge?.ribbonLeft ?? ''} placeholder="GAUTHAM BIJU"
                      onChange={e => setHeroContent({ ...heroContent, badge: { ...(heroContent as any).badge, ribbonLeft: e.target.value } })} />
                  </div>
                  <div>
                    <Label className="text-xs">Ribbon Text (right strand)</Label>
                    <Input value={(heroContent as any).badge?.ribbonRight ?? ''} placeholder="PORTFOLIO · 2026"
                      onChange={e => setHeroContent({ ...heroContent, badge: { ...(heroContent as any).badge, ribbonRight: e.target.value } })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveContent('hero', 'main', heroContent as Json)}><Save className="h-4 w-4 mr-2" />Save Hero</Button>
                <Button onClick={() => saveContent('hero', 'rotating_words', rotatingWords as unknown as Json)}><Save className="h-4 w-4 mr-2" />Save Words</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beliefs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Beliefs</CardTitle>
              <Button size="sm" onClick={() => setBeliefs([...beliefs, { number: `0${beliefs.length + 1}`, title: '', body: '' }])}><Plus className="h-4 w-4 mr-1" />Add</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {beliefs.map((b, i) => (
                <div key={i} className="border rounded-md p-4 space-y-2 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setBeliefs(beliefs.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  <div className="grid grid-cols-4 gap-2">
                    <div><Label>Number</Label><Input value={b.number} onChange={e => { const c = [...beliefs]; c[i].number = e.target.value; setBeliefs(c); }} /></div>
                    <div className="col-span-3"><Label>Title</Label><Input value={b.title} onChange={e => { const c = [...beliefs]; c[i].title = e.target.value; setBeliefs(c); }} /></div>
                  </div>
                  <div><Label>Body</Label><Textarea value={b.body} onChange={e => { const c = [...beliefs]; c[i].body = e.target.value; setBeliefs(c); }} /></div>
                </div>
              ))}
              <Button onClick={() => saveContent('beliefs', 'items', beliefs as unknown as Json)}><Save className="h-4 w-4 mr-2" />Save Beliefs</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story">
          <Card>
            <CardHeader><CardTitle>Story / About</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Heading</Label><Input value={(story as any).heading ?? ''} onChange={e => setStory({ ...story, heading: e.target.value })} /></div>
              <div><Label>Body</Label><Textarea rows={6} value={(story as any).body ?? ''} onChange={e => setStory({ ...story, body: e.target.value })} /></div>
              <Button onClick={() => saveContent('story', 'main', story as Json)}><Save className="h-4 w-4 mr-2" />Save Story</Button>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Stats</Label>
                  <Button size="sm" onClick={() => setStats([...stats, { value: '', label: '' }])}><Plus className="h-4 w-4 mr-1" />Add</Button>
                </div>
                {stats.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-end">
                    <div><Label>Value</Label><Input value={s.value} onChange={e => { const c = [...stats]; c[i].value = e.target.value; setStats(c); }} /></div>
                    <div><Label>Label</Label><Input value={s.label} onChange={e => { const c = [...stats]; c[i].label = e.target.value; setStats(c); }} /></div>
                    <Button variant="ghost" size="icon" onClick={() => setStats(stats.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button onClick={() => saveContent('story', 'stats', stats as unknown as Json)}><Save className="h-4 w-4 mr-2" />Save Stats</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marquee">
          <Card>
            <CardHeader><CardTitle>Marquee Items</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Items (one per line)</Label>
                <Textarea rows={8} value={marqueeItems.join('\n')} onChange={e => setMarqueeItems(e.target.value.split('\n').filter(Boolean))} />
              </div>
              <Button onClick={() => saveContent('marquee', 'items', marqueeItems as unknown as Json)}><Save className="h-4 w-4 mr-2" />Save Marquee</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>About → Journey (back of ID card + globe markers)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Edit the overview, globe markers, education and experience entries.
                Link an entry to a globe marker via the dropdown so clicking the marker expands that entry.
                Add a logo and optional group heading per entry.
              </p>
              <AboutJourneyEditor value={journey} onChange={setJourney} />
              <Button onClick={() => saveContent('about', 'journey', journey as unknown as Json)}>
                <Save className="h-4 w-4 mr-2" />Save Journey
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronUp, ChevronDown, Code } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export type JourneyEntry = {
  id: string;
  title: string;
  org?: string;
  period: string;
  location?: string;
  summary?: string;
  details?: string;
  link?: string;
  markerId?: string;
  logoUrl?: string;
  groupHeading?: string;
};

export type Marker = { id: string; label: string; location: [number, number] };

export type JourneyData = {
  overview?: {
    blurb?: string;
    traits?: string[];
    focus?: string[];
    quickFacts?: { label: string; value: string }[];
    footer?: string;
  };
  markers?: Marker[];
  education?: JourneyEntry[];
  experience?: JourneyEntry[];
};

interface Props {
  value: JourneyData;
  onChange: (v: JourneyData) => void;
}

const newId = () => Math.random().toString(36).slice(2, 9);

const blankEntry = (): JourneyEntry => ({
  id: newId(),
  title: "",
  org: "",
  period: "",
  location: "",
  summary: "",
  details: "",
  link: "",
  markerId: "",
  logoUrl: "",
  groupHeading: "",
});

const blankMarker = (): Marker => ({ id: newId(), label: "", location: [0, 0] });

export default function AboutJourneyEditor({ value, onChange }: Props) {
  const data: JourneyData = value ?? {};
  const overview = data.overview ?? {};
  const markers = data.markers ?? [];
  const education = data.education ?? [];
  const experience = data.experience ?? [];

  const [advanced, setAdvanced] = useState(false);
  const [jsonText, setJsonText] = useState("");
  useEffect(() => {
    if (advanced) setJsonText(JSON.stringify(data, null, 2));
  }, [advanced]);

  const setOverview = (patch: Partial<typeof overview>) =>
    onChange({ ...data, overview: { ...overview, ...patch } });

  const setMarkers = (m: Marker[]) => onChange({ ...data, markers: m });
  const setEducation = (e: JourneyEntry[]) => onChange({ ...data, education: e });
  const setExperience = (e: JourneyEntry[]) => onChange({ ...data, experience: e });

  const move = <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };

  const renderEntryList = (
    list: JourneyEntry[],
    setList: (l: JourneyEntry[]) => void,
    label: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base">{label}</Label>
        <Button size="sm" type="button" onClick={() => setList([...list, blankEntry()])}>
          <Plus className="h-4 w-4 mr-1" />Add entry
        </Button>
      </div>
      {list.map((e, i) => (
        <div key={e.id} className="border rounded-md p-3 space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-muted-foreground">#{i + 1}</div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" type="button" onClick={() => setList(move(list, i, -1))}><ChevronUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" type="button" onClick={() => setList(move(list, i, 1))}><ChevronDown className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" type="button" onClick={() => setList(list.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Title</Label><Input value={e.title} onChange={ev => { const c = [...list]; c[i] = { ...e, title: ev.target.value }; setList(c); }} /></div>
            <div><Label className="text-xs">Organisation</Label><Input value={e.org ?? ""} onChange={ev => { const c = [...list]; c[i] = { ...e, org: ev.target.value }; setList(c); }} /></div>
            <div><Label className="text-xs">Period</Label><Input value={e.period} placeholder="2023 – 2024" onChange={ev => { const c = [...list]; c[i] = { ...e, period: ev.target.value }; setList(c); }} /></div>
            <div><Label className="text-xs">Location</Label><Input value={e.location ?? ""} onChange={ev => { const c = [...list]; c[i] = { ...e, location: ev.target.value }; setList(c); }} /></div>
            <div><Label className="text-xs">Group Heading (optional)</Label><Input value={e.groupHeading ?? ""} placeholder="Internships" onChange={ev => { const c = [...list]; c[i] = { ...e, groupHeading: ev.target.value }; setList(c); }} /></div>
            <div>
              <Label className="text-xs">Globe Marker</Label>
              <select
                className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                value={e.markerId ?? ""}
                onChange={ev => { const c = [...list]; c[i] = { ...e, markerId: ev.target.value }; setList(c); }}
              >
                <option value="">— none —</option>
                {markers.map(m => (
                  <option key={m.id} value={m.id}>{m.label || m.id}</option>
                ))}
              </select>
            </div>
          </div>
          <div><Label className="text-xs">Summary (one line)</Label><Input value={e.summary ?? ""} onChange={ev => { const c = [...list]; c[i] = { ...e, summary: ev.target.value }; setList(c); }} /></div>
          <div><Label className="text-xs">Details</Label><Textarea rows={3} value={e.details ?? ""} onChange={ev => { const c = [...list]; c[i] = { ...e, details: ev.target.value }; setList(c); }} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Link (optional)</Label><Input value={e.link ?? ""} placeholder="https://..." onChange={ev => { const c = [...list]; c[i] = { ...e, link: ev.target.value }; setList(c); }} /></div>
            <div>
              <Label className="text-xs">Logo</Label>
              <ImageUpload value={e.logoUrl ?? ""} onChange={url => { const c = [...list]; c[i] = { ...e, logoUrl: url }; setList(c); }} folder="journey-logos" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (advanced) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Raw JSON</Label>
          <Button size="sm" variant="outline" type="button" onClick={() => setAdvanced(false)}>Back to form</Button>
        </div>
        <Textarea rows={28} value={jsonText} onChange={e => setJsonText(e.target.value)} className="font-mono text-xs" />
        <Button type="button" onClick={() => {
          try { onChange(JSON.parse(jsonText)); setAdvanced(false); }
          catch (err: any) { alert("Invalid JSON: " + err.message); }
        }}>Apply JSON</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" type="button" onClick={() => setAdvanced(true)}>
          <Code className="h-4 w-4 mr-1" />Advanced (JSON)
        </Button>
      </div>

      {/* Overview */}
      <section className="space-y-3 border rounded-md p-4">
        <Label className="text-base">Overview</Label>
        <div><Label className="text-xs">Blurb</Label><Textarea rows={3} value={overview.blurb ?? ""} onChange={e => setOverview({ blurb: e.target.value })} /></div>
        <div><Label className="text-xs">Traits (one per line)</Label>
          <Textarea rows={3} value={(overview.traits ?? []).join("\n")} onChange={e => setOverview({ traits: e.target.value.split("\n").filter(Boolean) })} />
        </div>
        <div><Label className="text-xs">Focus tags (one per line)</Label>
          <Textarea rows={3} value={(overview.focus ?? []).join("\n")} onChange={e => setOverview({ focus: e.target.value.split("\n").filter(Boolean) })} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Quick Facts</Label>
            <Button size="sm" type="button" onClick={() => setOverview({ quickFacts: [...(overview.quickFacts ?? []), { label: "", value: "" }] })}>
              <Plus className="h-3 w-3 mr-1" />Add fact
            </Button>
          </div>
          {(overview.quickFacts ?? []).map((q, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1"><Label className="text-xs">Label</Label><Input value={q.label} onChange={e => { const c = [...(overview.quickFacts ?? [])]; c[i] = { ...q, label: e.target.value }; setOverview({ quickFacts: c }); }} /></div>
              <div className="flex-1"><Label className="text-xs">Value</Label><Input value={q.value} onChange={e => { const c = [...(overview.quickFacts ?? [])]; c[i] = { ...q, value: e.target.value }; setOverview({ quickFacts: c }); }} /></div>
              <Button variant="ghost" size="icon" type="button" onClick={() => setOverview({ quickFacts: (overview.quickFacts ?? []).filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
        <div><Label className="text-xs">Footer quote</Label><Input value={overview.footer ?? ""} onChange={e => setOverview({ footer: e.target.value })} /></div>
      </section>

      {/* Markers */}
      <section className="space-y-3 border rounded-md p-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Globe Markers</Label>
          <Button size="sm" type="button" onClick={() => setMarkers([...markers, blankMarker()])}><Plus className="h-4 w-4 mr-1" />Add marker</Button>
        </div>
        {markers.map((m, i) => (
          <div key={m.id} className="grid grid-cols-12 gap-2 items-end border rounded-md p-2 bg-muted/30">
            <div className="col-span-3"><Label className="text-xs">ID</Label><Input value={m.id} onChange={e => { const c = [...markers]; c[i] = { ...m, id: e.target.value }; setMarkers(c); }} /></div>
            <div className="col-span-4"><Label className="text-xs">Label</Label><Input value={m.label} onChange={e => { const c = [...markers]; c[i] = { ...m, label: e.target.value }; setMarkers(c); }} /></div>
            <div className="col-span-2"><Label className="text-xs">Lat</Label><Input type="number" step="0.0001" value={m.location[0]} onChange={e => { const c = [...markers]; c[i] = { ...m, location: [parseFloat(e.target.value) || 0, m.location[1]] }; setMarkers(c); }} /></div>
            <div className="col-span-2"><Label className="text-xs">Lng</Label><Input type="number" step="0.0001" value={m.location[1]} onChange={e => { const c = [...markers]; c[i] = { ...m, location: [m.location[0], parseFloat(e.target.value) || 0] }; setMarkers(c); }} /></div>
            <Button variant="ghost" size="icon" type="button" onClick={() => setMarkers(markers.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </section>

      <section className="border rounded-md p-4">{renderEntryList(education, setEducation, "Education")}</section>
      <section className="border rounded-md p-4">{renderEntryList(experience, setExperience, "Experience")}</section>
    </div>
  );
}

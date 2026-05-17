import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSiteContent } from "@/hooks/useSiteData";
import AboutCardBack, { AboutJourneyData } from "./AboutCardBack";
import AboutGlobe, { GlobeMarker } from "./AboutGlobe";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AboutPopup = ({ open, onOpenChange }: Props) => {
  const { value: journeyData } = useSiteContent("about", "journey");
  const journey = (journeyData as AboutJourneyData) || {};

  const markers: GlobeMarker[] = useMemo(
    () =>
      ((journeyData as any)?.markers as GlobeMarker[]) || [
        { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
        { id: "ahmedabad", location: [23.0225, 72.5714], label: "Ahmedabad" },
        { id: "kerala", location: [9.9312, 76.2673], label: "Kerala" },
        { id: "indore", location: [22.7196, 75.8577], label: "Indore" },
      ],
    [journeyData]
  );

  const [activeTab, setActiveTab] = useState<"overview" | "education" | "experience">("overview");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onMarkerClick = (markerId: string) => {
    const all = [
      ...(journey.education || []).map((e) => ({ ...e, _tab: "education" as const })),
      ...(journey.experience || []).map((e) => ({ ...e, _tab: "experience" as const })),
    ];
    const match = all.find((e) => e.markerId === markerId);
    if (match) {
      setActiveTab(match._tab);
      setExpandedId(match.id);
    }
  };

  const selectedMarkerId = useMemo(() => {
    if (!expandedId) return null;
    const all = [...(journey.education || []), ...(journey.experience || [])];
    return all.find((e) => e.id === expandedId)?.markerId || null;
  }, [expandedId, journey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[92vw] p-0 border-0"
        style={{
          background: "hsl(40 25% 92%)",
          boxShadow: "0 40px 80px -20px hsl(160 30% 4% / 0.6), inset 0 0 0 1px hsl(0 0% 100% / 0.6)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <DialogTitle className="sr-only">More about me</DialogTitle>
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-0" style={{ minHeight: "min(78vh, 640px)" }}>
          <div
            className="relative hidden md:block"
            style={{ background: "hsl(160 30% 8%)", color: "hsl(40 25% 92%)" }}
          >
            <AboutGlobe markers={markers} selectedId={selectedMarkerId} onMarkerClick={onMarkerClick} />
          </div>
          <div className="p-6 md:p-8 flex flex-col" style={{ background: "hsl(40 25% 92%)" }}>
            <AboutCardBack
              data={journey}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutPopup;

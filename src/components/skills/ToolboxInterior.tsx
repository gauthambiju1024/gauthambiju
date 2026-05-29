import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteData";

interface Skill {
  name: string;
  context: string;
  project?: string;
}

interface SkillGroup {
  title: string;
  icon?: "wrench" | "gear" | "caliper";
  skills: Skill[];
}

const WrenchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
  </svg>
);
const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
const CaliperIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="20" height="4" />
    <line x1="6" y1="10" x2="6" y2="14" />
    <line x1="10" y1="10" x2="10" y2="14" />
    <line x1="14" y1="10" x2="14" y2="14" />
    <line x1="18" y1="10" x2="18" y2="14" />
    <rect x="8" y="6" width="3" height="12" />
  </svg>
);

const renderIcon = (k?: string) => {
  if (k === "gear") return <GearIcon />;
  if (k === "caliper") return <CaliperIcon />;
  return <WrenchIcon />;
};

const DEFAULT_GROUPS: SkillGroup[] = [
  {
    title: "Product", icon: "wrench",
    skills: [
      { name: "User Research", context: "Conducted interviews and surveys to validate product hypotheses", project: "Homeofarm" },
      { name: "PRDs", context: "Wrote detailed product requirement documents with user stories and acceptance criteria", project: "Drishti" },
      { name: "Behavioral Design", context: "Applied behavioral psychology principles to improve engagement", project: "Classy" },
      { name: "Information Architecture", context: "Structured complex data flows into intuitive navigation systems", project: "Vaidya" },
      { name: "Prototyping", context: "Built interactive prototypes for user testing and stakeholder buy-in" },
      { name: "Product Strategy", context: "Defined product vision, roadmaps, and prioritization frameworks" },
    ],
  },
  {
    title: "Technical", icon: "gear",
    skills: [
      { name: "React", context: "Built production applications with modern React patterns", project: "Homeofarm" },
      { name: "Supabase", context: "Designed backend architectures with auth, storage, and real-time", project: "Homeofarm" },
      { name: "AI Workflows", context: "Integrated AI models into product features and automation pipelines", project: "Drishti" },
      { name: "API Integration", context: "Connected complex third-party services and data sources" },
      { name: "No-code Automation", context: "Built workflows using Zapier, Make, and similar tools" },
      { name: "Prompt Design", context: "Crafted effective prompts for LLMs in production contexts" },
    ],
  },
  {
    title: "Business", icon: "caliper",
    skills: [
      { name: "Market Analysis", context: "Analyzed market size, competition, and positioning for new products" },
      { name: "Growth Thinking", context: "Identified growth levers and designed experiments to test them" },
      { name: "Problem Solving", context: "Applied structured frameworks to break ambiguity into actionable steps" },
      { name: "Prioritization", context: "Used RICE, ICE, and custom frameworks to prioritize backlogs" },
      { name: "Stakeholder Mgmt", context: "Communicated with cross-functional teams and leadership effectively" },
    ],
  },
];

const LABEL_INK = "hsl(40 8% 70%)";
const LABEL_INK_DIM = "hsl(40 6% 52%)";

// Foam-tray top-down look
const FOAM_BG = "hsl(220 8% 9%)";
const FOAM_RECESS = `
  inset 0 4px 10px rgba(0,0,0,0.85),
  inset 0 -1px 0 hsl(220 8% 18%),
  inset 2px 0 6px rgba(0,0,0,0.6),
  inset -2px 0 6px rgba(0,0,0,0.6)
`;
const TOOL_BG = "linear-gradient(135deg, hsl(0 0% 72%) 0%, hsl(0 0% 52%) 50%, hsl(0 0% 38%) 100%)";
const TOOL_BG_DARK = "linear-gradient(135deg, hsl(220 6% 38%) 0%, hsl(220 6% 24%) 50%, hsl(220 6% 16%) 100%)";
const TOOL_BG_BRASS = "linear-gradient(135deg, hsl(38 55% 62%) 0%, hsl(38 50% 44%) 50%, hsl(38 45% 30%) 100%)";

const groupToolStyle = (gi: number) => {
  if (gi === 0) return { background: TOOL_BG_BRASS, clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)" };
  if (gi === 1) return { background: TOOL_BG, clipPath: "polygon(0 30%, 18% 30%, 18% 0, 82% 0, 82% 30%, 100% 30%, 100% 70%, 82% 70%, 82% 100%, 18% 100%, 18% 70%, 0 70%)" };
  return { background: TOOL_BG_DARK, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" };
};

interface Props {
  variant?: "side" | "top";
}

const ToolboxInterior = ({ variant = "side" }: Props) => {
  const { value } = useSiteContent("skills", "groups");
  const [activeSkill, setActiveSkill] = useState<{ group: number; skill: number } | null>(null);

  const groups: SkillGroup[] =
    (value as any)?.groups && Array.isArray((value as any).groups) && (value as any).groups.length > 0
      ? ((value as any).groups as SkillGroup[])
      : DEFAULT_GROUPS;

  if (variant === "top") {
    return (
      <div
        className="grid grid-cols-3 gap-2 h-full w-full p-2"
        style={{
          background: FOAM_BG,
          boxShadow: FOAM_RECESS,
          borderRadius: "3px",
        }}
      >
        {groups.map((group, gi) => (
          <div
            key={group.title + gi}
            className="relative flex flex-col"
            style={{
              background: "hsl(220 8% 11%)",
              boxShadow: `inset 0 3px 8px rgba(0,0,0,0.75), inset 0 -1px 0 hsl(220 8% 16%)`,
              borderRadius: "2px",
              padding: "8px 6px 6px",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span style={{ color: LABEL_INK_DIM }}>{renderIcon(group.icon)}</span>
              <h3
                className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: LABEL_INK }}
              >
                {group.title}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              {group.skills.map((skill, si) => {
                const isActive = activeSkill?.group === gi && activeSkill?.skill === si;
                const ts = groupToolStyle(gi);
                return (
                  <div key={skill.name + si} className="relative">
                    <motion.button
                      className="w-full px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider relative"
                      style={{
                        background: ts.background,
                        clipPath: ts.clipPath,
                        color: gi === 0 ? "hsl(35 30% 12%)" : "hsl(220 6% 8%)",
                        textShadow: gi === 0
                          ? "0 1px 0 hsl(38 55% 70% / 0.6)"
                          : "0 1px 0 hsl(0 0% 80% / 0.3)",
                        filter: isActive
                          ? "drop-shadow(0 4px 6px rgba(0,0,0,0.7)) brightness(1.1)"
                          : "drop-shadow(0 2px 3px rgba(0,0,0,0.6))",
                        cursor: "pointer",
                      }}
                      whileHover={{ y: -2 }}
                      onHoverStart={() => setActiveSkill({ group: gi, skill: si })}
                      onHoverEnd={() => setActiveSkill(null)}
                      onClick={() => setActiveSkill(isActive ? null : { group: gi, skill: si })}
                    >
                      {skill.name}
                    </motion.button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute z-20 left-full ml-2 top-0 w-52 p-3 rounded-sm"
                          style={{
                            background: "hsl(220 8% 12%)",
                            color: "hsl(40 6% 82%)",
                            borderLeft: "2px solid hsl(38 55% 55%)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 hsl(220 8% 20%)",
                          }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <p className="text-[11px] leading-relaxed font-body">{skill.context}</p>
                          {skill.project && (
                            <span
                              className="block mt-1.5 text-[9px] tracking-wider uppercase font-mono"
                              style={{ color: "hsl(38 45% 60%)" }}
                            >
                              Used in: {skill.project}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback (side variant — original)
  return (
    <div className="grid md:grid-cols-3 gap-3 h-full w-full">
      {groups.map((group, gi) => (
        <div
          key={group.title + gi}
          className="rounded-sm p-3 relative"
          style={{
            background: "hsl(220 5% 14%)",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.55), inset 0 -1px 0 hsl(220 6% 24%)",
            border: "1px solid hsl(220 6% 9%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid hsl(220 6% 10%)" }}>
            <span style={{ color: LABEL_INK_DIM }}>{renderIcon(group.icon)}</span>
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ color: LABEL_INK }}>
              {group.title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map((skill, si) => (
              <button
                key={skill.name + si}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[3px]"
                style={{ background: "hsl(220 5% 20%)", color: "hsl(40 6% 74%)", border: "1px solid hsl(220 5% 12%)" }}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolboxInterior;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  name: string;
  context: string;
  project?: string;
}

interface SkillGroup {
  title: string;
  Icon: () => JSX.Element;
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
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
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

const skillGroups: SkillGroup[] = [
  {
    title: "Product",
    Icon: WrenchIcon,
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
    title: "Technical",
    Icon: GearIcon,
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
    title: "Business",
    Icon: CaliperIcon,
    skills: [
      { name: "Market Analysis", context: "Analyzed market size, competition, and positioning for new products" },
      { name: "Growth Thinking", context: "Identified growth levers and designed experiments to test them" },
      { name: "Problem Solving", context: "Applied structured frameworks to break ambiguity into actionable steps" },
      { name: "Prioritization", context: "Used RICE, ICE, and custom frameworks to prioritize backlogs" },
      { name: "Stakeholder Mgmt", context: "Communicated with cross-functional teams and leadership effectively" },
    ],
  },
];

// Material palette — warm greyscale
const TRAY_BG = "linear-gradient(180deg, hsl(220 6% 22%) 0%, hsl(220 6% 16%) 100%)";
const WELL_BG = "hsl(220 5% 14%)";
const WELL_SHADOW = "inset 0 2px 6px rgba(0,0,0,0.55), inset 0 -1px 0 hsl(220 6% 24%)";
const LABEL_INK = "hsl(40 8% 70%)";
const LABEL_INK_DIM = "hsl(40 6% 52%)";
const CHIP_BG = "hsl(220 5% 20%)";
const CHIP_BORDER = "hsl(220 5% 12%)";
const CHIP_HIGHLIGHT = "inset 0 1px 0 hsl(220 5% 30%), 0 1px 2px rgba(0,0,0,0.35)";

const SkillsToolbox = () => {
  const [activeSkill, setActiveSkill] = useState<{ group: number; skill: number } | null>(null);

  return (
    <section className="py-6 md:py-8 h-full flex flex-col">
      <div className="px-6 md:px-12 flex items-center gap-3 mb-3">
        <div className="h-px flex-1" style={{ background: "hsl(220 5% 28%)" }} />
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: LABEL_INK_DIM }}>Skills</span>
      </div>

      <div className="px-6 md:px-12 mb-4">
        <h2 className="font-serif-display text-2xl md:text-3xl" style={{ color: "hsl(40 8% 82%)" }}>
          The Toolbox
        </h2>
        <p className="mt-1 font-body text-xs" style={{ color: LABEL_INK_DIM }}>
          Tools I use, not buzzwords I list. Hover for context.
        </p>
      </div>

      {/* Tray */}
      <div
        className="mx-6 md:mx-12 rounded-md p-3 md:p-4 flex-1 min-h-0"
        style={{
          background: TRAY_BG,
          border: "1px solid hsl(220 6% 10%)",
          boxShadow:
            "inset 0 1px 0 hsl(220 6% 32%), inset 0 -1px 0 hsl(220 8% 8%), 0 12px 30px -10px rgba(0,0,0,0.5)",
          backgroundImage: `${TRAY_BG}, repeating-linear-gradient(180deg, transparent 0 2px, rgba(255,255,255,0.015) 2px 3px)`,
        }}
      >
        <div className="grid md:grid-cols-3 gap-3 h-full">
          {skillGroups.map((group, gi) => {
            const Icon = group.Icon;
            return (
              <motion.div
                key={group.title}
                className="rounded-sm p-3 relative"
                style={{
                  background: WELL_BG,
                  boxShadow: WELL_SHADOW,
                  border: "1px solid hsl(220 6% 9%)",
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.08, duration: 0.4 }}
              >
                {/* Engraved label plate */}
                <div
                  className="flex items-center gap-2 mb-3 pb-2"
                  style={{ borderBottom: "1px solid hsl(220 6% 10%)", boxShadow: "0 1px 0 hsl(220 6% 22%)" }}
                >
                  <span style={{ color: LABEL_INK_DIM }}>
                    <Icon />
                  </span>
                  <h3
                    className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase"
                    style={{
                      color: LABEL_INK,
                      textShadow: "0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 hsl(220 6% 26%)",
                    }}
                  >
                    {group.title}
                  </h3>
                  <span
                    className="ml-auto text-[9px] font-mono w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      color: LABEL_INK_DIM,
                      background: "hsl(220 5% 12%)",
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -1px 0 hsl(220 6% 22%)",
                    }}
                  >
                    {group.skills.length}
                  </span>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill, si) => {
                    const isActive = activeSkill?.group === gi && activeSkill?.skill === si;
                    return (
                      <div key={skill.name} className="relative">
                        <motion.button
                          className="px-2.5 py-1 text-[11px] font-mono rounded-[3px] transition-all duration-150"
                          style={{
                            background: isActive ? "hsl(220 5% 16%)" : CHIP_BG,
                            color: isActive ? "hsl(40 8% 88%)" : "hsl(40 6% 74%)",
                            border: `1px solid ${CHIP_BORDER}`,
                            boxShadow: isActive
                              ? "inset 0 1px 3px rgba(0,0,0,0.6)"
                              : CHIP_HIGHLIGHT,
                          }}
                          whileHover={{ y: -1 }}
                          onHoverStart={() => setActiveSkill({ group: gi, skill: si })}
                          onHoverEnd={() => setActiveSkill(null)}
                          onClick={() =>
                            setActiveSkill(isActive ? null : { group: gi, skill: si })
                          }
                        >
                          {skill.name}
                        </motion.button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              className="absolute z-20 bottom-full left-0 mb-2 w-52 p-3 rounded-sm"
                              style={{
                                background: "hsl(220 8% 12%)",
                                color: "hsl(40 6% 82%)",
                                borderLeft: "2px solid hsl(38 55% 55%)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 hsl(220 8% 20%)",
                              }}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsToolbox;

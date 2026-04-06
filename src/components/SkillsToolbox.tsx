import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  name: string;
  context: string;
  project?: string;
}

interface SkillGroup {
  title: string;
  icon: string;
  skills: Skill[];
}

const skillGroups: SkillGroup[] = [
  {
    title: "Product",
    icon: "◎",
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
    icon: "⬡",
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
    icon: "△",
    skills: [
      { name: "Market Analysis", context: "Analyzed market size, competition, and positioning for new products" },
      { name: "Growth Thinking", context: "Identified growth levers and designed experiments to test them" },
      { name: "Problem Solving", context: "Applied structured frameworks to break ambiguity into actionable steps" },
      { name: "Prioritization", context: "Used RICE, ICE, and custom frameworks to prioritize backlogs" },
      { name: "Stakeholder Mgmt", context: "Communicated with cross-functional teams and leadership effectively" },
    ],
  },
];

const SkillsToolbox = () => {
  const [activeSkill, setActiveSkill] = useState<{ group: number; skill: number } | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />
        <span className="dimension-label">Skills</span>
      </div>

      <div className="px-6 md:px-16 mb-10">
        <h2 className="font-serif-display text-3xl md:text-4xl leading-tight" style={{ color: 'hsl(var(--paper))' }}>
          The Toolbox
        </h2>
        <p className="mt-3 font-body text-sm" style={{ color: 'hsl(var(--paper) / 0.4)' }}>
          Tools I use, not buzzwords I list. Hover for context.
        </p>
      </div>

      <div className="px-6 md:px-16 grid md:grid-cols-3 gap-5">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            className="rounded-sm border p-6 relative overflow-hidden"
            style={{
              background: 'hsl(160 18% 12%)',
              borderColor: 'hsl(var(--ruler-accent) / 0.15)',
              boxShadow: 'inset 0 1px 0 hsl(var(--mat-grid) / 0.2), inset 0 -1px 0 hsl(0 0% 0% / 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            {/* Compartment header */}
            <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: '1px solid hsl(var(--ruler-accent) / 0.12)' }}>
              <span className="text-lg opacity-60">{group.icon}</span>
              <h3 className="font-display text-sm font-semibold tracking-wide uppercase" style={{ color: 'hsl(var(--paper) / 0.75)' }}>{group.title}</h3>
              <span className="ml-auto text-[10px] font-mono" style={{ color: 'hsl(var(--ruler-accent) / 0.4)' }}>{group.skills.length}</span>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill, si) => (
                <div key={skill.name} className="relative">
                  <motion.button
                    className="px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors duration-200"
                    style={{
                      borderColor: activeSkill?.group === gi && activeSkill?.skill === si
                        ? 'hsl(var(--ruler-accent) / 0.4)'
                        : 'hsl(var(--mat-grid) / 0.3)',
                      background: activeSkill?.group === gi && activeSkill?.skill === si
                        ? 'hsl(var(--ruler-accent) / 0.1)'
                        : 'transparent',
                      color: activeSkill?.group === gi && activeSkill?.skill === si
                        ? 'hsl(var(--ruler-accent))'
                        : 'hsl(var(--paper) / 0.5)',
                    }}
                    onHoverStart={() => setActiveSkill({ group: gi, skill: si })}
                    onHoverEnd={() => setActiveSkill(null)}
                    onClick={() => setActiveSkill(
                      activeSkill?.group === gi && activeSkill?.skill === si ? null : { group: gi, skill: si }
                    )}
                  >
                    {skill.name}
                  </motion.button>

                  <AnimatePresence>
                    {activeSkill?.group === gi && activeSkill?.skill === si && (
                      <motion.div
                        className="absolute z-20 bottom-full left-0 mb-2 w-52 p-3 rounded-sm shadow-lg paper-card"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <p className="text-[11px] leading-relaxed" style={{ color: 'hsl(var(--card-foreground))' }}>{skill.context}</p>
                        {skill.project && (
                          <span className="block mt-1.5 text-[9px] tracking-wider uppercase" style={{ color: 'hsl(var(--ruler-accent) / 0.6)' }}>
                            Used in: {skill.project}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsToolbox;

import { AnimatePresence, motion } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { STATION_META, ConsoleAction } from "./actionsByStation";
import { useToast } from "@/hooks/use-toast";

interface Props {
  activeId: FrameId;
}

const handleClick = (a: ConsoleAction, toast: ReturnType<typeof useToast>["toast"]) => {
  if (a.action === "copy-email") {
    navigator.clipboard?.writeText("hello@gauthambiju.com").then(() => {
      toast({ title: "Email copied", description: "hello@gauthambiju.com" });
    });
    return;
  }
  if (!a.href) return;
  if (a.href.startsWith("#")) {
    const el = document.getElementById(a.href.slice(1));
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    return;
  }
  window.open(a.href, "_blank", "noopener,noreferrer");
};

const ActionDock = ({ activeId }: Props) => {
  const { toast } = useToast();
  const meta = STATION_META[activeId];

  return (
    <div className="h-full flex items-center px-3 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar"
        >
          {meta.actions.map((a) => {
            const isPrimary = a.primary;
            const isDisabled = !a.href && !a.action;
            return (
              <button
                key={a.label}
                onClick={() => !isDisabled && handleClick(a, toast)}
                disabled={isDisabled}
                className={`
                  group relative flex items-center gap-2 h-9 px-3.5
                  rounded-[3px] border transition-all duration-150
                  whitespace-nowrap
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-[2px] hover:border-amber-400/70 cursor-pointer"}
                  ${isPrimary
                    ? "border-amber-400/60 bg-amber-400/[0.04]"
                    : "border-stone-600/50 bg-stone-900/30"}
                `}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {isPrimary && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "hsl(43 74% 55%)", boxShadow: "0 0 4px hsl(43 74% 55%)" }}
                  />
                )}
                <span className="text-[12.5px] tracking-wide text-stone-100">{a.label}</span>
                <span
                  className="absolute left-2 right-2 bottom-[3px] h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  style={{ background: "hsl(38 60% 52% / 0.8)" }}
                />
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ActionDock;

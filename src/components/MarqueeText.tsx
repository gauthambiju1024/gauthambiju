import { useSiteContent } from "@/hooks/useSiteData";

const defaultItems = ["Developer", "Designer", "Creator", "Problem Solver", "Tech Enthusiast"];

const MarqueeText = () => {
  const { value } = useSiteContent('marquee', 'items');
  const items = value as string[] | null ?? defaultItems;

  return;



















};

export default MarqueeText;
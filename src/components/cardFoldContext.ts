import { createContext, useContext } from "react";
import { MotionValue, useMotionValue } from "framer-motion";

/**
 * Shared progress signal driven by AboutToProjectsBridge and consumed by
 * HeroIdBadge. 0 = card still in About; 1 = card has tri-folded into a
 * spine and landed in projects-shelf-landing-slot.
 */
export const CardFoldContext = createContext<MotionValue<number> | null>(null);

export const useCardFold = () => useContext(CardFoldContext);

// Helper hook for the provider to create the value with a stable identity.
export const useCardFoldValue = () => useMotionValue(0);

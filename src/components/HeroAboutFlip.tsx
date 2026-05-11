import { useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, useMotionValue, motion } from "framer-motion";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import BlueprintFrame from "./desk/frames/BlueprintFrame";
import BusinessCardFrame from "./desk/frames/BusinessCardFrame";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";

/**
 * Pinned scroll-driven flip:
 * 0.00–0.30  Hero panel visible, real ID card (in HeroSection) shown.
 * 0.30–0.55  Morph card appears at the hero card's screen position, animates
 *            to viewport center, scales up to roughly fill the panel. Hero
 *            content fades out. Real hero card is hidden.
 * 0.55–0.80  Card 3D-flips on Y axis. Back face = About panel.
 * 0.80–1.00  About panel settled, ready to scroll out.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const { value: heroData } = useSiteContent("hero", "main");
  const hero = heroData as { name?: string; portrait?: string; badge?: { name?: string; title?: string; idLabel?: string } } | null;
  const portraitSrc = hero?.portrait || heroPortrait;
  const badgeName = hero?.badge?.name || "GAUTHAM BIJU";
  const badgeTitle = hero?.badge?.title || "BUILDER · THINKER · MAKER";
  const badgeId = hero?.badge?.idLabel || "ID · 0024";

  // Hide the real hero ID card (rendered by HeroSection portal) once morph begins.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    document.body.dataset.heroCardHidden = v > 0.25 ? "1" : "0";
  });
  useEffect(() => () => { delete document.body.dataset.heroCardHidden; }, []);

  // Morph card transforms.
  // It starts at the hero card's resting position (top: 90, right: 32, w: 200, h: ~330, rotated 8deg).
  // We position it absolute relative to the sticky stage, so right:32px / top:90px reproduces the resting spot.
  const morphOpacity   = useTransform(scrollYProgress, [0.25, 0.32], [0, 1]);
  const morphTx        = useTransform(scrollYProgress, [0.32, 0.55], ["0%", "-50%"]);
  const morphTy        = useTransform(scrollYProgress, [0.32, 0.55], ["0%", "-50%"]);
  // We move the card from its right/top corner toward viewport center via positioning trick.
  const morphLeft      = useTransform(scrollYProgress, [0.32, 0.55], ["calc(100% - 232px)", "50%"]);
  const morphTop       = useTransform(scrollYProgress, [0.32, 0.55], ["90px", "50%"]);
  const morphScale     = useTransform(scrollYProgress, [0.32, 0.55], [1, 3.4]);
  const morphRotate    = useTransform(scrollYProgress, [0.32, 0.55], [8, 0]);
  const morphRotateY   = useTransform(scrollYProgress, [0.55, 0.80], [0, 180]);

  const heroFade       = useTransform(scrollYProgress, [0.30, 0.55], [1, 0]);
  // Counter-rotate the back face content so that after rotateY(180) it reads correctly.
  const backOpacity    = useTransform(scrollYProgress, [0.55, 0.70], [0, 1]);
  const frontOpacity   = useTransform(scrollYProgress, [0.60, 0.72], [1, 0]);

  return (
    <section ref={pinRef} id="home-about-pin" style={{ height: "200vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div className="relative w-full h-full" style={{ perspective: 1600 }}>
            {/* Hero panel (with anchor for #home) */}
            <motion.div id="home" className="absolute inset-0" style={{ opacity: heroFade }}>
              <BlueprintFrame t={tDummy} active={true}>
                <HeroSection />
              </BlueprintFrame>
            </motion.div>

            {/* About panel sits behind, becomes visible as flip nears 90deg */}
            <motion.div id="about" className="absolute inset-0" style={{ opacity: backOpacity, pointerEvents: "none" }}>
              <BusinessCardFrame t={tDummy} active={true}>
                <AboutSection />
              </BusinessCardFrame>
            </motion.div>

            {/* Morph card */}
            <motion.div
              className="absolute hidden md:block pointer-events-none"
              style={{
                width: 200,
                height: 320,
                top: morphTop,
                left: morphLeft,
                x: morphTx,
                y: morphTy,
                scale: morphScale,
                rotate: morphRotate,
                rotateY: morphRotateY,
                opacity: morphOpacity,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                zIndex: 40,
                willChange: "transform",
              }}
            >
              {/* Front face — replica of the hero ID card */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: "hsl(40 25% 92%)",
                  borderRadius: 4,
                  padding: "12px 12px 16px",
                  boxShadow:
                    "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
                  opacity: frontOpacity,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 38,
                    height: 7,
                    borderRadius: 4,
                    background: "hsl(160 30% 6%)",
                    boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 130,
                    marginTop: 14,
                    marginBottom: 12,
                    backgroundImage: `url(${portraitSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)",
                    filter: "grayscale(1) contrast(1.2)",
                  }}
                />
                <div
                  className="font-mono"
                  style={{ fontSize: 12, fontWeight: 700, color: "hsl(160 20% 16%)", letterSpacing: "1.3px", marginBottom: 5, lineHeight: 1.2 }}
                >
                  {badgeName}
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: 8.5, color: "hsl(160 15% 30% / 0.85)", letterSpacing: "1px", lineHeight: 1.45, whiteSpace: "pre-line" }}
                >
                  {badgeTitle.replace(/\\n/g, "\n")}
                </div>
                <div style={{ width: "100%", borderTop: "1px dashed hsl(160 20% 16% / 0.3)", margin: "12px 0 10px" }} />
                <div className="flex items-end justify-between w-full">
                  <span className="font-mono" style={{ fontSize: 8.5, color: "hsl(160 20% 16% / 0.75)", letterSpacing: "1.3px" }}>
                    {badgeId}
                  </span>
                  <div
                    aria-hidden
                    style={{
                      width: 38,
                      height: 10,
                      opacity: 0.85,
                      background:
                        "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)",
                    }}
                  />
                </div>
              </motion.div>
              {/* Back face — empty placeholder; the real About panel underneath is what becomes visible */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "hsl(40 25% 92%)",
                  borderRadius: 4,
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAboutFlip;

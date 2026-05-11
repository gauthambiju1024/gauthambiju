import { HOTSPOTS } from "./hotspots";

const MobileHubCards = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div style={{ padding: "24px 16px", display: "grid", gap: 12 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 7vw, 40px)",
          color: "hsl(40 30% 92%)",
          margin: 0,
        }}
      >
        Builder's Desk
      </h2>
      <p
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 12,
          color: "hsl(40 20% 70%)",
          margin: "0 0 8px",
          letterSpacing: "1.2px",
        }}
      >
        CHOOSE WHAT TO EXPLORE
      </p>
      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          onClick={() => scrollTo(h.target)}
          style={{
            textAlign: "left",
            padding: "16px 18px",
            border: "1px solid hsl(40 25% 92% / 0.25)",
            background: "hsl(160 30% 8% / 0.6)",
            color: "hsl(40 30% 92%)",
            borderRadius: 4,
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {h.label}
        </button>
      ))}
    </div>
  );
};

export default MobileHubCards;

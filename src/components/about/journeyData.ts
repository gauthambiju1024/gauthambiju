export type JourneyEntry = {
  id: string;
  label: string;
  subtitle: string;
  period: string;
  location: { lat: number; lng: number; name: string };
  role: string;
  work: string;
  skills: string[];
  takeaway: string;
};

export const journey: JourneyEntry[] = [
  {
    id: "iitgn",
    label: "IIT Gandhinagar",
    subtitle: "Mechanical Engineering · Electrical Minor",
    period: "2018–2022",
    location: { lat: 23.2156, lng: 72.6369, name: "Gandhinagar, IN" },
    role: "B.Tech Student",
    work: "Built fundamentals across mechanical systems and electrical engineering. Worked on student-run projects spanning robotics, signal processing, and embedded systems.",
    skills: ["Systems Thinking", "CAD", "Embedded", "Math"],
    takeaway: "Learned to think rigorously and reason from first principles.",
  },
  {
    id: "accenture",
    label: "Accenture",
    subtitle: "IAM / Technology Internship",
    period: "2021",
    location: { lat: 12.9716, lng: 77.5946, name: "Bengaluru, IN" },
    role: "Technology Intern",
    work: "Worked on Identity & Access Management workflows for an enterprise client — automation, role design, and access reviews.",
    skills: ["IAM", "Automation", "Enterprise Process"],
    takeaway: "Saw how scale changes the texture of every problem.",
  },
  {
    id: "crayon",
    label: "Crayon Software Experts",
    subtitle: "Marketplaces Internship",
    period: "2022",
    location: { lat: 25.2048, lng: 55.2708, name: "Dubai, AE" },
    role: "Marketplaces Intern",
    work: "Worked across cloud marketplace operations — partner enablement, listing workflows, and go-to-market motions for software products.",
    skills: ["Cloud GTM", "Partner Ops", "Marketplaces"],
    takeaway: "Distribution is product. The pipe matters as much as the thing.",
  },
  {
    id: "iimi",
    label: "IIM Indore",
    subtitle: "MBA · Product, Strategy, Business",
    period: "2023–2025",
    location: { lat: 22.7196, lng: 75.8577, name: "Indore, IN" },
    role: "MBA Candidate",
    work: "Sharpened product, strategy, and business muscle. Led case competitions, ran live consulting projects, and designed product solutions across domains.",
    skills: ["Product", "Strategy", "Business", "Frameworks"],
    takeaway: "Strategy is choosing what not to do. Same with product.",
  },
  {
    id: "bny",
    label: "BNY Mellon",
    subtitle: "Early Talent Analyst · Risk & Compliance",
    period: "2025–",
    location: { lat: 19.076, lng: 72.8777, name: "Mumbai, IN" },
    role: "Analyst",
    work: "Operating in Risk & Compliance — translating regulation into operational controls and process design. Building muscle in finance, controls, and accountability.",
    skills: ["Risk", "Compliance", "Controls", "Finance"],
    takeaway: "Trust compounds. Process is how trust scales.",
  },
];

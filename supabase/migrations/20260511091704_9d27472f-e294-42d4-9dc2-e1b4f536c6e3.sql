INSERT INTO public.site_content (section, key, value)
VALUES (
  'about', 'journey',
  '{
    "overview": {
      "blurb": "Product-minded builder at the intersection of tech, business & design. I want to know why something should exist before figuring out how to build it.",
      "traits": ["Systems Thinking", "Fast Learning", "Structured Problem Solving"],
      "focus": ["Product", "AI Workflows", "Business × UX"],
      "quickFacts": [
        {"label": "Based", "value": "India"},
        {"label": "Edu", "value": "IIM Indore"},
        {"label": "Focus", "value": "Product"},
        {"label": "Now", "value": "Building"}
      ],
      "footer": "Build with intent. Ship what matters."
    },
    "education": [
      {"id": "iimi", "title": "MBA", "org": "IIM Indore", "period": "2023–2025", "location": "Indore, India", "markerId": "indore", "summary": "Product, Strategy & Business.", "details": "Sharpened product thinking, business acumen, and the intersection of strategy with execution."},
      {"id": "iitgn", "title": "B.Tech", "org": "IIT Gandhinagar", "period": "2018–2022", "location": "Ahmedabad, India", "markerId": "ahmedabad", "summary": "Engineering fundamentals.", "details": "Learned to think in systems, build with rigor, and approach problems analytically."},
      {"id": "school", "title": "Schooling", "org": "Kerala & Dubai", "period": "2006–2018", "location": "Kerala / Dubai", "markerId": "kerala", "summary": "Formative years.", "details": "Built curiosity, discipline, and a habit of questioning why things work the way they do."}
    ],
    "experience": [
      {"id": "now", "title": "Building", "org": "Independent", "period": "2025–", "location": "India", "summary": "Product · AI · Portfolio.", "details": "Building real products, exploring AI workflows, and documenting the journey."},
      {"id": "accenture", "title": "Strategy & Tech Consultant", "org": "Accenture", "period": "2022–2023", "location": "India", "summary": "Enterprise consulting.", "details": "Exposure to enterprise-scale problem solving, stakeholder management, and structured delivery."}
    ],
    "markers": [
      {"id": "dubai", "location": [25.2048, 55.2708], "label": "Dubai"},
      {"id": "ahmedabad", "location": [23.0225, 72.5714], "label": "Ahmedabad"},
      {"id": "kerala", "location": [9.9312, 76.2673], "label": "Kerala"},
      {"id": "indore", "location": [22.7196, 75.8577], "label": "Indore"}
    ]
  }'::jsonb
)
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;
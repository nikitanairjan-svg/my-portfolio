import {
  axFlowBg,
  axFlowVisual1,
  axFlowVisual2,
  shipthisBg,
  shipthisVisual,
  hcRoboticsBg,
  hcRoboticsVisual,
  bloomCraftBg,
  bloomCraftVisual,
} from "../assets";

/* Case studies, in the order they stack.
   theme.card: card background · theme.tone: "light" | "dark" text
   media.kind: "phones" (tall mobile screens) | "screen" (one desktop screen in a frame)
   details: PLACEHOLDER content for the detail page — replace with the real case study.
   inProgress: the card still shows, marked as in progress, but nothing links
   to the study and its URL sends visitors back to the case studies. Delete the
   flag to publish it; `!import.meta.env.DEV` keeps a study open locally while
   it is being written. */
export const caseStudies = [
  {
    slug: "shipthis",
    company: "Divami",
    title: "ShipThis",
    description: "Making freight rate search faster and easier for a smoother global shipping experience.",
    tags: ["Product Design", "SaaS", "Logistics"],
    theme: { card: "#DCE7F1", tone: "light" },
    media: { kind: "screen", frame: "dark", bg: shipthisBg, screens: [shipthisVisual], alt: ["Shipthis rate search and quote builder"] },
    note: ["6 → 4 steps", "35% faster", "quote creation"],
    details: { platform: "Web app" },
  },
  {
    slug: "hc-robotics",
    company: "Divami",
    title: "HC Robotics",
    description: "Making complex geospatial tools easier to navigate.",
    tags: ["Product Design", "Geospatial", "3D Visualization"],
    theme: { card: "#18201E", tone: "dark" },
    media: { kind: "screen", frame: "dark", bg: hcRoboticsBg, screens: [hcRoboticsVisual], alt: ["HC Robotics pole measurement workspace"] },
    note: ["20+ tools", "simplified into", "one workflow"],
    details: { platform: "Web app" },
  },
  {
    slug: "ax-flow",
    company: "TriNet",
    title: "AX Flow",
    description: "Designing an AI assistant that helps employees get HR tasks done through conversation.",
    tags: ["AI Experience", "Product Design", "Enterprise"],
    theme: { card: "#EBE7DF", tone: "light" },
    media: {
      kind: "phones",
      bg: axFlowBg,
      screens: [axFlowVisual1, axFlowVisual2],
      alt: ["AX chat confirming a time off request", "Choosing a time off type in AX"],
    },
    note: ["From questions", "to actions."],
    details: { platform: "Mobile app" },
  },
  {
    slug: "bloom-craft",
    company: "Personal project",
    title: "Bloom Craft",
    description: "A digital bouquet builder I designed and vibe-coded from scratch.",
    tags: ["Product Design", "Visual Design", "Vibe Coding"],
    theme: { card: "#F6E4E1", tone: "light" },
    media: { kind: "screen", frame: "light", bg: bloomCraftBg, screens: [bloomCraftVisual], alt: ["Bloom Craft bouquet builder"] },
    note: ["An idea.", "A weekend.", "A fully working product."],
    details: { platform: "Web" },
  },
];

export const studyHref = (slug) => `#/work/${slug}`;

/* The order the cards stack in is fixed (ShipThis, HC Robotics, AX Flow, Bloom Craft) and the
   archive depends on it, so the reading order through the studies is kept as a
   separate chain rather than being taken from the array. */
const NEXT_STUDY = {
  shipthis: "hc-robotics",
  "hc-robotics": "ax-flow",
  "ax-flow": "bloom-craft",
  "bloom-craft": "shipthis",
};

// Follows the chain past any study still in progress.
export function nextStudy(slug) {
  let next = NEXT_STUDY[slug];
  for (let i = 0; i < caseStudies.length; i++) {
    const study = caseStudies.find((s) => s.slug === next);
    if (study && !study.inProgress) return study;
    next = NEXT_STUDY[next];
  }
  return caseStudies.find((s) => !s.inProgress);
}

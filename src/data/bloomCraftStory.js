import { bloomCraftBg } from "../assets";

/* Bloom Craft.

   The structure is in place; the writing is not. Section ids match the other
   studies so switching between the two readings lands on the matching section
   rather than jumping to the top. */

export const bloomCraftStory = {
  cover: {
    src: bloomCraftBg,
    alt: "A wrapped bouquet of pink and white flowers on a sunlit table",
    w: 1672,
    h: 941,
  },
  tagline: "A digital bouquet builder — pick a mood, and the arrangement follows.",
  meta: [
    ["Domain", "E-commerce & Creative"],
    ["Type", "Personal Project"],
    ["Role", "Product & Visual Designer"],
  ],

  views: [
    {
      id: "glance",
      label: "Quick View",
      note: "1–2 min read",
      sections: [
        {
          id: "overview",
          navLabel: "Overview",
          title: "Overview",
          blocks: [
            { type: "note", text: "This case study is still being written. The structure below is in place and the content will be replaced." },
            {
              type: "lead",
              text: "Bloom Craft is a tool for designing a bouquet that actually means something — choose the flowers, arrange them, and shape the whole thing around a mood.",
            },
            {
              type: "text",
              text: "The experience leads with feeling rather than catalogue: colour and mood guide the aesthetic choices, and the arrangement builds up visually as you go.",
            },
          ],
        },
        {
          id: "problem",
          navLabel: "Problem",
          title: "The Problem",
          blocks: [
            { type: "lead", text: "Buying flowers online means picking someone else's arrangement off a grid." },
            {
              type: "list",
              items: [
                "Existing delivery apps offer very little real customisation",
                "Pre-set arrangements rarely feel personal to the occasion",
                "People think in moods and occasions, not in flower names",
                "There is no intuitive way to see an arrangement before committing to it",
              ],
            },
          ],
        },
        {
          id: "solution",
          navLabel: "Solution",
          title: "The Solution",
          blocks: [
            { type: "lead", text: "Start with the feeling, and let the flowers follow from it." },
            {
              type: "list",
              items: [
                "A mood-led entry point instead of a product grid",
                "Flower suggestions that follow from the chosen mood",
                "A visual builder with a live preview of the arrangement",
                "Colour guidance woven into the choices rather than bolted on",
              ],
            },
          ],
        },
        {
          id: "decisions",
          navLabel: "Key decisions",
          title: "Key Design Decisions",
          blocks: [
            {
              type: "cards",
              items: [
                { title: "Mood as the entry point", text: "The first question is how it should feel, not which stem to buy." },
                { title: "Live preview", text: "Every change shows up immediately in the arrangement." },
                { title: "Colour guidance", text: "Palette help offered in passing, never as a lecture." },
                { title: "A deliberately small toolset", text: "Few enough controls that arranging stays playful." },
              ],
            },
          ],
        },
        {
          id: "outcome",
          navLabel: "Outcome",
          title: "Outcome & Reflection",
          blocks: [
            {
              type: "lead",
              text: "A personal project, designed and vibe-coded end to end — a chance to work on something expressive rather than enterprise.",
            },
            { type: "status", text: "Outcome metrics to be confirmed" },
          ],
        },
      ],
    },

    {
      id: "full",
      label: "Full process",
      note: "Comprehensive",
      sections: [
        {
          id: "overview",
          navLabel: "Overview",
          title: "Overview",
          blocks: [
            { type: "note", text: "This case study is still being written. The structure below is in place and the content will be replaced." },
            { type: "lead", text: "A bouquet builder that starts from a mood, designed and built solo." },
            {
              type: "facts",
              items: [
                ["Users", "People buying flowers for someone they know well"],
                ["My role", "Product & Visual Designer, and the one who built it"],
                ["Scope", "Concept, visual language, build"],
                ["Platform", "Web"],
              ],
            },
          ],
        },
        {
          id: "context",
          navLabel: "Context",
          title: "Context & Problem",
          blocks: [
            { type: "lead", text: "Flower shopping online is a grid of finished arrangements, and almost none of them are yours." },
            { type: "text", text: "To be written: where the idea came from and what was missing in what already existed." },
          ],
        },
        {
          id: "research",
          navLabel: "Research",
          title: "Research & Discovery",
          blocks: [{ type: "lead", text: "To be written: what people actually want to say with flowers." }],
        },
        {
          id: "insights",
          navLabel: "Insights",
          title: "Insights & Direction",
          blocks: [{ type: "lead", text: "To be written: the insight that moved mood ahead of catalogue." }],
        },
        {
          id: "exploration",
          navLabel: "Exploration",
          title: "Exploration & Ideation",
          blocks: [{ type: "lead", text: "To be written: visual directions explored for the builder and the palette system." }],
        },
        {
          id: "design-decisions",
          navLabel: "Decisions",
          title: "Design Decisions",
          blocks: [
            {
              type: "cards",
              items: [
                { title: "Mood as the entry point", text: "The first question is how it should feel, not which stem to buy." },
                { title: "Live preview", text: "Every change shows up immediately in the arrangement." },
                { title: "Colour guidance", text: "Palette help offered in passing, never as a lecture." },
                { title: "A deliberately small toolset", text: "Few enough controls that arranging stays playful." },
              ],
            },
          ],
        },
        {
          id: "final",
          navLabel: "Final design",
          title: "Final Experience",
          blocks: [{ type: "lead", text: "To be written: the walkthrough, from mood to finished bouquet." }],
        },
        {
          id: "outcome",
          navLabel: "Outcome",
          title: "Outcome & Reflection",
          blocks: [
            { type: "lead", text: "To be written: what the project showed about designing and shipping something alone." },
            { type: "status", text: "Outcome metrics to be confirmed" },
          ],
        },
      ],
    },
  ],
};

export default bloomCraftStory;

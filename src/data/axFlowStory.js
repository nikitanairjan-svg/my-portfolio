import { axFlowHeroCover } from "../assets";

/* AX Flow — the same ten sections as the written-up studies, in the same order:
   at-a-glance, one break into Process, then what it taught.

   The structure is in place; the writing is not, and there are no product
   images yet. Sections that would carry a carousel or a screenshot keep their
   copy alone rather than being padded with placeholder art. */

export const axFlowStory = {
  // the finished cover: scene and typography composed together, shown as-is
  heroLayout: "composite",
  cover: {
    src: axFlowHeroCover,
    alt: "AX Flow open on a phone beside a notebook, showing a conversational time-off request",
    w: 1983,
    h: 793,
  },
  tagline:
    "A conversational AI assistant within the HRMS platform that helps employees quickly find information and complete HR tasks, such as applying for time off, by guiding them through step-by-step flows.",
  meta: [
    ["Domain", "HR Tech"],
    ["Type", "Enterprise SaaS"],
    ["Role", "Product Designer"],
  ],

  sections: [
    {
      id: "summary",
      navLabel: "Summary",
      title: "Project Summary",
      blocks: [
        { type: "note", text: "This case study is still being written. The structure is in place; the content and screens will follow." },
        {
          type: "text",
          text: "AX Flow is an AI-powered HR assistant that lets employees get support through ordinary conversation instead of navigating a portal. It answers routine enquiries and reduces the volume reaching the HR team.",
        },
      ],
    },
    {
      id: "product",
      navLabel: "The product",
      title: "Let's understand the product",
      standfirst: "An assistant that sits where the questions already get asked.",
      blocks: [
        {
          type: "text",
          text: "Employees ask about leave, benefits, policy and payroll in their own words. The assistant answers from the systems that hold the real data, and escalates to a person when the question needs one.",
        },
      ],
    },
    {
      id: "problem",
      navLabel: "Problem",
      title: "Problem",
      standfirst: "Getting a straight answer took far longer than the question deserved.",
      blocks: [
        {
          type: "list",
          items: [
            "Complex portals and documentation for routine answers",
            "HR absorbing a steady volume of repetitive enquiries",
            "No instant path to information outside working hours",
            "Email chains making simple requests slow to resolve",
          ],
        },
      ],
    },
    {
      id: "solution",
      navLabel: "Solution",
      title: "Solution",
      blocks: [
        {
          type: "list",
          marker: "check",
          items: [
            "Natural language questions instead of forms and menus",
            "Real-time answers to the enquiries that come up most",
            "Integration with the HR systems holding the data",
            "A clean handover to a person when one is needed",
          ],
        },
        { type: "status", text: "Content in progress" },
      ],
    },
    {
      id: "features",
      navLabel: "Main features",
      title: "Main Features",
      blocks: [
        {
          type: "cards",
          items: [
            { title: "Conversation over forms", text: "Asking in your own words beats hunting for the right field." },
            { title: "Transparency in answers", text: "The assistant shows where an answer came from." },
            { title: "Clear escalation", text: "A visible, unembarrassing route to a person." },
            { title: "Mobile-first", text: "Most of these questions get asked away from a desk." },
          ],
        },
      ],
    },

    {
      id: "research",
      navLabel: "Research",
      title: "User Research",
      part: "process",
      blocks: [{ type: "text", text: "To be written: interviews, ticket analysis, and the questions that came up most often." }],
    },
    {
      id: "discovery",
      navLabel: "Discovery",
      title: "Discovery & Brainstorming",
      blocks: [
        {
          type: "insightCards",
          items: [
            { title: "Ask, don't navigate", text: "Your own words beat finding the right field on the right screen." },
            { title: "Show the source", text: "An answer you can check is an answer you can trust." },
            { title: "Never a dead end", text: "A visible, unembarrassing route to a person." },
          ],
        },
      ],
    },
    {
      id: "wireframes",
      navLabel: "Wireframes",
      title: "UX Wireframes",
      blocks: [{ type: "text", text: "To be written: the conversation model explored in wireframes before any UI." }],
    },
    {
      id: "ui",
      navLabel: "UI screens",
      title: "UI Screens",
      blocks: [{ type: "text", text: "To be written: the final interface, once the screens are ready to show." }],
    },
    {
      id: "learned",
      navLabel: "What I learned",
      title: "What I Learned",
      accent: true,
      blocks: [
        { type: "text", text: "To be written: measured impact, and what the project taught about designing around an AI that has to admit what it does not know." },
        { type: "status", text: "Outcome metrics to be confirmed" },
      ],
    },
  ],
};

export default axFlowStory;

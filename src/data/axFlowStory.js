import { axFlowBg } from "../assets";

/* AX Flow.

   The structure is in place; the writing is not. Section ids match the other
   studies so switching between the two readings lands on the matching section
   rather than jumping to the top. */

export const axFlowStory = {
  cover: {
    src: axFlowBg,
    alt: "A bright desk with HR handbooks, notes and a laptop",
    w: 1672,
    h: 940,
  },
  tagline: "An AI assistant for HR conversations, simplifying how employees ask for help and get it.",
  meta: [
    ["Domain", "HR Tech"],
    ["Type", "AI Experience"],
    ["Role", "Product Designer"],
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
              text: "AX Flow is an AI-powered HR assistant that lets employees get support through ordinary conversation instead of navigating a portal.",
            },
            {
              type: "text",
              text: "The platform answers routine HR enquiries, reduces the volume of support tickets reaching the HR team, and gives employees a faster way to resolve the questions that come up through the year.",
            },
          ],
        },
        {
          id: "problem",
          navLabel: "Problem",
          title: "The Problem",
          blocks: [
            { type: "lead", text: "Getting a straight answer out of an HR system took far longer than the question deserved." },
            {
              type: "list",
              items: [
                "Employees had to navigate complex portals and documentation to find routine answers",
                "HR teams were absorbing a steady volume of repetitive enquiries",
                "There was no instant path to information outside working hours",
                "Email chains made simple requests slow and easy to lose",
              ],
            },
          ],
        },
        {
          id: "solution",
          navLabel: "Solution",
          title: "The Solution",
          blocks: [
            { type: "lead", text: "A conversational interface that answers in plain language and knows when to step aside." },
            {
              type: "list",
              items: [
                "Natural language queries instead of forms and menus",
                "Real-time answers to the questions that come up most",
                "Integration with the HR systems that hold the real data",
                "A clean handoff to a human when the question needs one",
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
                { title: "Conversation over forms", text: "Asking in your own words beats finding the right field on the right screen." },
                { title: "Transparency in AI answers", text: "The assistant shows where an answer came from, so it can be trusted or questioned." },
                { title: "Clear escalation paths", text: "A visible, unembarrassing route to a person — never a dead end." },
                { title: "Mobile-first", text: "Most of these questions get asked away from a desk." },
              ],
            },
          ],
        },
        {
          id: "outcome",
          navLabel: "Outcome",
          title: "Outcome & Reflection",
          blocks: [
            { type: "lead", text: "Early results point at a meaningful drop in routine support load, with the detail still being gathered." },
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
            { type: "lead", text: "An AI assistant for HR, built so employees can ask a question the way they would ask a colleague." },
            {
              type: "facts",
              items: [
                ["Users", "Employees, HR partners, support leads"],
                ["My role", "Product Designer"],
                ["Scope", "Conversational flows, escalation, mobile experience"],
                ["Platform", "Mobile-first web and app"],
              ],
            },
          ],
        },
        {
          id: "context",
          navLabel: "Context",
          title: "Context & Problem",
          blocks: [
            { type: "lead", text: "The existing route to an answer was a portal, a document library and an email thread." },
            { type: "text", text: "To be written: the before-state, where time was lost, and what that cost both employees and the HR team." },
          ],
        },
        {
          id: "research",
          navLabel: "Research",
          title: "Research & Discovery",
          blocks: [
            { type: "lead", text: "To be written: interviews, ticket analysis and the questions that came up most often." },
          ],
        },
        {
          id: "insights",
          navLabel: "Insights",
          title: "Insights & Direction",
          blocks: [
            { type: "lead", text: "To be written: what the research changed about the direction." },
          ],
        },
        {
          id: "exploration",
          navLabel: "Exploration",
          title: "Exploration & Ideation",
          blocks: [
            { type: "lead", text: "To be written: the directions explored for the conversation model and why one was chosen." },
          ],
        },
        {
          id: "design-decisions",
          navLabel: "Decisions",
          title: "Design Decisions",
          blocks: [
            {
              type: "cards",
              items: [
                { title: "Conversation over forms", text: "Asking in your own words beats finding the right field on the right screen." },
                { title: "Transparency in AI answers", text: "The assistant shows where an answer came from, so it can be trusted or questioned." },
                { title: "Clear escalation paths", text: "A visible, unembarrassing route to a person — never a dead end." },
                { title: "Mobile-first", text: "Most of these questions get asked away from a desk." },
              ],
            },
          ],
        },
        {
          id: "final",
          navLabel: "Final design",
          title: "Final Experience",
          blocks: [
            { type: "lead", text: "To be written: the end-to-end walkthrough, from question to resolution." },
          ],
        },
        {
          id: "outcome",
          navLabel: "Outcome",
          title: "Outcome & Reflection",
          blocks: [
            { type: "lead", text: "To be written: measured impact and what the project taught about designing around an AI that has to admit what it does not know." },
            { type: "status", text: "Outcome metrics to be confirmed" },
          ],
        },
      ],
    },
  ],
};

export default axFlowStory;

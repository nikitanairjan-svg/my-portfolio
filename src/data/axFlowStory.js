import {
  axFlowHeroCover,
  axScreenAsk,
  axScreenBalances,
  axScreenStart,
  axScreenType,
  axScreenDates,
  axScreenDetails,
  axScreenChecking,
  axScreenReview,
  axScreenSubmitted,
  axPatStepDate,
  axPatLinks,
  axPatChips,
  axPatSingleAfter,
} from "../assets";

/* AX Flow: an execution story rather than a discovery one. Phase 1 shipped a
   mobile Time Off flow, and the lasting output was the set of patterns behind
   it, so the page argues in patterns: what AX is, the challenge, the approach,
   the decisions as principles, the interaction library one family at a time,
   the finished journey, and what it led to. No part dividers: one short arc. */

// every phone screen here is a 390 × 851 export
const phone = { w: 390, h: 851 };

// paragraphs that belong together sit 20px apart rather than the default gap
const TIGHT = "mt-5";

export const axFlowStory = {
  heroLayout: "composite",
  cover: {
    src: axFlowHeroCover,
    alt: "AX Flow open on a phone beside a notebook, showing a conversational time-off request",
    w: 2000,
    h: 800,
  },
  tagline:
    "Designing mobile-first HR workflows that turn tedious tasks into seamless experiences.\nPhase 1: Time Off.",
  meta: [
    ["Company", "TriNet"],
    ["Type", "Mobile App"],
    ["Role", "Product Designer"],
  ],

  sections: [
    {
      id: "what",
      navLabel: "What is AX",
      title: "What is AX Flow?",
      blocks: [
        {
          type: "text",
          text: "AX (**Agentic Experience**) represents TriNet's vision for modern employee experiences. Rather than isolated portals for payroll, benefits, and time off, AX unifies critical HR tasks into one mobile-first platform.",
        },
        {
          type: "text",
          gap: TIGHT,
          text: "Employees spend hours navigating HR workflows: checking balances, requesting time off, approving team requests. These tasks are repetitive, frustrating, and pull focus from real work. AX automates and streamlines them.",
        },
        {
          type: "text",
          gap: TIGHT,
          text: "Phase 1 focuses on __Time Off__: a complete mobile experience for viewing balances, requesting leave and tracking approvals. The goal: turn tedious HR tasks into **moments of clarity**.",
        },
      ],
    },
    {
      id: "challenge",
      navLabel: "The challenge",
      title: "The Challenge",
      blocks: [
        { type: "text", text: "Employees struggled to complete Time Off on mobile." },
        {
          type: "list",
          gap: TIGHT,
          items: ["Desktop-optimised interfaces", "Excessive scrolling", "Unclear information hierarchy"],
        },
        { type: "subsection", gap: "mt-8", title: "My role" },
        { type: "text", gap: "mt-2", text: "Designed the __complete mobile Time Off experience__." },
      ],
    },
    {
      id: "approach",
      navLabel: "Design approach",
      title: "Design Approach",
      blocks: [
        {
          type: "insightCards",
          plain: true,
          tall: true,
          items: [
            { title: "Mobile-first interactions", text: "Touch-optimised, minimal scrolling." },
            { title: "Information-first pattern", text: "Balances visible before action." },
            { title: "Reusable components", text: "A library built for future flows." },
          ],
        },
      ],
    },
    {
      id: "decisions",
      navLabel: "Decisions for scale",
      title: "Design Decisions for Scale",
      blocks: [
        {
          type: "axDecisions",
          items: [
            {
              diagram: "ladder",
              title: "Information-first pattern",
              text: "Lead with context: users see balances before choosing an action.",
              screens: [{ src: axScreenBalances, alt: "AX listing time off balances by type before any request is made" }],
            },
            {
              diagram: "disclosure",
              title: "Progressive disclosure",
              text: "One action per screen, so a complex request never becomes a long form.",
              screens: [
                { src: axScreenType, alt: "Step one: choosing the time off type in a bottom drawer", caption: "Type", pos: 100 },
                { src: axScreenDates, alt: "Step two: choosing the date in a calendar drawer", caption: "Dates", pos: 100 },
                { src: axScreenReview, alt: "Step three: a summary card to review and confirm", caption: "Review" },
              ],
            },
            {
              diagram: "thumb",
              title: "Touch-optimised interactions",
              text: "Large tap targets, drawers and pickers: mobile-native, not desktop shrunk down.",
              screens: [{ src: axScreenDates, alt: "The date picker drawer with its drag handle, a date cell and the Done button marked" }],
            },
            {
              diagram: "mapping",
              title: "Reusable component system",
              text: "Built once, __reused across flows__.",
              caption: "Planned reuse from Phase 2 onward.",
            },
          ],
        },
      ],
    },
    {
      id: "library",
      navLabel: "Interaction library",
      title: "The Interaction Library",
      standfirst:
        "Built a reusable component library grounded in Time Off patterns. Each component is documented with use case, limits, UX pattern, and real-world applications.",
      blocks: [
        {
          type: "axDocs",
          footer: "Documented as a system. Phase 1: Time Off. Phase 2+: Approvals, Benefits, Payroll.",
          items: [
            {
              name: "Actions",
              text: "How users trigger workflows.",
              components: ["Primary action", "Secondary action", "Quick-select chips", "Swipe-to-dismiss drawer"],
              screens: [
                { src: axScreenReview, alt: "Confirm & Submit as the primary action, Modify Dates as the secondary", caption: "Primary and secondary", pos: 25 },
                { src: axPatChips, alt: "Full Day and Partial Day offered as quick-select chips", caption: "Quick-select chips" },
                { src: axPatSingleAfter, alt: "A bottom drawer with its drag handle and a Done action", caption: "Drawer and Done", pos: 100 },
              ],
            },
            {
              name: "Input patterns",
              text: "Form inputs optimised for mobile.",
              components: ["Text input", "Date picker", "Radio selection", "Dropdown selector"],
              screens: [
                { src: axScreenBalances, alt: "The chat composer with a request being typed", caption: "Text input", pos: 100 },
                { src: axScreenDates, alt: "A calendar with a month dropdown in a bottom drawer", caption: "Date picker and dropdown", pos: 100 },
                { src: axScreenType, alt: "Time off types as a radio list with days available", caption: "Radio selection", pos: 100 },
              ],
            },
            {
              name: "Information display",
              text: "How we surface data on mobile.",
              components: ["Balance card", "Status badge", "Information row", "List item with action"],
              screens: [
                { src: axScreenBalances, alt: "Time off balances as a card of types and days", caption: "Balance card" },
                { src: axScreenSubmitted, alt: "A submitted request with a Pending Approval badge", caption: "Status badge" },
                { src: axScreenDetails, alt: "Rows for time off type and period, each with its value", caption: "Information rows" },
                { src: axPatLinks, alt: "A benefits answer followed by links to continue", caption: "List with actions" },
              ],
            },
            {
              name: "Multi-step patterns",
              text: "Workflows across multiple screens.",
              components: ["Step indicator", "Review summary", "Confirmation steps", "Success state"],
              screens: [
                { src: axPatStepDate, alt: "A drawer marked 1 of 2 for a two-step change", caption: "Step indicator", pos: 100 },
                { src: axScreenReview, alt: "A summary card to review before submitting", caption: "Review summary" },
                { src: axScreenChecking, alt: "AX showing the steps it is working through", caption: "Confirmation steps" },
                { src: axScreenSubmitted, alt: "Request submitted, with a green check", caption: "Success state" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "experience",
      navLabel: "Final experience",
      title: "Time Off Flow: Mobile Journey",
      standfirst: "Time Off demonstrates __all patterns__: Balance → Request → Confirm → Track.",
      blocks: [
        {
          type: "phoneJourney",
          caption: "The Time Off journey in AX",
          screens: [
            { src: axScreenAsk, caption: "Ask for balances", alt: "The employee asks for their time off balances and AX pulls the details", ...phone },
            { src: axScreenBalances, caption: "View available balances", alt: "AX shows the balance for each time off type", ...phone },
            { src: axScreenStart, caption: "Initiate request", alt: "The employee says they want to take a vacation and AX offers a short form", ...phone },
            { src: axScreenType, caption: "Choose time off type", alt: "A bottom drawer listing time off types with the days available", ...phone },
            { src: axScreenDates, caption: "Select dates", alt: "A calendar in a bottom drawer for choosing the date", ...phone },
            { src: axScreenDetails, caption: "Details filled in", alt: "The request with vacation and 13 September selected", ...phone },
            { src: axScreenChecking, caption: "AX checks balance and policy", alt: "AX shows its steps: checking the balance, the policy, and calculating days", ...phone },
            { src: axScreenReview, caption: "Review and confirm", alt: "A summary card of the request with confirm and modify buttons", ...phone },
            { src: axScreenSubmitted, caption: "Submitted, pending approval", alt: "Request submitted, sent to the manager and marked pending approval", ...phone },
          ],
        },
      ],
    },
    {
      id: "impact",
      navLabel: "Impact & learnings",
      title: "Impact",
      accent: true,
      blocks: [
        {
          type: "text",
          text: "Designed and shipped the Phase 1 Time Off flow in **2 months**. Now in production serving TriNet employees. Interaction library in place to accelerate development of future AX flows (approvals, benefits, payroll, etc.).",
        },
        { type: "subsection", title: "What I Learned" },
        {
          type: "takeaways",
          items: [
            "Mobile constraints = design opportunities. Reducing information made the experience better for all users.",
            "Interaction patterns matter more than individual screens. Reusable components scale design thinking.",
            "Execution within constraints. Balancing product vision with engineering feasibility.",
            "Phase-based approach enables learning. Phase 1 informs Phase 2, 3, and beyond.",
          ],
        },
      ],
    },
  ],
};

export default axFlowStory;

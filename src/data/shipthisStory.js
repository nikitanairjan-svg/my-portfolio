import {
  shipthisCover,
  shipthisForwarderFlow,
  shipthisResearchTimeline,
  shipthisSketch1,
  shipthisSketch2,
  shipthisSketch3,
  shipthisSketch4,
  shipthisUiCompare,
  shipthisUiDetails,
  shipthisUiDocuments,
  shipthisUiMap,
  shipthisUiMessages,
  shipthisUiRateSearch,
  shipthisWireDetails,
  shipthisWireDocuments,
  shipthisWireMap,
  shipthisWireRateSearch,
} from "../assets";

/* The Shipthis case study, in two readings of the same project: a short one and
   the full process. Both hang off the same header and hero.

   Block types the page can render: lead, text, list, facts, cards, decisions,
   steps, metrics, image, gallery. */

export const shipthisStory = {
  cover: {
    src: shipthisCover,
    alt: "A container ship leaving port at dusk",
    w: 1680,
    h: 704,
  },
  // The hero's own line, as written on the reference. The card and the archive
  // folder keep the shorter description from caseStudies.js.
  tagline:
    "Shipthis is a digital platform that helps freight forwarders manage global shipping operations with ease, by automating tasks, tracking shipments, and improving collaboration.",
  meta: [
    ["Domain", "Logistics"],
    ["Type", "SaaS"],
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
            {
              type: "lead",
              text: "ShipThis is a freight rate search platform designed to simplify the complex process of finding competitive shipping rates globally.",
            },
            {
              type: "text",
              text: "The platform serves freight forwarders and logistics companies who need to manage multiple carrier quotes, negotiate pricing, and make data-driven shipping decisions. The design focused on improving usability, efficiency, and automation within the quotation process.",
            },
          ],
        },
        {
          id: "problem",
          navLabel: "Problem",
          title: "The Problem",
          blocks: [
            { type: "text", text: "Freight forwarders faced significant challenges:" },
            {
              type: "list",
              items: [
                "Manual rate searching across multiple vendors was time-consuming and repetitive",
                "No centralized way to compare quotes from different carriers",
                "Pricing negotiations required extensive back-and-forth communication",
                "Decision-making was hampered by scattered information and lack of visual comparison tools",
                "The process created bottlenecks in order fulfillment",
              ],
            },
          ],
        },
        {
          id: "solution",
          navLabel: "Solution",
          title: "The Solution",
          blocks: [
            { type: "text", text: "Redesigned the Quotation Module with:" },
            {
              type: "list",
              items: [
                "Unified rate search interface combining multiple carrier options",
                "Visual quote comparison system showing pricing, timing, and service levels side-by-side",
                "AI-assisted document generation to reduce manual work",
                "Improved information hierarchy and guided workflows",
                "Map-based visualization for route planning",
                "Customizable interfaces for both beginners and power users",
              ],
            },
            {
              type: "image",
              src: shipthisUiRateSearch,
              alt: "Unified rate search across sea, air and land carriers",
              caption: "The redesigned rate search: one query across every carrier and shipping mode.",
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
                {
                  title: "Information Hierarchy First",
                  text: "Restructured complex data into scannable, progressive disclosure to reduce cognitive load for users managing multiple quotes.",
                },
                {
                  title: "AI Integration for Efficiency",
                  text: "Embedded AI assistance for document generation and quote recommendations to eliminate repetitive manual tasks.",
                },
                {
                  title: "Multi-modal Comparison",
                  text: "Introduced visual, tabular, and map-based views so users can analyze quotes in their preferred format.",
                },
                {
                  title: "Guided Workflows",
                  text: "Designed step-by-step flows that adapt to user expertise level, supporting both quick operations and detailed analysis.",
                },
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
              text: "The redesign reduced quote processing time from 30+ minutes to under 10 minutes per request.",
            },
            {
              type: "text",
              text: "Users reported significantly improved decision-making confidence. The project deepened my understanding of enterprise logistics workflows and reinforced how information hierarchy and AI integration can transform repetitive, complex tasks.",
            },
            { type: "status", text: "Current status: Deployed and in active user testing." },
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
            {
              type: "intro",
              lead:
                "I worked for **Shipthis** for four months, __focusing on their web application__, with a primary emphasis on the **Quotation module**.",
              text:
                "The product is used by **freight forwarders**, who rely on it daily to create quotes for customer shipments across sea, air, rail and road.",
              aside: "modes",
            },
            {
              type: "factCards",
              items: [
                { icon: "users", label: "Users", value: "Freight forwarders", text: "Create & manage quotes." },
                { icon: "team", label: "Team", value: "Cross-functional", text: "Product, engineering and design." },
                { icon: "platform", label: "Platform", value: "Web", text: "White-labelled platform." },
              ],
            },
          ],
        },
        {
          id: "context",
          navLabel: "Context",
          title: "Context & Problem",
          blocks: [
            {
              type: "lead",
              text: "To understand the problem, it’s important to look at the freight forwarding ecosystem and how multiple parties work together to move goods from one place to another.",
            },

            {
              type: "subsection",
              title: "The freight forwarding ecosystem",
              text: "Freight forwarders coordinate the movement of goods between businesses and carriers. They manage rates, routes, documentation and communication across multiple parties.",
            },
            {
              type: "plate",
              src: shipthisForwarderFlow,
              alt: "Walmart places an order with Foxconn, DHL coordinates the shipment, Maersk carries it to the destination port, and the goods are delivered back to the buyer.",
              w: 1890,
              h: 612,
              // measured: the artwork's bottom 148px are empty canvas
              trimBottom: 148,
            },
            {
              type: "highlight",
              icon: "bulb",
              title: "Why this matters",
              text: "ShipThis is built for the people sitting at the centre of this workflow — freight forwarders managing multiple shipments, carriers and customers every day.",
            },

            {
              type: "subsection",
              title: "Existing workflow",
              text: "Before ShipThis, users manually searched carrier websites, compiled rates in spreadsheets, sent emails for negotiation, and lacked a centralized comparison tool. The __workflow was fragmented__ across 5+ systems.",
            },
            {
              type: "toolflow",
              footnote: "Repeated across multiple shipments",
              items: [
                { icon: "laptop", title: "Carrier websites", text: "Search rates across multiple vendors" },
                { icon: "sheet", title: "Spreadsheets", text: "Compile and compare rates manually" },
                { icon: "mail", title: "Emails / calls", text: "Back-and-forth negotiation with vendors" },
                { icon: "doc", title: "Documents", text: "Create quotes and format manually" },
                { icon: "person", title: "Final quote", text: "Share with customer" },
              ],
            },

            {
              type: "subsection",
              title: "Key pain points",
              text: "This fragmented workflow created several challenges for freight forwarders.",
            },
            {
              type: "painpoints",
              items: [
                { icon: "clock", title: "Manual rate research", text: "Took 30+ minutes per quote." },
                { icon: "layers", title: "No unified view", text: "Options and information were scattered across tools." },
                { icon: "mail", title: "Pricing negotiation delays", text: "Back-and-forth emails with vendors." },
                { icon: "doc", title: "Repetitive work & errors", text: "Document generation and manual data entry often led to high error rates." },
              ],
            },
            {
              type: "highlight",
              icon: "target",
              title: "What needed to change",
              text: "Centralize the workflow, automate repetitive tasks, provide clear visual comparisons, and enable faster decision-making.",
            },
          ],
        },
        {
          id: "research",
          navLabel: "Research",
          title: "Research & Discovery",
          blocks: [
            {
              type: "lead",
              text: "Research Methods: User interviews (8 logistics professionals), workflow shadowing, stakeholder sessions with sales team.",
            },
            { type: "heading", text: "Key Findings" },
            {
              type: "list",
              items: [
                "Users needed to juggle 5–7 tools simultaneously to complete one quote",
                "Vendor communication was the biggest time sink (up to 40% of workflow)",
                "Decision paralysis occurred when comparing 10+ quote variations",
                "Power users wanted customization; new users needed guidance",
                "Real-time rate updates were critical but currently manual",
              ],
            },
            {
              type: "text",
              text: "User Personas: Rate Managers, Sales Reps, Vendor Coordinators — each with different priorities and expertise levels.",
            },
            {
              type: "image",
              src: shipthisResearchTimeline,
              alt: "Research phases across the project timeline",
              caption: "Research phases across the engagement.",
            },
          ],
        },
        {
          id: "insights",
          navLabel: "Insights",
          title: "Insights & Direction",
          blocks: [
            { type: "heading", text: "Key Insights" },
            {
              type: "steps",
              items: [
                "Centralization is critical — users needed one unified workspace, not multiple tools",
                "Automation reduces friction — especially in document generation and rate retrieval",
                "Visual comparison changes decisions — maps, charts, and side-by-side tables outperformed lists",
                "Guidance matters — UI flows needed to adapt to user expertise levels",
              ],
            },
            { type: "heading", text: "Design Principles" },
            {
              type: "facts",
              items: [
                ["Information Hierarchy", "Progressive disclosure to avoid overwhelming users."],
                ["Guided Workflows", "Step-by-step processes that adapt to user needs."],
                ["Efficiency", "Reduce cognitive load, automate manual work."],
                ["Transparency", "Show all pricing and comparison data clearly."],
                ["Flexibility", "Support power users while protecting beginners."],
              ],
            },
            {
              type: "callout",
              text: "Guiding Goals: Reduce quote processing time by 60%, increase decision confidence, reduce vendor communication delays.",
            },
          ],
        },
        {
          id: "exploration",
          navLabel: "Exploration",
          title: "Exploration & Ideation",
          blocks: [
            {
              type: "lead",
              text: "Brainstorming and Sketches: Explored 3 major UI directions — spreadsheet-based, card-based, and dashboard-based layouts.",
            },
            {
              type: "text",
              text: "Early Concepts: Tested centralized quote card system vs. detailed comparison tables. Card system won due to scannability.",
            },
            {
              type: "gallery",
              images: [
                { src: shipthisSketch1, alt: "Early sketches of the quotation flow" },
                { src: shipthisSketch2, alt: "Sketches exploring rate comparison layouts" },
                { src: shipthisSketch3, alt: "Sketches of the quote listing and filters" },
                { src: shipthisSketch4, alt: "Sketches working through the negotiation panel" },
              ],
            },
            {
              type: "text",
              text: "Wireframes tested: Rate search flow → quote comparison view → negotiation panel → order confirmation. Iterated 4 times based on user feedback.",
            },
            {
              type: "gallery",
              images: [
                { src: shipthisWireRateSearch, alt: "Wireframe of the rate search", caption: "Rate search" },
                { src: shipthisWireDocuments, alt: "Wireframe of generated documents", caption: "Generated documents" },
                { src: shipthisWireDetails, alt: "Wireframe of quotation details with responses", caption: "Quotation details" },
                { src: shipthisWireMap, alt: "Wireframe of the map quote view", caption: "Map quote" },
              ],
            },
            {
              type: "callout",
              text: "Key Decision: Adopted hybrid approach combining scannable cards for browsing with detailed tables for power-user analysis.",
            },
          ],
        },
        {
          id: "design-decisions",
          navLabel: "Decisions",
          title: "Design Decisions",
          blocks: [
            {
              type: "decisions",
              items: [
                {
                  title: "Unified Rate Search",
                  text: "Why: Users previously searched manually across carrier sites. Created centralized interface supporting Sea, Air, Land shipping modes with one query.",
                  src: shipthisUiRateSearch,
                  alt: "Unified rate search across shipping modes",
                },
                {
                  title: "Visual Quote Comparison",
                  text: "Why: Comparing 10+ quotes in tables caused decision paralysis. Implemented side-by-side visual comparison showing pricing, timeline, and service differences.",
                  src: shipthisUiCompare,
                  alt: "Side-by-side comparison of quote responses",
                },
                {
                  title: "AI-Assisted Document Generation",
                  text: "Why: Document prep took 15+ minutes per quote. Implemented AI generation for commercial invoices, packing lists, and customs documents.",
                  src: shipthisUiDocuments,
                  alt: "Automatically generated shipping documents",
                },
                {
                  title: "Map-Based Route Visualization",
                  text: "Why: Users needed geographic context for route decisions. Added interactive map showing origin, destination, and carrier routing options.",
                  src: shipthisUiMap,
                  alt: "Map view showing origin, destination and routing options",
                },
                {
                  title: "Responsive Information Hierarchy",
                  text: "Why: New users got overwhelmed by 20+ data fields; power users needed all details. Created collapsible sections and guided workflows that reveal complexity gradually.",
                  src: shipthisUiDetails,
                  alt: "Quotation details with vendor responses",
                },
                {
                  title: "Vendor Communication Inbox",
                  text: "Why: Vendor negotiations required email switching. Integrated messaging panel directly in quote details for seamless communication.",
                  src: shipthisUiMessages,
                  alt: "Vendor messaging panel inside a quote",
                },
              ],
            },
          ],
        },
        {
          id: "final",
          navLabel: "Final design",
          title: "Final Experience",
          blocks: [
            { type: "heading", text: "User Flow" },
            {
              type: "steps",
              items: [
                "User enters shipment details (origin, destination, weight, cargo type) in unified search interface",
                "AI suggests quote parameters and vendors",
                "System fetches real-time rates from 15+ carriers",
                "Quotes appear as interactive cards with key metrics (price, transit time, service level)",
                "User selects 2–3 quotes to compare side-by-side",
                "Comparison view shows detailed breakdowns, alternate routes, and pricing variations",
                "User sends vendor rate request with one click",
                "Responses appear in integrated inbox",
                "AI auto-generates required documents",
                "User accepts best quote and proceeds to order confirmation",
              ],
            },
            { type: "heading", text: "Key Screens Showing Final Design" },
            {
              type: "gallery",
              images: [
                { src: shipthisUiRateSearch, alt: "Rate search interface", caption: "Rate search interface" },
                { src: shipthisUiCompare, alt: "Comparing quote responses", caption: "Quote comparison" },
                { src: shipthisUiDetails, alt: "Quotation details with responses", caption: "Quote details" },
                { src: shipthisUiMap, alt: "Map view of routes", caption: "Map view" },
                { src: shipthisUiDocuments, alt: "Generated documents", caption: "Document generation" },
                { src: shipthisUiMessages, alt: "Vendor messaging", caption: "Vendor messaging" },
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
              type: "metrics",
              items: [
                { value: "70%", label: "Quote processing time down — from 30+ minutes to 8–10" },
                { value: "40%", label: "Faster vendor response through streamlined communication" },
                { value: "62% → 89%", label: "User decision confidence, measured via survey" },
                { value: "95%", label: "Of the team on the new workflow within 2 weeks" },
              ],
            },
            {
              type: "text",
              text: "Testing & Feedback: Currently in beta testing with select customers. Preliminary feedback is highly positive; users requested additional customization options which are planned for Phase 2.",
            },
            { type: "status", text: "Current Status: Live in production, actively gathering user feedback for continuous optimization." },
            { type: "heading", text: "What I Learned" },
            {
              type: "list",
              marker: "check",
              items: [
                "Understanding industry workflows deeply transforms design decisions — logistics isn’t intuitive to outsiders",
                "AI integration must feel invisible and trustworthy, not like a black box",
                "Visual comparison tools dramatically improve decision-making in data-heavy contexts",
                "Building for users with varying expertise requires thoughtful information architecture",
                "Automating repetitive tasks (like document generation) is one of the highest-impact design decisions",
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* Intrinsic sizes for every image, so each one reserves its space before it
   loads. Without this the document grows as lazy images arrive underneath the
   reader — which shifts the layout and makes a jump from the index land short
   by however much loaded on the way. */
const DIMS = new Map([
  [shipthisSketch1, [1400, 1050]],
  [shipthisSketch2, [1400, 1050]],
  [shipthisSketch3, [1400, 1050]],
  [shipthisSketch4, [1400, 1050]],
  [shipthisWireRateSearch, [1600, 796]],
  [shipthisWireDocuments, [1600, 796]],
  [shipthisWireDetails, [1600, 796]],
  [shipthisWireMap, [1600, 796]],
  [shipthisUiRateSearch, [1600, 900]],
  [shipthisUiDetails, [1600, 900]],
  [shipthisUiCompare, [1600, 900]],
  [shipthisUiMap, [1600, 900]],
  [shipthisUiDocuments, [1600, 900]],
  [shipthisUiMessages, [1600, 900]],
  [shipthisResearchTimeline, [1600, 477]],
]);

function attachSizes(node) {
  if (Array.isArray(node)) {
    node.forEach(attachSizes);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (typeof node.src === "string" && DIMS.has(node.src)) {
    const [w, h] = DIMS.get(node.src);
    node.w = w;
    node.h = h;
  }
  Object.values(node).forEach(attachSizes);
}
attachSizes(shipthisStory);

export default shipthisStory;

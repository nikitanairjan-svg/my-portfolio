import {
  shipthisForwarderFlow,
  shipthisHeroCover,
  stFeatAiCompare,
  stFeatBulk,
  stFeatMapQuoteLoop,
  stFeatViewsLoop,
  stSc1,
  stSc2,
  stSc3,
  stSc4,
  stSc5,
  stSc6,
  stSc7,
  stSc8,
  stSc9,
  stSk1,
  stSk2,
  stSk3,
  stSk4,
  stSk5,
  stSk6,
  stWf1,
  stWf2,
  stWf3,
  stWf4,
  stWf5,
  stWf6,
} from "../assets";

/* ShipThis — the sections of the original write-up, in its order.

   At-a-glance first (summary, the product, problem against solution, the four
   features), then one clear break into Process (the plan, research, sketches,
   wireframes, screens), then what it taught.

   The product explainer and the research timeline are live components rather
   than flat exports: one needs to reveal the chain a step at a time, the other
   was a dark slide dropped into a cream page. */

const SCREEN = { w: 1800, h: 1012 };
const WIRE = { w: 1800, h: 896 };
const SKETCH_TALL = { w: 1500, h: 2000 };   // EXIF-rotated: these are portrait photos
const SKETCH_WIDE = { w: 1500, h: 1125 };

export const shipthisStory = {
  // the finished cover: scene and typography composed together, shown as-is
  // the two parts of the page, each opened by a full-width band (see PartBand)
  parts: { glance: "At a glance", process: "The process" },
  heroLayout: "composite",
  cover: {
    src: shipthisHeroCover,
    alt: "ShipThis open on a laptop at a container port at sunrise",
    w: 2000,
    h: 800,
  },
  tagline:
    "Shipthis is a digital platform that helps freight forwarders manage global shipping operations with ease, by automating tasks, tracking shipments, and improving collaboration.",
  meta: [
    ["Domain", "Logistics"],
    ["Type", "SaaS"],
    ["Role", "UX Researcher & Designer"],
  ],

  sections: [
    {
      id: "summary",
      navLabel: "Summary",
      title: "Project Summary",
      blocks: [
        {
          type: "text",
          text: "Four months on the Shipthis web application, focused on the **Quotation module**, used daily by freight forwarders to create multiple quotes for their customers' shipment requirements across sea, air, rail and road.",
        },
        {
          type: "text",
          text: "Shipthis already had a platform, but users faced __significant guidance and discoverability issues__, which made key features hard to navigate. It also lacked information hierarchy, leading to **cognitive overload**. My work aimed to streamline quote creation, reduce friction, and make the workflow faster to get through.",
        },
      ],
    },

    {
      id: "product",
      navLabel: "The product",
      title: "Let's understand the product",
      standfirst: "Freight forwarders are the intermediaries who arrange transport of goods for businesses.",
      blocks: [
        {
          type: "text",
          text: "They are the single point of contact for shippers, managing the logistics of moving cargo from one place to another, whether domestic or international.",
        },
        {
          // the supplied flow artwork, ground keyed out
          type: "plate",
          src: shipthisForwarderFlow,
          alt: "Walmart places an order with Foxconn, DHL coordinates the shipment, Maersk carries it to the destination port, and the goods reach the buyer",
          w: 1890,
          h: 612,
          trimBottom: 148,
        },
      ],
    },

    {
      id: "problem",
      navLabel: "Problem & solution",
      title: "Problem & Solution",
      standfirst: "An overwhelming interface on one side; guided, prioritised flows on the other.",
      blocks: [
        {
          type: "compare",
          left: {
            title: "The problem",
            items: [
              "New users struggle with excessive, unstructured data",
              "No step-by-step assistance, so navigation is guesswork",
              "Many tasks need manual input, adding workload",
              "Key details are not prioritised, causing cognitive overload",
              "Essential features are hard to locate, slowing everything down",
            ],
          },
          right: {
            title: "What we did",
            items: [
              "Step-by-step assistance through the key actions",
              "Prioritised information display, to cut cognitive overload",
              "Automated suggestions for rate selection",
              "Essential tools surfaced and made easy to reach",
              "Intuitive pathways through each task",
            ],
          },
        },
      ],
    },

    {
      id: "features",
      navLabel: "Main features",
      title: "Main Features",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "AI Quote Comparison",
              text: "Auto-comparison reads every vendor response and applies smart tags (**Fastest Route**, **Cheapest Option**), so decisions get made on data instead of on reading each reply.",
              src: stFeatAiCompare,
              alt: "Vendor responses compared automatically with smart tags",
              ...SCREEN,
            },
            {
              flip: true,
              title: "Bulk Quotation Creation",
              text: "Multiple quotations in one pass, for when several customer requests land together.",
              src: stFeatBulk,
              alt: "Creating several quotations at once",
              ...SCREEN,
            },
            {
              loop: true,
              title: "Map Quote",
              text: "Select multiple rates and map them in different permutations, mixing and matching before finalising several quotes at once.",
              src: stFeatMapQuoteLoop,
              alt: "Mapping rates into multiple quote combinations",
              w: 1366,
              h: 768,
            },
            {
              flip: true,
              loop: true,
              title: "Multi-View Listing",
              text: "Default, Cozy and Dense. Beginners get breathing room; power users get more rows on screen.",
              src: stFeatViewsLoop,
              alt: "Switching between the three listing density modes",
              w: 1366,
              h: 768,
            },
          ],
        },
      ],
    },

    {
      id: "process",
      navLabel: "The process",
      title: "The Process",
      part: "process",
      standfirst: "Restructured the hierarchy, introduced guided workflows, and made features findable.",
      blocks: [{ type: "timeline" }],
    },

    {
      id: "research",
      navLabel: "Research",
      title: "User Research",
      standfirst: "In-depth research with freight forwarders, sales teams and pricing strategists.",
      blocks: [
        {
          type: "text",
          text: "We built personas (Sales Rep, Operations, Pricing Strategist, CEO) who all struggled with feature discoverability and an overwhelming interface. Those insights set the design strategy.",
        },
        {
          type: "quotes",
          items: [
            {
              ask: "Which details matter?",
              said: "There's too much information to fill in while creating a quote response, making it difficult to focus on key details.",
              who: "Sales Rep",
            },
            {
              ask: "Where do I find it?",
              said: "Navigating through different sections is confusing, and I struggle to locate essential settings and controls.",
              who: "Admin",
            },
            {
              ask: "Why is this not automated?",
              said: "I have to manually collect and compare contracted and spot rates, which takes too much time.",
              who: "Pricing Strategist",
            },
            {
              ask: "How do I manage all of them?",
              said: "Handling multiple quotes simultaneously is overwhelming, and it's hard to keep track of their status.",
              who: "Sales Rep",
            },
          ],
        },
      ],
    },

    {
      id: "discovery",
      navLabel: "Discovery",
      title: "Discovery & Brainstorming",
      standfirst: "Early sketches and brainstorming from the discovery phase: the thinking behind the redesign.",
      blocks: [
        {
          type: "imageSet",
          cols: 3,
          caption: "Click any sketch to open it full size.",
          images: [
            { src: stSk1, alt: "Early sketch of the quotation flow", ...SKETCH_TALL },
            { src: stSk2, alt: "Sketch exploring the listing layout", ...SKETCH_TALL },
            { src: stSk3, alt: "Sketch of the rate comparison idea", ...SKETCH_TALL },
            { src: stSk4, alt: "Sketch of the quote details structure", ...SKETCH_TALL },
            { src: stSk5, alt: "Sketch exploring guided assistance", ...SKETCH_WIDE },
            { src: stSk6, alt: "Sketch of the map quote concept", ...SKETCH_WIDE },
          ],
        },
        {
          type: "text",
          text: "Through the design phase the focus stayed on the Quotation module: usability, efficiency, automation.",
        },
      ],
    },

    {
      id: "wireframes",
      navLabel: "Wireframes",
      title: "UX Wireframes",
      standfirst: "Information hierarchy, guided flows and AI integration, settled before any UI.",
      blocks: [
        {
          type: "imageSet",
          cols: 3,
          caption: "Wireframes taken into user testing. Click to open.",
          images: [
            { src: stWf1, alt: "Wireframe of the quote details page", ...WIRE },
            { src: stWf2, alt: "Wireframe of the guided quote flow", w: 1800, h: 889 },
            { src: stWf3, alt: "Wireframe of the rate listing", ...WIRE },
            { src: stWf4, alt: "Wireframe of the comparison view", ...WIRE },
            { src: stWf5, alt: "Wireframe of the vendor response view", ...WIRE },
            { src: stWf6, alt: "Wireframe of the quote summary", ...WIRE },
          ],
        },
      ],
    },

    {
      id: "ui",
      navLabel: "UI screens",
      title: "UI Screens",
      standfirst: "Clear visual hierarchy, less clutter, AI woven in rather than bolted on.",
      blocks: [
        {
          type: "imageSet",
          cols: 3,
          feature: true,
          caption: "The final interface. Click any screen to view it full size.",
          images: [
            { src: stSc1, alt: "Quotation listing", ...SCREEN },
            { src: stSc2, alt: "AI quote comparison with smart tags", ...SCREEN },
            { src: stSc3, alt: "Quote details", ...SCREEN },
            { src: stSc4, alt: "Rate search", ...SCREEN },
            { src: stSc5, alt: "Vendor responses", ...SCREEN },
            { src: stSc6, alt: "Bulk quotation creation", ...SCREEN },
            { src: stSc7, alt: "Map quote", ...SCREEN },
            { src: stSc8, alt: "Quote summary", ...SCREEN },
            { src: stSc9, alt: "Listing density modes", ...SCREEN },
          ],
        },
      ],
    },

    {
      id: "learned",
      navLabel: "What I learned",
      title: "What I Learned",
      accent: true,
      blocks: [
        {
          type: "takeaways",
          items: [
            "The freight forwarding industry, and what managing global shipments actually involves",
            "How pricing strategy, vendor negotiation and multi-modal logistics shape a forwarder's day",
            "Which repetitive manual tasks genuinely needed AI assistance",
            "Designing across expertise levels needs customisable interfaces, not an average one",
            "Information hierarchy and guided workflows move adoption more than features do",
          ],
        },
      ],
    },
  ],
};

export default shipthisStory;

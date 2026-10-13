import { bloomCraftHeroCover, bloomCraftVisual } from "../assets";

/* Bloom Craft — the one that was built, not just designed.

   It is shorter than ShipThis or HC Robotics because there is less process to
   show: no client, no research programme, no rounds of testing. But it carries
   the same furniture — numbered sections, the at-a-glance / process division,
   the cover with its typography set into the artwork — so it reads as one of
   the set rather than an offcut.

   The subject is really the making: taking a product from idea to production
   with AI tooling, and shipping it. So where the others put a process, this
   one puts a link — using it for thirty seconds explains more than a page of
   wireframes could. */

const LIVE_URL = "https://bloom-craft.vercel.app/";

export const bloomCraftStory = {
  // the finished cover: scene and typography composed together, shown as-is
  heroLayout: "composite",
  cover: {
    src: bloomCraftHeroCover,
    alt: "Bloom Craft open on a laptop beside fresh flowers, with a bouquet being arranged on screen",
    w: 2000,
    h: 800,
  },
  tagline:
    "A digital bouquet builder that lets users create beautiful, personalised flower arrangements. Choose from a variety of stems, wrapping styles and colours, add a note, and share or download your custom bouquet.",
  meta: [
    ["Domain", "Creative Tools"],
    ["Type", "Web Application"],
    ["Role", "Designer & Developer"],
  ],

  sections: [
    {
      id: "what",
      navLabel: "What it is",
      title: "What is Bloom Craft?",
      standfirst: "Pick a mood, and the arrangement follows.",
      blocks: [
        {
          type: "text",
          text: "A virtual bouquet maker where **mood creates design**. Pick an aesthetic, customise your arrangement, and send it instantly to anyone. Perfect for special occasions or just because. No distance limits.",
        },
        {
          type: "featured",
          // the only visual in the study, so it takes the full measure
          wide: true,
          src: bloomCraftVisual,
          alt: "The Bloom Craft landing screen: Beautiful bouquets, made by you, with Create Bouquet, View Library and Surprise Me",
          caption: "Three ways in: build one, browse the library, or let it surprise you.",
          w: 1800,
          h: 1025,
        },
      ],
    },

    {
      id: "why",
      navLabel: "Why",
      title: "Why I Made It",
      standfirst: "An experiment in taking something from idea to production.",
      blocks: [
        {
          type: "text",
          text: "I wanted to explore building a complete app from idea to production using **AI tools**.",
        },
        {
          type: "text",
          text: "This project became a full-stack learning experience: how to prompt effectively, how to structure a product, and how to ship it to users.",
        },
      ],
    },

    {
      id: "experience",
      navLabel: "Experience it",
      title: "The Experience",
      standfirst: "It is live. Building one bouquet explains it faster than this page can.",
      blocks: [
        {
          type: "cta",
          href: LIVE_URL,
          // the arrow belongs to the component, so it is not repeated here
          label: "Create Your Bouquet",
          note: "Try the live app",
          pending: "The build isn't published yet. The link goes live the moment it is.",
        },
      ],
    },

    {
      id: "behind",
      navLabel: "Behind the scenes",
      title: "Behind the Scenes",
      part: "process",
      standfirst: "Built with AI assistance, and shipped to production.",
      blocks: [
        {
          type: "tools",
          label: "Tools used",
          items: ["Claude Code", "VS Code", "Figma", "Gemini", "ChatGPT", "Vercel", "Google Analytics"],
        },
        {
          type: "list",
          items: [
            "**AI-assisted development**: Claude Code and ChatGPT used to build features end to end",
            "**Prompt engineering**: structuring prompts for better code generation and design decisions",
            "**Production ready**: deployed to Vercel, analytics integrated, shipped to users",
          ],
        },
      ],
    },

    {
      id: "learned",
      navLabel: "What I learned",
      title: "What I Learned",
      accent: true,
      standfirst: "What building and shipping with AI actually taught me.",
      blocks: [
        {
          type: "cards",
          plain: true,
          items: [
            {
              title: "Prompting is a Skill",
              text: "Writing effective prompts to AI tools determines output quality. Specificity matters.",
            },
            {
              title: "Full-Stack with AI",
              text: "Built a complete app (frontend, backend, design, deployment) faster using AI assistance.",
            },
            {
              title: "Shipping Matters",
              text: "Getting to production taught me about real user feedback, analytics, and iterating live.",
            },
            {
              title: "AI Tools are Powerful",
              text: "Claude Code, ChatGPT and Gemini can handle most of the technical work, so the focus shifts to direction.",
            },
          ],
        },
      ],
    },
  ],
};

export default bloomCraftStory;

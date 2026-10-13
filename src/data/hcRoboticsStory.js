import {
  hcFeatureLayoutsLoop,
  hcFeatureMagnify,
  hcFeatureToolbox,
  hcHeroCover,
  hcSketch1,
  hcSketch2,
  hcSketch3,
  hcSketch4,
  hcUi1,
  hcUi2,
  hcUi3,
  hcUi4,
  hcUi5,
  hcUi6,
  hcUi7,
  hcUi8,
  hcUi9,
  hcWire1,
  hcWire2,
  hcWire3,
  hcWire4,
  hcWire5,
  hcWire6,
  hcWire7,
  hcWire8,
} from "../assets";

/* HC Robotics — the sections of the original write-up, in its order.

   Built to the same plan as ShipThis: at-a-glance (summary, the product,
   problem against solution, the features), one clear break into Process
   (research, sketches, wireframes, screens), then what it taught.

   Written only from what the write-up records. There are no impact
   percentages here because none were ever measured — the adoption and
   task-completion figures that circulated earlier are not in the source.

   The write-up's closing "Words of Appreciation" has no counterpart in
   ShipThis, so it is left out rather than given a section of its own. */

const UI = { w: 1890, h: 941 };
const WIRE = { w: 1374, h: 776 };

export const hcRoboticsStory = {
  // same treatment as ShipThis: the finished cover, shown as-is
  // the two parts of the page, each opened by a full-width band (see PartBand)
  parts: { glance: "At a glance", process: "The process" },
  heroLayout: "composite",
  cover: {
    src: hcHeroCover,
    alt: "HC Robotics open on a laptop beside a LiDAR point-cloud scan of a residential street",
    w: 1983,
    h: 793,
  },
  tagline:
    "A LiDAR-powered platform that helps design engineers map and assess streetlight and electrical pole infrastructure. Engineers identify individual poles and capture key attributes such as height, span and anchor to evaluate pole health.",
  meta: [
    ["Domain", "Robotics & Telecom"],
    ["Type", "SaaS"],
    ["Role", "UX Designer"],
  ],

  sections: [
    {
      id: "summary",
      navLabel: "Summary",
      title: "Project Summary",
      blocks: [
        {
          type: "text",
          text: "Two months in 2023 with HC Robotics, designing their **B2B web application**. It is used by design engineers who map streetlight and electrical poles with LiDAR, identifying each pole and recording its **height, span and anchor** to assess the pole's health.",
        },
        {
          type: "text",
          text: "A version 1.0 had been designed before this, but it was __never released to customers__: the founder judged that the adoption rate would be very low without good design.",
        },
      ],
    },

    {
      id: "product",
      navLabel: "The product",
      title: "Let's understand the product",
      standfirst: "Design engineers use LiDAR to map streetlight and electrical poles, pole by pole.",
      blocks: [
        {
          type: "text",
          text: "The work on the platform is to identify each electrical pole and add its information (height, span, anchor), which is what determines whether the pole is healthy.",
        },
        {
          /* Was a flat export of a white slide, which could not be read on a
             phone and repeated — word for word — the bullet list that used to
             sit above it. Rebuilt in the page's own palette, so the four
             stages are real text and the list is no longer needed. */
          type: "lidarFlow",
        },
      ],
    },

    {
      id: "problem",
      navLabel: "Problem & solution",
      title: "Problem & Solution",
      standfirst: "A confusing interface on one side; guided, legible workflows on the other.",
      blocks: [
        {
          type: "compare",
          left: {
            title: "The problem",
            items: [
              "A confusing interface deters adoption",
              "Users struggle with task navigation and completion",
              "Data is presented densely and is hard to interpret",
              "People prefer their old methods, because the app is complex",
              "Nothing guides a first-time user, which breeds frustration",
            ],
          },
          right: {
            title: "What we did",
            items: [
              "Simplified navigation, with guided workflows",
              "Clear, contextual guidance held inside the task",
              "Stronger visual clarity, so dense data can be read",
              "Incremental change, so existing users keep their footing",
              "A friendlier, more conversational tone throughout",
            ],
          },
        },
        { type: "status", text: "Developed and in use by internal users" },
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
              title: "Clear Tool Box",
              text: "The backbone of the application. The **horizontal** tool box filters the canvas, the **vertical** one streamlines the actions, and hovering any tool names it in a tooltip.",
              src: hcFeatureToolbox,
              alt: "The horizontal filter bar and vertical action rail",
              ...UI,
            },
            {
              flip: true,
              loop: true,
              title: "Multiple Canvas Layouts",
              text: "**Focus View** concentrates on the work area, **Split View** balances work area and map, and **Fullscreen** gives everything to the canvas.",
              src: hcFeatureLayoutsLoop,
              alt: "Switching between the focus, split and fullscreen canvas layouts",
              w: 1366,
              h: 680,
            },
            {
              title: "Magnifying For Measuring",
              text: "Accurate pole measurement is the whole job. The magnifier zooms automatically into the area selected for measurement, which takes the guesswork out of it.",
              src: hcFeatureMagnify,
              alt: "The magnifier zoomed into a pole attachment point",
              w: 1318,
              h: 814,
            },
          ],
        },
      ],
    },

    {
      id: "research",
      navLabel: "Research",
      part: "process",
      title: "User Research",
      standfirst: "Interviews with design engineers and admin staff, to find where the work broke down.",
      blocks: [
        {
          type: "text",
          text: "We built personas (Design Engineer, Admin, Customer) who all found the previous interface overwhelming and difficult to navigate. Those insights shaped the design strategy and set what to focus on.",
        },
        {
          type: "quotes",
          items: [
            {
              ask: "What does this mean?",
              said: "I'm unable to understand the use of this icon. I have to ask my senior about it.",
              who: "Design Engineer",
            },
            {
              ask: "Was that accurate?",
              said: "I'm not sure whether I have captured measurement of the pole accurately or not.",
              who: "Design Engineer",
            },
            {
              ask: "Where can I note it?",
              said: "I have measured the markings but I don't know where to note it down.",
              who: "Design Engineer",
            },
            {
              ask: "Which run is this?",
              said: "It's so confusing to understand which run I'm in right now. I have to close and go back to check every time.",
              who: "Admin",
            },
          ],
        },
      ],
    },

    {
      id: "discovery",
      navLabel: "Sketches",
      title: "Sketches & Ideation",
      standfirst: "Rough sketches into low-fidelity wireframes, focused on the canvas and its layout.",
      blocks: [
        {
          type: "imageSet",
          cols: 3,
          caption: "Click any sketch to open it full size.",
          images: [
            { src: hcSketch1, alt: "Layout sketches for the canvas and tools", w: 1890, h: 841 },
            { src: hcSketch2, alt: "Hand sketches of the workspace layout", w: 1890, h: 1252 },
            { src: hcSketch3, alt: "Hand sketches of tool grouping", w: 1890, h: 1328 },
            { src: hcSketch4, alt: "A sketched panel layout for pole attributes", w: 832, h: 1346 },
          ],
        },
      ],
    },

    {
      id: "wireframes",
      navLabel: "Wireframes",
      title: "UX Wireframes",
      standfirst: "Designed and tested with a selected group of users, before any UI work began.",
      blocks: [
        {
          type: "text",
          text: "Beyond the headline features, these covered cognitive overload, sharing a view internally and saving a view, settled here rather than retrofitted after the UI.",
        },
        {
          type: "imageSet",
          cols: 3,
          caption: "The eight wireframes taken into testing. Click to open.",
          images: [
            { src: hcWire1, alt: "Wireframe: change layout", caption: "Change Layout", ...WIRE },
            { src: hcWire2, alt: "Wireframe: canvas view", caption: "Canvas View", ...WIRE },
            { src: hcWire3, alt: "Wireframe: map view", caption: "Map View", ...WIRE },
            { src: hcWire4, alt: "Wireframe: adding information", caption: "Adding Information", ...WIRE },
            { src: hcWire5, alt: "Wireframe: split layout", caption: "Split Layout", ...WIRE },
            { src: hcWire6, alt: "Wireframe: snapshot", caption: "Snapshot", ...WIRE },
            { src: hcWire7, alt: "Wireframe: mapping pole", caption: "Mapping Pole", ...WIRE },
            { src: hcWire8, alt: "Wireframe: settings", caption: "Settings", w: 1374, h: 744 },
          ],
        },
      ],
    },

    {
      id: "ui",
      navLabel: "UI screens",
      title: "UI Screens",
      standfirst: "A light theme, as the client preferred, and as the users were already used to.",
      blocks: [
        {
          type: "imageSet",
          cols: 3,
          feature: true,
          caption: "The final interface. Click any screen to view it full size.",
          images: [
            { src: hcUi1, alt: "Change layout", caption: "Change Layout", ...UI },
            { src: hcUi2, alt: "Canvas view", caption: "Canvas View", ...UI },
            { src: hcUi3, alt: "Map view", caption: "Map View", ...UI },
            { src: hcUi4, alt: "Adding information", caption: "Adding Information", ...UI },
            { src: hcUi5, alt: "Split layout", caption: "Split Layout", ...UI },
            { src: hcUi6, alt: "Snapshot", caption: "Snapshot", ...UI },
            { src: hcUi7, alt: "Mapping pole", caption: "Mapping Pole", ...UI },
            { src: hcUi8, alt: "Settings", caption: "Settings", ...UI },
            { src: hcUi9, alt: "Cylindrical clip", caption: "Cylindrical Clip", ...UI },
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
            "Deep insight into LiDAR technology and the telecom industry",
            "Every component of an electric pole, and how those details shape a design engineer's work",
            "How much manual error costs, and why precise, intuitive tools reduce it",
            "Designing for an industry you have to learn first changes the decisions you make",
          ],
        },
      ],
    },
  ],
};

export default hcRoboticsStory;

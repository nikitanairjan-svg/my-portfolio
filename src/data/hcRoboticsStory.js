import {
  hcFeatureLayouts,
  hcFeatureMagnify,
  hcFeatureToolbox,
  hcLidarCover,
  hcSketch1,
  hcSketch2,
  hcSketch3,
  hcSketch4,
  hcUi1,
  hcUi2,
  hcUi3,
  hcUi4,
  hcUi5,
  hcUi7,
  hcWire1,
  hcWire2,
  hcWire3,
  hcWire4,
  hcWorkflow,
} from "../assets";

/* HC Robotics, in two readings of the same project: a short one and the full
   process. Both hang off the same header and hero.

   The content comes from the project's own write-up; where a claim is not
   recorded there it is described qualitatively rather than given a number. */

export const hcRoboticsStory = {
  cover: {
    src: hcLidarCover,
    alt: "A LiDAR point cloud of a residential street, coloured by height",
    w: 1567,
    h: 860,
  },
  tagline:
    "Simplifying complex geospatial tool navigation for telecom infrastructure inspection and pole mapping.",
  meta: [
    ["Domain", "Robotics & Geospatial"],
    ["Type", "B2B SaaS"],
    ["Role", "UX Designer & User Researcher"],
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
              text: "HC Robotics is a B2B web application used by design engineers to map and analyse electrical poles using LiDAR.",
            },
            {
              type: "text",
              text: "The platform turns 3D scans of a street into a workspace where each pole can be identified, measured and checked for structural health. I redesigned the interface to solve the adoption problem that had kept the first version from ever launching.",
            },
            {
              type: "image",
              src: hcLidarCover,
              alt: "A LiDAR point cloud of a residential street, coloured by height from blue at road level to red in the treetops",
              caption: "The raw material: a LiDAR scan of a street, coloured by height.",
              w: 1567,
              h: 860,
            },
          ],
        },
        {
          id: "problem",
          navLabel: "Problem",
          title: "The Problem",
          blocks: [
            {
              type: "lead",
              text: "Version 1.0 was feature-complete and never released. The founder held it back because the adoption rate would have been too low.",
            },
            {
              type: "list",
              items: [
                "A confusing interface deterred people before they got started",
                "Users struggled to navigate between tasks and finish them",
                "Data was presented densely and was hard to interpret",
                "People fell back on their old manual methods because the app was complex",
                "Nothing in the interface guided a first-time user, which bred frustration",
              ],
            },
            {
              type: "callout",
              text: "The app had every feature it needed. What it lacked was a way in.",
            },
          ],
        },
        {
          id: "solution",
          navLabel: "Solution",
          title: "The Solution",
          blocks: [
            {
              type: "lead",
              text: "A redesign that kept the capability and rebuilt the route through it.",
            },
            {
              type: "list",
              items: [
                "Simplified navigation with guided workflows for common tasks",
                "Clear, contextual guidance held inside the task rather than in separate docs",
                "Stronger visual hierarchy so dense 3D data could be read at a glance",
                "Incremental change, so existing users kept their footing",
                "Interfaces shaped around each role rather than one screen for everyone",
              ],
            },
            {
              type: "image",
              src: hcUi7,
              alt: "A mapped pole in the HC Robotics workspace with measurement callouts for span, attachment heights, equipment and anchor lead length",
              caption: "Pole measurement, with every attribute labelled in place.",
              w: 1890,
              h: 941,
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
                  title: "Progressive disclosure for complexity",
                  text: "Advanced tools stay out of the way until the task calls for them, so the first screen is approachable without losing any depth.",
                },
                {
                  title: "Simplified 3D navigation",
                  text: "Clear depth cues and predictable controls, so moving through a point cloud stops feeling like getting lost.",
                },
                {
                  title: "Role-based interfaces",
                  text: "Design engineers, field technicians and admins each see the workspace their job needs.",
                },
                {
                  title: "A guided first run",
                  text: "Onboarding that builds competence instead of listing features.",
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
              text: "The app was built and released after the redesign, and is now in use by internal users — the launch the first version never got.",
            },
            {
              type: "text",
              text: "The project was a deep dive into LiDAR and the telecom industry: understanding each component of an electric pole, and how much the manual errors in that work cost the engineers doing it.",
            },
            { type: "status", text: "Developed and in use" },
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
              type: "lead",
              text: "A two-month engagement in 2023, designing the B2B web application that HC Robotics' customers would actually have to use.",
            },
            {
              type: "factCards",
              items: [
                {
                  icon: "users",
                  label: "Users",
                  value: "Design engineers",
                  text: "Identify and map electrical poles, and record the measurements that establish each pole's health.",
                },
                {
                  icon: "team",
                  label: "Team",
                  value: "Founder and two engineers",
                  text: "I led user research and UX design, and ran the usability testing.",
                },
                {
                  icon: "platform",
                  label: "Platform",
                  value: "Web, desktop-first",
                  text: "Built around heavy 3D geospatial data and LiDAR processing.",
                },
              ],
            },
            {
              type: "text",
              text: "The scope was the core mapping interface and the workflows around it, constrained by the realities of handling 3D data, serving several distinct user types, and fitting into an existing LiDAR pipeline.",
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
              text: "The LiDAR technology captured extraordinary 3D data. The application for reading it was overwhelming.",
            },
            {
              type: "subsection",
              title: "How the workflow actually runs",
              text: "Before anyone opens the app, a street has already been scanned and processed. The software sits at the end of that pipeline — which means it inherits all of the data's complexity and none of its context.",
            },
            {
              type: "image",
              src: hcWorkflow,
              alt: "Four-step process: LiDAR camera scanning, LiDAR image generation, import into HC Robotics software, and pole mapping by design engineers",
              w: 1890,
              h: 1035,
            },
            {
              type: "subsection",
              title: "Why version 1.0 never shipped",
              text: "The founder had invested months in a first version and then held it back. It had the features, but the experience was dense enough that users preferred their old __spreadsheet-and-manual-measurement__ methods. A tool nobody adopts has no value, however complete it is.",
            },
            {
              type: "highlight",
              icon: "bulb",
              title: "The core problem",
              text: "Complexity was never the enemy — complexity is the job. Complexity without guidance is what gets a product rejected.",
            },
            {
              type: "subsection",
              title: "Where it broke down",
              text: "The failures were consistent across users, and none of them were about missing functionality.",
            },
            {
              type: "painpoints",
              items: [
                { icon: "layers", title: "Lost in 3D space", text: "No reliable sense of where you were in the scan, or how to get back." },
                { icon: "target", title: "Tools hard to find", text: "Basic actions were buried, and icons carried no explanation." },
                { icon: "doc", title: "Nowhere to record", text: "Measurements were taken, then had no obvious home." },
                { icon: "clock", title: "No sense of place", text: "Which run am I in? Checking meant closing out and going back." },
              ],
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
              text: "Interviews and observation with the design engineers and admin staff who would live in this tool, watching the LiDAR workflow as it actually happened.",
            },
            {
              type: "text",
              text: "We built personas for the design engineer, the admin and the customer. The same frustrations surfaced again and again, and they were specific enough to design against.",
            },
            {
              type: "heading",
              text: "What users told us",
            },
            {
              type: "list",
              marker: "quote",
              items: [
                "“What does this mean? I can't understand the use of this icon — I have to ask my senior about it.”",
                "“Was that accurate? I'm not sure whether I've captured the measurement of the pole correctly.”",
                "“Where can I note it? I've measured the markings but I don't know where to write them down.”",
                "“Which run is this? It's so confusing to understand which run I'm in right now.”",
              ],
            },
            {
              type: "note",
              text: "The first three quotes are from design engineers; the last is from an admin.",
            },
          ],
        },

        {
          id: "insights",
          navLabel: "Insights",
          title: "Insights & Direction",
          blocks: [
            {
              type: "lead",
              text: "Four insights shaped everything that followed.",
            },
            {
              type: "steps",
              items: [
                "Complexity isn't the enemy — poor guidance is. The work is genuinely intricate, and hiding that would help nobody.",
                "3D navigation needs its own mental model; borrowing one from flat software leaves people disoriented.",
                "Expertise varies widely across the same team, so the interface has to adapt rather than average.",
                "Progressive disclosure builds confidence — each step earned should reveal the next.",
              ],
            },
            {
              type: "heading",
              text: "Design principles",
            },
            {
              type: "facts",
              items: [
                ["Simplicity", "Reduce what is on screen at any one moment, not what the tool can do."],
                ["Guidance", "Help lives inside the task, never in a separate manual."],
                ["Visual clarity", "Dense data still has to be readable at a glance."],
                ["Adaptability", "The interface follows the role and the expertise of whoever opened it."],
              ],
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
              text: "The process started on paper, working through the canvas and its layout — the part of the interface everything else depends on.",
            },
            {
              type: "gallery",
              images: [
                { src: hcSketch1, alt: "Early layout sketches for the canvas and tool arrangement", w: 1890, h: 841 },
                { src: hcSketch2, alt: "Hand sketches exploring the workspace layout", w: 1890, h: 1252 },
                { src: hcSketch3, alt: "Hand sketches exploring tool grouping and canvas controls", w: 1890, h: 1328 },
                { src: hcSketch4, alt: "A sketched panel layout for pole attributes", w: 832, h: 1346 },
              ],
            },
            {
              type: "subsection",
              title: "From sketches to tested wireframes",
              text: "The wireframes went out to a selected group of users. They covered more than the headline features — cognitive load, sharing a view internally, and saving a view were all worked out at this stage rather than retrofitted into the UI later.",
            },
            {
              type: "gallery",
              images: [
                { src: hcWire1, alt: "Wireframe of the mapping workspace", w: 1374, h: 776 },
                { src: hcWire2, alt: "Wireframe of the pole attribute entry flow", w: 1374, h: 776 },
                { src: hcWire3, alt: "Wireframe of the canvas layout options", w: 1374, h: 776 },
                { src: hcWire4, alt: "Wireframe of the measurement and review flow", w: 1374, h: 776 },
              ],
            },
          ],
        },

        {
          id: "design-decisions",
          navLabel: "Decisions",
          title: "Design Decisions",
          blocks: [
            {
              type: "lead",
              text: "Three decisions carried most of the weight, and each one is visible in the final interface.",
            },
            {
              type: "decisions",
              items: [
                {
                  title: "A toolbox you can read",
                  text: "The toolbox is the backbone of the application. A horizontal bar handles filtering the canvas while a vertical rail holds the actions, and hovering any tool names it — so an unfamiliar icon stops being a reason to go and ask a colleague.",
                  src: hcFeatureToolbox,
                  alt: "The HC Robotics workspace with the horizontal filter bar and the vertical action rail",
                  w: 1890,
                  h: 941,
                },
                {
                  title: "Multiple canvas layouts",
                  text: "Focus View concentrates on the work area, Split View balances the work area against the map, and Fullscreen gives the whole screen to the canvas. One workspace, shaped to the task in front of you.",
                  src: hcFeatureLayouts,
                  alt: "The canvas layout options: focus view, split view and fullscreen",
                  w: 1366,
                  h: 680,
                },
                {
                  title: "Magnify for measuring",
                  text: "Accurate pole measurement is the whole job. The magnifier zooms automatically into the area being measured, which takes the guesswork — and a recurring source of manual error — out of the most important action in the product.",
                  src: hcFeatureMagnify,
                  alt: "The magnifier zoomed into a pole attachment point while taking a measurement",
                  w: 1318,
                  h: 814,
                },
              ],
            },
            {
              type: "subsection",
              title: "The interface it added up to",
              text: "The UI styling followed the client's preference for a light theme, which also suited users who spend their day comparing a bright street scan against a map.",
            },
            {
              type: "gallery",
              images: [
                { src: hcUi3, alt: "The map view, with mapped poles coloured by coverage state along a surveyed street", w: 1890, h: 941 },
                { src: hcUi1, alt: "The canvas layout chooser open over the workspace", w: 1890, h: 941 },
                { src: hcUi2, alt: "Street-level view of a pole with the measurement tool rail", w: 1890, h: 941 },
                { src: hcUi5, alt: "Split view with the map beside the street-level scan and a coverage legend", w: 1890, h: 941 },
                { src: hcUi4, alt: "The mapping workspace with pole markers and issue flags", w: 1890, h: 941 },
              ],
            },
          ],
        },

        {
          id: "final",
          navLabel: "Final design",
          title: "Final Experience",
          blocks: [
            {
              type: "lead",
              text: "End to end, the redesigned journey runs like this.",
            },
            {
              type: "steps",
              items: [
                "The engineer opens the app and is met with guided onboarding rather than a blank canvas.",
                "A processed LiDAR scan is loaded into the workspace.",
                "Poles are identified and placed, with the map and the street view kept side by side.",
                "Each pole's attributes — height, span, anchor, equipment — are measured with the magnifier.",
                "Attachment heights and issues are recorded in place, against the pole they belong to.",
                "The run is reviewed, with coverage state visible across the whole street.",
                "The completed data is handed on to the field team.",
              ],
            },
            {
              type: "image",
              src: hcUi5,
              alt: "Split view: the map on the left showing coverage state, the street-level scan on the right",
              caption: "Split view — the map and the scan, legible at the same time.",
              w: 1890,
              h: 941,
            },
            {
              type: "callout",
              text: "The flows adapt to the role, and the first run is built to feel safe rather than impressive.",
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
              text: "The application was developed and released, and is in use by internal users — which is precisely what version 1.0 never managed.",
            },
            {
              type: "heading",
              text: "What I learned",
            },
            {
              type: "list",
              items: [
                "Designing for complex data is a different discipline from designing for simple data — the answer is rarely to remove things.",
                "Progressive disclosure is how you let a product stay as capable as its users need without punishing the newcomer.",
                "Guided onboarding is not a nicety in a specialist tool; it is the adoption strategy.",
                "3D interfaces need far more care with orientation than flat ones.",
                "Roles matter. One interface for everyone fails everyone a little.",
              ],
            },
            {
              type: "text",
              text: "The work also meant learning the domain properly: LiDAR, the telecom industry, and every component of an electric pole — including why a mismeasured attachment height matters to the engineer who has to stand under it.",
            },
            { type: "status", text: "Developed and in use" },
          ],
        },
      ],
    },
  ],
};

export default hcRoboticsStory;

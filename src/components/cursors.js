/* Custom cursors for the pegboard, following the cursor design system sheet:
   solid moss / off-white / blush fills, bold outlines, a thin white edge and a
   soft shadow so each one reads on the cream board and on photos. */
const MOSS = "#434f3b";
const OUTLINE = "#1e2a2d";
const PAPER = "#faf6f2";
const BLUSH = "#e6cec4";
const EDGE = "#ffffff";

const SHADOW =
  '<defs><filter id="s" x="-40%" y="-40%" width="180%" height="180%">' +
  '<feDropShadow dx="0" dy="1" stdDeviation="0.9" flood-color="#23221f" flood-opacity="0.3"/></filter></defs>';

/* Drawn on a `w` × `h` grid (hotspot in the same units), rendered at `scale`.
   Returns the CSS value plus the rendered size and hotspot, which the board
   uses to keep the hover tooltip clear of the cursor image. */
function svgCursor(w, h, [hx, hy], body, fallback, scale = 1) {
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);
  const hotspot = [Math.round(hx * scale), Math.round(hy * scale)];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `${SHADOW}<g filter="url(#s)">${body}</g></svg>`;
  return {
    css: `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot[0]} ${hotspot[1]}, ${fallback}`,
    width,
    height,
    hotspot,
  };
}

const ARROW = "M5 4 24 16 15 19 9.5 26.5z";
const HAND =
  "M8 13V4.5a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1 3 0v.5a1.5 1.5 0 0 1 3 0v.5a1.5 1.5 0 0 1 3 0v4a5.5 5.5 0 0 1-5.5 5.5h-2a4.5 4.5 0 0 1-3.3-1.45L5 15.3a1.4 1.4 0 0 1 2-2l1 1V13z";
const KNUCKLES = "M11 10.5V13M14 11v2.5M17 11.5v2";
const WRENCH =
  "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z";
const BOOK_LEFT = "M13 8.2C10.4 6 6 5.5 1.8 6.6v15c4.2-.9 8.6-.3 11.2 1.6z";
const BOOK_RIGHT = "M13 8.2c2.6-2.2 7-2.7 11.2-1.6v15c-4.2-.9-8.6-.3-11.2 1.6z";
const SPARKS = "M22.3 2.4l.2 2M27 3l-1.1 1.9M29.8 6.2l-2.3.6";

export const CURSORS = {
  // 01 Default — tailless moss arrow with a white edge (~24px).
  board: svgCursor(
    30,
    30,
    [5, 4],
    `<path d="${ARROW}" stroke="${EDGE}" stroke-width="4.5"/>` +
      `<path d="${ARROW}" fill="${MOSS}" stroke="${MOSS}" stroke-width="1.5"/>`,
    "default",
  ),

  // 05 Other items — filled moss dot with a white ring (~22px).
  dot: svgCursor(
    22,
    22,
    [11, 11],
    `<circle cx="11" cy="11" r="7" fill="${MOSS}" stroke="${EDGE}" stroke-width="2.2"/>`,
    "default",
    1.4,
  ),

  // 02 Travel photos — off-white hand with a bold dark outline (~26px); hotspot at the fingertip.
  pointer: svgCursor(
    32,
    32,
    [13, 4],
    `<g transform="translate(0.5 0.5) scale(1.3)">` +
      `<path d="${HAND}" stroke="${EDGE}" stroke-width="3.3"/>` +
      `<path d="${HAND}" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="1.7"/>` +
      `<path d="${KNUCKLES}" stroke="${OUTLINE}" stroke-width="1.3"/>` +
      `</g>`,
    "pointer",
  ),

  // 03 Tool icons — off-white wrench, head to the top left (~26px); hotspot at the jaw.
  wrench: svgCursor(
    32,
    32,
    [6, 6],
    `<g transform="translate(31 0.5) scale(-1.25 1.25)">` +
      `<path d="${WRENCH}" stroke="${EDGE}" stroke-width="3.4"/>` +
      `<path d="${WRENCH}" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="1.75"/>` +
      `</g>`,
    "pointer",
  ),

  // 04 Books — open book with blush pages and page-flip sparks (~35 × 30px); hotspot at the spine.
  book: svgCursor(
    32,
    28,
    [13, 15],
    `<path d="${BOOK_LEFT}${BOOK_RIGHT}" stroke="${EDGE}" stroke-width="4.4"/>` +
      `<path d="${SPARKS}" stroke="${EDGE}" stroke-width="3.6"/>` +
      `<path d="${BOOK_LEFT}${BOOK_RIGHT}" fill="${BLUSH}" stroke="${OUTLINE}" stroke-width="2.3"/>` +
      `<path d="${SPARKS}" stroke="${OUTLINE}" stroke-width="1.6"/>`,
    "default",
    1.25,
  ),
};

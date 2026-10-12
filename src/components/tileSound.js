/* The sound of a letter tile being knocked.

   Every tile has its own voice rather than one shared sample: the pitch comes
   from the tile's own size (a bigger tile rings lower, like the real thing) and
   is scattered by its index so neighbours never land on the same note, and the
   stereo position follows where the tile hangs on the board. Each knock is two
   taps — the hit, then a softer one as the tile swings back and touches down,
   matching the wobble in the animation.

   Nothing is audible until the visitor has interacted with the page: browsers
   keep an AudioContext suspended until then, and we simply stay silent. */

const MASTER_GAIN = 0.45;
const COOLDOWN_MS = 90; // the same tile won't retrigger faster than this
const RETURN_TAP = 0.13; // seconds until the tile swings back and taps again

let ctx = null;
let master = null;
let noise = null;
const lastPlayed = new Map();

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!ctx) {
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }
  // Resolves once the visitor has interacted; until then we render nothing.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx.state === "running" ? ctx : null;
}

/* Unlock the audio graph on the visitor's first interaction. The listeners stay
   attached until the context is genuinely running: one attempt can land before
   the browser is willing to grant audio, and firing `once` would leave the page
   silent for the rest of the visit. */
if (typeof window !== "undefined") {
  const gestures = ["pointerdown", "pointerup", "touchend", "click", "keydown"];
  const unlock = () => {
    if (!getContext()) return;
    gestures.forEach((type) => window.removeEventListener(type, unlock, true));
  };
  gestures.forEach((type) => window.addEventListener(type, unlock, true));
}

function getNoise(context) {
  if (!noise || noise.sampleRate !== context.sampleRate) {
    noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.25), context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

/* Give every tile its own note.

   Tiles are grouped into the rows they actually hang in, and each seat in a row
   takes a different step of the scale — stepping by four through eleven steps,
   which is coprime with the scale length, so no two tiles in a row share a note
   and neighbours leap rather than run up a scale. Rows are transposed a semitone
   apart so equal-sized rows never repeat each other, and a wider tile rings
   lower, which drops the big green rows into their own register.

   Panning spreads across the letters' own extent, not the whole board: they
   occupy only part of it, so normalising to the board would push every tile to
   the same side. */

// No two steps are a semitone apart, so shifting a row by one can never land a
// tile on another row's note.
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]; // semitones
const ROOT = 144; // Hz, the lowest seat of the top row
const SEAT_STRIDE = 4; // coprime with SCALE.length
const ROW_SHIFT = 1; // semitone per row
const BASE_W = 55; // the small cream tiles
// The big tiles ring a register lower — half a semitone off the grid, so their
// notes fall between the small tiles' notes and can never coincide with one.
const BIG_DROP = -4.5;

export function tileVoices(tiles) {
  const centres = tiles.map((tile) => tile.x + tile.w / 2);
  const reach = Math.max(...centres) - Math.min(...centres);
  const left = Math.min(...centres);

  const rowKey = (tile) => Math.round(tile.y / 20);
  const rowKeys = [...new Set(tiles.map(rowKey))].sort((a, b) => a - b);
  // The register belongs to the row's size class, never to a pixel of width
  // jitter: a tile one pixel wider than its neighbour is still the same tile.
  const bigRow = new Map(
    rowKeys.map((key) => {
      const widths = tiles.filter((tile) => rowKey(tile) === key).map((tile) => tile.w).sort((a, b) => a - b);
      return [key, widths[widths.length >> 1] > BASE_W * 1.3];
    }),
  );
  const filled = new Map();

  return tiles.map((tile, index) => {
    const key = rowKey(tile);
    const row = rowKeys.indexOf(key);
    const seat = filled.get(row) ?? 0;
    filled.set(row, seat + 1);
    const step = SCALE[(seat * SEAT_STRIDE) % SCALE.length] + row * ROW_SHIFT + (bigRow.get(key) ? BIG_DROP : 0);
    return {
      id: index,
      freq: ROOT * 2 ** (step / 12),
      pan: reach ? (((centres[index] - left) / reach) * 2 - 1) * 0.55 : 0,
    };
  });
}

/* Render one knock into `destination`. Exported with an explicit context so it
   can be rendered offline in a test as well as played live. */
export function knock(context, destination, voice, when = context.currentTime) {
  const freq = voice.freq * (0.995 + Math.random() * 0.01); // never twice identical, but still its own note
  const out = context.createGain();
  out.gain.value = 1;

  if (context.createStereoPanner) {
    const panner = context.createStereoPanner();
    panner.pan.value = voice.pan;
    out.connect(panner);
    panner.connect(destination);
  } else {
    out.connect(destination);
  }

  const tap = (at, level, decay) => {
    // Body: inharmonic partials, the way a small stiff panel rings.
    [
      [1, 1, "triangle"],
      [2.14, 0.4, "sine"],
      [3.42, 0.16, "sine"],
    ].forEach(([mult, amp, type], i) => {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.value = freq * mult;
      const gain = context.createGain();
      const ring = decay * (1 - i * 0.22);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(level * amp, at + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + ring);
      osc.connect(gain);
      gain.connect(out);
      osc.start(at);
      osc.stop(at + ring + 0.02);
    });

    // Contact click: the edge of the tile against the board.
    const click = context.createBufferSource();
    click.buffer = getNoise(context);
    click.playbackRate.value = 0.8 + Math.random() * 0.4;
    const band = context.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = freq * 6;
    band.Q.value = 1.2;
    const clickGain = context.createGain();
    clickGain.gain.setValueAtTime(level * 0.68, at); // the transient is what carries on small speakers
    clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.035);
    click.connect(band);
    band.connect(clickGain);
    clickGain.connect(out);
    click.start(at);
    click.stop(at + 0.06);
  };

  tap(when, 1, 0.14);
  tap(when + RETURN_TAP, 0.32, 0.1); // the tile settling back against the board
}

/* Play a tile's knock now. Returns false when it stayed silent. */
export function playKnock(voice) {
  const context = getContext();
  if (!context) return false;

  const now = performance.now();
  if (now - (lastPlayed.get(voice.id) ?? -Infinity) < COOLDOWN_MS) return false;
  lastPlayed.set(voice.id, now);

  knock(context, master, voice);
  return true;
}

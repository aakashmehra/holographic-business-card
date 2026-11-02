import type { CSSProperties } from "react";

/** Foil effects for BusinessCard. Each layer reads --mx/--my (pointer, %),
 *  --px/--py (pointer, 0..1), --mm (one card millimetre) and --holo (0..1). */
export type CardEffect =
  | "rainbow"
  | "stars"
  | "shards"
  | "cosmos"
  | "hearts"
  | "shapes"
  | "gold"
  | "silver"
  | "aurora";

export const CARD_EFFECTS: { id: CardEffect; label: string }[] = [
  { id: "shards", label: "Shards" },
  { id: "rainbow", label: "Rainbow" },
  { id: "stars", label: "Stars" },
  { id: "cosmos", label: "Cosmos" },
  { id: "hearts", label: "Hearts" },
  { id: "shapes", label: "Shapes" },
  { id: "gold", label: "Gold" },
  { id: "silver", label: "Silver" },
  { id: "aurora", label: "Aurora" },
];

const RAINBOW =
  "repeating-linear-gradient(110deg, hsl(0 100% 72%) 0%, hsl(45 100% 68%) 6%, hsl(110 90% 70%) 12%, hsl(185 100% 70%) 18%, hsl(250 100% 76%) 24%, hsl(310 100% 74%) 30%, hsl(360 100% 72%) 36%)";

const svg = (body: string, box = "0 0 100 100") =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${box}'>${body}</svg>`)}")`;

// Shapes tile (32 px): a four-point star, a diamond and two dots.
const SHAPES = svg(
  "<path d='M8 2Q9 7 14 8Q9 9 8 14Q7 9 2 8Q7 7 8 2Z'/><path d='M24 19L29 24L24 29L19 24Z'/><circle cx='24' cy='8' r='1.6'/><circle cx='8' cy='24' r='1.6'/>",
  "0 0 32 32",
);

// Hearts tile (22 mm): two medium hearts, ~10–11% of the card's height each.
const HEART =
  "M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4.5 6 4.5c2.1 0 3.5 1.1 6 3.4 2.5-2.3 3.9-3.4 6-3.4 3.8 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21z";
const HEARTS = svg(
  `<path transform='translate(6 6) rotate(-14 20 20) scale(1.7)' d='${HEART}'/><path transform='translate(58 56) rotate(12 18 18) scale(1.5)' d='${HEART}'/>`,
);

// Stars tile (26 mm): four five-point stars of mixed sizes.
const STAR = "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z";
const STARS = svg(
  [
    [4, 6, 1.3, -8],
    [56, 40, 0.9, 14],
    [26, 66, 0.65, 4],
    [80, 8, 0.55, -18],
  ]
    .map(([x, y, k, r]) => `<path transform='translate(${x} ${y}) rotate(${r} 12 12) scale(${k})' d='${STAR}'/>`)
    .join(""),
);

const mask = (image: string, size?: string, position?: string): CSSProperties => ({
  WebkitMaskImage: image,
  maskImage: image,
  WebkitMaskSize: size,
  maskSize: size,
  WebkitMaskPosition: position,
  maskPosition: position,
});

/** Soft pool of light around the pointer. */
export const spot = mask(
  "radial-gradient(farthest-corner circle at var(--mx) var(--my), #000 0%, rgba(0,0,0,.4) 55%, transparent 100%)",
);

// `k` scales opacity (× --holo); `spot` confines the foil to the pool of light.
export const FOIL: Record<CardEffect, { k: number; spot: boolean; layer: CSSProperties }> = {
  rainbow: {
    k: 0.42,
    spot: true,
    layer: {
      backgroundImage: `${RAINBOW}, repeating-linear-gradient(-45deg, rgba(255,255,255,.07) 0 1px, transparent 1px 4px)`,
      backgroundSize: "300% 300%, auto",
      backgroundPosition: "var(--mx) var(--my), 0 0",
    },
  },
  stars: {
    k: 0.8,
    spot: true,
    layer: {
      backgroundImage: RAINBOW,
      backgroundSize: "220% 220%",
      backgroundPosition: "var(--mx) var(--my)",
      ...mask(
        STARS,
        "calc(26 * var(--mm)) calc(26 * var(--mm))",
        "calc(var(--px) * -4 * var(--mm)) calc(var(--py) * -4 * var(--mm))",
      ),
    },
  },
  shards: {
    k: 0.6,
    spot: true,
    layer: {
      // Crushed glass: a pastel band moving with the pointer, differenced
      // against flat grey Voronoi cells, so each facet takes its own tint and
      // brightens or dims as the light moves; then lifted towards white.
      backgroundImage:
        "linear-gradient(#5a5a5a, #5a5a5a)," +
        "repeating-linear-gradient(125deg, hsl(185 100% 80%) 0%, hsl(150 90% 80%) 5%, hsl(270 100% 85%) 10%, hsl(330 100% 85%) 15%, hsl(55 100% 82%) 20%, hsl(185 100% 80%) 25%)," +
        "url(/card/shards.webp)",
      backgroundBlendMode: "screen, difference, normal",
      backgroundSize: "auto, 300% 300%, 100% 100%",
      backgroundPosition: "0 0, var(--mx) var(--my), 0 0",
    },
  },
  cosmos: {
    k: 0.85,
    spot: false,
    layer: {
      // Star points over a drifting violet/magenta/teal nebula on a dusk tint.
      backgroundImage:
        "radial-gradient(circle, #fff 0 .7px, transparent 1.2px), radial-gradient(circle, #fff 0 .5px, transparent 1px), radial-gradient(circle, #fff 0 1px, transparent 1.6px)," +
        "radial-gradient(ellipse 45% 55% at calc(20% + var(--px) * 25%) calc(30% + var(--py) * 20%), hsl(275 90% 65% / .75), transparent 70%)," +
        "radial-gradient(ellipse 40% 50% at calc(80% - var(--px) * 30%) calc(70% - var(--py) * 25%), hsl(320 95% 66% / .65), transparent 70%)," +
        "radial-gradient(ellipse 35% 45% at calc(55% + var(--px) * 10%) calc(20% + var(--py) * 40%), hsl(180 90% 58% / .55), transparent 70%)," +
        "linear-gradient(hsl(245 60% 18% / .45), hsl(245 60% 18% / .45))",
      backgroundSize: "13px 17px, 7px 11px, 29px 23px, auto, auto, auto, auto",
      backgroundPosition: "0 0, 3px 5px, 9px 4px, 0 0, 0 0, 0 0, 0 0",
    },
  },
  hearts: {
    k: 0.75,
    spot: true,
    layer: {
      backgroundImage:
        "linear-gradient(120deg, hsl(335 100% 74%), hsl(290 100% 78%), hsl(200 100% 76%), hsl(350 100% 74%), hsl(45 100% 74%))",
      backgroundSize: "250% 250%",
      backgroundPosition: "var(--mx) var(--my)",
      ...mask(
        HEARTS,
        "calc(22 * var(--mm)) calc(22 * var(--mm))",
        "calc(var(--px) * -4 * var(--mm)) calc(var(--py) * -4 * var(--mm))",
      ),
    },
  },
  shapes: {
    k: 0.8,
    spot: true,
    layer: {
      backgroundImage: RAINBOW,
      backgroundSize: "200% 200%",
      backgroundPosition: "calc(var(--px) * 300%) var(--my)",
      // The pattern drifts a little against the pointer, the colours a lot.
      ...mask(SHAPES, "32px 32px", "calc(var(--px) * -16px) calc(var(--py) * -16px)"),
    },
  },
  gold: {
    k: 0.6,
    spot: false,
    layer: {
      backgroundImage:
        "linear-gradient(115deg, transparent 30%, rgba(255,214,120,.45) 41%, rgba(255,248,225,.95) 48%, rgba(255,232,160,.85) 51%, rgba(196,140,40,.5) 58%, transparent 70%), linear-gradient(rgba(214,168,72,.14), rgba(214,168,72,.14))",
      backgroundSize: "250% 250%, auto",
      backgroundPosition: "var(--mx) var(--my), 0 0",
    },
  },
  silver: {
    k: 0.65,
    spot: false,
    layer: {
      // Bright white sweep over fine brushed streaks, faintly cool.
      backgroundImage:
        "linear-gradient(115deg, transparent 30%, rgba(214,222,236,.5) 41%, rgba(255,255,255,.98) 48%, rgba(236,242,250,.9) 51%, rgba(140,152,170,.45) 58%, transparent 70%)," +
        "repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 1px, rgba(120,130,150,.08) 1px 2px, transparent 2px 3px)," +
        "linear-gradient(rgba(186,198,216,.22), rgba(186,198,216,.22))",
      backgroundSize: "250% 250%, auto, auto",
      backgroundPosition: "var(--mx) var(--my), 0 0, 0 0",
    },
  },
  aurora: {
    k: 0.6,
    spot: false,
    layer: {
      // Two soft band sets at different angles drift at different speeds.
      backgroundImage:
        "linear-gradient(165deg, transparent 18%, rgba(70,255,180,.75) 32%, transparent 44%, rgba(80,200,255,.6) 56%, transparent 68%, rgba(170,110,255,.75) 80%, transparent 92%)," +
        "linear-gradient(195deg, transparent 25%, rgba(140,90,255,.5) 40%, transparent 52%, rgba(60,240,200,.55) 66%, transparent 80%)",
      backgroundSize: "100% 260%, 100% 220%",
      backgroundPosition: "0 calc(var(--py) * 100%), 0 calc(100% - var(--px) * 100%)",
    },
  },
};

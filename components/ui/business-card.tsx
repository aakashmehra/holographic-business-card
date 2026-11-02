"use client";

/**
 * Holographic Business Card. Designed & built by Aakash Mehra.
 * Hover (or touch) to tilt it toward the pointer and catch the foil
 * (see `CARD_EFFECTS` in ./card-effects, the `effect` prop).
 * Click, tap, Enter or Space to flip it over.
 */

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Globe, Mail, MapPin } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { FOIL, spot, type CardEffect } from "./card-effects";

export type { CardEffect };

const MAX_TILT = 16; // degrees
const HOVER_SCALE = 1.03;
// At rest the foil is barely there (keeps the QR scannable at any intensity).
const HOLO_REST = 0.12;

// Real card is 91 × 55 mm (Japanese size). Everything is laid out in card
// millimetres, so it scales with the card's on-screen width.
const CARD_W = "min(480px, calc(100vw - 32px))";
const mm = (n: number) => `calc(${n} * var(--mm))`;
const NAVY = "#0B1B33";
const BLUE = "#387FD9";
const MUTED = "#5B6B82";
const RADIUS = "rounded-[calc(3.5*var(--mm))]";

const glare: CSSProperties = {
  backgroundImage:
    "radial-gradient(farthest-corner circle at var(--mx) var(--my), rgba(255,255,255,.28) 0%, rgba(255,255,255,.06) 30%, transparent 60%)",
  opacity: "calc(var(--holo) * var(--fx))",
};

function Face({
  back,
  effect,
  opacity,
  className,
  children,
}: {
  back?: boolean;
  effect: CardEffect;
  opacity: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.span
      className={cn(
        "absolute inset-0 block overflow-hidden bg-white text-left [backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
        "shadow-[0_30px_60px_-20px_rgba(20,60,120,.5),0_4px_14px_rgba(20,60,120,.18)]",
        RADIUS,
        className,
      )}
      style={
        {
          transform: back ? "rotateY(180deg)" : "translateZ(0)",
          opacity,
        } as never
      }
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: `calc(var(--holo) * var(--fx) * ${FOIL[effect].k})`, ...(FOIL[effect].spot && spot) }}
      >
        <span className="absolute inset-0" style={FOIL[effect].layer} />
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0" style={glare} />
    </motion.span>
  );
}

function Front() {
  return (
    <span className="flex size-full flex-col">
      {/* The sky: website-blue gradient + the card's painted clouds */}
      <span
        className="relative block flex-1 overflow-hidden text-white"
        style={{
          backgroundImage:
            "url(/card/sky-clouds.webp), linear-gradient(180deg, #387FD9 0%, #3B85E0 35%, #4C98E5 70%, #6DB0EC 100%)",
          backgroundSize: "100% 100%",
        }}
      >
        <span
          className="absolute inset-0 flex flex-col"
          style={{ padding: `${mm(5)} ${mm(6.5)} ${mm(6.5)}` }}
        >
          <span className="flex items-center font-medium" style={{ gap: mm(1.6), fontSize: mm(3) }}>
            <span aria-hidden>👋</span> Hey, I&apos;m Aakash
          </span>
          <span
            className="mt-auto flex items-center justify-between"
            style={{ gap: mm(3), translate: `0 ${mm(-3.5)}` }}
          >
            <span className="block leading-[0.85] [text-shadow:0_2px_18px_rgba(10,40,90,.18)]">
              <span className="block font-medium tracking-[-0.05em]" style={{ fontSize: mm(12.5) }}>
                product
              </span>
              <span
                className="block font-[family-name:var(--font-caveat)] font-bold"
                style={{ fontSize: mm(12.5 * 0.95 * 0.68), margin: "0.05em 0 0 0.15em" }}
              >
                designer &amp; developer
              </span>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/card/face.webp"
              alt=""
              draggable={false}
              className="h-auto shrink-0 drop-shadow-[0_6px_10px_rgba(10,40,90,.3)]"
              style={{ width: mm(17) }}
            />
          </span>
        </span>
        {/* Sky melts into the white strip */}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px block bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,.55)_60%,#fff_100%)]"
          style={{ height: mm(6) }}
        />
      </span>
      {/* White strip: where I am, and the website */}
      <span
        className="flex shrink-0 items-center justify-between"
        style={{ height: mm(10), padding: `0 ${mm(6.5)}` }}
      >
        <span
          className="flex items-center gap-[0.4em] font-semibold tracking-[0.03em] text-[#111] font-[family-name:'Helvetica_Neue',Helvetica,Arial,sans-serif]"
          style={{ fontSize: mm(2.3) }}
        >
          <span className="font-normal text-[#6B7280]">BASED IN</span>
          <MapPin aria-hidden className="size-[1.05em] -mr-[0.15em] fill-current stroke-white" strokeWidth={2.5} />
          <span>JAPAN</span>
        </span>
        <span className="font-semibold" style={{ fontSize: mm(2.3), color: BLUE }}>
          aakashmehra.com <span aria-hidden>↗</span>
        </span>
      </span>
    </span>
  );
}

function Back() {
  const jp = "font-[family-name:var(--font-noto-jp)] font-medium";
  const row = "flex items-center";
  const icon = { width: mm(2.6), height: mm(2.6), color: BLUE };
  return (
    <span className="block size-full" style={{ color: NAVY }}>
      {/* A thin strip of sky ties the two sides together */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 block bg-[linear-gradient(90deg,#387FD9,#6DB0EC,#387FD9)]"
        style={{ height: mm(1.6) }}
      />
      <span
        className="absolute inset-0 grid grid-cols-[1fr_auto] items-center"
        style={{ padding: `${mm(6)} ${mm(6.5)}`, gap: mm(5) }}
      >
        <span className="block min-w-0">
          <span className="block font-bold tracking-[-0.03em]" style={{ fontSize: mm(5.2) }}>
            Aakash Mehra
          </span>
          <span
            className={cn("block tracking-[0.08em]", jp)}
            style={{ fontSize: mm(2.7), marginTop: mm(1), color: MUTED }}
          >
            メヘラ　アカーシュ
          </span>
          <span
            className="block font-semibold"
            style={{ fontSize: mm(2.5), marginTop: mm(1.2), color: BLUE }}
          >
            Thoughtful apps and websites
          </span>
          <span
            className={cn("block opacity-85", jp)}
            style={{ fontSize: mm(2), marginTop: mm(0.5), color: BLUE }}
          >
            心地よいアプリとウェブサイトを作っています
          </span>
          <span
            className="grid font-medium"
            style={{ marginTop: mm(3.2), gap: mm(1.2), fontSize: mm(2.35) }}
          >
            <span className={row} style={{ gap: mm(1.4) }}>
              <Globe aria-hidden strokeWidth={1.8} style={icon} />
              aakashmehra.com
            </span>
            <span className={row} style={{ gap: mm(1.4) }}>
              <Mail aria-hidden strokeWidth={1.8} style={icon} />
              hello@aakashmehra.com
            </span>
          </span>
        </span>
        <span
          className="relative block bg-[#F3F7FD]"
          style={{ width: mm(30), padding: mm(1.2), borderRadius: mm(4) }}
        >
          <span className="relative block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/card/qr.svg" alt="QR code to aakashmehra.com" draggable={false} className="block h-auto w-full" />
            <span
              className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30%] bg-white"
              style={{ width: mm(7.4), height: mm(7.4), boxShadow: `0 0 0 ${mm(0.6)} #F3F7FD` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/card/face.webp" alt="" draggable={false} className="h-auto w-[82%]" />
            </span>
          </span>
          <span
            className="block text-center font-semibold"
            style={{ marginTop: mm(1.2), fontSize: mm(1.9), color: MUTED }}
          >
            Scan to see my work
            <span className={cn("block", jp)} style={{ marginTop: mm(0.3), fontSize: mm(1.6) }}>
              スキャンして作品を見る
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

export function BusinessCard({
  effect = "shards",
  intensity = 0.25,
  className,
}: {
  effect?: CardEffect;
  /** Effect strength, 0..1 (scales foil and glare). */
  intensity?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  // Pointer position over the card, 0..1 (0.5 = centre).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const holo = useSpring(HOLO_REST, { stiffness: 120, damping: 20 });
  // Lifts a touch while hovered or touched, on the same spring as the tilt.
  const scale = useSpring(1, spring);

  // The spot under the pointer dips away from the viewer.
  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);
  const mx = useTransform(sx, (v) => `${v * 100}%`);
  const my = useTransform(sy, (v) => `${v * 100}%`);

  const flip = useSpring(0, { stiffness: 140, damping: 18 });
  // Swap faces at the halfway point too: backface-visibility alone isn't
  // honoured by every WebKit build.
  const frontOpacity = useTransform(flip, (a): number => (a < 90 ? 1 : 0));
  const backOpacity = useTransform(flip, (a): number => (a < 90 ? 0 : 1));
  const toggle = () => {
    const next = flip.get() < 90 ? 180 : 0;
    if (reduceMotion) flip.jump(next);
    else flip.set(next);
    setFlipped(next === 180);
  };

  // Tracked on the untransformed wrapper: the tilted card's edges move out from
  // under the pointer, which would otherwise reset the tilt and flicker.
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    holo.set(1);
    scale.set(HOVER_SCALE);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    holo.set(HOLO_REST);
    scale.set(1);
  };

  return (
    <div
      className={cn("aspect-[91/55]", className)}
      style={
        { width: CARD_W, "--mm": `calc(${CARD_W} / 91)`, perspective: 1200 } as CSSProperties
      }
      onPointerDown={track}
      onPointerMove={track}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.button
        type="button"
        aria-label={
          flipped
            ? "Aakash Mehra's business card, back: hello@aakashmehra.com, aakashmehra.com and a QR code to the website. Flip to front."
            : "Aakash Mehra, product designer & developer, based in Japan. aakashmehra.com. Flip card."
        }
        onClick={toggle}
        className={cn(
          "relative block size-full cursor-pointer touch-none select-none outline-none [-webkit-tap-highlight-color:transparent]",
          "focus-visible:ring-2 focus-visible:ring-[#387FD9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#DCE9F8]",
          RADIUS,
        )}
        style={
          {
            rotateX: reduceMotion ? 0 : rotateX,
            rotateY: reduceMotion ? 0 : rotateY,
            scale: reduceMotion ? 1 : scale,
            transformStyle: "preserve-3d",
            "--px": sx,
            "--py": sy,
            "--mx": mx,
            "--my": my,
            "--holo": holo,
            // sqrt: 100% = full strength, the 25% default ≈ half, a gentle shimmer.
            "--fx": Math.sqrt(Math.min(1, Math.max(0, intensity))),
          } as never
        }
      >
        <motion.span
          className="absolute inset-0 block [transform-style:preserve-3d]"
          style={{ rotateY: flip }}
        >
          <Face effect={effect} opacity={frontOpacity}>
            <Front />
          </Face>
          <Face back effect={effect} opacity={backOpacity}>
            <Back />
          </Face>
        </motion.span>
      </motion.button>
    </div>
  );
}

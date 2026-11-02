"use client";

import { BusinessCard } from "@/components/ui/business-card";
import { CARD_EFFECTS, type CardEffect } from "@/components/ui/card-effects";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BusinessCardDemo() {
  const [effect, setEffect] = useState<CardEffect>("shards");
  const [intensity, setIntensity] = useState(25);

  return (
    // Pale, flat blue from the card's sky family.
    // Phones: card, byline, control stacked. lg+: the control sits just right
    // of the card, which stays centred.
    <main className="flex flex-1 flex-col items-center justify-center bg-[#DCE9F8] px-4 py-16">
      <div className="flex flex-col items-center gap-7 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-7 lg:self-stretch">
        <BusinessCard
          effect={effect}
          intensity={intensity / 100}
          className="lg:col-start-2 lg:row-start-1"
        />
        <p className="text-xs text-[#4A5D78] lg:col-start-2 lg:row-start-2 lg:justify-self-center">
          by{" "}
          <a
            href="https://aakashmehra.com/ref/businesscard"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#0B1B33] underline-offset-4 hover:underline"
          >
            aakashmehra.com
          </a>
        </p>
        <div className="flex flex-col items-end gap-3 text-sm font-medium text-[#33465F] lg:col-start-3 lg:row-start-1 lg:justify-self-start">
          <label className="flex items-center gap-2.5">
            Effect
            <span className="relative">
              <select
                value={effect}
                onChange={(e) => setEffect(e.target.value as CardEffect)}
                className="w-32 cursor-pointer appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-sm text-[#0B1B33] shadow-sm ring-1 ring-[#B7CBE6] outline-none hover:ring-[#8FAED6] focus-visible:ring-2 focus-visible:ring-[#387FD9]"
              >
                {CARD_EFFECTS.map((e) => (
                  <option
                    key={e.id}
                    value={e.id}
                    className="bg-white text-[#0B1B33]"
                  >
                    {e.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#5B6B82]"
              />
            </span>
          </label>
          <label className="flex items-center gap-2.5">
            Intensity
            <span className="flex w-32 items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                aria-valuetext={`${intensity}%`}
                className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[#387FD9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387FD9]"
              />
              <output className="w-9 text-right tabular-nums text-[#0B1B33]">
                {intensity}%
              </output>
            </span>
          </label>
        </div>
      </div>
    </main>
  );
}

"use client";

/**
 * Prefetch some images on the home page so they don't flash when navigating to sub-pages
 */

import { AGENTS } from "@/lib/agents";
import Image from "next/image";

export function Prefetcher() {
  return (
    <div className="fixed invisible size-px overflow-hidden pointer-events-none">
      {/* Agents */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="shimmer" fetchPriority="high" src="/images/shimmer.png" className="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/card.png" alt="" fetchPriority="high" />
      {AGENTS.map((agent) => (
        <Image key={agent.id} priority alt={agent.name} src={agent.imageUrl} width={260} height={260} />
      ))}

      {/* Dreamkit */}
      <Image priority alt="dreamkit" src="/images/dreamkit.png" width={560} height={218} />
      <Image priority alt="buy dream" src="/images/kit-buy-dream.png" width={148} height={50} />

      {/* Dreamcoins */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="sky" fetchPriority="high" src="/images/sky-dreamcoins.jpg" />

      {/* Chain */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="dreamchain" fetchPriority="high" src="/images/chain.png" className="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="noise" fetchPriority="high" src="/images/noise.png" className="" />
    </div>
  );
}

"use client";

import { useDream } from "@/hooks/getDream";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { GlowPanel } from "@/components/GlowPanel";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowIcon } from "@/components/icons/arrow";
import { getWowUrl, WOW_URL } from "@/lib/constants";
import { format } from "date-fns";
import { FadeInImage } from "@/components/FadeInImage";
import { DreamStatus } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";


export default function DreamPage({ params }: { params: { id: string } }) {
  const { dream, isLoading, error } = useDream(params.id);
  const formattedDate = dream 
    ? format(new Date(dream.createdAt), "HH:mm a MMM dd yyyy").toUpperCase()
    : "";
  const [copied, setCopied] = useState(false);

  if (error) {
    return (
      <main className="relative min-h-svh sm:min-h-screen">
        <AnimatedGradient />
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <GlowPanel>
            <div className="p-6 text-center text-white font-mono">
              Failed to load dream
            </div>
          </GlowPanel>
        </div>
      </main>
    );
  }

  if (isLoading || !dream) {
    return (
      <main className="relative min-h-svh sm:min-h-screen">
        <AnimatedGradient />
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <GlowPanel>
            <div className="p-6">
              <Skeleton className="w-full h-[130px] sm:h-[140px]" />
            </div>
          </GlowPanel>
        </div>
      </main>
    );
  }

  const dreamUrl = dream.address ? getWowUrl(dream.address) : WOW_URL;

  return (
    <main className="relative min-h-svh sm:min-h-screen">
      <AnimatedGradient />
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 flex flex-col gap-8">
        <GlowPanel>
          <div className="p-6 flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="relative w-full sm:w-48 aspect-square sm:h-48 rounded-2xl overflow-hidden">
              <FadeInImage
                src={dream.imageUrl ?? ""}
                alt={dream.prompt}
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center gap-4 text-white font-mono">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl uppercase tracking-wider">${dream.ticker}</h1>
                <h2 className="text-lg uppercase tracking-wide text-white/80">{dream.name}</h2>
                <p className="text-xs text-white/60">{formattedDate} — Base</p>

                {dream.status === DreamStatus.COMPLETED && (
                  <div className="flex flex-col gap-3 mt-2">
                    <ExternalLink 
                      href={dreamUrl} 
                      className="flex items-center gap-1transition-colors"
                    >
                      Buy on WOW <ArrowIcon className="w-5 h-5" />
                    </ExternalLink>
                    
                    {dream.address && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/60">Contract:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(dream.address!);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-sm text-white/80 hover:text-white transition-colors truncate max-w-[200px] flex items-center gap-2"
                          title={dream.address}
                        >
                          <span>{dream.address.slice(0, 6)}...{dream.address.slice(-4)}</span>
                          {copied && (
                            <span className="text-dream-primary text-xs">Copied!</span>
                          )}
                        </button>
                      </div>
                    )}
                     <div className="flex items-center gap-2">
                       
                        <ExternalLink href={`https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=${dream.address}&value=0.1&field=input`} className="text-sm text-white/80 hover:text-white transition-colors flex flex-row gap-2 no-underline">
                                                  <span className="text-xs text-white/60 underline">Uniswap</span>
                        </ExternalLink>
                         <ExternalLink href={`https://dexscreener.com/base/${dream.address}`} className="text-sm text-white/80 hover:text-white transition-colors flex flex-row gap-2 no-underline">
                                                  <span className="text-xs text-white/60 underline">Dexscreener</span>
                        </ExternalLink>
                        <ExternalLink href={`https://basescan.org/address/${dream.address}`} className="text-sm text-white/80 hover:text-white transition-colors flex flex-row gap-2 no-underline">
                                                  <span className="text-xs text-white/60 underline">Basescan</span>
                        </ExternalLink>
                      </div>
                  </div>
                )}

                {(
                  <div className="flex flex-col gap-2">
                    {dream.status === DreamStatus.PENDING && (
                      <div className="flex items-center gap-2 text-dream-primary">
                        <div className="w-2 h-2 rounded-full bg-dream-primary animate-pulse" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    )}

                    {Date.now() - new Date(dream.createdAt).getTime() < 5 * 60 * 1000 && (
                      <p className="text-sm text-white/60">
                        Your token may take up to 60 seconds to appear on WOW.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlowPanel>

        {/* GeckoTerminal iframe */}
        {dream.address && (
          <GlowPanel className="flex-1">
            <iframe
              src={`https://www.geckoterminal.com/base/pools/${dream.address}?embed=1&info=0&swaps=1`}
              className="w-full h-[calc(100vh-400px)] rounded-xl"
              frameBorder="0"
            />
          </GlowPanel>
        )}
      </div>
    </main>
  );
}


"use client";

import { cn } from "@/lib/utils";
import { GlowPanel } from "../GlowPanel";
import { ArrowIcon } from "../icons/arrow";
import { ExternalLink } from "../ui/ExternalLink";
import { DREAM_TOKEN_URL, DREAM_UNISWAP_URL, PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "@/lib/constants";
import { useMarketCap } from "@/hooks/getMarketCap";

export default function BuyDreamButton({ className }: { className?: string }) {
  const { marketCapData, loading } = useMarketCap();

  const formatMarketCap = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <GlowPanel
      className={cn(
        "fixed top-18 sm:top-20 left-3 sm:left-9 max-sm:right-3 max-w-full sm:max-w-[260px] flex opacity-[0.82] sm:hover:opacity-[1]",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-4 max-sm:my-3 m-4">
        <p className="text-[13px] font-mono text-white">
          A token launcher built on Zora&apos;s WOW protocol. Fees from dreamcoins are used to buy and burn $DREAM.
        </p>
        <div className="flex max-sm:items-center max-sm:justify-between sm:flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-2">
            <ExternalLink href={ DREAM_UNISWAP_URL } className="text-white w-fit">
              <button className="flex items-center gap-0 sm:gap-1">
                <p className="text-sm sm:text-[15px] font-mono uppercase">$DREAM</p>
                <ArrowIcon className="w-6 h-6" />
              </button>
            </ExternalLink>
            {!loading && marketCapData && (
              <div className="flex-col gap-2 text-xs font-mono">
                <p className="text-xs text-white/80">
                  Current mcap {formatMarketCap(marketCapData.dream2.usd_market_cap)}
                </p>
                <p className={cn(
                  "text-xs",
                  marketCapData.dream2.usd_24h_change >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  [{marketCapData.dream2.usd_24h_change.toFixed(2)}% 24h]
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink href={TERMS_OF_SERVICE_URL} className="text-[10px] text-white/80 uppercase">
              Terms
            </ExternalLink>
            <p className="text-[10px] text-white/80">•</p>
            <ExternalLink href={PRIVACY_POLICY_URL} className="text-[10px] text-white/80 uppercase">
              Privacy
            </ExternalLink>
          </div>
        </div>
      </div>
    </GlowPanel>
  );
}

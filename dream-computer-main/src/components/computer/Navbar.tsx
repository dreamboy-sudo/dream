"use client";

import { MaybeLink } from "@/components/ExternalLink";
import { useMarketCap } from "@/hooks/useMarketCap";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo, useCallback, ReactNode } from "react";

export function NavLinks({ className }: { className?: string }) {
  const { data } = useMarketCap();

  const marketCap = useMemo(() => {
    if (!data) return null;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(data.marketCap);
  }, [data]);

  const renderLink = useCallback((text: ReactNode, href?: string) => {
    return (
      <MaybeLink href={href} className="font-mono uppercase text-xs underline underline-offset-4" external>
        {text}
      </MaybeLink>
    );
  }, []);

  return (
    <div className={cn("flex items-center gap-3 md:gap-4 h-full", className)}>
      {marketCap &&
        renderLink(
          <>
            <span className="max-md:hidden">Market Cap: </span>
            <span className="md:hidden">MC: </span>
            {marketCap}
          </>
        )}
      {process.env.NEXT_PUBLIC_TWITTER_URL && renderLink("Twitter", process.env.NEXT_PUBLIC_TWITTER_URL)}
      {process.env.NEXT_PUBLIC_TELEGRAM_URL && renderLink("Telegram", process.env.NEXT_PUBLIC_TELEGRAM_URL)}
      {process.env.NEXT_PUBLIC_UNISWAP_EXPLORE_URL && renderLink("Uniswap", process.env.NEXT_PUBLIC_UNISWAP_EXPLORE_URL)}
    </div>
  );
}

export function Navbar({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center h-8", className)}>
      <div className="flex items-center gap-2 h-full">
        <Image priority alt="logo" src="/images/logo-nav.png" height={28} width={28} className="size-6 md:size-7" />
        <Image
          priority
          alt="wordmark"
          src="/images/wordmark.png"
          height={12}
          width={110}
          className="h-2.5 md:h-3 w-[92px] md:w-[110px]"
        />
      </div>

      <NavLinks className="ml-auto hidden md:flex" />
    </div>
  );
}

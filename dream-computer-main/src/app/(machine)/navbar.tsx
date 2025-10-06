"use client";

import { MaybeLink } from "@/components/ExternalLink";
import { useMarketCap } from "@/hooks/useMarketCap";
import { DREAM_DEXSCREENER_URL, DREAM_TELEGRAM_URL, DREAM_TWITTER_URL, DREAM_UNISWAP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useCallback, useMemo } from "react";

function NavLinks({ className }: { className?: string }) {
  const { data } = useMarketCap();

  const marketCap = useMemo(() => {
    if (!data) return null;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(data.marketCap);
  }, [data]);

  const renderLink = useCallback((text: ReactNode, href?: string, className?: string) => {
    return (
      <MaybeLink
        href={href}
        className={cn("font-mono uppercase text-xs text-white underline underline-offset-4", className)}
        external
      >
        {text}
      </MaybeLink>
    );
  }, []);

  return (
    <div className={cn("flex items-center gap-3 md:gap-5", className)}>
      {marketCap &&
        renderLink(
          <>
            <span className="max-md:hidden">Market Cap: </span>
            <span className="md:hidden">MC: </span>
            {marketCap}
          </>,
          DREAM_DEXSCREENER_URL
        )}
      {renderLink("X", DREAM_TWITTER_URL)}
      {renderLink("Telegram", DREAM_TELEGRAM_URL)}
      {renderLink("Uniswap", DREAM_UNISWAP_URL, "max-sm:hidden")}
    </div>
  );
}

export function Navbar({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end inset-x-0 top-0 h-12", className)}>
      <Link className="flex items-center gap-1.5 mb-0.5" href="/">
        <Image
          priority
          alt="logo"
          src="/images/logo-nav-dark.png"
          height={28}
          width={28}
          className="size-6 md:size-7"
        />
        <Image
          priority
          alt="wordmark"
          src="/images/wordmark-dark.png"
          height={12}
          width={110}
          className="h-2.5 md:h-3 w-[92px] md:w-[110px]"
        />
      </Link>

      <NavLinks className="ml-auto mb-2" />
    </div>
  );
}

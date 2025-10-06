"use client";

import Link from "next/link";
import { TELEGRAM_URL, TWITTER_URL, WOW_URL } from "@/lib/constants";
import { ExternalLink } from "../ui/ExternalLink";
import { MouseEventHandler, PropsWithChildren, useEffect, useState } from "react";
import { FAQDialog } from "../app/FAQDialog";
import { Wordmark } from "../icons/wordmark";
import { GlowButton } from "../GlowButton";
import { ArrowIcon } from "../icons/arrow";
import { useDreamMode } from "@/contexts/DreamModeContext";
import { WordmarkThankful } from "../icons/wordmark-thankful";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchButton } from "../app/SearchButton";
import { ConnectWalletHeaderButton } from "../app/ConnectWalletHeaderButton";

function NavLink({
  children,
  href,
  onClick,
}: PropsWithChildren<{
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}>) {
  return (
    <ExternalLink href={href ?? "#"} onClick={onClick}>
      <GlowButton contentClassName="ml-6 mr-3 my-1 gap-1.5 uppercase">
        {children}
        {href && <ArrowIcon className="w-7 h-7" />}
      </GlowButton>
    </ExternalLink>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ExternalLink href={href} className="flex items-center gap-0 text-sm text-white uppercase">
      {children} <ArrowIcon className="w-6 h-6" />
    </ExternalLink>
  );
}

export const Header = () => {
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { mode } = useDreamMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if URL has #faq
    const shouldBeOpen = window.location.hash === '#faq';
    setIsFAQOpen(shouldBeOpen);
  }, [pathname, searchParams]);

  const onOpenChange = (open: boolean) => {
    setIsFAQOpen(open);
    if (open) {
      // Preserve search params when adding #faq
      const currentSearch = searchParams.toString();
      const searchString = currentSearch ? `?${currentSearch}` : '';
      window.history.pushState(null, '', `${pathname}${searchString}#faq`);
    } else {
      // Preserve search params when removing #faq
      const currentSearch = searchParams.toString();
      const searchString = currentSearch ? `?${currentSearch}` : '';
      window.history.pushState(null, '', `${pathname}${searchString}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 z-50">
        <nav className="flex items-center px-4 sm:px-8 h-full">
          {/* Logo */}
          <Link href="/">
            <Wordmark className="w-[180px] sm:w-[330px]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-auto hidden md:flex items-center gap-3">
            <SearchButton />
          
                        <ConnectWalletHeaderButton />


            <GlowButton
              containerClassName="h-10"
              contentClassName="uppercase"
              onClick={() => setIsFAQOpen(true)}
            >
              FAQ
            </GlowButton>
          </div>

          {/* Mobile Navigation */}
          <div className="ml-auto flex md:hidden items-center gap-2">
            <SearchButton />
            <ConnectWalletHeaderButton />
            
            <button
              onClick={() => setIsFAQOpen(true)}
              className="flex items-center gap-1 text-sm text-white uppercase underline"
            >
              FAQ
            </button>
          </div>
        </nav>
      </header>

      <FAQDialog isOpen={isFAQOpen} onOpenChange={onOpenChange} />
    </>
  );
};

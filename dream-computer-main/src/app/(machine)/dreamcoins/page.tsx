import { BackButton } from "@/components/BackButton";
import { ArrowIcon } from "@/components/dreamcoins/Arrow";
import { GlowButton } from "@/components/dreamcoins/GlowButton";
import { GlowPanel } from "@/components/dreamcoins/GlowPanel";
import { Wordmark } from "@/components/dreamcoins/Wordmark";
import { ExternalLink } from "@/components/ExternalLink";
import { DREAMCOINS_URL } from "@/lib/constants";

export default function Page() {
  return (
    <div
      className="relative flex flex-1 items-center justify-center min-h-full w-full bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/sky-dreamcoins.jpg")',
        filter: "blur(5%)",
      }}
    >
      <div className="flex flex-col items-center w-full py-20 px-5">
        <Wordmark className="w-[320px] sm:w-[470px]" />
        <GlowPanel className="md:mt-6 sm:max-w-sm">
          <p className="font-mono text-white text-sm m-4">
            Launch a token on Base in one click, no wallet needed. Fees generated from token launches are used to buy
            and burn $DREAM, driving continuous value to the network.
          </p>
        </GlowPanel>
        <ExternalLink href={DREAMCOINS_URL}>
          <GlowButton containerClassName="mt-4 md:mt-6" contentClassName="flex items-center gap-1 text-sm uppercase">
            Open
            <ArrowIcon className="size-6" />
          </GlowButton>
        </ExternalLink>
      </div>

      <BackButton className="fixed top-[76px] md:top-22 right-[26px] md:right-10 z-20" />
    </div>
  );
}

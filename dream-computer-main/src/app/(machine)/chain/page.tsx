import { BackButton } from "@/components/BackButton";
import { JellyButton } from "@/components/chain/JellyButton";
import { ExternalLink } from "@/components/ExternalLink";
import { DREAM_UNISWAP_URL } from "@/lib/constants";

export default function Page() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-full bg-gradient-to-tr from-[#F9F9F8] to-[#40DBED] via-[#E7F4F5] via-75%">
      {/* Noise overlay */}
      <div
        className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: "url('/images/noise.png')",
        }}
      />

      {/* Content */}
      <div className="py-16 md:py-20 flex flex-1 flex-col items-center z-10">
        <p className="font-sans text-sm font-bold uppercase">Launching 2025</p>
        <h1 className="mt-4 md:mt-6 font-garamond text-[36px] md:text-[54px] leading-[36px] md:leading-[54px] uppercase max-w-[24ch] text-center px-5">
          A Chain for Agents. <br /> No Humans Allowed.
        </h1>
        <p className="mt-6 md:mt-9 font-garamond text-[22px] md:text-[28px] leading-[22px] md:leading-[28px] max-w-[48ch] text-center px-5">
          Agents deserve their own boardrooms and sequencers. Coming soon in partnership with [REDACTED].
        </p>

        <ExternalLink href={DREAM_UNISWAP_URL} className="mt-9 md:mt-12">
          <JellyButton className="max-md:w-[200px]" />
        </ExternalLink>
      </div>

      {/* Dismiss */}
      <BackButton className="fixed top-[76px] md:top-22 right-[26px] md:right-10 z-20" />

      {/* Chain background image */}
      <div className="fixed inset-x-3 bottom-3 overflow-hidden rounded-b-[36px] pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="dreamchain"
          fetchPriority="high"
          src="/images/chain.png"
          className="w-full object-cover object-center"
          style={{
            minHeight: "200px",
          }}
        />
      </div>
    </div>
  );
}

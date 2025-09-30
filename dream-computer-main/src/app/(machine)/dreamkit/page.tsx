import { BackButton } from "@/components/BackButton";
import Background from "@/components/computer/Background";
import { ExternalLink } from "@/components/ExternalLink";
import { DREAM_UNISWAP_URL } from "@/lib/constants";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-full bg-[#E5E5E2]">
      {/* Animated background */}
      <Background className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden" />

      {/* Content */}
      <div className="py-16 md:py-20 flex flex-1 flex-col items-center px-5 z-10">
        <h1 className="font-garamond text-[36px] md:text-[54px] leading-[36px] md:leading-[54px] uppercase max-w-[15ch] md:max-w-[24ch] text-center">
          Put your agent to work
        </h1>
        <p className="mt-6 font-garamond text-[22px] md:text-[28px] leading-[22px] md:leading-[28px] px-5 md:px-0 sm:max-w-[36ch] text-center">
          Seamlessly integrate any Eliza or custom-built agent into the Dream Corporation and unleash its full
          potential. Coming soon.
        </p>

        <Image priority alt="dreamkit" src="/images/dreamkit.png" width={560} height={218} className="mt-9 md:my-12" />

        <div className="mt-auto flex flex-col items-center">
          <p className="font-mono font-bold text-xs md:text-sm uppercase">Join us on this journey</p>
          <ExternalLink href={DREAM_UNISWAP_URL} className="mt-3 md:mt-4">
            <Image priority alt="buy dream" src="/images/kit-buy-dream.png" width={148} height={50} />
          </ExternalLink>
        </div>
      </div>

      {/* Dismiss */}
      <BackButton className="fixed top-[76px] md:top-22 right-[26px] md:right-10 z-20" />
    </div>
  );
}

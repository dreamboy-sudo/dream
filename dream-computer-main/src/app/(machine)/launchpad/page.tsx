import { AgentCard } from "@/components/agents/AgentCard";
import { BackButton } from "@/components/BackButton";
import { ExternalLink } from "@/components/ExternalLink";
import { AgentStack } from "@/components/launchpad/Stack";
import { YOUR_AGENT } from "@/lib/agents";
import { LAUNCHPAD_WAITLIST_URL } from "@/lib/constants";

export default function Page() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-full bg-[#0095FF] overflow-hidden">
      {/* Layered background elements */}
      <div
        className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden bg-center bg-cover bg-no-repeat opacity-20 z-10"
        style={{
          backgroundImage: 'url("/images/sky-dreamcoins.jpg")',
          filter: "blur(25%)",
        }}
      />

      <div
        className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden bg-center bg-cover bg-no-repeat z-10"
        style={{
          backgroundImage: 'url("/images/shimmer.png")',
        }}
      />

      <div className="flex flex-col items-center mt-18 md:mt-20 mix-blend-overlay z-20">
        <h2 className="font-kanada italic text-[18px] sm:text-[32px] lg:text-[58px] leading-[18px] sm:leading-[32px] lg:leading-[58px] text-center text-[#212121] md:max-w-[14ch] px-4 break-words select-none">
          the dream agent launchpad
        </h2>
        <p className="mt-8 md:mt-12 font-garamond text-[22px] md:text-[28px] leading-[22px] md:leading-[28px] px-10 md:px-0 sm:max-w-[56ch] text-center">
          The launchpad is now in private beta. A select group of early partners are building groundbreaking agents
          using the Dream Stack. Coming soon to everyone.
        </p>
        <ExternalLink
          href={LAUNCHPAD_WAITLIST_URL}
          className="mt-6 md:mt-8 font-garamond text-[22px] md:text-[28px] leading-[22px] md:leading-[28px] underline underline-offset-4"
        >
          Get in Touch
        </ExternalLink>
      </div>

      {/* Agents */}
      <AgentStack className="max-xl:hidden absolute -bottom-28 -left-24 z-20" />

      {/* Your agent */}
      <AgentCard
        agent={YOUR_AGENT}
        shouldLink={false}
        className="absolute left-0 right-0 mx-auto -bottom-[190px] sm:-bottom-40 lg:-bottom-[210px] xl:-bottom-40 w-[250px] xl:w-[360px] !h-[auto] z-20"
      />

      {/* Dismiss */}
      <BackButton className="fixed top-[76px] md:top-22 right-[26px] md:right-10 z-20" />
    </div>
  );
}

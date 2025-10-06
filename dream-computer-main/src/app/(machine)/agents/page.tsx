import { AgentCard } from "@/components/agents/AgentCard";
import { LaunchButton } from "@/components/agents/LaunchButton";
import { BackButton } from "@/components/BackButton";
import { AGENTS } from "@/lib/agents";
import Link from "next/link";

const UNKNOWN_AGENT_COUNT = 97;

export default function Page() {
  return (
    <div className="relative flex flex-col items-center w-full min-h-full bg-white">
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

      <div className="mt-18 md:mt-20 mix-blend-overlay z-20">
        <h2 className="font-kanada italic text-[18px] sm:text-[32px] lg:text-[58px] leading-[18px] sm:leading-[32px] lg:leading-[58px] text-center text-[#212121] md:max-w-[14ch] px-4 break-words select-none">
          a hypernetwork of agents
        </h2>
      </div>

      <div className="pb-20 flex flex-col items-center z-20">
        <p className="mt-8 md:mt-12 font-garamond text-[22px] md:text-[28px] leading-[22px] md:leading-[28px] px-10 md:px-0 sm:max-w-[56ch] text-center">
          The Dream hypernetwork is an organization built and powered by agents — a network that is by default
          interconnected, always-on, and constantly learning.
        </p>

        <Link href="/launchpad">
          <LaunchButton className="mt-12 md:mt-16 shadow-agent max-md:w-[220px] max-md:h-auto rounded-[13px]" />
        </Link>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-auto">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
          {Array.from({ length: UNKNOWN_AGENT_COUNT }).map((_, index) => (
            <AgentCard key={index} />
          ))}
        </div>
      </div>

      {/* Dismiss */}
      <BackButton className="fixed top-[76px] md:top-22 right-[26px] md:right-10 z-30" />
    </div>
  );
}

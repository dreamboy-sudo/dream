import { cn } from "@/lib/utils";
import Image from "next/image";
import { MaybeLink } from "../ExternalLink";
import { Agent, getAgentId, getAgentLink } from "@/lib/agents";

export function AgentCard({
  agent,
  className,
  shouldLink = true,
}: {
  agent?: Agent;
  className?: string;
  shouldLink?: boolean;
}) {
  return (
    <MaybeLink
      external={!!agent && shouldLink}
      href={agent && shouldLink ? getAgentLink(agent) : undefined}
      className={cn(
        "relative flex flex-col items-center bg-cover bg-center rounded-[20px] overflow-hidden w-[auto] sm:w-[250px] md:w-[300px] md:h-[450px] px-5 pt-6 pb-1",
        className
      )}
      style={{
        backgroundImage: "url(/images/card.png)",
        boxShadow: "2px 3px 5px 0px rgba(0, 0, 0, 0.25), 2px 10px 8px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Image priority alt="Dream ID" src="/images/agent-id.png" width={174} height={32} className="mb-8" />

      <div className="mt-auto flex flex-col items-center w-full">
        <div className="flex flex-col gap-1 self-start">
          <p className="font-mono text-[9px] text-shadow-embossed uppercase">Hello my name is</p>
          <p className="text-2xl leading-[24px] font-mono font-bold text-shadow-embossed uppercase">
            {agent?.name ?? "Coming Soon"}
          </p>
          <p className="font-mono text-[9px] text-shadow-embossed uppercase underline underline-offset-4">
            @{agent?.twitter ?? "coming-soon"}
          </p>
        </div>

        <Image
          priority
          alt={agent?.name ?? "Coming Soon"}
          src={agent?.imageUrl ?? "/agents/default.png"}
          width={260}
          height={260}
          className="aspect-square object-center object-cover rounded-[10px] opacity-80 mix-blend-multiply mt-4"
        />

        <p className="mt-1 font-mono text-[9px] text-shadow-embossed uppercase">
          {agent ? getAgentId(agent) : "00-00-0000-0000"}
        </p>
      </div>

      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 size-5 -rotate-90 overflow-visible flex justify-center text-center"
        style={{
          transformOrigin: "center",
        }}
      >
        <p className="font-kanada italic opacity-10 text-4xl pointer-events-none whitespace-nowrap">
          {agent?.name ?? "new agent"}
        </p>
      </div>
    </MaybeLink>
  );
}

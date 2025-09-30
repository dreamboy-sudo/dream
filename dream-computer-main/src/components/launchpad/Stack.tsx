import { cn } from "@/lib/utils";
import { AgentCard } from "../agents/AgentCard";
import { AGENTS } from "@/lib/agents";

export function AgentStack({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center w-[500px] h-[450px] -rotate-3", className)}>
      <AgentCard
        agent={AGENTS[0]}
        shouldLink={false}
        className="absolute bottom-0 left-0 !w-[240px] !h-[auto] -rotate-[24deg]"
      />
      <AgentCard
        agent={AGENTS[1]}
        shouldLink={false}
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 !w-[240px] !h-[auto] z-10 -rotate-[12deg]"
      />
      <AgentCard agent={AGENTS[2]} shouldLink={false} className="absolute top-0 right-0 !w-[240px] !h-[auto] z-20" />
    </div>
  );
}

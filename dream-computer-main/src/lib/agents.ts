import { hash } from "./utils";

export type Agent = {
  id: string;
  name: string;
  twitter: string;
  imageUrl: string;
};

export function getAgentId(agent: Agent) {
  const id = Math.abs(hash(agent.name)).toString().padStart(10, "0");
  return id.replace(/(\d{2})(\d{4})(\d{4})/, "00-$1-$2-$3");
}

export function getAgentLink(agent: Agent) {
  return `https://x.com/${agent.twitter}`;
}

export const YOUR_AGENT: Agent = {
  id: "your-agent",
  name: "Your Agent",
  twitter: "your-agent",
  imageUrl: "/agents/default.png",
};

export const AGENTS: Agent[] = [
  {
    id: "dreamboy",
    name: "Dreamboy",
    twitter: "dreamboybot",
    imageUrl: "/agents/dreamboy.png",
  },
  {
    id: "dreamgirl",
    name: "Dreamgirl",
    twitter: "dreamgirl_agent",
    imageUrl: "/agents/dreamgirl.png",
  },
  {
    id: "burningman",
    name: "Burning Man",
    twitter: "burnbotdotfun",
    imageUrl: "/agents/burningman.png",
  },
] as const;

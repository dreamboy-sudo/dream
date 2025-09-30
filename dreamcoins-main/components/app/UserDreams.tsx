import { useDreams } from "@/hooks/getDreams";
import { GlowPanel } from "../GlowPanel";
import CompletedDream from "./CompletedDream";
import { usePrivy } from "@privy-io/react-auth";
import { DreamCard } from "./DreamCard";
import ClaimRewardButton from "./ClaimRewardButton";
import { ExternalLink } from "../ui/ExternalLink";
import { Button } from "../ui/button";

export default function UserDreams() {
  const { user, ready } = usePrivy();
  const { dreams } = useDreams(ready ? user?.wallet?.address : undefined);

  return (
    <GlowPanel>
          <div className="p-6">
            <h2 className="text-white text-lg font-mono mb-6">Your Dreamcoins</h2>
            
            {dreams.length > 0 ? (
              <div className="flex flex-col gap-2 justify-center">
                {dreams.map((dream) => (
                  <div key={dream.id} className="flex flex-col grow gap-2">
                    <div className="flex-1"><DreamCard dream={dream} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/60 text-center py-8">
                No dreamcoins created yet
              </div>
            )}
          </div>
        </GlowPanel>
  )
}
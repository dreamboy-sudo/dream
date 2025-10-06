'use client';

import { usePrivy } from '@privy-io/react-auth';
import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
import { GlowPanel } from '@/components/GlowPanel';
import { useBalance } from '@/hooks/useBalance';
import { useDreams } from '@/hooks/getDreams';
import { format } from 'date-fns';
import { DreamStatus } from '@prisma/client';
import { Wallet, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { ExternalLink } from '@/components/ui/ExternalLink';
import CompletedDream from '@/components/app/CompletedDream';
import { Button } from '@/components/ui/button';
import UserDreams from '@/components/app/UserDreams';
import ClaimRewardButton from '@/components/app/ClaimRewardButton';

export default function ProfilePage() {
  const { user, login, ready, linkTwitter, linkFarcaster, exportWallet } = usePrivy();
  const { balance } = useBalance();

  const isEmbedded = user?.wallet?.walletClientType === 'privy'

  if (!ready) {
    return <div />
  }

  if (!user) {
    return (
      <main className="relative min-h-svh sm:min-h-screen">
        <AnimatedGradient />
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <GlowPanel>
            <div className="p-6 flex flex-col items-center gap-4">
              <Button
                onClick={login}
                className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet To View Profile
              </Button>
            </div>
          </GlowPanel>
        </div>
      </main>
    );
  }

  const shortAddress = `${user.wallet?.address.slice(0, 6)}...${user.wallet?.address.slice(-4)}`;
  const joinDate = user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "Unknown";

  return (
    <main className="relative min-h-svh sm:min-h-screen">
      <AnimatedGradient />
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 flex flex-col gap-8">
        {/* Profile Info */}
        <GlowPanel>
          <div className="p-6 flex flex-col gap-6">
            <h1 className="text-white text-xl font-mono">Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4 text-white font-mono">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">Wallet Address</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{shortAddress}</span>
                    <ExternalLink 
                      href={`https://basescan.org/address/${user.wallet?.address}`}
                      className="text-white/60 hover:text-white"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </ExternalLink>
                  </div>
                  {isEmbedded && <div className="flex items-center gap-2">
                    <button onClick={exportWallet} className="text-xs underline text-white/60 hover:text-white hover:underline">Export wallet</button>
                  </div>}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">Wallet Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {balance} ETH (Base)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">Joined</span>
                  <span className="text-sm">{joinDate}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-white font-mono">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">Social</span>
                  <div className="flex flex-col gap-2">
                    {user.twitter ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Twitter Connected</span>
                        <ExternalLink 
                          href={`https://twitter.com/${user.twitter.username}`}
                          className="text-white/60 hover:text-white"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </ExternalLink>
                      </div>
                    ) : (
                      <Button
                        onClick={linkTwitter}
                        className="w-fit text-xs border-white bg-transparent rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 text-white"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="relative z-10">Link Twitter</span>
                        </div>
                      </Button>
                    )}

                    {user.farcaster ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Farcaster Connected</span>
                        <ExternalLink 
                          href={`https://warpcast.com/${user.farcaster.username}`}
                          className="text-white/60 hover:text-white"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </ExternalLink>
                      </div>
                    ) : (
                      <Button
                        onClick={linkFarcaster}
                        className="w-fit text-xs border-white bg-transparent rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 text-white"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="relative z-10">Link Farcaster</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlowPanel>
        <ClaimRewardButton />
        <UserDreams />
      </div>
    </main>
  );
}

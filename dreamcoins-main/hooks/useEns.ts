import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export function useEns(address?: string) {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function resolveEns() {
      if (!address) return;
      
      setIsLoading(true);
      try {
        const name = await publicClient.getEnsName({
          address: address as `0x${string}`,
        });
        setEnsName(name);
      } catch (error) {
        console.error('Error resolving ENS:', error);
      } finally {
        setIsLoading(false);
      }
    }

    resolveEns();
  }, [address]);

  return { ensName, isLoading };
} 
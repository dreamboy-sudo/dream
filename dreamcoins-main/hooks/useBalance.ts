import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { createPublicClient, http } from 'viem';
import { baseGoerli, base } from 'viem/chains';

const chain = process.env.NEXT_PUBLIC_CHAIN_ID === '84531' ? baseGoerli : base;

const publicClient = createPublicClient({
  chain,
  transport: http(),
});

export function useBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getBalance() {
      if (!user?.wallet?.address) return;

      try {
        setIsLoading(true);
        const balance = await publicClient.getBalance({
          address: user.wallet.address as `0x${string}`,
        });
        setBalance(parseFloat(formatEther(balance)).toFixed(4));
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getBalance();
    
    // Poll for balance updates every 30 seconds
    const interval = setInterval(getBalance, 30000);
    
    return () => clearInterval(interval);
  }, [user?.wallet?.address]);

  return { balance, isLoading };
} 
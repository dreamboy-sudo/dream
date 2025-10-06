import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { base } from "viem/chains";
import { createPublicClient, encodeFunctionData, http } from "viem";
import { useState, useEffect } from "react";
import protocolRewardsAbi from "@/components/abis/protocolRewards.json";
import { GlowPanel } from "../GlowPanel";
import { RefreshCwIcon } from "lucide-react";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";


const PROTOCOL_REWARDS_ADDRESS = process.env.NEXT_PUBLIC_PROTOCOL_REWARDS_ADDRESS || "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B"

const client = createPublicClient({ 
  chain: base, 
  transport: http(), 
}) 


export default function ClaimRewardButton() {
  const { user, ready, sendTransaction } = usePrivy();
  const [balance, setBalance] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const {wallets} = useWallets();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {client: smartWalletClient} = useSmartWallets();

  const isEmbedded = user?.wallet?.walletClientType === 'privy'

  const mainWallet = wallets[0] // most recently connected wallet


  useEffect(() => {
    async function getBalance() {
      if (!user?.wallet?.address) return;
      
      const balance = await client.readContract({
        address: PROTOCOL_REWARDS_ADDRESS,
        abi: protocolRewardsAbi,
        functionName: "balanceOf",
        args: [user.wallet.address],
      });
      
      setBalance(Number(balance));
    }

    getBalance();
  }, [user?.wallet?.address]);

  const handleClaimRewards = async () => {
    if (!user?.wallet?.address) return;

    setIsLoading(true);

    const data = encodeFunctionData({
          abi: protocolRewardsAbi,
          functionName: "withdrawFor",
          args: [user.wallet.address, 0], // 0 to withdraw the total balance
        })

    if (isEmbedded){
try {
      const smartWalletTx = await smartWalletClient?.sendTransaction({
        to: PROTOCOL_REWARDS_ADDRESS,
        data,
        chain: base
      });

      if (!smartWalletTx){
        alert("Transaction failed");
        return;
      }
     
       console.log('transaction sent:', smartWalletTx);
      setTxHash(smartWalletTx);
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transaction failed");
    }
    finally {
      setIsLoading(false);
    }
    } else {
      try {
        if (!mainWallet){
          alert("Please connect your wallet");
          return;
        }

        await mainWallet.switchChain(base.id);
        const provider = await mainWallet.getEthereumProvider();

        const tx = await provider.request({
          method: "eth_sendTransaction", 
          params: [{to: PROTOCOL_REWARDS_ADDRESS, data}],
        });

        console.log('transaction sent:', tx);
        const transaction = await client.waitForTransactionReceipt({
          hash: tx,
        });
        setTxHash(transaction.transactionHash);
      } catch (error) {
        console.error("Transaction failed", error);
        alert("Transaction failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshBalance = async () => {
    if (!user?.wallet?.address) return;
    
    setIsRefreshing(true);
    try {
      const balance = await client.readContract({
        address: PROTOCOL_REWARDS_ADDRESS,
        abi: protocolRewardsAbi,
        functionName: "balanceOf",
        args: [user.wallet.address],
      });
      
      setBalance(Number(balance));
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!ready) return null;

  return (
    <GlowPanel>
      <div className="p-6 flex flex-col gap-6">
        <h1 className="text-white text-xl font-mono">Your Rewards</h1>
        
        <div className="space-y-4 text-white font-mono">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Current Balance</span>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-1 h-auto text-white/60 hover:bg-transparent hover:text-white"
                onClick={refreshBalance}
                disabled={isRefreshing}
              >
                <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{Number(balance) / 1e18} ETH</span>
            
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-white/60">Claim</span>
            <Button 
              variant="outline" 
              className="w-48 bg-white/10 hover:scale-[1.02] transition-transform text-white border-white/20"
              onClick={handleClaimRewards}
              disabled={isLoading || balance === 0 || !!txHash}
            >
              {isLoading ? "Claiming..." : "Claim Rewards"}
            </Button>
          </div>
           {txHash && ( // Display message and link if claimed is true and txHash is available
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white/60">Rewards claimed!</span>
              <a 
                href={`https://basescan.org/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-500 underline"
              >
                View transaction on BaseScan
              </a>
            </div>
          )}
        </div>
      </div>
    </GlowPanel>
  )
}

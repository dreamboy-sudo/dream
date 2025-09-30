'use client';

import { usePrivy } from '@privy-io/react-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Wallet, LogOut } from "lucide-react";
import { useBalance } from '@/hooks/useBalance';

export default function ConnectedAs() {
  const { user, logout, login, ready } = usePrivy();
  const { balance, isLoading: isBalanceLoading } = useBalance();

  if (!ready) {
    return null;
  }

  if (!user || !user.wallet?.address) {
    return (
      <button
        onClick={login}
        className="font-light text-sm
          bg-white/[0.07] backdrop-blur-2xl
          border border-white/[0.08]
          px-3 sm:px-6 py-2 sm:py-3 
          rounded-xl sm:rounded-2xl
          text-white tracking-wide sm:tracking-wider
          shadow-[0_8px_40px_-12px_rgba(255,255,255,0.12)]
          hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.2)]
          hover:bg-white/[0.09] hover:border-white/[0.12]
          transition-all duration-500
          flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  const shortAddress = `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-light text-sm 
        bg-white/[0.07] backdrop-blur-2xl
        border border-white/[0.08]
        px-3 sm:px-6 py-2 sm:py-3
        rounded-xl sm:rounded-2xl
        text-white tracking-wide sm:tracking-wider
        shadow-[0_8px_40px_-12px_rgba(255,255,255,0.12)]
        hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.2)]
        hover:bg-white/[0.09] hover:border-white/[0.12]
        transition-all duration-500 outline-none">
        {shortAddress}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-56 text-sm 
        bg-black/90 backdrop-blur-2xl 
        border border-white/[0.08]
        rounded-xl sm:rounded-2xl
        shadow-[0_8px_40px_-12px_rgba(255,255,255,0.12)]
        mt-2">
        <DropdownMenuLabel className="text-white px-4 py-3 font-light tracking-wider">
          Wallet
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.08]" />
        <DropdownMenuItem className="flex items-center gap-2 cursor-default text-white px-4 py-3 focus:bg-white/[0.09]">
          <Wallet className="w-4 h-4" />
          {isBalanceLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="font-light tracking-wider">Loading...</span>
            </div>
          ) : (
            <span className="font-light tracking-wider">{balance} ETH</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.08]" />
        <DropdownMenuItem 
          onClick={logout}
          className="text-white/60 hover:text-white focus:text-white cursor-pointer flex items-center gap-2 px-4 py-3 focus:bg-white/[0.09] font-light tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
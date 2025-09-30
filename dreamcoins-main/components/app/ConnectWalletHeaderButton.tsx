"use client"

import * as React from "react"
import { usePrivy } from "@privy-io/react-auth"
import { WalletIcon, LogOut, ChevronDown, User } from "lucide-react"
import { GlowButton } from "../GlowButton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { shortenAddress } from "@/lib/utils"
import { GlowPanel } from "../GlowPanel"
import { Button } from "../ui/button"

export function ConnectWalletHeaderButton() {
  const { login, logout, authenticated, user } = usePrivy()
  const activeWallet = user?.wallet
  const [isOpen, setIsOpen] = React.useState(false)

  if (!authenticated) {
    return (
      <GlowButton
        onClick={login}
        containerClassName="h-10"
        contentClassName="uppercase"
      >
        <WalletIcon className="w-4 h-4" />
        <span className="hidden md:block">Connect</span>
      </GlowButton>
    )
  }

  return (
    <>
      <GlowButton
        onClick={() => setIsOpen(true)}
        containerClassName="h-10"
        contentClassName="uppercase"
      >
        <WalletIcon className="hidden md:block w-4 h-4" />
        <span className="">{activeWallet?.address ? shortenAddress(activeWallet.address) : "Connected"}</span>
      </GlowButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col gap-4 bg-transparent border-none p-0 sm:max-w-[330px] focus-visible:outline-none focus-visible:ring-0">
          <GlowPanel className="max-sm:rounded-none">
            <div className="relative flex flex-col gap-4 p-6 text-white">
              <p className="text-sm text-center uppercase">Your Account</p>
              
              <div className="space-y-4 text-white font-mono">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/60">Connected Address</span>
                  <span className="text-sm">{shortenAddress(activeWallet?.address || '')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = '/profile'
                  }}
                  variant="outline"
                  className="w-full bg-white/10 hover:scale-[1.02] transition-transform text-white border-white/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  variant="outline"
                  className="w-full bg-white/10 hover:scale-[1.02] transition-transform text-white border-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </GlowPanel>
        </DialogContent>
      </Dialog>
    </>
  )
}

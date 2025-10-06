import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Switch } from "@/components/ui/switch";
import { CircleHelpIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";

export default function CreatorFeesSwitch({
  value,
  onChange,

}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {

  return (
    <div>
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <label className="text-sm font-medium leading-none flex items-center gap-1">
          <span>Enable Creator Fees</span>
          <Popover>
            <PopoverTrigger>
              <CircleHelpIcon className="w-4 h-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/80 backdrop-blur-2xl border border-white/[0.08] text-white rounded-xl">
              <div className="space-y-2">
                <h4 className="font-medium">Creator Fees</h4>
                <p className="text-sm text-muted-foreground">
                  When enabled, you&apos;ll earn 0.5% of every buy and sell transaction. 
                  The proceeds from the fee needs to be redeemed manually from the WOW website.
                  Your wallet will be designated as the creator of the token publicly.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </label>
      </div>
      <div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        aria-label="Toggle creator fees"
        className="data-[state=checked]:bg-blue-600"
        />
      </div>
    </div>
    </div>
  );
}

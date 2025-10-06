import { cn } from "@/lib/utils";
import { Navbar, NavLinks } from "./Navbar";
import { Hardware } from "./Hardware";
import { ReactNode } from "react";
import Background from "@/components/computer/Background";

export function Computer({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("relative w-full h-svh max-h-svh overflow-hidden", className)}>
      <Hardware className="fixed inset-0" />
      <div className="fixed inset-6 md:inset-12 rounded-[13px] bg-[#E5E5E2] overflow-hidden">
        <div className="relative flex flex-col flex-1 w-full h-full">
          {/* Animated background */}
          <Background className="absolute inset-0 pointer-events-none" />

          {/* Content */}
          <div
            className="relative flex flex-col w-full h-full overflow-hidden m-auto"
            style={{
              boxShadow: "0px 0px 21.4px 1px rgba(0, 0, 0, 0.50) inset",
            }}
          >
            <Navbar className="fixed inset-x-10 md:inset-x-20 top-10 md:top-18" />

            <div className="flex flex-col h-full w-full overflow-y-auto">{children}</div>

            {/* Bottom nav on mobile */}
            <NavLinks className="fixed inset-x-11 bottom-10 h-fit justify-evenly md:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function GlowPanel({ className, children, onClick }: PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <div
      onClick={onClick}
      className={cn("rounded-xl backdrop-blur-sm sm:hover:shadow-[0px_4px_16px_0px_rgba(255,255,255,0.16)] sm:transition-shadow sm:transition-opacity duration-300", className)}
      style={{
        // prettier-ignore
        background: "linear-gradient(0deg, rgba(255,255,255,0.10) 0%, rgba(214,255,241,0.10) 100%) padding-box, linear-gradient(rgba(20,167,230,0.30), rgba(20,167,230,0.30)) padding-box, linear-gradient(0deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.24) 75%, rgba(255,255,255,0.32) 100%) border-box",
        border: "2px solid transparent",
      }}
    >
      {children}
    </div>
  );
}

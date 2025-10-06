import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function GlowButton({
  children,
  containerClassName,
  contentClassName,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    containerClassName?: string;
    contentClassName?: string;
  }
>) {
  return (
    <button
      className={cn(
        "rounded-full backdrop-blur-sm sm:opacity-[0.82] sm:hover:opacity-[1] sm:hover:translate-y-[-2px] sm:active:translate-y-0 sm:hover:shadow-[0px_4px_16px_0px_rgba(255,255,255,0.16)] sm:transition-all duration-500",
        containerClassName
      )}
      style={{
        // prettier-ignore
        background: "linear-gradient(0deg, rgba(255,255,255,0.10) 0%, rgba(214,255,241,0.10) 100%) padding-box, linear-gradient(rgba(20,167,230,0.30), rgba(20,167,230,0.30)) padding-box, linear-gradient(0deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.24) 75%, rgba(255,255,255,0.32) 100%) border-box",
        border: "2px solid transparent",
      }}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 mx-5 my-2 font-mono text-sm text-white",
          contentClassName
        )}
      >
        {children}
      </div>
    </button>
  );
}

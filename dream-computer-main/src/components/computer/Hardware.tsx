import { cn } from "@/lib/utils";
import Image from "next/image";

export function Hardware({ className }: { className?: string }) {
  return (
    <div className={cn("", className)}>
      <div className="relative size-full">
        {/* Metal background */}
        <div
          className="size-full rotate-180 blur-md"
          style={{
            background: `conic-gradient(from 220deg at 86.74% 55.88%, rgba(255, 255, 255, 0.72) 16.875deg, #000 88.12500178813934deg, rgba(255, 255, 255, 0.72) 151.875deg, #000 225deg, rgba(255, 255, 255, 0.72) 288.7499928474426deg, #000 360deg), conic-gradient(from 220deg at 86.69% 55.84%, #FFF 30.00000089406967deg, #000 95.625deg, #FFF 168.75deg, #000 228.75000715255737deg, #FFF 285.0000071525574deg, #000 360deg), radial-gradient(92.48% 91.85% at 10.11% 28.24%, #7E6A7E 8.33%, #D4D4D4 37.5%, #75888A 63.45%, #896753 100%)`,
            backgroundBlendMode: "screen, difference, normal",
          }}
        />

        {/* Various overlays */}
        <div className="absolute rotate-45 size-[max(100vw,100svh)] bottom-1/2 inset-x-0 bg-[#3A3C40] opacity-75 bg-blend-soft-light blur-xl" />
        <div className="absolute h-full w-full left-1/2 inset-y-0 bg-[#3A3C40] opacity-25 bg-blend-soft-light blur-xl" />
        <div className="absolute h-full w-full right-1/2 inset-y-0 bg-[#3A3C40] opacity-25 bg-blend-soft-light blur-xl" />
        <div className="absolute rotate-45 size-[max(100vw,100svh)] top-1/2 inset-x-0 bg-[#3A3C40] opacity-75 bg-blend-soft-light blur-xl" />

        <div className="absolute inset-x-0 bottom-0.5 md:bottom-3.5 h-4 flex items-center justify-center">
          <Image
            priority
            alt="dream"
            src="/images/logo-bezel.png"
            height={16}
            width={300}
            className="h-2 md:h-4 w-[150px] md:w-[300px]"
          />
        </div>
      </div>
    </div>
  );
}

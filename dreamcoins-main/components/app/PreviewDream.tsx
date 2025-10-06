import { useState } from "react";
import { cn } from "@/lib/utils";
import { FadeInImage } from "../FadeInImage";

export default function PreviewDream({ name, symbol, imageUrl }: { name: string; symbol: string; imageUrl: string }) {

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group relative flex w-full h-full aspect-square overflow-hidden rounded-sm mx-auto"
    >
      <FadeInImage
        src={imageUrl ?? ""}
        alt={name}
        className="object-cover object-center"
        onLoad={() => setImageLoaded(true)}
      />
      <p
        className={cn(
          "absolute bottom-[5px] left-[5px] right-[5px] text-center text-[12px] text-[#FACC15] transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          textShadow: "-0.5px -0.5px 0px #000, 0.5px -0.5px 0px #000, -0.5px 0.5px 0px #000, 0.5px 0.5px 0px #000",
        }}
      >
        ${symbol}
      </p>
    </div>
  );
}

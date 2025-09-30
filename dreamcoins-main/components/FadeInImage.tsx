import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function FadeInImage({
  src,
  alt,
  className,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`, className)}
      layout="fill"
      onLoadingComplete={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
    />
  );
}

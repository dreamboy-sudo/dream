import { Dream } from "@/lib/types";
import { format } from "date-fns";
import { WOW_URL } from "@/lib/constants";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "../ui/ExternalLink";
import { FadeInImage } from "../FadeInImage";

export default function CompletedDream({ dream }: { dream: Dream }) {
  const dreamUrl = dream.address ? `/token/${dream.address}` : WOW_URL;
  const formattedDate = format(new Date(dream.createdAt), "HH:mm a MMM dd yyyy").toUpperCase();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (dream.imageUrl) {
      setIsVideo(dream.imageUrl.toLowerCase().endsWith('.mp4'));
    }
  }, [dream.imageUrl]);

  return (
    <ExternalLink
      href={dreamUrl}
      className="group relative flex h-[130px] sm:h-[140px] w-[130px] sm:w-[140px] overflow-hidden rounded-sm"
    >
      {isVideo ? (
        <video
          src={dream.imageUrl ?? ""}
          className="object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setImageLoaded(true)}
        />
      ) : (
        <FadeInImage
          src={dream.imageUrl ?? ""}
          alt={dream.prompt}
          className="object-cover object-center"
          onLoad={() => setImageLoaded(true)}
        />
      )}

      <p
        className={cn(
          "absolute top-[5px] right-[5px] font-mono text-[7px] text-[#FACC15] transition-opacity duration-500 uppercase",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        {formattedDate}
      </p>

      <p
        className={cn(
          "absolute bottom-[5px] left-[5px] right-[5px] text-center text-[10px] text-[#FACC15] transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          textShadow: "-0.5px -0.5px 0px #000, 0.5px -0.5px 0px #000, -0.5px 0.5px 0px #000, 0.5px 0.5px 0px #000",
        }}
      >
        ${dream.ticker}
      </p>

      <div className="absolute inset-0 sm:backdrop-blur-[2px] sm:group-hover:backdrop-blur-none sm:transition-all duration-500 z-10" />
    </ExternalLink>
  );
}

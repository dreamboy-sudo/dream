import { Dream } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { GlowPanel } from "../GlowPanel";
import { useEffect, useState } from "react";

interface DreamCardProps {
  dream: Dream;
}

export function DreamCard({ dream }: DreamCardProps) {
  const formattedDate = formatDistanceToNow(new Date(dream.createdAt), { addSuffix: true });
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (dream.imageUrl) {
      setIsVideo(dream.imageUrl.toLowerCase().endsWith('.mp4'));
    }
  }, [dream.imageUrl]);

  return (
    <Link href={`/token/${dream.address}`}>
      <GlowPanel className="hover:opacity-90 transition-all duration-300">
        <div className="flex items-center gap-4 p-4">
          <div className="w-24 h-24 relative flex-shrink-0 rounded-xl overflow-hidden">
            {dream.imageUrl ? (
              isVideo ? (
                <video
                  src={dream.imageUrl}
                  className="object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image 
                  src={dream.imageUrl} 
                  alt={dream.name ?? ""} 
                  fill
                  className="object-cover"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAYEAEBAQEBAAAAAAAAAAAAAAABAAIDEf/EABUBAQEAAAAAAAAAAAAAAAAAAAQF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8As9dOeuwUDT4EkmoL/9k="
                />
              )
            ) : (
              <div className="w-full h-full bg-white/10 rounded-xl" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <span className="text-[10px] text-white/60 uppercase tracking-wider">
                  {formattedDate}
                </span>
              </div>
              
              <div className="flex-1 flex-col gap-1">
                <p className="font-mono tracking-wide text-sm uppercase">
                  ${dream.ticker}
                </p>
                <p className="text-white/80 text-xs tracking-wider line-clamp-2 leading-relaxed">
                  {dream.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlowPanel>
    </Link>
  );
} 
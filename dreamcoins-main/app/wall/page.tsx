'use client';

import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
import { Dream, DreamStatus } from '@prisma/client';
import { useDreams } from '@/hooks/getDreams';
import { WOW_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function FeedPage() {
  const { dreams, isLoading} = useDreams();

  const completedDreams = dreams.filter(dream => dream.status === DreamStatus.COMPLETED);

  return (
    <main className="relative min-h-screen">
      <AnimatedGradient />
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 }}
          className="w-full"
        >
          <Masonry gutter="1rem">
            {completedDreams.map((dream, index) => (
              <DreamTile 
                key={dream.id} 
                dream={dream} 
                variant={index % 3} // Cycle through 3 different variants
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Initial Loading State */}
        {isLoading && dreams.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-white/60 animate-pulse">Loading dreams...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && dreams.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-white/60">No dreams yet</div>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper to get aspect ratio class based on variant
function getAspectRatioClass(variant: number): string {
  switch (variant) {
    case 0:
      return 'aspect-[3/4]'; // Tall
    case 1:
      return 'aspect-square'; // Square
    case 2:
      return 'aspect-[4/3]'; // Wide
    default:
      return 'aspect-square';
  }
}

function DreamTile({ 
  dream, 
  variant 
}: { 
  dream: Dream;
  variant: number;
}) {
  const dreamUrl = dream.address ? `/token/${dream.address}` : WOW_URL;
  const formattedDate = format(new Date(dream.createdAt), "HH:mm a MMM dd yyyy").toUpperCase();

  return (
    <a 
      href={dreamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block relative w-full overflow-hidden rounded-sm",
        getAspectRatioClass(variant)
      )}
    >
      {/* Image */}
      <Image
        src={dream.imageUrl!}
        alt={dream.prompt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Symbol */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
        <p className="text-[#FACC15] text-base font-medium tracking-wider text-center"
           style={{
             textShadow: '-0.5px -0.5px 0px #000, 0.5px -0.5px 0px #000, -0.5px 0.5px 0px #000, 0.5px 0.5px 0px #000',
           }}
        >
          ${dream.ticker}
        </p>
      </div>

      {/* Date */}
      <div className="absolute top-2 right-2">
        <p className="text-[#FACC15] text-[8px] font-medium tracking-wider"
           style={{
             textShadow: '-0.5px -0.5px 0px #000, 0.5px -0.5px 0px #000, -0.5px 0.5px 0px #000, 0.5px 0.5px 0px #000',
           }}
        >
          {formattedDate}
        </p>
      </div>

      {/* Hover Blur */}
    </a>
  );
} 
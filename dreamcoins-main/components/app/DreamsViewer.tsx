'use client';

import { Dream } from '@/lib/types';
import CompletedDream from './CompletedDream';
import PendingDream from './PendingDream';
import { DreamStatus } from '@prisma/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { ArrowIcon } from '../icons/arrow';
import Link from 'next/link';

export default function DreamsViewer({ dreams, isLoading }: { dreams: Dream[], isLoading: boolean }) {
  if (isLoading || !dreams.length) {
    return null;
  }

  return (
    <div className="relative w-full mb-2 sm:mb-2.5">
      <div className="mx-2 flex items-center justify-end gap-1 text-xs md:text-sm text-white/80 uppercase">
        <Link href={"/wall"} target="_blank">View more {">>>"} </Link>
      </div>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        plugins={[WheelGesturesPlugin()]}
        className="w-full"
      >
        <CarouselContent className="m-0 p-0 pr-2 sm:pr-2.5 cursor-grab active:cursor-grabbing">
          {dreams.map((dream) => (
            <CarouselItem key={dream.id} className="basis-[138px] sm:basis-[150px] pl-2 sm:pl-2.5 animate-in fade-in">
              {dream.status === DreamStatus.COMPLETED ? (
                <CompletedDream dream={dream} />
              ) : (
                <PendingDream dream={dream} />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

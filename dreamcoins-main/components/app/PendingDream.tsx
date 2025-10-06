import { Dream } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';

export default function PendingDream({ dream }: { dream: Dream }) {
  const formattedDate = format(new Date(dream.createdAt), 'HH:mm a MMM dd yyyy').toUpperCase();

  return (
    <div className="relative w-full h-[128px] overflow-hidden rounded-sm group bg-white/40 backdrop-blur-md my-4">
      <div className="flex items-center h-full p-4">
        {/* Left side - Square Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden">
          {dream.imageUrl ? (
            <Image
              src={dream.imageUrl}
              alt={dream.prompt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 animate-pulse">
              <div className="absolute inset-0 backdrop-blur-xl" />
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="flex pl-4 h-full">
          <div className="flex flex-col justify-between h-full gap-1">
            {/* Top Row - Date and ID */}
            <div className="flex items-center">
              <span className="text-black font-light text-[10px] tracking-wider">
                {formattedDate}
              </span>
            </div>

            {/* Middle - Title + Prompt */}
            <div className="flex-1 flex-col gap-1">
              <p className="text-black font-light tracking-wide text-sm">
                {dream.name?.toUpperCase() || 'GENERATING NAME...'}
              </p>
              <p className="text-black font-light text-xs tracking-wider line-clamp-2 leading-relaxed">
                {dream.prompt}
              </p>
            </div>

            {/* Bottom Row - Status */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/80 shadow-[0_0_8px_0_rgba(250,204,21,0.6)] animate-pulse" />
              <span className="font-light text-xs tracking-wider text-[#00BFFF]">
                Processing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
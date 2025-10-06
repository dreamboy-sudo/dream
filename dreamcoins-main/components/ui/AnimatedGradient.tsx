'use client'
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDreamMode } from '@/contexts/DreamModeContext';

interface AnimatedGradientProps {
  className?: string;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    setMousePosition(prev => ({
      x: prev.x + (x - prev.x) * 0.05,
      y: prev.y + (y - prev.y) * 0.05
    }));
  }, []);

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen overflow-hidden bg-[#0fadf6] ${className || ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Base Image */}
      <Image
        fill
        src={"/images/sky-foundation.jpg"}
        alt="sky"
        className="object-cover w-screen h-screen transition-opacity duration-300"
        sizes="100vw"
        quality={100}
        priority
      />

      {/* Single subtle overlay for better text contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.2) 100%
          )`
        }}
      />
    </div>
  );
};

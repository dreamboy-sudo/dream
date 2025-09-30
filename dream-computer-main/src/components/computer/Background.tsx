"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const COLORS = ["#D4D4D2", "#D0D0CE", "#D9D9D6", "#DCDCDA", "#D7D7D4", "#DDDDDA", "#DFDFDC", "#DCDCD9"];

export default function Background({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Disable anti-aliasing for crisp dots
    ctx.imageSmoothingEnabled = false;

    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Calculate grid properties
    const spacing = 12;
    const dotSize = 1.5;
    const columns = Math.ceil(canvas.width / spacing);
    const rows = Math.ceil(canvas.height / spacing);

    // Create dots array with initial properties
    const dots = Array(columns * rows)
      .fill(null)
      .map((_, i) => ({
        x: Math.round((i % columns) * spacing), // Round to whole pixels
        y: Math.round(Math.floor(i / columns) * spacing), // Round to whole pixels
        currentColor: COLORS[0],
        targetColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        transitionProgress: 0,
      }));

    // Animation function
    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "#E5E5E2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        // Update transition progress
        dot.transitionProgress += 0.1;

        if (dot.transitionProgress >= 1) {
          dot.currentColor = dot.targetColor;
          dot.targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          dot.transitionProgress = 0;
        }

        // Interpolate between current and target color
        const currentRGB = hexToRgb(dot.currentColor);
        const targetRGB = hexToRgb(dot.targetColor);

        if (currentRGB && targetRGB) {
          const interpolatedColor = `rgb(${Math.round(
            lerp(currentRGB.r, targetRGB.r, dot.transitionProgress)
          )}, ${Math.round(lerp(currentRGB.g, targetRGB.g, dot.transitionProgress))}, ${Math.round(
            lerp(currentRGB.b, targetRGB.b, dot.transitionProgress)
          )})`;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = interpolatedColor;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className={cn("animate-in fade-in", className)}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.9 }} />
    </div>
  );
}

// Utility functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

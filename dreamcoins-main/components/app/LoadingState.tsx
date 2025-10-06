"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const SENTENCES = [
  "Dreaming a coin that could dream about a thought",
  "That could think of the dreamer that thought",
  "That could think of dreaming and getting a glimmer of coin",
  "I be dreaming of dreaming a dreamcoin",
  "That could dream about a thought",
  "That could think of dreaming a dreamcoin...",
];

const MAX_PROGRESS = 100;

export function LoadingState({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);
  const [currentSentence, setCurrentSentence] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Progress bar effect
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < MAX_PROGRESS ? prev + 4 : prev));
    }, 500); // Half a second

    return () => clearInterval(progressInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    const typeInterval = setInterval(() => {
      if (charIndex < SENTENCES[currentSentenceIndex].length) {
        setCurrentSentence((prev) => prev + SENTENCES[currentSentenceIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        // Finished typing current sentence
        setTimeout(() => {
          setCurrentSentence("");
          setCharIndex(0);
          setCurrentSentenceIndex((prev) => (prev + 1) % SENTENCES.length);
        }, 1000); // Wait 1 second before starting the next sentence
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentSentenceIndex, charIndex]);

  return (
    <div className={cn("flex flex-col justify-center w-full h-full max-w-[80vw] sm:max-w-sm gap-4", className)}>
      <div className="flex w-full h-1 bg-white/20 rounded-full">
        <div
          className="h-full bg-white rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm w-[90%] sm:w-4/5 min-h-16 text-white">{currentSentence}</div>
    </div>
  );
}

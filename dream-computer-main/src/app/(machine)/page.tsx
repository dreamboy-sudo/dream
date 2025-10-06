"use client";

import { useEffect, useState } from "react";
import { HomePage } from "@/components/home/HomePage";
import { cn } from "@/lib/utils";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-1 items-center justify-center min-h-full w-full",
        mounted ? "bg-[#E5E5E2]" : "bg-black"
      )}
    >
      {mounted && <HomePage />}
    </div>
  );
}

"use client";

import DreamLauncher from "@/components/app/DreamLauncher";
import DreamsViewer from "@/components/app/DreamsViewer";
import BuyDreamButton from "@/components/app/BuyDreamButton";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { useDreams } from "@/hooks/getDreams";

export default function StartPage() {
  const dreamsState = useDreams();

  return (
    <main className="relative flex flex-col min-h-svh sm:min-h-screen">
      <AnimatedGradient />

      <div className="fixed inset-0 flex flex-col items-center justify-center w-full sm:w-[600px] max-sm:px-3 mx-auto">
        <DreamLauncher refresh={dreamsState.refresh} />
      </div>

      <BuyDreamButton className="z-10" />

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <DreamsViewer
          dreams={dreamsState.dreams}
          isLoading={dreamsState.isLoading}
        />
      </div>
    </main>
  );
}

import { NewsArticle } from "@/lib/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useGetDreamy } from "@/hooks/getDreamy";
import { useDreamMode } from "@/contexts/DreamModeContext";
import { Cloud } from "lucide-react";

interface FeelingDreamyButtonProps {
  onDreamResult: (article: NewsArticle) => void;
}

export function FeelingDreamyButton({ onDreamResult }: FeelingDreamyButtonProps) {
  const { mode } = useDreamMode();
  const { getDreamy, isLoading } = useGetDreamy({
    onSuccess: (data) => {
      if (data.articles && data.articles.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.articles.length);
        const randomArticle = data.articles[randomIndex];
        onDreamResult(randomArticle);
      }
    },
  });

  const handleClick = useCallback(async () => {
    await getDreamy();
  }, [getDreamy]);

  return (
    <Button
      className="w-[160px] text-xs border-white bg-transparent rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
      onClick={handleClick}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center">
        <Cloud className="w-4 h-4 mr-2" />
        <span className="relative z-10">
          {isLoading ? "Dreaming..." : "Dream for me"}
        </span>
      </div>
    </Button>
  );
}
"use client";

import { useState, KeyboardEvent, useCallback, useEffect, } from "react";
import { ArrowRightIcon,} from "lucide-react";
import { useSubmitDream } from "@/hooks/submitDream";
import { DreamSubmissionDialog } from "./DreamSubmissionDialog";
import { SubmitDreamResult } from "@/lib/types";
import { GlowPanel } from "../GlowPanel";
import { cn } from "@/lib/utils";

import { useSubmitDreamPreview } from "@/hooks/submitDreamPreview";
import "cropperjs/dist/cropper.css";
import { FeelingDreamyButton } from "./FeelingDreamyButton";
import { useDreamMode } from "@/contexts/DreamModeContext";
import CustomCreateButton from "./CustomCreateButton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DreamMode } from "@/lib/types";
import { usePrivy } from "@privy-io/react-auth";

const DEBOUNCE_MS = 250;

interface Token {
  name: string;
  symbol: string;
  imageUrl: string;
  description?: string;
}

const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
  element.style.height = 'auto';
  element.style.height = Math.min(element.scrollHeight, 120) + 'px'; // Max 120px height
};

export default function DreamLauncher({ refresh }: { refresh: () => void }) {
  const [prompt, setPrompt] = useState("");
  const { mode, setMode } = useDreamMode();
  const { authenticated, user, getAccessToken } = usePrivy();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdDream, setCreatedDream] = useState<SubmitDreamResult | undefined>();

  const { isLoading, submitDream } = useSubmitDream();
  const { isLoading: isLoadingPreview, submitDreamPreview } = useSubmitDreamPreview();
  const [token, setToken] = useState<Token | null>(null);
    const [loadingState, setLoadingState] = useState<"preview-submit" | "preview" | "deploying" | "completed">("preview-submit");



  const handleCreateDreamPreview = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      return
    }

    setIsDialogOpen(true);
    setCreatedDream(undefined);

    const previewDream = await submitDreamPreview(prompt, mode);

    if (previewDream) {
      setToken(previewDream);
      setLoadingState("preview");
    }
  }, [submitDreamPreview, mode]);



  const handleCreateDream = useCallback((isCreatorFeesEnabled: boolean) => async () => {
    setIsDialogOpen(true);
    setCreatedDream(undefined);

    if (!token) {
      alert("Please select a token");
      return;
    }

    let privyAccessToken = undefined;
    let creatorAddress = undefined;

    if (authenticated && isCreatorFeesEnabled){
      privyAccessToken = await getAccessToken();
      creatorAddress = user?.wallet?.address;
    }

    try {
            setLoadingState("completed")

      const dream = await submitDream(token, mode, privyAccessToken ?? undefined, creatorAddress ?? undefined);
      setCreatedDream(dream);
      refresh();
     
    } catch (error) {
      console.error("Failed to create dream:", error);
  
      setIsDialogOpen(false);
    }
  }, [token, mode, submitDream, refresh, ]);

  const handleCreateAnother = useCallback(() => {
    setPrompt("");
    setCreatedDream(undefined);
    setLoadingState("preview-submit");
    setToken(null);
    setIsDialogOpen(false);
  }, []);


  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      adjustTextareaHeight(textarea);
    }
  }, [prompt]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoadingPreview) {
        handleCreateDreamPreview(prompt);
      }
    }
  };

  const handleReroll = useCallback(async () => {
    setLoadingState("preview-submit");
    setToken(null);
    setIsDialogOpen(true);
    setCreatedDream(undefined);

    const previewDream = await submitDreamPreview(prompt, mode);

    if (previewDream) {
      setToken(previewDream);
      setLoadingState("preview");
    }
  }, [prompt, mode, submitDreamPreview]);

  return (
    <>
      <GlowPanel className="w-full sm:w-[600px] group sm:hover:translate-y-[-2px] sm:transition-transform">
        <div className="flex flex-col gap-4 p-2">
          {/* Model Switcher Dropdown */}
          <div className="flex items-center">
            <Select value={mode} onValueChange={(value: DreamMode) => setMode(value)}>
              <SelectTrigger className="text-xs font-mono w-[180px] bg-transparent text-white border-white/20 focus:ring-white focus:ring-offset-0">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono bg-white/60 backdrop-blur-lg">
                <SelectItem value={"dreamgirl"}>Dreamgirl Model</SelectItem>
                <SelectItem value={"dream"}>Dreamboy Model</SelectItem>
                <SelectItem value={"baldo"}>Baldo Model</SelectItem>
                <SelectItem value={"thanksgiving"}>Thankful Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input Field Row */}
           <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What token are you dreaming of?"
              disabled={isLoading || isLoadingPreview}
              onKeyDown={handleKeyDown}
              className="h-[56px] font-mono text-base text-white placeholder:text-white border-none ring-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus-visible:ring-0 shadow-none"
            />

          {/* Button Row */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <CustomCreateButton />
              <FeelingDreamyButton
                onDreamResult={(article) => {
                  setPrompt(article.title);
                  handleCreateDreamPreview(article.title);
                }}
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCreateDreamPreview(prompt)}
              disabled={!prompt.trim() || isLoadingPreview || isLoading}
              className="p-2 hover:bg-white/10"
            >
              {isLoadingPreview || isLoading ? (
                <div className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRightIcon className={cn(
                  "w-5 h-5 text-white transition-all",
                  prompt.trim() && "text-white hover:scale-110"
                )} />
              )}
            </Button>
          </div>
        </div>
      </GlowPanel>

      <DreamSubmissionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dream={createdDream}
        onCreateAnother={handleCreateAnother}
        previewToken={token}
        setPreviewToken={setToken}
        onDeploy={handleCreateDream}
        isDeploying={isLoading}
        loadingState={loadingState}
        setLoadingState={setLoadingState}
        reroll={handleReroll}
      />
    </>
  );
}

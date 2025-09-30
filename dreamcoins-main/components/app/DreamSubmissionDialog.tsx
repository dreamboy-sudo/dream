"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubmitDreamResult } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { DreamStatus } from "@prisma/client";
import { LoadingState } from "@/components/app/LoadingState";
import { ExternalLink } from "../ui/ExternalLink";
import { getWowUrl } from "@/lib/constants";
import { GlowPanel } from "../GlowPanel";
import { ArrowIcon } from "../icons/arrow";
import { FadeInImage } from "../FadeInImage";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ShuffleIcon, PencilIcon } from "lucide-react";
import { useUploadImage } from "@/hooks/uploadImage";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Link from "next/link";
import { VideoIcon, CameraIcon } from "lucide-react";
import CreatorFeesSwitch from "./CreatorFeesSwitch";
import { usePrivy } from "@privy-io/react-auth";

async function pollForConfirmation(dreamId: number) {
  try {
    const response = await fetch(`/api/dream/${dreamId}`);
    if (!response.ok) throw new Error('Failed to fetch dream status');
    return await response.json();
  } catch (error) {
    console.error('Error polling for dream:', error);
    return null;
  }
}

function LinkOut({ className, href, children }: { className?: string; href: string; children: React.ReactNode }) {
  return (
    <ExternalLink href={href} className={cn("flex items-center gap-1 text-sm uppercase transition-opacity", className)}>
      {children} <ArrowIcon className="w-6 h-6" />
    </ExternalLink>
  );
}

export function DreamSubmissionDialog({
  isOpen,
  onOpenChange,
  onCreateAnother,
  dream,
  previewToken,
  onDeploy,
  isDeploying,
  loadingState,
  setLoadingState,
  reroll,
  setPreviewToken,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAnother: () => void;
  dream?: SubmitDreamResult;
  previewToken?: { name: string; symbol: string; imageUrl: string } | null;
  onDeploy?: (isCreatorFeesEnabled: boolean) => () => void;
  isDeploying?: boolean;
  loadingState: "preview-submit" | "preview" | "deploying" | "completed";
  setLoadingState: React.Dispatch<React.SetStateAction<"preview-submit" | "preview" | "deploying" | "completed">>;
  reroll: () => void;
  setPreviewToken: React.Dispatch<React.SetStateAction<{ name: string; symbol: string; imageUrl: string } | null>>;
}) {
  const { authenticated, user} = usePrivy();
  const [completedDream, setCompletedDream] = useState<SubmitDreamResult | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [creatorFees, setCreatorFees] = useState(false);
  const handleNameUpdate = (name: string) => {
    setPreviewToken(current => current ? { ...current, name } : null);
  };

  const handleSymbolUpdate = (symbol: string) => {
    setPreviewToken(current => current ? { ...current, symbol } : null);
  };

  const handleImageUrlUpdate = (imageUrl: string) => {
    setPreviewToken(current => current ? { ...current, imageUrl } : null);
  };
  const { upload, isUploading } = useUploadImage({
    onSuccess: handleImageUrlUpdate,
    onError: (error) => console.error('Error uploading image:', error),
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset all state
      setCompletedDream(null);
      onCreateAnother(); // This will reset the parent's state
    }
    onOpenChange(open);
  };

  useEffect(() => {
    // Start polling when we have a dream and it's not completed yet
    if (dream && !completedDream && loadingState === "completed") {
      const startPolling = async () => {
        // Clear any existing interval
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }

        pollingRef.current = setInterval(async () => {
          const data = await pollForConfirmation(dream.id);

          console.log("Polling for dream:", data);
          
          if (data?.status === DreamStatus.COMPLETED && data.address) {
            setCompletedDream(data);
            
            // Clear the interval once we have the address
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
          }
        }, 2000);
      };

      startPolling();
    }

    // Cleanup function
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [dream, completedDream, loadingState, setLoadingState]);

  const getTwitterUrl = () => {
    return completedDream?.address
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent("verifying myself as a dreamer @dreamcoinswow\n\n[your wallet address or ens here]")}`
      : "#";
  };

  const getFarcasterUrl = () => {
    return completedDream?.address
      ? `https://warpcast.com/~/compose?text=${encodeURIComponent(
          `My dreamcoin is live. Buy $${completedDream.ticker} on @wow`
        )}&embeds[]=${getWowUrl(completedDream?.address)}`
      : "#";
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      if (file.type.startsWith('image/')) {
        setIsVideo(false);
        setCropperVisible(true);
      } else if (file.type.startsWith('video/')) {
        setIsVideo(true);
        upload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !selectedFile) return;

    setIsCropping(true);
    try {
      const canvas = cropper.getCroppedCanvas({
        width: 500,  // desired width
        height: 500, // desired height
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) resolve(blob);
        }, selectedFile.type);
      });

      // Create a new file from the blob
      const croppedFile = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });

      // Upload the cropped image
      await upload(croppedFile);
    } catch (error) {
      console.error('Error cropping/uploading image:', error);
    } finally {
      setIsCropping(false);
      setCropperVisible(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // Preview State
  if (loadingState === "preview" && previewToken) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="flex flex-col gap-4 bg-transparent border-none p-0 sm:max-w-[330px] focus-visible:outline-none focus-visible:ring-0">
          <GlowPanel className="max-sm:rounded-none">
            <div className="relative flex flex-col gap-4 h-[100svh] sm:max-h-[80vh] sm:h-fit overflow-auto max-sm:py-10 p-6 text-white">
              <p className="mt-3 text-sm text-center uppercase max-w-4/5">
                Launch your dreamcoin
              </p>

              <div 
                className="relative w-full aspect-square shrink-0 rounded-2xl overflow-hidden group cursor-pointer" 
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                />
                {isUploading ? (
                  <div className="absolute top-2 right-2 w-4 h-4 z-10">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <PencilIcon className="absolute top-2 right-2 w-4 h-4 z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {previewToken?.imageUrl ? (
                  isVideo ? (
                    <video
                      src={previewToken.imageUrl}
                      className="object-cover object-center aspect-square overflow-hidden"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <FadeInImage
                      src={previewToken.imageUrl}
                      alt={previewToken.name}
                      className="object-cover object-center aspect-square overflow-hidden"
                    />
                  )
                ) : (
                  <div className="w-full h-full backdrop-blur-lg bg-black/30 flex flex-col items-center justify-center gap-2">
                    {isVideo ? (
                      <VideoIcon className="w-8 h-8 text-white/60" />
                    ) : (
                      <CameraIcon className="w-8 h-8 text-white/60" />
                    )}
                    <span className="text-sm text-white/60">Add an image</span>
                    <span className="text-xs text-white/40 font-mono">jpg, png, webp, svg</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 group relative w-full">
                    <div className="relative flex items-center w-full">
                      <span className="text-xs text-white font-bold mr-1">$</span>
                      <input
                        type="text"
                        value={previewToken.symbol}
                        onChange={(e) => handleSymbolUpdate(e.target.value)}
                        className="bg-transparent outline-none border-b border-transparent hover:border-white/50 focus:border-white w-full uppercase peer"
                      />
                      <PencilIcon className="w-4 h-4 absolute right-0 opacity-50 group-hover:opacity-60 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 group relative w-full">
                    <div className="relative flex items-center w-full">
                      <input
                        type="text"
                        value={previewToken.name}
                        onChange={(e) => handleNameUpdate(e.target.value)}
                        className="bg-transparent outline-none border-b border-transparent hover:border-white/50 focus:border-white w-full uppercase peer"
                      />
                      <PencilIcon 
                        className="w-4 h-4 absolute right-0 opacity-50 group-hover:opacity-60 transition-opacity"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {authenticated && (
                <div className="flex-1">
                  <CreatorFeesSwitch value={creatorFees} onChange={setCreatorFees} />
                  {(user && creatorFees) ? <span className="text-xs text-white/60">
                  Wallet {user.wallet?.address.slice(0, 4)}...{user.wallet?.address.slice(-4)} will earn 0.5% of every transaction.
                </span> : null}
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <Button 
                  onClick={onDeploy ? onDeploy(creatorFees) : undefined}
                  disabled={isDeploying}
                  className="w-full"
                >
                  {isDeploying ? 'Deploying...' : `Deploy $${previewToken.symbol.toUpperCase().trim()}`}
                </Button>
                <Button variant="outline" onClick={reroll} className="w-full">
                  <div className="flex items-center justify-center gap-2">
                    <ShuffleIcon className="w-4 h-4 text-black" />
                    <span className="text-black">Reroll</span>
                  </div>
                </Button>
              </div>
            </div>
          </GlowPanel>
          {cropperVisible && previewUrl && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md">
                <p className="text-white text-sm uppercase text-center mb-4">
                  Crop Image
                </p>
                <div className="mb-6">
                  <Cropper
                    ref={cropperRef}
                    src={previewUrl}
                    style={{ height: 400, width: "100%" }}
                    aspectRatio={1}
                    guides={true}
                    viewMode={1}
                    dragMode="move"
                    background={false}
                    cropBoxMovable={true}
                    cropBoxResizable={true}
                    toggleDragModeOnDblclick={false}
                    className="rounded-xl overflow-hidden"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCropperVisible(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    disabled={isCropping || isUploading}
                    className="text-black border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCrop}
                    disabled={isCropping || isUploading}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    {isCropping ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cropping...</span>
                      </div>
                    ) : isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      'Crop & Upload'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Loading State
  if (loadingState === "deploying" || loadingState === "preview-submit" && !dream) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          hideDismiss
          className="bg-transparent border-none shadow-none outline-none text-white sm:max-w-[700px] p-0 overflow-hidden h-1/2 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0"
        >
          <LoadingState />
        </DialogContent>
      </Dialog>
    );
  }

  // Deployment State
  const isDeployed = !!completedDream?.address;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col gap-4 bg-transparent border-none p-0 sm:max-w-[330px] focus-visible:outline-none focus-visible:ring-0">
        <GlowPanel className="max-sm:rounded-none">
          <div className="relative flex flex-col gap-4 h-[100svh] sm:max-h-[80vh] sm:h-fit overflow-y-auto max-sm:py-10 p-6 text-white">
            <p className="mt-3 text-sm text-center uppercase max-w-4/5">
              {loadingState === "completed" && dream ? `Success: ${dream?.name ?? previewToken?.name} deployed` : "Deploying dreamcoin"}
            </p>

            <div className="relative w-full aspect-square shrink-0 rounded-2xl overflow-hidden">
              {isVideo ? (
                <video
                  src={dream?.imageUrl ?? previewToken?.imageUrl ?? ""}
                  className="object-cover object-center aspect-square overflow-hidden"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <FadeInImage
                  src={dream?.imageUrl ?? previewToken?.imageUrl ?? ""}
                  alt={dream?.prompt ?? previewToken?.name ?? ""}
                  className="object-cover object-center aspect-square overflow-hidden"
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <p className="uppercase">${dream?.ticker ?? previewToken?.symbol}</p>
                <p className="uppercase">{dream?.name ?? previewToken?.name}</p>
              </div>

              {completedDream?.address ? (
                <LinkOut className="animate-in fade-in" href={`/token/${completedDream.address}`}>
                  View
                </LinkOut>
              ) : (
                <div className="flex items-center justify-center w-4 h-4">
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
            </div>
             {completedDream?.address && (
                <Link className="animate-in fade-in text-white/60" href={`https://basescan.org/address/${completedDream.address}`}>
                  <span className="text-white/60">{completedDream.address.slice(0, 4)}...{completedDream.address.slice(-4)}</span>
                </Link>
              )}
          </div>
        </GlowPanel>

        <GlowPanel
          className={cn(
            "hidden md:block max-sm:rounded-none transition-opacity duration-500",
            isDeployed ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex flex-col p-4 text-white">
            <p className="text-sm text-center uppercase">SHARE YOUR DREAMCOIN</p>

            <div className="mt-2 flex items-center justify-center gap-3">
              <LinkOut href={getTwitterUrl()}>Twitter</LinkOut>
              •
              <LinkOut href={getFarcasterUrl()}>Farcaster</LinkOut>
            </div>
          </div>
        </GlowPanel>
      </DialogContent>
    </Dialog>
  );
}

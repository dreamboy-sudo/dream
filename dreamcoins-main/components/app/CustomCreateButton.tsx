"use client";

import { CameraIcon, PaletteIcon, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef, useCallback } from "react";
import { GlowPanel } from "../GlowPanel";
import { PencilIcon } from "lucide-react";
import { FadeInImage } from "../FadeInImage";
import { useUploadImage } from "@/hooks/uploadImage";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSubmitDream } from "@/hooks/submitDream";
import { useDreamMode } from "@/contexts/DreamModeContext";
import { DreamSubmissionDialog } from "./DreamSubmissionDialog";
import { SubmitDreamResult } from "@/lib/types";
import { Input } from "../ui/input";
import CreatorFeesSwitch from "./CreatorFeesSwitch";
import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function CustomCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [token, setToken] = useState<{ name: string; symbol: string; imageUrl: string; description: string }>({
    name: "",
    symbol: "",
    imageUrl: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, getAccessToken } = usePrivy();
  const [cropperVisible, setCropperVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { mode } = useDreamMode();
  const { submitDream, isLoading: isDeploying } = useSubmitDream();
  const [createdDream, setCreatedDream] = useState<SubmitDreamResult>();
  const [loadingState, setLoadingState] = useState<"preview-submit" | "preview" | "deploying" | "completed">("preview-submit");
  const [isVideo, setIsVideo] = useState(false);
  const [creatorFees, setCreatorFees] = useState(false);

  const { upload, isUploading } = useUploadImage({
    onSuccess: (imageUrl) => setToken(prev => ({ ...prev, imageUrl })),
    onError: (error) => console.error('Error uploading image:', error),
  });

  const { login} = useLogin({
    onComplete: () => {
    },
    onError: (error) => {
      console.error('Error logging in:', error);
      setCreatorFees(false);
    }
  });

  const handleOnCreatorFeesChange = (value: boolean) => {
    setCreatorFees(value);
    
    if (value) {
      login();
    }
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
        width: 500,
        height: 500,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) resolve(blob);
        }, selectedFile.type);
      });

      const croppedFile = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });

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

  const handleDeploy = async () => {
    if (!token.imageUrl || !token.name || !token.symbol) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsOpen(false); // Close the form dialog
      setIsDialogOpen(true); // Open the submission dialog
      setLoadingState("deploying");

      let privyAccessToken: string | undefined | null = undefined;
      let creatorAddress: string | undefined | null = undefined;

      if (creatorFees) {
        privyAccessToken = await getAccessToken();
        creatorAddress = user?.wallet?.address;

        if (!privyAccessToken || !creatorAddress) {
          alert("Please connect your wallet to create a token with creator fees");
          return;
        }
      }
      
      const dream = await submitDream(token, mode, privyAccessToken, creatorAddress);
      setCreatedDream(dream);
      setLoadingState("completed");
      
      // Reset form
      setToken({ name: "", symbol: "", imageUrl: "", description: "" });
    } catch (error) {
      console.error("Failed to deploy token:", error);
      setIsDialogOpen(false);
    }
  };

  const handleCreateAnother = useCallback(() => {
    setCreatedDream(undefined);
    setLoadingState("preview-submit");
    setIsDialogOpen(false);
  }, []);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-[160px] text-xs border-white bg-transparent rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
      >
        <div className="flex items-center justify-center">
          <PaletteIcon className="w-4 h-4 mr-2" />
          <span className="relative z-10">Custom Create</span>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col gap-4 bg-transparent border-none p-0 sm:max-w-[40vw] focus-visible:outline-none focus-visible:ring-0">
          <GlowPanel className="max-sm:rounded-none">
            <div className="relative flex flex-col gap-4 h-[100svh] sm:max-h-[80vh] sm:h-fit overflow-auto max-sm:py-10 p-6 text-white">
              <p className="mt-3 text-sm text-center uppercase max-w-4/5">
                Create Custom Dreamcoin
              </p>

              <div className="sm:flex sm:gap-6">
                <div 
                  className="relative md:w-[250px] aspect-square shrink-0 rounded-2xl overflow-hidden group cursor-pointer sm:w-[250px] w-48 mx-auto sm:mx-0" 
                  onClick={handleImageClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml, image/gif"
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
                  {token.imageUrl ? (
                    isVideo ? (
                      <video
                        src={token.imageUrl}
                        className="object-cover object-center aspect-square overflow-hidden"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <FadeInImage
                        src={token.imageUrl}
                        alt={token.name}
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
                      <span className="text-xs text-white/40 font-mono">jpg, png, webp, svg, gif</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 w-full sm:mt-0 mt-4">
                  <div className="border border-white/20 hover:border-white/50 focus-within:border-white rounded-md p-2 w-full">
                    <label className="text-xs text-white/60">Ticker</label>
                    <div className="relative flex items-center w-full">
                      <span className="text-xs text-white font-bold mr-1">$</span>
                      <Input
                        type="text"
                        value={token.symbol}
                        onChange={(e) => setToken(prev => ({ ...prev, symbol: e.target.value }))}
                        placeholder="TICKER"
                        className="bg-transparent border-none w-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40 h-6 px-0"
                      />
                    </div>
                  </div>
                  <div className="border border-white/20 hover:border-white/50 focus-within:border-white rounded-md p-2 w-full">
                    <label className="text-xs text-white/60">Token Name</label>
                    <Input
                      type="text"
                      value={token.name}
                      onChange={(e) => setToken(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="TOKEN NAME"
                      className="bg-transparent border-none w-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40 h-6 px-0"
                    />
                  </div>
                  <div className="border border-white/20 hover:border-white/50 focus-within:border-white rounded-md p-2 w-full">
                    <label className="text-xs text-white/60">Description</label>
                    <Input
                      type="text"
                      value={token.description}
                        onChange={(e) => setToken(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="TOKEN DESCRIPTION"
                      className="bg-transparent border-none w-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40 h-6 px-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <CreatorFeesSwitch 
                  value={creatorFees} 
                onChange={handleOnCreatorFeesChange} 
                />
                {(user && creatorFees) ? <span className="text-xs text-white/60">
                  Wallet {user.wallet?.address.slice(0, 4)}...{user.wallet?.address.slice(-4)} will earn 0.5% of every transaction.
                </span> : null}
              </div>

              <Button 
                onClick={handleDeploy}
                disabled={isDeploying || !token.imageUrl || !token.name || !token.symbol}
                className="w-full mt-2"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Token'}
              </Button>
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
                    disabled={isCropping}
                    className="text-black"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCrop}
                    disabled={isCropping}
                  >
                    {isCropping ? 'Cropping...' : 'Crop & Upload'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DreamSubmissionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dream={createdDream}
        onCreateAnother={handleCreateAnother}
        previewToken={token}
        setPreviewToken={setToken as unknown as React.Dispatch<React.SetStateAction<{ name: string; symbol: string; imageUrl: string } | null >>}
        loadingState={loadingState}
        setLoadingState={setLoadingState}
        reroll={() => {}} // No-op since this is custom creation
      />
    </>
  );
}

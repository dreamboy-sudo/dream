'use client';

import { useUploadImage } from "@/hooks/uploadImage";
import Image from "next/image";
import { useState } from "react";

export default function UploadTestPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { upload, isUploading, error } = useUploadImage({
    onSuccess: (url) => setUploadedUrl(url),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Upload Test Page</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left side - Upload controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
              
              {isUploading && (
                <div className="text-sm text-gray-500">
                  Uploading...
                </div>
              )}
              
              {error && (
                <div className="text-sm text-red-500">
                  Error: {error.message}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Results */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upload Result</h2>
            
            {uploadedUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                  <Image
                    src={uploadedUrl}
                    alt="Uploaded image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                
                <div className="break-all">
                  <p className="text-sm font-medium text-gray-500 mb-1">URL:</p>
                  <code className="text-sm bg-gray-50 p-2 rounded block">
                    {uploadedUrl}
                  </code>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No image uploaded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

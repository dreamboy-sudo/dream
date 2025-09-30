import { useState } from 'react';

interface UploadImageResponse {
  url: string;
}

interface UploadImageOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useUploadImage(options: UploadImageOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data: UploadImageResponse = await response.json();
      
      options.onSuccess?.(data.url);
      return data.url;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload image');
      setError(error);
      options.onError?.(error);
      return null;

    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    error,
  };
}

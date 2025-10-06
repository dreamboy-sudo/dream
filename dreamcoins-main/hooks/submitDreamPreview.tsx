import { DreamMode, SubmitDreamPreviewResult } from '@/lib/types';
import { useState } from 'react';

interface SubmitDreamPreviewResponse {
  isLoading: boolean;
  error: Error | null;
  // eslint-disable-next-line no-unused-vars
  submitDreamPreview: (prompt: string, mode: DreamMode) => Promise<SubmitDreamPreviewResult>;
}

export const useSubmitDreamPreview = (): SubmitDreamPreviewResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitDreamPreview = async (prompt: string, mode: DreamMode) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dream-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit dream preview');
      }

      const data = await response.json();

      console.log('Dream preview submitted successfully:', data);

      return data;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit dream preview'));
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    submitDreamPreview,
  };
};

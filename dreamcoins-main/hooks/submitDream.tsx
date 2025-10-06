import { DreamMode, SubmitDreamResult } from '@/lib/types';
import { useState } from 'react';

interface Token {
  name: string;
  symbol: string;
  imageUrl: string;
  description?: string;
}

interface SubmitDreamResponse {
  isLoading: boolean;
  error: Error | null;
  submitDream: (
    token: Token,
    mode: DreamMode,
    privyAccessToken?: string,
    creatorAddress?: string,
  ) => Promise<SubmitDreamResult>;
}

export const useSubmitDream = (): SubmitDreamResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitDream = async (token: Token, mode: DreamMode, privyAccessToken?: string, creatorAddress?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, mode, privyAccessToken, creatorAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit dream');
      }

      const data = await response.json();

      console.log('Dream submitted successfully:', data);

      return data;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit dream'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    submitDream,
  };
};


import { NewsResponse } from '@/lib/types';
import useSWR from 'swr';

interface GetDreamyOptions {
  onSuccess?: (data: NewsResponse) => void;
  onError?: (error: Error) => void;
}

export function useGetDreamy(options: GetDreamyOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    '/api/dreamy',
    null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onError: (err) => options.onError?.(err),
    }
  );

  // Function to manually trigger the fetch
  const getDreamy = async () => {
    try {
      const response = await fetch('/api/dreamy', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dreamy response');
      }

      const newData = await response.json();
      await mutate(newData, false);
      options.onSuccess?.(newData);
      return newData;
    } catch (error) {
      console.error('Error fetching dreamy:', error);
      options.onError?.(error as Error);
    }
  };

  return {
    data,
    error,
    isLoading,
    getDreamy,
  };
}

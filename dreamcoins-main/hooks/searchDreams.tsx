import { Dream } from '@/lib/types';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

interface SearchDreamsResponse {
  data: Dream[];
  nextCursor: number | null;
  hasMore: boolean;
}

interface UseSearchDreamsOptions {
  limit?: number;
  onError?: (error: Error) => void;
}

export function useSearchDreams(options: UseSearchDreamsOptions = {}) {
  const [query, setQuery] = useState<string>('');
  const [cursor, setCursor] = useState<number>(0);
  const limit = options.limit || 20;

  const { data, error, isLoading, mutate } = useSWR<SearchDreamsResponse>(
    query ? `/api/search?q=${encodeURIComponent(query)}&cursor=${cursor}&limit=${limit}` : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search dreams');
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      onError: (err) => options.onError?.(err),
    }
  );

  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setCursor(0);
    await mutate();
  }, [mutate]);

  const loadMore = useCallback(async () => {
    if (!data?.hasMore) return;
    
    setCursor((prevCursor) => {
      const nextCursor = data.nextCursor || prevCursor + limit;
      return nextCursor;
    });
  }, [data?.hasMore, data?.nextCursor, limit]);

  const reset = useCallback(() => {
    setQuery('');
    setCursor(0);
  }, []);

  return {
    dreams: data?.data || [],
    isLoading,
    error,
    hasMore: data?.hasMore || false,
    search,
    loadMore,
    reset,
    query,
  };
}

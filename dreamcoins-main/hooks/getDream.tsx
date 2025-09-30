import { Dream } from '@/lib/types';
import { useCallback } from 'react';
import { useInterval } from 'usehooks-ts';
import useSWR from 'swr';
import { IS_LOCAL } from '@/lib/constants';

export function useDream(id: string) {
  const { data: dream, mutate, isLoading, error } = useSWR(
    [`/api/dream/${id}`],
    async ([url]) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch dream');
      }
      const data = await response.json();
      return data as Dream;
    }
  );

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  // Poll for updates if the dream is not completed
  useInterval(() => {
    mutate();
  }, IS_LOCAL ? 10000 : 5000);

  return {
    dream,
    isLoading,
    error,
    refresh,
  };
}

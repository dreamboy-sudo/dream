import { PaginatedDreamsResponse } from '@/lib/types';
import { useCallback, useMemo } from 'react';
import { useInterval } from 'usehooks-ts';
import useSWR from 'swr';
import { IS_LOCAL } from '@/lib/constants';

const LIMIT = 100;

export function useDreams(address?: string) {
  const { data, mutate, isLoading } = useSWR(
    [`/api/dream?limit=${LIMIT}${address ? `&address=${address}` : ''}`],
    async ([url]) => {
      const response = await fetch(url);
      const data = (await response.json()) as PaginatedDreamsResponse;
      return data;
    }
  );

  const dreams = useMemo(() => data?.data ?? [], [data]);

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  useInterval(() => {
    mutate();
  }, IS_LOCAL ? 10000 : 5000);

  return {
    dreams,
    isLoading,
    refresh,
  }
}

import { useState, useEffect } from 'react';

interface MarketCapResponse {
  dream2: {
    usd: number;
    usd_market_cap: number;
    usd_24h_change: number;
  };
}

export const useMarketCap = () => {
  const [marketCapData, setMarketCapData] = useState<MarketCapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        const coingeckoId = process.env.NEXT_PUBLIC_COINGECKO_ID;
        if (!coingeckoId) {
          setLoading(false);
          return;
        }
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch market cap data');
        }

        const data = await response.json();
        if (data[coingeckoId]) {
          setMarketCapData({
            dream2: {
              usd: data[coingeckoId].usd,
              usd_market_cap: data[coingeckoId].usd_market_cap,
              usd_24h_change: data[coingeckoId].usd_24h_change,
            },
          });
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchMarketCap();
  }, []);

  return {
    marketCapData,
    loading,
    error,
  };
};

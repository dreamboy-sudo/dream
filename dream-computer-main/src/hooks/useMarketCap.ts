import useSWR from 'swr'

export function useMarketCap() {
  const { data, error, isLoading } = useSWR('market-cap', async () => {
    const coingeckoId = process.env.NEXT_PUBLIC_COINGECKO_ID
    if (!coingeckoId) {
      return null
    }
    
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`)
    if (!response.ok) {
      throw new Error(`Market cap fetch failed with status code ${response.status}`)
    }

    const json = await response.json()
    if (!json[coingeckoId]) {
      return null
    }
    
    return {
      usd: json[coingeckoId].usd,
      marketCap: json[coingeckoId].usd_market_cap,
      dayChange: json[coingeckoId].usd_24h_change,
    }
  })

  return {
    data,
    error,
    isLoading,
  }
}

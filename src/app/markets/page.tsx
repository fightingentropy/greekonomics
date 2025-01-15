'use client';

import { useEffect, useState } from 'react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export default function MarketsPage() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/coins');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setError('Failed to load cryptocurrency data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1e2029] rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="bg-[#1e2029] rounded-lg p-6 hover:bg-[#2a2c37] transition-colors duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">{coin.name}</h2>
                  <span className="text-sm text-gray-400 uppercase">{coin.symbol}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="text-gray-100 font-medium">
                    ${coin.current_price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Change</span>
                  <span className={`font-medium ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-gray-100 font-medium">
                    {formatNumber(coin.market_cap)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Volume (24h)</span>
                  <span className="text-gray-100 font-medium">
                    {formatNumber(coin.total_volume)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

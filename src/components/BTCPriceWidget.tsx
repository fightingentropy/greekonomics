'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface CryptoPrice {
  price: string;
  priceChange: number;
  dailyChange: number;
  status: 'connecting' | 'connected' | 'error';
}

interface CoinData {
  symbol: string;
  name: string;
  price: string;
  priceChange: number;
  dailyChange: number;
  status: 'connecting' | 'connected' | 'error';
}

const PriceDisplay = ({ symbol, name, data, className }: { symbol: string; name: string; data: CoinData; className: string }) => (
  <div className={`fixed right-8 bg-[#1e2029] rounded-lg p-4 shadow-lg min-w-[200px] ${
    data.status === 'error' ? 'border-red-500' : 'border-gray-700'
  } border ${className} hidden lg:block z-50`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
        <span className="text-sm text-gray-400">{symbol}</span>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-100">
          {data.price}
        </div>
        <div className={`text-sm ${data.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.dailyChange.toFixed(2)}%
        </div>
      </div>
    </div>
    {data.status === 'error' && (
      <div className="text-xs text-red-400 mt-2">
        Error connecting to price feed
      </div>
    )}
  </div>
);

export function CryptoPriceWidget() {
  const pathname = usePathname();
  
  // Don't render on analytics or mindmap pages
  if (pathname === '/analytics' || pathname === '/mindmap') {
    return null;
  }

  const [coins, setCoins] = useState<Record<string, CoinData>>({
    btc: { symbol: 'BTC', name: 'Bitcoin', price: 'Loading...', priceChange: 0, dailyChange: 0, status: 'connecting' },
    sol: { symbol: 'SOL', name: 'Solana', price: 'Loading...', priceChange: 0, dailyChange: 0, status: 'connecting' },
    hype: { symbol: 'HYPE', name: 'Hyperliquid', price: 'Loading...', priceChange: 0, dailyChange: 0, status: 'connecting' }
  });

  useEffect(() => {
    const fetchHypePrice = async () => {
      try {
        const response = await fetch('/api/hype');
        if (!response.ok) {
          throw new Error('Failed to fetch HYPE price');
        }
        const data = await response.json();
        if (data && data[0]) {
          setCoins(prev => ({
            ...prev,
            hype: {
              ...prev.hype,
              price: data[0].current_price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }),
              dailyChange: data[0].price_change_percentage_24h,
              status: 'connected'
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching HYPE price:', error);
        setCoins(prev => ({
          ...prev,
          hype: { ...prev.hype, status: 'error' }
        }));
      }
    };

    // Initial fetch
    fetchHypePrice();
    
    // Update HYPE price every 30 seconds
    const interval = setInterval(fetchHypePrice, 30000);

    return () => clearInterval(interval);
  }, []);

  const reconnectAttempts = useRef<{ [key: string]: number }>({});
  const activeConnections = useRef<{ [key: string]: WebSocket | null }>({});
  const maxReconnectAttempts = 2;
  const baseReconnectDelay = 1000;

  const getReconnectDelay = useCallback((url: string) => {
    const attempts = reconnectAttempts.current[url] || 0;
    return baseReconnectDelay * Math.pow(2, attempts);
  }, []);

  const createWebSocket = useCallback((
    url: string, 
    onMessage: (event: MessageEvent) => void,
    updateStatus: (status: 'connecting' | 'connected' | 'error') => void
  ) => {
    try {
      // Check if there's already an active connection
      if (activeConnections.current[url]?.readyState === WebSocket.OPEN) {
        return activeConnections.current[url];
      }

      const attempts = reconnectAttempts.current[url] || 0;
      if (attempts >= maxReconnectAttempts) {
        updateStatus('error');
        return null;
      }

      updateStatus('connecting');
      const ws = new WebSocket(url);
      activeConnections.current[url] = ws;
      
      ws.onopen = () => {
        updateStatus('connected');
        reconnectAttempts.current[url] = 0;
      };

      ws.onmessage = onMessage;

      ws.onerror = () => {
        updateStatus('error');
      };

      ws.onclose = () => {
        updateStatus('error');
        activeConnections.current[url] = null;
        
        reconnectAttempts.current[url] = (reconnectAttempts.current[url] || 0) + 1;
        const attempts = reconnectAttempts.current[url];
        
        if (attempts < maxReconnectAttempts) {
          const delay = getReconnectDelay(url);
          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              createWebSocket(url, onMessage, updateStatus);
            }
          }, delay);
        }
      };

      return ws;
    } catch (error) {
      updateStatus('error');
      return null;
    }
  }, [getReconnectDelay]);

  useEffect(() => {
    let lastBtcPrice = 0;
    let lastSolPrice = 0;
    const sockets: WebSocket[] = [];

    // Clean up any existing connections first
    Object.values(activeConnections.current).forEach(ws => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    activeConnections.current = {};

    // Using combined streams for BTC
    const btcWs = createWebSocket(
      'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/btcusdt@ticker',
      (event) => {
        try {
          const { data, stream } = JSON.parse(event.data);
          
          if (stream === 'btcusdt@trade') {
            const currentPrice = parseFloat(data.p);
            setCoins(prev => ({
              ...prev,
              btc: {
                ...prev.btc,
                price: currentPrice.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }),
                priceChange: lastBtcPrice > 0 ? ((currentPrice - lastBtcPrice) / lastBtcPrice) * 100 : 0
              }
            }));
            lastBtcPrice = currentPrice;
          } else if (stream === 'btcusdt@ticker') {
            setCoins(prev => ({
              ...prev,
              btc: {
                ...prev.btc,
                dailyChange: parseFloat(data.P)
              }
            }));
          }
        } catch {
          setCoins(prev => ({ ...prev, btc: { ...prev.btc, status: 'error' } }));
        }
      },
      (status) => setCoins(prev => ({ ...prev, btc: { ...prev.btc, status } }))
    );
    if (btcWs) sockets.push(btcWs);

    // Using combined streams for SOL
    const solWs = createWebSocket(
      'wss://stream.binance.com:9443/stream?streams=solusdt@trade/solusdt@ticker',
      (event) => {
        try {
          const { data, stream } = JSON.parse(event.data);
          
          if (stream === 'solusdt@trade') {
            const currentPrice = parseFloat(data.p);
            setCoins(prev => ({
              ...prev,
              sol: {
                ...prev.sol,
                price: currentPrice.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }),
                priceChange: lastSolPrice > 0 ? ((currentPrice - lastSolPrice) / lastSolPrice) * 100 : 0
              }
            }));
            lastSolPrice = currentPrice;
          } else if (stream === 'solusdt@ticker') {
            setCoins(prev => ({
              ...prev,
              sol: {
                ...prev.sol,
                dailyChange: parseFloat(data.P)
              }
            }));
          }
        } catch {
          setCoins(prev => ({ ...prev, sol: { ...prev.sol, status: 'error' } }));
        }
      },
      (status) => setCoins(prev => ({ ...prev, sol: { ...prev.sol, status } }))
    );
    if (solWs) sockets.push(solWs);

    return () => {
      sockets.forEach(socket => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });
      // Clear active connections on cleanup
      activeConnections.current = {};
    };
  }, [createWebSocket]);

  return (
    <>
      <PriceDisplay symbol="BTC" name="Bitcoin" data={coins.btc} className="top-[200px]" />
      <PriceDisplay symbol="SOL" name="Solana" data={coins.sol} className="top-[336px]" />
      <PriceDisplay symbol="HYPE" name="Hyperliquid" data={coins.hype} className="top-[472px]" />
    </>
  );
};

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface CryptoPrice {
  price: string;
  priceChange: number;
  dailyChange: number;
  status: 'connecting' | 'connected' | 'error';
}

const PriceDisplay = ({ symbol, price, priceChange, dailyChange, status, className = '', denominator = 'USDT' }:
  { symbol: string; price: string; priceChange: number; dailyChange: number; status: string; className?: string; denominator?: string }) => (
  <div className={`fixed right-4 bg-[#1e2029] p-4 rounded-lg shadow-lg border border-gray-700 z-50 text-white w-[200px] hidden lg:block ${className}`}>
    <div className="flex flex-col items-start gap-1">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-sm font-semibold text-gray-400">{symbol}/{denominator}</h3>
        {status !== 'connected' && (
          <div className={`text-sm ${status === 'error' ? 'text-yellow-500' : 'text-blue-500'}`}>
            {status === 'error' ? '⚠️' : '🔄'}
          </div>
        )}
      </div>
      <div className="text-xl font-bold">{price}</div>
      {priceChange !== 0 && (
        <div className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
        </div>
      )}
      <div className={`text-sm ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        24h: {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
      </div>
    </div>
  </div>
);

export const CryptoPriceWidget = () => {
  const [btcPrice, setBtcPrice] = useState<CryptoPrice>({ 
    price: 'Loading...', 
    priceChange: 0, 
    dailyChange: 0, 
    status: 'connecting' 
  });
  const [solPrice, setSolPrice] = useState<CryptoPrice>({ 
    price: 'Loading...', 
    priceChange: 0, 
    dailyChange: 0, 
    status: 'connecting' 
  });

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
            setBtcPrice(prev => ({
              ...prev,
              price: currentPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }),
              priceChange: lastBtcPrice > 0 ? ((currentPrice - lastBtcPrice) / lastBtcPrice) * 100 : 0
            }));
            lastBtcPrice = currentPrice;
          } else if (stream === 'btcusdt@ticker') {
            setBtcPrice(prev => ({
              ...prev,
              dailyChange: parseFloat(data.P)
            }));
          }
        } catch {
          setBtcPrice(prev => ({ ...prev, status: 'error' }));
        }
      },
      (status) => setBtcPrice(prev => ({ ...prev, status }))
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
            setSolPrice(prev => ({
              ...prev,
              price: currentPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }),
              priceChange: lastSolPrice > 0 ? ((currentPrice - lastSolPrice) / lastSolPrice) * 100 : 0
            }));
            lastSolPrice = currentPrice;
          } else if (stream === 'solusdt@ticker') {
            setSolPrice(prev => ({
              ...prev,
              dailyChange: parseFloat(data.P)
            }));
          }
        } catch {
          setSolPrice(prev => ({ ...prev, status: 'error' }));
        }
      },
      (status) => setSolPrice(prev => ({ ...prev, status }))
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
      <PriceDisplay
        symbol="BTC"
        price={btcPrice.price}
        priceChange={btcPrice.priceChange}
        dailyChange={btcPrice.dailyChange}
        status={btcPrice.status}
        className="top-[100px]"
      />
      <PriceDisplay
        symbol="SOL"
        price={solPrice.price}
        priceChange={solPrice.priceChange}
        dailyChange={solPrice.dailyChange}
        status={solPrice.status}
        className="top-[236px]"
      />
    </>
  );
};

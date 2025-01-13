'use client';

import { useEffect, useState } from 'react';

interface CryptoPrice {
  price: string;
  priceChange: number;
  dailyChange: number;
}

const PriceDisplay = ({ symbol, price, priceChange, dailyChange, className = '', denominator = 'USDT' }:
  { symbol: string; price: string; priceChange: number; dailyChange: number; className?: string; denominator?: string }) => (
  <div className={`fixed right-4 bg-[#1e2029] p-4 rounded-lg shadow-lg border border-gray-700 z-50 text-white w-[200px] hidden lg:block ${className}`}>
    <div className="flex flex-col items-start gap-1">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-sm font-semibold text-gray-400">{symbol}/{denominator}</h3>
        <div className={`text-sm ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
        </div>
      </div>
      <div className="text-xl font-bold">{price}</div>
      {priceChange !== 0 && (
        <div className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
        </div>
      )}
    </div>
  </div>
);

export const CryptoPriceWidget = () => {
  const [btcPrice, setBtcPrice] = useState<CryptoPrice>({ price: 'Loading...', priceChange: 0, dailyChange: 0 });
  const [solPrice, setSolPrice] = useState<CryptoPrice>({ price: 'Loading...', priceChange: 0, dailyChange: 0 });
  const [mstrPrice, setMstrPrice] = useState<CryptoPrice>({ price: 'Loading...', priceChange: 0, dailyChange: 0 });

  useEffect(() => {
    const btcTradeWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    const solTradeWs = new WebSocket('wss://stream.binance.com:9443/ws/solusdt@trade');
    const btcTickerWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    const solTickerWs = new WebSocket('wss://stream.binance.com:9443/ws/solusdt@ticker');
    const mstrWs = new WebSocket('wss://ws.finnhub.io?token=cu2eg41r01ql7sc7bk8gcu2eg41r01ql7sc7bk90');

    let lastBtcPrice = 0;
    let lastSolPrice = 0;
    let lastMstrPrice = 0;

    btcTradeWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
    };

    solTradeWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
    };

    btcTickerWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBtcPrice(prev => ({
        ...prev,
        dailyChange: parseFloat(data.P)
      }));
    };

    solTickerWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSolPrice(prev => ({
        ...prev,
        dailyChange: parseFloat(data.P)
      }));
    };

    mstrWs.onopen = () => {
      mstrWs.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'MSTR' }));
    };

    mstrWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade' && data.data) {
        const currentPrice = data.data[0].p;

        setMstrPrice(prev => ({
          ...prev,
          price: currentPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          }),
          priceChange: lastMstrPrice > 0 ? ((currentPrice - lastMstrPrice) / lastMstrPrice) * 100 : 0,
          dailyChange: data.data[0].dp || 0
        }));

        lastMstrPrice = currentPrice;
      }
    };

    return () => {
      btcTradeWs.close();
      solTradeWs.close();
      btcTickerWs.close();
      solTickerWs.close();
      mstrWs.close();
    };
  }, []);

  return (
    <>
      <PriceDisplay
        symbol="BTC"
        price={btcPrice.price}
        priceChange={btcPrice.priceChange}
        dailyChange={btcPrice.dailyChange}
        className="top-[100px]"
      />
      <PriceDisplay
        symbol="SOL"
        price={solPrice.price}
        priceChange={solPrice.priceChange}
        dailyChange={solPrice.dailyChange}
        className="top-[236px]"
      />
      <PriceDisplay
        symbol="MSTR"
        price={mstrPrice.price}
        priceChange={mstrPrice.priceChange}
        dailyChange={mstrPrice.dailyChange}
        className="top-[372px]"
        denominator="USD"
      />
    </>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';

export const TICKER_SYMBOLS = [
  { proName: 'NASDAQ:AAPL', title: 'Apple' },
  { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
  { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
  { proName: 'NASDAQ:AMZN', title: 'Amazon' },
  { proName: 'NASDAQ:GOOGL', title: 'Alphabet' },
  { proName: 'NASDAQ:META', title: 'Meta' },
  { proName: 'NASDAQ:TSLA', title: 'Tesla' },
];

export default function StockTicker() {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const host = container.current;
    if (!host || hidden) return;

    let disposed = false;
    let frame: HTMLIFrameElement | null = null;
    const fail = () => { if (!disposed) setStatus('unavailable'); };
    const timeout = window.setTimeout(fail, 20000);
    const loaded = () => {
      window.clearTimeout(timeout);
      if (!disposed) setStatus('ready');
    };
    const observer = new MutationObserver(() => {
      const nextFrame = host.querySelector('iframe');
      if (nextFrame && nextFrame !== frame) {
        frame?.removeEventListener('load', loaded);
        frame = nextFrame;
        frame.title = 'Stock prices and daily changes from TradingView';
        frame.addEventListener('load', loaded);
      }
    });
    observer.observe(host, { childList: true, subtree: true });

    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.onerror = fail;
    script.textContent = JSON.stringify({
      symbols: TICKER_SYMBOLS,
      colorTheme: 'light',
      isTransparent: true,
      displayMode: 'regular',
      showSymbolLogo: true,
      locale: 'en',
    });
    host.append(widget, script);

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      observer.disconnect();
      frame?.removeEventListener('load', loaded);
      script.onerror = null;
      host.replaceChildren();
    };
  }, [hidden]);

  return (
    <section aria-label="Stock market ticker" className="border-b border-[#E0E0E0] bg-white font-sans">
      <div className="flex items-center justify-between gap-3 px-4 py-1 text-[10px] text-[#6B6B6B]">
        <span className="font-semibold uppercase tracking-wider">Market Watch · US Stocks</span>
        <button type="button" aria-expanded={!hidden} aria-controls="stock-ticker-content"
          className="underline underline-offset-2 hover:text-black"
          onClick={() => { setStatus('loading'); setHidden(value => !value); }}>
          {hidden ? 'Show ticker' : 'Hide ticker'}
        </button>
      </div>
      {!hidden && <div id="stock-ticker-content">
        <div className="relative min-h-[46px]">
          {status !== 'ready' && <p role="status" className="absolute inset-0 flex items-center justify-center px-4 text-xs text-[#6B6B6B] pointer-events-none">
            {status === 'loading' ? 'Loading market prices…' : 'Market prices are temporarily unavailable.'}
          </p>}
          <div ref={container} className={`tradingview-widget-container min-h-[46px] ${status === 'ready' ? '' : 'invisible'}`} />
        </div>
        <div className="tradingview-widget-copyright flex flex-wrap justify-end gap-1 px-4 pb-1 text-[10px] text-[#6B6B6B]">
          <span>Quotes may be delayed. Market hours apply. ·</span>
          <a href="https://www.tradingview.com/markets/stocks-usa/" target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">
            Stock prices by TradingView
          </a>
        </div>
      </div>}
    </section>
  );
}

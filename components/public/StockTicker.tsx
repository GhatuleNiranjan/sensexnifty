'use client';
import { useState } from 'react';
import { STOCK_WATCHLIST } from '@/lib/stock-watchlist';

export default function StockTicker() {
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  return <section aria-label="Indian stock watchlist" className="border-b border-[#E0E0E0] bg-white font-sans">
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-[10px] text-[#6B6B6B]">
      <span className="font-semibold uppercase tracking-wider">Market Watch · Indian Stocks</span>
      <div className="flex gap-4">
        <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="underline">{paused ? 'Resume scrolling' : 'Pause scrolling'}</button>
        <button type="button" onClick={() => setHidden(value => !value)} aria-expanded={!hidden} aria-controls="stock-watchlist" className="underline">{hidden ? 'Show ticker' : 'Hide ticker'}</button>
      </div>
    </div>
    {!hidden && <div id="stock-watchlist">
      <div className="stock-ticker-viewport overflow-x-auto" tabIndex={0} aria-label="50 selected stock symbols; prices not connected">
        <div className="stock-ticker-track flex w-max" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
          {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {STOCK_WATCHLIST.map(symbol => <li key={symbol} className="border-r border-gray-200 px-5 py-3 text-xs font-semibold whitespace-nowrap">{symbol}</li>)}
          </ul>)}
        </div>
      </div>
      <p className="px-4 pb-2 text-[10px] text-[#6B6B6B]">50-stock watchlist · Price feed not connected yet.</p>
    </div>}
  </section>;
}

'use client';
import { useEffect, useState } from 'react';
import type { MarketStatus } from '@/lib/market-status';

export default function EditionStrip() {
  const [status, setStatus] = useState<MarketStatus>({ state: 'unknown', source: 'unavailable' });
  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const update = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch('/api/market-status', { signal: controller.signal });
        if (!response.ok) throw new Error('Status unavailable');
        const result = await response.json();
        if (!['open', 'closed', 'unknown'].includes(result.state)) throw new Error('Invalid status');
        if (!controller.signal.aborted) setStatus(result);
      } catch {
        if (!controller.signal.aborted) setStatus({ state: 'unknown', source: 'unavailable' });
      } finally { pending = false; }
    };
    void update();
    const timer = window.setInterval(update, 30000);
    document.addEventListener('visibilitychange', update);
    return () => { controller.abort(); window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  const label = status.state === 'open' ? 'NSE Market Open' : status.state === 'closed' ? 'NSE Market Closed' : 'Market Status Unavailable';
  return <div className="bg-[#F8F8F8] border-b border-[#E0E0E0] text-[10px] font-sans font-semibold uppercase tracking-widest text-[#6B6B6B] py-1.5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-3" role="status">
        <span className={`inline-block w-2 h-2 rounded-full ${status.state === 'open' ? 'bg-emerald-600' : status.state === 'closed' ? 'bg-red-600' : 'bg-gray-400'}`} />
        <span>{label}{status.source === 'calendar' ? ' · Calendar' : ''}</span>
        <span>•</span><span>Indian Markets Coverage</span>
      </div>
      <div className="hidden md:flex items-center gap-4"><span>Independent Journalism</span><span>•</span><span>No Paywalls</span></div>
    </div>
  </div>;
}

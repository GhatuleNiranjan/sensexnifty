export type MarketStatus = { state: 'open' | 'closed' | 'unknown'; source: 'exchange' | 'calendar' | 'unavailable' };

export function parseMarketStatus(payload: unknown, now = new Date()): MarketStatus {
  if (!payload || typeof payload !== 'object' || !('marketState' in payload) || !Array.isArray(payload.marketState))
    return { state: 'unknown', source: 'unavailable' };
  const equity = payload.marketState.find(item => item?.market === 'Capital Market');
  const value = String(equity?.marketStatus || '').toLowerCase();
  if (value === 'open') {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }).formatToParts(now);
    const part = (type: string) => parts.find(item => item.type === type)?.value;
    const date = `${part('day')}-${part('month')}-${part('year')}`;
    if (String(equity?.tradeDate || '').toLowerCase().startsWith(date.toLowerCase()))
      return { state: 'open', source: 'exchange' };
  }
  if (value === 'close' || value === 'closed') return { state: 'closed', source: 'exchange' };
  return { state: 'unknown', source: 'unavailable' };
}

// NSE holiday circular CMTR71775; special-session hours are not guessed.
const holidays2026 = new Set(['01-26','03-03','03-26','03-31','04-03','04-14','05-01','05-28','06-26','09-14','10-02','10-20','11-10','11-24','12-25']);
export function calendarFallback(now = new Date()): MarketStatus {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(now);
  if (day.startsWith('2026-') && day !== '2026-11-08' &&
      (weekday === 'Sat' || weekday === 'Sun' || holidays2026.has(day.slice(5))))
    return { state: 'closed', source: 'calendar' };
  return { state: 'unknown', source: 'unavailable' };
}

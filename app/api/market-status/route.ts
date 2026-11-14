import { NextResponse } from 'next/server';
import { calendarFallback, parseMarketStatus } from '@/lib/market-status';

export async function GET() {
  let status = calendarFallback();
  try {
    const response = await fetch('https://www.nseindia.com/api/marketStatus', {
      headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(4000),
    });
    if (response.ok) {
      const live = parseMarketStatus(await response.json());
      if (live.state !== 'unknown') status = live;
    }
  } catch { /* Return a labeled calendar result or unknown status. */ }
  return NextResponse.json({ ...status, checkedAt: new Date().toISOString() }, {
    headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30' },
  });
}

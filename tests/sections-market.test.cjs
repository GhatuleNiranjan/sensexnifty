const { test } = require('node:test');
const assert = require('node:assert/strict');

test('all twelve categories have unique URL-safe slugs and human labels', async () => {
  const { CATEGORIES, categoryName } = await import('../lib/constants.ts');
  assert.equal(CATEGORIES.length, 12);
  assert.equal(new Set(CATEGORIES.map(c => c.slug)).size, 12);
  for (const category of CATEGORIES) {
    assert.match(category.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.equal(categoryName(category.slug.toUpperCase()), category.name);
  }
  for (const slug of ['china', 'indian-stock', 'russia-ukraine', 'nato', 'brokerage-reports', 'india-news'])
    assert.ok(CATEGORIES.some(category => category.slug === slug));
});

test('requested watchlist contains fifty distinct symbols including punctuation', async () => {
  const { STOCK_WATCHLIST } = await import('../lib/stock-watchlist.ts');
  assert.equal(STOCK_WATCHLIST.length, 50);
  assert.equal(new Set(STOCK_WATCHLIST).size, 50);
  for (const symbol of ['M&M', 'BAJAJ-AUTO', 'BSE', 'TMPV', 'ETERNAL']) assert.ok(STOCK_WATCHLIST.includes(symbol));
});

test('market status is segment-specific and rejects stale open responses', async () => {
  const { parseMarketStatus, calendarFallback } = await import('../lib/market-status.ts');
  const now = new Date('2026-11-16T05:00:00Z');
  const payload = (marketStatus, tradeDate = '16-Nov-2026 10:30') => ({ marketState: [{ market: 'Capital Market', marketStatus, tradeDate }] });
  assert.equal(parseMarketStatus(payload('Open'), now).state, 'open');
  assert.equal(parseMarketStatus(payload('Closed'), now).state, 'closed');
  assert.equal(parseMarketStatus(payload('Open', '13-Nov-2026 10:30'), now).state, 'unknown');
  assert.equal(parseMarketStatus({ marketState: [{ market: 'Currency', marketStatus: 'Open' }] }, now).state, 'unknown');
  assert.equal(parseMarketStatus(null).state, 'unknown');
  assert.equal(calendarFallback(new Date('2026-11-15T06:00:00Z')).state, 'closed');
  assert.equal(calendarFallback(new Date('2026-11-24T06:00:00Z')).state, 'closed');
  assert.equal(calendarFallback(new Date('2026-11-08T13:00:00Z')).state, 'unknown');
  assert.equal(calendarFallback(new Date('2027-01-01T06:00:00Z')).state, 'unknown');
  assert.equal(calendarFallback(now).state, 'unknown');
});

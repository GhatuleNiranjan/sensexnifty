const { test } = require('node:test');
const assert = require('node:assert/strict');
const { AsyncLocalStorage } = require('node:async_hooks');

// Run the real Next cache wrapper with an isolated memory backend and fake DB.
test('public queries cache, separate arguments, and expire after mutations', async () => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const entries = new Map();
  const backend = {
    generateSimpleCacheKey: async key => key,
    get: async key => entries.get(key) || null,
    set: async (key, value, context) => entries.set(key, { value, isStale: false, tags: context.tags }),
  };
  globalThis.__incrementalCache = backend;
  const { db } = await import('../lib/db.ts');
  const posts = await import('../lib/posts.ts');
  const { invalidatePublishedPosts, POST_CACHE_TAG } = await import('../lib/post-cache.ts');
  const { workAsyncStorage } = require('next/dist/server/app-render/work-async-storage.external');
  let queries = 0;
  let published = true;
  let title = 'Original';
  const row = () => ({ id: '1', slug: 'story', title, content: 'Full article', author: null, tags: [] });
  const originalMany = db.post.findMany;
  const originalFirst = db.post.findFirst;
  db.post.findMany = async options => {
    queries++;
    assert.equal(options.omit.content, true);
    assert.equal(options.include.author.select.password, undefined);
    return [{ ...row(), content: undefined }];
  };
  db.post.findFirst = async options => {
    queries++;
    assert.equal(options.where.status, 'PUBLISHED');
    return published ? row() : null;
  };
  const expire = () => {
    const store = { incrementalCache: backend, route: '/api/posts/1' };
    workAsyncStorage.run(store, invalidatePublishedPosts);
    assert.equal(store.pendingRevalidatedTags[0].tag, POST_CACHE_TAG);
    assert.deepEqual(store.pendingRevalidatedTags[0].profile, { expire: 0 });
    // Apply the pending tag expiry, as Next does when finishing the response.
    for (const [key, entry] of entries) if (entry.tags.includes(POST_CACHE_TAG)) entries.delete(key);
  };
  try {
    await posts.getCategoryPosts('USA', 3);
    await posts.getCategoryPosts('USA', 3);
    assert.equal(queries, 1, 'repeat listing avoids another DB query');
    await posts.getCategoryPosts('EUROPE', 3);
    assert.equal(queries, 2, 'categories have separate keys');
    assert.equal((await posts.getPostBySlug('story')).content, 'Full article');
    await posts.getPostBySlug('story');
    assert.equal(queries, 3, 'repeat article avoids another DB query');
    title = 'Updated';
    expire();
    assert.equal((await posts.getPostBySlug('story')).title, 'Updated');
    published = false;
    expire();
    assert.equal(await posts.getPostBySlug('story'), null, 'unpublished or deleted article disappears');
    published = true;
    expire();
    assert.equal((await posts.getPostBySlug('story')).title, 'Updated', 'publishing clears cached misses');
  } finally {
    db.post.findMany = originalMany;
    db.post.findFirst = originalFirst;
    delete globalThis.__incrementalCache;
    await db.$disconnect();
  }
});

test('image optimization preserves editor sizing and existing transforms', async () => {
  const { optimizeArticleImages } = await import('../lib/article-images.ts');
  const input = '<p>Text</p><img src="https://res.cloudinary.com/demo/image/upload/v123/photo.jpg" style="width: 320px" data-align="right">';
  const output = optimizeArticleImages(input);
  assert.match(output, /f_auto,q_auto,c_limit,w_1600\/v123/);
  assert.match(output, /loading="lazy"/);
  assert.match(output, /decoding="async"/);
  assert.match(output, /style="width: 320px" data-align="right"/);
  assert.equal(optimizeArticleImages(output), output);
  const transformed = '<img src="https://res.cloudinary.com/demo/image/upload/c_crop,w_300/v123/photo.jpg" loading="eager" decoding="sync">';
  assert.equal(optimizeArticleImages(transformed), transformed);
  assert.match(optimizeArticleImages('<img src="/local.png">'), /src="\/local.png"/);
});

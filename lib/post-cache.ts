import { revalidateTag } from 'next/cache';

export const POST_CACHE_TAG = 'published-posts-v1';
export const POST_CACHE_SECONDS = 60;

// Mutations must expire both article and listing data, including old slugs.
export function invalidatePublishedPosts() {
  revalidateTag(POST_CACHE_TAG, { expire: 0 });
}

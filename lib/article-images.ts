/** Optimize delivery only; leave the saved editor HTML and image sizing intact. */
export function optimizeArticleImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    let optimized = tag.replace(
      /(\bsrc\s*=\s*["'])(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/)/i,
      '$1$2f_auto,q_auto,c_limit,w_1600/$3',
    );
    if (!/\bloading\s*=/i.test(optimized)) optimized = optimized.replace(/<img\b/i, '<img loading="lazy"');
    if (!/\bdecoding\s*=/i.test(optimized)) optimized = optimized.replace(/<img\b/i, '<img decoding="async"');
    return optimized;
  });
}

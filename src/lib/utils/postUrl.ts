// 記事のURL。frontmatter に slug があればそれを、なければファイル名を使う。
// URL を組み立てる場所が増えると片方だけ直し忘れるので、必ずここを通す。
export const postSlug = (post: { id: string; data: { slug?: string } }) =>
  post.data.slug?.trim() || post.id;

export const postUrl = (post: { id: string; data: { slug?: string } }) =>
  `/blog/${postSlug(post)}`;

export default postUrl;

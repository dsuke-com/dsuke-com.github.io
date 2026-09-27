import config from "@/config/config.json";
import { postSlug } from "@/lib/utils/postUrl";
import { plainify } from "@/lib/utils/textConverter";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// RSS。@astrojs/rss を足すほどの内容ではないので手で組み立てる。
// 下書き（draft: true）は配信しない。
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL(config.site.base_url);

  const posts = (await getCollection("posts"))
    .filter((post) => !post.id.startsWith("-") && post.data.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.data.date ?? 0).valueOf() -
        new Date(a.data.date ?? 0).valueOf(),
    );

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${postSlug(post)}`, siteUrl).href;
      const description = plainify(
        post.data.description ?? post.body?.slice(0, 200) ?? "",
      );
      const pubDate = post.data.date
        ? new Date(post.data.date).toUTCString()
        : undefined;

      return [
        "    <item>",
        `      <title>${escapeXml(plainify(post.data.title))}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(description)}</description>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        ...(post.data.categories ?? []).map(
          (category: string) =>
            `      <category>${escapeXml(category)}</category>`,
        ),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.site.title)}</title>
    <link>${escapeXml(siteUrl.href)}</link>
    <description>${escapeXml(config.metadata.meta_description)}</description>
    <language>ja</language>
    <atom:link href="${escapeXml(new URL("/rss.xml", siteUrl).href)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

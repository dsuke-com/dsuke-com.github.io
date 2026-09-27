import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// About collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    what_i_do: z
      .object({
        title: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        ),
      })
      .optional(),
  }),
});

// Contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Posts collection schema
//
// 記事側で書くのは publishedAt / updatedAt / category / eyecatch などの
// 新しい名前。テーマ内部のコンポーネントは date / updated / categories /
// image を参照しているため、transform でその形に揃えてから渡している。
// 旧名で書かれた記事もそのまま読める。
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/posts" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      meta_title: z.string().optional(),
      // URL を記事ファイル名と変えたいときだけ指定する
      slug: z.string().optional(),
      publishedAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default(() => []),
      // 横長のアイキャッチ画像（/images/... または src 配下の相対パス）
      eyecatch: z.string().optional(),
      eyecatchAlt: z.string().optional(),
      draft: z.boolean().default(false),
      // true にすると記事冒頭にアフィリエイト広告の表示を出す
      affiliate: z.boolean().default(false),

      // 任意項目
      tripDate: z.string().optional(),
      location: z.string().optional(),
      // 円。記事冒頭のサマリーに「総額」として出す
      totalCost: z.number().optional(),

      // 旧フィールド（過去の記事との互換用。新規記事では使わない）
      date: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      categories: z.array(z.string()).optional(),
      image: z.string().optional(),

      // SEO 用の覚え書き。ページ出力には使わない
      primary_keyword: z.string().optional(),
      secondary_keywords: z.array(z.string()).optional(),
    })
    .transform((data) => ({
      ...data,
      date: data.publishedAt ?? data.date,
      updated: data.updatedAt ?? data.updated,
      categories:
        data.categories ?? (data.category ? [data.category] : ["未分類"]),
      image: data.eyecatch ?? data.image,
    })),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Export collections
export const collections = {
  posts: postsCollection,
  about: aboutCollection,
  contact: contactCollection,
  pages: pagesCollection,
};

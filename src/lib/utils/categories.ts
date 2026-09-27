import config from "@/config/config.json";
import { slugify } from "@/lib/utils/textConverter";

export type SiteCategory = {
  name: string;
  slug: string;
  url: string;
  icon?: string;
  count: number;
};

type PostLike = { data: { categories?: string[] } };

// config.json に定義した4カテゴリーが正。
// 記事が0本のカテゴリーも一覧に出したいので、記事側からは件数だけを取る。
export const getSiteCategories = (posts: PostLike[]): SiteCategory[] =>
  config.categories.map((category) => {
    const slug = slugify(category.name);
    return {
      name: category.name,
      slug,
      url: `/categories/${slug}`,
      icon: category.icon,
      count: posts.filter((post) =>
        (post.data.categories ?? []).some((c) => slugify(c) === slug),
      ).length,
    };
  });

export default getSiteCategories;

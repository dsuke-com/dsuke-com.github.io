// similer products
const similerItems = (currentItem: any, allItems: any, slug: string) => {
  let categories: [] = [];
  let tags: [] = [];

  // set categories
  if (currentItem.data.categories.length > 0) {
    categories = currentItem.data.categories;
  }

  // set tags
  if (currentItem.data.tags.length > 0) {
    tags = currentItem.data.tags;
  }

  // filter by categories
  const filterByCategories = allItems.filter(
    (item: { data: { categories: string } }) =>
      categories.find((category) => item.data.categories.includes(category))
  );

  // filter by tags
  const filterByTags = allItems.filter((item: { data: { tags: string } }) =>
    tags.find((tag) => item.data.tags.includes(tag))
  );

  // merged after filter
  const mergedItems = [...new Set([...filterByCategories, ...filterByTags])];

  // 表示中の記事自身を除外する。
  // glob loader のエントリは .slug を持たず .id なので、以前の product.slug では
  // 常に undefined 同士の比較になり全件が除外されていた。
  const filterById = mergedItems.filter(
    (product: { id: string }) => product.id !== slug
  );

  return filterById;
};

export default similerItems;

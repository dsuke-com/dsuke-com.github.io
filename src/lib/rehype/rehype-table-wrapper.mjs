/**
 * Markdown の表を <div class="table-wrapper"> で包む rehype プラグイン。
 * 狭い画面で表を横スクロールさせるために、スクロール用の親要素が必要になる
 * （テーブル自身に overflow-x を当てると min-width が効かない）。
 *
 * unist-util-visit は直接依存ではないため、自前で走査する。
 */
export default function rehypeTableWrapper() {
  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;

    node.children = node.children.map((child) => {
      walk(child);
      if (child.type === "element" && child.tagName === "table") {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrapper"] },
          children: [child],
        };
      }
      return child;
    });
  };

  return (tree) => walk(tree);
}

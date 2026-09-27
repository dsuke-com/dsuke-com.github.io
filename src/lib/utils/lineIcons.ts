// カテゴリーカードなどで使う線画アイコン。絵文字は使わない。
// viewBox="0 0 24 24" / fill="none" / stroke="currentColor" 前提の path 断片。
export const lineIcons: Record<string, string> = {
  rings:
    '<circle cx="9" cy="15" r="6"></circle><circle cx="16" cy="15" r="6"></circle><path d="M14 3l2 2 2-2-2-2z"></path>',
  plane:
    '<path d="M21 15.5l-8.5 2.5-2 3.5-1.5 0 1-4-3.5-1-2 2-1.5 0 1-3.5-1-3.5 1.5 0 2 2 3.5-1-1-4 1.5 0 2 3.5z"></path>',
  key: '<circle cx="8" cy="13" r="4.5"></circle><path d="M11.5 10.5L20 2"></path><path d="M17 5l2.5 2.5"></path><path d="M14.5 7.5L17 10"></path>',
  home: '<path d="M4 10.5L12 4l8 6.5"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>',
  window:
    '<rect x="3" y="3" width="18" height="18" rx="1.5"></rect><path d="M12 3v18"></path><path d="M3 12h18"></path>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"></path><path d="M3 13l9 5 9-5"></path>',
  building:
    '<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M9 7h2"></path><path d="M13 7h2"></path><path d="M9 11h2"></path><path d="M13 11h2"></path><path d="M10 21v-4h4v4"></path>',
  thermometer:
    '<path d="M12 14V4a2 2 0 114 0v10a4 4 0 11-4 0z" transform="translate(-2)"></path>',
};

export const getLineIcon = (name?: string) =>
  lineIcons[name ?? ""] ?? lineIcons.layers;

export default lineIcons;

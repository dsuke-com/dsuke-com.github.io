/// <reference types="astro/client" />

declare global {
  interface Window {
    // ヘッダーのドロップダウン: document へのリスナーを一度だけ張るための目印
    __navDropdownDocBound?: boolean;
    // Google アナリティクス: astro:page-load のリスナーを一度だけ張るための目印
    __gaPageViewBound?: boolean;
  }
}

export {};

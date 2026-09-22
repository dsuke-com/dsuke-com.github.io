import dateFormat from "@/lib/utils/dateFormat";
import { humanize, slugify } from "@/lib/utils/textConverter";
import Fuse from "fuse.js";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type SearchItem = {
  slug: string;
  data: any;
  content: any;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

// 抜粋用に Markdown / MDX の記法を落として読める文章にする
const toPlainText = (raw: unknown): string => {
  if (typeof raw !== "string") return "";
  return (
    raw
      // frontmatter
      .replace(/^---[\s\S]*?---/, "")
      // MDX のショートコード（<Steps ...> や </Warning>）
      .replace(/<\/?[A-Z][^>]*>/g, "")
      // コードブロック
      .replace(/```[\s\S]*?```/g, "")
      // 画像とリンクはテキストだけ残す
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 表の罫線行
      .replace(/^\|[\s:|-]+\|$/gm, "")
      // 見出し・引用・リストの記号
      .replace(/^[#>\s]*[-*+]?\s+/gm, "")
      .replace(/[*_`|]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
};

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  // 検索対象に本文を含める。タイトルを最優先し、タグ・カテゴリー、本文の順に重みをつける。
  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: [
          { name: "data.title", weight: 3 },
          { name: "data.description", weight: 2 },
          { name: "data.tags", weight: 2 },
          { name: "data.categories", weight: 2 },
          { name: "content", weight: 1 },
        ],
        // 既定では文字列の先頭付近しかマッチしないため、長い本文を検索するには必須
        ignoreLocation: true,
        // 日本語は1〜2文字の語（窓・断熱・結露）が多いので下限を1にする
        minMatchCharLength: 1,
        threshold: 0.3,
      }),
    [searchList],
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      if (!inputRef.current) return;
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    const query = inputVal.trim();
    // 1文字から検索する（「窓」のような語を拾うため）
    setSearchResults(query.length > 0 ? fuse.search(query) : []);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      history.pushState(
        null,
        "",
        window.location.pathname + "?" + searchParams.toString(),
      );
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal, fuse]);

  const query = inputVal.trim();
  const hasQuery = query.length > 0;
  const count = searchResults?.length ?? 0;

  return (
    <div className="min-h-[45vh]">
      <label htmlFor="search-input" className="sr-only">
        記事を検索
      </label>
      <input
        id="search-input"
        className="form-input w-full text-center"
        placeholder="記事を検索"
        type="search"
        name="search"
        value={inputVal}
        onChange={handleChange}
        autoComplete="off"
        autoFocus
        ref={inputRef}
      />

      {hasQuery && (
        <p className="my-6 text-center" aria-live="polite">
          {count > 0 ? (
            <>
              「{query}」の検索結果 <strong>{count}</strong> 件
            </>
          ) : (
            <>
              「{query}」に一致する記事は見つかりませんでした。
              <br />
              <span className="text-sm text-text">
                別のことばでも試してみてください。
              </span>
            </>
          )}
        </p>
      )}

      <div className="row">
        {searchResults?.map(({ item }) => {
          const excerpt =
            item.data.description || toPlainText(item.content).slice(0, 120);
          return (
            <div key={item.slug} className={"col-12 mb-8 sm:col-6"}>
              {item.data.image && (
                <a
                  href={`/${item.slug}`}
                  className="group block overflow-hidden rounded-lg hover:text-primary"
                >
                  <img
                    className="w-full transition duration-300 group-hover:scale-[1.03]"
                    src={item.data.image}
                    alt={item.data.title}
                    width={445}
                    height={230}
                  />
                </a>
              )}

              <div className="mt-5 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text">
                {item.data.categories?.map((category: string, i: number) => (
                  <a
                    key={i}
                    href={`/categories/${slugify(category)}`}
                    className="font-semibold text-primary transition duration-300 hover:underline"
                  >
                    {humanize(category)}
                  </a>
                ))}
                {item.data.date && (
                  <>
                    <span aria-hidden="true" className="text-text-light">
                      ·
                    </span>
                    <span>{dateFormat(item.data.date)}</span>
                  </>
                )}
              </div>

              <h3 className="h5 mb-2">
                <a
                  href={`/${item.slug}`}
                  className="block transition duration-300 hover:text-primary"
                >
                  {item.data.title}
                </a>
              </h3>
              <p className="line-clamp-3 text-text">{excerpt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

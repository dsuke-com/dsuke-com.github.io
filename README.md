# ふたり暮らしの実録ノート

30代夫婦のプロポーズ、結婚式、海外旅行、中古マンション購入、その後の暮らしを、費用や失敗も含めて記録する個人ブログです。

- **フレームワーク**: [Astro](https://docs.astro.build)（静的生成）
- **スタイル**: Tailwind CSS v4
- **記事**: Markdown / MDX（`src/content/posts/`）
- **ベーステーマ**: Bookworm Light Astro（Themefisher, MIT）

## デザイン・仕様

配色や書体のルール、コンテンツ仕様、やらないことの一覧は `.claude/design-spec.md` にまとめています。
見た目や記事の構造を変えるときはそちらを先に読んでください。

## 開発

```bash
pnpm install

pnpm dev      # 開発サーバー
pnpm build    # 本番ビルド（dist/ に出力）
pnpm preview  # ビルド結果の確認
pnpm check    # 型チェック（astro check）
pnpm lint     # フォーマット確認（prettier --check）
pnpm format   # フォーマット適用
```

Claude Code で開発サーバーを起動するときは `astro dev --background` を使います（`CLAUDE.md` 参照）。

## 記事を追加する

1. `src/content/posts/-template.md` をコピーして、`src/content/posts/` に新しいファイル名で保存する
   - ファイル名がそのままURLになる（`my-article.md` → `/blog/my-article`）
   - 日本語より英数字とハイフンのファイル名を推奨
   - `-` で始まるファイルはビルド対象外（ひな型置き場）
2. フロントマターを埋める
3. 本文を書く
4. `draft: true` を `false` に変えると公開される

### フロントマター

| キー          | 必須 | 内容                                                               |
| ------------- | ---- | ------------------------------------------------------------------ |
| `title`       | ○    | 記事タイトル。日記調ではなく、読者が検索する言葉で書く             |
| `description` |      | 検索結果に出る説明文。120文字前後                                  |
| `publishedAt` | ○    | 公開日時（`2026-01-01T09:00:00Z`）                                 |
| `updatedAt`   |      | 更新日時。書き直したら更新する                                     |
| `category`    | ○    | `結婚` / `旅行` / `マンション購入` / `暮らしの工夫` から1つ        |
| `tags`        |      | 自由。`["トルコ", "eSIM"]`                                         |
| `eyecatch`    |      | 横長のアイキャッチ画像のパス（例 `/images/posts/01.jpg`）          |
| `eyecatchAlt` |      | アイキャッチの代替テキスト                                         |
| `draft`       | ○    | `true` の間は一覧・記事ページ・サイトマップ・RSSのいずれにも出ない |
| `affiliate`   | ○    | `true` にすると本文より前に広告表示が出る                          |
| `slug`        |      | URLをファイル名と変えたいときだけ                                  |
| `tripDate`    |      | 旅行・イベントの時期。記事冒頭のまとめに出る                       |
| `location`    |      | 場所。同上                                                         |
| `totalCost`   |      | 総額（円、数値）。同上                                             |

カテゴリーは `src/config/config.json` の `categories` が正です。ここに書いたカテゴリーは、記事が0本でも一覧ページとカテゴリーページが用意されます。増やすときはこの配列に足してください。

### 本文の構成

手記として書きつつ、同じ場面の人が使えるように次の順で書きます。

1. 当時の状況
2. なぜそれを選んだか
3. 事前に準備したこと
4. 実際にやったこと
5. かかった費用
6. よかったこと
7. 失敗・後悔
8. もう一度やるならどうするか
9. 使用した商品やサービス

## 記事の中で使える部品

MDX / Markdown からそのまま書けます（import は不要）。

| 部品                   | 用途                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| `<AdDisclosure />`     | 広告・PR表示。`affiliate: true` なら自動で出るので、追加で置きたいときだけ |
| `<ProductCard ... />`  | 商品情報・良かった点・気になった点・向いている人・価格記録・購入リンク     |
| `<CostTable ... />`    | 費用の表（合計は自動計算）                                                 |
| `<CompareTable ... />` | 比較表                                                                     |
| `<Figure ... />`       | キャプション付きの写真                                                     |
| `<Gallery ... />`      | 複数写真のギャラリー                                                       |
| `<BuyLink ... />`      | 購入リンク単体                                                             |

各コンポーネントの先頭コメントに記述例があります（`src/layouts/shortcodes/`）。

既存テーマの `<Notice>` `<Accordion>` `<Tabs>` `<Steps>` `<Youtube>` なども引き続き使えます。

### アフィリエイトリンクの扱い

- 広告を含む記事は `affiliate: true` にする。本文より前に「この記事にはアフィリエイト広告が含まれています。」が出る
- 表示文言は `src/config/config.json` の `params.affiliate_notice`
- 商品リンクは `<BuyLink href="..." sponsored />` を使う。`sponsored` を付けると `rel="sponsored nofollow noopener noreferrer"` になる
- **使っていない商品を、使ったように書かない**。価格は「いつ時点か」を必ず添える

## 写真を追加する

1. `public/images/posts/` に置く
2. 記事から `/images/posts/ファイル名.jpg` で参照する

- 横長のアイキャッチは 1200×630 程度
- `<Figure>` `<Gallery>` は `width` / `height` を指定して読み込み時のレイアウトずれ（CLS）を防ぐ
- `alt` は必ず書く。写真がまだない場所は指定を省くと控えめなプレースホルダーが出る

### 写真の選び方・加工の方針

- 自然光を感じる、明るく透明感のある写真にする。白い壁、淡い木目、リネンなどの明るい素材感を生かす
- セピア加工、強い黄み、暗いフィルターは使わない
- 彩度は下げすぎない。海・街並み・料理の自然な色を残す
- 白飛びさせず、商品や室内の細部が分かる明るさにする
- 人物の顔を大きく出さず、手元、後ろ姿、風景、持ち物を中心にする
- 写真のまわりには白い余白を取る（記事本文は白いカードの上に組んでいます）

## 設定ファイル

| ファイル                 | 内容                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `src/config/config.json` | サイト名、説明、カテゴリー定義、トップのキャッチコピーと写真、著者情報、注目記事、解析ID  |
| `src/config/menu.json`   | ヘッダー・フッターのメニュー。`"childrenFrom": "categories"` はカテゴリーのドロップダウン |
| `src/config/theme.json`  | 配色とフォント                                                                            |
| `src/config/social.json` | SNSリンク（空なら非表示）                                                                 |

### 配色（暮らしの手帖）

自然光の入る部屋のような、明るく軽やかな配色。画面の大部分をアイボリーとホワイトが占め、淡い差し色は「背景」として使い、小さな文字には濃い色を当てます。

`src/config/theme.json` の値が CSS 変数として書き出されます。

| 変数                   | 値        | 用途                                                       |
| ---------------------- | --------- | ---------------------------------------------------------- |
| `--color-body`         | `#FFFCF7` | 全体背景（明るいアイボリー）                               |
| `--color-surface`      | `#FFFFFF` | 記事本文・カード（ホワイト）                               |
| `--color-primary`      | `#99502D` | リンク・主要ボタン・記事の大見出し（深いオレンジブラウン） |
| `--color-primary-dark` | `#7D3F22` | 上記のホバー                                               |
| `--color-apricot`      | `#F2B895` | メインの差し色。アイコン地、見出しの細い帯                 |
| `--color-sage`         | `#C7DCC8` | サブの差し色。サイドバーの見出し帯、表のヘッダー           |
| `--color-accent`       | `#F8E5A6` | バターイエロー。PR表示や順位など小さなポイントだけ         |
| `--color-text`         | `#36312D` | 本文（チャコールブラウン）                                 |
| `--color-text-muted`   | `#6E655D` | 補助文字（グレーブラウン）                                 |
| `--color-border`       | `#EAE3D9` | 境界線（淡いベージュ）                                     |

守っているルール:

- 大きな面積を濃い色で塗らない。ヘッダーもフッターも明るい背景
- 淡いアプリコット・セージ・バターは**背景にだけ**使い、小さな文字の色には使わない
- 淡い背景には必ず `--color-text`（#36312D）を載せる。この組み合わせはすべて WCAG AA（4.5:1）以上

フォントは端末のものを使います（`fonts.use_system_fonts: true`）。見出しは明朝、本文はゴシックです。日本語のWebフォントは合計数MBになるため読み込んでいません。リモートフォントに戻す場合は `use_system_fonts` を `false` にしたうえで、`src/layouts/Base.astro` に `astro:assets` の `<Font>` を戻してください。

## アクセス解析・所有権の確認

すべて `src/config/config.json` で切り替えます。ID が空、または `enable: false` の間はスクリプトを一切出力しません。

| キー                                         | 用途                                              |
| -------------------------------------------- | ------------------------------------------------- |
| `verification.google`                        | Search Console の所有権確認メタタグ。設定済み     |
| `google_tag_manager.enable` / `gtm_id`       | GTM のコンテナスニペット（`GTM-XXXXXXX`）。未使用 |
| `google_analytics.enable` / `measurement_id` | GA4（gtag.js）。`G-EJZ5XP99L3` を設定済み・有効   |

**GTM 経由で GA4 を配信する場合、`google_analytics.enable` は `false` のままにしてください。**
両方を有効にするとページビューが二重に計測されます。

所有権の確認方法は3つ用意してあり、どれか1つが通れば構いません。

1. HTMLファイル — `public/googlebd747d92c45bb1c8.html`
2. HTMLタグ — `verification.google`（上記）
3. GA または GTM — GA4 を有効にしてあるので、この方法でも確認できます

> このサイトは `<ClientRouter />`（View Transitions）を使っているため、ページ遷移でスクリプトが再実行されません。
> GA4 は自動のページビュー送信を切り、`astro:page-load` のたびに送るようにしています（`src/layouts/components/GoogleAnalytics.astro`）。
> GTM 側は `astro-gtm-lite` が同等の処理をしています。

計測を有効／無効にしたら、`src/content/pages/privacy-policy.md` のアクセス解析の記述も実態に合わせてください。

## SEO

自動で付くもの:

- ページごとの `title` / `description`
- canonical URL（1ページ1本）
- OGP / Twitter Card
- `sitemap-index.xml`（`@astrojs/sitemap`）
- `robots.txt`（`public/robots.txt`）
- `/rss.xml`
- パンくずリストと `BreadcrumbList` 構造化データ
- 記事ページの `Article` 構造化データ

`draft: true` の記事はページ自体が生成されないため、一覧・サイトマップ・RSSのどこにも出ません。

## 公開

`dist/` を静的ホスティングに上げます。サイトのURLは `astro.config.mjs` の `site` と `src/config/config.json` の `site.base_url` の両方に書かれているので、ドメインを変えるときは両方直してください。`public/robots.txt` の `Sitemap:` 行も同様です。

> このサイトはルート（`/`）配信を前提にしています。`astro.config.mjs` に `base` を足すと、テーマ側が絶対パスで書いている画像とリンクが壊れます。

## ライセンス

ベーステーマ Bookworm Light Astro は MIT（`LICENSE`）。記事本文と写真の著作権は運営者に帰属します。

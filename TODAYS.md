# 作業ログ — 2026-05-11

## 今日やったこと

### バグ修正
- **contact.html EmailJS 初期化バグ修正**  
  `EMAILJS_PUBLIC_KEY !== "UlBt4NvCcEAZSlnX_"` が常に false → `!== "YOUR_PUBLIC_KEY"` に修正  
  → メール送信が実際に動くようになった

### UI・ナビ改善（修正指示 v2）
- **サイドバーラベル変更**: 全18ファイルで "QRを作ってみる" → "QR作成"
- **リンクの下線削除**: styles.css に `a { text-decoration: none; }` 追加
- **ハンバーガーメニュー sessionStorage 永続化**: ページ遷移後もメニュー開閉状態を保持
- **text-qr.html リンクタブのインライン化**: 別ページへのリンクではなく、同ページ内タブとして URL 入力欄を追加

### 新規ページ作成
- **templates.html** — テンプレート一覧ページ
  - 無料プリセット 6種（アンバー / スカイシアン / ホットピンク / ディープエメラルド / テラコッタ / ミッドナイト）
  - プレミアムプリセット 6種（グレーアウト + 鍵アイコン）
  - アイコン入り QR：SVG モックアップ + ロック表示で近日公開としてプレビュー
  - qrcodejs で動的 QR 生成

- **404.html** — Cloudflare Pages 用カスタムエラーページ  
  サイトデザインに合わせた 404 ページ

- **_headers** — Cloudflare Pages セキュリティヘッダー  
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

- **robots.txt** — Sitemap URL を `YOUR-DOMAIN` プレースホルダーに更新

### 既存ページ改修
- **url-shortener.html**: "近日公開" → 外部短縮サービス紹介ページ  
  Bitly / TinyURL / Rebrandly の案内 + 3ステップ使い方ガイド

- **login.html**: 通知登録フォームに加えて、ダッシュボードモックアップを追加  
  フェイクブラウザ枠 + QR カードグリッド + 「これはプレビューです」バナー

- **pricing.html**: Free / Premium の2プランから Free / Pro (¥580) / Business (¥1,980) の3プランに刷新  
  機能比較テーブルも3列に更新

### セキュリティ強化
- **SRI 属性追加**: qrcodejs CDN に integrity + crossorigin を追加（5ファイル: index.html, text-qr.html, qr-email.html, qr-map.html, templates.html）

---

## 今日判断・確認したこと

| 項目 | 結論 |
|------|------|
| Cloudflare Pages 商用利用 | OK（明示的に許可）→ GitHub Pages から移行予定 |
| EmailJS 商用利用 | OK（利用規約上問題なし） |
| Stripe KYC | マイナンバーカード可・個人事業主のまま開始可能 |
| SmartQR 商標 | デンソーウェーブが「Smart QR」を所有の可能性 → J-PlatPat で要確認 |
| Gumroad 日本語コンテンツ | 技術的には使えるが日本ユーザーには BOOTH / note の方が馴染みやすい |
| 動的 QR とは | QR には短縮URLを埋め込み、サーバー側でリダイレクト先を管理→印刷後も変更可 |
| 早期デプロイすべきか | YES → ドメイン年齢が SEO に影響。早いほど有利 |

---

## デプロイ・インフラ作業（午後）

- **Cloudflare Pages デプロイ完了**
  - `https://qrcode-gen-website.pages.dev/` で公開
  - GitHub push → 自動デプロイ設定済み
  - `_headers` によるセキュリティヘッダー適用済み
  - `404.html` カスタムエラーページ動作確認済み
- **canonical URL・sitemap 一括更新**: 全HTMLと sitemap.xml を `pages.dev` ドメインに書き換え
- **robots.txt** の Sitemap 行を正式URLに更新
- **Google Search Console 登録**: URLプレフィックスで `qrcode-gen-website.pages.dev` を登録、GA4で所有権確認
- **sitemap.xml 送信**: GSC でサイトマップ送信（取得完了は翌日以降）
- **.gitattributes 追加**: LF/CRLF 警告を解消

---

## 次にやること（優先順）

1. **Cloudflare Pages 移行**（商用利用のため必須）
   - cloudflare.com → Pages → Git リポジトリ接続
   - canonical URL と sitemap.xml を新ドメインに更新
   - robots.txt の Sitemap 行を正式 URL に変更

2. **独自ドメイン取得**（Cloudflare Registrar, ~$10/年）

3. **tokushoho.html の空欄を記入**（有料プラン開始前に必須）

4. **有料機能の実装**（次の課金サイクルで）
   - SVG ダウンロード
   - ロゴ埋め込み QR（Canvas API）
   - QR 履歴（Supabase or localStorage）
   - Stripe Payment Links 設置

5. **動的 QR**（要バックエンド・最重要マネタイズ機能、後回し可）

---

## 課金コスト目安（今後の機能をClaudeに頼む場合）

| 機能 | 規模感 | 目安 |
|------|--------|------|
| SVG ダウンロード | 軽量（JS 数十行） | ¥200〜500 |
| ロゴ埋め込み QR | 中程度（Canvas API + UI） | ¥500〜1,500 |
| QR 履歴（localStorage） | 中程度（CRUD + 表示） | ¥800〜2,000 |
| Stripe 決済導入（Payment Links） | 軽量（外部リンク設置） | ¥200〜500 |
| ログイン・認証（Supabase） | 重量（要設計） | ¥3,000〜8,000 |
| 動的 QR（サーバー側リダイレクト） | 最重量（バックエンド必須） | ¥5,000〜15,000+ |
| アクセス解析ダッシュボード | 重量（DB + 可視化） | ¥3,000〜8,000 |

※ 金額は Claude Max ($100/月プランで換算・作業量と会話の長さによって変動)

# ぽちっとQR工房

![ぽちっとQR工房 スクリーンショット](img/screenshot.png)

URLを入力するだけでQRコードを即時生成・ダウンロードできる静的Webアプリ。  
**本番URL**: https://qrcode-gen-website.pages.dev/

---

## 現在の状態（2026-05-12）

| 項目 | 状態 |
|------|------|
| ホスティング | ✅ Cloudflare Pages（GitHub push → 自動デプロイ） |
| canonical URL / sitemap | ✅ pages.dev ドメインに統一済み |
| Google Search Console | ✅ 登録済み・sitemap 送信済み |
| Google Analytics | ✅ G-1G6VC4NMYL |
| セキュリティヘッダー | ✅ `_headers`（X-Frame-Options / CSP / Referrer-Policy 等） |
| SRI（CDN整合性検証） | ✅ qrcodejs CDN に integrity 属性付き |
| 特定商取引法表記 | ✅ 記入済み |
| EmailJS フォーム | ✅ 動作確認済み |
| PNG ダウンロード | ✅ 全 QR ページで動作 |
| SVG ダウンロード | ✅ UI実装済み・Pro ゲート（pricing.html へ誘導） |
| Stripe 決済 | ❌ 未設置（次のステップ） |
| 認証 / ログイン | ❌ 未実装（Supabase 予定） |
| 独自ドメイン | ❌ 未取得 |

---

## 機能

### 現在無料で使える機能（登録不要）

- URL / テキスト / 連絡先（vCard）/ 動画 / メール / 地図 の QR 生成
- カラーカスタマイズ（6色スウォッチ + カスタムカラーピッカー）
- PNG ダウンロード（タイムスタンプ付きファイル名）
- 全処理ブラウザ完結（サーバーへのデータ送信なし）
- レスポンシブ対応・モバイルナビ

### Pro 機能（¥580/月・Stripe 設置後に有効化予定）

- SVG ダウンロード（印刷・看板向け高解像度ベクター）← UI実装済み、課金ゲート待ち
- ロゴ・アイコン埋め込み QR（Canvas API）← 未実装
- デザインテンプレート全解放 ← モックのみ
- QR 履歴管理（100件）← 未実装

### Business 機能（¥1,980/月）

- 動的 QR（URL を後から変更可能）← 未実装・バックエンド必須
- 詳細アクセス解析
- 一括 QR 作成・API アクセス

---

## ページ一覧（全20ページ）

| ページ | ファイル | 備考 |
|--------|---------|------|
| TOP（ホーム） | index.html | タブ切り替え QR 生成（URL/テキスト/連絡先/動画/ファイル） |
| テキストQR作成 | text-qr.html | URL タブ + テキストタブ切り替え |
| メールQR作成 | qr-email.html | mailto: URL → QR |
| 地図QR作成 | qr-map.html | 住所 or Google Maps URL → QR |
| 連絡先管理 | contact-management.html | vCard QR |
| テンプレート一覧 | templates.html | 6無料 + 6プレミアムカラープリセット |
| 使い方ガイド | how-to.html | ステップ解説 |
| よくある質問 | faq.html | FAQ |
| 料金プラン | pricing.html | Free / Pro ¥580 / Business ¥1,980 |
| 新着情報 | news.html | お知らせ一覧 |
| 会社案内 | about.html | ミッション・サービス概要 |
| お問い合わせ | contact.html | EmailJS フォーム（設定済み） |
| ログイン | login.html | 通知受付 + ダッシュボードモックアップ（noindex） |
| 活用事例 | use-cases.html | 業種別ユースケース6種 |
| マーケティング情報 | marketing.html | QR 活用の戦略・設置場所ガイド |
| 短縮URL | url-shortener.html | 外部サービス紹介（Bitly / TinyURL 等） |
| 特定商取引法表記 | tokushoho.html | ✅ 記入済み |
| プライバシーポリシー | privacy.html | |
| 利用規約 | terms.html | |
| カスタム404 | 404.html | Cloudflare Pages 用 |

---

## ファイル構成

```
QRcode_Gen_Website/
├── index.html              TOP・タブQR生成
├── text-qr.html            テキスト/URLタブQR
├── qr-email.html           メールQR
├── qr-map.html             地図QR
├── contact-management.html 連絡先QR
├── templates.html          テンプレート一覧
├── how-to.html             使い方
├── faq.html                よくある質問
├── pricing.html            料金プラン（3階層）
├── news.html               新着情報
├── about.html              会社案内
├── contact.html            お問い合わせ（EmailJS）
├── login.html              ログイン + ダッシュボードモック
├── use-cases.html          活用事例
├── marketing.html          マーケティング情報
├── url-shortener.html      短縮URL外部サービス紹介
├── tokushoho.html          特定商取引法表記（記入済み）
├── privacy.html            プライバシーポリシー
├── terms.html              利用規約
├── 404.html                カスタム404ページ
├── styles.css              共通スタイル
├── script.js               タブ切り替え・モバイルナビ・DL処理
├── sitemap.xml             全ページ sitemap
├── robots.txt              クローラー設定
├── _headers                Cloudflare Pages セキュリティヘッダー
├── .gitattributes          LF 統一
├── og-image.svg/png        OGP画像
├── favicon.svg             ファビコン
└── README.md               このファイル
```

---

## 使用技術

| 種別 | 内容 |
|------|------|
| 言語 | HTML5 / CSS3 / Vanilla JS |
| QR生成 | qrcodejs 1.0.0（CDN・SRI付き） |
| フォント | Noto Sans JP（Google Fonts） |
| ホスティング | Cloudflare Pages（GitHub 連携・自動デプロイ） |
| 計測 | Google Analytics 4（G-1G6VC4NMYL） |
| メール | EmailJS（PUBLIC_KEY=UlBt4NvCcEAZSlnX_） |

---

## ローカル確認

```powershell
# VS Code の Live Server 拡張で index.html を右クリック → Open with Live Server
# または index.html をブラウザに直接ドラッグ
```

---

## プラン別機能一覧

### Free（リリース済み・登録不要）

| 機能 | 状態 |
|------|------|
| URL / テキスト / 連絡先 / メール / 地図 QR 生成 | ✅ 無制限 |
| カラーカスタマイズ（6色 + カスタムピッカー） | ✅ |
| PNG ダウンロード | ✅ 無制限 |
| ブラウザ完結・データ非送信 | ✅ |
| スマートフォン対応 | ✅ |

### Pro（¥580/月）

| 機能 | 実装状態 |
|------|---------|
| SVG ダウンロード | ✅ UI 実装済み・Pro バッジ表示・pricing.html へ誘導中 |
| ロゴ・アイコン埋め込み QR | ❌ 未実装 |
| デザインテンプレート全種類 | ⚠️ モックのみ |
| QR 履歴管理（100件） | ❌ 未実装（要認証） |
| 基本アクセス解析 | ❌ 未実装（要認証） |

### Business（¥1,980/月）

| 機能 | 実装状態 |
|------|---------|
| 動的 QR（URL 後から変更可） | ❌ 未実装（要バックエンド） |
| QR 履歴（無制限）/ 詳細解析 | ❌ 未実装 |
| 一括 QR 作成 / API | ❌ 未実装 |

---

## 次にやること（優先順）

### Phase 1 — 今週（決済開始）
- [ ] Stripe アカウント作成
- [ ] Pro（¥580/月）・Business（¥1,980/月）の Payment Links 作成
- [ ] pricing.html のボタンに Stripe URL を設置
- [ ] 独自ドメイン取得（Cloudflare Registrar・約 $10/年）

### Phase 2 — 1ヶ月以内（課金ゲート）
- [ ] Supabase Auth でログイン機能実装
- [ ] Stripe Webhook → Supabase で課金フラグ管理
- [ ] SVG ダウンロード・テンプレートを課金チェックで自動解放

### Phase 3 — 2ヶ月以内（Pro 機能完成）
- [ ] ロゴ・アイコン埋め込み QR（Canvas API）
- [ ] QR 履歴管理（localStorage → Supabase）
- [ ] 基本アクセス解析ダッシュボード

### Phase 4 — 将来（Business 機能）
- [ ] 動的 QR（サーバーサイドリダイレクト・最重要マネタイズ機能）
- [ ] 詳細アクセス解析・一括作成・API

---

## マネタイズ見込み

| タイミング | 内容 |
|-----------|------|
| 今週 | Stripe リンク設置 → 形式上の販売開始可能 |
| 1ヶ月後 | 認証 + 課金ゲート → SVG 等を自動で解放 |
| 2ヶ月後 | Pro 機能が出揃いリテンション向上 |

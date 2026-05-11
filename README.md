# ぽちっとQR工房

URLを入力するだけでQRコードを即時生成・ダウンロードできる静的Webアプリ。  
GitHub Pages でホスティング: https://sleepycat12341013.github.io/QRcode_Gen_Website/

---

## 機能

- URL / テキスト / メール / 地図リンク の4タブでQR生成
- カラーカスタマイズ（6色スウォッチ + カスタムカラーピッカー）
- PNGダウンロード（タイムスタンプ付きファイル名）
- 全処理ブラウザ完結（サーバーへのデータ送信なし）
- レスポンシブ対応（モバイルナビ付き）
- Google Analytics (G-1G6VC4NMYL) 計測済み

---

## ページ一覧（全16ページ）

| ページ | ファイル | 備考 |
|--------|---------|------|
| TOP（ホーム） | index.html | タブ切り替え QR 生成（URL/テキスト/メール/地図） |
| テキストQR作成 | text-qr.html | URLタブ + テキストタブ切り替え対応 |
| メールQR作成 | qr-email.html | mailto: URL → QR |
| 地図QR作成 | qr-map.html | 住所 or Google Maps URL → QR |
| 使い方ガイド | how-to.html | ステップ解説 |
| よくある質問 | faq.html | FAQ（アコーディオン） |
| 料金プラン | pricing.html | Free / Pro ¥580 / Business ¥1,980（有料は近日公開） |
| 新着情報 | news.html | お知らせ一覧 |
| 会社案内 | about.html | ミッション・サービス概要 |
| お問い合わせ | contact.html | EmailJS フォーム（設定済み） |
| ログイン | login.html | 通知受付 + ダッシュボードモックアップ（noindex） |
| 活用事例 | use-cases.html | 業種別ユースケース6種 |
| マーケティング情報 | marketing.html | QR活用の戦略・設置場所ガイド |
| 短縮URL | url-shortener.html | 外部サービス紹介（Bitly / TinyURL 等） |
| テンプレート一覧 | templates.html | 6無料 + 6プレミアムカラープリセット + アイコン入りQR紹介 |
| カスタム404 | 404.html | Cloudflare Pages 用カスタムエラーページ |

---

## ファイル構成

```
QRcode_Gen_Website/
├── index.html              TOP・タブQR生成
├── text-qr.html            テキスト/URLタブQR
├── qr-email.html           メールQR
├── qr-map.html             地図QR
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
├── templates.html          テンプレート一覧（カラー + プレミアム）
├── 404.html                カスタム404ページ
├── styles.css              共通スタイル
├── script.js               タブ切り替え・モバイルナビ
├── sitemap.xml             全ページ sitemap
├── robots.txt              クローラー設定
├── _headers                Cloudflare Pages セキュリティヘッダー
├── og-image.svg/png        OGP画像
└── README.md               このファイル
```

---

## 使用技術

| 種別 | 内容 |
|------|------|
| 言語 | HTML5 / CSS3 / Vanilla JS |
| QR生成 | [qrcodejs](https://github.com/davidshimjs/qrcodejs) 1.0.0（CDN） |
| フォント | Noto Sans JP（Google Fonts） |
| ホスティング | Cloudflare Pages（移行予定）/ 現 GitHub Pages |
| 計測 | Google Analytics 4（G-1G6VC4NMYL） |

---

## ローカル確認

`index.html` をブラウザで直接開くか、VS Code の Live Server で起動。

```bash
# Live Server（VS Code 拡張）
# index.html を右クリック → "Open with Live Server"
```

---

## Git コミット履歴

| ハッシュ | 内容 |
|---------|------|
| 5f4f26f | Initial release: ぽちっとQR工房 MOCK v1 |
| ce258af | Add Google Analytics (G-1G6VC4NMYL) |
| 73653a2 | Add 8 new pages and update all nav/sidebar links site-wide |

---

## プラン別機能一覧 <sub>2026-05-11</sub>

### Free（現在リリース済み・登録不要）

| 機能 | 状態 |
|------|------|
| URL リンク QR 生成 | ✅ 無制限 |
| テキスト QR 生成（最大500文字） | ✅ 無制限 |
| メール QR 生成（mailto:） | ✅ 無制限 |
| 地図リンク QR 生成（住所 / Google Maps URL） | ✅ 無制限 |
| 連絡先 QR 生成（vCard 3.0） | ✅ 無制限 |
| カラーカスタマイズ（6色 + カスタムピッカー） | ✅ |
| PNG ダウンロード | ✅ 無制限 |
| ブラウザ完結・データ非送信 | ✅ |
| スマートフォン対応 | ✅ |
| アカウント登録 | ❌ 不要 |

---

### Pro（¥580/月・近日公開）

Free の全機能に加えて：

| 機能 | 内容 |
|------|------|
| SVG・高解像度 PNG 出力 | 印刷・看板向け高品質出力 |
| ロゴ・アイコン埋め込み | QR コード中央に画像を配置 |
| デザインテンプレート（全種類） | 業種別・色テーマプリセット全解放 |
| QR 履歴管理（100件） | 作成済み QR の保存・再利用 |
| 基本アクセス解析 | スキャン数・デバイス統計 |

### Business（¥1,980/月・近日公開）

Pro の全機能に加えて：

| 機能 | 内容 |
|------|------|
| 動的 QR（URL 後から変更可） | QR 印刷後も飛び先を変更できる最重要機能 |
| QR 履歴管理（無制限） | 件数制限なし |
| 詳細アクセス解析 | 地域・デバイス・時間帯の詳細統計 |
| 一括 QR 作成 | CSV 入力で複数 QR を一括生成 |
| API アクセス | 外部システムからの QR 生成連携 |

---

### 実装ステータス対照表

| 機能 | 画面上の表示 | 実装状態 |
|------|------------|---------|
| URL QR | タブ「リンク」 | ✅ 動作する |
| テキスト QR | タブ「文字入力」 | ✅ 動作する |
| メール QR | タブ（index.html）/ qr-email.html | ✅ 動作する |
| 地図 QR | タブ（index.html）/ qr-map.html | ✅ 動作する |
| 連絡先 QR | タブ「連絡先」 | ✅ 動作する |
| 動画 QR | タブ「動画」 | ⚠️ URL 入力のみ（テンプレートなし） |
| ファイル QR | タブ「ファイル」 | 🔒 近日公開スタブ |
| ダッシュボード / 履歴管理 | 左サイドバー | 🔒 login.html へ誘導（未実装） |
| アクセス解析 | 左サイドバー | 🔒 login.html へ誘導（未実装） |
| テンプレート / ブランド管理 | 左サイドバー | 🔒 login.html へ誘導（未実装） |

---

## 次にやること（優先順）

### 【すぐ】ホスティング移行
- [ ] Vercel のプロジェクトを削除（→ 削除手順は下記）
- [ ] Cloudflare Pages に移行（商用利用OK・帯域無制限・無料）
  1. cloudflare.com → Pages → Create a project → Connect to Git
  2. リポジトリ: `QRcode_Gen_Website`
  3. Framework: None / Build command: 空欄 / Output: 空欄
- [ ] sitemap.xml と全ページの canonical URL を新しいURLに更新
- [ ] tokushoho.html の [氏名/住所/電話番号] プレースホルダーを記入
  （有料プラン開始前にバーチャルオフィスを契約して住所取得）

### 【有料プラン追加前】
- [ ] 独自ドメイン取得（Cloudflare Registrar で .com 年 $10〜11 程度）
- [ ] EmailJS の公式キーを contact.html / login.html に設定済み ✅
- [ ] 決済手段の選定（Stripe 推奨・Vercel 不要で導入可能）

### 【将来】主要機能
- [ ] アイコン入りQR（Canvas API でロゴ合成、エラー訂正 H 固定）
- [ ] デザイン編集ページ（design-editor.html）
- [ ] 動的QR（URL 後から変更可能 → DB 必須、最重要マネタイズ機能）
- [ ] アクセス解析ダッシュボード（スキャン数・地域・デバイス）
- [ ] SVG/PDF 高画質ダウンロード
- [ ] ログイン・アカウント管理（Supabase Auth 推奨）

### 【確定プラン】
```
Free     : 静的QR・基本色・PNG（登録不要・無制限）        ← 現在リリース済み
Pro      : ¥580/月  — アイコン入り・全テンプレート・SVG・履歴100件
Business : ¥1,980/月 — 動的QR・詳細解析・API・一括作成・履歴無制限
```
- 決済: Stripe Payment Links（バックエンド不要）
- 課金開始前に独自ドメイン + 特定商取引法表記の記入が必要

---

## Vercel 削除手順

1. [vercel.com/dashboard](https://vercel.com/dashboard) にログイン
2. 削除したいプロジェクトを選択
3. **Settings** タブ → 最下部 **"Delete Project"**
4. プロジェクト名を入力して確認 → 削除完了

> チームではなく個人アカウントのプロジェクトであれば上記で完結。

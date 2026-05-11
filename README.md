# SmartQR Studio

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

## ページ一覧（全13ページ）

| ページ | ファイル | 備考 |
|--------|---------|------|
| TOP（ホーム） | index.html | タブ切り替え QR 生成（URL/テキスト/メール/地図） |
| テキストQR作成 | text-qr.html | 最大500文字のテキスト → QR |
| メールQR作成 | qr-email.html | mailto: URL → QR |
| 地図QR作成 | qr-map.html | 住所 or Google Maps URL → QR |
| 使い方ガイド | how-to.html | ステップ解説 |
| よくある質問 | faq.html | FAQ（アコーディオン） |
| 料金プラン | pricing.html | Free / Premium（近日公開） |
| 新着情報 | news.html | お知らせ一覧 |
| 会社案内 | about.html | ミッション・サービス概要 |
| お問い合わせ | contact.html | mailto: フォーム |
| ログイン | login.html | Coming soon スタブ（noindex） |
| 活用事例 | use-cases.html | 業種別ユースケース6種 |
| マーケティング情報 | marketing.html | QR活用の戦略・設置場所ガイド |

---

## ファイル構成

```
QRcode_Gen_Website/
├── index.html        TOP・タブQR生成
├── text-qr.html      テキストQR
├── qr-email.html     メールQR
├── qr-map.html       地図QR
├── how-to.html       使い方
├── faq.html          よくある質問
├── pricing.html      料金プラン
├── news.html         新着情報
├── about.html        会社案内
├── contact.html      お問い合わせ
├── login.html        ログイン（スタブ）
├── use-cases.html    活用事例
├── marketing.html    マーケティング情報
├── styles.css        共通スタイル
├── script.js         タブ切り替え・モバイルナビ
├── sitemap.xml       全12ページ（loginを除く）
├── og-image.svg/png  OGP画像
└── README.md         このファイル
```

---

## 使用技術

| 種別 | 内容 |
|------|------|
| 言語 | HTML5 / CSS3 / Vanilla JS |
| QR生成 | [qrcodejs](https://github.com/davidshimjs/qrcodejs) 1.0.0（CDN） |
| フォント | Noto Sans JP（Google Fonts） |
| ホスティング | GitHub Pages |
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
| 5f4f26f | Initial release: SmartQR Studio MOCK v1 |
| ce258af | Add Google Analytics (G-1G6VC4NMYL) |
| 73653a2 | Add 8 new pages and update all nav/sidebar links site-wide |

---

## 今後の検討事項

- ログイン機能・ユーザー管理の実装
- プレミアムプランの価格・決済フロー
- QRコード SVG ダウンロード対応
- アクセス解析・QR管理ダッシュボード
- 連絡先 vCard QR・動画 QR タブの有効化
- お問い合わせフォームのバックエンド対応（現在は mailto: のみ）

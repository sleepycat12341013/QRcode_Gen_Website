# 運営ルーティン — ぽちっとQR工房

作成: 2026-05-13

---

## 毎日（5分以内）

やらなくてOK。気が向いたときだけ。

---

## 週1回（月曜 or 好きな日・15〜30分）

| タスク | 内容 | 目安時間 |
|--------|------|----------|
| **GA4チェック** | アクティブユーザー数・どのページが見られたか確認 | 5分 |
| **Search Console チェック** | 検索クエリ・インデックス状況・エラー確認 | 5分 |
| **news.html に1件追加** | 機能追加・改善・お知らせなど200字以内でOK | 10分 |

### news.html 更新のネタ例
- テンプレート追加しました
- ○○ページをリニューアルしました
- QRコード活用Tipsを追加しました
- よくある質問を更新しました

---

## 月1回（30〜60分）

| タスク | 内容 |
|--------|------|
| **Search Consoleでインデックス申請** | 新しく追加・更新したページを申請（1日10件まで） |
| **descriptionの見直し** | 検索クエリを見て、よく検索されてる言葉をdescriptionに追加 |
| **競合チェック** | 「QRコード 無料」で検索して上位サイトの構成を確認 |
| **TODAYS.md 更新** | 月間でやったことをまとめて記録 |

---

## 有料プラン開始前に一度だけやること（スキャンクリーン後）

- [ ] tokushoho.html を .gitignore から外してpush
- [ ] EmailJS APIキー再発行 → contact.html に反映
- [ ] Stripe アカウント作成・Proプラン（¥580）決済リンク作成
- [ ] pricing.html の「購入する」ボタンにStripeリンクを設置
- [ ] GitHub 2FA設定（Androidから）
- [ ] GitHub・Googleパスワード変更

---

## やらなくていいこと（今は）

- 毎日SNS投稿（週1〜2で十分）
- 毎日GA4チェック（数字が安定するまで週1で十分）
- 動的QR実装（バックエンド必要・後回し）
- Supabase・ログイン認証（Stripe導入後に検討）

---

## Search Console インデックス申請リスト（初回・済み）

申請日: 2026-05-13

- [x] https://qrcode-gen-website.pages.dev/
- [x] https://qrcode-gen-website.pages.dev/text-qr.html
- [x] https://qrcode-gen-website.pages.dev/qr-email.html
- [x] https://qrcode-gen-website.pages.dev/qr-map.html
- [x] https://qrcode-gen-website.pages.dev/templates.html
- [x] https://qrcode-gen-website.pages.dev/how-to.html
- [x] https://qrcode-gen-website.pages.dev/pricing.html
- [x] https://qrcode-gen-website.pages.dev/faq.html

残り（次回申請）:
- [ ] https://qrcode-gen-website.pages.dev/about.html
- [ ] https://qrcode-gen-website.pages.dev/contact.html
- [ ] https://qrcode-gen-website.pages.dev/news.html

# 運営ルーティン — ぽちっとQR工房

作成: 2026-05-13

---

## 集客施策 — 優先度まとめ

### 今すぐやる（効果大・コストゼロ）

| 優先 | 施策 | 理由 |
|------|------|------|
| ★★★ | **news.html を週1更新** | Googleに「生きてるサイト」と判断される。継続流入の土台 |
| ★★★ | sitemap.xml 送信済み → 待つだけ | 全ページが数週間以内に自動インデックスされる |
| ★★☆ | **Search Console で1日1件申請** | インデックスを速めるだけ。5/23まで毎日1件 |

### 1〜2ヶ月以内にやる（効果大・少し手間）

| 優先 | 施策 | 理由 |
|------|------|------|
| ★★★ | **Qiita か Zenn に記事1本** | 被リンク獲得 = SEO最強。「QRコード生成ツールを作った」記事1本でOK |
| ★★☆ | **Twitter/X 日本語垢を作る** | 即効性あり。週1〜2投稿で十分。英語垢とは別垢 |

### 急がなくていいこと

| 施策 | 理由 |
|------|------|
| 毎日SNS投稿 | 週1〜2で十分 |
| GA4を毎日見る | 週1で十分。数字が安定するまで日次チェックは無意味 |
| 広告出稿 | 無料施策が先。有料プランが動き始めてからでOK |

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
| **Search Consoleでインデックス申請** | 新しく追加・更新したページを申請（1日1件まで） |
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

## Search Console インデックス申請リスト

※ 1日1件まで。毎日1件ずつ申請する。

- [x] https://qrcode-gen-website.pages.dev/text-qr.html （2026-05-13）
- [ ] https://qrcode-gen-website.pages.dev/ （5/14）
- [ ] https://qrcode-gen-website.pages.dev/qr-email.html （5/15）
- [ ] https://qrcode-gen-website.pages.dev/qr-map.html （5/16）
- [ ] https://qrcode-gen-website.pages.dev/templates.html （5/17）
- [ ] https://qrcode-gen-website.pages.dev/how-to.html （5/18）
- [ ] https://qrcode-gen-website.pages.dev/pricing.html （5/19）
- [ ] https://qrcode-gen-website.pages.dev/faq.html （5/20）
- [ ] https://qrcode-gen-website.pages.dev/about.html （5/21）
- [ ] https://qrcode-gen-website.pages.dev/contact.html （5/22）
- [ ] https://qrcode-gen-website.pages.dev/news.html （5/23）

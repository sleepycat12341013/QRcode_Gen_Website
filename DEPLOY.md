# Cloudflare Pages 移行手順 — ぽちっとQR工房

> 移行先: Cloudflare Pages（商用利用OK・帯域無制限・無料）  
> 現状: GitHub Pages でホスティング中

---

## STEP 1 — Cloudflare Pages にデプロイ（今すぐできる）

1. [dash.cloudflare.com](https://dash.cloudflare.com) にログイン（アカウントなければ作成）
2. 左メニュー **Workers & Pages** → **Create** → **Pages** タブ
3. **Connect to Git** → GitHub 連携 → リポジトリ `QRcode_Gen_Website` を選択
4. ビルド設定：

   | 項目 | 値 |
   |------|----|
   | Framework preset | None |
   | Build command | **空欄** |
   | Build output directory | **空欄**（ルートのまま） |

5. **Save and Deploy** → 1〜2分で完了
6. `https://qrcode-gen-website.pages.dev`（自動割り当て）でアクセス確認

> 独自ドメインがなくてもここまでできる。SEOのドメイン年齢カウントを早めるために今すぐやっておく。

---

## STEP 2 — 独自ドメイン設定（ドメイン取得後）

1. ドメインを Cloudflare Registrar で取得（`.com` 年 $10〜11 程度）
2. Pages プロジェクト → **Custom domains** → **Set up a custom domain**
3. 取得したドメインを入力（例: `pochitto-qr.com`）
4. DNS を Cloudflare で管理していれば CNAME が自動設定される
5. HTTPS は自動で有効化（Let's Encrypt、設定不要）

---

## STEP 3 — URL の一括書き換え（ドメイン確定後に実行）

### 書き換えが必要な箇所

| 種別 | ファイル数 | 内容 |
|------|-----------|------|
| canonical / og:url | 18ファイル | 全 HTML の `<head>` |
| og:image / twitter:image | 16ファイル | OGP 画像 URL |
| sitemap.xml | 1ファイル | 全 `<loc>` タグ（17件） |
| robots.txt | 1ファイル | `Sitemap:` 行 |

### PowerShell 一括置換コマンド

```powershell
$OLD = "https://sleepycat12341013.github.io/QRcode_Gen_Website"
$NEW = "https://あなたのドメイン.com"   # ← ここだけ書き換える

# HTML ファイル一括置換
Get-ChildItem -Path . -Filter "*.html" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw -Encoding UTF8
  $updated = $content.Replace($OLD, $NEW)
  if ($content -ne $updated) {
    Set-Content $_.FullName -Value $updated -Encoding UTF8 -NoNewline
    Write-Host "Updated: $($_.Name)"
  }
}

# sitemap.xml
$xml = Get-Content sitemap.xml -Raw -Encoding UTF8
Set-Content sitemap.xml -Value $xml.Replace($OLD, $NEW) -Encoding UTF8 -NoNewline

# robots.txt
$rb = Get-Content robots.txt -Raw -Encoding UTF8
Set-Content robots.txt -Value $rb.Replace("YOUR-DOMAIN", "あなたのドメイン.com") -Encoding UTF8 -NoNewline

Write-Host "Done."
```

実行後は `git add . && git commit -m "Update canonical URLs to new domain" && git push` でOK。  
Cloudflare Pages は push を検知して自動で再デプロイされる。

---

## STEP 4 — Google Analytics 4 の設定更新

スクリプトタグ（`G-1G6VC4NMYL`）自体の変更は不要。コンソール側のみ。

1. [analytics.google.com](https://analytics.google.com) → 対象プロパティ
2. **管理（歯車）** → **データストリーム** → 対象ストリームを開く
3. **ストリームの URL** を新しいドメインに変更
4. **参照元の除外** に旧 `github.io` ドメインを追加（旧→新の流入がセッション分割されないように）

---

## STEP 5 — GitHub Pages を無効化（SEO 重複防止）

旧 URL が生きていると canonical の重複でSEOに悪影響。

1. GitHub リポジトリ → **Settings** → **Pages**
2. **Source** を `None` に変更 → **Save**

> コードは消さなくていい。Pages（公開設定）だけ OFF にする。

---

## STEP 6 — 移行後チェックリスト

- [ ] `https://新ドメイン/` が正しく表示される
- [ ] `https://新ドメイン/存在しないページ` → 404.html が表示される
- [ ] 開発者ツール → Network → レスポンスヘッダーに `X-Frame-Options: DENY` が出る
- [ ] スマホ実機で動作確認
- [ ] QR生成・PNGダウンロードが動作する
- [ ] [Google Search Console](https://search.google.com/search-console) に新ドメインを登録
- [ ] Search Console で sitemap.xml を送信（`https://新ドメイン/sitemap.xml`）
- [ ] EmailJS の Allowed Origins に新ドメインを追加（EmailJS ダッシュボード → Integrations）

---

## Cloudflare Pages の利点まとめ

| 項目 | 内容 |
|------|------|
| 費用 | 無料（商用利用OK） |
| 帯域 | 無制限 |
| カスタムヘッダー | `_headers` ファイルで設定済み ✅ |
| カスタム 404 | `404.html` を置くだけで自動適用 ✅ |
| HTTPS | 自動（Let's Encrypt） |
| 自動デプロイ | GitHub push で即反映 |
| Web Analytics | Cloudflare ダッシュボードから無料で有効化可能 |

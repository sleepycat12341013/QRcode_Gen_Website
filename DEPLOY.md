# デプロイ手順 — ぽちっとQR工房

完全静的サイト（HTML / CSS / JS のみ）のため、サーバー設定不要で即デプロイ可能。

---

## 方法 1：GitHub Pages（無料・推奨）

### 手順

```bash
# 1. GitHubにリポジトリを作成（例: smartqr-studio）

# 2. ローカルのプロジェクトをプッシュ
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<ユーザー名>/smartqr-studio.git
git push -u origin main
```

3. GitHub リポジトリの **Settings → Pages** を開く
4. **Source** を `Deploy from a branch` に設定
5. Branch を `main` / `/ (root)` に設定して **Save**
6. 数秒〜数分で `https://<ユーザー名>.github.io/smartqr-studio/` に公開される

### CSP ヘッダーの追加（GitHub Pages では不可）

GitHub Pages は独自 HTTPヘッダーを設定できないため、CSP を追加したい場合は  
`<meta>` タグで代替する：

```html
<!-- index.html の <head> 内に追加 -->
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' https://cdn.jsdelivr.net;
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           font-src https://fonts.gstatic.com;
           img-src 'self' data:;">
```

---

## 方法 2：Vercel（無料・最も簡単）

### A. GitHub 連携（自動デプロイ）

1. [vercel.com](https://vercel.com) にアクセス → GitHub でサインアップ
2. **Add New → Project** でリポジトリを選択
3. フレームワーク: **Other** のまま、ルートディレクトリはそのまま
4. **Deploy** を押すと完了（`https://smartqr-studio.vercel.app` 等のURLが発行される）
5. 以後 `main` ブランチへの push で自動デプロイ

### B. Vercel CLI（ターミナルから直接）

```bash
npm install -g vercel
vercel login
vercel --prod
```

### CSP ヘッダーの追加

プロジェクトルートに `vercel.json` を作成：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:;"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 方法 3：Netlify（無料・ドラッグ&ドロップ対応）

### A. ドラッグ&ドロップ（最速）

1. [app.netlify.com/drop](https://app.netlify.com/drop) にアクセス
2. プロジェクトフォルダをそのままドロップ
3. 即座に `https://ランダム名.netlify.app` で公開される

### B. GitHub 連携（自動デプロイ）

1. [netlify.com](https://netlify.com) でサインアップ → **Add new site → Import from Git**
2. GitHubのリポジトリを選択
3. Build command は空欄、Publish directory は空欄（ルートのまま）
4. **Deploy site** で完了

### CSP ヘッダーの追加

プロジェクトルートに `netlify.toml` を作成：

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

## 方法比較

| | GitHub Pages | Vercel | Netlify |
|---|---|---|---|
| 費用 | 無料 | 無料枠あり | 無料枠あり |
| 独自ドメイン | ○ | ○ | ○ |
| HTTPS | 自動 | 自動 | 自動 |
| カスタムヘッダー | × | ○ | ○ |
| 自動デプロイ | ○ | ○ | ○ |
| デプロイ速度 | 遅め | 速い | 速い |
| アクセス解析 | × | ○（有料） | ○（有料） |

**おすすめ**: Vercel（速度・CSPヘッダー・解析が無料枠内で揃う）

---

## アクセス数の計測

デプロイ後にview数を確認するには以下のいずれかを `<head>` に追加：

### Google Analytics 4（無料）

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Cloudflare Web Analytics（無料・プライバシー重視）

Cloudflare でドメインを管理している場合は管理画面から1クリックで有効化可能。  
またはビーコンスクリプトを `<head>` に追加：

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "トークンID"}'></script>
```

---

## デプロイ後チェックリスト

- [ ] HTTPS でアクセスできる
- [ ] QRコード生成・ダウンロードが動作する
- [ ] スマホ実機でレスポンシブを確認
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) でパフォーマンス確認
- [ ] アクセス解析タグの動作を確認

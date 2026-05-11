# セキュリティ診断レポート — SmartQR Studio

> 診断日: 2026-05-10  
> 対象: 静的HTML/CSS/JS のみ構成（バックエンドなし）

---

## 現状（v1 MOCK）

### ✅ 安全な点

| 項目 | 評価 |
|------|------|
| QRコード生成はすべてブラウザ内完結 | 入力データがサーバーに送信されない |
| Cookie / localStorage / sessionStorage 未使用 | データ漏洩リスクなし |
| バックエンドなし | SQLi・RCE・認証bypass の攻撃面なし |
| URL バリデーション実装済み | 不正入力の大半を弾ける |
| ダウンロードは `canvas.toDataURL` のみ | 外部リクエスト発生しない |

---

### ⚠️ 現状の課題

#### 1. CDN ライブラリに SRI ハッシュがない（中リスク）

```html
<!-- 現在 -->
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>

<!-- 推奨：Subresource Integrity を付与 -->
<script
  src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
  integrity="sha256-<ハッシュ値>"
  crossorigin="anonymous">
</script>
```

CDN が改ざんされた場合にそのまま実行される。  
SRI ハッシュを付与すればブラウザが検証してブロックする。

**対処**: `openssl dgst -sha256 -binary qrcode.min.js | base64` でハッシュを生成して追加。

---

#### 2. Content Security Policy (CSP) がない（中リスク）

HTTPヘッダーまたは `<meta>` タグで CSP を設定していないため、  
将来 XSS が混入した場合にスクリプトが自由に実行される。

**推奨 CSP（静的サイト向け最小構成）**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'none';
```

Vercel / Netlify では `vercel.json` / `netlify.toml` のヘッダー設定で追加可能。

---

#### 3. Google Fonts の外部通信（低リスク・プライバシー）

ページ読み込み時に `fonts.googleapis.com` と `fonts.gstatic.com` へリクエストが発生し、  
ユーザーの IP アドレスが Google に記録される。

**対処案**: フォントをセルフホスト（`fontsource` npm パッケージなど）するか、  
`font-display: swap` のシステムフォントフォールバックに切り替える。

---

#### 4. `href="#"` によるナビゲーション（UX → 修正済み）

モバイル時にモックリンクを押すとページトップに飛ぶ問題。  
`script.js` 内で `e.preventDefault()` を全 `href="#"` リンクに追加して対処済み。

---

## 将来（バックエンド追加後）に備える項目

### 🔴 高優先度

| 脅威 | 対策 |
|------|------|
| **認証・認可** | JWT/OAuth2 を使用。自前実装は避け Supabase Auth / Firebase Auth / Clerk 等を利用 |
| **CSRF** | state-change API には CSRF トークンまたは SameSite Cookie を設定 |
| **SQLインジェクション** | ORM のパラメータバインド必須。生クエリ禁止 |
| **保存型XSS** | ユーザー入力をDBに保存して再表示する場合は DOMPurify でサニタイズ |
| **レート制限** | QR生成・登録・ログイン API に rate limiting（例: 10req/min/IP） |

### 🟡 中優先度

| 脅威 | 対策 |
|------|------|
| **CORS** | API サーバーの CORS を許可オリジンのみに限定 |
| **APIキー漏洩** | フロントエンドコードに秘密鍵を含めない。`.env` をコミットしない |
| **HTTPSの強制** | HSTS ヘッダーを設定 (`Strict-Transport-Security: max-age=31536000`) |
| **ファイルアップロード（将来機能）** | MIMEタイプ検証・サイズ制限・ウイルススキャン |
| **短縮URL機能（将来）** | オープンリダイレクト対策（許可ドメインリスト） |

### 🟢 低優先度（運用フェーズ）

| 項目 | 内容 |
|------|------|
| セキュリティヘッダー | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` |
| ログ監査 | 不正アクセス検知のためにアクセスログを保持 |
| 依存ライブラリの定期更新 | `npm audit` / Dependabot を導入 |

---

## チェックリスト（デプロイ前）

- [ ] SRI ハッシュを qrcodejs の `<script>` タグに追加
- [ ] CSP ヘッダーをホスティング設定に追加
- [ ] HTTPS が有効になっていることを確認（Vercel/Netlify は自動）
- [ ] Google Fonts のプライバシーポリシーへの言及（プライバシーポリシーページを用意）
- [ ] `.gitignore` に `.env` が含まれていることを確認

---

## 実装済みセキュリティ対応（2026-05-11）

### 連絡先フォームの PII 設計

**問題**: 氏名・電話番号・メールアドレスをどこに保存するか。

**不採用: Cookie**
- リクエストのたびにサーバーへ PII が自動送信される
- GitHub Pages には静的ファイルしかないが、将来 CDN や解析ツールのリクエストにも乗る可能性がある

**不採用: localStorage（独自コード）**
- 同一オリジン上の他スクリプトから読み取り可能
- コードが介在するぶんだけ漏洩経路が増える

**採用: ブラウザ標準 `autocomplete` 属性**
```html
<input type="text"  autocomplete="name">
<input type="tel"   autocomplete="tel">
<input type="email" autocomplete="email">
<input type="text"  autocomplete="organization">
<input type="url"   autocomplete="url">
```
- ブラウザ自身が管理する安全な領域に保存
- カーソルを合わせると候補ポップアップが出る（コード不要）
- 他のサイト・スクリプトからアクセス不可
- ユーザー本人の端末でのみ復元される

### XSS 対策（連絡先 QR）

- vCard 文字列を HTML に挿入しない（QRCode.js の `text` パラメータに渡すのみ）
- ラベル表示は `el.textContent = ...`（innerHTML 不使用）
- `.value` へのセットは XSS リスクなし（innerHTML と異なりスクリプトとして解釈されない）

### QR 生成エラーハンドリング

```js
try {
  qrInstance = new QRCode(elQrcode, { text, ... });
} catch (e) {
  showError('QRコードの生成に失敗しました。');
  return;
}
```
- ライブラリが例外を投げた際にサイレントに失敗せず、ユーザーにメッセージを表示
- `lastContent = ''` をリセットして不正な状態を残さない

### 完成後にチェックするところ（フォーム関連）

- [ ] DevTools → Application → Local Storage が空であること
- [ ] DevTools → Application → Cookies が空であること
- [ ] autocomplete が動作すること（一度入力 → リロード → 入力欄フォーカスで候補表示）
- [ ] 連絡先 QR を iOS/Android カメラでスキャンして vCard として認識されること
- [ ] 氏名を空にして生成ボタンを押すと赤くなること
- [ ] 不正メールアドレス（`abc`）を入力して生成すると赤くなること

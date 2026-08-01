'use strict';

// ─── qr-reader.html: 画像からQRコードを読み取る ────────────────────────
(function () {
  const elDrop    = document.getElementById('rd-drop');
  if (!elDrop) return;   // 他ページでは動かさない

  const elFile    = document.getElementById('rd-file');
  const elPreview = document.getElementById('rd-preview');
  const elEmpty   = document.getElementById('rd-empty');
  const elFrame   = document.getElementById('rd-frame');
  const elResult  = document.getElementById('rd-result');
  const elText    = document.getElementById('rd-text');
  const elCopy    = document.getElementById('rd-copy');
  const elOpen    = document.getElementById('rd-open');
  const elUrlWarn = document.getElementById('rd-url-warn');
  const elError   = document.getElementById('rd-error');

  const MAX_BYTES = 10 * 1024 * 1024;   // 10MB
  // 大きすぎる画像はデコードが遅くなるため縮小する上限
  const MAX_EDGE  = 1600;

  function showError(msg) {
    elError.textContent = msg;
    elError.hidden = false;
  }
  function clearError() {
    elError.hidden = true;
    elError.textContent = '';
  }

  function reset() {
    elResult.hidden = true;
    elOpen.hidden = true;
    elUrlWarn.hidden = true;
    elText.textContent = '';
  }

  // 画像を canvas に描いて ImageData を得る。大きい画像は縮小する
  function toImageData(img) {
    let w = img.naturalWidth, h = img.naturalHeight;
    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }

  // 反転したQR（白地に黒の逆）も拾えるよう2通り試す
  function decode(imageData) {
    const opts = [
      { inversionAttempts: 'dontInvert' },
      { inversionAttempts: 'attemptBoth' },
    ];
    for (const o of opts) {
      const r = jsQR(imageData.data, imageData.width, imageData.height, o);
      if (r && r.data) return r.data;
    }
    return null;
  }

  // 読み取った内容が「開いてよいURL」か判定する。
  // javascript: や data: を弾き、http/https のみリンク化の対象にする
  function safeUrl(text) {
    let u;
    try { u = new URL(text); } catch (e) { return null; }
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u : null;
  }

  function render(text) {
    // textContent で入れるため HTML として解釈されない（XSS対策）
    elText.textContent = text;
    elResult.hidden = false;

    const u = safeUrl(text);
    if (u) {
      elOpen.href = u.href;
      elOpen.hidden = false;
      elUrlWarn.hidden = false;
    } else {
      elOpen.hidden = true;
      elOpen.removeAttribute('href');
      elUrlWarn.hidden = true;
    }
    if (window.trackQR) trackQR('qr_decode', { tool: 'qr-reader', result: u ? 'url' : 'text' });
  }

  function handleFile(file) {
    clearError();
    reset();

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('画像ファイルを選んでください（PNG / JPEG / GIF / WebP）');
      return;
    }
    if (file.size > MAX_BYTES) {
      showError('画像が大きすぎます。10MB以下のファイルを選んでください。');
      return;
    }

    const fr = new FileReader();
    fr.onerror = () => showError('画像を読み込めませんでした。別のファイルでお試しください。');
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => showError('画像を読み込めませんでした。ファイルが壊れている可能性があります。');
      img.onload = () => {
        // 元画像をプレビュー表示（blob: は本番CSPで不許可のため data: を使う）
        elPreview.src = fr.result;
        elPreview.hidden = false;
        elEmpty.style.display = 'none';
        elFrame.classList.add('has-qr');

        let text = null;
        try {
          text = decode(toImageData(img));
        } catch (e) {
          showError('画像の解析に失敗しました。別の画像でお試しください。');
          return;
        }

        if (text) {
          render(text);
        } else {
          showError('QRコードを読み取れませんでした。ピントが合った、QR全体が写っている画像でお試しください。');
        }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  // ファイル選択
  elDrop.addEventListener('click', () => elFile.click());
  elDrop.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elFile.click(); }
  });
  elFile.addEventListener('change', () => handleFile(elFile.files[0]));

  // ドラッグ＆ドロップ
  ['dragenter', 'dragover'].forEach(ev => {
    elDrop.addEventListener(ev, e => { e.preventDefault(); elDrop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    elDrop.addEventListener(ev, e => { e.preventDefault(); elDrop.classList.remove('is-over'); });
  });
  elDrop.addEventListener('drop', e => {
    if (e.dataTransfer && e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  // クリップボードから貼り付け
  document.addEventListener('paste', e => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const it of items) {
      if (it.type.startsWith('image/')) { handleFile(it.getAsFile()); break; }
    }
  });

  // コピー
  elCopy.addEventListener('click', () => {
    const text = elText.textContent;
    if (!text) return;
    const done = () => {
      const orig = elCopy.textContent;
      elCopy.textContent = 'コピーしました';
      setTimeout(() => { elCopy.textContent = orig; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  });

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 失敗時は何もしない */ }
    document.body.removeChild(ta);
  }
})();

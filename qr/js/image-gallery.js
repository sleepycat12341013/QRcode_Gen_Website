'use strict';

// ─── image-gallery.html: フレーム（枠＋CTA文字）付きQR ──────────────────
(function () {
  const elContent = document.getElementById('ig-content');
  if (!elContent) return;   // 他ページでは動かさない

  const elCanvas = document.getElementById('ig-canvas');
  const elFg     = document.getElementById('ig-fg');
  const elText   = document.getElementById('ig-text');
  const elGrid   = document.getElementById('ig-grid');
  const elWarn   = document.getElementById('ig-warn');
  const btnPng   = document.getElementById('ig-download-png');
  const btnSvg   = document.getElementById('ig-download-svg');

  const PREVIEW = 260;
  const HIRES   = 1024;

  const FRAMES = [
    { key: 'none',   label: 'なし' },
    { key: 'bottom', label: '下ラベル' },
    { key: 'top',    label: '上ラベル' },
    { key: 'border', label: '枠＋ラベル' },
  ];
  let selected = 'bottom';

  const content = () => elContent.value.trim();

  // ── QR画像（qr-code-styling）を高解像度で1枚作ってキャッシュ ──
  function qrOptions() {
    return {
      width: HIRES, height: HIRES, type: 'canvas',
      data: content() || ' ',
      margin: 24,
      qrOptions: { errorCorrectionLevel: 'M' },
      dotsOptions:          { color: elFg.value, type: 'square' },
      cornersSquareOptions: { color: elFg.value, type: 'square' },
      backgroundOptions:    { color: '#ffffff' },
    };
  }
  const qr = new QRCodeStyling(qrOptions());
  let qrImg = null;
  // blob: URL は本番CSP(img-src)で不許可のため data: URL で読み込む
  function blobToImage(blob) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = fr.result;
      };
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }
  async function regen() {
    qr.update(qrOptions());
    qrImg = await blobToImage(await qr.getRawData('png'));
  }

  // ── フレーム描画 ──
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function layout(key, S) {
    const band = Math.round(S * 0.2);
    if (key === 'top')    return { w: S, h: S + band, qr: { x: 0, y: band, s: S }, band: { x: 0, y: 0, w: S, h: band } };
    if (key === 'bottom') return { w: S, h: S + band, qr: { x: 0, y: 0, s: S }, band: { x: 0, y: S, w: S, h: band } };
    if (key === 'border') {
      const p = Math.round(S * 0.05);
      return { w: S + 2 * p, h: S + 2 * p + band, qr: { x: p, y: p, s: S }, band: { x: p, y: S + p, w: S, h: band }, border: true };
    }
    return { w: S, h: S, qr: { x: 0, y: 0, s: S } };   // none
  }
  // qrSource: Image を渡すと本番描画、null ならサムネ用のグレー矩形
  function drawComposite(canvas, key, S, color, text, qrSource) {
    const L = layout(key, S);
    canvas.width = L.w; canvas.height = L.h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, L.w, L.h);
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 0, 0, L.w, L.h, Math.round(S * 0.04)); ctx.fill();
    if (qrSource) ctx.drawImage(qrSource, L.qr.x, L.qr.y, L.qr.s, L.qr.s);
    else { ctx.fillStyle = '#d1d5db'; const m = S * 0.1; ctx.fillRect(L.qr.x + m, L.qr.y + m, L.qr.s - 2 * m, L.qr.s - 2 * m); }
    if (L.border) {
      const lw = Math.max(2, Math.round(S * 0.022));
      ctx.strokeStyle = color; ctx.lineWidth = lw;
      roundRect(ctx, lw, lw, L.w - 2 * lw, L.h - 2 * lw, Math.round(S * 0.045)); ctx.stroke();
    }
    if (L.band) {
      ctx.fillStyle = color;
      roundRect(ctx, L.band.x, L.band.y, L.band.w, L.band.h, Math.round(S * 0.03)); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 ' + Math.round(S * 0.088) + 'px "Noto Sans JP", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text || '', L.band.x + L.band.w / 2, L.band.y + L.band.h / 2 + 1);
    }
  }
  function drawPlaceholder() {
    elCanvas.width = PREVIEW; elCanvas.height = PREVIEW;
    const ctx = elCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, PREVIEW, PREVIEW);
    ctx.fillStyle = '#9ca3af'; ctx.font = '13px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('内容を入力すると表示されます', PREVIEW / 2, PREVIEW / 2);
  }

  // 相対輝度（WCAG）。白背景に対して明るすぎる色は読み取れないため警告
  function relLuminance(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) return 0;
    const n = parseInt(m[1], 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  // ── サムネ付きフレームボタン ──
  const thumbs = [];
  FRAMES.forEach(fr => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ig-btn' + (fr.key === selected ? ' ig-btn--active' : '');
    btn.setAttribute('aria-pressed', fr.key === selected ? 'true' : 'false');
    const c = document.createElement('canvas');
    const span = document.createElement('span');
    span.textContent = fr.label;
    btn.appendChild(c); btn.appendChild(span);
    btn.addEventListener('click', () => {
      selected = fr.key;
      thumbs.forEach(t => {
        const on = t.fr.key === selected;
        t.btn.classList.toggle('ig-btn--active', on);
        t.btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render(false);
      if (window.trackQR) trackQR('qr_customize', { tool: 'image-gallery', frame: fr.key });
    });
    elGrid.appendChild(btn);
    thumbs.push({ fr, canvas: c, btn });
  });
  function redrawThumbs() {
    thumbs.forEach(t => drawComposite(t.canvas, t.fr.key, 58, elFg.value, elText.value, null));
  }

  async function render(doRegen) {
    const has = content().length > 0;
    btnPng.disabled = !has;
    const ratio = (1 + 0.05) / (relLuminance(elFg.value) + 0.05);
    elWarn.hidden = ratio >= 3;
    redrawThumbs();
    if (!has) { drawPlaceholder(); return; }
    if (doRegen || !qrImg) await regen();
    drawComposite(elCanvas, selected, PREVIEW, elFg.value, elText.value, qrImg);
  }

  elContent.addEventListener('input', () => render(true));
  elFg.addEventListener('input', () => render(true));
  elText.addEventListener('input', () => render(false));

  // ダウンロードは印刷用途のため 1024px QR で合成して保存
  btnPng.addEventListener('click', () => {
    if (!content() || !qrImg) return;
    const off = document.createElement('canvas');
    drawComposite(off, selected, HIRES, elFg.value, elText.value, qrImg);
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.download = `qrcode_${ts}.png`;
    a.href = off.toDataURL('image/png');
    a.click();
    if (window.trackQR) trackQR('qr_download', { tool: 'image-gallery', format: 'png', frame: selected });
  });

  if (btnSvg) btnSvg.addEventListener('click', () => { if (window.trackQR) trackQR('pro_gate_click', { tool: 'image-gallery', feature: 'svg_download' });  window.location.href = 'pricing.html'; });

  render(true);
})();

'use strict';

// ─── icon-library.html: QR中央にアイコンを埋め込む ─────────────────────
(function () {
  const elContent = document.getElementById('ico-content');
  if (!elContent) return;   // 他ページでは動かさない

  const elQr    = document.getElementById('ico-qr');
  const elEmpty = document.getElementById('ico-empty');
  const elFrame = document.getElementById('ico-frame');
  const elFg    = document.getElementById('ico-fg');
  const elGrid  = document.getElementById('ico-grid');
  const elWarn  = document.getElementById('ico-warn');
  const btnPng  = document.getElementById('ico-download-png');
  const btnSvg  = document.getElementById('ico-download-svg');

  const PREVIEW = 260;
  const HIRES   = 1024;

  // 自作アイコン（{C} は描画時に色へ置換）。24x24 viewBox
  const ICONS = [
    { key: 'none', label: 'なし', body: null },
    { key: 'wifi', label: 'WiFi', body: '<path d="M2.5 8.5a14 14 0 0 1 19 0" fill="none" stroke="{C}"/><path d="M5.5 11.8a9.5 9.5 0 0 1 13 0" fill="none" stroke="{C}"/><path d="M8.5 15a5 5 0 0 1 7 0" fill="none" stroke="{C}"/><circle cx="12" cy="18.5" r="1.3" fill="{C}" stroke="none"/>' },
    { key: 'link', label: 'リンク', body: '<path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" fill="none" stroke="{C}"/><path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" fill="none" stroke="{C}"/>' },
    { key: 'store', label: 'ショップ', body: '<path d="M4 10l1.2-4.5h13.6L20 10" fill="none" stroke="{C}"/><path d="M4.2 10a2 2 0 0 0 3.9 0 2 2 0 0 0 3.9 0 2 2 0 0 0 3.9 0" fill="none" stroke="{C}"/><path d="M5.5 11.5V19h13v-7.5" fill="none" stroke="{C}"/><path d="M10 19v-4h4v4" fill="none" stroke="{C}"/>' },
    { key: 'cup', label: 'カフェ', body: '<path d="M5 8h11v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="none" stroke="{C}"/><path d="M16 9.5h2a2 2 0 0 1 0 4h-2" fill="none" stroke="{C}"/><path d="M8 3.5v1.8M11.5 3.5v1.8" fill="none" stroke="{C}"/>' },
    { key: 'phone', label: '電話', body: '<path d="M6.5 3.5h3.2l1.3 4-2 1.2a10.5 10.5 0 0 0 4.8 4.8l1.2-2 4 1.3v3.2a1.8 1.8 0 0 1-1.9 1.8A15.5 15.5 0 0 1 4.7 5.4 1.8 1.8 0 0 1 6.5 3.5z" fill="{C}" stroke="none"/>' },
    { key: 'mail', label: 'メール', body: '<rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="{C}"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5" fill="none" stroke="{C}"/>' },
    { key: 'pin', label: '場所', body: '<path d="M12 20.5c3.5-3.8 6-6.9 6-10a6 6 0 0 0-12 0c0 3.1 2.5 6.2 6 10z" fill="none" stroke="{C}"/><circle cx="12" cy="10.5" r="2.3" fill="none" stroke="{C}"/>' },
    { key: 'heart', label: 'ハート', body: '<path d="M12 19.5C6.5 15.5 4 12.6 4 9.6A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 8 2.6c0 3-2.5 5.9-8 9.9z" fill="{C}" stroke="none"/>' },
  ];

  let selected = null;   // 選択中アイコンの body（nullで埋め込みなし）

  function svgMarkup(body, color, size) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      body.replace(/\{C\}/g, color) + '</svg>';
  }
  function iconDataUri(body, color) {
    return 'data:image/svg+xml,' + encodeURIComponent(svgMarkup(body, color, 64));
  }

  function options(size) {
    const opt = {
      width: size, height: size, type: 'canvas',
      data: elContent.value.trim() || ' ',
      margin: 8,
      qrOptions: { errorCorrectionLevel: selected ? 'H' : 'M' },
      dotsOptions:          { color: elFg.value, type: 'square' },
      cornersSquareOptions: { color: elFg.value, type: 'square' },
      backgroundOptions:    { color: '#ffffff' },
    };
    if (selected) {
      opt.image = iconDataUri(selected, elFg.value);
      opt.imageOptions = { crossOrigin: 'anonymous', imageSize: 0.28, margin: 6, hideBackgroundDots: true };
    }
    return opt;
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

  let qr = null;
  function render() {
    const has = elContent.value.trim().length > 0;
    elEmpty.style.display = has ? 'none' : '';
    elFrame.classList.toggle('has-qr', has);
    btnPng.disabled = !has;
    if (!has) { elQr.innerHTML = ''; qr = null; return; }
    if (!qr) { qr = new QRCodeStyling(options(PREVIEW)); qr.append(elQr); }
    else     { qr.update(options(PREVIEW)); }
    // 白背景に対するコントラスト比が低い（≒明るい色）と警告
    const ratio = (1 + 0.05) / (relLuminance(elFg.value) + 0.05);
    elWarn.hidden = ratio >= 3;
  }

  // アイコングリッドを構築
  ICONS.forEach((ico, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ico-btn' + (i === 0 ? ' ico-btn--none ico-btn--active' : '');
    btn.setAttribute('aria-label', ico.label);
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.innerHTML = ico.body ? svgMarkup(ico.body, 'currentColor', 26) : 'なし';
    btn.addEventListener('click', () => {
      selected = ico.body;
      elGrid.querySelectorAll('.ico-btn').forEach(b => {
        b.classList.remove('ico-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('ico-btn--active');
      btn.setAttribute('aria-pressed', 'true');
      render();
      if (window.trackQR) trackQR('qr_customize', { tool: 'icon-library', icon: ico.key });
    });
    elGrid.appendChild(btn);
  });

  [elContent, elFg].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  // ダウンロードは印刷用途のため 1024px で再生成して保存
  btnPng.addEventListener('click', () => {
    if (!elContent.value.trim()) return;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    new QRCodeStyling(options(HIRES)).download({ name: `qrcode_${ts}`, extension: 'png' });
    if (window.trackQR) trackQR('qr_download', { tool: 'icon-library', format: 'png', has_icon: selected ? 'yes' : 'no' });
  });

  if (btnSvg) btnSvg.addEventListener('click', () => { if (window.trackQR) trackQR('pro_gate_click', { tool: 'icon-library', feature: 'svg_download' });  window.location.href = 'pricing.html'; });

  render();
})();

'use strict';

// ─── design-edit.html: qr-code-styling によるデザイン編集 ──────────────
(function () {
  const elContent = document.getElementById('de-content');
  if (!elContent) return;   // 他ページでは動かさない

  const elQr     = document.getElementById('de-qr');
  const elEmpty  = document.getElementById('de-empty');
  const elFrame  = document.getElementById('de-frame');
  const elFg     = document.getElementById('de-fg');
  const elBg     = document.getElementById('de-bg');
  const elDot    = document.getElementById('de-dot');
  const elCorner = document.getElementById('de-corner');
  const elWarn   = document.getElementById('de-warn');
  const btnPng   = document.getElementById('de-download-png');
  const btnSvg   = document.getElementById('de-download-svg');

  const PREVIEW  = 260;
  const HIRES    = 1024;
  let qr = null;

  function options(size) {
    return {
      width: size,
      height: size,
      type: 'canvas',
      data: elContent.value.trim() || ' ',
      margin: 8,
      qrOptions: { errorCorrectionLevel: 'M' },
      dotsOptions:          { color: elFg.value, type: elDot.value },
      cornersSquareOptions: { color: elFg.value, type: elCorner.value },
      backgroundOptions:    { color: elBg.value },
    };
  }

  // 相対輝度（WCAG）。明るすぎる前景色はスキャン性を損なうため警告
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

  function render() {
    const has = elContent.value.trim().length > 0;
    elEmpty.style.display = has ? 'none' : '';
    elFrame.classList.toggle('has-qr', has);
    btnPng.disabled = !has;
    if (!has) { elQr.innerHTML = ''; qr = null; return; }
    if (!qr) { qr = new QRCodeStyling(options(PREVIEW)); qr.append(elQr); }
    else     { qr.update(options(PREVIEW)); }
    elWarn.hidden = relLuminance(elFg.value) <= 0.5;
  }

  [elContent, elFg, elBg, elDot, elCorner].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  // ダウンロードは印刷用途のため 1024px で再生成して保存
  btnPng.addEventListener('click', () => {
    if (!elContent.value.trim()) return;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    new QRCodeStyling(options(HIRES)).download({ name: `qrcode_${ts}`, extension: 'png' });
  });

  if (btnSvg) btnSvg.addEventListener('click', () => { window.location.href = 'pricing.html'; });

  render();
})();

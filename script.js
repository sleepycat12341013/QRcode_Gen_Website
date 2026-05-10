'use strict';

// ── QR URL generation (index.html only) ──
const elInput = document.getElementById('input-url');
if (elInput) {
  const elClearBtn  = document.getElementById('btn-clear');
  const elQrcode    = document.getElementById('qrcode');
  const elQrEmpty   = document.getElementById('qr-empty');
  const elQrFrame   = document.getElementById('qr-frame');
  const elUrlLabel  = document.getElementById('qr-url-label');
  const elErrorMsg  = document.getElementById('error-msg');
  const btnGenerate = document.getElementById('btn-generate');
  const btnDownload = document.getElementById('btn-download');
  const swatches    = document.querySelectorAll('.swatch:not(.swatch--custom)');
  const customColor = document.getElementById('custom-color');

  let qrInstance = null;
  let currentColor = '#B91C1C';

  elInput.addEventListener('input', () => {
    elClearBtn.hidden = elInput.value.length === 0;
    clearError();
  });

  elClearBtn.addEventListener('click', () => {
    elInput.value = '';
    elClearBtn.hidden = true;
    elInput.focus();
    clearQR();
    clearError();
  });

  btnGenerate.addEventListener('click', generate);
  elInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') generate(); });

  function generate() {
    const raw = elInput.value.trim();
    clearError();
    if (!raw) { showError('URLを入力してください'); return; }
    const err = validate(raw);
    if (err) { showError(err); clearQR(); return; }
    renderQR(raw);
  }

  function validate(val) {
    try { new URL(val); return null; }
    catch { return 'URLの形式が正しくありません（例: https://example.com）'; }
  }

  function renderQR(text) {
    const SIZE = 180;
    if (qrInstance) { qrInstance.clear(); elQrcode.innerHTML = ''; qrInstance = null; }
    qrInstance = new QRCode(elQrcode, {
      text, width: SIZE, height: SIZE,
      colorDark: currentColor, colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
    elQrEmpty.hidden = true;
    elQrFrame.classList.add('has-qr');
    elUrlLabel.textContent = text;
    elUrlLabel.hidden = false;
    btnDownload.disabled = false;
  }

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      selectColor(btn.dataset.color);
      swatches.forEach(s => s.classList.remove('swatch--active'));
      document.querySelector('.swatch--custom').classList.remove('swatch--active');
      btn.classList.add('swatch--active');
    });
  });

  customColor.addEventListener('input', () => {
    selectColor(customColor.value);
    swatches.forEach(s => s.classList.remove('swatch--active'));
    document.querySelector('.swatch--custom').classList.add('swatch--active');
  });

  function selectColor(color) {
    currentColor = color;
    const currentUrl = elUrlLabel.textContent;
    if (currentUrl && !elUrlLabel.hidden) renderQR(currentUrl);
  }

  btnDownload.addEventListener('click', () => {
    setTimeout(() => {
      const canvas = elQrcode.querySelector('canvas');
      const img    = elQrcode.querySelector('img');
      if (canvas) {
        save(canvas);
      } else if (img) {
        const tmp = document.createElement('canvas');
        tmp.width  = img.naturalWidth  || 180;
        tmp.height = img.naturalHeight || 180;
        tmp.getContext('2d').drawImage(img, 0, 0);
        save(tmp);
      }
    }, 100);
  });

  function save(canvas) {
    const ts   = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const link = document.createElement('a');
    link.download = `qrcode_${ts}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function clearQR() {
    if (qrInstance) { qrInstance.clear(); qrInstance = null; }
    elQrcode.innerHTML = '';
    elQrEmpty.hidden = false;
    elQrFrame.classList.remove('has-qr');
    elUrlLabel.hidden = true;
    btnDownload.disabled = true;
  }

  function showError(msg) { elErrorMsg.textContent = msg; elErrorMsg.hidden = false; }
  function clearError() { elErrorMsg.hidden = true; elErrorMsg.textContent = ''; }
}

// ── Prevent mock links from scrolling to top ──
document.querySelectorAll('a[href="#"]').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

// ── Mobile hamburger ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const backdrop  = document.querySelector('.mobile-nav-backdrop');
const closeBtn  = document.querySelector('.mobile-nav-close');

function openNav() {
  mobileNav.classList.add('is-open');
  backdrop.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  mobileNav.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openNav);
closeBtn.addEventListener('click', closeNav);
backdrop.addEventListener('click', closeNav);

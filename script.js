'use strict';

// ─── index.html: タブ切り替え + QR生成 ─────────────────────────────
if (document.getElementById('panel-link')) {

  let activeTab    = 'link';
  let qrInstance   = null;
  let currentColor = '#B91C1C';
  let lastContent  = '';
  let lastLabel    = '';

  const elQrcode    = document.getElementById('qrcode');
  const elQrEmpty   = document.getElementById('qr-empty');
  const elQrFrame   = document.getElementById('qr-frame');
  const elUrlLabel  = document.getElementById('qr-url-label');
  const elErrorMsg  = document.getElementById('error-msg');
  const btnGenerate = document.getElementById('btn-generate');
  const btnDownload = document.getElementById('btn-download');
  const swatches    = document.querySelectorAll('.swatch:not(.swatch--custom)');
  const customColor = document.getElementById('custom-color');

  // タブ切り替え
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === activeTab) return;
      switchTab(btn.dataset.tab);
    });
  });

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('tab-btn--active');
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = true; });
    document.getElementById(`panel-${tab}`).hidden = false;
    btnGenerate.disabled = (tab === 'file');
    clearQR();
    clearError();
  }

  // リンクパネル
  const elUrlInput = document.getElementById('input-url');
  const elClearUrl = document.getElementById('btn-clear-url');
  elUrlInput.addEventListener('input', () => { elClearUrl.hidden = !elUrlInput.value; clearError(); });
  elUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
  elClearUrl.addEventListener('click', () => {
    elUrlInput.value = ''; elClearUrl.hidden = true; elUrlInput.focus(); clearQR(); clearError();
  });

  // テキストパネル
  const elTextInput = document.getElementById('input-text');
  const elCharCount = document.getElementById('char-count');
  const MAX_CHARS   = 500;
  elTextInput.addEventListener('input', () => {
    const len = elTextInput.value.length;
    elCharCount.textContent = `${len} / ${MAX_CHARS}`;
    elCharCount.classList.toggle('over', len > MAX_CHARS);
    clearError();
  });

  // 動画パネル
  const elVideoInput = document.getElementById('input-video');
  const elClearVideo = document.getElementById('btn-clear-video');
  elVideoInput.addEventListener('input', () => { elClearVideo.hidden = !elVideoInput.value; clearError(); });
  elVideoInput.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
  elClearVideo.addEventListener('click', () => {
    elVideoInput.value = ''; elClearVideo.hidden = true; elVideoInput.focus(); clearQR(); clearError();
  });

  // 生成ボタン
  btnGenerate.addEventListener('click', generate);

  function generate() {
    clearError();
    let content = '', label = '';

    if (activeTab === 'link') {
      content = elUrlInput.value.trim();
      if (!content) { showError('URLを入力してください'); return; }
      try { new URL(content); } catch { showError('URLの形式が正しくありません（例: https://example.com）'); return; }
      label = content;

    } else if (activeTab === 'text') {
      content = elTextInput.value.trim();
      if (!content) { showError('テキストを入力してください'); return; }
      if (content.length > MAX_CHARS) { showError(`${MAX_CHARS}文字以内で入力してください`); return; }
      label = content.length > 32 ? content.slice(0, 32) + '…' : content;

    } else if (activeTab === 'contact') {
      const name  = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const org   = document.getElementById('contact-org').value.trim();
      const url   = document.getElementById('contact-url').value.trim();
      if (!name && !phone && !email) {
        showError('氏名・電話番号・メールアドレスのいずれかを入力してください'); return;
      }
      let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
      if (name)  vcard += `FN:${name}\n`;
      if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
      if (email) vcard += `EMAIL:${email}\n`;
      if (org)   vcard += `ORG:${org}\n`;
      if (url)   vcard += `URL:${url}\n`;
      vcard += 'END:VCARD';
      content = vcard;
      label = name ? `連絡先: ${name}` : '連絡先QR';

    } else if (activeTab === 'video') {
      content = elVideoInput.value.trim();
      if (!content) { showError('動画URLを入力してください'); return; }
      try { new URL(content); } catch { showError('URLの形式が正しくありません'); return; }
      label = content;
    }

    if (content) renderQR(content, label);
  }

  function renderQR(text, label) {
    lastContent = text;
    lastLabel   = label || text;
    const SIZE  = 180;
    if (qrInstance) { qrInstance.clear(); elQrcode.innerHTML = ''; qrInstance = null; }
    qrInstance = new QRCode(elQrcode, {
      text, width: SIZE, height: SIZE,
      colorDark: currentColor, colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
    elQrEmpty.hidden = false;
    elQrEmpty.style.display = 'none';
    elQrFrame.classList.add('has-qr');
    const display = lastLabel.length > 40 ? lastLabel.slice(0, 40) + '…' : lastLabel;
    elUrlLabel.textContent = display.replace(/[\n\r]/g, ' ');
    elUrlLabel.hidden = false;
    btnDownload.disabled = false;
  }

  // カラー
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
    if (lastContent) renderQR(lastContent, lastLabel);
  }

  // ダウンロード
  btnDownload.addEventListener('click', () => {
    setTimeout(() => {
      const canvas = elQrcode.querySelector('canvas');
      const img    = elQrcode.querySelector('img');
      if (canvas) save(canvas);
      else if (img) {
        const tmp = document.createElement('canvas');
        tmp.width = img.naturalWidth || 180; tmp.height = img.naturalHeight || 180;
        tmp.getContext('2d').drawImage(img, 0, 0); save(tmp);
      }
    }, 100);
  });

  function save(canvas) {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const a  = document.createElement('a');
    a.download = `qrcode_${ts}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  function clearQR() {
    lastContent = '';
    if (qrInstance) { qrInstance.clear(); qrInstance = null; }
    elQrcode.innerHTML = '';
    elQrEmpty.hidden = false;
    elQrEmpty.style.display = '';
    elQrFrame.classList.remove('has-qr');
    elUrlLabel.hidden = true;
    btnDownload.disabled = true;
  }

  function showError(msg) { elErrorMsg.textContent = msg; elErrorMsg.hidden = false; }
  function clearError()   { elErrorMsg.hidden = true; elErrorMsg.textContent = ''; }
}

// ─── 全ページ共通: モバイルナビ ──────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const backdrop  = document.querySelector('.mobile-nav-backdrop');
const closeBtn  = document.querySelector('.mobile-nav-close');

if (hamburger) {
  const openNav  = () => { mobileNav.classList.add('is-open'); backdrop.classList.add('is-open'); hamburger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
  const closeNav = () => { mobileNav.classList.remove('is-open'); backdrop.classList.remove('is-open'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  hamburger.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
}

// href="#" のスクロール防止
document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

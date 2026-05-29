(function () {
    'use strict';
    const elTextarea    = document.getElementById('input-text');
    const elCharCount   = document.getElementById('char-count');
    const elUrlInput    = document.getElementById('input-url-tq');
    const panelLink     = document.getElementById('panel-link-tq');
    const panelText     = document.getElementById('panel-text-tq');
    const elQrcode      = document.getElementById('qrcode');
    const elQrEmpty     = document.getElementById('qr-empty');
    const elQrFrame     = document.getElementById('qr-frame');
    const elUrlLabel    = document.getElementById('qr-url-label');
    const elErrorMsg    = document.getElementById('error-msg');
    const btnGenerate   = document.getElementById('btn-generate');
    const btnDownload    = document.getElementById('btn-download');
    const btnDownloadSvg = document.getElementById('btn-download-svg');
    btnDownloadSvg.addEventListener('click', () => { window.location.href = 'pricing.html'; });
    const swatches      = document.querySelectorAll('.swatch:not(.swatch--custom)');
    const customColor   = document.getElementById('custom-color');
    const MAX = 500;

    let qrInstance   = null;
    let currentColor = '#B91C1C';
    let activeTab    = 'text';
    let lastContent  = '';

    // タブ切り替え
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab === activeTab || btn.disabled) return;
        activeTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('tab-btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('tab-btn--active');
        btn.setAttribute('aria-selected', 'true');
        panelLink.hidden = (tab !== 'link');
        panelText.hidden = (tab !== 'text');
        clearQR();
        clearError();
      });
    });

    elTextarea.addEventListener('input', () => {
      const len = elTextarea.value.length;
      elCharCount.textContent = `${len} / ${MAX}`;
      elCharCount.classList.toggle('over', len > MAX);
      clearError();
    });

    elUrlInput.addEventListener('input', clearError);
    elUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });

    btnGenerate.addEventListener('click', generate);

    function generate() {
      clearError();
      let content = '', label = '';
      if (activeTab === 'link') {
        content = elUrlInput.value.trim();
        if (!content) { showError('URLを入力してください'); return; }
        try { new URL(content); } catch { showError('URLの形式が正しくありません（例: https://example.com）'); return; }
        label = content;
      } else {
        content = elTextarea.value.trim();
        if (!content) { showError('テキストを入力してください'); return; }
        if (content.length > MAX) { showError(`${MAX}文字以内で入力してください`); return; }
        label = content.length > 32 ? content.slice(0, 32) + '…' : content;
      }
      renderQR(content, label);
    }

    function renderQR(text, label) {
      lastContent = text;
      const SIZE = 180;
      if (qrInstance) { qrInstance.clear(); elQrcode.innerHTML = ''; qrInstance = null; }
      qrInstance = new QRCode(elQrcode, {
        text, width: SIZE, height: SIZE,
        colorDark: currentColor, colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
      elQrEmpty.hidden = true;
      elQrFrame.classList.add('has-qr');
      const display = (label || text);
      elUrlLabel.textContent = display.length > 40 ? display.slice(0, 40) + '…' : display;
      elUrlLabel.hidden = false;
      btnDownload.disabled = false;
    }

    function clearQR() {
      lastContent = '';
      if (qrInstance) { qrInstance.clear(); qrInstance = null; }
      elQrcode.innerHTML = '';
      elQrEmpty.hidden = false;
      elQrFrame.classList.remove('has-qr');
      elUrlLabel.hidden = true;
      btnDownload.disabled = true;
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
      if (lastContent) renderQR(lastContent, lastContent);
    }

    btnDownload.addEventListener('click', () => {
      setTimeout(() => {
        const canvas = elQrcode.querySelector('canvas');
        const img    = elQrcode.querySelector('img');
        if (canvas) save(canvas);
        else if (img) {
          const tmp = document.createElement('canvas');
          tmp.width = img.naturalWidth || 180;
          tmp.height = img.naturalHeight || 180;
          tmp.getContext('2d').drawImage(img, 0, 0);
          save(tmp);
        }
      }, 100);
    });

    function save(canvas) {
      const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const link = document.createElement('a');
      link.download = `qrcode_${ts}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function showError(msg) { elErrorMsg.textContent = msg; elErrorMsg.hidden = false; }
    function clearError() { elErrorMsg.hidden = true; elErrorMsg.textContent = ''; }
  })();

'use strict';

(function () {
  const elDrop    = document.getElementById('drop');
  const elFile    = document.getElementById('file');
  const elErr     = document.getElementById('err');
  const elQuality = document.getElementById('quality');
  const elQualVal = document.getElementById('quality-val');
  const elMaxW    = document.getElementById('maxw');
  const elFormat  = document.getElementById('format');
  const elCard    = document.getElementById('result-card');
  const elSummary = document.getElementById('summary');
  const elList    = document.getElementById('list');
  const elDlAll   = document.getElementById('dl-all');
  const elClear   = document.getElementById('clear');

  const MAX_FILES = 50;
  const MAX_BYTES = 30 * 1024 * 1024;   // 1枚あたり30MB

  let results = [];   // { name, blobUrl(dataURL), before, after, w, h }

  function showError(msg) { elErr.textContent = msg; elErr.hidden = false; }
  function clearError()   { elErr.hidden = true; elErr.textContent = ''; }

  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  // 保存形式に応じた拡張子へ差し替える
  function renameExt(name, mime) {
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    return name.replace(/\.[^.]+$/, '') + '_compressed.' + ext;
  }

  function readAsDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => rej(new Error('read'));
      fr.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error('decode'));
      im.src = src;
    });
  }

  // canvas で縮小・再エンコードする。元より大きくは引き伸ばさない
  function compress(img, maxW, mime, quality) {
    let w = img.naturalWidth, h = img.naturalHeight;
    if (maxW > 0 && w > maxW) {
      h = Math.round(h * (maxW / w));
      w = maxW;
    }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    // JPEG は透過を扱えないため、背景を白で埋めてから描く
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    // PNG は quality を解釈しない
    const dataUrl = mime === 'image/png'
      ? c.toDataURL('image/png')
      : c.toDataURL(mime, quality);
    return { dataUrl, w, h };
  }

  function dataUrlBytes(dataUrl) {
    const i = dataUrl.indexOf(',');
    const b64 = dataUrl.slice(i + 1);
    // base64 は元データの約4/3。末尾のパディング分を差し引く
    const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
    return Math.floor(b64.length * 3 / 4) - pad;
  }

  function render() {
    elList.innerHTML = '';
    if (!results.length) {
      elCard.hidden = true;
      return;
    }
    elCard.hidden = false;

    let before = 0, after = 0;
    results.forEach(r => { before += r.before; after += r.after; });
    const cut = before > 0 ? Math.round((1 - after / before) * 100) : 0;

    elSummary.textContent = cut > 0
      ? `${results.length}枚を処理しました。合計 ${fmtBytes(before)} → ${fmtBytes(after)}（${cut}% 削減）`
      : `${results.length}枚を処理しました。合計 ${fmtBytes(before)} → ${fmtBytes(after)}`;

    results.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'item';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.src = r.dataUrl;
      img.alt = '';

      const meta = document.createElement('div');
      meta.className = 'meta';
      const name = document.createElement('p');
      name.className = 'name';
      name.textContent = r.name;          // textContent なので HTML として解釈されない
      const size = document.createElement('p');
      size.className = 'size';
      const diff = Math.round((1 - r.after / r.before) * 100);
      const badge = diff > 0
        ? `<span class="cut">${diff}% 削減</span>`
        : `<span class="grow">${Math.abs(diff)}% 増加</span>`;
      size.innerHTML = `${fmtBytes(r.before)} → ${fmtBytes(r.after)}　${badge}　${r.w}×${r.h}px`;
      meta.appendChild(name);
      meta.appendChild(size);

      const a = document.createElement('a');
      a.className = 'btn btn-sm';
      a.textContent = '保存';
      a.href = r.dataUrl;
      a.download = r.name;

      item.appendChild(img);
      item.appendChild(meta);
      item.appendChild(a);
      elList.appendChild(item);
    });
  }

  async function handleFiles(files) {
    clearError();
    const list = Array.from(files).filter(f => /^image\/(jpeg|png|webp)$/.test(f.type));

    if (!list.length) {
      showError('対応している画像を選んでください（JPEG / PNG / WebP）');
      return;
    }
    if (list.length > MAX_FILES) {
      showError(`一度に処理できるのは${MAX_FILES}枚までです`);
      return;
    }

    const mime    = elFormat.value;
    const maxW    = parseInt(elMaxW.value, 10);
    const quality = parseInt(elQuality.value, 10) / 100;

    results = [];
    let skipped = 0;

    for (const f of list) {
      if (f.size > MAX_BYTES) { skipped++; continue; }
      try {
        const src = await readAsDataURL(f);
        const img = await loadImage(src);
        const out = compress(img, maxW, mime, quality);
        results.push({
          name: renameExt(f.name, mime),
          dataUrl: out.dataUrl,
          before: f.size,
          after: dataUrlBytes(out.dataUrl),
          w: out.w,
          h: out.h,
        });
      } catch (e) {
        skipped++;
      }
    }

    if (!results.length) {
      showError('画像を処理できませんでした。別のファイルでお試しください。');
      return;
    }
    if (skipped > 0) {
      showError(`${skipped}枚は処理できませんでした（サイズが大きすぎるか、読み込みに失敗しました）`);
    }

    render();
    if (window.track) {
      track('image_compress', { count: results.length, format: mime, max_width: maxW });
    }
  }

  // 入力
  elDrop.addEventListener('click', () => elFile.click());
  elDrop.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elFile.click(); }
  });
  elFile.addEventListener('change', () => {
    if (elFile.files.length) handleFiles(elFile.files);
    elFile.value = '';   // 同じファイルを選び直せるようにする
  });

  ['dragenter', 'dragover'].forEach(ev => {
    elDrop.addEventListener(ev, e => { e.preventDefault(); elDrop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    elDrop.addEventListener(ev, e => { e.preventDefault(); elDrop.classList.remove('over'); });
  });
  elDrop.addEventListener('drop', e => {
    if (e.dataTransfer && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  });

  document.addEventListener('paste', e => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const files = [];
    for (const it of items) {
      if (it.type.startsWith('image/')) {
        const f = it.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) handleFiles(files);
  });

  // 設定変更で再処理はせず、次回の処理に反映する
  elQuality.addEventListener('input', () => {
    elQualVal.textContent = elQuality.value + '%';
  });

  // 一括保存。ブラウザが連続ダウンロードを抑制するため少しずつ間隔を空ける
  elDlAll.addEventListener('click', () => {
    if (!results.length) return;
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = r.dataUrl;
        a.download = r.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 300);
    });
    if (window.track) track('image_download_all', { count: results.length });
  });

  elClear.addEventListener('click', () => {
    results = [];
    render();
    clearError();
  });
})();

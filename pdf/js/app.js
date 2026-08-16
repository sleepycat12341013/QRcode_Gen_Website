(function () {
  'use strict';

  const MAX_FILES  = 20;
  const MAX_BYTES  = 100 * 1024 * 1024;
  const MAX_PAGES  = 300;
  const THUMB_W    = 150;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';

  const $ = (id) => document.getElementById(id);
  const elDrop = $('drop'), elFile = $('file'), elErr = $('err'), elLoading = $('loading');
  const elPagesCard = $('pages-card'), elPages = $('pages'), elSummary = $('summary');
  const elOutCard = $('out-card'), elDone = $('done'), elMerge = $('merge'), elFilename = $('filename');

  // 読み込んだPDFの実体。pages[] がこの配列を index で参照する
  const docs = [];
  // 表示・出力順そのもの。並べ替えはこの配列の順序を入れ替える
  let pages = [];

  function showError(msg) {
    elErr.textContent = msg;
    elErr.hidden = false;
  }
  function clearError() {
    elErr.hidden = true;
    elErr.textContent = '';
  }

  function shortName(name) {
    return name.length > 22 ? name.slice(0, 20) + '…' : name;
  }

  async function addFiles(fileList) {
    clearError();
    elDone.hidden = true;

    const picked = Array.from(fileList).filter(f =>
      f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
    );
    if (!picked.length) {
      showError('PDFファイルを選んでください。');
      return;
    }

    if (docs.length + picked.length > MAX_FILES) {
      showError('一度に扱えるのは' + MAX_FILES + 'ファイルまでです。');
      return;
    }

    elLoading.hidden = false;
    const skipped = [];

    for (const file of picked) {
      if (file.size > MAX_BYTES) {
        skipped.push(file.name + '（100MBを超えています）');
        continue;
      }
      try {
        const buf = await file.arrayBuffer();
        // pdf-lib と pdf.js は同じ ArrayBuffer を破壊的に扱うことがあるため別々に渡す
        const libDoc = await PDFLib.PDFDocument.load(buf.slice(0), { ignoreEncryption: false });
        const viewDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;

        const count = libDoc.getPageCount();
        if (pages.length + count > MAX_PAGES) {
          skipped.push(file.name + '（合計' + MAX_PAGES + 'ページを超えます）');
          viewDoc.destroy();
          continue;
        }

        const docIndex = docs.length;
        docs.push({ lib: libDoc, view: viewDoc, name: file.name });

        for (let i = 0; i < count; i++) {
          pages.push({ doc: docIndex, page: i, excluded: false });
        }
      } catch (e) {
        const enc = /encrypt|password/i.test(String(e && e.message));
        skipped.push(file.name + (enc ? '（パスワード保護されています）' : '（読み込めませんでした）'));
      }
      await new Promise(r => setTimeout(r, 0));
    }

    elLoading.hidden = true;
    if (skipped.length) showError('次のファイルは使えませんでした：' + skipped.join(' / '));

    if (!pages.length) return;

    elPagesCard.hidden = false;
    elOutCard.hidden = false;
    render();
    renderThumbs();
    if (window.track) window.track('pdf_files_added', { files: picked.length, pages: pages.length });
  }

  function render() {
    elPages.innerHTML = '';
    pages.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'page' + (p.excluded ? ' excluded' : '');
      el.draggable = true;
      el.dataset.idx = String(idx);

      const ph = document.createElement('div');
      ph.className = 'page-ph';
      ph.textContent = '…';
      el.appendChild(ph);

      const meta = document.createElement('div');
      meta.className = 'page-meta';

      const no = document.createElement('span');
      no.className = 'page-no';
      no.textContent = (idx + 1) + 'ページ目';

      const x = document.createElement('button');
      x.className = 'page-x';
      x.type = 'button';
      x.textContent = p.excluded ? '戻す' : '除外';
      x.addEventListener('click', (ev) => {
        ev.stopPropagation();
        p.excluded = !p.excluded;
        render();
        renderThumbs();
      });

      meta.appendChild(no);
      meta.appendChild(x);
      el.appendChild(meta);

      const src = document.createElement('p');
      src.className = 'page-src';
      src.textContent = shortName(docs[p.doc].name);
      src.title = docs[p.doc].name;
      el.appendChild(src);

      bindDrag(el);
      elPages.appendChild(el);
    });

    const active = pages.filter(p => !p.excluded).length;
    elSummary.textContent = docs.length + 'ファイル・' + active + 'ページを結合します'
      + (active < pages.length ? '（' + (pages.length - active) + 'ページ除外中）' : '');
    elMerge.disabled = active === 0;
  }

  // サムネイルは描画コストが高いので、要素を作り終えてから後追いで埋める
  async function renderThumbs() {
    const els = elPages.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const holder = els[i];
      if (!holder) continue;
      try {
        const page = await docs[p.doc].view.getPage(p.page + 1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: THUMB_W / base.width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
        const ph = holder.querySelector('.page-ph');
        if (ph) holder.replaceChild(canvas, ph);
      } catch (e) {
        const ph = holder.querySelector('.page-ph');
        if (ph) ph.textContent = '表示できません';
      }
      await new Promise(r => setTimeout(r, 0));
    }
  }

  let dragFrom = null;

  function bindDrag(el) {
    el.addEventListener('dragstart', (e) => {
      dragFrom = Number(el.dataset.idx);
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      // Firefox はデータが空だとドラッグが開始されない
      e.dataTransfer.setData('text/plain', el.dataset.idx);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      elPages.querySelectorAll('.page').forEach(n => n.classList.remove('over'));
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('over'));
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('over');
      const to = Number(el.dataset.idx);
      if (dragFrom === null || dragFrom === to) return;
      const moved = pages.splice(dragFrom, 1)[0];
      pages.splice(to, 0, moved);
      dragFrom = null;
      render();
      renderThumbs();
    });
  }

  async function merge() {
    clearError();
    elDone.hidden = true;
    const target = pages.filter(p => !p.excluded);
    if (!target.length) {
      showError('結合するページがありません。');
      return;
    }

    elMerge.disabled = true;
    elMerge.textContent = '結合しています…';

    try {
      const out = await PDFLib.PDFDocument.create();
      for (const p of target) {
        const [copied] = await out.copyPages(docs[p.doc].lib, [p.page]);
        out.addPage(copied);
      }
      const bytes = await out.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const name = (elFilename.value || 'merged').replace(/[\\/:*?"<>|]/g, '_').trim() || 'merged';
      const a = document.createElement('a');
      a.href = url;
      a.download = name + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      elDone.textContent = target.length + 'ページのPDFを保存しました。';
      elDone.hidden = false;
      if (window.track) window.track('pdf_merged', { pages: target.length, files: docs.length });
    } catch (e) {
      showError('結合に失敗しました。ファイルを確認してもう一度お試しください。');
    } finally {
      elMerge.disabled = false;
      elMerge.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1v9m0 0L4.5 7M8 10l3.5-3M1.5 14h13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>結合してダウンロード';
    }
  }

  function reset() {
    docs.forEach(d => { try { d.view.destroy(); } catch (e) {} });
    docs.length = 0;
    pages = [];
    elPages.innerHTML = '';
    elPagesCard.hidden = true;
    elOutCard.hidden = true;
    elDone.hidden = true;
    elFile.value = '';
    clearError();
  }

  elDrop.addEventListener('click', () => elFile.click());
  elDrop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elFile.click(); }
  });
  elFile.addEventListener('change', () => {
    addFiles(elFile.files);
    elFile.value = '';
  });

  ['dragenter', 'dragover'].forEach(t =>
    elDrop.addEventListener(t, (e) => { e.preventDefault(); elDrop.classList.add('over'); })
  );
  ['dragleave', 'drop'].forEach(t =>
    elDrop.addEventListener(t, (e) => { e.preventDefault(); elDrop.classList.remove('over'); })
  );
  elDrop.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
  // ページ外へのドロップでブラウザがPDFを開いてしまうのを防ぐ
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  $('select-all').addEventListener('click', () => {
    pages.forEach(p => { p.excluded = false; });
    render();
    renderThumbs();
  });
  $('clear').addEventListener('click', reset);
  elMerge.addEventListener('click', merge);
})();

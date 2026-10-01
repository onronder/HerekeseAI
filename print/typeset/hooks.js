// Paged.js ek işleyicileri (pagedjs-cli --additional-script). Dizgi ÖLÇÜMÜNDEN ÖNCE müdahale eder; sayfa yerleştikten sonra
// içerik eklemek taşma/metin kaybı yaratır (bkz. R090/R091), o yüzden renderNode kullanılır.
//  1) R071: bölünen tablonun devam fragmanına kaynak <thead> klonu konur (sütun başlıkları her sayfada).
//  2) R083: bölünen teknik derinlik kutusunun devam fragmanına "devam" etiketi konur.
//  3) R075: afterRendered — dizin girdilerinde aynı sayfa numarasına çözülen tekrar bağlantılar kaldırılır
//     (yalnız görünür metin değişir; sayfa düzeni etkilenmez: bağlantılar satır içi kısa metinlerdir).
class KitapHooks extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.lang = document.documentElement.lang === 'en' ? 'en' : 'tr';
    this.nThead = 0; this.nCont = 0;
  }
  onOverflow(overflow, rendered, bounds) {
    // Heceleme (hyphens:auto) ile iki satıra bölünen bir sözcükte Paged.js harf düzeyinde böler ("outs|ide"); sayfada kalan
    // "outs" yeniden akınca bir satır daha doğar ve sayfa alanından taşar. Kesme noktası sözcük başına geri çekilir.
    if (!overflow || !overflow.startContainer || overflow.startContainer.nodeType !== 3) return;
    const t = overflow.startContainer.data, o = overflow.startOffset;
    if (o <= 0 || o >= t.length || /\s/.test(t[o - 1]) || /\s/.test(t[o])) return;
    let j = o; while (j > 0 && !/\s/.test(t[j - 1])) j--;
    if (j <= 0) return;
    overflow.setStart(overflow.startContainer, j);
    return overflow;
  }
  renderNode(clone, node) {
    // Bölünen kutu/tablo bir sonraki sayfada rebuildAncestors ile yeniden kurulur ve renderNode'a gelmez; gelen ilk çocuktan yukarı bakılır.
    if (!clone) return;
    const el = clone.nodeType === 1 ? clone : clone.parentElement;
    if (!el || !el.closest) return;
    const box = el.closest('.h4box[data-split-from]');
    if (box && !box.querySelector(':scope > .cont')) {
      const lab = document.createElement('div');
      lab.className = 'cont';
      lab.textContent = this.lang === 'en' ? 'Technical depth · continued' : 'Teknik derinlik · devam';
      box.insertBefore(lab, box.firstChild);
    }
    const tbl = el.closest('table[data-split-from]');
    if (tbl && !tbl.querySelector(':scope > thead')) {
      const srcEl = node && (node.nodeType === 1 ? node : node.parentElement);
      const srcTbl = srcEl && srcEl.closest && srcEl.closest('table');
      const srcHead = srcTbl && srcTbl.querySelector(':scope > thead');
      if (srcHead) {
        const head = srcHead.cloneNode(true);
        head.removeAttribute('data-ref');
        head.querySelectorAll('[data-ref]').forEach(e => e.removeAttribute('data-ref'));
        head.classList.add('thead-repeat');
        tbl.insertBefore(head, tbl.firstChild);
      }
    }
  }
  afterRendered(pages) {
    // Görünmez sütun denetimi: Paged.js sayfa alanını çok sütunlu kutu olarak kurar; ölçümden sonra bir taşma olursa Chrome içeriği
    // görünmeyen 2. sütuna atar (metin kaybı, R090/R091). Sütun dışına düşen her öğe sayılır ve PDF Keywords'e yazılır (check.sh kapısı).
    // Not: sütun düzenini sonradan kaldırmak satırları yeniden akıtıp yapay taşma üretiyor; o yüzden yalnız ölçülür.
    // Dizin: aynı sayfaya düşen tekrar numaraları tekilleştir (R075). Paged.js target-counter'ı her bağlantı için
    // "counter(target-counter-…)" içeriği + ayrı bir counter-reset kuralı ile çözer; gerçek sayfa numarası ::after counter-reset'tedir.
    // Bağlantılar arasındaki eski ayraçlar kaldırılıp kalan bağlantılar arasına ", " konur (CSS ::before Paged.js'te uygulanmıyor). Hedefi çözülmeyen bağlantı silinir.
    const ixst = document.createElement('style');
    ixst.textContent = '.ix-e a.ix::after{min-width:0!important;display:inline!important}';  // dizgide ayrılan yer bırakılır (yalnız kısalır)
    document.head.appendChild(ixst);
    const entries = document.querySelectorAll('.ix-e');
    let removed = 0, unresolved = 0;
    entries.forEach(e => {
      const seen = new Set();
      e.querySelectorAll('a.ix').forEach(a => {
        const m = (getComputedStyle(a, '::after').counterReset || '').match(/target-counter-\S+\s+(-?\d+)/);
        if (!m) { a.remove(); unresolved++; return; }
        if (seen.has(m[1])) { a.remove(); removed++; } else seen.add(m[1]);
      });
      [...e.childNodes].forEach(n => { if (n.nodeType === 3 && /^[\s,]*$/.test(n.data) && n.previousSibling && n.previousSibling.nodeName !== 'STRONG') n.remove(); });
      e.querySelectorAll('a.ix').forEach((a, k) => { if (k > 0) a.parentNode.insertBefore(document.createTextNode(', '), a); });
    });
    removed += 0; if (unresolved) console.log(`hooks: çözülmeyen dizin bağlantısı: ${unresolved}`);
    let over = 0; const overPages = [];
    document.querySelectorAll('.pagedjs_page').forEach(pg => {
      const a = pg.querySelector('.pagedjs_page_content'); if (!a) return;
      const ar = a.getBoundingClientRect();
      let hidden = false;
      const w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.data.trim()) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        for (const rc of r.getClientRects()) { if (rc.width > 0 && rc.left >= ar.right - 1) { hidden = true; break; } }
        if (hidden) break;
      }
      if (hidden) { over++; overPages.push(pg.dataset.pageNumber); }
    });
    console.log(`hooks: dizin tekrar sayfa numarası kaldırıldı: ${removed}`);
    const m = document.createElement('meta'); m.name = 'keywords';
    m.content = `kitap-tasma:${over}` + (overPages.length ? ` sayfa ${overPages.join(' ')}` : '') + ` thead-tekrar:${document.querySelectorAll('thead.thead-repeat').length} kutu-devam:${document.querySelectorAll('.h4box > .cont').length} dizin-tekrar-silinen:${removed} dizin-cozulmeyen:${unresolved}`;
    document.head.appendChild(m);
  }
}
Paged.registerHandlers(KitapHooks);

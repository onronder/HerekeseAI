// Bölüm 3 figürleri
import { INK, INK2, MUTED, RULE, EMBER, PAPER, SANS, MONO, SERIF, f1, text, rect, line, circle, svg, caption, tw as twLib, wrapW } from '../lib.mjs';
import STRINGS from '../strings/M03.mjs';

// ---------------------------------------------------------------- 2. Gradyan inişi: iki panel + adım tablosu
// renderVals()/descentStep() ile aynı eğri: L(x)=0.18(x−5)²+0.1, grad=0.36(x−5), x₀=0.6, η düşük 0.18.
// DİKKAT: web demosunda 'yüksek' η = 0.92'dir ve bu değerle top HİÇ aşım yapmaz (0.92·0.36 < 1); metin ise salınım anlatır.
// Basılı figür metne sadık kalsın diye yüksek η = 4.6 kullanılır (çarpan 1.656 → işaret değiştirerek yakınsar). BASKI.md §8'e bakınız.
function descentRun(lr, n = 6) {
  const Lf = (x) => 0.18 * (x - 5) * (x - 5) + 0.1;
  let x = 0.6; const steps = [{ i: 0, x, L: Lf(x), g: 0.36 * (x - 5) }];
  for (let i = 1; i <= n; i++) {
    x = Math.max(0, Math.min(10, x - lr * 0.36 * (x - 5)));
    steps.push({ i, x, L: Lf(x), g: 0.36 * (x - 5) });
  }
  return steps;
}

function descentPanel(ox, oy, w, h, steps, title, S) {
  const Lf = (x) => 0.18 * (x - 5) * (x - 5) + 0.1;
  const px = (x) => ox + 14 + (x / 10) * (w - 24), py = (l) => oy + h - 16 - (l / 4.6) * (h - 34);
  const b = [caption(ox, oy + 7, title)];
  let d = ''; for (let x = 0; x <= 10; x += 0.25) d += (x === 0 ? 'M' : 'L') + f1(px(x)) + ' ' + f1(py(Lf(x))) + ' ';
  b.push(`<path d="${d.trim()}" fill="none" stroke="${INK}" stroke-width="1"/>`);
  b.push(line(px(0), py(0), px(10), py(0), { stroke: RULE }));
  b.push(line(px(5), py(0), px(5), py(0.1) - 2, { stroke: RULE, dash: '1.5 2' }));
  b.push(text(px(5), oy + h - 5, S.descent.min, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  b.push(text(ox + 2, oy + 18, `${S.descent.loss} L(x)`, { font: MONO, size: 6, fill: MUTED }));
  steps.forEach((s, i) => {
    if (i > 0) {
      const p = steps[i - 1];
      b.push(line(px(p.x), py(p.L), px(s.x), py(s.L), { stroke: EMBER, sw: 0.8, marker: true }));
    }
  });
  steps.forEach((s, i) => b.push(circle(px(s.x), py(s.L), 3.2, { fill: i === 0 ? '#fff' : EMBER, stroke: EMBER, sw: 1 })));
  // R073: adım numaraları çakışmasın — engeller: noktalar, eğri örnekleri, adım okları, eksen yazısı, önceki etiketler.
  // Her etiket için nokta çevresinde 8 yön × 3 yarıçap denenir; ilk çakışmasız konum alınır (uzak konumda ince çağrı çizgisi).
  const obst = steps.map((s) => ({ x: px(s.x) - 4, y: py(s.L) - 4, w: 8, h: 8 }));
  for (let x = 0; x <= 10; x += 0.2) obst.push({ x: px(x) - 1, y: py(Lf(x)) - 1, w: 2, h: 2 });
  steps.forEach((s, i) => { if (!i) return; const p = steps[i - 1], X1 = px(p.x), Y1 = py(p.L), X2 = px(s.x), Y2 = py(s.L), n = Math.ceil(Math.hypot(X2 - X1, Y2 - Y1) / 3);
    for (let k = 0; k <= n; k++) obst.push({ x: X1 + (X2 - X1) * k / n - 1, y: Y1 + (Y2 - Y1) * k / n - 1, w: 2, h: 2 }); });
  obst.push({ x: ox + 2, y: oy + 12, w: tw(`${S.descent.loss} L(x)`, 6, true), h: 7 }); // eksen yazısı
  obst.push({ x: ox + 14, y: oy + h - 16, w: w - 24, h: 20 }); // taban çizgisi ve en düşük nokta etiketi
  const hit = (bx) => obst.some((o) => bx.x < o.x + o.w && bx.x + bx.w > o.x && bx.y < o.y + o.h && bx.y + bx.h > o.y);
  const DIRS = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [-1, 0], [1, 0], [0, 1]];
  steps.forEach((s) => {
    const X = px(s.x), Y = py(s.L), lw = tw(String(s.i), 6.5, true), lh = 6.5;
    let best = null;
    for (const rad of [7, 12, 17]) {
      for (const [dx, dy] of DIRS) {
        const cx = X + dx * rad, cy = Y + dy * rad; // etiket merkezi
        const bx = { x: cx - lw / 2, y: cy - lh / 2, w: lw, h: lh };
        if (bx.x < ox || bx.x + bx.w > ox + w || bx.y < oy + 10 || hit(bx)) continue;
        best = { bx, cx, cy, rad }; break;
      }
      if (best) break;
    }
    if (!best) { const cx = X, cy = Y - 9; best = { bx: { x: cx - lw / 2, y: cy - lh / 2, w: lw, h: lh }, cx, cy, rad: 9 }; }
    if (best.rad > 7) { const d = Math.hypot(best.cx - X, best.cy - Y), ux = (best.cx - X) / d, uy = (best.cy - Y) / d;
      b.push(line(X + ux * 4, Y + uy * 4, X + ux * (best.rad - 4), Y + uy * (best.rad - 4), { stroke: INK2, sw: 0.4 })); }
    b.push(text(best.cx, best.cy + 2.3, s.i, { font: MONO, size: 6.5, fill: INK2, anchor: 'middle' }));
    obst.push({ ...best.bx, x: best.bx.x - 1, w: best.bx.w + 2 });
  });
  return b.join('\n');
}

function descentFigure(demo, { lang }) {
  const S = STRINGS[lang], D = S.descent;
  const LR_HIGH = 4.6;
  const low = descentRun(0.18), high = descentRun(LR_HIGH);
  const pw = 150, ph = 120, pad = 10, W = pad * 2 + pw * 2 + 12, H = ph + pad * 2;
  const body = [rect(0, 0, W, H, { fill: PAPER }),
    descentPanel(pad, pad, pw, ph, low, `${D.low} (η = 0.18)`, S),
    descentPanel(pad + pw + 12, pad, pw, ph, high, `${D.high} (η = ${LR_HIGH})`, S)];
  const tbl = (steps, title) => [`## ${title}`, '', `| ${D.step} | ${D.x} | L(x) | ${D.gradient} |`, '|---|---|---|---|',
    ...steps.map((s) => `| ${s.i} | ${s.x.toFixed(2)} | ${s.L.toFixed(2)} | ${s.g.toFixed(2)} |`), ''].join('\n');
  const md = [`# ${S.common.table} — ${demo.title}`, '', 'L(x) = 0.18·(x − 5)² + 0.1 · x₀ = 0.6 · x ← x − η·L′(x), L′(x) = 0.36·(x − 5)', '',
    tbl(low, `${D.low} (η = 0.18)`), tbl(high, `${D.high} (η = ${LR_HIGH})`),
    D.note, ''].join('\n');
  return [{ name: 'descent', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- ortak küçük yardımcılar (bu dosya)
// Metin genişliği ve kelime sarma: lib.mjs (ölçülmüş Work Sans / Space Mono glif genişlikleri; 2026-10-01).
const tw = (s, size, mono = false) => twLib(s, size, mono ? 'mono' : 'sans');
const wrap = (s, size, maxW, mono = false) => wrapW(s, size, maxW, mono ? 'mono' : 'sans');
// Beyaz zeminli, ince çerçeveli çizim alanı (ekrandaki "background:#fff;border:1px" kutusunun kâğıt hâli).
const plotBox = (x, y, w, h) => rect(x, y, w, h, { fill: '#fff', stroke: RULE, sw: 0.6 });
// Işık eksen çizgileri + tik etiketleri. mx/my: veri→kâğıt dönüşümü; xt/yt: tik değerleri.
function axes(x, y, w, h, mx, my, xt, yt) {
  const b = [line(x, y + h, x + w, y + h, { stroke: RULE, sw: 0.6 }), line(x, y, x, y + h, { stroke: RULE, sw: 0.6 })];
  xt.forEach((v) => b.push(line(mx(v), y + h, mx(v), y + h + 2, { stroke: MUTED, sw: 0.5 }),
    text(mx(v), y + h + 7.5, v, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }))); // R082: tik etiketleri ≥ 6
  yt.forEach((v) => b.push(line(x - 2, my(v), x, my(v), { stroke: MUTED, sw: 0.5 }),
    text(x - 3, my(v) + 1.8, v, { font: MONO, size: 6, fill: MUTED, anchor: 'end' })));
  return b.join('\n');
}

// ---------------------------------------------------------------- 1. Spam: 4 e-posta × 3 özellik (✓/○) + etiket
// book.json demo.emails / demo.featureNames birebir. ✓ ve ○ font glifine bağlı kalmamak için çizilir.
function spamFigure(demo, { lang }) {
  const S = STRINGS[lang], P = S.spam;
  // R017: özellik adı tek tanım ("link veya şifre isteği") — strings spam.featureOverride (dizin → ad)
  const F = demo.featureNames.map((nm, k) => (P.featureOverride && P.featureOverride[k]) || nm), E = demo.emails;
  const pad = 8, cNo = 12, cMail = 132, cF = 40, cLab = 40;
  const W = pad * 2 + cNo + cMail + cF * F.length + cLab; // 320
  const xNo = pad, xMail = xNo + cNo, xF = xMail + cMail, xLab = xF + cF * F.length;
  const headH = 30, groupH = 12;
  const mailLines = E.map((e) => wrap(e.text, 7, cMail - 8)), rowHs = mailLines.map((l) => Math.max(24, l.length * 8.5 + 7));
  const rowsH = rowHs.reduce((a, b) => a + b, 0);
  const H = pad + groupH + headH + rowsH + pad;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // grup başlıkları (ekrandaki iki kutu başlığı)
  const gy = pad + 7;
  body.push(caption(xF, gy, P.groupIn, { size: 6, spacing: 0.6 }));
  body.push(caption(W - pad, gy, P.groupOut, { size: 6, spacing: 0.6, anchor: 'end' }));
  // sütun başlıkları
  const hy = pad + groupH;
  body.push(rect(xF, hy, cF * F.length, headH + rowsH, { fill: '#fff', stroke: RULE, sw: 0.6 }));
  body.push(rect(xLab, hy, cLab, headH + rowsH, { fill: '#fff', stroke: RULE, sw: 0.6 }));
  body.push(text(xNo + cNo / 2, hy + headH - 6, '#', { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  body.push(text(xMail + 4, hy + headH - 6, P.email, { font: MONO, size: 6, fill: INK2 }));
  F.forEach((nm, k) => {
    const lines = wrap(nm, 5.5, cF - 4, true), cx = xF + cF * k + cF / 2;
    lines.forEach((ln, j) => body.push(text(cx, hy + headH - 6 - (lines.length - 1 - j) * 7, ln, { font: MONO, size: 5.5, fill: INK2, anchor: 'middle' })));
  });
  body.push(text(xLab + cLab / 2, hy + headH - 6, P.label, { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  body.push(line(xNo, hy + headH, W - pad, hy + headH, { stroke: INK, sw: 0.7 }));
  // satırlar
  let rowY = hy + headH;
  E.forEach((e, i) => {
    const rowH = rowHs[i], y0 = rowY, cy = y0 + rowH / 2;
    rowY += rowH;
    if (i > 0) body.push(line(xNo, y0, W - pad, y0, { stroke: RULE, sw: 0.5 }));
    body.push(text(xNo + cNo / 2, cy + 2.5, i + 1, { font: MONO, size: 7, fill: INK2, anchor: 'middle' }));
    const lines = mailLines[i];
    lines.forEach((ln, j) => body.push(text(xMail + 4, cy + 2.5 + (j - (lines.length - 1) / 2) * 8.5, ln, { size: 7 })));
    e.features.forEach((on, k) => {
      const cx = xF + cF * k + cF / 2;
      if (on) body.push(`<path d="M${f1(cx - 3.6)} ${f1(cy + 0.2)} L${f1(cx - 1)} ${f1(cy + 3)} L${f1(cx + 3.8)} ${f1(cy - 3.4)}" fill="none" stroke="${EMBER}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`);
      else body.push(circle(cx, cy, 2.8, { stroke: MUTED, sw: 0.8 }));
    });
    const spam = e.label === P.spamValue;
    body.push(text(xLab + cLab / 2, cy + 3, e.label, { font: SERIF, size: 9.5, fill: spam ? EMBER : INK, anchor: 'middle', weight: spam ? 600 : 400 }));
  });
  // alt açıklama
  const fy = H + 1;
  body.push(`<path d="M${f1(xNo + 0.5)} ${f1(fy - 2)} L${f1(xNo + 2.2)} ${f1(fy)} L${f1(xNo + 5.5)} ${f1(fy - 4.2)}" fill="none" stroke="${EMBER}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`);
  body.push(text(xNo + 8, fy, P.cueOn, { font: MONO, size: 5.5, fill: MUTED }));
  body.push(circle(xNo + 48, fy - 1.8, 2, { stroke: MUTED, sw: 0.7 }), text(xNo + 53, fy, P.cueOff, { font: MONO, size: 5.5, fill: MUTED }));
  const md = [`# ${S.common.table} — ${demo.title}`, '', `| # | ${P.email} | ${F.join(' | ')} | ${P.label} |`, `|---|---|${'---|'.repeat(F.length)}---|`,
    ...E.map((e, i) => `| ${i + 1} | ${e.text} | ${e.features.map((v) => (v ? '✓' : '○')).join(' | ')} | ${e.label} |`), ''].join('\n');
  return [{ name: 'spam', svg: svg(W, H + 8, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 2. Scatter: regresyon / sınıflandırma, ham + uydurulmuş (2×2)
// renderVals() ile aynı veri: regresyon 9 nokta + en küçük kareler doğrusu (x 0.5..9.5); sınıflandırma 5+5 nokta,
// sınır (1, 5.5)–(8.5, 1). Ekran renkleri (yeşil/turuncu) → INK / EMBER.
const SC_REG = [[1, 1.4], [2, 1.9], [3, 2.2], [4, 3.1], [5, 3.3], [6, 4.2], [7, 4.5], [8, 5.4], [9, 5.6]];
const SC_A = [[1.5, 1.5], [2, 2.2], [2.6, 1.7], [3.1, 2.6], [1.9, 3]];
const SC_B = [[6.5, 4.5], [7, 5.3], [7.6, 4.6], [6.9, 5.8], [8, 5.1]];
function lsq(pts) {
  const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let num = 0, den = 0; pts.forEach((p) => { num += (p[0] - mx) * (p[1] - my); den += (p[0] - mx) ** 2; });
  const m = num / den; return { m, b: my - m * mx, num, den, mx, my };
}
function scatterFigure(demo, { lang }) {
  const S = STRINGS[lang], C = S.scatter;
  const pad = 8, pw = 147, ph = 100, gap = 10, cap = 10, rowGap = 8;
  const W = pad * 2 + pw * 2 + gap; // 320
  const H = pad + (cap + ph) * 2 + rowGap + 12;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const fit = lsq(SC_REG);
  const panel = (ox, oy, kind, fitted) => {
    const x0 = ox + 14, y0 = oy, w = pw - 18, h = ph - 12;
    const mx = (x) => x0 + (x / 10) * w, my = (y) => y0 + h - (y / 7) * h;
    const b = [plotBox(x0, y0, w, h), axes(x0, y0, w, h, mx, my, [0, 5, 10], [0, 2, 4, 6])];
    if (kind === 'reg') {
      if (fitted) {
        b.push(line(mx(0.5), my(fit.m * 0.5 + fit.b), mx(9.5), my(fit.m * 9.5 + fit.b), { stroke: EMBER, sw: 1.6 }));
        b.push(text(mx(9.6), my(fit.m * 9.6 + fit.b) - 5, `y = ${fit.m.toFixed(2)}x + ${fit.b.toFixed(2)}`, { font: MONO, size: 5.5, fill: EMBER, anchor: 'end' }));
      }
      SC_REG.forEach((p) => b.push(circle(mx(p[0]), my(p[1]), 2.6, { fill: INK })));
    } else {
      if (fitted) {
        b.push(line(mx(1), my(5.5), mx(8.5), my(1), { stroke: EMBER, sw: 1.6 }));
        b.push(text(mx(5.6), my(6.1 - 0.6 * 5.6) - 5, 'y = 6.1 − 0.6x', { font: MONO, size: 5.5, fill: EMBER, anchor: 'start' }));
      }
      SC_A.forEach((p) => b.push(circle(mx(p[0]), my(p[1]), 2.6, { fill: INK })));
      SC_B.forEach((p) => b.push(circle(mx(p[0]), my(p[1]), 2.6, { fill: EMBER })));
    }
    return b.join('\n');
  };
  const rowLabel = (ox, oy, s) => text(ox + pw - 4, oy + 8, s, { font: MONO, size: 5.5, fill: MUTED, anchor: 'end' });
  const L1 = pad, L2 = pad + pw + gap;
  body.push(caption(L1, pad + 7, C.reg), caption(L2, pad + 7, C.cls));
  const r1 = pad + cap, r2 = r1 + ph + rowGap;
  body.push(rowLabel(L1, r1, C.raw), panel(L1, r1, 'reg', false));
  body.push(rowLabel(L2, r1, C.raw), panel(L2, r1, 'cls', false));
  body.push(rowLabel(L1, r2, C.bestLine), panel(L1, r2, 'reg', true));
  body.push(rowLabel(L2, r2, C.boundary), panel(L2, r2, 'cls', true));
  // gösterge (sınıflandırma renkleri: ekranda yeşil/turuncu)
  const ly = H - 4;
  body.push(circle(L2 + 16, ly - 2, 2.4, { fill: INK }), text(L2 + 21, ly, C.groupA, { font: MONO, size: 5.5, fill: INK2 }));
  body.push(circle(L2 + 70, ly - 2, 2.4, { fill: EMBER }), text(L2 + 75, ly, C.groupB, { font: MONO, size: 5.5, fill: INK2 }));
  const stats = { mx: fit.mx, my: fit.my.toFixed(2), num: fit.num.toFixed(2), den: fit.den.toFixed(2), m: fit.m.toFixed(2), b: fit.b.toFixed(2),
    sse: SC_REG.reduce((a, p) => a + (p[1] - fit.m * p[0] - fit.b) ** 2, 0).toFixed(2) };
  const md = [`# ${S.common.table} — ${demo.title}`, '', `## ${C.reg}`, '', C.md.regHead, '|---|---|---|---|---|',
    ...SC_REG.map((p, i) => `| ${i + 1} | ${p[0]} | ${p[1]} | ${(fit.m * p[0] + fit.b).toFixed(2)} | ${(p[1] - fit.m * p[0] - fit.b).toFixed(2)} |`), '',
    C.md.stats(stats), '',
    `## ${C.cls}`, '', C.md.clsHead, '|---|---|---|',
    `| ${C.md.rowA} | ${SC_A.map((p) => `(${p[0]}, ${p[1]})`).join(', ')} |`, `| ${C.md.rowB} | ${SC_B.map((p) => `(${p[0]}, ${p[1]})`).join(', ')} |`, '',
    C.md.boundary, ''].join('\n');
  return [{ name: 'scatter', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 3. K-means: önce / sonra (iki panel)
// renderVals() ile aynı: 11 nokta, iki sabit merkez ✕ (2.5, 7) ve (7, 3), aykırı nokta indeks 10.
const KM_C = [[2.5, 7], [7, 3]];
const KM_P = [[1.5, 7.5], [2, 6.5], [3, 7.8], [2.8, 6.2], [1.8, 8], [7.5, 3.2], [6.5, 2.5], [7.8, 3.8], [6.8, 4], [8, 2.8], [5, 8.5]];
const KM_ANOM = 10;
const KM_LBL = { 0: [-4, 2, 'end'], 1: [-4, 2, 'end'], 3: [4, 6, 'start'], 5: [0, 8, 'middle'], 6: [-4, 2, 'end'] };
function kmeansFigure(demo, { lang }) {
  const S = STRINGS[lang], K = S.kmeans;
  const pad = 8, pw = 147, ph = 108, gap = 10, cap = 10;
  const W = pad * 2 + pw * 2 + gap, H = pad + cap + ph + 14;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const dist = (p, c) => Math.hypot(p[0] - c[0], p[1] - c[1]);
  // k: 'A' | 'B' | 'out' (sembolik; görünen ad sözlükten)
  const rows = KM_P.map((p, i) => { const d0 = dist(p, KM_C[0]), d1 = dist(p, KM_C[1]); return { i, p, d0, d1, k: i === KM_ANOM ? 'out' : d0 < d1 ? 'A' : 'B' }; });
  const kName = (k) => (k === 'out' ? K.outlier : k);
  const panel = (ox, oy, grouped) => {
    const x0 = ox + 14, y0 = oy, w = pw - 18, h = ph - 12;
    const mx = (x) => x0 + (x / 10) * w, my = (y) => y0 + h - (y / 10) * h;
    const b = [plotBox(x0, y0, w, h), axes(x0, y0, w, h, mx, my, [0, 5, 10], [0, 5, 10])];
    rows.forEach((r) => {
      const X = mx(r.p[0]), Y = my(r.p[1]);
      if (!grouped) b.push(circle(X, Y, 2.8, { fill: MUTED }));
      else if (r.k === 'out') b.push(circle(X, Y, 3.4, { fill: '#fff', stroke: EMBER, sw: 1.5 }));
      else b.push(circle(X, Y, 2.8, { fill: r.k === 'A' ? INK : EMBER }));
      // nokta numarası (metindeki tabloyla eşleşir); kalabalık yerlerde elle kaydırılmış konum
      const [dx, dy, anc] = KM_LBL[r.i] || [4, -3, 'start'];
      b.push(text(X + dx, Y + dy, r.i + 1, { font: MONO, size: 5, fill: INK2, anchor: anc }));
    });
    KM_C.forEach((c, k) => {
      const X = mx(c[0]), Y = my(c[1]), s = 3.2;
      b.push(line(X - s, Y - s, X + s, Y + s, { stroke: INK, sw: 1.4 }), line(X - s, Y + s, X + s, Y - s, { stroke: INK, sw: 1.4 }));
      b.push(text(X + (k === 0 ? 6 : -6), Y + (k === 0 ? 2 : 1), k === 0 ? 'A' : 'B', { font: MONO, size: 6.5, fill: INK, anchor: k === 0 ? 'start' : 'end', weight: 700 }));
    });
    return b.join('\n');
  };
  const L1 = pad, L2 = pad + pw + gap, r1 = pad + cap;
  body.push(caption(L1, pad + 7, K.before), caption(L2, pad + 7, K.after));
  body.push(panel(L1, r1, false), panel(L2, r1, true));
  // gösterge
  const ly = H - 3; let lx = L2 + 6; // gösterge: aralıklar çizilen puntoyla (≥ 6.2) ölçülür (R082)
  [[INK, null, K.clusterA], [EMBER, null, K.clusterB], ['#fff', EMBER, K.outlier]].forEach(([f, st, lab]) => {
    body.push(st ? circle(lx, ly - 2, 2.6, { fill: f, stroke: st, sw: 1.2 }) : circle(lx, ly - 2, 2.4, { fill: f }));
    body.push(text(lx + 5, ly, lab, { font: MONO, size: 5.5, fill: INK2 }));
    lx += 5 + twLib(lab, 6.2, 'mono') + 8;
  });
  body.push(text(L1, ly, K.centroid, { font: MONO, size: 5.5, fill: INK2 }));
  const md = [`# ${S.common.table} — ${demo.title}`, '', K.md.centers(KM_C[0], KM_C[1]), '',
    K.md.head, '|---|---|---|---|---|',
    ...rows.map((r) => `| ${r.i + 1} | (${r.p[0]}, ${r.p[1]}) | ${r.d0.toFixed(2)} | ${r.d1.toFixed(2)} | ${kName(r.k)} |`), ''].join('\n');
  return [{ name: 'kmeans', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4. Model uyumu: eksik / iyi / aşırı (üç panel + hüküm)
// renderVals() ile aynı: 9 nokta; eksik y = 3.1 − 0.18x; iyi y = 3.0 − 0.16x + 0.15·sin(0.6x); aşırı = noktaları birleştiren kırık çizgi.
const MF_P = [[1, 3.2], [2, 2.4], [3, 3.0], [4, 2.0], [5, 2.7], [6, 1.7], [7, 2.3], [8, 1.4], [9, 2.0]];
const MF_FN = {
  under: (x) => 3.1 - 0.18 * x,
  good: (x) => 3.0 - 0.16 * x + 0.15 * Math.sin(x * 0.6),
};
// R024 (2026-10-01): "İyi (dengeli)" paneli "Daha düzgün temsili eğri" diye etiketlenir (strings modelfit.labelOverride, kind → etiket; '\n' satır böler).
function modelfitFigure(demo, { lang }) {
  const S = STRINGS[lang], M = S.modelfit;
  const labelOf = (f) => (M.labelOverride && M.labelOverride[f.kind]) || f.label;
  const labels = demo.fits.map((f) => String(labelOf(f)).split('\n'));
  const capLines = Math.max(...labels.map((l) => l.length));
  const pad = 6, n = demo.fits.length, gap = 8, pw = Math.floor((320 - pad * 2 - gap * (n - 1)) / n), ph = 74, cap = 2 + capLines * 8.5;
  const vSize = 6.3, vLine = 8;
  const verdictOf = (f) => (M.verdictOverride && M.verdictOverride[f.kind]) || f.verdict;
  const verdicts = demo.fits.map((f) => wrap(verdictOf(f), vSize, pw - 2));
  const vRows = Math.max(...verdicts.map((v) => v.length));
  const W = pad * 2 + pw * n + gap * (n - 1), H = pad + cap + ph + 8 + vRows * vLine + pad;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  demo.fits.forEach((f, i) => {
    const ox = pad + i * (pw + gap), oy = pad + cap;
    const x0 = ox + 10, y0 = oy, w = pw - 12, h = ph - 10;
    const mx = (x) => x0 + (x / 10) * w, my = (y) => y0 + h - (y / 4) * h;
    labels[i].forEach((ln, k) => body.push(caption(ox, pad + 7 + k * 8.5, ln)));
    body.push(plotBox(x0, y0, w, h), axes(x0, y0, w, h, mx, my, [0, 5, 10], [0, 2, 4]));
    let d = '';
    if (f.kind === 'over') MF_P.forEach((p, j) => { d += (j ? 'L' : 'M') + f1(mx(p[0])) + ' ' + f1(my(p[1])) + ' '; });
    else { const fn = MF_FN[f.kind]; for (let x = 0.5; x <= 9.5 + 1e-9; x += 0.25) d += (x === 0.5 ? 'M' : 'L') + f1(mx(x)) + ' ' + f1(my(fn(x))) + ' '; }
    body.push(`<path d="${d.trim()}" fill="none" stroke="${EMBER}" stroke-width="1.4" stroke-linejoin="round"/>`);
    MF_P.forEach((p) => body.push(circle(mx(p[0]), my(p[1]), 2.2, { fill: INK })));
    verdicts[i].forEach((ln, j) => body.push(text(ox, oy + ph + 6 + j * vLine, ln, { size: vSize, fill: INK2 })));
  });
  const sse = (fn) => MF_P.reduce((a, p) => a + (p[1] - fn(p[0])) ** 2, 0);
  const md = [`# ${S.common.table} — ${demo.title}`, '', M.md.head, '|---|---|---|---|---|',
    ...MF_P.map((p) => `| ${p[0]} | ${p[1]} | ${MF_FN.under(p[0]).toFixed(2)} | ${MF_FN.good(p[0]).toFixed(2)} | ${p[1]} |`), '',
    M.md.sse(sse(MF_FN.under).toFixed(2), sse(MF_FN.good).toFixed(2)), '',
    ...demo.fits.map((f) => `- ${labelOf(f).replace('\n', ' ')}: ${verdictOf(f)}`), '', M.md.note, ''].join('\n');
  return [{ name: 'modelfit', svg: svg(W, H, body.join('\n')), md }];
}


export const FIGURES = { descent: descentFigure, spam: spamFigure, scatter: scatterFigure, kmeans: kmeansFigure, modelfit: modelfitFigure };

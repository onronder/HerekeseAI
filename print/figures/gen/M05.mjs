// Bölüm 5 figürleri
// Veri kaynağı: Atlas-Kitap.dc.html renderVals() (token 2153–2171, embed 2172–2194, attn 2195–2217, generate 2218–2244,
// train 2245–2257, diffuse 2258–2280, ctx 2281–2298). Sayılar ve etiketler ekrandakiyle aynı; ekran renkleri (mor) → EMBER.
// Görünen metin ve kelime dizileri strings/M05.mjs içinden (S = STRINGS[lang]); burada yalnız sayısal veri ve düzen kalır.
import { MIN_TEXT, INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption, pct, up, DEMO, wrapW } from '../lib.mjs';
import STRINGS from '../strings/M05.mjs';

// ---------------------------------------------------------------- ortak yardımcılar
// Kaba metin genişliği (pt). Work Sans için ortalama harf genişliği ~0.53em; Space Mono sabit 0.6em; Instrument Serif ~0.45em.
const NARROW = /[iıjlİtfr'’‘“”.,:;!|()\[\] ·…]/, WIDE = /[mwMWĞÖ]/, UPPER = /[A-ZÇĞİÖŞÜ]/;
export function tw(s, size, font = 'sans') {
  if (font === 'mono') return s.length * size * 0.6;
  const k = font === 'serif' ? 1.0 : 1; // Georgia yedeği Instrument Serif'ten geniş; sarma tutucu olsun
  let w = 0;
  for (const ch of String(s)) {
    if (NARROW.test(ch)) w += 0.3; else if (WIDE.test(ch)) w += 0.84; else if (UPPER.test(ch)) w += 0.66;
    else if (/[0-9]/.test(ch)) w += 0.56; else w += 0.53;
  }
  return w * size * k;
}
export function wrap(s, size, maxW, font = 'sans') {
  const lines = []; let cur = '';
  for (const w of String(s).split(/\s+/).filter(Boolean)) {
    const cand = cur ? cur + ' ' + w : w;
    if (cur && tw(cand, size, font) > maxW) { lines.push(cur); cur = w; } else cur = cand;
  }
  if (cur) lines.push(cur);
  return lines;
}
const orect = (x, y, w, h, fill, op, o = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" fill-opacity="${op}"` +
  `${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 0.6}"` : ''}/>`;

// ---------------------------------------------------------------- 5.1 token: üç cümle, token kutuları, sayım
// renderVals() token dalı birebir: ≤6 karakter tek token; uzunlar dörder karakter, devam parçaları '##'; noktalama ayrı.
export function tokenize(ex) {
  const words = ex.split(/\s+/).filter(Boolean), toks = [];
  words.forEach((w) => {
    const mm = w.match(/^([^\s,.!?;:]*)([,.!?;:]*)$/);
    const core = mm ? mm[1] : w, punc = mm ? mm[2] : '';
    if (core.length && core.length <= 6) toks.push({ t: core, cont: false });
    else if (core.length) for (let i = 0; i < core.length; i += 4) toks.push({ t: i === 0 ? core.slice(i, i + 4) : '##' + core.slice(i, i + 4), cont: i > 0 });
    for (const ch of punc) toks.push({ t: ch, cont: false });
  });
  return { words, toks };
}

function tokenFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const W = 320, pad = 10, chipH = 13, chipPad = 4, gap = 3, fs = 7;
  const body = [];
  let y = pad;
  const rows = [];
  S.token.examples.forEach((ex, i) => {
    const { words, toks } = tokenize(ex);
    const lab = S.token.sentence(i + 1);
    body.push(caption(pad, y + 6, lab));
    // cümle, etiketin sağında başlar (uzun etiketlerde — SENTENCE — çakışmasın; TR'de 48 sabiti korunur)
    body.push(text(pad + Math.max(48, tw(lab, 6.5, 'mono') + lab.length * 1.2 + 8), y + 6.5, ex, { size: 8, italic: true, fill: INK }));
    y += 12;
    let x = pad;
    toks.forEach((tk) => {
      const w = tw(tk.t, fs, 'mono') + chipPad * 2;
      if (x + w > W - pad) { x = pad; y += chipH + gap; }
      body.push(rect(x, y, w, chipH, { fill: tk.cont ? EMBER_SOFT : '#fff', stroke: tk.cont ? EMBER : INK, sw: 0.7 }));
      body.push(text(x + w / 2, y + chipH - 4, tk.t, { font: MONO, size: fs, anchor: 'middle' }));
      x += w + gap;
    });
    y += chipH + 6;
    const cnt = String(toks.length);
    body.push(text(pad, y + 5, cnt, { font: MONO, size: 6.5, fill: EMBER, weight: 700 }));
    body.push(text(pad + tw(cnt, 6.5, 'mono') + 1, y + 5, S.token.count(words.length), { font: MONO, size: 6.5, fill: INK2 }));
    y += 13;
    rows.push({ ex, toks, words });
  });
  y += 2;
  body.push(text(pad, y + 5, S.token.legend, { font: MONO, size: 6, fill: MUTED }));
  const H = y + 14;
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [S.token.mdTitle(demo.title), '', S.token.mdHead, '|---|---|---|---|',
    ...rows.map((r) => `| ${r.ex} | ${r.toks.map((k) => k.t).join(' · ')} | ${r.words.length} | ${r.toks.length} |`), ''].join('\n');
  return [{ name: 'token', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.2 embed: anlam haritası (ekran SVG 280×180 birebir koordinat)
// Koordinatlar ve aile anahtarı dilden bağımsız; kelime ve aile adları S.embed.words / S.embed.family (aynı sırayla).
const EMBED_XY = [
  { f: 'animal', x: 58, y: 62 }, { f: 'animal', x: 84, y: 50 }, { f: 'animal', x: 52, y: 92 },
  { f: 'royalty', x: 198, y: 54 }, { f: 'royalty', x: 222, y: 70 }, { f: 'royalty', x: 196, y: 88 },
  { f: 'food', x: 128, y: 132 }, { f: 'food', x: 152, y: 120 }, { f: 'food', x: 118, y: 146 },
];
const EMBED_BELOW = new Set([2, 8]); // komşu çizgisi / başka noktayla çakışmasın diye etiketi altta yazılan noktalar
function embedFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const pts = EMBED_XY.map((p, i) => ({ l: S.embed.words[i], f: S.embed.family[p.f], x: p.x, y: p.y })), pick = 0; // ekran başlangıç durumu: embedPick = 0
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const nearest = (i) => pts.map((p, j) => ({ j, d: dist(pts[i], p) })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
  const near = nearest(pick);
  const W = 320, ox = 20, oy = 10, mw = 280, mh = 180;
  const X = (x) => ox + x, Y = (y) => oy + y;
  const body = [rect(0, 0, W, 0, {})]; // yer tutucu, sonda değiştirilir
  body.push(rect(ox, oy, mw, mh, { fill: '#fff', stroke: RULE, sw: 0.6 }));
  // eksen çentikleri (tablodaki koordinatlar okunabilsin)
  for (let x = 50; x < mw; x += 50) {
    body.push(line(X(x), Y(mh), X(x), Y(mh) - 3, { stroke: RULE }));
    body.push(text(X(x), Y(mh) + 7, x, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' })); // R082: ≥ 6
  }
  for (let y = 50; y < mh; y += 50) {
    body.push(line(X(0), Y(y), X(0) + 3, Y(y), { stroke: RULE }));
    body.push(text(X(0) - 2, Y(y) + 2, y, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  }
  body.push(text(X(mw) - 2, Y(mh) + 7, 'x', { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  body.push(text(X(0) - 2, Y(0) + 6, 'y', { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  // aile kümeleri: kesikli daire + aile adı (ekrandaki üç renk yerine)
  const fams = [...new Set(pts.map((p) => p.f))];
  fams.forEach((f) => {
    const ps = pts.filter((p) => p.f === f);
    const cx = ps.reduce((a, p) => a + p.x, 0) / ps.length, cy = ps.reduce((a, p) => a + p.y, 0) / ps.length;
    const r = Math.max(...ps.map((p) => Math.hypot(p.x - cx, p.y - cy))) + 15;
    body.push(`<circle cx="${f1(X(cx))}" cy="${f1(Y(cy))}" r="${f1(r)}" fill="none" stroke="${INK2}" stroke-width="0.6" stroke-dasharray="2 2"/>`);
    body.push(caption(X(cx), Y(cy) - r - 3, up(f, lang), { anchor: 'middle', fill: INK2 }));  // 2026-09-30: YİYECEK
  });
  // komşu bağlantıları + uzaklık etiketi
  const halo = (t) => t.replace('<text ', '<text stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round" paint-order="stroke" '); // R073: kesikli çizgilerin üstünde okunur kalsın
  near.forEach((o) => {
    const a = pts[pick], b = pts[o.j];
    body.push(line(X(a.x), Y(a.y), X(b.x), Y(b.y), { stroke: EMBER, sw: 0.8, dash: '2 1.5' }));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    const nx = -dy / d, ny = dx / d; // sol normal
    const off = 4 + Math.abs(nx) * tw(o.d.toFixed(1), MIN_TEXT, 'mono') / 2 + Math.abs(ny) * 3.5; // R073: etiket kesikli çizgiye değmesin
    body.push(halo(text(X(mx + nx * off), Y(my + ny * off) + 2, o.d.toFixed(1), { font: MONO, size: 6, fill: EMBER, anchor: 'middle' })));
  });
  // noktalar ve etiketler
  pts.forEach((p, i) => {
    const sel = i === pick, nr = near.some((o) => o.j === i);
    if (sel) body.push(circle(X(p.x), Y(p.y), 6, { fill: EMBER, stroke: INK, sw: 1.2 }));
    else if (nr) body.push(circle(X(p.x), Y(p.y), 5, { fill: '#fff', stroke: EMBER, sw: 1.5 }));
    else body.push(circle(X(p.x), Y(p.y), 4, { fill: INK }));
    const below = EMBED_BELOW.has(i);
    body.push(halo(text(X(p.x), Y(p.y) + (below ? (nr ? 14 : 13) : -(sel ? 11 : 9)), p.l, { size: 7.5, anchor: 'middle', weight: sel ? 700 : nr ? 600 : 400, fill: sel || nr ? INK : INK2 })));
  });
  let y = oy + mh + 14;
  body.push(text(ox, y + 5, S.embed.selected(pts[pick].l, near.map((o) => S.embed.neighbor(pts[o.j].l, o.d.toFixed(1))).join(', ')), { font: MONO, size: 6, fill: INK2 }));
  y += 10;
  body.push(text(ox, y + 5, S.embed.sameFamily(pts[pick].f), { font: MONO, size: 6, fill: INK2 }));
  y += 10;
  const a = pts[pick], b = pts[near[0].j];
  body.push(text(ox, y + 5, S.embed.distance(a.l, b.l, Math.abs(a.x - b.x), Math.abs(a.y - b.y), near[0].d.toFixed(1)), { font: MONO, size: 6, fill: MUTED }));
  const H = y + 14;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [S.embed.mdTitle(demo.title), '', S.embed.mdHead, '|---|---|---|---|---|',
    ...pts.map((p, i) => `| ${p.l} | ${p.f} | ${p.x} | ${p.y} | ${nearest(i).map((o) => `${pts[o.j].l} (${o.d.toFixed(1)})`).join(', ')} |`), '',
    S.embed.mdNote, ''].join('\n');
  return [{ name: 'embed', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.3 attn: 5×5 dikkat ısı tablosu
const ATTN_W = [
  [0.50, 0.30, 0.05, 0.10, 0.05],
  [0.50, 0.30, 0.10, 0.05, 0.05],
  [0.20, 0.40, 0.20, 0.10, 0.10],
  [0.55, 0.10, 0.05, 0.20, 0.10],
  [0.30, 0.10, 0.05, 0.40, 0.15],
];
function attnFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const toks = S.attn.tokens, M = ATTN_W, n = toks.length, q = 3; // ekran başlangıç durumu: attnQ = 3 → zamir
  const W = 320, ox = 10, oy = 10, lab = 52, cw = 44, ch = 20, hh = 18, sumW = 28;
  const body = [rect(0, 0, W, 0)];
  const gx = ox + lab, gy = oy + hh;
  body.push(text(ox, gy - 6, S.attn.query, { font: MONO, size: 6, fill: MUTED })); // R082: ≥ 6
  body.push(text(gx, oy + 5, S.attn.key, { font: MONO, size: 6, fill: MUTED }));
  toks.forEach((t, j) => body.push(text(gx + cw * j + cw / 2, gy - 5, t, { font: MONO, size: 6.5, fill: INK2, anchor: 'middle' })));
  body.push(text(gx + cw * n + sumW / 2, gy - 5, 'Σ', { font: MONO, size: 6.5, fill: MUTED, anchor: 'middle' }));
  const best = M.map((row) => row.indexOf(Math.max(...row)));
  M.forEach((row, i) => {
    const isQ = i === q;
    body.push(text(gx - 5, gy + ch * i + ch - 6.5, toks[i], { font: MONO, size: 6.5, fill: isQ ? EMBER : INK2, anchor: 'end', weight: isQ ? 700 : 400 }));
    row.forEach((v, j) => {
      const x = gx + cw * j, y = gy + ch * i;
      body.push(rect(x, y, cw, ch, { fill: '#fff' }));
      body.push(orect(x, y, cw, ch, EMBER, v, { stroke: RULE, sw: 0.5 }));
      body.push(text(x + cw / 2, y + ch - 6.5, v.toFixed(2), { font: MONO, size: 7, anchor: 'middle', weight: j === best[i] ? 700 : 400 }));
    });
    body.push(text(gx + cw * n + sumW / 2, gy + ch * i + ch - 6.5, row.reduce((a, b) => a + b, 0).toFixed(2), { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  });
  // vurgu: sorgu satırı ve sorgu → en koyu hücre
  body.push(rect(gx, gy + ch * q, cw * n, ch, { stroke: INK, sw: 0.9 }));
  body.push(rect(gx + cw * best[q], gy + ch * q, cw, ch, { stroke: INK, sw: 1.6 }));
  let y = gy + ch * n + 10;
  // ölçek
  const sc = [0.05, 0.10, 0.20, 0.30, 0.40, 0.55];
  body.push(caption(ox, y + 5, S.attn.weight));
  sc.forEach((v, k) => {
    const x = ox + 46 + k * 22;
    body.push(rect(x, y - 1, 20, 8, { fill: '#fff' }));
    body.push(orect(x, y - 1, 20, 8, EMBER, v, { stroke: RULE, sw: 0.5 }));
    body.push(text(x + 10, y + 13, v.toFixed(2), { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  });
  y += 24;
  // R038: kendi payı ve (kendisi hariç) en yüksek hücre; altyazı dizgisi iki durumu ayırır
  const otherBest = M[q].reduce((bi, v, j) => (j !== q && v > M[q][bi] ? j : bi), q === 0 ? 1 : 0);
  body.push(text(ox, y + 5, S.attn.caption(toks[q], M[q][best[q]].toFixed(2), toks[best[q]], M[q][q].toFixed(2), toks[otherBest], M[q][otherBest].toFixed(2)), { font: MONO, size: 6, fill: INK2 }));
  for (const ln of S.attn.note) { y += 9; body.push(text(ox, y + 5, ln, { font: MONO, size: 6, fill: INK2 })); }
  y += 10;
  body.push(text(ox, y + 5, S.attn.legend, { font: MONO, size: 6, fill: MUTED }));
  const H = y + 14;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [S.attn.mdTitle(demo.title), '', `| ${S.attn.mdHead} | ${toks.join(' | ')} | Σ |`, `|---|${'---|'.repeat(n + 1)}`,
    ...M.map((row, i) => `| ${toks[i]} | ${row.map((v, j) => (j === best[i] ? `**${v.toFixed(2)}**` : v.toFixed(2))).join(' | ')} | ${row.reduce((a, b) => a + b, 0).toFixed(2)} |`), ''].join('\n');
  return [{ name: 'attn', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.4 generate: iki film şeridi × 3 adım × 4 aday — R040 (2026-10-01)
// Satır 1 açgözlü (argmax): mevcut demo olasılıkları p, her adımda en yüksek. Satır 2 örnekleme, T = 1.5: z = ln p, q = softmax(z/T),
// seçim sabit tohumlu U dizisiyle ters-CDF (adım i → U[i mod 8]; ilk u < kümülatif). Kural ve U: print/kitap/qa/demo-data.json temp54.
const GEN_P = [[42, 28, 18, 12], [38, 30, 20, 12], [50, 25, 15, 10]];
function softmaxT(ps, T) { const z = ps.map((p) => Math.log(p)), m = Math.max(...z), e = z.map((v) => Math.exp((v - m) / T)), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); }
function generateFigure(demo, { lang }) {
  const S = STRINGS[lang], TEMP = DEMO.temp54, T = TEMP.T_ornekleme, U = TEMP.U;
  const GEN_STEPS = GEN_P.map((ps, s) => ps.map((p, k) => [S.generate.steps[s][k], p]));
  const W = 320, pad = 10, fgap = 8, fw = (W - 2 * pad - 2 * fgap) / 3, bh = 7, bgap = 3.2, labW = 34, pctW = 16;
  const barMax = fw - labW - pctW - 8;
  // satır başına: her adımda gösterilen olasılıklar (%) ve seçilen aday dizini
  const greedy = GEN_P.map((ps) => ({ q: ps, pick: ps.indexOf(Math.max(...ps)), u: null }));
  const sampled = GEN_P.map((ps, si) => {
    const q = softmaxT(ps, T), u = U[si % U.length]; let acc = 0, pick = q.length - 1;
    for (let i = 0; i < q.length; i++) { acc += q[i]; if (u < acc) { pick = i; break; } }
    return { q: q.map((v) => v * 100), pick, u, qExact: q };
  });
  const rows = [{ title: S.generate.greedy, runs: greedy }, { title: S.generate.sample(T), runs: sampled }];
  const body = [rect(0, 0, W, 0)];
  let y = pad;
  const sentences = [];
  rows.forEach((r) => {
    body.push(caption(pad, y + 6, r.title));
    y += 12;
    const picks = [];
    const fh = 10 + 4 * (bh + bgap) + 12;
    GEN_STEPS.forEach((cands, s) => {
      const fx = pad + s * (fw + fgap), fy = y, run = r.runs[s];
      body.push(rect(fx, fy, fw, fh, { fill: '#fff', stroke: RULE, sw: 0.6 }));
      body.push(caption(fx + 4, fy + 8, S.generate.step(s + 1)));
      if (run.u != null) body.push(text(fx + fw - 4, fy + 8, `U = ${run.u.toFixed(2)}`, { font: MONO, size: 6, fill: EMBER, anchor: 'end' }));
      picks.push(cands[run.pick][0]);
      const cmax = Math.max(...run.q);
      cands.forEach((c, k) => {
        const by = fy + 12 + k * (bh + bgap), chosen = k === run.pick, q = run.q[k];
        body.push(text(fx + labW, by + bh - 1.5, c[0], { size: 6.5, anchor: 'end', fill: chosen ? INK : INK2, weight: chosen ? 700 : 400 }));
        body.push(rect(fx + labW + 3, by, barMax, bh, { fill: '#efece4' }));
        body.push(rect(fx + labW + 3, by, barMax * q / cmax, bh, { fill: chosen ? EMBER : EMBER_SOFT }));
        body.push(text(fx + labW + 3 + barMax + 3, by + bh - 1.5, pct(Math.round(q), lang), { font: MONO, size: 6, fill: chosen ? EMBER : MUTED }));
      });
      const done = s === GEN_STEPS.length - 1;
      let sent = S.generate.prefix + picks.join(' ') + (done ? '.' : ' ▍');
      if (tw(sent, 7, 'serif') > fw - 8) sent = '… ' + picks.join(' ') + (done ? '.' : ' ▍');
      body.push(text(fx + 4, fy + fh - 4, sent, { font: SERIF, size: 7, fill: INK }));
    });
    y += fh + 4;
    const full = S.generate.prefix + picks.join(' ') + '.';
    sentences.push(full);
    body.push(caption(pad, y + 6, S.generate.result));
    body.push(text(pad + 34, y + 6.5, full, { font: SERIF, size: 9, fill: INK }));
    y += 10;
    body.push(text(pad + 34, y + 6, S.generate.chosen(picks.map((p, s) => `${p} ${pct(Math.round(r.runs[s].q[r.runs[s].pick]), lang)}`).join(' · ')), { font: MONO, size: 6, fill: MUTED }));
    y += 16;
  });
  body.push(text(pad, y + 2, S.generate.footer(T, U.slice(0, GEN_P.length).map((u) => u.toFixed(2)).join(', ')), { font: MONO, size: 6, fill: INK2 }));
  const H = y + 10;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [S.generate.mdTitle(demo.title), '', S.generate.mdRule(T), '', S.generate.mdHead(T), '|---|---|---|---|---|',
    ...GEN_STEPS.map((c, s) => `| ${s + 1} | ${c.map((k) => `${k[0]} ${pct(k[1], lang)}`).join(' · ')} | ${c[greedy[s].pick][0]} | ${c.map((k, i) => `${k[0]} ${(sampled[s].qExact[i] * 100).toFixed(1)}%`).join(' · ')} | ${sampled[s].u.toFixed(2)} → ${c[sampled[s].pick][0]} |`), '',
    S.generate.mdLow(sentences[0]), S.generate.mdHigh(sentences[1], T), ''].join('\n');
  return [{ name: 'generate', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.5 train: üç aşama tablosu
const KEEP_EMOJI = false; // duotone baskıda renkli emoji yok; yazar isterse true (BASKI notu)
function trainFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const W = 320, pad = 8, lab = 56, cgap = 4, cw = (W - 2 * pad - lab - 2 * cgap) / 3, inner = cw - 10;
  const stages = S.train.stages.map((s) => ({ ...s, out: KEEP_EMOJI ? s.out : s.out.replace(/\s*🙂/g, '') }));
  const rows = [
    { key: 'data', label: S.train.rowData, size: 6.5, font: 'sans', lh: 8 },
    { key: 'learns', label: S.train.rowLearns, size: 6.5, font: 'sans', lh: 8 },
    { key: 'out', label: S.train.rowOut, size: 7.5, font: 'serif', lh: 9, hi: true },
    { key: 'note', label: S.train.rowNote, size: 6.5, font: 'sans', lh: 8, italic: true },
  ];
  const body = [rect(0, 0, W, 0)];
  let y = pad;
  const colX = (j) => pad + lab + j * (cw + cgap);
  // başlık satırı
  stages.forEach((s, j) => {
    body.push(rect(colX(j), y, cw, 14, { fill: INK }));
    body.push(text(colX(j) + cw / 2, y + 9.5, s.name, { size: 7, fill: PAPER, anchor: 'middle', weight: 700 }));
  });
  y += 18;
  rows.forEach((r) => {
    const wrapped = stages.map((s) => wrap(s[r.key], r.size, inner, r.font));
    const nl = Math.max(...wrapped.map((l) => l.length), r.label.length);
    const rh = nl * r.lh + 8;
    body.push(caption(pad, y + 8, r.label[0], r.hi ? { fill: EMBER } : {}));
    r.label.slice(1).forEach((l, k) => body.push(text(pad, y + 8 + (k + 1) * 7.5, l, { size: 5.5, fill: MUTED, italic: true })));
    stages.forEach((s, j) => {
      body.push(rect(colX(j), y, cw, rh, { fill: r.hi ? '#fff' : 'none', stroke: r.hi ? EMBER : RULE, sw: r.hi ? 0.9 : 0.5 }));
      wrapped[j].forEach((l, k) => body.push(text(colX(j) + 4, y + 8 + k * r.lh, l, { font: r.font === 'serif' ? SERIF : SANS, size: r.size, fill: r.italic ? INK2 : INK, italic: !!r.italic })));
    });
    y += rh + 3;
  });
  // akış oku: aşamalar sırayla
  y += 2;
  body.push(line(colX(0) + cw / 2, y + 4, colX(2) + cw / 2, y + 4, { stroke: INK2, sw: 0.7, marker: true }));
  body.push(text(colX(1) + cw / 2, y + 12, S.train.flow, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
  const H = y + 18;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const T = S.train.stages;
  const md = [S.train.mdTitle(demo.title), '', `| | ${T.map((s) => s.name).join(' | ')} |`, '|---|---|---|---|',
    `| ${S.train.mdData} | ${T.map((s) => s.data).join(' | ')} |`, `| ${S.train.mdLearns} | ${T.map((s) => s.learns).join(' | ')} |`,
    `| ${S.train.mdOut} | ${T.map((s) => `“${s.out}”`).join(' | ')} |`, `| ${S.train.mdNote} | ${T.map((s) => s.note).join(' | ')} |`, '',
    S.train.mdEmoji(KEEP_EMOJI), ''].join('\n');
  return [{ name: 'train', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.6 diffuse: dokuz kare 8×8 (adım 0…8), sabit tohumlu rand birebir
const HEART = [0,1,1,0,0,1,1,0, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 0,1,1,1,1,1,1,0, 0,0,1,1,1,1,0,0, 0,0,0,1,1,0,0,0, 0,0,0,0,0,0,0,0];
const drand = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
export function diffuseFrame(step) {
  const frac = step / 8;
  const px = HEART.map((v, i) => (drand(i) < frac ? (v ? 'heart' : 'clear') : drand(i + 41) > 0.5 ? 'dark' : 'light'));
  return { step, pct: Math.round(frac * 100), revealed: px.filter((p) => p === 'heart' || p === 'clear').length, heart: px.filter((p) => p === 'heart').length, px };
}
function diffuseFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const steps = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const W = 320, pad = 7, cell = 3.8, fw = cell * 8, gap = 4;
  const fill = { heart: EMBER, clear: '#fff', dark: '#4a4539', light: '#d8d2c6' };
  const body = [rect(0, 0, W, 0)];
  // üst ok: ters süreç (üretim), soldan sağa
  let y = pad;
  const top = S.diffuse.reverse;
  body.push(caption(pad, y + 5, top, { fill: INK2 }));
  body.push(line(pad + top.length * (6.5 * 0.6 + 1.2) + 6, y + 3, W - pad, y + 3, { stroke: INK2, sw: 0.7, marker: true }));
  y += 12;
  const frames = steps.map(diffuseFrame);
  frames.forEach((fr, k) => {
    const fx = pad + k * (fw + gap), fy = y + 8;
    body.push(caption(fx + fw / 2, y + 5, S.diffuse.frame(fr.step), { size: 5.5, spacing: 0.5, anchor: 'middle' }));
    fr.px.forEach((p, i) => body.push(rect(fx + (i % 8) * cell, fy + Math.floor(i / 8) * cell, cell, cell, { fill: fill[p] })));
    body.push(rect(fx, fy, fw, fw, { stroke: RULE, sw: 0.5 }));
    body.push(text(fx + fw / 2, fy + fw + 8, pct(fr.pct, lang), { font: MONO, size: 6.5, anchor: 'middle', fill: fr.step === 8 ? EMBER : INK }));
    body.push(text(fx + fw / 2, fy + fw + 15, `${fr.revealed}/64`, { font: MONO, size: 6, anchor: 'middle', fill: MUTED })); // R082: ≥ 6
  });
  y += 8 + fw + 20;
  // alt ok: ileri süreç (gürültü ekleme), sağdan sola
  body.push(line(W - pad, y + 3, pad, y + 3, { stroke: INK2, sw: 0.7, marker: true }));
  body.push(text(W - pad, y + 12, S.diffuse.forward, { font: MONO, size: 6.5, fill: INK2, spacing: 1.2, anchor: 'end' }));
  y += 22;
  // açıklama: piksel türleri
  const leg = [[['heart'], S.diffuse.legHeart], [['clear'], S.diffuse.legClear], [['dark', 'light'], S.diffuse.legNoise]];
  let lx = pad;
  leg.forEach(([ks, l]) => {
    ks.forEach((k, i) => body.push(rect(lx + i * 7.5, y, 6, 6, { fill: fill[k], stroke: RULE, sw: 0.5 })));
    lx += ks.length * 7.5 + 2;
    body.push(text(lx, y + 5.5, l, { font: MONO, size: 5.5, fill: MUTED }));
    lx += tw(l, MIN_TEXT, 'mono') + 9; // çizilen punto (≥ MIN_TEXT) ile ölç
  });
  y += 10;
  const underL = wrapW(S.diffuse.under, 5.5, W - 2 * pad, 'mono'); // EN satırı sağ kenardan taşıyordu (R082 punto)
  underL.forEach((l, i) => body.push(text(pad, y + 5.5 + i * 7.6, l, { font: MONO, size: 5.5, fill: MUTED })));
  const H = y + 13 + (underL.length - 1) * 7.6;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [S.diffuse.mdTitle(demo.title), '', S.diffuse.mdHead, '|---|---|---|---|',
    ...frames.map((fr) => `| ${fr.step} | ${pct(fr.pct, lang)} | ${fr.revealed} | ${fr.heart} |`), '',
    S.diffuse.mdFormula, ''].join('\n');
  return [{ name: 'diffuse', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5.7 ctx: bağlam penceresi, metindeki tablo kareleri (0, 1, 4, 8, 9, 10, 12)
const CTX_MAX = 8;
function ctxFigure(demo, { lang }) {
  const S = STRINGS[lang];
  const POOL = S.ctx.pool;
  const frames = [0, 1, 4, 8, 9, 10, 12];
  const W = 320, pad = 10, chipH = 12, chipPad = 3, gap = 1.5;
  let fs = 6, xs;
  for (;;) { // tüm cümle tek satıra sığana dek yazı boyutunu düşür (kelimeler karelerde aynı sütunda kalsın)
    let x = pad; xs = POOL.map((w) => { const ww = tw(w, fs, 'sans') + chipPad * 2; const o = { x, w: ww }; x += ww + gap; return o; });
    if (x - gap <= W - pad || fs <= 4.5) break; fs -= 0.2;
  }
  const body = [rect(0, 0, W, 0)];
  let y = pad;
  body.push(text(pad, y + 5, S.ctx.title(CTX_MAX), { font: MONO, size: 6.5, fill: INK2 }));
  body.push(text(pad, y + 13.5, S.ctx.legend, { font: MONO, size: 5.5, fill: MUTED })); // başlığın altında ayrı satır (büyük puntoda çakışıyordu)
  y += 22;
  const rows = [];
  frames.forEach((n, k) => {
    const forgotten = Math.max(0, n - CTX_MAX), used = Math.min(n, CTX_MAX);
    body.push(caption(pad, y + 6, S.ctx.frame(k, n)));
    const st = n === 0 ? S.ctx.empty : forgotten ? S.ctx.full(used, CTX_MAX, forgotten) : n === CTX_MAX ? S.ctx.justFull(used, CTX_MAX) : S.ctx.partial(used, CTX_MAX);
    body.push(text(W - pad, y + 6, st, { font: MONO, size: 6, fill: forgotten ? EMBER : INK2, anchor: 'end', weight: forgotten ? 700 : 400 }));
    y += 9;
    if (n === 0) {
      body.push(rect(pad, y, W - 2 * pad, chipH, { stroke: RULE, sw: 0.5 }));
      body.push(text(pad + 4, y + chipH - 3.5, S.ctx.emptyChip, { size: fs, fill: MUTED, italic: true }));
    }
    for (let i = 0; i < n; i++) {
      const faded = i < forgotten, { x, w } = xs[i];
      body.push(rect(x, y, w, chipH, { fill: faded ? '#f4f2ee' : '#fff', stroke: faded ? RULE : INK, sw: faded ? 0.5 : 0.9 }));
      body.push(text(x + w / 2, y + chipH - 3.5, POOL[i], { size: fs, anchor: 'middle', fill: faded ? MUTED : INK }));
    }
    if (n > 0) { // pencere altı vurgu çizgisi
      const a = xs[forgotten], b = xs[n - 1];
      body.push(line(a.x, y + chipH + 2, b.x + b.w, y + chipH + 2, { stroke: EMBER, sw: 1.2 }));
    }
    y += chipH + 8;
    rows.push({ n, inW: POOL.slice(forgotten, n).join(' ') || S.ctx.emptyChip, out: POOL.slice(0, forgotten).join(' ') });
  });
  body.push(text(pad, y + 3, S.ctx.line(CTX_MAX), { font: MONO, size: 5.5, fill: MUTED }));
  const H = y + 10;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [S.ctx.mdTitle(demo.title), '', S.ctx.mdSentence(POOL.join(' '), CTX_MAX), '',
    S.ctx.mdHead, '|---|---|---|',
    ...rows.map((r) => `| ${r.n} | ${r.inW} | ${r.out} |`), ''].join('\n');
  return [{ name: 'ctx', svg: svg(W, H, body.join('\n')), md }];
}

export const FIGURES = { token: tokenFigure, embed: embedFigure, attn: attnFigure, generate: generateFigure, train: trainFigure, diffuse: diffuseFigure, ctx: ctxFigure };

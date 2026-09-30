// Bölüm 4 figürleri — Atlas-Kitap.dc.html renderVals() neuron/ffnet/backprop/conv/rnn/gan dallarıyla aynı sayılar.
// Etiketler ve veriler iki dilde ../strings/M04.mjs içinden (S = STRINGS[lang]).
import { INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption, pct } from '../lib.mjs';
import STRINGS from '../strings/M04.mjs';

const sig = (z) => 1 / (1 + Math.exp(-z));
const fmt = (v, d = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d); // tipografik eksi
const hexA = (a) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
const emberA = (a) => EMBER + hexA(a), inkA = (a) => INK + hexA(a);
const IMG_DARK = '#3a352a', IMG_LIGHT = '#e8e3d8';

// ---------------------------------------------------------------- 4.1 Tek nöron: şema + hesap
// w = [0.7, −0.5, 0.9], b = −0.3, başlangıç x = [0.6, 0.3, 0.8] → z = 0.69, sigmoid 0.666, ReLU 0.690 (ateşler).
function neuronFigure(demo, { lang }) {
  const S = STRINGS[lang].neuron;
  const w = [0.7, -0.5, 0.9], b = -0.3, xs = [0.6, 0.3, 0.8];
  const z = w[0] * xs[0] + w[1] * xs[1] + w[2] * xs[2] + b, a = sig(z), relu = Math.max(0, z);
  const fired = a > 0.5, state = fired ? 'fired' : 'quiet';
  const W = 320, H = 158;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const yIn = [30, 60, 90], trackX = 12, trackW = 56, sumX = 126, boxW = 48, boxY = 42, boxH = 34, cy = 59, gap = 38;
  body.push(caption(12, 14, S.inputs), caption(sumX, 14, S.sum), caption(sumX + boxW + gap, 14, S.activation), caption(308, 14, S.output, { anchor: 'end' }));
  const sub = ['x₁', 'x₂', 'x₃'];
  yIn.forEach((y, i) => {
    body.push(text(trackX, y - 5, `${sub[i]} = ${xs[i].toFixed(2)}`, { font: MONO, size: 6.5, fill: INK }));
    body.push(rect(trackX, y, trackW, 3.5, { fill: '#e2ddd2' }));
    body.push(rect(trackX, y, trackW * xs[i], 3.5, { fill: EMBER }));
    body.push(circle(trackX + trackW * xs[i], y + 1.75, 2.6, { fill: '#fff', stroke: EMBER, sw: 1 }));
    const x1 = trackX + trackW + 6, y1 = y + 1.75, x2 = sumX - 2, y2 = cy;
    body.push(line(x1, y1, x2, y2, { marker: true }));
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dy = i === 2 ? 9 : -4;
    body.push(text(mx, my + dy, `× ${fmt(w[i], 1)}`, { font: MONO, size: 6.5, fill: EMBER, anchor: 'middle' }));
  });
  // toplam kutusu
  body.push(rect(sumX, boxY, boxW, boxH, { fill: '#fff', stroke: INK, sw: 0.9 }));
  body.push(text(sumX + boxW / 2, boxY + 15, S.sumBox, { size: 9, weight: 700, anchor: 'middle' }));
  body.push(text(sumX + boxW / 2, boxY + 27, `b = ${fmt(b, 1)}`, { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  // aktivasyon kutusu
  const actX = sumX + boxW + gap;
  body.push(line(sumX + boxW, cy, actX - 2, cy, { marker: true }));
  body.push(text((sumX + boxW + actX) / 2, cy - 5, `z = ${fmt(z)}`, { font: MONO, size: 6, fill: EMBER, anchor: 'middle' }));
  body.push(rect(actX, boxY, boxW, boxH, { fill: '#fff', stroke: INK, sw: 0.9 }));
  body.push(text(actX + boxW / 2, boxY + 16, S.phi, { font: SERIF, size: 13, italic: true, anchor: 'middle' }));
  body.push(text(actX + boxW / 2, boxY + 27, S.actFns, { font: MONO, size: 5.5, fill: INK2, anchor: 'middle' }));
  // çıktı
  const outX = 300;
  body.push(line(actX + boxW, cy, outX - 10, cy, { marker: true }));
  body.push(circle(outX, cy, 8, { fill: fired ? EMBER : '#fff', stroke: EMBER, sw: 1 }));
  body.push(text(outX, cy + 18, a.toFixed(3), { font: MONO, size: 6.5, fill: INK, anchor: 'middle' }));
  body.push(text(outX + 8, cy + 29, S.verdict[state], { font: SERIF, size: 8.5, fill: fired ? EMBER : MUTED, anchor: 'end' }));
  // hesap paneli
  const py = 104;
  body.push(rect(12, py, 296, 46, { fill: '#fff', stroke: RULE, sw: 0.6 }));
  const prods = xs.map((x, i) => `${fmt(w[i], 1)} × ${x.toFixed(2)} = ${fmt(w[i] * x)}`);
  body.push(text(20, py + 13, prods.join('  ·  '), { font: MONO, size: 6.5, fill: INK2 }));
  body.push(text(20, py + 26, `${S.weightedSum} = ${fmt(w[0] * xs[0])} ${w[1] * xs[1] < 0 ? '−' : '+'} ${Math.abs(w[1] * xs[1]).toFixed(2)} + ${fmt(w[2] * xs[2])} ${b < 0 ? '−' : '+'} ${Math.abs(b).toFixed(1)} = ${fmt(z)}`, { font: MONO, size: 6.5, fill: INK }));
  body.push(text(20, py + 39, `sigmoid(${fmt(z)}) = ${a.toFixed(3)} > 0.5   ·   ReLU(${fmt(z)}) = ${relu.toFixed(3)} > 0`, { font: MONO, size: 6.5, fill: INK }));
  body.push(text(300, py + 39, S.arrow[state], { font: MONO, size: 6.5, fill: EMBER, anchor: 'end', weight: 700 }));
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', `w = [${w.map((v) => fmt(v, 1)).join(', ')}], b = ${fmt(b, 1)}, x = [${xs.map((v) => v.toFixed(2)).join(', ')}]`, '',
    S.mdHead, '|---|---|---|---|---|---|---|',
    `| ${xs.map((v) => v.toFixed(2)).join(' | ')} | ${fmt(z)} | ${a.toFixed(3)} | ${relu.toFixed(3)} | ${S.mdState[state]} |`, ''].join('\n');
  return [{ name: 'neuron', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4.2 İleri besleme: iki panel (girdi [1,0,1] ve [0,1,0])
const W1 = [[0.6, -0.4, 0.8], [0.5, 0.7, -0.3], [-0.6, 0.5, 0.6], [0.3, -0.7, 0.5]];
const W2 = [[0.7, -0.5, 0.6, 0.4], [-0.4, 0.6, 0.5, -0.6]];
function ffRun(ins) {
  const hid = W1.map((row) => sig(row[0] * ins[0] + row[1] * ins[1] + row[2] * ins[2]));
  const outs = W2.map((row) => sig(row.reduce((a, wv, j) => a + wv * hid[j], 0)));
  return { ins, hid, outs };
}
function ffPanel(ox, oy, run, S) {
  // ekran SVG'si 300×200 → 0.5 ölçek: girdi x=23, gizli x=75, çıktı x=127
  const inX = ox + 23, hX = ox + 75, oX = ox + 127, r = 7, sy = (y) => oy + 4 + y * 1.3;
  const inY = [30, 50, 70].map(sy), hY = [20, 40, 60, 80].map(sy), oY = [40, 60].map(sy);
  const b = [caption(ox, oy + 6, S.input(run.ins.join(', ')))];
  const edge = (x1, y1, x2, y2, act) => b.push(line(x1, y1, x2, y2, { stroke: act > 0.6 ? INK : RULE, sw: 0.2 + act * 0.8 }));
  inY.forEach((y1, i) => hY.forEach((y2) => edge(inX, y1, hX, y2, run.ins[i])));
  hY.forEach((y1, j) => oY.forEach((y2) => edge(hX, y1, oX, y2, run.hid[j])));
  const node = (x, y, act, name, win) => {
    b.push(circle(x, y, r, { fill: '#fff' }));
    b.push(circle(x, y, r, { fill: emberA(act), stroke: win ? INK : EMBER, sw: win ? 1.6 : 0.8 }));
    b.push(text(x, y + 2, name, { font: MONO, size: 5.5, fill: act > 0.55 ? '#fff' : INK, anchor: 'middle', weight: 700 }));
  };
  const winner = run.outs[0] >= run.outs[1] ? 0 : 1;
  inY.forEach((y, i) => { node(inX, y, run.ins[i], `x${'₁₂₃'[i]}`); b.push(text(inX - r - 3, y + 2, run.ins[i], { font: MONO, size: 6, fill: INK2, anchor: 'end' })); });
  hY.forEach((y, j) => { node(hX, y, run.hid[j], S.hidden(j + 1)); b.push(text(hX, y - r - 3, run.hid[j].toFixed(2), { font: MONO, size: 5.5, fill: INK2, anchor: 'middle' })); });
  oY.forEach((y, k) => { node(oX, y, run.outs[k], S.out(k + 1), k === winner); b.push(text(oX + r + 3, y + 2, run.outs[k].toFixed(2), { font: MONO, size: 6, fill: k === winner ? INK : INK2, anchor: 'start', weight: k === winner ? 700 : 400 })); });
  [inX, hX, oX].forEach((x, i) => b.push(text(x, oy + 126, S.layers[i], { font: MONO, size: 6, fill: MUTED, anchor: 'middle' })));
  b.push(text(ox + 150, oy + 6, S.prediction(winner + 1), { font: MONO, size: 6.5, fill: EMBER, anchor: 'end' }));
  return b.join('\n');
}
function ffnetFigure(demo, { lang }) {
  const S = STRINGS[lang].ffnet;
  const runs = [ffRun([1, 0, 1]), ffRun([0, 1, 0])];
  const pw = 150, ph = 130, pad = 6, gap = 8, W = pad * 2 + pw * 2 + gap, H = ph + 10 * 2;
  const body = [rect(0, 0, W, H, { fill: PAPER }), ffPanel(pad, 10, runs[0], S), ffPanel(pad + pw + gap, 10, runs[1], S)];
  body.push(line(pad + pw + gap / 2, 14, pad + pw + gap / 2, 6 + ph, { stroke: RULE, sw: 0.6, dash: '1.5 2' }));
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', S.mdRows1 + W1.map((r, i) => `${S.hidden(i + 1)} [${r.map((v) => fmt(v, 1)).join(', ')}]`).join('; '),
    S.mdRows2 + W2.map((r, i) => `${S.out(i + 1)} [${r.map((v) => fmt(v, 1)).join(', ')}]`).join('; '), '',
    S.mdHead, '|---|---|---|---|---|---|---|---|',
    ...runs.map((r) => `| [${r.ins.join(', ')}] | ${r.hid.map((v) => v.toFixed(2)).join(' | ')} | ${r.outs.map((v) => v.toFixed(2)).join(' | ')} | ${S.out(r.outs[0] >= r.outs[1] ? 1 : 2)} |`), ''].join('\n');
  return [{ name: 'ffnet', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4.3 Geri yayılım: 9 kare (tur 0–8), hata = 0.43·0.6ʳ, çıktı = 0.80 − hata
function backpropFigure(demo, { lang }) {
  const S = STRINGS[lang].backprop;
  const TARGET = 0.8;
  const rounds = Array.from({ length: 9 }, (_, r) => { const err = 0.43 * Math.pow(0.6, r); return { r, err, out: TARGET - err, pct: Math.round((TARGET - err) * 100) }; });
  const cols = 3, fw = 96, fh = 66, pad = 6, gx = 8, gy = 8;
  const rows = Math.ceil(rounds.length / cols);
  const W = pad * 2 + cols * fw + (cols - 1) * gx, H = 10 * 2 + rows * fh + (rows - 1) * gy;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  rounds.forEach((rd, i) => {
    const ox = pad + (i % cols) * (fw + gx), oy = 10 + Math.floor(i / cols) * (fh + gy);
    body.push(caption(ox, oy + 7, S.round(rd.r)));
    body.push(text(ox + fw, oy + 7, S.error(rd.err.toFixed(2)), { font: MONO, size: 6.5, fill: EMBER, anchor: 'end' }));
    // küçük ağ: 2 → 3 → 1 düğüm, çıkıştan girişe dönen hata oku (kalınlık ∝ hata)
    const nx = [ox + 6, ox + 24, ox + 42], ny = [[oy + 22, oy + 38], [oy + 16, oy + 30, oy + 44], [oy + 30]];
    for (let l = 0; l < 2; l++) ny[l].forEach((y1) => ny[l + 1].forEach((y2) => body.push(line(nx[l], y1, nx[l + 1], y2, { stroke: RULE, sw: 0.5 }))));
    ny.forEach((ys, l) => ys.forEach((y) => body.push(circle(nx[l], y, 2.4, { fill: l === 2 ? EMBER : '#fff', stroke: INK, sw: 0.6 }))));
    const aw = 0.4 + rd.err * 4; // 0.43 → 2.1pt, 0.01 → 0.44pt
    body.push(`<path d="M${f1(nx[2])} ${f1(oy + 36)} Q${f1(nx[1])} ${f1(oy + 56)} ${f1(nx[0] + 1)} ${f1(oy + 45)}" fill="none" stroke="${EMBER}" stroke-width="${f1(aw)}" marker-end="url(#arrow)"/>`);
    body.push(text(nx[1], oy + 60, S.errorArrow, { font: MONO, size: 5.5, fill: EMBER, anchor: 'middle' }));
    // çıktı çubuğu + hedef çizgisi (%80)
    const bx = ox + 68, by = oy + 17, bw = 12, bh = 40;
    body.push(rect(bx, by, bw, bh, { fill: '#ebe6db' }));
    body.push(rect(bx, by + bh - bh * rd.out, bw, bh * rd.out, { fill: EMBER }));
    body.push(line(bx - 5, by + bh - bh * TARGET, bx + bw + 5, by + bh - bh * TARGET, { stroke: INK, sw: 0.9 }));
    body.push(text(bx + bw + 7, by + bh - bh * TARGET + 2, pct(80, lang), { font: MONO, size: 5.5, fill: INK }));
    body.push(text(bx + bw / 2, by + bh + 9, pct(rd.pct, lang), { font: MONO, size: 6.5, fill: INK, anchor: 'middle', weight: 700 }));
    if (i === 0) { body.push(text(bx + bw / 2, by - 3, S.output, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' })); body.push(text(bx + bw + 7, by + bh - bh * TARGET - 4, S.target, { font: MONO, size: 5, fill: MUTED })); }
  });
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', S.mdRule, '', S.mdHead, '|---|---|---|---|',
    ...rounds.map((rd) => `| ${rd.r} | ${rd.err.toFixed(2)} | ${pct(rd.pct, lang)} | ${S.points(Math.round(rd.err * 100))} |`), ''].join('\n');
  return [{ name: 'backprop', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4.4 Evrişim: iki çekirdek × (iki durak + tam harita)
const CONV_IMG = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) CONV_IMG.push(c === 3 || r === 3 ? 1 : 0);
const KERNELS = {
  vert: { K: [[1, 0, -1], [1, 0, -1], [1, 0, -1]], stops: [1, 3] },
  horiz: { K: [[1, 1, 1], [0, 0, 0], [-1, -1, -1]], stops: [5, 15] },
};
function convMap(K) {
  const feat = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { let s = 0; for (let kr = 0; kr < 3; kr++) for (let kc = 0; kc < 3; kc++) s += K[kr][kc] * CONV_IMG[(r + kr) * 7 + (c + kc)]; feat.push(s); }
  return feat;
}
const mapFill = (v) => (v > 0 ? emberA(0.25 + 0.75 * Math.min(1, Math.abs(v) / 3)) : v < 0 ? inkA(0.2 + 0.65 * Math.min(1, Math.abs(v) / 3)) : '#fff');
function convGrid(b, ox, oy, n, cell, fill, o = {}) {
  for (let i = 0; i < n * n; i++) {
    const r = Math.floor(i / n), c = i % n;
    b.push(rect(ox + c * (cell + 1), oy + r * (cell + 1), cell, cell, { fill: fill(i, r, c), stroke: o.stroke || 'none', sw: 0.4 }));
    if (o.label) { const s = o.label(i, r, c); if (s != null) b.push(text(ox + c * (cell + 1) + cell / 2, oy + r * (cell + 1) + cell * 0.72, s, { font: MONO, size: o.size || 6, fill: o.textFill ? o.textFill(i) : INK, anchor: 'middle' })); }
  }
  return n * cell + (n - 1);
}
function convFigure(demo, { lang }) {
  const S = STRINGS[lang].conv;
  const W = 320, pad = 10, cs = 6.5, cb = 10, ck = 8, rowH = 106;
  const H = pad + rowH * 2 + 16;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const tables = [];
  Object.entries(KERNELS).forEach(([key, kd], ki) => {
    const oy = pad + ki * rowH, feat = convMap(kd.K), label = S.kernels[key];
    body.push(caption(pad, oy + 7, label));
    let x = pad, gy = oy + 20;
    // çekirdek
    const kw = convGrid(body, x, gy + 12, 3, ck, () => '#fff', { stroke: INK, label: (i, r, c) => fmt(kd.K[r][c], 0).replace('.', ''), size: 6 });
    body.push(text(x + kw / 2, gy + 7, S.kernel, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
    x += kw + 9;
    // iki durak: görüntü + pencere + o ana kadar dolan harita
    kd.stops.forEach((pos) => {
      const wr = Math.floor(pos / 5), wc = pos % 5;
      const iw = convGrid(body, x, gy + 12, 7, cs, (i) => (CONV_IMG[i] ? IMG_DARK : IMG_LIGHT));
      body.push(rect(x + wc * (cs + 1) - 0.6, gy + 12 + wr * (cs + 1) - 0.6, 3 * cs + 2 + 1.2, 3 * cs + 2 + 1.2, { stroke: EMBER, sw: 1.2 }));
      body.push(text(x + iw / 2, gy + 7, S.image, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
      const mx = x + iw + 5, my = gy + 12 + (7 * cs + 6 - (5 * cs + 4)) / 2;
      const mw = convGrid(body, mx, my, 5, cs, (i) => (i <= pos ? mapFill(feat[i]) : '#f4efe6'), { stroke: RULE });
      body.push(rect(mx + wc * (cs + 1) - 0.6, my + wr * (cs + 1) - 0.6, cs + 1.2, cs + 1.2, { stroke: EMBER, sw: 1.2 }));
      body.push(text(mx + mw / 2, gy + 7, S.map, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
      body.push(text(x + (iw + 5 + mw) / 2, gy + 12 + 7 * cs + 6 + 9, S.stop(pos + 1, fmt(feat[pos], 0)), { font: MONO, size: 6.5, fill: INK, anchor: 'middle', weight: 700 }));
      x += iw + 5 + mw + 10;
    });
    // tam harita (25 durak), değerler hücrede
    const fw = convGrid(body, x, gy + 12, 5, cb, (i) => mapFill(feat[i]), { stroke: RULE, label: (i) => fmt(feat[i], 0), size: 6, textFill: (i) => (Math.abs(feat[i]) >= 2 ? '#fff' : feat[i] === 0 ? MUTED : INK) });
    body.push(text(x + fw / 2, gy + 7, S.fullMap, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
    tables.push(`## ${label}`, '', '| | | | | |', '|---|---|---|---|---|', ...[0, 1, 2, 3, 4].map((r) => `| ${feat.slice(r * 5, r * 5 + 5).map((v) => fmt(v, 0)).join(' | ')} |`), '');
  });
  // açıklama
  const ly = H - 6;
  body.push(rect(pad, ly - 6, 7, 6, { fill: mapFill(3) }), text(pad + 10, ly - 1, S.legendPlus, { font: MONO, size: 5.5, fill: INK2 }));
  body.push(rect(pad + 92, ly - 6, 7, 6, { fill: mapFill(-3) }), text(pad + 102, ly - 1, S.legendMinus, { font: MONO, size: 5.5, fill: INK2 }));
  body.push(text(W - pad, ly - 1, S.legendMag, { font: MONO, size: 5.5, fill: MUTED, anchor: 'end' }));
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', S.mdNote, '', ...tables].join('\n');
  return [{ name: 'conv', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4.5 RNN: 4 kare (0–3 kelime işlendi), 8 çubuk
function rnnHidden(step) {
  return Array.from({ length: 8 }, (_, j) => { let v = 0; for (let k = 0; k < step; k++) v += Math.abs(Math.sin((k + 1) * 1.7 + j * 0.9)); v = step ? 0.2 + 0.8 * Math.abs(Math.sin(v)) : 0.04; return Math.round(v * 100); });
}
function rnnFigure(demo, { lang }) {
  const S = STRINGS[lang].rnn, words = S.words;
  const frames = [0, 1, 2, 3].map((s) => ({ step: s, h: rnnHidden(s) }));
  const cols = 2, fw = 150, fh = 98, pad = 6, gx = 8, gy = 10;
  const W = pad * 2 + cols * fw + gx, H = 10 * 2 + 2 * fh + gy;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  frames.forEach((fr, i) => {
    const ox = pad + (i % cols) * (fw + gx), oy = 10 + Math.floor(i / cols) * (fh + gy);
    body.push(caption(ox, oy + 7, S.frame(fr.step)));
    body.push(text(ox + fw, oy + 7, S.processed(fr.step), { font: MONO, size: 6.5, fill: fr.step ? EMBER : INK2, anchor: 'end' }));
    // kelime şeridi
    let wx = ox; const wy = oy + 14, wh = 14;
    words.forEach((wd, k) => {
      const ww = wd.length * 4.2 + 10, done = k < fr.step;
      body.push(rect(wx, wy, ww, wh, { fill: done ? EMBER : '#fff', stroke: done ? EMBER : INK, sw: 0.7 }));
      body.push(text(wx + ww / 2, wy + 9.5, wd, { size: 7, fill: done ? '#fff' : INK, anchor: 'middle', weight: done ? 600 : 400 }));
      if (k === fr.step - 1) body.push(`<path d="M${f1(wx + ww / 2 - 3)} ${f1(wy + wh + 2)} L${f1(wx + ww / 2)} ${f1(wy + wh + 6)} L${f1(wx + ww / 2 + 3)} ${f1(wy + wh + 2)}z" fill="${EMBER}"/>`);
      wx += ww + 4;
    });
    // gizli durum çubukları
    const bx = ox + 2, by = oy + 41, bh = 38, bw = 10, bg = 5;
    body.push(text(ox + fw, by + bh + 8, S.memory, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
    body.push(line(bx - 3, by + bh, bx + 8 * (bw + bg) - bg + 3, by + bh, { stroke: RULE, sw: 0.6 }));
    fr.h.forEach((v, j) => {
      const x = bx + j * (bw + bg), hh = (v / 100) * bh;
      body.push(rect(x, by, bw, bh, { fill: '#ebe6db' }));
      body.push(rect(x, by + bh - hh, bw, hh, { fill: EMBER }));
      body.push(text(x + bw / 2, by + bh - hh - 2, v, { font: MONO, size: 5.5, fill: INK2, anchor: 'middle' }));
      body.push(text(x + bw / 2, by + bh + 8, `h${'₁₂₃₄₅₆₇₈'[j]}`, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
    });
  });
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', S.mdHead, '|---|---|---|---|---|---|---|---|---|',
    ...frames.map((fr) => `| ${fr.step ? words[fr.step - 1] : S.empty} | ${fr.h.join(' | ')} |`), '',
    S.mdNote, ''].join('\n');
  return [{ name: 'rnn', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4.6 GAN: 9 kare (tur 0–8), sabit tohumlu piksel gürültüsü + D olasılığı
const ganRand = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const GAN_TARGET = Array.from({ length: 64 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8, dx = c - 3.5, dy = r - 3.5; return dx * dx + dy * dy < 7 ? 1 : 0; });
function ganRound(r) {
  const frac = r / 8, prob = Math.max(6, Math.round(95 - r * 11));
  const px = GAN_TARGET.map((tg, i) => (ganRand(i) < frac ? tg : ganRand(i + 100) > 0.5 ? 1 : 0));
  const match = px.reduce((a, v, i) => a + (v === GAN_TARGET[i] ? 1 : 0), 0);
  return { r, prob, fake: prob > 50, px, match };
}
function ganFigure(demo, { lang }) {
  const S = STRINGS[lang].gan;
  const rounds = Array.from({ length: 9 }, (_, r) => ganRound(r));
  const cols = 3, fw = 96, fh = 64, pad = 8, gx = 8, gy = 8, cell = 5, head = 44;
  const rows = 3, W = pad * 2 + cols * fw + (cols - 1) * gx, H = pad * 2 + head + rows * fh + (rows - 1) * gy;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // başlık şeridi: hedef görüntü + açıklama
  const pix = (ox, oy, px, c) => { for (let i = 0; i < 64; i++) body.push(rect(ox + (i % 8) * (c + 0.6), oy + Math.floor(i / 8) * (c + 0.6), c, c, { fill: px[i] ? IMG_DARK : IMG_LIGHT })); return 8 * c + 7 * 0.6; };
  const tw = pix(pad, pad + 8, GAN_TARGET, 3.4);
  body.push(caption(pad + tw + 8, pad + 7, S.target));
  S.intro.forEach((s, i) => body.push(text(pad + tw + 8, pad + 18 + i * 10, s, { font: MONO, size: 6, fill: INK2 })));
  rounds.forEach((rd, i) => {
    const ox = pad + (i % cols) * (fw + gx), oy = pad + head + Math.floor(i / cols) * (fh + gy);
    body.push(caption(ox, oy + 7, S.round(rd.r)));
    const iw = pix(ox, oy + 12, rd.px, cell);
    body.push(text(ox + iw / 2, oy + fh - 1, S.generator, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
    const tx = ox + iw + 6;
    body.push(text(tx, oy + 22, S.fakeProb, { font: MONO, size: 5.5, fill: MUTED }));
    body.push(text(tx, oy + 34, pct(rd.prob, lang), { font: MONO, size: 11, fill: rd.fake ? EMBER : INK, weight: 700 }));
    body.push(text(tx, oy + 46, S.verdict[rd.fake ? 'fake' : 'real'], { font: SERIF, size: 9.5, fill: rd.fake ? EMBER : INK }));
    body.push(text(tx, oy + 56, S.matching(rd.match), { font: MONO, size: 5.5, fill: INK2 }));
  });
  const md = [`# ${S.mdTitle} — ${demo.title}`, '', S.mdRule, '',
    S.mdHead, '|---|---|---|---|',
    ...rounds.map((rd) => `| ${rd.r} | ${pct(rd.prob, lang)} | ${S.verdict[rd.fake ? 'fake' : 'real']} | ${rd.match} / 64 |`), ''].join('\n');
  return [{ name: 'gan', svg: svg(W, H, body.join('\n')), md }];
}

export const FIGURES = { neuron: neuronFigure, ffnet: ffnetFigure, backprop: backpropFigure, conv: convFigure, rnn: rnnFigure, gan: ganFigure };

// Bölüm 6 figürleri
// Veri Atlas-Kitap.dc.html renderVals() dalından birebir alınmıştır (prompt, rag, agent, arch, sector); etiketler ve veri strings/M06.mjs.
import { INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption, up, pct } from '../lib.mjs';
import STRINGS from '../strings/M06.mjs';

// ---------------------------------------------------------------- ortak: satıra bölme
// max: satır başına en çok karakter (SANS 7pt için ≈ genişlik / 3.9). Açık satır sonu (\n) korunur.
const wrap = (s, max) => {
  const out = [];
  for (const seg of String(s).split('\n')) {
    let cur = '';
    for (const w of seg.split(/\s+/).filter(Boolean)) {
      if (!cur) cur = w; else if ((cur + ' ' + w).length <= max) cur += ' ' + w; else { out.push(cur); cur = w; }
    }
    out.push(cur);
  }
  return out;
};
// Paragraf: (x, y) sol üst köşe; döndürür { svg, h }. lh satır aralığı.
const para = (x, y, s, max, o = {}) => {
  const size = o.size || 7, lh = o.lh || size * 1.3, lines = wrap(s, max);
  return { svg: lines.map((l, i) => text(x, y + size + i * lh, l, { ...o, size })).join('\n'), h: lines.length * lh, n: lines.length };
};
// Ortalama karakter genişliği / punto (dil başına; EN metinde dar harf oranı TR'den düşük değil, aynı katsayı yeterli)
const CPL_K = { tr: 0.55, en: 0.55 };
const cpl = (w, size = 7, lang = 'tr') => Math.floor(w / (size * CPL_K[lang])); // genişliğe göre satır karakter sayısı
const BIDIR = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${o.stroke || INK}" stroke-width="${o.sw || 0.8}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`;

// ---------------------------------------------------------------- 6.1 İstem: yığılı parçalar + kalite merdiveni + üç cevap
const promptQ = (n) => Math.min(100, 40 + n * 15);
const promptTier = (q) => (q >= 85 ? 'high' : q >= 60 ? 'mid' : 'low');

function promptFigure(demo, { lang }) {
  const S = STRINGS[lang], P = S.prompt;
  const W = 320, pad = 10;
  const body = [];
  // --- sol sütun: yığılı istem (üstte eklenen parçalar, altta taban)
  const lx = pad, lw = 150, tx = lx + 6, tmax = cpl(lw - 12, 7, lang);
  body.push(caption(lx, 17, P.stackTitle));
  let y = 24;
  const blocks = [...P.parts.map((p) => ({ ...p, base: false })), { name: P.baseName, text: P.base, base: true }];
  blocks.forEach((b, i) => {
    const p = para(tx, y + 11, b.text, tmax, { size: 7, lh: 8.6, fill: INK });
    const h = 12 + p.h + 4;
    body.push(rect(lx, y, lw, h, { fill: b.base ? EMBER_SOFT : '#fff', stroke: b.base ? EMBER : INK, sw: b.base ? 1 : 0.7 }));
    body.push(caption(tx, y + 8, up(b.name, lang), { fill: b.base ? EMBER : MUTED, size: 6 }));
    if (!b.base) body.push(text(lx + lw - 5, y + 8, P.partTag(i + 1), { font: MONO, size: 6, fill: MUTED, anchor: 'end' })); // R082: ≥ 6
    body.push(p.svg);
    y += h + 2;
  });
  const leftBottom = y;
  // --- sağ sütun: kalite merdiveni 0 → 4 parça
  const rx = pad + lw + 14, rw = W - pad - rx, bx = rx, bw = rw - 4; // çubuk: %100 = bw pt
  body.push(caption(rx, 17, P.ladderTitle));
  const ladderTop = 26, rowH = 21;
  const steps = [0, 1, 2, 3, 4].map((n) => ({ n, q: promptQ(n), tier: promptTier(promptQ(n)), add: n === 0 ? P.baseOnly : P.addPart(P.parts[n - 1].name) }));
  steps.forEach((s, i) => {
    const ry = ladderTop + i * rowH;
    body.push(text(bx, ry + 6, `n = ${s.n}  ${s.add}`, { font: MONO, size: 6, fill: INK2 }));
    body.push(text(bx + bw, ry + 6, `${pct(s.q, lang)} · ${P.tier[s.tier]}`, { font: MONO, size: 6, fill: s.tier === 'high' ? EMBER : INK2, anchor: 'end', weight: 700 }));
    body.push(rect(bx, ry + 9, bw, 7, { fill: 'rgba(31,31,31,0.08)' }));
    body.push(rect(bx, ry + 9, (bw * s.q) / 100, 7, { fill: s.tier === 'low' ? INK2 : s.tier === 'mid' ? MUTED : EMBER }));
    [60, 85].forEach((th) => body.push(line(bx + (bw * th) / 100, ry + 8, bx + (bw * th) / 100, ry + 17.5, { stroke: INK, sw: 0.5, dash: '1.5 1.5' })));
  });
  const ladderBottom = ladderTop + steps.length * rowH;
  [60, 85].forEach((th) => {
    const x = bx + (bw * th) / 100;
    body.push(text(x, ladderBottom + 8, `${th}`, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  });
  body.push(text(bx, ladderBottom + 8, '0', { font: MONO, size: 6, fill: MUTED }));
  body.push(text(bx + bw, ladderBottom + 8, '100', { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  const note = para(rx, ladderBottom + 14, P.note, cpl(rw, 6.5, lang), { size: 6.5, lh: 8, fill: INK2 });
  body.push(note.svg);
  // --- alt: üç düzeyin cevabı
  y = Math.max(leftBottom, ladderBottom + 14 + note.h) + 10;
  body.push(caption(pad, y + 6, P.answersTitle));
  y += 12;
  const fw = W - pad * 2, fmax = cpl(fw - 12, 7, lang);
  const tiers = [
    { k: 'low', hi: false },
    { k: 'mid', hi: false },
    { k: 'high', hi: true },
  ];
  tiers.forEach((tr) => {
    const p = para(pad + 6, y + 11, P.resp[tr.k], fmax, { size: 7, lh: 8.6 });
    const h = 12 + p.h + 4;
    body.push(rect(pad, y, fw, h, { fill: '#fff', stroke: tr.hi ? EMBER : RULE, sw: tr.hi ? 1 : 0.6 }));
    body.push(caption(pad + 6, y + 8, P.tierBox[tr.k], { fill: tr.hi ? EMBER : MUTED, size: 6 }));
    body.push(p.svg);
    y += h + 4;
  });
  const H = Math.ceil(y + 6);
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [`# ${P.md.title} — ${demo.title}`, '', P.md.partsHead, '|---|---|', `| ${P.baseName} | ${P.base} |`,
    ...P.parts.map((p) => `| ${p.name} | ${p.text} |`), '',
    P.md.stepsHead, '|---|---|---|---|',
    ...steps.map((s) => `| ${s.n} | ${pct(s.q, lang)} | ${P.tier[s.tier]} | ${P.resp[s.tier].replace('\n', ' ')} |`), '',
    P.md.rule, ''].join('\n');
  return [{ name: 'prompt', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 6.2 RAG: akış + üç soru × (kapalı | açık)
function ragFigure(demo, { lang }) {
  const S = STRINGS[lang], R = S.rag;
  const W = 320, pad = 10;
  const body = [];
  // --- üst: akış diyagramı (açık yol düz, kapalı yol kesikli baypas)
  const nodes = R.nodes;
  const nw = 52, ng = (W - pad * 2 - nw * nodes.length) / (nodes.length - 1), ny = 16, nh = 15;
  body.push(caption(pad, 10, R.flowOn, { size: 6 })); // R082: ≥ 6
  nodes.forEach((n, i) => {
    const x = pad + i * (nw + ng);
    const src = i === 2;
    body.push(rect(x, ny, nw, nh, { fill: src ? EMBER_SOFT : '#fff', stroke: src ? EMBER : INK, sw: 0.7, rx: 2 }));
    body.push(text(x + nw / 2, ny + 10, n, { size: 6.5, anchor: 'middle', weight: 600, fill: src ? EMBER : INK }));
    if (i < nodes.length - 1) body.push(line(x + nw + 1, ny + nh / 2, x + nw + ng - 1.5, ny + nh / 2, { sw: 0.7, marker: true }));
  });
  // kapalı yol: Soru → Model baypas (kesikli)
  const sx = pad + nw / 2, mx = pad + 3 * (nw + ng) + nw / 2, by = ny + nh;
  body.push(`<path d="M${f1(sx)} ${f1(by)} C${f1(sx)} ${f1(by + 15)} ${f1(mx)} ${f1(by + 15)} ${f1(mx)} ${f1(by + 1.5)}" fill="none" stroke="${INK2}" stroke-width="0.7" stroke-dasharray="2 1.5" marker-end="url(#arrow)"/>`);
  body.push(text((sx + mx) / 2, by + 19, R.flowOff, { font: MONO, size: 6, fill: INK2, anchor: 'middle', spacing: 0.4 }));
  // --- üç soru paneli
  let y = by + 26;
  const cw = (W - pad * 2 - 8) / 2, cx1 = pad, cx2 = pad + cw + 8, size = 6.5, lh = 8.2, max = cpl(cw - 10, size, lang);
  const rows = [];
  R.docs.forEach((d, i) => {
    body.push(line(pad, y, W - pad, y, { stroke: RULE, sw: 0.6 }));
    y += 4;
    const qLabel = R.question(i + 1);
    body.push(caption(pad, y + 6, qLabel, { size: 6 }));
    body.push(text(pad + Math.max(34, Math.ceil(qLabel.length * 4.8) + 4), y + 6, d.q, { size: 7.5, weight: 600 })); // soru metni etiket genişliğine göre kayar
    y += 12;
    body.push(caption(cx1, y + 6, R.offHead, { size: 6, fill: INK2 }));
    body.push(caption(cx2, y + 6, R.onHead, { size: 6, fill: EMBER }));
    y += 9;
    // kaynak kutusu (sağ) ve boş kutu (sol), aynı yükseklik
    const ch = para(cx2 + 5, y + 9, d.chunk, max, { size, lh, fill: INK });
    const boxH = 10 + ch.h + 4;
    body.push(rect(cx1, y, cw, boxH, { fill: 'none', stroke: RULE, sw: 0.7 }).replace('/>', ' stroke-dasharray="2 2"/>'));
    body.push(text(cx1 + cw / 2, y + boxH / 2 + 2, R.noSource, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
    body.push(rect(cx2, y, cw, boxH, { fill: EMBER_SOFT, stroke: EMBER, sw: 0.7 }).replace('/>', ' stroke-dasharray="2 2"/>'));
    body.push(caption(cx2 + 5, y + 7, R.retrieved, { size: 6, fill: EMBER }));
    body.push(ch.svg);
    y += boxH + 3;
    const a1 = para(cx1 + 5, y + 4, d.ungrounded, max, { size, lh, fill: INK });
    const a2 = para(cx2 + 5, y + 4, d.grounded, max, { size, lh, fill: INK });
    const ah = Math.max(a1.h, a2.h) + 8;
    body.push(rect(cx1, y, cw, ah, { fill: '#fff', stroke: RULE, sw: 0.6 }));
    body.push(rect(cx2, y, cw, ah, { fill: '#fff', stroke: INK, sw: 0.7 }));
    body.push(a1.svg, a2.svg);
    y += ah + 2;
    body.push(text(cx1 + 5, y + 6, R.unverified, { size: 6, fill: EMBER, italic: true }));
    body.push(text(cx2 + 5, y + 6, R.source(d.chunk.split(':')[0]), { font: MONO, size: 6, fill: INK2 }));
    y += 11;
    rows.push(`| ${d.q} | ${d.chunk} | ${d.ungrounded} | ${d.grounded} |`);
  });
  const H = Math.ceil(y + 3);
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [`# ${R.md.title} — ${demo.title}`, '', R.md.head, '|---|---|---|---|', ...rows, ''].join('\n');
  return [{ name: 'rag', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 6.3 Ajan: görev + ReAct döngüsü + üç kare
function agentFigure(demo, { lang }) {
  const S = STRINGS[lang], A = S.agent;
  const W = 320, pad = 10;
  const body = [];
  // --- görev kutusu (sol)
  const tw = 186;
  const tp = para(pad + 8, 10 + 11, A.task, cpl(tw - 14, 7, lang), { size: 7, lh: 8.6 });
  const th = 12 + tp.h + 5;
  body.push(rect(pad, 10, tw, th, { fill: '#fff', stroke: RULE, sw: 0.6 }));
  body.push(rect(pad, 10, 2.5, th, { fill: EMBER }));
  body.push(caption(pad + 8, 18, A.taskHead, { fill: EMBER }));
  body.push(tp.svg);
  body.push(text(pad + 8, 10 + th + 9, A.singleTool, { font: MONO, size: 5.5, fill: MUTED }));
  // --- ReAct döngüsü (sağ)
  const dx = pad + tw + 12, dw = W - pad - dx; // ~112
  body.push(caption(dx, 17, A.loopTitle));
  // düğüm genişliği etikete göre (en az 40pt; uzun EN etiketleri için genişler)
  const nodeW = (label) => Math.max(40, Math.ceil(String(label).length * 3.6) + 8);
  const node = (cx, cy, label, hi) => {
    const w = nodeW(label), h = 12;
    body.push(rect(cx - w / 2, cy - h / 2, w, h, { fill: hi ? EMBER_SOFT : '#fff', stroke: hi ? EMBER : INK, sw: 0.7, rx: 6 }));
    body.push(text(cx, cy + 2.3, label, { size: 6.5, anchor: 'middle', weight: 600 }));
  };
  const cxm = dx + dw / 2, top = 30, bot = 66, half = 32;
  const wTool = nodeW(A.nodeTool), wObs = nodeW(A.nodeObs);
  node(cxm, top, A.nodeThought, true);
  node(cxm + half, bot, A.nodeTool, false);
  node(cxm - half, bot, A.nodeObs, false);
  body.push(line(cxm + 14, top + 6, cxm + half - 8, bot - 7, { sw: 0.7, marker: true }));
  body.push(line(cxm + half - (wTool / 2 + 1), bot, cxm - half + (wObs / 2 + 2), bot, { sw: 0.7, marker: true }));
  body.push(line(cxm - half + 8, bot - 7, cxm - 14, top + 6, { sw: 0.7, marker: true }));
  body.push(line(cxm, top + 6.5, cxm, bot + 10, { stroke: EMBER, sw: 0.7, dash: '1.5 1.5', marker: true }));
  body.push(text(cxm, bot + 18, A.goal, { font: MONO, size: 6, fill: EMBER, anchor: 'middle' })); // R082: ≥ 6
  body.push(text(cxm + half + 3, top + 12, A.edgeCall, { font: MONO, size: 6, fill: MUTED }));
  body.push(text(cxm - 4, bot + 8.5, A.edgeOut, { font: MONO, size: 6, fill: MUTED, anchor: 'end' })); // Araç → Gözlem okunun altı, kesik çizginin solu (R082 büyük puntoda çapraz okla çakışıyordu)
  body.push(text(cxm - half - 3, top + 12, A.edgeFeed, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  // --- üç kare
  const y0 = Math.max(10 + th + 16, bot + 26), fw = (W - pad * 2 - 12) / 3, fmax = cpl(fw - 8, 7, lang);
  // düşünce paragrafı 2 satırı aşarsa (EN) araç/gözlem bloğu ve kare yüksekliği o kadar aşağı kayar
  const extra = Math.max(0, Math.max(...A.steps.map((s) => para(0, 0, s.thought, fmax, { size: 7, lh: 8.4 }).n)) - 2) * 8.4;
  // R073: son cevap paragrafı alt çerçeveye değmesin — kare yüksekliği en uzun son cevaba göre (+8 iç boşluk)
  const finalH = Math.max(0, ...A.steps.filter((s) => s.isFinal).map((s) => 83 + para(0, 0, s.final, fmax, { size: 7, lh: 8.4 }).n * 8.4 + 8));
  const frameH = Math.max(108, finalH) + extra;
  A.steps.forEach((s, i) => {
    const fx = pad + i * (fw + 6), fy = y0, fz = fy + extra;
    body.push(rect(fx, fy, fw, frameH, { fill: '#fff', stroke: INK, sw: 0.7 }));
    body.push(caption(fx + 5, fy + 9, A.frame(i + 1)));
    body.push(circle(fx + fw - 9, fy + 7, 4.5, { fill: EMBER }));
    body.push(text(fx + fw - 9, fy + 9.3, i + 1, { font: MONO, size: 6, fill: '#fff', anchor: 'middle', weight: 700 }));
    body.push(line(fx, fy + 13, fx + fw, fy + 13, { stroke: RULE, sw: 0.5 }));
    body.push(caption(fx + 5, fy + 22, A.thoughtHead, { size: 5.5, fill: EMBER }));
    body.push(para(fx + 5, fy + 25, s.thought, fmax, { size: 7, lh: 8.4 }).svg);
    body.push(caption(fx + 5, fz + 55, A.toolHead, { size: 5.5, fill: EMBER }));
    if (s.tool) {
      body.push(rect(fx + 4, fz + 58, fw - 8, 16, { fill: '#f4f2ee' }));
      body.push(text(fx + 7, fz + 65, A.toolLine(s.tool), { font: MONO, size: 5.5, fill: INK2 }));
      body.push(text(fx + 7, fz + 72, s.action.replace(/ ([*/+−-]) /g, '$1'), { font: MONO, size: 5.5, fill: INK, spacing: -0.25 })); // R082 6.2 pt: kart genişliğine sığsın
      body.push(caption(fx + 5, fz + 86, A.obsHead, { size: 5.5, fill: EMBER }));
      body.push(text(fx + 5, fz + 99, `→ ${s.obs}`, { font: MONO, size: 10, weight: 700 }));
    } else {
      body.push(text(fx + 5, fz + 66, A.noTool, { font: MONO, size: 5.5, fill: MUTED }));
      body.push(caption(fx + 5, fz + 80, A.finalHead, { size: 5.5, fill: EMBER }));
      body.push(para(fx + 5, fz + 83, s.final, fmax, { size: 7, lh: 8.4, weight: 600, fill: EMBER }).svg);
    }
    if (i < A.steps.length - 1) body.push(line(fx + fw + 0.5, fy + frameH / 2, fx + fw + 5.5, fy + frameH / 2, { sw: 0.7, marker: true }));
  });
  const H = Math.ceil(y0 + frameH + 10);
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [`# ${A.md.title} — ${demo.title}`, '', A.md.task(A.task), '', A.md.head, '|---|---|---|---|',
    ...A.steps.map((s, i) => `| ${i + 1} | ${s.thought} | ${s.action || A.md.noTool} | ${s.isFinal ? A.md.final(s.final) : s.obs} |`), ''].join('\n');
  return [{ name: 'agent', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 6.4 Mimari: akış diyagramı + rol tablosu
function archFigure(demo, { lang }) {
  const S = STRINGS[lang], C = S.arch, PARTS = C.parts;
  const W = 320, pad = 10;
  const body = [];
  body.push(caption(pad, 15, C.flowTitle, { size: 5.5 }));
  const badge = (x, y, n) => { body.push(circle(x, y, 4.5, { fill: INK })); body.push(text(x, y + 2.2, n, { font: MONO, size: 6, fill: '#fff', anchor: 'middle', weight: 700 })); };
  const midY = 72;
  // kullanıcı (kutu değil: küçük figür)
  const ux = 24;
  body.push(circle(ux, midY - 9, 4, { fill: 'none', stroke: INK, sw: 0.8 }));
  body.push(`<path d="M${f1(ux - 7)} ${f1(midY + 6)} Q${f1(ux)} ${f1(midY - 6)} ${f1(ux + 7)} ${f1(midY + 6)}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
  body.push(text(ux, midY + 15, C.user, { size: 6.5, anchor: 'middle', fill: INK2 }));
  // arayüz
  const ax = 48, aw = 56, ah = 22;
  body.push(rect(ax, midY - ah / 2, aw, ah, { fill: '#fff', stroke: INK, sw: 0.8 }));
  body.push(text(ax + aw / 2, midY + 2.5, PARTS[0].name, { size: 7, anchor: 'middle', weight: 600 }));
  badge(ax, midY - ah / 2, 1);
  body.push(BIDIR(ux + 10, midY, ax - 1.5, midY, { sw: 0.7 }));
  // orkestrasyon (model çağrısı içinde)
  const ox = 124, ow = 84, oh = 48;
  body.push(rect(ox, midY - oh / 2, ow, oh, { fill: EMBER_SOFT, stroke: EMBER, sw: 1 }));
  body.push(text(ox + ow / 2, midY - 12, PARTS[1].name, { size: 7.5, anchor: 'middle', weight: 700, fill: EMBER }));
  body.push(text(ox + ow / 2, midY - 4, C.brain, { size: 6, anchor: 'middle', fill: INK2, italic: true }));
  body.push(rect(ox + 12, midY + 2, ow - 24, 15, { fill: '#fff', stroke: EMBER, sw: 0.6 }).replace('/>', ' stroke-dasharray="1.5 1.5"/>'));
  body.push(text(ox + ow / 2, midY + 12, C.modelCall, { font: MONO, size: 5.5, anchor: 'middle', fill: EMBER }));
  badge(ox, midY - oh / 2, 2);
  body.push(BIDIR(ax + aw + 1.5, midY, ox - 1.5, midY, { sw: 0.7 }));
  // üç kol
  const bx = 244, bw = 66, bh = 20, ys = [midY - 34, midY, midY + 34];
  PARTS.slice(2).forEach((p, i) => {
    const y = ys[i] - bh / 2;
    body.push(rect(bx, y, bw, bh, { fill: '#fff', stroke: INK, sw: 0.8 }));
    body.push(text(bx + bw / 2, ys[i] + (i === 0 ? 0.5 : 2.5), p.name, { size: 7, anchor: 'middle', weight: 600 }));
    if (i === 0) body.push(text(bx + bw / 2, ys[i] + 8, C.ragTag, { font: MONO, size: 5, fill: MUTED, anchor: 'middle' }));
    badge(bx, y, 3 + i);
    body.push(BIDIR(ox + ow + 1.5, midY + (ys[i] - midY) * 0.35, bx - 1.5, ys[i], { sw: 0.7 }));
  });
  body.push(text(W - pad, midY + 34 + bh / 2 + 9, C.modelNote, { font: MONO, size: 5.5, fill: INK2, anchor: 'end' }));
  // rol tablosu
  let y = midY + 34 + bh / 2 + 20;
  body.push(line(pad, y, W - pad, y, { stroke: RULE, sw: 0.6 }));
  y += 4;
  body.push(caption(pad, y + 6, C.colPart));
  body.push(caption(pad + 84, y + 6, C.colRole));
  y += 10;
  const dmax = cpl(W - pad - (pad + 84) - 2, 7, lang);
  PARTS.forEach((p, i) => {
    const d = para(pad + 84, y + 1, p.desc, dmax, { size: 7, lh: 8.6 });
    badge(pad + 4.5, y + 5.5, i + 1);
    body.push(text(pad + 13, y + 8, p.name, { size: 7.5, weight: 700, fill: i === 1 ? EMBER : INK }));
    body.push(d.svg);
    y += d.h + 6;
    if (i < PARTS.length - 1) body.push(line(pad, y - 2, W - pad, y - 2, { stroke: RULE, sw: 0.4 }));
  });
  const H = Math.ceil(y + 4);
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [`# ${C.md.title} — ${demo.title}`, '', C.md.head, '|---|---|---|', ...PARTS.map((p, i) => `| ${i + 1} | ${p.name} | ${p.desc} |`), '',
    C.md.flow, ''].join('\n');
  return [{ name: 'arch', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 6.5 Alanlar: 6 alan × 3 örnek panel ızgarası
function sectorFigure(demo, { lang }) {
  const S = STRINGS[lang], SECTORS = S.sector.list;
  const W = 320, pad = 10, cols = 3, gap = 8;
  const pw = (W - pad * 2 - gap * (cols - 1)) / cols, size = 7, lh = 8.4, max = cpl(pw - 16, size, lang);
  const body = [];
  // panel içeriklerini önce ölç, satır yüksekliğini eşitle
  const panels = SECTORS.map((s) => {
    const items = s.ex.map((e) => wrap(e, max));
    const h = 22 + items.reduce((a, l) => a + l.length * lh + 4, 0) + 2;
    return { ...s, items, h };
  });
  const rows = Math.ceil(panels.length / cols), rowH = [];
  for (let r = 0; r < rows; r++) rowH.push(Math.max(...panels.slice(r * cols, r * cols + cols).map((p) => p.h)));
  let y = pad;
  panels.forEach((p, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    if (c === 0 && r > 0) y += rowH[r - 1] + gap;
    const x = pad + c * (pw + gap), h = rowH[r];
    body.push(rect(x, y, pw, h, { fill: '#fff', stroke: INK, sw: 0.7 }));
    body.push(rect(x, y, pw, 2.5, { fill: EMBER }));
    const nameSize = Math.min(11, (pw - 27) / (p.name.length * 0.5)); // uzun alan adı (EN) sayaç etiketine değmesin
    body.push(text(x + 6, y + 15, p.name, { font: SERIF, size: nameSize, fill: INK }));
    body.push(text(x + pw - 5, y + 14, `${i + 1}/${SECTORS.length}`, { font: MONO, size: 5.5, fill: MUTED, anchor: 'end' }));
    body.push(line(x + 6, y + 19, x + pw - 6, y + 19, { stroke: RULE, sw: 0.5 }));
    let iy = y + 22;
    p.items.forEach((lines) => {
      body.push(text(x + 6, iy + size, '▸', { size: 6.5, fill: EMBER }));
      lines.forEach((l, k) => body.push(text(x + 13, iy + size + k * lh, l, { size })));
      iy += lines.length * lh + 4;
    });
  });
  const H = Math.ceil(y + rowH[rows - 1] + pad);
  body.unshift(rect(0, 0, W, H, { fill: PAPER }));
  const md = [`# ${S.sector.md.title} — ${demo.title}`, '', S.sector.md.head, '|---|---|---|---|', ...SECTORS.map((s) => `| ${s.name} | ${s.ex.join(' | ')} |`), ''].join('\n');
  return [{ name: 'sector', svg: svg(W, H, body.join('\n')), md }];
}

export const FIGURES = { prompt: promptFigure, rag: ragFigure, agent: agentFigure, arch: archFigure, sector: sectorFigure };

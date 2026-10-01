// Bölüm 8 figürleri
// Veriler book.json'da yok; Atlas-Kitap.dc.html renderVals() dalındaki dizilerden (tur, chineseroom, capability,
// singularity, responsibility) aynen alındı. Sınama demoları (tur, responsibility) cevabı GÖSTERMEZ.
// Etiketler ve veri dizileri iki dilde ../strings/M08.mjs içinden (S = STRINGS[lang]).
import { INK, INK2, MUTED, RULE, EMBER, PAPER, MONO, f1, text, rect, line, circle, svg, caption, pct, dec } from '../lib.mjs';
import STRINGS from '../strings/M08.mjs';

// ---------------------------------------------------------------- ortak: satıra bölme
const wrap = (s, max = 40) => {
  const out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) out.push(cur);
  return out;
};
const para = (x, y, lines, o = {}, lh = 9) => lines.map((l, i) => text(x, y + i * lh, l, o)).join('\n');
const TINT = (a) => `rgba(31,31,31,${a})`;
// tik etiketi: tam sayı olduğu gibi, ondalık her dilde nokta (metindeki tablolarla aynı; 2026-09-30)
const tick = (e, lang) => (Number.isInteger(e) ? String(e) : dec(e, 1, 'en'));

// ---------------------------------------------------------------- 8.1 Turing: dört yazışma balonu (sınama: cevap/ipucu yok)
function turFigure(demo, { lang }) {
  const S = STRINGS[lang].tur;
  const W = 320, pad = 10, gap = 10, cw = (W - pad * 2 - gap) / 2, LH = 9;
  const cells = S.chats.map((c) => {
    const pl = wrap(c.prompt, 34), rl = wrap(c.reply, 38);
    const bubbleH = rl.length * LH + 8;
    return { pl, rl, bubbleH, h: 10 + pl.length * 8 + 3 + bubbleH + 20 };
  });
  const rowH = [Math.max(cells[0].h, cells[1].h), Math.max(cells[2].h, cells[3].h)];
  const H = pad + rowH[0] + gap + rowH[1] + 2;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  cells.forEach((c, i) => {
    const ox = pad + (i % 2) * (cw + gap), oy = pad + (i < 2 ? 0 : rowH[0] + gap);
    body.push(caption(ox, oy + 7, S.exchange(i + 1)));
    let y = oy + 17;
    body.push(para(ox, y, c.pl, { font: MONO, size: 6.5, fill: INK2 }, 8));
    y += c.pl.length * 8 - 5;
    // cevap balonu: sol üst köşe sivri, diğerleri yuvarlak (ekrandaki balon)
    const r = 5, bx = ox, by = y, bw = cw, bh = c.bubbleH;
    body.push(`<path d="M${f1(bx)} ${f1(by)} H${f1(bx + bw - r)} Q${f1(bx + bw)} ${f1(by)} ${f1(bx + bw)} ${f1(by + r)} V${f1(by + bh - r)} Q${f1(bx + bw)} ${f1(by + bh)} ${f1(bx + bw - r)} ${f1(by + bh)} H${f1(bx + r)} Q${f1(bx)} ${f1(by + bh)} ${f1(bx)} ${f1(by + bh - r)} Z" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
    body.push(para(bx + 6, by + 11, c.rl, { size: 7 }, LH));
    // tahmin kutuları (boş: okur kenara yazar)
    const ky = by + bh + 8;
    body.push(rect(ox, ky, 6, 6, { stroke: INK2, sw: 0.6 }));
    body.push(text(ox + 9, ky + 5.5, S.human, { font: MONO, size: 6.5, fill: INK2 }));
    body.push(rect(ox + 44, ky, 6, 6, { stroke: INK2, sw: 0.6 }));
    body.push(text(ox + 53, ky + 5.5, S.machine, { font: MONO, size: 6.5, fill: INK2 }));
  });
  const md = [S.mdTitle(demo.title), '', ...S.mdHead,
    ...S.chats.map((c, i) => `| ${i + 1} | ${c.prompt} | ${c.reply} |`), ''].join('\n');
  return [{ name: demo.type, svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 8.2 Çince Oda: not → kural kitabı → cevap
// Glifler dile bağlı değil; anlamları S.chineseroom.meanings (aynı sırada).
const CR_PAIRS = [
  { in: '你好吗？', out: '我很好，谢谢！' },
  { in: '你叫什么名字？', out: '我叫小助手。' },
  { in: '现在几点？', out: '现在是下午三点。' },
];

function chineseroomFigure(demo, { lang }) {
  const S = STRINGS[lang].chineseroom;
  const W = 320, H = 134;
  const noteX = 8, noteW = 66, roomX = 88, roomW = 146, ansX = 246, ansW = 68;
  const roomY = 16, roomH = H - 24, pageX = roomX + 8, pageW = roomW - 16, pageY = roomY + 16, pageH = roomH - 30;
  const rowY0 = 44, rowH = 26, boxH = 18;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  body.push(caption(noteX, 11, S.incoming));
  body.push(caption(roomX + roomW / 2, 11, S.room, { anchor: 'middle' }));
  body.push(caption(ansX, 11, S.outgoing));
  // oda: kalın duvar, kapı altı boşluğu iki yanda (oklar oradan geçer)
  body.push(rect(roomX, roomY, roomW, roomH, { fill: '#fff', stroke: INK, sw: 1.4 }));
  body.push(text(roomX + roomW / 2, roomY + 11, S.rulebook, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  // açık sayfa: iki yaprak + orta kat çizgisi
  body.push(rect(pageX, pageY, pageW, pageH, { fill: PAPER, stroke: INK, sw: 0.7, rx: 1 }));
  body.push(line(pageX + pageW / 2, pageY, pageX + pageW / 2, pageY + pageH, { stroke: RULE, sw: 0.6 }));
  body.push(text(roomX + roomW / 2, roomY + roomH - 5, S.you, { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  CR_PAIRS.forEach((p, i) => {
    const y = rowY0 + i * rowH, cy = y + boxH / 2;
    // gelen not
    body.push(rect(noteX, y, noteW, boxH, { fill: '#fff', stroke: INK, sw: 0.7 }));
    body.push(text(noteX + noteW / 2, cy + 2.8, p.in, { size: 7.5, anchor: 'middle' }));
    body.push(line(noteX + noteW + 1, cy, pageX - 1, cy, { stroke: INK, sw: 0.7, marker: true }));
    // kural satırı
    body.push(text(pageX + 4, cy + 2.6, `${i + 1}`, { font: MONO, size: 6, fill: MUTED }));
    // R073: soru sol yaprakta, cevap sağ yaprakta; ok kat çizgisinin üstünde (çizgi metnin içinden geçmesin)
    const fold = pageX + pageW / 2;
    // R073 (2026-10-01): en uzun soru (7 tam genişlik karakter) okla çakışıyordu → kural kitabı satırı 7.0 pt, soru 1 birim sola
    body.push(text(pageX + 10, cy + 2.8, p.in, { size: 7 }));
    body.push(rect(fold - 4.5, cy - 4, 9, 8, { fill: PAPER }));
    body.push(text(fold, cy + 2.6, '→', { size: 7, anchor: 'middle' }));
    body.push(text(fold + 6, cy + 2.8, p.out, { size: 7 }));
    if (i < CR_PAIRS.length - 1) body.push(line(pageX + 3, y + boxH + 4, pageX + pageW - 3, y + boxH + 4, { stroke: RULE, sw: 0.5 }));
    // çıkan cevap
    body.push(line(pageX + pageW + 1, cy, ansX - 1, cy, { stroke: EMBER, sw: 0.8, marker: true }));
    body.push(rect(ansX, y, ansW, boxH, { fill: '#fff', stroke: EMBER, sw: 0.9 }));
    body.push(text(ansX + ansW / 2, cy + 2.8, p.out, { size: 7.2, anchor: 'middle' }));
  });
  const md = [S.mdTitle(demo.title), '', ...S.mdHead,
    ...CR_PAIRS.map((p, i) => `| ${i + 1} | ${p.in} | ${p.in} → ${p.out} | ${p.out} | ${S.meanings[i].in} → ${S.meanings[i].out} |`), ''].join('\n');
  return [{ name: demo.type, svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 8.3 Yetenek basamakları: merdiven + kapasite çubuğu
// Çubuk yüzdeleri kaynak koddan (yalnız sıralama); adlar/durumlar/tanımlar S.capability.tiers[k].
const TIERS = [{ k: 'narrow', cap: 30 }, { k: 'agi', cap: 70 }, { k: 'super', cap: 100 }];

function capabilityFigure(demo, { lang }) {
  const S = STRINGS[lang].capability;
  const W = 320, pad = 10, stepW = 36, sx = pad, lx = sx + 3 * stepW + 14, barW = 110, LH = 9;
  const rows = TIERS.map((tier) => { const dl = wrap(S.tiers[tier.k].desc, 40); return { tier, dl, h: 10 + 9 + 12 + dl.length * LH + 8 }; });
  // üstten alta: Süper, Genel, Dar
  const order = [2, 1, 0]; const top = {}; let y = pad;
  order.forEach((i) => { top[i] = y; y += rows[i].h; });
  const base = y + 2, H = base + pad;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const tints = [TINT(0.16), TINT(0.42), TINT(0.82)];
  TIERS.forEach((tier, i) => {
    const lab = S.tiers[tier.k];
    const x = sx + i * stepW, ty = top[i];
    body.push(rect(x, ty, stepW, base - ty, { fill: tints[i], stroke: INK, sw: 0.7 }));
    body.push(text(x + stepW / 2, ty + 12, `${i + 1}`, { font: MONO, size: 8, fill: i === 2 ? PAPER : INK, anchor: 'middle', weight: 700 }));
    // basamak üstünden etikete kılavuz çizgi
    body.push(line(x + stepW, ty, lx - 4, ty, { stroke: RULE, sw: 0.6, dash: '1.5 2' }));
    const r = rows[i]; let ly = ty + 9;
    body.push(text(lx, ly, lab.name, { size: 8.5, weight: 600 }));
    body.push(text(W - pad, ly, lab.status, { font: MONO, size: 6.5, fill: i === 0 ? EMBER : INK2, anchor: 'end' }));
    ly += 6;
    body.push(rect(lx, ly, barW, 5, { fill: TINT(0.08) }));
    body.push(rect(lx, ly, barW * tier.cap / 100, 5, { fill: EMBER }));
    body.push(text(lx + barW + 4, ly + 4.8, pct(tier.cap, lang), { font: MONO, size: 6, fill: INK2 }));
    ly += 15;
    body.push(para(lx, ly, r.dl, { size: 7, fill: INK }, LH));
  });
  body.push(text(sx, base + 7, S.axis, { font: MONO, size: 6, fill: MUTED }));
  body.push(text(W - pad, base + 7, S.barNote, { font: MONO, size: 6, fill: MUTED, anchor: 'end' })); // R069
  const md = [S.mdTitle(demo.title), '', ...S.mdHead,
    ...TIERS.map((x) => `| ${S.tiers[x.k].name} | ${S.tiers[x.k].status} | ${pct(x.cap, lang)} | ${S.tiers[x.k].desc} |`), '',
    S.mdNote, ''].join('\n');
  return [{ name: demo.type, svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 8.4 Üç zekâ eğrisi: tek grafik
// Formüller dile bağlı değil; adlar S.singularity.curves[k].
const CURVES = [
  { k: 'accel', f: (e) => 10 * Math.pow(e / 10, 3), formula: '10·(t/10)³' },
  { k: 'plateau', f: (e) => 10 * (1 - Math.exp(-e / 2.2)), formula: '10·(1 − e^(−t/2.2))' },
  { k: 'uncertain', f: (e) => 5 + 2.5 * Math.sin(e / 1.6) + e * 0.15, formula: '5 + 2.5·sin(t/1.6) + 0.15·t' },
];
const T_MARKS = [0, 2.5, 5, 7.5, 10];

function singularityFigure(demo, { lang }) {
  const S = STRINGS[lang].singularity;
  const W = 320, H = 196, x0 = 34, x1 = 306, y0 = 150, y1 = 14;
  const px = (e) => x0 + (e / 10) * (x1 - x0), py = (v) => y0 - (Math.max(0, Math.min(10, v)) / 10) * (y0 - y1);
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // eksenler + tikler
  body.push(line(x0, y0, x1, y0, { stroke: INK2, sw: 0.8 }));
  body.push(line(x0, y0, x0, y1, { stroke: INK2, sw: 0.8 }));
  T_MARKS.forEach((e) => {
    body.push(line(px(e), y0, px(e), y0 + 3, { stroke: INK2, sw: 0.6 }));
    body.push(text(px(e), y0 + 11, tick(e, lang), { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  });
  [0, 5, 10].forEach((v) => {
    body.push(line(x0 - 3, py(v), x0, py(v), { stroke: INK2, sw: 0.6 }));
    body.push(text(x0 - 5, py(v) + 2.2, v, { font: MONO, size: 6, fill: INK2, anchor: 'end' }));
    if (v) body.push(line(x0, py(v), x1, py(v), { stroke: RULE, sw: 0.4, dash: '1 2' }));
  });
  body.push(text(x0, y1 - 5, S.yAxis, { font: MONO, size: 6, fill: MUTED }));
  body.push(text(x1, y0 + 20, S.xAxis, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  // eğriler: hızlanan düz INK, yavaşlayan kesikli INK, belirsiz EMBER
  const style = { accel: { stroke: INK, sw: 1.1 }, plateau: { stroke: INK, sw: 1.1, dash: '3 2' }, uncertain: { stroke: EMBER, sw: 1.1 } };
  CURVES.forEach((cv) => {
    let d = ''; for (let e = 0; e <= 10.001; e += 0.25) d += (e === 0 ? 'M' : 'L') + f1(px(e)) + ' ' + f1(py(cv.f(e))) + ' ';
    const s = style[cv.k];
    body.push(`<path d="${d.trim()}" fill="none" stroke="${s.stroke}" stroke-width="${s.sw}"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`);
    T_MARKS.forEach((e) => body.push(circle(px(e), py(cv.f(e)), 1.8, { fill: s.stroke === EMBER ? EMBER : '#fff', stroke: s.stroke, sw: 0.8 })));
  });
  // eğri etiketleri (çakışmasız yerler)
  body.push(text(px(9.15) - 3, py(8.3) + 2.5, S.curves.accel, { size: 7, weight: 600, anchor: 'end' }));
  body.push(text(px(5), py(CURVES[1].f(5)) - 4.5, S.curves.plateau, { size: 7, weight: 600, anchor: 'middle' }));
  body.push(text(px(7.5), py(CURVES[2].f(7.5)) + 10, S.curves.uncertain, { size: 7, weight: 600, fill: EMBER, anchor: 'middle' }));
  // gösterge: formüller
  const gy = H - 8, gx = [x0, x0 + 60, x0 + 150];
  CURVES.forEach((cv, i) => {
    const s = style[cv.k];
    body.push(line(gx[i], gy - 2.5, gx[i] + 12, gy - 2.5, { stroke: s.stroke, sw: 1.1, dash: s.dash }));
    body.push(text(gx[i] + 15, gy, cv.formula, { font: MONO, size: 6, fill: INK2 })); // R082: ≥ 6
  });
  const md = [S.mdTitle(demo.title), '', `| ${S.mdTime} | ${CURVES.map((c) => `${S.curves[c.k]}: ${c.formula}`).join(' | ')} |`, '|---|---|---|---|',
    ...T_MARKS.map((e) => `| ${e} | ${CURVES.map((c) => c.f(e).toFixed(1)).join(' | ')} |`), ''].join('\n');
  return [{ name: demo.type, svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 8.5 Sorumluluk: 3 senaryo × 4 taraf, işaretsiz (sınama)
function responsibilityFigure(demo, { lang }) {
  const S = STRINGS[lang].responsibility;
  const W = 320, pad = 8, colX = 166, colW = (W - pad - colX) / 4, LH = 9, headH = 30;
  const rows = S.scenarios.map((s) => { const l = wrap(s, 40); return { l, h: Math.max(l.length * LH + 12, 28) }; });
  const y0 = pad + headH; let H = y0; rows.forEach((r) => { H += r.h; }); H += 10 + pad; // +10: paylaşılan sorumluluk dipnotu (R062)
  // sütun başlığı punto: en uzun taraf satırı 11 karakteri aşarsa (≈ colW) 6, yoksa 6.5
  const hs = Math.max(...S.parties.flat().map((l) => l.length)) > 11 ? 6 : 6.5;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  body.push(caption(pad, pad + 7, S.scenario));
  body.push(caption(colX + colW * 2, pad + 7, S.who, { anchor: 'middle' }));
  S.parties.forEach((p, j) => {
    const cx = colX + colW * j + colW / 2;
    body.push(text(cx, pad + 19, `(${'abcd'[j]}) ${p[0]}`, { size: hs, fill: INK, anchor: 'middle' }));
    body.push(text(cx, pad + 27, p[1], { size: hs, fill: INK, anchor: 'middle' }));
  });
  body.push(line(pad, y0, W - pad, y0, { stroke: INK, sw: 0.8 }));
  let y = y0;
  rows.forEach((r, i) => {
    body.push(text(pad, y + 11, `${i + 1}`, { font: MONO, size: 6.5, fill: MUTED }));
    body.push(para(pad + 9, y + 11, r.l, { size: 7 }, LH));
    S.parties.forEach((_, j) => {
      const cx = colX + colW * j + colW / 2;
      body.push(circle(cx, y + r.h / 2, 4, { fill: '#fff', stroke: INK, sw: 0.7 }));
    });
    y += r.h;
    body.push(line(pad, y, W - pad, y, { stroke: i === rows.length - 1 ? INK : RULE, sw: i === rows.length - 1 ? 0.8 : 0.5 }));
  });
  S.parties.forEach((_, j) => { if (j) body.push(line(colX + colW * j, y0, colX + colW * j, y, { stroke: RULE, sw: 0.5 })); });
  body.push(line(colX, y0, colX, y, { stroke: RULE, sw: 0.5 }));
  body.push(text(pad, y + 9, S.shared, { font: MONO, size: 6, fill: MUTED })); // R062
  const md = [S.mdTitle(demo.title), '', ...S.mdHead,
    ...S.scenarios.map((s, i) => `| ${i + 1} | ${s} |`), '', `${S.mdParties}${S.parties.map((p, j) => `(${'abcd'[j]}) ${p.join(' ')}`).join(', ')}`, ''].join('\n');
  return [{ name: demo.type, svg: svg(W, H, body.join('\n')), md }];
}

export const FIGURES = { tur: turFigure, chineseroom: chineseroomFigure, capability: capabilityFigure, singularity: singularityFigure, responsibility: responsibilityFigure };

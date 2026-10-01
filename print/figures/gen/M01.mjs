// Bölüm 1 figürleri — etiketler ve veri: strings/M01.mjs (S = STRINGS[lang])
import { INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption, up, pct, num, bn, wrapW } from '../lib.mjs';
import STRINGS from '../strings/M01.mjs';
import STRINGS_M03 from '../strings/M03.mjs';

// ---------------------------------------------------------------- 1. Turing makinesi: film şeridi
// Atlas-Kitap.dc.html turingStep()/turingSetStart() birebir: 6 bitlik bant, 'right' → 'add' → 'done'.
function turingFrames(start) {
  const tape = [0, 0, 0, 0, 0, 0];
  let x = start; for (let i = 5; i >= 0; i--) { tape[i] = x & 1; x >>= 1; }
  let head = 0, st = 'right';
  const frames = [{ tape: tape.slice(), head, st }];
  while (st !== 'done' && frames.length < 20) {
    if (st === 'right') { if (head < tape.length - 1) head++; else st = 'add'; }
    else if (st === 'add') {
      if (tape[head] === 0) { tape[head] = 1; st = 'done'; }
      else { tape[head] = 0; if (head > 0) head--; else st = 'done'; }
    }
    frames.push({ tape: tape.slice(), head, st });
  }
  return frames;
}

function turingFigure(demo, { lang }) {
  const S = STRINGS[lang].turing;
  const start = demo.starts[0];
  const frames = turingFrames(start);
  const cols = 3, cell = 14, gap = 2, fw = 96, fh = 58, pad = 10;
  const rows = Math.ceil(frames.length / cols);
  const W = pad * 2 + cols * fw + (cols - 1) * 8, H = pad + rows * (fh + 8) + 4;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  frames.forEach((fr, i) => {
    const ox = pad + (i % cols) * (fw + 8), oy = pad + Math.floor(i / cols) * (fh + 8);
    body.push(caption(ox, oy + 7, S.frame(i)));
    const stLabel = S.st[fr.st];
    body.push(text(ox + fw, oy + 7, stLabel, { font: MONO, size: 6.5, fill: fr.st === 'done' ? EMBER : INK2, anchor: 'end' }));
    const tx = ox, ty = oy + 14;
    fr.tape.forEach((b, k) => {
      const cx = tx + k * (cell + gap);
      const isHead = k === fr.head;
      body.push(rect(cx, ty, cell, cell, { fill: isHead ? EMBER_SOFT : '#fff', stroke: isHead ? EMBER : INK, sw: isHead ? 1.2 : 0.7 }));
      body.push(text(cx + cell / 2, ty + cell - 3.5, b, { font: MONO, size: 9, anchor: 'middle', weight: isHead ? 700 : 400 }));
    });
    const hx = tx + fr.head * (cell + gap) + cell / 2;
    body.push(`<path d="M${f1(hx - 4)} ${f1(ty + cell + 9)} L${f1(hx)} ${f1(ty + cell + 3)} L${f1(hx + 4)} ${f1(ty + cell + 9)}z" fill="${EMBER}"/>`);
    const val = fr.tape.reduce((a, b) => a * 2 + b, 0);
    body.push(text(tx, ty + cell + 22, S.status(stLabel, val), { font: MONO, size: 6.5, fill: INK2 }));
  });
  const md = [S.mdTitle(demo.title), '', S.mdHeader, '|---|---|---|---|---|',
    ...frames.map((fr, i) => `| ${i} | ${fr.st} | ${fr.head} | ${fr.tape.join(' ')} | ${fr.tape.reduce((a, b) => a * 2 + b, 0)} |`), ''].join('\n');
  return [{ name: 'turing', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- ortak: metni satıra böl (boşluklardan)
function wrap(s, maxChars) {
  const out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}

// ---------------------------------------------------------------- 1. Çoklu zekâ: sekiz kart + YZ çubuğu
// renderVals(): lvlBar strong 90% · mid 55% · weak 22%. Ekranda kartlar tek tek açılır; kâğıtta 2×4 ızgara.
// R087 (2026-10-01): veri etiketi çubuğun üstünde ayrı satırda; çubuk kartın tam genişliğinde (etiket çubuğa binmez).
const BAR = { strong: 90, mid: 55, weak: 22 };
function intelligenceFigure(demo, { lang }) {
  const S = STRINGS[lang].intelligence;
  const cols = 2, pad = 10, gap = 8, cw = (320 - pad * 2 - gap) / cols, ch = 58, W = 320;
  const rows = Math.ceil(demo.types.length / cols), H = pad * 2 + rows * ch + (rows - 1) * gap;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const barOf = (tp) => BAR[S.levelKey[tp.level]] ?? 0;
  demo.types.forEach((tp, i) => {
    const ox = pad + (i % cols) * (cw + gap), oy = pad + Math.floor(i / cols) * (ch + gap);
    body.push(rect(ox, oy, cw, ch, { fill: '#fff', stroke: RULE, sw: 0.6 }));
    body.push(text(ox + 7, oy + 13, tp.name, { size: 7.5, weight: 600 }));
    wrap(tp.desc, 40).slice(0, 2).forEach((ln, k) => body.push(text(ox + 7, oy + 23 + k * 8.5, ln, { size: 6.5, fill: INK2 })));
    const p = barOf(tp), bx = ox + 7, by = oy + ch - 10, bw = cw - 14, bh = 4.5;
    body.push(text(bx + bw, by - 3.5, S.ai(tp.level, pct(p, lang)), { font: MONO, size: 6, fill: p >= 90 ? EMBER : INK2, anchor: 'end' }));
    body.push(rect(bx, by, bw, bh, { fill: 'rgba(31,31,31,0.08)' }));
    body.push(rect(bx, by, bw * p / 100, bh, { fill: EMBER }));
  });
  const md = [`# ${demo.title}`, '', S.mdHeader, '|---|---|---|---|',
    ...demo.types.map((tp) => `| ${tp.name} | ${tp.desc} | ${tp.level} | ${pct(barOf(tp), lang)} |`), ''].join('\n');
  return [{ name: 'intelligence', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 2. İkili kod: ağırlık şeması + açılış 01001001 + 5/73/255 çözümü
// renderVals(): places=[128,…,1]; açılış bits 01001001 = 73. Metindeki Adım adım 1–4: 73 çöz, 5 yaz, 73 yaz, 255 yaz.
function binaryFigure(demo, { lang }) {
  const S = STRINGS[lang].binary;
  const places = [128, 64, 32, 16, 8, 4, 2, 1];
  const toBits = (n) => places.map((p) => (n & p) ? 1 : 0);
  const sumStr = (bits) => bits.map((b, i) => b ? places[i] : null).filter((v) => v !== null).join(' + ');
  const W = 320, pad = 10, cell = 26, gap = 4, gx = (W - (8 * cell + 7 * gap)) / 2;
  const body = [rect(0, 0, W, 1, { fill: PAPER })];
  let y = pad;
  const open = toBits(73);
  body.push(caption(pad, y + 6, S.weight));
  body.push(caption(W - pad, y + 6, S.opening(open.join('')), { anchor: 'end' }));
  y += 12;
  places.forEach((p, i) => body.push(text(gx + i * (cell + gap) + cell / 2, y + 6, p, { font: MONO, size: 6.5, fill: MUTED, anchor: 'middle' })));
  y += 10;
  open.forEach((b, i) => {
    const x = gx + i * (cell + gap);
    body.push(rect(x, y, cell, 28, { fill: b ? EMBER : '#fff', stroke: b ? EMBER : INK, sw: 1 }));
    body.push(text(x + cell / 2, y + 19, b, { font: MONO, size: 12, fill: b ? '#fff' : MUTED, anchor: 'middle', weight: b ? 700 : 400 }));
  });
  y += 28 + 15;
  body.push(text(W / 2, y, `${open.join('')} = ${sumStr(open)} = 73`, { font: SERIF, size: 11, anchor: 'middle' }));
  y += 14;
  body.push(line(pad, y, W - pad, y, { stroke: RULE, sw: 0.6 }));
  y += 12;
  // R072: yönerge iki satır (EN tek satırda 320pt'yi aşıyordu; TR de aynı düzende)
  const ruleLines = Array.isArray(S.rule) ? S.rule : [S.rule];
  ruleLines.forEach((ln, k) => body.push(caption(pad, y + k * 9, ln)));
  y += 6 + (ruleLines.length - 1) * 9;
  const rowsN = [5, 73, 255], sc = 14;
  rowsN.forEach((n) => {
    const bits = toBits(n);
    body.push(text(gx - 8, y + sc - 4, n, { font: MONO, size: 7.5, anchor: 'end', weight: 700 }));
    bits.forEach((b, i) => {
      const x = gx + i * (cell + gap);
      body.push(rect(x, y, cell, sc, { fill: b ? EMBER : '#fff', stroke: b ? EMBER : INK, sw: 0.7 }));
      body.push(text(x + cell / 2, y + sc - 4, b, { font: MONO, size: 7.5, fill: b ? '#fff' : MUTED, anchor: 'middle' }));
    });
    body.push(text(gx + 8 * cell + 7 * gap, y + sc + 9, `${sumStr(bits)} = ${n}`, { font: MONO, size: 6, fill: INK2, anchor: 'end' }));
    y += sc + 18;
  });
  const H = y - 4;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [`# ${demo.title}`, '', `| ${S.mdBox} | ${places.map((_, i) => i + 1).join(' | ')} |`, `|---|${'---|'.repeat(8)}`,
    `| ${S.mdWeight} | ${places.join(' | ')} |`, `| ${S.mdOpening} | ${open.join(' | ')} |`, '',
    ...rowsN.map((n) => `- ${n} = ${toBits(n).join('')} = ${sumStr(toBits(n))}`), ''].join('\n');
  return [{ name: 'binary', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 4. Getir–Yürüt–Yaz: üç kare yan yana, evredeki parça koyu
// renderVals(): phase i → parts[i] koyu (bg=acc). Kareler: demo.phases; parçalar: demo.parts. Sonra döngü başa döner.
// R006 (2026-10-01): üçüncü evre "Kaydet / Yaz": sonuç yazmaca (İşlemci) ya da belleğe yazılır; Giriş / Çıkış yalnız çıkış
// talimatında devreye girer (kutu kesikli, altında not). Evre adı ve notlar strings/M01 cycle (phases, writeActive, ioNote, writeDesc).
function cycleFigure(demo, { lang }) {
  const S = STRINGS[lang].cycle;
  const W = 320, pad = 8, n = demo.phases.length, fg = 6, fw = (W - pad * 2 - (n - 1) * fg) / n;
  const bw = 72, bh = 16, bgap = 10, top = 22;
  const stackH = demo.parts.length * bh + (demo.parts.length - 1) * bgap;
  const ioLines = Array.isArray(S.ioNote) ? S.ioNote : [S.ioNote];
  const frameBottom = top + stackH + 18 + ioLines.length * 8, H = frameBottom + 22;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const WRITE = n - 1; // kaydet/yaz evresi: son evre
  const phaseName = (ph, i) => (S.phases && S.phases[i]) || ph;
  demo.phases.forEach((ph, i) => {
    const ox = pad + i * (fw + fg), cx = ox + fw / 2, isWrite = i === WRITE;
    body.push(rect(ox, pad, fw, frameBottom - pad, { fill: '#fff', stroke: RULE, sw: 0.6 }));
    body.push(caption(cx, pad + 9, up(phaseName(ph, i), lang), { anchor: 'middle', fill: INK }));
    demo.parts.forEach((p, k) => {
      const by = top + k * (bh + bgap);
      // kaydet/yaz evresinde: Bellek tam vurgu, İşlemci (yazmaç) yarım vurgu, Giriş / Çıkış kesikli (yalnız çıkış talimatında)
      const on = isWrite ? k === 0 : k === i, half = isWrite && k === 1, io = isWrite && k === demo.parts.length - 1;
      let box = rect(cx - bw / 2, by, bw, bh, { fill: on ? EMBER : half ? EMBER_SOFT : '#fff', stroke: on || half ? EMBER : io ? INK2 : INK, sw: on ? 1.2 : 0.8 });
      if (io) box = box.replace('/>', ' stroke-dasharray="2 1.5"/>');
      body.push(box);
      body.push(text(cx, by + bh - 5, p.label, { size: 7, fill: on ? '#fff' : io ? INK2 : INK, anchor: 'middle', weight: on || half ? 700 : 500 }));
      if (k < demo.parts.length - 1) body.push(line(cx, by + bh + 1, cx, by + bh + bgap - 1, { stroke: INK2, sw: 0.7, marker: true }));
    });
    body.push(text(cx, top + stackH + 12, isWrite ? S.writeActive : S.active(demo.parts[i].label), { font: MONO, size: 6, fill: EMBER, anchor: 'middle' }));
    if (isWrite) ioLines.forEach((ln, k) => body.push(text(cx, top + stackH + 21 + k * 8, ln, { size: 6, fill: INK2, anchor: 'middle' })));
    if (i < n - 1) body.push(line(ox + fw + 1, top + stackH / 2, ox + fw + fg - 1, top + stackH / 2, { stroke: INK, sw: 0.8, marker: true }));
  });
  // döngü başa döner: son kareden ilk kareye alttan kesikli ok
  const ly = H - 8, x1 = pad + (n - 1) * (fw + fg) + fw / 2, x0 = pad + fw / 2;
  body.push(`<path d="M${f1(x1)} ${f1(frameBottom)} L${f1(x1)} ${f1(ly)} L${f1(x0)} ${f1(ly)} L${f1(x0)} ${f1(frameBottom + 2)}" fill="none" stroke="${INK2}" stroke-width="0.7" stroke-dasharray="2 2" marker-end="url(#arrow)"/>`);
  body.push(text(W / 2, ly - 3, S.loop, { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  const md = [`# ${demo.title}`, '', S.mdHeader, '|---|---|---|',
    ...demo.phases.map((ph, i) => (i === WRITE
      ? `| ${phaseName(ph, i)} | ${S.writePart(demo.parts[1].label, demo.parts[0].label, demo.parts[2].label)} | ${S.writeDesc} |`
      : `| ${phaseName(ph, i)} | ${demo.parts[i].label} | ${demo.parts[i].desc} |`)), '', S.mdNote, ''].join('\n');
  return [{ name: 'cycle', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 5. Sınıflandırma sınaması: boş işaretleme tablosu (cevap gösterilmez)
// Üç demoyu karşılar: catA/catB (M1, M2) ya da cats[] (M3). Sütun sayısı veriye göre 2 ya da 3. Veri book.json'dan (her dilde kendi metni).
// R007 (2026-10-01): M01 demosunda sütun adları "Bugün kullanılan sistem" / "Varsayımsal sistem" (strings classify.agiCats);
// bilinçli makine kartının altında "Bilinç sorusu (ayrı)" etiketi. R073: hücre metni genişliğe göre sarılır (wrapW).
// R065 (2. tur): görev metni override'ı bölümün strings dosyasından (M03 classify.itemOverride, EN görev 5).
function classifyFigure(demo, { lang, mod }) {
  const S = STRINGS[lang].classify;
  const OV = Number(mod.n) === 3 ? (STRINGS_M03[lang].classify || {}).itemOverride || {} : {};
  const items = demo.items.map((it, i) => (OV[i] ? { ...it, label: OV[i] } : it));
  const agi = Number(mod.n) === 1 && demo.catA && demo.catA.key === 'dar';
  const cats = (demo.cats || [demo.catA, demo.catB]).map((c, j) => (agi ? { ...c, label: S.agiCats[j] } : c));
  const W = 320, pad = 8, numW = 14, catW = cats.length === 2 ? 66 : 50, itemW = W - pad * 2 - numW - cats.length * catW;
  const lh = 8.5, rowPad = 5, tagH = 8;
  const hdr = cats.map((c) => wrapW(c.label, 6.5, catW - 6));
  const hdrLines = Math.max(...hdr.map((h) => h.length)), hdrH = hdrLines * 8 + 8;
  const tagOf = (it) => (agi && /bilin[cç]|conscious/i.test(it.label) ? S.consciousTag : null);
  const rows = items.map((it) => wrapW(it.label, 7, itemW - 10));
  const H = pad * 2 + hdrH + rows.reduce((a, r, i) => a + r.length * lh + rowPad * 2 + (tagOf(items[i]) ? tagH : 0), 0);
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  const x0 = pad, xItem = x0 + numW, xCat = (j) => xItem + itemW + j * catW;
  let y = pad;
  body.push(rect(x0, y, W - pad * 2, hdrH, { fill: '#fff', stroke: INK, sw: 0.8 }));
  body.push(text(x0 + numW / 2, y + hdrH - 6, '#', { font: MONO, size: 6, fill: MUTED, anchor: 'middle' }));
  body.push(text(xItem + 4, y + hdrH - 6, S.example, { font: MONO, size: 6, fill: MUTED }));
  cats.forEach((c, j) => {
    body.push(line(xCat(j), y, xCat(j), y + hdrH, { stroke: RULE, sw: 0.6 }));
    hdr[j].forEach((ln, k) => body.push(text(xCat(j) + catW / 2, y + 7 + k * 8 + (hdrLines - hdr[j].length) * 4 + 2, ln,
      { size: 6.5, weight: 600, anchor: 'middle' })));
  });
  y += hdrH;
  rows.forEach((lines, i) => {
    const tag = tagOf(items[i]);
    const rh = lines.length * lh + rowPad * 2 + (tag ? tagH : 0);
    body.push(line(x0, y + rh, W - pad, y + rh, { stroke: RULE, sw: 0.6 }));
    body.push(text(x0 + numW / 2, y + rowPad + 6.5, i + 1, { font: MONO, size: 6.5, fill: INK2, anchor: 'middle' }));
    lines.forEach((ln, k) => body.push(text(xItem + 4, y + rowPad + 6.5 + k * lh, ln, { size: 7 })));
    if (tag) body.push(text(xItem + 4, y + rowPad + 6.5 + lines.length * lh, tag, { font: MONO, size: 6, fill: EMBER }));
    cats.forEach((c, j) => {
      body.push(line(xCat(j), y, xCat(j), y + rh, { stroke: RULE, sw: 0.6 }));
      body.push(rect(xCat(j) + catW / 2 - 4.5, y + rh / 2 - 4.5, 9, 9, { fill: '#fff', stroke: INK, sw: 0.8 }));
    });
    y += rh;
  });
  body.push(line(x0, pad, x0, H - pad, { stroke: INK, sw: 0.8 }));
  body.push(line(W - pad, pad, W - pad, H - pad, { stroke: INK, sw: 0.8 }));
  body.push(line(x0, H - pad, W - pad, H - pad, { stroke: INK, sw: 0.8 }));
  const md = [`# ${demo.title}`, '', `| # | ${S.example} | ${cats.map((c) => c.label).join(' | ')} |`, `|---|---|${'---|'.repeat(cats.length)}`,
    ...items.map((it, i) => `| ${i + 1} | ${it.label}${tagOf(it) ? ` · ${tagOf(it)}` : ''} | ${cats.map(() => '☐').join(' | ')} |`), '', S.mdNote, ''].join('\n');
  return [{ name: 'classify', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 6. Üstel büyüme: katlanma tablosu (0–13) + iki mini grafik (0–26)
// renderVals(): year = year0 + 2d, count = count0·2^d, d ≤ 26. Tablo metindeki gibi 13 katlamada durur; grafikler 26'ya kadar.
function expFigure(demo, { lang }) {
  const S = STRINGS[lang].exp;
  const N_TABLE = 13, N_MAX = 26, y0 = demo.year0, c0 = demo.count0;
  const all = Array.from({ length: N_MAX + 1 }, (_, d) => ({ d, year: y0 + 2 * d, pow: 2 ** d, count: c0 * 2 ** d }));
  const W = 320, pad = 10, H = 196;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // tablo
  const tx = pad, ty = pad, colX = [tx + 8, tx + 34, tx + 78, tx + 150], rh = 11;
  S.hdr.forEach((h, j) => body.push(text(colX[j], ty + 7, h, { font: MONO, size: 6, fill: MUTED, anchor: j === 0 ? 'middle' : 'end', spacing: 0.6 })));
  body.push(line(tx, ty + 10.5, tx + 152, ty + 10.5, { stroke: INK, sw: 0.7 }));
  all.slice(0, N_TABLE + 1).forEach((r, i) => {
    const yy = ty + 12 + i * rh + 8, big = r.count >= 1e6;
    body.push(text(colX[0], yy, r.d, { font: MONO, size: 6.5, fill: INK2, anchor: 'middle' }));
    body.push(text(colX[1], yy, r.year, { font: MONO, size: 6.5, anchor: 'end' }));
    body.push(text(colX[2], yy, num(r.pow, lang), { font: MONO, size: 6.5, anchor: 'end' }));
    body.push(text(colX[3], yy, num(r.count, lang), { font: MONO, size: 6.5, anchor: 'end', fill: big ? EMBER : INK, weight: big ? 700 : 400 }));
    if (i < N_TABLE) body.push(line(tx, yy + 3, tx + 152, yy + 3, { stroke: RULE, sw: 0.4 }));
  });
  body.push(text(tx, ty + 12 + (N_TABLE + 1) * rh + 12, S.note, { font: MONO, size: 6, fill: MUTED })); // R082: ≥ 6 (≈6.6 pt baskıda)
  // mini grafikler
  const gx = 180, gw = 130, gh = 76, panel = (oy, title, yOf, yTicks) => {
    const px = (d) => gx + 26 + (d / N_MAX) * (gw - 30), py = (v) => oy + gh - 12 - yOf(v) * (gh - 24);
    body.push(caption(gx, oy + 6, title));
    body.push(line(px(0), oy + gh - 12, px(N_MAX), oy + gh - 12, { stroke: INK, sw: 0.6 }));
    body.push(line(px(0), oy + 12, px(0), oy + gh - 12, { stroke: INK, sw: 0.6 }));
    [0, 13, 26].forEach((d) => {
      body.push(line(px(d), oy + gh - 12, px(d), oy + gh - 10, { stroke: INK, sw: 0.6 }));
      body.push(text(px(d), oy + gh - 3, y0 + 2 * d, { font: MONO, size: 6, fill: MUTED, anchor: d === 0 ? 'start' : d === N_MAX ? 'end' : 'middle' }));
    });
    yTicks.forEach(([v, lbl]) => {
      body.push(line(px(0) - 2, py(v), px(0), py(v), { stroke: INK, sw: 0.6 }));
      body.push(text(px(0) - 4, py(v) + 2, lbl, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
    });
    // tablo aralığı (0–13) vurgulu, kalanı ince
    body.push(rect(px(0), oy + 12, px(N_TABLE) - px(0), gh - 24, { fill: EMBER_SOFT }));
    body.push(`<path d="${all.map((r, i) => (i ? 'L' : 'M') + f1(px(r.d)) + ' ' + f1(py(r.count))).join(' ')}" fill="none" stroke="${INK}" stroke-width="0.9"/>`);
    all.forEach((r) => body.push(circle(px(r.d), py(r.count), r.d <= N_TABLE ? 1.4 : 1, { fill: r.d <= N_TABLE ? EMBER : INK })));
  };
  const top = c0 * 2 ** N_MAX;
  panel(pad, S.linear, (v) => v / top, [[0, '0'], [top / 2, bn(Math.round(top / 2e9), lang)], [top, bn(Math.round(top / 1e9), lang)]]);
  panel(pad + gh + 12, S.log, (v) => Math.log10(v / 1e3) / Math.log10(top / 1e3), [[1e3, '10³'], [1e6, '10⁶'], [1e9, '10⁹'], [top, '10¹¹']]);
  const md = [`# ${demo.title}`, '', S.mdFormula(num(c0, lang), y0), '', S.mdHeader, '|---|---|---|---|',
    ...all.map((r) => `| ${r.d} | ${r.year} | ${num(r.pow, lang)} | ${num(r.count, lang)} |`), '',
    S.mdNote, ''].join('\n');
  return [{ name: 'exp', svg: svg(W, H, body.join('\n')), md }];
}


export const FIGURES = { turing: turingFigure, intelligence: intelligenceFigure, binary: binaryFigure, cycle: cycleFigure, classify: classifyFigure, exp: expFigure };

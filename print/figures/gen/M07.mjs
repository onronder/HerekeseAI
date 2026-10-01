// Bölüm 7 figürleri
import { INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, SANS, MONO, SERIF, esc, f1, text, rect, line, circle, svg, caption, up, pct } from '../lib.mjs';
import STRINGS from '../strings/M07.mjs';

// Uzun metni sözcük sınırından satırlara böler (≤ max karakter/satır).
function wrap(s, max) {
  const words = String(s).split(/\s+/), lines = []; let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}
const lines = (x, y, arr, o = {}, lead = 9.5) => arr.map((s, i) => text(x, y + i * lead, s, { size: 7, ...o })).join('\n');

// ---------------------------------------------------------------- 7.1 Önyargı: üç düzey, çift çubuk
// renderVals() 'bias' dalı birebir: A = round(min(95, 50 + 0.4e)), B = round(max(5, 50 − 0.4e)), fark = A − B, dengeli ⇔ fark ≤ 6.
function biasFigure(demo, { lang }) {
  const S = STRINGS[lang].bias;
  const levels = [0, 50, 100].map((e) => {
    const A = Math.round(Math.min(95, 50 + e * 0.4)), B = Math.round(Math.max(5, 50 - e * 0.4));
    return { e, A, B, gap: A - B, balanced: A - B <= 6 };
  });
  const pad = 10, pw = 92, gapX = 10, W = pad * 2 + pw * 3 + gapX * 2;
  const chartH = 90, top = 44, y0 = pad + top + chartH; // taban çizgisi
  const H = y0 + 52;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  levels.forEach((lv, i) => {
    const px = pad + i * (pw + gapX), py = pad;
    body.push(caption(px, py + 7, S.kicker(pct(lv.e, lang))));
    // ölçek (0–100) ve işaretçi
    const sy = py + 18, sx = px + lv.e / 100 * pw;
    body.push(line(px, sy, px + pw, sy, { stroke: RULE, sw: 2 }));
    if (lv.e > 0) body.push(line(px, sy, sx, sy, { stroke: EMBER, sw: 2 }));
    body.push(circle(sx, sy, 3, { fill: '#fff', stroke: EMBER, sw: 1.2 }));
    body.push(text(px, sy + 9, '0', { font: MONO, size: 6, fill: MUTED })); // R082: ≥ 6
    body.push(text(px + pw, sy + 9, '100', { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
    // çubuklar: A koyu, B açık
    const bw = 24, ax = px + 14, bx = px + 54, hA = lv.A / 100 * chartH, hB = lv.B / 100 * chartH;
    body.push(line(px, y0, px + pw, y0, { stroke: INK, sw: 0.8 }));
    body.push(rect(ax, y0 - hA, bw, hA, { fill: INK }));
    body.push(rect(bx, y0 - hB, bw, hB, { fill: '#fff', stroke: INK, sw: 0.8 }));
    body.push(text(ax + bw / 2, y0 - hA - 3, pct(lv.A, lang), { font: MONO, size: 6.5, anchor: 'middle' }));
    body.push(text(bx + bw / 2, y0 - hB - 3, pct(lv.B, lang), { font: MONO, size: 6.5, anchor: 'middle' }));
    body.push(text(ax + bw / 2, y0 + 9, 'A', { size: 7, anchor: 'middle', weight: 600 }));
    body.push(text(bx + bw / 2, y0 + 9, 'B', { size: 7, anchor: 'middle', weight: 600 }));
    // parite farkı: iki tepe arasındaki boşluk
    const gx = ax + bw + 8;
    if (lv.gap > 0) {
      body.push(line(ax + bw, y0 - hA, gx + 3, y0 - hA, { stroke: EMBER, sw: 0.6, dash: '1.5 1.5' }));
      body.push(line(bx, y0 - hB, gx - 3, y0 - hB, { stroke: EMBER, sw: 0.6, dash: '1.5 1.5' }));
      body.push(line(gx, y0 - hA, gx, y0 - hB, { stroke: EMBER, sw: 1 }));
      body.push(line(gx - 2, y0 - hA, gx + 2, y0 - hA, { stroke: EMBER, sw: 1 }));
      body.push(line(gx - 2, y0 - hB, gx + 2, y0 - hB, { stroke: EMBER, sw: 1 }));
    }
    // R052: fark "yüzde puan" birimiyle, iki satır
    body.push(text(px, y0 + 22, S.gapLabel, { font: MONO, size: 6.5, fill: EMBER, weight: 700 }));
    body.push(text(px, y0 + 31, S.gap(lv.gap), { font: MONO, size: 6.5, fill: EMBER, weight: 700 }));
    body.push(text(px, y0 + 41, lv.balanced ? S.balanced : S.skewed, { size: 7, fill: INK2 }));
  });
  const md = [`# ${demo.title}`, '', S.mdFormula, '',
    S.mdHead, '|---|---|---|---|---|',
    ...levels.map((l) => `| ${pct(l.e, lang)} | ${pct(l.A, lang)} | ${pct(l.B, lang)} | ${S.gap(l.gap)} | ${l.balanced ? S.mdBalanced : S.mdSkewed} |`), '', S.mdNote, ''].join('\n');
  return [{ name: 'bias', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 7.2 Beyaz kutu: kara kutu (üst) + işaretli katkılar (alt)
// renderVals() 'explain' dalı: iki başvuru, dört katkı; toplam > 0 ⇒ onay; çubuk boyu her başvurunun en büyük |katkı|'sına oranlı.
const sgn = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);

// R053 (2026-10-01): taban değer φ₀ = 0 puan (örneğe özgü seçim), birim "puan", karar eşiği 0, toplam f(x) = φ₀ + Σφᵢ görünür.
const PHI0 = 0, THRESHOLD = 0;
function explainFigure(demo, { lang }) {
  const S = STRINGS[lang].explain;
  const pad = 10, pw = 140, gapX = 20, W = pad * 2 + pw * 2 + gapX, H = 200;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  S.apps.forEach((app, i) => {
    const x0 = pad + i * (pw + gapX), zero = x0 + 70, maxW = 50;
    const sum = app.feats.reduce((a, f) => a + f.c, 0), fx = PHI0 + sum, approved = fx > THRESHOLD;
    const mx = Math.max(...app.feats.map((f) => Math.abs(f.c)));
    // üst yarı: kara kutu, yalnız sonuç
    body.push(caption(x0, 17, S.blackBox(up(app.name, lang))));
    body.push(rect(x0, 22, pw, 24, { fill: INK }));
    body.push(text(zero, 37, approved ? S.approved : S.declined, { font: SERIF, size: 11, fill: PAPER, anchor: 'middle' }));
    // alt yarı: kapak açık — taban değer ve birim
    body.push(caption(x0, 60, S.lidOpen));
    body.push(text(x0, 69, S.baseLine(PHI0, S.unit), { font: MONO, size: 6, fill: INK2 }));
    body.push(text(zero - 4, 79, S.toDecline, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
    body.push(text(zero + 4, 79, S.toApprove, { font: MONO, size: 6, fill: MUTED }));
    body.push(line(zero, 82, zero, 143, { stroke: INK, sw: 0.6 }));
    app.feats.forEach((f, k) => {
      const cy = 89 + k * 14, w = Math.abs(f.c) / mx * maxW, pos = f.c > 0;
      if (pos) body.push(rect(zero, cy - 4, w, 8, { fill: EMBER }));
      else body.push(rect(zero - w, cy - 4, w, 8, { fill: INK2 }));
      body.push(text(pos ? zero - 4 : zero + 4, cy + 2.5, f.label, { size: 7, anchor: pos ? 'end' : 'start' }));
      body.push(text(pos ? zero + w + 3 : zero - w - 3, cy + 2.5, sgn(f.c), { font: MONO, size: 6.5, fill: pos ? EMBER : INK2, anchor: pos ? 'start' : 'end', weight: 700 }));
    });
    body.push(line(x0, 145, x0 + pw, 145, { stroke: RULE }));
    body.push(text(x0, 155, S.totalLine(sgn(sum), S.unit), { font: MONO, size: 6.5, fill: INK }));
    body.push(text(x0, 165, S.resultLine(sgn(fx), S.unit, approved ? S.approve : S.decline), { font: MONO, size: 6.5, weight: 700, fill: approved ? EMBER : INK2 }));
  });
  S.footer(PHI0, THRESHOLD).forEach((ln, k) => body.push(text(pad, H - 20 + k * 8, ln, { font: MONO, size: 6, fill: INK2 })));
  const md = [`# ${demo.title}`, '', S.mdRule(PHI0, THRESHOLD, S.unit), '',
    ...S.apps.flatMap((app) => {
      const sum = app.feats.reduce((a, f) => a + f.c, 0), fx = PHI0 + sum;
      return [`| ${app.name} | ${S.mdContribution} (${S.unit}) |`, '|---|---|', `| φ₀ (${S.mdBase}) | ${sgn(PHI0)} |`, ...app.feats.map((f) => `| ${f.label} | ${sgn(f.c)} |`),
        `| **Σφᵢ** | **${sgn(sum)}** |`, `| **f(x) = φ₀ + Σφᵢ** | **${sgn(fx)} ${S.unit} → ${fx > THRESHOLD ? S.approved : S.declined}** |`, ''];
    }), S.mdNote, ''].join('\n');
  return [{ name: 'explain', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 7.3 Gerçek mi, yapay mı? dört kart (SINAMA: cevap ve ipucu yok)
// renderVals() 'df' dalındaki dört vaka metni; ortam etiketi bölüm metnindeki "ikisi görüntü, biri ses, biri yazılı haber"e göre.
function dfFigure(demo, { lang }) {
  const S = STRINGS[lang].df;
  const pad = 10, cw = 145, gap = 10, W = pad * 2 + cw * 2 + gap;
  const wrapped = S.cases.map((c) => wrap(c.text, 35));
  const nl = Math.max(...wrapped.map((l) => l.length));
  const no = S.options.length, oh = 9.5; // R055: üç seçenek alt alta
  const ch = 22 + nl * 9.5 + 8 + no * oh, H = pad * 2 + ch * 2 + gap;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  S.cases.forEach((c, i) => {
    const x0 = pad + (i % 2) * (cw + gap), y0 = pad + Math.floor(i / 2) * (ch + gap);
    body.push(rect(x0, y0, cw, ch, { fill: '#fff', stroke: RULE, sw: 0.8 }));
    body.push(caption(x0 + 8, y0 + 13, S.caseOf(i + 1, S.cases.length)));
    body.push(text(x0 + cw - 8, y0 + 13, c.medium, { font: MONO, size: 6, fill: EMBER, anchor: 'end', spacing: 0.8 }));
    body.push(lines(x0 + 8, y0 + 28, wrapped[i]));
    // cevap kutuları (okur işaretler): üç seçenek alt alta (R055)
    S.options.forEach((opt, k) => {
      const ay = y0 + ch - 8 - (no - 1 - k) * oh;
      body.push(rect(x0 + 8, ay - 6, 7, 7, { fill: 'none', stroke: INK, sw: 0.7 }));
      body.push(text(x0 + 19, ay, opt, { size: 7, fill: INK2 }));
    });
  });
  const md = [`# ${demo.title}`, '', S.mdHead, '|---|---|---|---|',
    ...S.cases.map((c, i) => `| ${i + 1} | ${c.medium} | ${c.text} | ${S.options.map((o) => `☐ ${o}`).join(' · ')} |`), '', S.mdNote, ''].join('\n');
  return [{ name: 'df', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 7.4 Risk merdiveni (4 kademe, üstte yasak) + altı kullanım kartı (SINAMA)
// renderVals() 'reg' dalındaki kademeler ve kullanımlar; kademe kuralları bölüm metnindeki tablodan. Renkler sembolik anahtara bağlı.
const REG_STYLE = {
  ban: { fill: EMBER, fg: PAPER },
  high: { fill: INK, fg: PAPER },
  limited: { fill: INK2, fg: PAPER },
  minimal: { fill: '#fff', fg: INK },
};

function regFigure(demo, { lang }) {
  const S = STRINGS[lang].reg;
  const pad = 10, W = 320, sh = 26, ladderTop = pad + 4;
  const body = [rect(0, 0, W, 1, { fill: 'none' })]; // yer tutucu, aşağıda zemin eklenir
  // merdiven: üst basamak dar (yasak), aşağı indikçe genişler
  S.levels.forEach((lv, k) => {
    const y = ladderTop + k * sh, w = 44 + k * 18, st = REG_STYLE[lv.k];
    body.push(rect(pad, y, w, sh, { fill: st.fill, stroke: INK, sw: 0.8 }));
    body.push(text(pad + 6, y + sh / 2 + 2.5, lv.label, { font: MONO, size: 7, fill: st.fg, weight: 700 }));
    body.push(lines(pad + 110, y + 11, wrap(lv.rule, 46), { fill: INK }, 9));
  });
  const ladderBot = ladderTop + S.levels.length * sh;
  body.push(line(pad, ladderBot, pad + 44 + (S.levels.length - 1) * 18, ladderBot, { stroke: INK, sw: 0.8 }));
  // sağda: yukarı çıktıkça yük artar
  const axx = W - pad - 4;
  body.push(line(axx, ladderBot - 2, axx, ladderTop + 4, { stroke: INK2, sw: 0.7, marker: true }));
  body.push(`<text transform="translate(${f1(axx - 4)} ${f1(ladderBot - 4)}) rotate(-90)" font-family="${MONO}" font-size="6.2" fill="${MUTED}" letter-spacing="0.4">${esc(S.axis)}</text>`);
  // altı kullanım kartı, merdivenin dibinde
  const cy0 = ladderBot + 22, cw = 150, chh = 46, cgap = 6;
  body.push(caption(pad, cy0 - 8, S.kicker));
  S.uses.forEach((u, i) => {
    const x0 = pad + (i % 2) * (cw + 10), y0 = cy0 + Math.floor(i / 2) * (chh + cgap);
    body.push(rect(x0, y0, cw, chh, { fill: '#fff', stroke: RULE, sw: 0.8 }));
    body.push(text(x0 + 7, y0 + 15, `${i + 1}`, { font: MONO, size: 8, fill: EMBER, weight: 700 }));
    body.push(lines(x0 + 18, y0 + 15, wrap(u, 34), {}, 9.5));
    body.push(text(x0 + 18, y0 + chh - 7, S.tier, { font: MONO, size: 5.5, fill: MUTED, spacing: 0.8 }));
    body.push(rect(x0 + 50, y0 + chh - 15, 60, 11, { fill: 'none', stroke: INK, sw: 0.6 }));
  });
  const H = cy0 + 3 * (chh + cgap) - cgap + pad;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [`# ${demo.title}`, '', S.mdLevelHead, '|---|---|', ...S.levels.map((l) => `| ${l.label} | ${l.rule} |`), '',
    S.mdUseHead, '|---|---|', ...S.uses.map((u, i) => `| ${i + 1} | ${u} |`), '', S.mdNote, ''].join('\n');
  return [{ name: 'reg', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 7.5 Hedef ile niyet: üç sütunlu tablo
// renderVals() 'align' dalı; davranış metnindeki uzun tire bölüm metnindeki gibi noktalı virgül (kılavuz §1).
function alignFigure(demo, { lang }) {
  const S = STRINGS[lang].align;
  const pad = 10, W = 320, cols = [{ x: 10, w: 92, head: S.headGoal, max: 22 }, { x: 102, w: 108, head: S.headDid, max: 26 }, { x: 210, w: 100, head: S.headLesson, max: 24 }];
  const cp = 6, lead = 9.5, headH = 16;
  const rows = S.goals.map((g) => {
    const c = [wrap(g.goal, cols[0].max), wrap(g.behavior, cols[1].max), wrap(g.lesson, cols[2].max)];
    const n = Math.max(c[0].length + 1, c[1].length, c[2].length);
    return { g, c, h: n * lead + 12 };
  });
  const H = pad + headH + rows.reduce((a, r) => a + r.h, 0) + pad;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  cols.forEach((c) => body.push(caption(c.x + cp, pad + 10, c.head)));
  body.push(line(pad, pad + headH, W - pad, pad + headH, { stroke: INK, sw: 0.8 }));
  let y = pad + headH;
  rows.forEach((r, i) => {
    const ty = y + 12;
    body.push(lines(cols[0].x + cp, ty, r.c[0], { weight: 600 }, lead));
    body.push(text(cols[0].x + cp, ty + r.c[0].length * lead, r.g.who, { font: MONO, size: 6, fill: MUTED }));
    body.push(lines(cols[1].x + cp, ty, r.c[1], {}, lead));
    body.push(lines(cols[2].x + cp, ty, r.c[2], { fill: EMBER }, lead));
    y += r.h;
    body.push(line(pad, y, W - pad, y, { stroke: i === rows.length - 1 ? INK : RULE, sw: i === rows.length - 1 ? 0.8 : 0.5 }));
  });
  cols.slice(1).forEach((c) => body.push(line(c.x, pad + headH, c.x, y, { stroke: RULE, sw: 0.5 })));
  const md = [`# ${demo.title}`, '', S.mdHead, '|---|---|---|',
    ...S.goals.map((g) => `| ${g.goal} (${g.who}) | ${g.behavior} | ${g.lesson} |`), ''].join('\n');
  return [{ name: 'align', svg: svg(W, H, body.join('\n')), md }];
}

export const FIGURES = { bias: biasFigure, explain: explainFigure, df: dfFigure, reg: regFigure, align: alignFigure };

// Bölüm 2 figürleri — etiketler ve gömülü veriler strings/M02.mjs içinden (S = STRINGS[lang]).
import { INK, INK2, MUTED, RULE, EMBER, EMBER_SOFT, PAPER, MONO, f1, text, rect, line, circle, svg, caption, num, up, wrapW } from '../lib.mjs';
import STRINGS from '../strings/M02.mjs';

// ---------------------------------------------------------------- 3. Markov zinciri: durum diyagramı + matris
// R088 (2026-10-01): diyagram aşağı/büyük (cy=96, R=50, r=18): güneşli öz-ilmeğin "70" etiketi şeklin içinde kalır,
// "Yağmurlu" daireye sığar. R082: tüm okunacak etiketler ≥ 6 (bugün/yarın oku 5 → 6).
function markovFigure(demo, { lang }) {
  const S = STRINGS[lang].markov;
  const ST = demo.states, M = demo.matrix, n = ST.length;
  const W = 320, H = 156, cx = 92, cy = 96, R = 50, r = 18;
  const pos = ST.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // geçişler (i≠j): düz ok, çıkış yakınına yüzde etiketi; kalınlık olasılıkla orantılı
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    const a = pos[i], b = pos[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const off = 4, nx = -uy * off, ny = ux * off;
    const x1 = a.x + ux * (r + 1) + nx, y1 = a.y + uy * (r + 1) + ny, x2 = b.x - ux * (r + 2) + nx, y2 = b.y - uy * (r + 2) + ny;
    body.push(line(x1, y1, x2, y2, { stroke: INK, sw: 0.5 + M[i][j] / 40, marker: true }));
    body.push(text(x1 + ux * 12 + nx * 1.8, y1 + uy * 12 + ny * 1.8 + 2, num(M[i][j], lang), { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
  }
  // kendine dönüş (self-loop): dışa doğru küçük yay
  pos.forEach((p, i) => {
    const ax = p.x - cx, ay = p.y - cy, d = Math.hypot(ax, ay), ux = ax / d, uy = ay / d;
    const sx = p.x + ux * r, sy = p.y + uy * r, lx = p.x + ux * (r + 12), ly = p.y + uy * (r + 12);
    body.push(`<path d="M${f1(sx - uy * 5)} ${f1(sy + ux * 5)} Q${f1(lx - uy * 10)} ${f1(ly + ux * 10)} ${f1(lx)} ${f1(ly)} Q${f1(lx + uy * 10)} ${f1(ly - ux * 10)} ${f1(sx + uy * 5)} ${f1(sy - ux * 5)}" fill="none" stroke="${EMBER}" stroke-width="${0.5 + M[i][i] / 40}" marker-end="url(#arrow)"/>`);
    body.push(text(lx + ux * 8, ly + uy * 8 + 2, num(M[i][i], lang), { font: MONO, size: 6, fill: EMBER, anchor: 'middle' }));
  });
  pos.forEach((p, i) => {
    body.push(circle(p.x, p.y, r, { fill: '#fff', stroke: INK, sw: 1 }));
    body.push(text(p.x, p.y + 3, ST[i], { size: 7, anchor: 'middle', weight: 600 }));
  });
  // matris
  const mx = 180, my = 40, cw = 32, ch = 16;
  body.push(caption(mx, my - 9, up(S.matrix, lang)));  // 2026-09-30: Türkçe İ için yerel-duyarlı büyük harf (temel çıktı güncellendi)
  body.push(text(mx + cw - 2, my + ch - 5, `${S.today} ↓ ${S.tomorrow} →`, { font: MONO, size: 6, fill: MUTED, anchor: 'end' }));
  ST.forEach((s, j) => body.push(text(mx + cw * (j + 1) + cw / 2, my + ch - 5, s, { font: MONO, size: 6, fill: INK2, anchor: 'middle' })));
  ST.forEach((s, i) => {
    body.push(text(mx + cw / 2, my + ch * (i + 1) + ch - 5, s, { font: MONO, size: 6, fill: INK2, anchor: 'middle' }));
    M[i].forEach((v, j) => {
      body.push(rect(mx + cw * (j + 1), my + ch * (i + 1), cw, ch, { fill: i === j ? EMBER_SOFT : '#fff', stroke: RULE, sw: 0.5 }));
      body.push(text(mx + cw * (j + 1) + cw / 2, my + ch * (i + 1) + ch - 5, num(v, lang), { font: MONO, size: 7, anchor: 'middle', weight: i === j ? 700 : 400 }));
    });
  });
  const md = [`# ${S.matrix} — ${demo.title}`, '', `| ${S.today} \\ ${S.tomorrow} | ${ST.join(' | ')} |`, `|---|${'---|'.repeat(n)}`,
    ...ST.map((s, i) => `| ${s} | ${M[i].map((v) => num(v, lang)).join(' | ')} |`), ''].join('\n');
  return [{ name: 'markov', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- yardımcı: emoji/piktogramları at (duotone baskı)
const plain = (s) => String(s).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/gu, '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- 1. Bilgi zinciri (is-a): ana zincir + dört sorgu satırı
// Atlas-Kitap.dc.html renderVals() 'chain' dalı: hedef zincirde varsa 0..targetIdx kutuları boyanır ve "✓ Evet…", yoksa "✗ Bilinmiyor…".
function chainFigure(demo, { lang }) {
  const S = STRINGS[lang].chain;
  const N = demo.nodes, n = N.length, Q = demo.queries;
  const W = 320, pad = 12, bw = 44, bh = 18, gap = (W - 2 * pad - n * bw) / (n - 1);
  const bx = (i) => pad + i * (bw + gap);
  const rowH = 42, rowY0 = 54, H = rowY0 + Q.length * rowH + 2;
  // uzun düğüm adları (ör. EN "Living thing") kutuya sığsın: 9 karakterden uzunsa küçült; sorgu etiketi başlığın uzunluğuna göre kayar
  const nodeSize = (label, base) => (label.length > 9 ? base - 1.3 : base);
  const qx = pad + 34 + (S.query(1).length - 6) * 5.1;
  const body = [rect(0, 0, W, H, { fill: PAPER })];
  // ana zincir (bilgi tabanı)
  body.push(caption(pad, 10, S.kb(n - 1)));
  const cy = 16;
  N.forEach((label, i) => {
    body.push(rect(bx(i), cy, bw, bh, { fill: '#fff', stroke: INK, sw: 1 }));
    body.push(text(bx(i) + bw / 2, cy + bh / 2 + 2.6, label, { size: nodeSize(label, 7.5), anchor: 'middle', weight: 600 }));
    if (i < n - 1) {
      body.push(line(bx(i) + bw + 1.5, cy + bh / 2, bx(i + 1) - 1.5, cy + bh / 2, { stroke: INK, sw: 0.8, marker: true }));
      body.push(text(bx(i) + bw + gap / 2, cy + bh / 2 - 3, S.link, { font: MONO, size: 5.5, fill: MUTED, anchor: 'middle' }));
    }
  });
  // sorgular
  const rows = [];
  Q.forEach((q, k) => {
    const ti = N.indexOf(q.target), found = ti >= 0;
    const steps = found ? ti : n - 1; // izlenen ok sayısı
    const y = rowY0 + k * rowH, mh = 13;
    body.push(caption(pad, y + 7, S.query(k + 1)));
    body.push(text(qx, y + 7, q.label, { size: 7.5, weight: 600 }));
    body.push(text(W - pad, y + 7, found ? S.walked(steps) : S.walkedEnd(steps), { font: MONO, size: 6, fill: INK2, anchor: 'end' }));
    N.forEach((label, i) => {
      const on = found && i <= ti;
      body.push(rect(bx(i), y + 12, bw, mh, { fill: on ? EMBER : '#fff', stroke: on ? EMBER : RULE, sw: on ? 1 : 0.6 }));
      body.push(text(bx(i) + bw / 2, y + 12 + mh / 2 + 2.3, label, { size: nodeSize(label, 6.5), anchor: 'middle', weight: on ? 600 : 400, fill: on ? PAPER : INK2 }));
      if (i < n - 1) {
        const walked = i < steps;
        body.push(line(bx(i) + bw + 1.5, y + 12 + mh / 2, bx(i + 1) - 1.5, y + 12 + mh / 2, { stroke: walked ? (found ? EMBER : INK) : RULE, sw: walked ? 0.9 : 0.5, marker: walked }));
      }
    });
    const verdict = found ? S.yes(q.target) : S.unknown(q.target);
    body.push(text(pad, y + 35, verdict, { font: MONO, size: 6.5, fill: found ? EMBER : INK2 }));
    rows.push(`| ${q.label} | ${found ? steps : S.mdEnd(steps)} | ${found ? S.mdYes : S.mdUnknown} |`);
  });
  const md = [`# ${demo.title}`, '', `${S.mdChain}: ${N.join(' → ')}`, '', S.mdHead, '|---|---|---|', ...rows, ''].join('\n');
  return [{ name: 'chain', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 2. Uzman sistem: olgular + kural kartları (senaryo A) + üç senaryo tablosu
// Kural testleri Atlas-Kitap.dc.html 1169–1173'ten; motor renderVals() 'expert' dalıyla aynı iki geçişli ileri zincirleme.
// Olgu anahtarları (yagmur/soguk/ruzgar/semsiye) book.json'daki kimliklerdir, görünen metin değildir.
const EXPERT_TESTS = {
  R1: (f) => !!f.yagmur, R2: (f) => !!f.soguk, R3: (f) => !!(f.soguk && f.ruzgar),
  R4: (f) => !f.yagmur && !f.soguk, R5: (f, p) => !!(p.semsiye && f.ruzgar),
};
const EXPERT_SCEN = [null, ['yagmur', 'ruzgar'], ['soguk', 'ruzgar']]; // null = book.json'daki başlangıç olguları
function expertRun(rules, f) {
  const rid = (r) => r.id.slice(0, 2), produced = {};
  rules.forEach((r) => { if (EXPERT_TESTS[rid(r)](f, produced) && r.produces) produced[r.produces] = true; });
  const fired = rules.map((r) => EXPERT_TESTS[rid(r)](f, produced));
  return { fired, advice: rules.filter((_, i) => fired[i]).map((r) => plain(r.then)) };
}
function expertFigure(demo, { lang }) {
  const S = STRINGS[lang].expert;
  const F = demo.facts, R = demo.rules;
  const scen = EXPERT_SCEN.map((on, k) => ({ name: S.scen[k], on: on || F.filter((f) => f.on).map((f) => f.key) }))
    .map((s) => { const f = Object.fromEntries(s.on.map((k) => [k, true])); return { ...s, f, ...expertRun(R, f) }; });
  const A = scen[0];
  const W = 320, pad = 12, cw = W - 2 * pad;
  const body = [rect(0, 0, W, 10, { fill: PAPER })];
  // olgular (senaryo A)
  body.push(caption(pad, 10, S.facts));
  let x = pad;
  F.forEach((f) => {
    const on = !!A.f[f.key], w = 10 + f.label.length * 3.9 + 10;
    body.push(rect(x, 14, w, 13, { fill: on ? EMBER : '#fff', stroke: EMBER, sw: 0.8 }));
    body.push(text(x + 5, 23.2, `${on ? '✓' : '○'} ${f.label}`, { size: 7, fill: on ? PAPER : EMBER, weight: on ? 600 : 400 }));
    x += w + 6;
  });
  // kural kartları
  const ry = 38, rh = 16, rg = 3;
  body.push(caption(pad + 26, ry - 3, S.if));
  body.push(caption(pad + 168, ry - 3, S.then));
  const flame = (fx, fy) => `<path d="M${f1(fx)} ${f1(fy + 4)} c-2.2 -2.4 -0.6 -4.6 0.6 -6.2 c0.2 1.6 1.2 2 1.9 1.3 c0.2 -0.8 -0.1 -1.6 -0.4 -2.3 c2.6 1.6 3.3 4.7 1.3 7 c-1 1.1 -2.5 1.1 -3.4 0.2z" fill="${EMBER}"/>`;
  // R073: "zincir" rozeti kimlik sütununda ayrı satırda (öneri metniyle çakışmaz); öneri metni alev simgesinden önce biter
  R.forEach((r, i) => {
    const y = ry + 2 + i * (rh + rg), on = A.fired[i], chained = r.id.includes('⛓');
    body.push(rect(pad, y, cw, rh, { fill: on ? EMBER_SOFT : '#fff', stroke: on ? EMBER : RULE, sw: on ? 1 : 0.6 }));
    body.push(text(pad + 5, chained ? y + 7 : y + rh / 2 + 2.3, r.id.slice(0, 2), { font: MONO, size: 6.5, fill: on ? EMBER : INK2, weight: 700 }));
    if (chained) body.push(text(pad + 3, y + rh - 2.5, S.chain, { font: MONO, size: 5.5, fill: on ? EMBER : MUTED, spacing: -0.4 })); // 6.2 pt'de koşul metnine değmesin
    body.push(text(pad + 26, y + rh / 2 + 2.3, plain(r.cond), { size: 6.8, fill: on ? INK : INK2 }));
    body.push(text(pad + 158, y + rh / 2 + 2.3, '→', { font: MONO, size: 7, fill: on ? EMBER : MUTED, anchor: 'middle' }));
    body.push(text(pad + 168, y + rh / 2 + 2.3, plain(r.then), { size: 6.8, fill: on ? INK : INK2, weight: on ? 600 : 400 }));
    if (on) body.push(flame(pad + cw - 10, y + rh / 2 - 1));
  });
  // öneri satırı (senaryo A)
  const ay = ry + 2 + R.length * (rh + rg) + 4;
  body.push(rect(pad, ay, cw, 16, { fill: EMBER }));
  body.push(text(pad + 6, ay + 7, S.advice, { font: MONO, size: 6, fill: PAPER, spacing: 1.2 })); // R082: ≥ 6
  body.push(text(pad + 6, ay + 13.5, A.advice.join(' · '), { size: 7, fill: PAPER, weight: 600 }));
  // üç senaryo tablosu (R073: öneri satırı sütun genişliğine göre sarılır; satır yüksekliği içeriğe göre)
  const ty = ay + 30, cols = [pad, pad + 50, pad + 108, pad + 146], advW = pad + cw - cols[3] - 2, lh = 8;
  body.push(caption(pad, ty, S.three));
  S.cols.forEach((h, i) => body.push(text(cols[i], ty + 11, h, { font: MONO, size: 6, fill: MUTED })));
  body.push(line(pad, ty + 14, pad + cw, ty + 14, { stroke: INK, sw: 0.6 }));
  const rows = [];
  let y = ty + 14;
  scen.forEach((s, k) => {
    const ids = R.filter((_, i) => s.fired[i]).map((r) => r.id.slice(0, 2));
    const adv = wrapW(s.advice.join(' · '), 6.5, advW), th = Math.max(13, adv.length * lh + 5);
    if (k) body.push(line(pad, y, pad + cw, y, { stroke: RULE, sw: 0.5 }));
    const facts = s.on.map((k2) => S.short[k2]).join(', ');
    body.push(text(cols[0], y + 9.3, s.name, { size: 6.8, weight: 600 }));
    body.push(text(cols[1], y + 9.3, facts, { size: 6.8 }));
    body.push(text(cols[2], y + 9.3, ids.join(', '), { font: MONO, size: 6.5, fill: EMBER, weight: 700 }));
    adv.forEach((ln, j) => body.push(text(cols[3], y + 9.3 + j * lh, ln, { size: 6.5 })));
    rows.push(`| ${s.name} | ${facts} | ${ids.join(', ')} | ${s.advice.join(' · ')} |`);
    y += th;
  });
  const H = y + 6;
  body[0] = rect(0, 0, W, H, { fill: PAPER });
  const md = [`# ${demo.title}`, '', S.mdHead, '|---|---|---|---|', ...rows, '', S.mdNote, ''].join('\n');
  return [{ name: 'expert', svg: svg(W, H, body.join('\n')), md }];
}

// ---------------------------------------------------------------- 3. Yol bulma: BFS ve açgözlü arama yan yana
// Izgara ve algoritma Atlas-Kitap.dc.html GRID()/runGrid() ile birebir (book.json'da ızgara verisi yok).
const GRID = { cols: 8, rows: 6, start: [0, 0], goal: [7, 5], walls: [[2, 0], [2, 1], [2, 2], [2, 3], [4, 2], [4, 3], [4, 4], [4, 5], [6, 1], [6, 2], [6, 3]] };
function gridRun(method) {
  const g = GRID, isWall = (x, y) => g.walls.some((w) => w[0] === x && w[1] === y), key = (x, y) => x + ',' + y;
  const inb = (x, y) => x >= 0 && y >= 0 && x < g.cols && y < g.rows;
  const nbrs = (x, y) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => inb(a, b) && !isWall(a, b));
  const came = {}, visited = [], start = g.start, goal = g.goal, seen = new Set([key(...start)]);
  let found = false;
  if (method === 'bfs') {
    const q = [start];
    while (q.length) {
      const [x, y] = q.shift(); visited.push([x, y]);
      if (x === goal[0] && y === goal[1]) { found = true; break; }
      for (const [a, b] of nbrs(x, y)) if (!seen.has(key(a, b))) { seen.add(key(a, b)); came[key(a, b)] = [x, y]; q.push([a, b]); }
    }
  } else {
    const h = (x, y) => Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
    const pq = [[h(...start), start]];
    while (pq.length) {
      pq.sort((p, q2) => p[0] - q2[0]);
      const [, [x, y]] = pq.shift(); visited.push([x, y]);
      if (x === goal[0] && y === goal[1]) { found = true; break; }
      for (const [a, b] of nbrs(x, y)) if (!seen.has(key(a, b))) { seen.add(key(a, b)); came[key(a, b)] = [x, y]; pq.push([h(a, b), [a, b]]); }
    }
  }
  const path = [];
  if (found) { let cur = goal; while (cur) { path.unshift(cur); cur = came[key(...cur)]; } }
  return { visited, path };
}
function gridPanel(ox, oy, title, run, S) {
  const g = GRID, cell = 15.5, gap = 1.5, step = cell + gap, gx = ox + 8, gy = oy + 21;
  const b = [caption(ox, oy + 7, title)];
  const idx = {}; run.visited.forEach(([x, y], i) => { idx[x + ',' + y] = i + 1; });
  const onPath = new Set(run.path.map(([x, y]) => x + ',' + y));
  for (let x = 0; x < g.cols; x++) b.push(text(gx + x * step + cell / 2, gy - 3, x + 1, { font: MONO, size: 5, fill: MUTED, anchor: 'middle' }));
  for (let y = 0; y < g.rows; y++) b.push(text(gx - 3, gy + y * step + cell / 2 + 1.8, y + 1, { font: MONO, size: 5, fill: MUTED, anchor: 'end' }));
  for (let y = 0; y < g.rows; y++) for (let x = 0; x < g.cols; x++) {
    const k = x + ',' + y, X = gx + x * step, Y = gy + y * step;
    const wall = g.walls.some((w) => w[0] === x && w[1] === y);
    const isS = x === g.start[0] && y === g.start[1], isG = x === g.goal[0] && y === g.goal[1];
    const path = onPath.has(k), vis = idx[k] != null;
    const fill = wall ? INK : path ? EMBER : vis ? EMBER_SOFT : '#fff';
    b.push(rect(X, Y, cell, cell, { fill, stroke: wall ? INK : RULE, sw: 0.5 }));
    const label = isS ? S.start : isG ? S.goal : vis ? String(idx[k]) : '';
    if (label) b.push(text(X + cell / 2, Y + cell / 2 + 2.2, label, { font: MONO, size: isS || isG ? 7.5 : 6, fill: path ? '#fff' : INK, anchor: 'middle', weight: isS || isG || path ? 700 : 400 }));
  }
  const by = gy + g.rows * step + 9;
  b.push(text(gx, by, S.explored(run.visited.length), { font: MONO, size: 6.5, fill: INK2 }));
  b.push(text(gx, by + 9, S.pathLen(run.path.length, run.path.length - 1), { font: MONO, size: 6.5, fill: INK2 }));
  return { svg: b.join('\n'), bottom: by + 9 };
}
function gridFigure(demo, { lang }) {
  const S = STRINGS[lang].grid;
  const bfs = gridRun('bfs'), greedy = gridRun('greedy');
  const W = 320, pad = 10, pw = 8 + GRID.cols * 17;
  const p1 = gridPanel(pad, pad, S.bfs, bfs, S), p2 = gridPanel(W - pad - pw, pad, S.greedy, greedy, S);
  const ly = p1.bottom + 12, H = ly + 18;
  const body = [rect(0, 0, W, H, { fill: PAPER }), p1.svg, p2.svg];
  let x = pad + 8;
  [[EMBER_SOFT, RULE, S.legend.visited], [EMBER, EMBER, S.legend.path], [INK, INK, S.legend.wall]].forEach(([f, s, l]) => {
    body.push(rect(x, ly - 6, 7, 7, { fill: f, stroke: s, sw: 0.5 }));
    body.push(text(x + 10, ly, l, { font: MONO, size: 6, fill: INK2 }));
    x += 10 + l.length * 3.9 + 10;
  });
  body.push(text(x + 4, ly, S.legendSG, { font: MONO, size: 6, fill: INK2 }));
  body.push(text(pad + 8, ly + 10, S.note, { font: MONO, size: 6, fill: INK2 }));
  const cellStr = ([x, y]) => `(${x + 1},${y + 1})`;
  const order = (r) => r.visited.map(cellStr).join(' ');
  const md = [`# ${demo.title}`, '', S.mdGrid + GRID.walls.map(cellStr).join(' '), '',
    S.mdHead, '|---|---|---|---|',
    `| ${S.mdBfs} | ${bfs.visited.length} | ${bfs.path.length} | ${bfs.path.length - 1} |`,
    `| ${S.mdGreedy} | ${greedy.visited.length} | ${greedy.path.length} | ${greedy.path.length - 1} |`, '',
    `${S.mdOrderBfs}: ${order(bfs)}`, '', `${S.mdOrderGreedy}: ${order(greedy)}`, '',
    `${S.mdPath}: ${bfs.path.map(cellStr).join(' → ')}`, ''].join('\n');
  return [{ name: 'grid', svg: svg(W, H, body.join('\n')), md }];
}


export const FIGURES = { markov: markovFigure, chain: chainFigure, expert: expertFigure, grid: gridFigure };

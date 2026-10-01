#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sayfa sonu boşluğu analizi ve şekil yerleşim planı ("yüzen şekil" öykünmesi).
Kullanım: python3 gapplan.py <render.pdf> <ic-blok.html> <heights.json> <lang> <profile> <plan.json>

Sayfalar 30 dpi gri render edilir; alt boşluğu %20'yi aşan ve ardından bir şekil başlığıyla başlayan her sayfa için:
  1) şekil bloğu (başlık + figür + QR satırı) en çok %20 küçültülerek boşluğa sığıyorsa → küçült (scale);
  2) yoksa blok, boşluğu dolduracak kadar izleyen öğenin (Kurulum, Adım adım, tablo…) arkasına ertelenir (k).
Öğe yükseklikleri measure.mjs ölçümünden (heights.json) alınır. Plan: {"Şekil 1.4": {"k": 2, "scale": 1.0}}.
Çıkış kodu 0 = plan değişmedi (yakınsadı), 3 = plan güncellendi (yeniden dizgi gerekir)."""
import json, os, re, shutil, subprocess, sys, tempfile

pdf, html_path, heights_path, lang, profile, plan_path = sys.argv[1:7]
KDP = profile == 'kdp'
TEXT_H = 189.0 if KDP else 198.0          # mm, metin alanı yüksekliği (KDP: 9 in − 2 × 0.78 in)
TOP_MM, BOT_MM = (19.8 + 3.175, 19.8 + 3.175) if KDP else (20 + 3, 22 + 3)  # üst/alt kenar boşluğu + taşma (render taşma dahil); folyo bu bandın içinde
FIG_RX = re.compile(r'^(Şekil|Figure) (\d+\.\d+)')
MAX_DEFER = 8
MIN_SCALE = 0.80
TOL = 10.0                                # mm: bu kadar artık boşluk kabul edilir


def up(s):  # Türkçe büyük harf (i → İ); koşan başlıklar CSS ile büyük harfe çevrilmiş olarak PDF'te görünür
    return (s.replace('i', 'İ') if lang == 'tr' else s).upper()


BOOK_HEADS = {up('Herkes İçin Yapay Zekâ'), 'AI FOR EVERYONE'}  # sol sayfa koşan başlığı: sayfa metni sayılmaz


def gaps():
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
    d = tempfile.mkdtemp()
    subprocess.run(['pdftoppm', '-r', '30', '-gray', pdf, os.path.join(d, 'p')], check=True)
    out = []
    for i, f in enumerate(sorted(x for x in os.listdir(d) if x.endswith('.pgm')), 1):
        b = open(os.path.join(d, f), 'rb').read()
        parts = b.split(maxsplit=4); w, h = int(parts[1]), int(parts[2]); data = parts[4][-w * h:]
        ink = [any(data[y * w + x] < 200 for x in range(6, w - 6)) for y in range(h)]
        top, bot = int((TOP_MM - 2) / 25.4 * 30), int((BOT_MM - 2) / 25.4 * 30)  # koşan başlık / sayfa numarası bandı dışarıda
        body = ink[top:h - bot]
        if not any(body): out.append((i, 1.0)); continue
        last = max(y for y, v in enumerate(body) if v)
        out.append((i, 1 - (last + 1) / len(body)))
    shutil.rmtree(d, ignore_errors=True)  # geçici renderlar (her tur ~15 MB) diski doldurmasın
    return n, out


def first_line(p):
    t = subprocess.run(['pdftotext', '-f', str(p), '-l', str(p), '-layout', pdf, '-'], capture_output=True, text=True).stdout
    ls = [l.strip() for l in t.split('\n') if l.strip()]
    ls = [l for l in ls if not re.fullmatch(r'\d+', l) and not re.match(r'(BÖLÜM|CHAPTER) \d+ ·', l)
          and up(l) not in BOOK_HEADS]  # sol sayfa koşan başlığı (kitap adı)
    return ls[0] if ls else ''


sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import typeset  # top_elements
html = open(html_path, encoding='utf-8').read()
plan = json.load(open(plan_path, encoding='utf-8')) if os.path.exists(plan_path) else {}
tighten = plan.pop('_tighten', {})
plan = {k: (v if isinstance(v, dict) else {'k': v, 'scale': 1.0}) for k, v in plan.items()}
meas = json.load(open(heights_path, encoding='utf-8'))
hmap = {}
for m in meas: hmap.setdefault((m['t'], m['k']), m['h'])


def key(el):
    tag = re.match(r'<(\w+)', el).group(1)
    txt = re.sub(r'<[^>]+>', ' ', el)
    txt = re.sub(r'\s+', ' ', txt).strip()[:80]
    return tag, txt


def height(el):
    tag, txt = key(el)
    if (tag, txt) in hmap: return hmap[(tag, txt)]
    # yakın eşleşme (boşluk/entity farkları)
    for (t, k), h in hmap.items():
        if t == tag and k[:40] == txt[:40]: return h
    return None


n, gs = gaps()
changed = False
report = []
DEBUG = {int(x) for x in os.environ.get('GAPDEBUG', '').split(',') if x}
for i, e in gs:
    if i in DEBUG: print(f'  [debug] s.{i} e={e:.2f} sonraki ilk satır: {first_line(i + 1)[:60]!r}')
    if e < 0.20 or e >= 1.0 or i >= n: continue
    fl = first_line(i + 1)
    m = FIG_RX.match(fl)
    if not m: continue
    label = f'{m.group(1)} {m.group(2)}'
    gap_mm = e * TEXT_H
    mb = re.search(r'(<p class="figtitle"><strong>' + re.escape(label) + r' ·.*?</p>)\s*(<figure>.*?</figure>)', html, re.S)
    if not mb: continue
    blk = html[mb.start():mb.end()]
    cur = plan.get(label, {'k': 0, 'scale': 1.0})
    if cur.get('locked'): continue
    hist = cur.get('hist', []) + [[cur['k'], cur['scale'], round(gap_mm, 1)]]
    ms = re.search(r'style="width:[\d.]+mm;height:([\d.]+)mm"', blk)
    svg_h = float(ms.group(1)) if ms else None
    th, fh = height(mb.group(1)), height(mb.group(2))
    bh = (th + fh) if (th and fh) else ((svg_h + 39) if svg_h else None)
    # 1) küçültme: blok = figür + sabit kısım (başlık + QR satırı); ölçüm sığdığını söylüyorsa yanlıştır (blok sığmadı), ertele
    if cur['k'] == 0 and cur['scale'] >= 0.999 and bh and svg_h:
        fixed = bh - svg_h
        s = (gap_mm - 3 - fixed) / svg_h
        if MIN_SCALE <= s < 0.98:
            s = round(s - 0.02, 3)
            plan[label] = {'k': 0, 'scale': s, 'hist': hist}; changed = True
            report.append(f'  s.{i} %{int(e*100)} ({gap_mm:.0f} mm) {label}: blok {bh:.0f} mm → küçült ×{s}')
            continue
    # 2) erteleme: izleyen öğelerle boşluğu doldur (artık ≤ TOL)
    els = typeset.top_elements(html, mb.end())
    cum, add, unknown = 0.0, 0, 0
    for s0, t0 in els:
        if cur['k'] + add >= MAX_DEFER: break
        h = height(html[s0:t0])
        if h is None: unknown += 1; h = 30.0
        cum += h; add += 1
        if cum >= gap_mm - TOL: break
    if add == 0:
        if cur['scale'] > MIN_SCALE + 0.01:  # öğe kalmadı: figürü biraz küçült, aramayı baştan yap
            s = max(MIN_SCALE, round(cur['scale'] - 0.1, 2))
            plan[label] = {'k': 0, 'scale': s, 'hist': hist}; changed = True
            report.append(f'  s.{i} %{int(e*100)} {label}: ertelenecek öğe kalmadı → ×{s} ile yeniden')
        else:  # denenen yerleşimlerden boşluğu en küçük olanı seç ve kilitle
            best = min(hist, key=lambda x: x[2])
            plan[label] = {'k': best[0], 'scale': best[1], 'locked': True, 'hist': hist}; changed = True
            report.append(f'  s.{i} %{int(e*100)} {label}: seçenekler bitti → en iyi (k={best[0]}, ×{best[1]}, {best[2]} mm) kilitlendi')
        continue
    plan[label] = {'k': cur['k'] + add, 'scale': cur['scale'], 'hist': hist}; changed = True
    report.append(f'  s.{i} %{int(e*100)} ({gap_mm:.0f} mm) {label}: +{add} öğe → k={plan[label]["k"]} (ölçüm {cum:.0f} mm{", bilinmeyen " + str(unknown) if unknown else ""})')
# Bölüm kuyruğu: bölümün son sayfası neredeyse boşsa (≥ %70) ve ardından boş sayfa/bölüm açılışı geliyorsa
# o bölümün satır aralığı kademeli sıkılır (1.50 → 1.47 → 1.44), kuyruk bir önceki sayfaya çekilir.
# Koşan başlık metni → bölüm kimliği (bölümler "BÖLÜM 3 · …", arka bölümler kendi adları)
rh = {}
for m in re.finditer(r'<section[^>]*id="([^"]+)"[^>]*>\s*<span class="rh">(.*?)</span>', html, re.S):
    rh[up(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(2))).strip())] = m.group(1)
titles = {h.split(' · ')[-1] for h in rh}  # açılış sayfasında görünen başlık metinleri (büyük harf)


def page_lines(p):
    t = subprocess.run(['pdftotext', '-f', str(p), '-l', str(p), '-layout', pdf, '-'], capture_output=True, text=True).stdout
    return [l.strip() for l in t.split('\n') if l.strip()]


def is_opener(ls):
    if not ls: return True  # boş sayfa
    head = [up(l) for l in ls[:3]]
    return any(re.match(r'(?:BÖLÜM|CHAPTER) \d+$', l) for l in head) or any(l in titles for l in head)


# Satır aralığı / paragraf aralığı kademeleri: önce sık (kuyruk geri çekilsin), olmazsa genişlet (kuyruk sayfası dolsun)
SEQ = [[1.5, .8, 1.0], [1.47, .8, 1.0], [1.44, .8, 1.0], [1.53, .8, 1.0], [1.56, .8, 1.0], [1.59, .8, 1.0],
       [1.5, .6, 1.0], [1.47, .6, 1.0], [1.44, .6, 1.0], [1.53, .6, 1.0], [1.56, .6, 1.0], [1.59, .6, 1.0],
       [1.5, .8, .96], [1.47, .8, .96], [1.44, .8, .96], [1.5, .6, .96], [1.47, .6, .96], [1.44, .6, .96],
       [1.44, .6, .93], [1.44, .6, .9]]  # [satır aralığı, paragraf aralığı em, punto çarpanı]; son ikisi yalnız tablo/liste bölümleri için makul
for i, e in gs:
    if e < 0.70 or e >= 1.0 or i >= n: continue
    sid = None
    for p in (i, i - 1, i - 2):  # koşan başlık yalnız sağ sayfalarda bölüm adını taşır; geriye bak
        ls = page_lines(p)
        sid = next((rh[up(l)] for l in ls if up(l) in rh), None)  # koşan başlık; pdftotext sırası sayfaya göre değişebiliyor
        if sid: break
    if not sid or sid.startswith('on-'): continue  # ön bölümler CSS ile (section.front) ayarlanır
    if not is_opener(page_lines(i + 1)): continue
    cur = tighten.get(sid, [1.5, .8, 1.0])
    cur = [float(cur), .8, 1.0] if not isinstance(cur, list) else (cur + [1.0])[:3]
    pos = SEQ.index(cur) if cur in SEQ else 0
    if pos + 1 >= len(SEQ): report.append(f'  s.{i} %{int(e*100)} {sid}: kuyruk; aralık sınırda ({cur})'); continue
    tighten[sid] = SEQ[pos + 1]; changed = True
    report.append(f'  s.{i} %{int(e*100)} {sid}: bölüm kuyruğu tek başına → satır {tighten[sid][0]}, paragraf {tighten[sid][1]}em, punto ×{tighten[sid][2]}')
out_plan = dict(plan)
if tighten: out_plan['_tighten'] = tighten
json.dump(out_plan, open(plan_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
big = [(i, e) for i, e in gs if 0.20 <= e < 1.0]
print(f'gapplan: {n} sayfa · alt boşluğu %20+ olan {len(big)} sayfa · plan {len(plan)} şekil' + (' (güncellendi)' if changed else ' (değişmedi)'))
for r in report: print(r)
sys.exit(3 if changed else 0)

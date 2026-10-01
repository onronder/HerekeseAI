#!/usr/bin/env python3
"""R099: 45 şeklin metinsel/verisel eşliği. Her şekil SVG'sindeki görünür metin parçalarından (etiketler, sayılar) hangilerinin
aynı şeklin kitap içi metninde (başlık + Kurulum + Adım adım + tablolar + Ne oluyor + Kendin dene) da geçtiği ölçülür.
Sayılar biçim farkını yok sayarak (0.62 = 0,62 = 62 %) eşlenir. Çıktı: JSON (şekil başına kapsam, eksik parçalar).
Kullanım: python3 fig_coverage.py tr|en [epub]"""
import glob, html, json, os, re, sys, tempfile, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
lang = sys.argv[1] if len(sys.argv) > 1 else 'en'
src = sys.argv[2] if len(sys.argv) > 2 else None
FIG = os.path.join(ROOT, 'print', 'figures', 'out', lang)
pre = 'sekil' if lang == 'tr' else 'figure'
word = 'Şekil' if lang == 'tr' else 'Figure'
if src and src.endswith('.epub'):
    d = tempfile.mkdtemp(); subprocess.run(['unzip', '-q', '-o', src, '-d', d])
    text = '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(f'{d}/EPUB/text/*.xhtml')))
    subprocess.run(['rm', '-rf', d])
else:
    text = open(src or os.path.join(ROOT, 'print', 'kitap', 'Herkes-Icin-Yapay-Zeka-TR.html' if lang == 'tr' else 'en/AI-for-Everyone-EN.html'), encoding='utf-8').read()
plain = html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<(sup|sub)>(.*?)</\1>', r'\2', text)))
plain = re.sub(r'\s+', ' ', plain)
def norm_num(s):
    s = s.replace('−', '-').replace(',', '.')
    try: return f'{float(s):g}'
    except ValueError: return None
def nums(s):
    """Her sayı için kabul edilen gösterimler: [(değer, ondalık hane), …]; yüzde ifadesi n ya da n/100 olarak eşleşebilir."""
    out = []
    s = s.replace('−', '-')
    s = re.sub(r'(?<=\d)[.,](?=\d{3}(?![\d.,]))', '', s) if re.search(r'\d{1,3}([.,]\d{3})+(?![\d.,])', s) else s
    for m in re.finditer(r'(%\s?)?(\d+(?:[.,]\d+)?)(\s?%)?', s):
        raw = m.group(2).replace(',', '.'); dec = len(raw.split('.')[1]) if '.' in raw else 0; v = float(raw)
        out.append([(v, dec)] + ([(v / 100, dec + 2)] if (m.group(1) or m.group(3)) else []))
    return out
def covered(lnums, segvals):
    # etiket sayısı, metindeki bir sayının aynı ondalık haneye yuvarlanmışı ise eşleşir (0.52 ↔ 0.5229; 36 % ↔ 0.36)
    return all(any(any(abs(round(sv, d) - v) < 1e-9 for sv in segvals) for v, d in alts) for alts in lnums)
res = {}
for svgp in sorted(glob.glob(f'{FIG}/{pre}-*-*.svg'), key=lambda p: [int(x) for x in re.findall(r'-(\d+)-(\d+)-', os.path.basename(p))[0]]):
    a, b = re.findall(r'-(\d+)-(\d+)-', os.path.basename(svgp))[0]; num = f'{a}.{b}'
    svg = open(svgp, encoding='utf-8').read()
    labels = [html.unescape(re.sub(r'<[^>]+>', '', t)).strip() for t in re.findall(r'<text[^>]*>(.*?)</text>', svg, re.S)]
    labels = [l for l in labels if l]
    # şeklin metin bölümü: "Şekil N.j ·" başlığından bir sonraki şekil başlığına ya da bölüm başlığına kadar
    st = plain.find(f'{word} {num} ·')
    if st < 0: res[num] = {'error': 'başlık yok'}; continue
    nx = re.search(rf'{word} \d+\.\d+ ·|Chapter \d+ |Bölüm \d+ ', plain[st + 10:])
    seg = plain[st: st + 10 + (nx.start() if nx else 20000)]
    # cevap anahtarındaki aynı şekil girişi de metinsel eşdeğerin parçasıdır
    for m in re.finditer(rf'{word} {num} · ', plain[st + 10:]):
        q = st + 10 + m.start(); seg += ' ' + plain[q:q + 3000]
    segvals = sorted({v for alts in nums(seg) for v, _ in alts}); seg_l = seg.lower()
    have, miss = 0, []
    for l in labels:
        ln = nums(l)
        words = [w for w in re.findall(r'[^\W\d_]{4,}', l.lower())]
        ok = (ln and covered(ln, segvals)) or (not ln and words and all(w in seg_l for w in words)) or (not ln and not words)
        if ok: have += 1
        else: miss.append(l)
    res[num] = {'labels': len(labels), 'covered': have, 'pct': round(100 * have / max(1, len(labels))), 'missing': miss[:12]}
tot = sum(v.get('labels', 0) for v in res.values()); cov = sum(v.get('covered', 0) for v in res.values())
print(json.dumps({'lang': lang, 'figures': len(res), 'labels': tot, 'covered': cov, 'pct': round(100 * cov / max(1, tot), 1),
                  'below80': {k: v['pct'] for k, v in res.items() if v.get('pct', 0) < 80}, 'per_figure': res}, ensure_ascii=False, indent=1))

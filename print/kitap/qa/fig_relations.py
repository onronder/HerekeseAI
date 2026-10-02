#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""R099/N003: 45 şeklin kritik değer, işaret, sıra ve ilişki eşliği için ayrı kabul kaydı (EN EPUB).
fig_coverage.py'deki yüzde MEKANİK etiket eşlemedir; anlam eşdeğerliği ölçmez. Bu betik her şekil için:
  • kritik değerler: üretici veri tablosundaki (figures/out/en/figure-N-j-*.md) işaretli sayılar; her biri işaretiyle birlikte
    (a) şeklin gövde metninde (Kurulum/Adım adım/tablolar/Ne oluyor) ve (b) Figure Data ekinde aranır;
  • sıra: tablo satır sırası ekte korunuyor mu (ilk ve son satırın ekteki konum sırası);
  • ilişki: görsel → Kurulum (aria-describedby), görsel → ek, ek → görsel bağlantıları.
Çıktı: print/kitap/qa/sekil-iliski-45.json; özet ekrana. Kullanım: python3 fig_relations.py [epub]"""
import glob, html, json, os, re, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
EPUB = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'print/kitap/en/AI-for-Everyone.epub')
d = tempfile.mkdtemp(); subprocess.run(['unzip', '-q', '-o', EPUB, '-d', d], check=True)
X = {os.path.basename(f): open(f, encoding='utf-8').read() for f in sorted(glob.glob(f'{d}/EPUB/text/*.xhtml'))}
subprocess.run(['rm', '-rf', d])
allx = '\n'.join(X.values())
THOU = lambda t: re.sub(r'(?<=\d),(?=\d{3}(?!\d))', '', t)  # binlik ayraç: 37,683,200 → 37683200
txt = lambda h: THOU(re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'</?(span|a|em|strong|sup|sub)\b[^>]*>', '', h)))).replace('−', '-'))
app_i = allx.find('id="figure-data"'); body_x, app_x = allx[:app_i], allx[app_i:]
res, bad = {}, []
for md in sorted(glob.glob(os.path.join(ROOT, 'print/figures/out/en/figure-*-*-*.md')), key=lambda f: [int(x) for x in re.findall(r'figure-(\d+)-(\d+)-', f)[0]]):
    a, b = re.findall(r'figure-(\d+)-(\d+)-', md)[0]; num, fid = f'{a}.{b}', f'fig-{a}-{b}'
    src = THOU(open(md, encoding='utf-8').read().replace('−', '-'))
    cells = [c.strip() for row in re.findall(r'^\|(.*)\|\s*$', src, re.M) if not re.match(r'^[\s|:-]+$', row) for c in row.split('|')]
    vals = sorted({m for c in cells for m in re.findall(r'(?<![\w.])[-+]?\d+(?:\.\d+)?%?(?![\w])', c)})
    # şeklin gövde metni: başlığından bir sonraki şekil başlığına; ek: kendi h3'ünden bir sonrakine
    st = body_x.find(f'id="{fid}"'); nx = re.search(r'id="fig-\d+-\d+"', body_x[st + 10:])
    body = txt(body_x[st: st + 10 + (nx.start() if nx else 40000)]) if st >= 0 else ''
    ast = app_x.find(f'id="{fid}-data"'); anx = app_x.find('<section id="fig-', ast + 10)
    app = txt(app_x[ast: anx if anx > 0 else None]) if ast >= 0 else ''
    def present(v, t):
        return re.search(r'(?<![\w.\d-])' + re.escape(v) + r'(?![\w\d])', t) is not None
    in_body = [v for v in vals if present(v, body)]; in_app = [v for v in vals if present(v, app)]
    missing = [v for v in vals if v not in in_body and v not in in_app]
    signed = [v for v in vals if v.startswith('-')]; signed_ok = all(present(v, app) or present(v, body) for v in signed)
    rows = [r for r in re.findall(r'^\|(.*)\|\s*$', src, re.M) if not re.match(r'^[\s|:-]+$', r)][1:]
    order_ok = True
    if len(rows) >= 2:
        f0, f1 = rows[0].split('|')[0].strip(), rows[-1].split('|')[0].strip()
        clean = lambda c: re.sub(r'\s+', ' ', re.sub(r'[*`]', '', html.unescape(c))).replace('−', '-').strip()
        SUBSUP = str.maketrans('₀₁₂₃₄₅₆₇₈₉ᵢⁱ⁰¹²³⁴⁵⁶⁷⁸⁹', '0123456789ii0123456789')
        ns = lambda t: re.sub(r'\s+', '', t.translate(SUBSUP))  # alt/üst simge ve boşluk farkı (EPUB'da <sub>) yok sayılır
        f0, f1, appn = ns(clean(f0)), ns(clean(f1)), ns(app)
        p0, p1 = appn.find(f0), appn.rfind(f1)
        order_ok = (not f0 or not f1) or (p0 >= 0 and p1 >= 0 and p0 <= p1)
    links = {'aria_kurulum': f'aria-describedby="{fid}-setup"' in allx and f'id="{fid}-setup"' in allx,
             'gorsel_to_ek': f'#{fid}-data"' in allx, 'ek_to_gorsel': f'#{fid}"' in allx and f'id="{fid}"' in allx}
    ok = not missing and signed_ok and order_ok and all(links.values())
    res[num] = {'kritik_deger': len(vals), 'govdede': len(in_body), 'ekte': len(in_app), 'eksik': missing[:10], 'isaretli': len(signed),
                'isaret_korundu': signed_ok, 'sira_korundu': order_ok, 'baglantilar': links, 'kabul': ok}
    if not ok: bad.append(num)
out = {'epub': os.path.relpath(EPUB, ROOT), 'sekil': len(res), 'kabul': len(res) - len(bad), 'sorunlu': bad,
       'kritik_deger_toplam': sum(r['kritik_deger'] for r in res.values()), 'govdede_toplam': sum(r['govdede'] for r in res.values()),
       'not': 'Mekanik etiket eşlemesi (fig_coverage.py) ayrı bir göstergedir; bu kayıt değer/işaret/sıra/bağlantı eşliğidir. Gerçek ekran okuyucu testi ayrıca gerekir.',
       'sekiller': res}
json.dump(out, open(os.path.join(ROOT, 'print/kitap/qa/sekil-iliski-45.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({k: out[k] for k in ('sekil', 'kabul', 'sorunlu', 'kritik_deger_toplam', 'govdede_toplam')}, ensure_ascii=False))
sys.exit(1 if bad else 0)

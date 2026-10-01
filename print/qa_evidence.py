#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kapanış raporu kanıt üretici (düzeltme belgesi R001–R099). Çıktı: print/kitap/qa/kanit.json + ekrana özet.
Ölçümler: yer tutucular, denetleyiciler, metin bütünlüğü, QR sessiz alanı, EAN çubuk yüksekliği, siyah ayrımı (inkcov + operatör),
dizin (HTML=PDF giriş kümesi, tekrar numaraları, örnek terim sayfaları), figür etiket min punto, EN görünür Türkçe dize taraması,
90 canlı demo URL (HTTP), epubcheck, çıktı hash'leri. Kullanım: python3 print/qa_evidence.py [--no-http]"""
import glob, hashlib, json, os, re, subprocess, sys, tempfile, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
E = {}
def run(cmd, timeout=1800):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return (r.stdout + r.stderr).strip()
def sha(p): return hashlib.sha256(open(p, 'rb').read()).hexdigest() if os.path.exists(p) else None

OUT = {'tr_pdf': 'print/kitap/ic-blok.pdf', 'tr_cover': 'print/kitap/kapak.pdf', 'en_pdf': 'print/kitap/en/kdp-interior.pdf',
       'en_cover': 'print/kitap/en/kdp-cover.pdf', 'epub': 'print/kitap/en/AI-for-Everyone.epub', 'tr_html': 'Atlas-Kitap.dc.html', 'en_html': 'Atlas-Kitap-EN.dc.html'}
E['hash'] = {k: sha(v) for k, v in OUT.items()}
E['pages'] = {k: (re.search(r'Pages:\s+(\d+)', run(f'pdfinfo "{v}"')) or [None, None])[1] for k, v in OUT.items() if v.endswith('.pdf')}

# 1 yer tutucular
def placeholders(pdf):
    t = run(f'pdftotext "{pdf}" -')
    return sorted(set(re.findall(r'\[[A-Za-zİ][^\]\n]{2,50}\]', t)) - {'[log D(x)]', '[log(1 − D(G(z)))]'})
E['placeholders'] = {'tr': placeholders(OUT['tr_pdf']), 'en': placeholders(OUT['en_pdf'])}

# 2 denetleyiciler
E['checkers'] = {
    'style_tr': run('python3 print/check_style_tr.py | tail -1'), 'style_en': run('python3 print/check_style_en.py | tail -1'),
    'consistency': run('python3 print/check_consistency_en.py | tail -12'),
    'verbatim_tr': run('python3 print/check_verbatim_tr.py | tail -1'), 'verbatim_en': run('python3 print/check_verbatim_en.py | tail -1'),
}

# 3 metin bütünlüğü
E['integrity'] = {'tr': run('python3 print/typeset/check_text_integrity.py print/typeset/out/ic-blok.html print/kitap/ic-blok.pdf tr'),
                  'en': run('python3 print/typeset/check_text_integrity.py print/typeset/out/en-kdp/ic-blok.html print/kitap/en/kdp-interior.pdf en')}

# 4 QR (çözüm + sessiz alan)
E['qr'] = {'tr': run('cd print/typeset && node check_qr.mjs ../kitap/ic-blok.pdf tr'), 'en': run('cd print/typeset && node check_qr.mjs ../kitap/en/kdp-interior.pdf en')}

# 5 EAN çubuk yüksekliği (TR kapak): 600 dpi render, arka kapak sağ alt bölgede en uzun dikey siyah sütun
def ean_height(cover):
    d = tempfile.mkdtemp()
    run(f'pdftoppm -r 600 -gray -png "{cover}" {d}/c')
    f = sorted(glob.glob(f'{d}/c*.png'))[0]
    import struct, zlib
    # PNG çözümü için pngjs yerine python: basit yol → pdftoppm pgm
    run(f'pdftoppm -r 600 -gray "{cover}" {d}/g')
    g = sorted(glob.glob(f'{d}/g*.pgm'))[0]
    b = open(g, 'rb').read(); parts = b.split(maxsplit=4); w, h = int(parts[1]), int(parts[2]); data = parts[4][-w * h:]
    # arama bölgesi: sol üçte bir (arka kapak), alt %35
    best = 0
    x0, x1, y0, y1 = int(w * 0.05), int(w * 0.45), int(h * 0.55), h - 1
    for x in range(x0, x1, 2):
        y = y0
        while y < y1:
            if data[y * w + x] < 100:
                s0 = y
                while y < y1 and data[y * w + x] < 100: y += 1
                # yalnız üstü ve altı beyaz olan koşu (barkodun beyaz zemini; koyu kapak zemini sayılmaz)
                if s0 > 3 and y < y1 - 3 and data[(s0 - 3) * w + x] > 200 and data[(y + 3) * w + x] > 200:
                    best = max(best, y - s0)
            y += 1
    subprocess.run(['rm', '-rf', d])
    return round(best * 25.4 / 600, 2)
def ean_geometry(html='print/kapak/out/kapak.html', print_w_mm=38.0):
    """Barkod geometrisi: kapak HTML'indeki JsBarcode SVG'si 38 mm genişlikte basılır; çubuk yüksekliği = birim × ölçek."""
    h = open(html, encoding='utf-8').read(); seg = h[h.find('class="isbn"'):]
    W = float(re.search(r'<svg width="([\d.]+)px"', seg).group(1)); k = print_w_mm / W
    rects = [(float(a), float(b)) for a, b in re.findall(r'<rect x="[\d.]+" y="0" width="([\d.]+)" height="([\d.]+)"/>', seg)]
    hs = sorted({hh for _, hh in rects}); mod = min(w for w, _ in rects)
    return {'normal_bar_mm': round(hs[0] * k, 2), 'guard_bar_mm': round(hs[-1] * k, 2), 'module_mm': round(mod / 2 * k * 2 / 2, 3) if False else round(mod * k, 3),
            'print_width_mm': print_w_mm, 'digits': re.search(r'978[\d-]{10,17}', h).group(0) if re.search(r'978[\d-]{10,17}', h) else None}
try: E['ean'] = ean_geometry(); E['ean_bar_mm'] = E['ean']['normal_bar_mm']
except Exception as ex: E['ean_bar_mm'] = f'ölçülemedi: {ex}'

# 6 siyah ayrımı
E['ink'] = {}
for k in ('tr_pdf', 'en_pdf', 'tr_cover', 'en_cover'):
    pg = 15 if k.endswith('pdf') else 1
    E['ink'][k] = run(f'gs -q -o - -sDEVICE=inkcov -dFirstPage={pg} -dLastPage={pg} "{OUT[k]}"').split('\n')[-1]
E['ink_ops'] = {k: json.loads(run(f'python3 print/typeset/color_ops.py "{OUT[k]}"') or '{}') for k in ('tr_pdf', 'en_pdf', 'tr_cover', 'en_cover')}  # qpdf yok: içerik akışı sayımı


# 6b dizgi sayaçları (hooks.js → PDF Keywords): taşma, tablo başlık tekrarı, kutu devam etiketi, dizin tekrarı
E['layout'] = {'tr': run("pdfinfo print/typeset/out/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'"),
               'en': run("pdfinfo print/typeset/out/en-kdp/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'")}
# 6c sayfa kutuları (R084)
def boxes(pdf):
    t = run(f'pdfinfo -box -f 1 -l 1 "{pdf}"'); out = {}
    for b in ('MediaBox', 'BleedBox', 'TrimBox'):
        m = re.search(b + r':\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)', t)
        if m:
            x0, y0, x1, y1 = map(float, m.groups()); out[b] = f'{(x1-x0)*25.4/72:.1f} × {(y1-y0)*25.4/72:.1f} mm'
    return out
E['boxes'] = {k: boxes(OUT[k]) for k in ('tr_pdf', 'en_pdf', 'tr_cover', 'en_cover')}

# 7 dizin
def index_sets(html, pdf, lang):
    h = open(html, encoding='utf-8').read()
    names = re.findall(r'<div class="ix-e"><strong>(.*?)</strong>', h)
    names = [re.sub(r'<[^>]+>', '', n).strip() for n in names]
    t = run(f'pdftotext -layout "{pdf}" -')
    key = 'Dizin' if lang == 'tr' else 'Index'
    seg = t[t.rfind('\n' + key):] if ('\n' + key) in t else t[-20000:]
    seg = seg.split('\f')
    # dizin sayfaları: 'Dizin'/'Index' başlığından Canlı Demolar/Live Demos'a kadar
    txt = '\n'.join(seg)
    stop = txt.find('Canlı Demolar' if lang == 'tr' else 'Live Demos')
    txt = txt[:stop] if stop > 0 else txt
    txt = txt.replace('ﬃ', 'ffi').replace('ﬁ', 'fi').replace('Ï', 'fi')  # pdftotext ffi bağlı harf eşlemesi
    found = [n for n in names if re.search(r'(?m)^\s*' + re.escape(n) + r'(?=\s|$)', txt)]
    missing = [n for n in names if n not in found]
    dups = re.findall(r'\b(\d+), \1\b', txt)
    order_ok = None
    if lang == 'tr':
        import importlib.util
        spec = importlib.util.spec_from_file_location('asm', 'print/assemble.py')
        try:
            src = open('print/assemble.py', encoding='utf-8').read()
            ns = {'__file__': os.path.abspath('print/assemble.py')}; exec(src.split('# Dil tablosu')[0], ns)
            keys = [ns['tr_key'](n) for n in names]; order_ok = keys == sorted(keys)
        except Exception as ex: order_ok = f'denetlenemedi: {ex}'
    else:
        order_ok = [n.lower() for n in names] == sorted(n.lower() for n in names)
    return {'html': len(names), 'pdf_found': len(found), 'missing': missing[:20], 'dup_pages': len(dups), 'alfabetik': order_ok}
E['index'] = {'tr': index_sets('print/typeset/out/ic-blok.html', OUT['tr_pdf'], 'tr'), 'en': index_sets('print/typeset/out/en-kdp/ic-blok.html', OUT['en_pdf'], 'en')}

# 8 figür etiket min punto
E['fig_fonts'] = run('cd print/figures && node check_fig_fonts.mjs 2>&1 | tail -5') if os.path.exists('print/figures/check_fig_fonts.mjs') else 'check_fig_fonts.mjs yok'

# 9 EN görünür Türkçe dize taraması (şablon ve modules metinleri)
en = open(OUT['en_html'], encoding='utf-8').read()
vis = re.findall(r'>([^<>{}]*[çğışöüÇĞİŞÖÜ][^<>{}]*)<', en) + re.findall(r"(?:h2|label|title):'([^']*[çğışöüÇĞİŞÖÜ][^']*)'", en)
vis = [v.strip() for v in vis if v.strip() and not re.search(r'Önder|Öykü|Kuzey|Poyraz|Seda|Gözde|Türkiye|TÜRKİYE|İstanbul|Fittechs|Gayrettepe|Yıldız', v)]
E['en_turkish_visible'] = vis[:30]

# 10 canlı demo URL
if '--no-http' not in sys.argv:
    slugs = json.load(open('qr-slugs.json', encoding='utf-8'))
    urls = [f'https://book.onuronder.com/d/{s}' for s in slugs['tr'].values()] + [f'https://book.onuronder.com/d/en/{s}' for s in slugs['en'].values()]
    ok = 0; bad = []
    for u in urls:
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'qa'}), timeout=20) as r:
                if r.status == 200: ok += 1
                else: bad.append((u, r.status))
        except Exception as ex: bad.append((u, str(ex)[:60]))
    E['live_urls'] = {'ok': ok, 'total': len(urls), 'bad': bad[:10]}

# 11 epubcheck + alt metin
E['epub'] = {'epubcheck': run(f'epubcheck "{OUT["epub"]}" 2>&1 | tail -2')}
d = tempfile.mkdtemp(); run(f'cd {d} && unzip -q "{ROOT}/{OUT["epub"]}"')
xh = ''.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(f'{d}/EPUB/text/*.xhtml')))
alts = re.findall(r'<img[^>]*alt="([^"]*)"', xh)
E['epub']['figures'] = len(alts); E['epub']['alt_descriptive'] = sum(1 for a in alts if len(a) > 20)
E['epub']['placeholders'] = sorted(set(re.findall(r'\[[A-Za-z][^\]]{2,40}\]', re.sub(r'<[^>]+>', '', xh))) - {'[log D(x)]', '[log(1 − D(G(z)))]'})
E['epub']['qr_word'] = re.sub(r'<[^>]+>', '', xh).count('QR')
subprocess.run(['rm', '-rf', d])

json.dump(E, open('print/kitap/qa/kanit.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k, v in E.items():
    print(f'== {k}'); print(json.dumps(v, ensure_ascii=False)[:600])

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kindle EPUB hazırlığı: print/kitap/en/AI-for-Everyone-EN.html → print/kindle/out/book.html (pandoc girişi)
  • figür SVG → PNG (img/figure-N-j.png; render_figs.sh üretir), QR görseli → "Live demo ↗" bağlantısı
  • Teknik derinlik kutusu → <aside class="tech">, Contents bölümü atılır (pandoc --toc üretir), Live Demos tablosu bağlantılı
  • başlık sayfası pandoc'tan (metadata); künye e-kitaba göre (basılıya özgü satırlar yok); sayfa sonu hr'ları atılır
  • cevap anahtarı ve dizin: girdi başına paragraf; Unicode üst/alt simgeler → <sup>/<sub>; "QR" ifadeleri → bağlantı
Kullanım: python3 print/kindle/kindle.py"""
import html as H
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(ROOT, 'print', 'kitap', 'en', 'AI-for-Everyone-EN.html')
OUT = os.path.join(HERE, 'out')

doc = open(SRC, encoding='utf-8').read()
body = doc.split('<div class="page">', 1)[1].rsplit('</div></body>', 1)[0]

# figürler: svg → png
body = re.sub(r'<img src="\.\./\.\./figures/out/en/(figure-(\d+)-(\d+))-[^"]+\.svg" alt="([^"]*)">',
              lambda m: f'<img src="img/{m.group(1)}.png" alt="{m.group(4)}">', body)
# figcaption yalnız numara: başlık satırı zaten var, tekrar etmesin
body = re.sub(r'<figcaption>Figure \d+\.\d+</figcaption>', '', body)
# R099: her figüre tanımlayıcı alt metin = "Figure N.j, <başlık>. <Kurulum'un ilk cümlesi>" (görseldeki soruyu cevabı vermeden anlatır)
def alt_fix(m):
    pre, num, title, fig_html, post = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
    setup = re.search(r'<p><em>Setup\.</em>\s*(.*?)</p>', post[:4000], re.S)
    first = ''
    if setup:
        txt = re.sub(r'<[^>]+>', '', setup.group(1)); first = re.split(r'(?<=[.!?])\s', txt.strip())[0]
    alt = H.escape(f'Figure {num}, {re.sub(r"<[^>]+>", "", title).strip()}. {first}'.strip(), quote=True)
    return pre + num + ' · ' + title + fig_html.replace(f'alt="Figure {num}"', f'alt="{alt}"') + post
body = re.sub(r'(<p><strong>Figure )(\d+\.\d+) · ([^<]*)(</strong>\s*<figure>.*?</figure>\s*</p>)((?:(?!<figure>).){0,4000})', alt_fix, body, flags=re.S)
# QR: görsel yerine bağlantı ("Live demo: [QR] url" → tek düğme)
body = re.sub(r' ?Live demo: <span class="qr"><img src="[^"]*qr-(\d+)-(\d+)\.svg" alt="[^"]*"><span class="mono">([^<]+)</span></span>',
              lambda m: f'<a class="live" href="https://{H.unescape(m.group(3))}">Live demo {m.group(1)}.{m.group(2)} ↗</a>', body)
assert '<img src="../../figures' not in body and 'qr-' not in body, 'dönüştürülmemiş görsel kaldı'
# teknik derinlik kutusu
body = body.replace('<div class="h4box">', '<aside class="tech">').replace('</div>', '</aside>')
# başlık bloğu: pandoc metadata'dan başlık sayfası üretir; künyeye kendi başlığı
body = re.sub(r'^\s*<h1>AI for Everyone</h1>\s*<h2>[^<]*</h2>\s*<p><strong>Onur Önder</strong></p>\s*<hr class="pb">\s*<p><strong>AI for Everyone</strong></p>\s*<p>Onur Önder</p>',
              '<h1>Copyright</h1>\n<p><strong>AI for Everyone · From rules to deep learning</strong></p>\n<p>Onur Önder</p>', body, count=1)
# künye: basılıya özgü satırlar e-kitapta yok
body = re.sub(r'<p>Print edition ISBN: [^<]*</p>\s*', '', body)
body = re.sub(r'<p>Printing and binding: [^<]*</p>\s*', '', body)
body = re.sub(r'<p>Printed on demand by [^<]*</p>\s*', '', body)
body = re.sub(r'<p>Interactive digital edition ISBN: [^<]*</p>\s*', '', body)  # e-kitapta başka sürümün ISBN'i yer almaz
body = re.sub(r'<p>First edition: [^<]*</p>', '<p>First edition: 2026. Kindle edition.</p>', body)
# bölüm başlıkları: "Chapter N" + h2 başlık → tek h1 (içindekiler tek satır; alt bölümler h3 → --toc-depth=3)
body = re.sub(r'<h1>(Chapter \d+)</h1>\s*<h2>(.*?)</h2>', r'<h1>\1 · \2</h1>', body, flags=re.S)
# Contents bölümünü at (h1 Contents … bir sonraki h1'e kadar)
body = re.sub(r'<h1>Contents</h1>.*?(?=<h1>)', '', body, flags=re.S)
# QR sözü: e-kitapta bağlantı
body = body.replace('The QR code under each figure opens the live version of that experiment on your phone.',
                    'The “Live demo” link under each figure opens the live version of that experiment in your browser.')
body = body.replace('(and the QR codes under the figures)', '(and the “Live demo” links under the figures)')
assert 'QR' not in re.sub(r'<[^>]+>', '', body), 'metinde QR sözü kaldı: ' + re.sub(r'<[^>]+>', '', body)[max(0, re.sub(r'<[^>]+>', '', body).find('QR') - 80):][:160]
# Live Demos tablosundaki adresler: kısa bağlantı metni (uzun URL dar ekranda taşıyor)
body = re.sub(r'<td>(https://book\.onuronder\.com/d/en/[a-z0-9]+)</td>', r'<td><a href="\1">open ↗</a></td>', body)
# cevap anahtarı: soru başına paragraf
body = re.sub(r' (?=\d+\.\d+ · Question \d+:)', '</p>\n<p>', body)
# dizin: girdi başına paragraf
def ix(m):
    inner = m.group(1)
    parts = re.split(r' (?=<strong>)', inner)
    return '<div class="ix">\n' + ''.join(f'<p>{p}</p>\n' for p in parts) + '</div>\n'  # pandoc p sınıfını düşürür, div'i korur
i = body.find('<h1>Index</h1>')
if i >= 0:
    head, tail = body[:i], body[i:]
    tail = re.sub(r'<p>(<strong>.*?)</p>', ix, tail, count=1, flags=re.S)
    body = head + tail
# sayfa sonu ve dizin notu
body = body.replace('<hr class="pb">', '')
body = body.replace('Page numbers are added at typesetting.', 'Entries link to the section where the term appears.')
# Unicode üst/alt simgeler → <sup>/<sub> (e-mürekkep fontlarında eksik olabiliyor)
SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ⁿⁱ'; SUB = '₀₁₂₃₄₅₆₇₈₉₊₋₍₎ₐₑₒₓₖₗₘₙₚₛₜ'
SUPMAP = dict(zip(SUP, '0123456789+-()ni')); SUBMAP = dict(zip(SUB, '0123456789+-()aeoxklmnpst'))
def to_sup(m): return '<sup>' + ''.join(SUPMAP.get(c, c) for c in m.group(0)) + '</sup>'
def to_sub(m): return '<sub>' + ''.join(SUBMAP.get(c, c) for c in m.group(0)) + '</sub>'
body = re.sub('[' + SUP + '](?:[' + SUP + '·])*', to_sup, body)
body = re.sub('[' + SUB + ']+', to_sub, body)
# bölüm kimlikleri: h1'e id ver (pandoc bölüm dosyalarını h1'de böler)
def h1id(m):
    t = re.sub(r'<[^>]+>', '', m.group(1)); s = re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    return f'<h1 id="{s}">{m.group(1)}</h1>'
body = re.sub(r'<h1>(.*?)</h1>', h1id, body)
os.makedirs(OUT, exist_ok=True)
out = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AI for Everyone</title></head><body>\n' + body + '\n</body></html>\n')
open(os.path.join(OUT, 'book.html'), 'w', encoding='utf-8').write(out)
figs = len(re.findall(r'<img src="img/figure-', out)); lives = out.count('class="live"')
ph = sorted(set(re.findall(r'\[[A-Za-z][^\]]{2,40}\]', re.sub(r'<[^>]+>', '', out))))
print(f'{os.path.relpath(os.path.join(OUT, "book.html"), ROOT)}: {len(out)//1024} KB · figures {figs} · live links {lives} · asides {out.count("<aside")} · sup {out.count("<sup>")} · sub {out.count("<sub>")} · placeholders {ph}')

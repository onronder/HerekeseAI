#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kindle EPUB hazırlığı: print/kitap/en/AI-for-Everyone-EN.html → print/kindle/out/book.html (pandoc girişi)
  • figür SVG → PNG (img/figure-N-j.png; render_figs.sh üretir), QR görseli → "Live demo" bağlantısı
  • Teknik derinlik kutusu → <aside class="tech">, Contents bölümü atılır (pandoc --toc üretir), Live Demos tablosu bağlantılı
  • başlık sayfası / künye korunur; sayfa sonu hr'ları atılır
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
# QR: görsel yerine bağlantı
body = re.sub(r'<span class="qr"><img src="[^"]*qr-(\d+)-(\d+)\.svg" alt="[^"]*"><span class="mono">([^<]+)</span></span>',
              lambda m: f'<a class="live" href="https://{H.unescape(m.group(3))}">↗ open the live demo</a>', body)
assert '<img src="../../figures' not in body and 'qr-' not in body, 'dönüştürülmemiş görsel kaldı'
# teknik derinlik kutusu
body = body.replace('<div class="h4box">', '<aside class="tech">').replace('</div>', '</aside>')
# Contents bölümünü at (h1 Contents … bir sonraki h1'e kadar)
body = re.sub(r'<h1>Contents</h1>.*?(?=<h1>)', '', body, flags=re.S)
# Live Demos tablosundaki adresler bağlantı
body = re.sub(r'<td>(https://book\.onuronder\.com/d/en/[a-z0-9]+)</td>', r'<td><a href="\1">\1</a></td>', body)
# sayfa sonu ve dizin notu
body = body.replace('<hr class="pb">', '')
body = body.replace('Page numbers are added at typesetting.', 'Entries link to the section where the term appears.')
# bölüm kimlikleri: h1'e id ver (pandoc bölüm dosyalarını h1'de böler)
def h1id(m):
    t = re.sub(r'<[^>]+>', '', m.group(1)); s = re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    return f'<h1 id="{s}">{m.group(1)}</h1>'
body = re.sub(r'<h1>(.*?)</h1>', h1id, body)
os.makedirs(OUT, exist_ok=True)
out = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AI for Everyone</title></head><body>\n' + body + '\n</body></html>\n')
open(os.path.join(OUT, 'book.html'), 'w', encoding='utf-8').write(out)
figs = len(re.findall(r'<img src="img/figure-', out)); lives = out.count('class="live"')
print(f'{os.path.relpath(os.path.join(OUT, "book.html"), ROOT)}: {len(out)//1024} KB · figures {figs} · live links {lives} · asides {out.count("<aside")}')

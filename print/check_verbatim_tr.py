#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""book.json (EN) içindeki kaynak paragrafların (Simple, Technical, margin note, What is happening? basit/teknik) TR bölüm
dosyalarında BİREBİR bulunup bulunmadığını denetler; bulunmayanları (uyarlanmışları) listeler. Kullanım: python3 print/check_verbatim_en.py"""
import glob, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
book = json.load(open(os.path.join(ROOT, 'print', 'src', 'tr', 'book.json'), encoding='utf-8'))
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
total = 0
for mod in book['modules']:
    n = int(mod['n'])
    f = glob.glob(os.path.join(ROOT, 'print', 'src', 'tr', f'M0{n}-*.md'))[0]
    md = norm(re.sub(r'<!--.*?-->', '', open(f, encoding='utf-8').read(), flags=re.S))  # yorum blokları (SOURCE-CHANGES) hariç
    miss = []
    for si, sec in enumerate(mod['sections']):
        items = []
        for key in ('basit', 'teknik'):
            for i, p in enumerate(sec.get(key) or []):
                items.append((f'{n}.{si+1} {key}[{i}]', p))
        if sec.get('tip'):
            items.append((f'{n}.{si+1} tip', sec['tip']))
        d = sec.get('demo') or {}
        for key in ('neOluyorBasit', 'neOluyor'):
            if d.get(key):
                items.append((f'{n}.{si+1} demo.{key}', d[key]))
        for label, p in items:
            p = norm(re.sub(r'<[^>]+>', '', p))
            if p and p not in md:
                miss.append((label, p[:90]))
    total += len(miss)
    print(f'Chapter {n}: {len(miss)} source paragraphs not verbatim')
    for label, p in miss:
        print(f'    {label}: {p}…')
print(f'TOTAL not verbatim: {total} (her biri REDAKSİYON NOTLARI\'ta gerekçeli olmalı)')

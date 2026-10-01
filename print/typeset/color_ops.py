#!/usr/bin/env python3
"""PDF içerik akışlarındaki dolgu/çizgi renk operatörlerini sayar (qpdf gerektirmez): zengin siyah (1 1 1 0 k / 1 1 1 1 k), yalnız-K siyah
(0 0 0 1 k, 0 g), diğer CMYK. Kullanım: python3 color_ops.py dosya.pdf  → JSON"""
import json, re, sys, zlib
d = open(sys.argv[1], 'rb').read()
cnt = {'rich_black_cmy': 0, 'k_only_black': 0, 'gray_black': 0, 'other_cmyk': 0, 'streams': 0}
for m in re.finditer(rb'stream\r?\n', d):
    raw = d[m.end():d.find(b'endstream', m.end())]
    try: s = zlib.decompressobj().decompress(raw)
    except Exception: continue
    if not s: continue
    cnt['streams'] += 1
    for op in re.finditer(rb'(?<![\w.])([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) [kK](?![\w])', s):
        c, mm, y, k = (float(x) for x in op.groups())
        if c > 0.9 and mm > 0.9 and y > 0.9: cnt['rich_black_cmy'] += 1
        elif c == mm == y == 0 and k > 0.99: cnt['k_only_black'] += 1
        else: cnt['other_cmyk'] += 1
    cnt['gray_black'] += len(re.findall(rb'(?<![\w.])0 [gG](?![\w])', s))
print(json.dumps(cnt))

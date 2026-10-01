#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kaynak–PDF metin bütünlüğü kapısı (R090/R091): dizgi HTML'indeki her cümle (≥ 25 karakter) PDF metninde bulunmalı.
Kullanım: python3 check_text_integrity.py <ic-blok.html> <pdf> <tr|en>   → çıkış 0 temiz, 1 kayıp var."""
import re, subprocess, sys, html as H

html_path, pdf, lang = sys.argv[1:4]
s = open(html_path, encoding='utf-8').read()
body = s.split('<body>', 1)[1]
body = re.sub(r'<section class="back notes">.*?</section>', '', body, flags=re.S)
body = re.sub(r'<section[^>]*class="[^"]*(?:toc|index)[^"]*"[^>]*>.*?</section>', '', body, flags=re.S)  # içindekiler/dizin: sayfa numaraları dizgide
body = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S)
body = re.sub(r'<span class="rh">.*?</span>', ' ', body, flags=re.S)
body = re.sub(r'<style.*?</style>', ' ', body, flags=re.S)
body = re.sub(r'<(table|figcaption)[ >].*?</\1>', ' ', body, flags=re.S)  # tablo/altyazı: pdftotext sırası farklı
body = re.sub(r'<br\s*/?>', ' ⏎ ', body)  # satır sonu (sınav şıkları): ayrı cümle
body = re.sub(r'<[^>]+>', ' ', body)
body = H.unescape(body)


def norm(t):
    t = t.replace('İ', 'i').replace('I', 'ı').lower() if lang == 'tr' else t.lower()
    t = re.sub(r'[\s­‐‑\-–—]+', '', t)
    t = re.sub(r'[\u2070-\u209f\u1d62-\u1d6a\u00b2\u00b3\u00b9]', '', t)
    if lang == 'en': t = re.sub(r'[fﬁﬂﬀﬃﬄï]', '', re.sub(r'fi|fl', '', t))  # bağlı harf (ffi) glifinin pdftotext eşlemesi bozuk ('Ï'); görüntü doğru  # alt/üst simgeler: yedek fonttan (Type 3) basılır, pdftotext metne çeviremez
    return t


sentences = [x.strip() for x in re.split(r'(?<=[.!?;:])\s+|\s*⏎\s*', body) if len(x.strip()) >= 25 and '□' not in x and '→' not in x and '\u0304' not in x]  # birleşik makron (x̄, ȳ): pdftotext sırası farklı
pdftxt = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True).stdout
heads = ['HERKES İÇİN YAPAY ZEKÂ', 'CEVAP ANAHTARI', 'AI FOR EVERYONE', 'ANSWER KEY']
lines = []
for l in pdftxt.split('\n'):
    t = l.strip()
    if not t or re.fullmatch(r'\d+', t) or re.match(r'(BÖLÜM|CHAPTER) \d+ ·', t) or t in heads: continue
    lines.append(t)
P = norm(' '.join(lines))
missing = []
for sent in sentences:
    n = norm(sent)
    if len(n) < 20 or n in P: continue
    # kısmi: en uzun bulunan ön/arka ek → kayıp parça
    a = 0
    while a < len(n) and n[:a + 1] in P: a += 1
    b = 0
    while b < len(n) - a and n[len(n) - b - 1:] in P: b += 1
    gap = n[a:len(n) - b]
    if len(gap) >= 8: missing.append((sent, gap))
print(f'{lang}: {len(sentences)} cümle denetlendi · PDF\'de bulunamayan {len(missing)}')
for sent, gap in missing[:40]:
    print(f'  KAYIP: …{gap[:80]}…  ← {sent[:90]}')
sys.exit(1 if missing else 0)

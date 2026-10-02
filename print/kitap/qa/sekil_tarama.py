#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dizgi ölçeğinde şekil taraması (R073/N008, R082): son PDF'lerden 45 TR + 45 EN şeklin sayfaları 180 dpi PNG.
Her şeklin sayfası, şekle ait QR adresinin (qr-slugs.json) geçtiği sayfadır; şekil QR'dan önceki sayfada başlıyorsa o sayfa da alınır.
Çıktı: print/kitap/qa/sekil-tarama/{tr-sekil|en-figure}-N-j-p<pdf sayfası>.png ve indeks.json (şekil → sayfalar, PDF SHA-256).
Kullanım: python3 print/kitap/qa/sekil_tarama.py"""
import hashlib, json, os, re, subprocess, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')); os.chdir(ROOT)
OUT = 'print/kitap/qa/sekil-tarama'; os.makedirs(OUT, exist_ok=True)
for f in glob.glob(f'{OUT}/*.png'): os.remove(f)
PDF = {'tr': 'print/kitap/ic-blok.pdf', 'en': 'print/kitap/en/kdp-interior.pdf'}
LBL = {'tr': ('Şekil', 'sekil'), 'en': ('Figure', 'figure')}
slugs = json.load(open('qr-slugs.json', encoding='utf-8'))
idx = {}
for lang, pdf in PDF.items():
    pages = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True).stdout.split('\f')
    word, stem = LBL[lang]; idx[lang] = {'pdf': pdf, 'sha256': hashlib.sha256(open(pdf, 'rb').read()).hexdigest(), 'sekiller': {}}
    for num, slug in sorted(slugs[lang].items(), key=lambda kv: [int(x) for x in kv[0].split('.')]):
        q = next(i for i, t in enumerate(pages) if slug in t)  # 0 tabanlı
        cap = re.compile(rf'{word}\s+{re.escape(num)}\b')
        start = q
        while start > 0 and not cap.search(pages[start]) and q - start < 2: start -= 1
        sel = list(range(start, q + 1)) if cap.search(pages[start]) else [q]
        for p in sel:
            subprocess.run(['pdftoppm', '-r', '180', '-png', '-singlefile', '-f', str(p + 1), '-l', str(p + 1), pdf,
                            f'{OUT}/{lang}-{stem}-{num.replace(".", "-")}-p{p + 1:03d}'], check=True)
        idx[lang]['sekiller'][num] = [p + 1 for p in sel]
json.dump(idx, open(f'{OUT}/indeks.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"{OUT}: TR {len(idx['tr']['sekiller'])} şekil, EN {len(idx['en']['sekiller'])} şekil, {len(glob.glob(OUT + '/*.png'))} PNG (180 dpi)")

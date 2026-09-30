#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bölüm dosyalarındaki redaksiyon notu bloklarını tek dosyada toplar.
tr → print/kitap/REDAKSIYON-NOTLARI.md · en → print/kitap/en/EDITORIAL-NOTES.md"""
import glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang = sys.argv[1]
cfg = {'tr': ('REDAKSİYON NOTLARI', 'Redaksiyon notları (TR basılı sürüm)', 'print/kitap/REDAKSIYON-NOTLARI.md', ['on', 'arka', 'cevaplar']),
       'en': ('EDITORIAL NOTES', 'Editorial notes (EN print edition)', 'print/kitap/en/EDITORIAL-NOTES.md', ['front', 'back', 'answers'])}[lang]
files = sorted(glob.glob(f'{ROOT}/print/src/{lang}/M0*-*.md'))
for d in cfg[3]: files += sorted(glob.glob(f'{ROOT}/print/src/{lang}/{d}/*.md'))
out = [f'# {cfg[1]}', '', f'Kaynak: `print/src/{lang}/` dosyalarındaki `<!-- {cfg[0]} -->` blokları · üretildi: `python3 print/notes_digest.py {lang}`', '']
n = 0
for f in files:
    s = open(f, encoding='utf-8').read()
    m = re.search(r'<!--\s*' + re.escape(cfg[0]) + r'\s*\n(.*?)-->', s, re.S)
    if not m: continue
    body = m.group(1).strip()
    n += body.count('\n- ') + (1 if body.startswith('- ') else 0)
    out += [f'## {os.path.relpath(f, ROOT + "/print/src/" + lang)}', '', body, '']
p = os.path.join(ROOT, cfg[2]); open(p, 'w', encoding='utf-8').write('\n'.join(out))
print(f'{cfg[2]}: {len(out)} satır, ~{n} madde')

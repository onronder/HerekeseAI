#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Birebir olmayan kaynak paragrafları için kelime düzeyinde fark: kaynak (book.json) ↔ EN bölümdeki en yakın paragraf."""
import difflib, glob, json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
book = json.load(open(os.path.join(ROOT, 'print', 'src', 'en', 'book.json'), encoding='utf-8'))
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
for mod in book['modules']:
    n = int(mod['n'])
    f = glob.glob(os.path.join(ROOT, 'print', 'src', 'en', f'M0{n}-*.md'))[0]
    raw = re.sub(r'<!--.*?-->', '', open(f, encoding='utf-8').read(), flags=re.S)
    paras = [norm(p) for p in re.split(r'\n\s*\n', raw) if p.strip()]
    md = norm(raw)
    for si, sec in enumerate(mod['sections']):
        items = [(f'{n}.{si+1} {k}[{i}]', p) for k in ('basit', 'teknik') for i, p in enumerate(sec.get(k) or [])]
        if sec.get('tip'): items.append((f'{n}.{si+1} tip', sec['tip']))
        d = sec.get('demo') or {}
        items += [(f'{n}.{si+1} demo.{k}', d[k]) for k in ('neOluyorBasit', 'neOluyor') if d.get(k)]
        for label, p in items:
            p = norm(re.sub(r'<[^>]+>', '', p))
            if not p or p in md: continue
            best = max(paras, key=lambda q: difflib.SequenceMatcher(None, p, q).ratio())
            best = re.sub(r'^(> \*\*Margin note\.\*\* |\*What is happening\?\* )', '', best)
            a, b = p.split(), best.split()
            sm = difflib.SequenceMatcher(None, a, b)
            out = []
            for op, i1, i2, j1, j2 in sm.get_opcodes():
                if op == 'equal': continue
                out.append(f"[{' '.join(a[i1:i2])}] → [{' '.join(b[j1:j2])}]")
            print(f'{label}: ' + ' | '.join(out) if out else f'{label}: (yalnız biçim farkı)')

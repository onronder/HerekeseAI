#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Baskı dosyalarını koruma denetimi (site işleri print/ ve BASKI.md'ye dokunmamalı).
  python3 tools/site/print_guard.py --snapshot   → tools/site/print-guard.json (SHA-256 manifesti)
  python3 tools/site/print_guard.py --check      → manifestle karşılaştırır; fark varsa çıkış 1
node_modules, __pycache__ ve geçici dizgi çıktıları (print/typeset/out, print/kindle/out) manifest dışıdır."""
import hashlib, json, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); os.chdir(ROOT)
SKIP = ('node_modules', '__pycache__', '.DS_Store')
MAN = 'tools/site/print-guard.json'


def manifest():
    out = {}
    for base in ('print', 'BASKI.md'):
        if os.path.isfile(base):
            out[base] = hashlib.sha256(open(base, 'rb').read()).hexdigest(); continue
        for d, dirs, files in os.walk(base):
            dirs[:] = [x for x in dirs if x not in SKIP]
            for f in files:
                if f in SKIP: continue
                p = os.path.join(d, f); out[p] = hashlib.sha256(open(p, 'rb').read()).hexdigest()
    return out


if '--snapshot' in sys.argv:
    m = manifest(); json.dump(m, open(MAN, 'w'), indent=0, sort_keys=True); print(f'{MAN}: {len(m)} dosya')
else:
    old = json.load(open(MAN)); new = manifest()
    diff = sorted(k for k in set(old) | set(new) if old.get(k) != new.get(k))
    print(f'print guard: {len(new)} dosya · fark {len(diff)}'); [print('  ', d) for d in diff[:40]]
    sys.exit(1 if diff else 0)

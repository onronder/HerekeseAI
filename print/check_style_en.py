#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""English manuscript style check (STYLE-GUIDE-EN.md §6). Usage: python3 print/check_style_en.py [files…] (default: print/src/en/M0*.md)"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIG = os.path.join(ROOT, 'print', 'figures', 'out', 'en')
BANNED = [r'\bsurprising(?:ly)?\b', r'\bcritical(?:ly)?\b', r'\bcrucial(?:ly)?\b', r'\bgame-changing\b', r'\brevolutionary\b',
          r'\bin this chapter,? we will\b', r'\bit may sound strange\b', r'\bremember that\b', r'^\s*in summary\b', r'^\s*to sum up\b',
          r'^\s*in conclusion\b', r'\bnote that\b', r'\bdelve\b', r'\bleverage\b', r'\bunlock\b']
SCREEN = [r'\bclick(?:s|ed|ing)?\b', r'\bdrag(?:s|ged|ging)?\b', r'\bslider\b', r'\btoggle\b', r'\bthe demo below\b', r'\bhover\b',
          r'\bpress the button\b', r'\bswipe\b']
# kaynak metinden gelen ve "aynen" korunan paragraflar: tap/press/watch gibi fiiller orada olabilir; yalnız yeni metinde aranır
NEW_TEXT_MARKERS = ('*Setup.*', '*Step by step.*', '*Try it yourself.*', '*Self-test.*')
# kaynak (birebir) metindeki sabit ifadeler: yasak sözcük denetiminden muaf
ALLOW = ['critical infrastructure', 'is the critical part', 'tokenization is surprisingly important']


def sentences(text):
    text = re.sub(r'\([^)]*\)', '', text)
    return [t.strip() for t in re.split(r'(?<=[.!?])[”"’]?\s+(?=[A-Z“"0-9])', text) if t.strip()]


def check(path):
    md = open(path, encoding='utf-8').read()
    issues = []
    body = re.sub(r'<!--.*?-->', '', md, flags=re.S)
    if '[TO WRITE' in md:
        issues.append(f'[TO WRITE] markers: {md.count("[TO WRITE")}')
    for i, ln in enumerate(body.split('\n'), 1):
        if '—' in ln:
            issues.append(f'L{i}: em dash')
        low = ln.lower()
        for a in ALLOW:
            low = low.replace(a, '')
        if ln.startswith('|'):
            continue  # tablo satırları: demo verisi birebir
        for b in BANNED:
            if re.search(b, low):
                issues.append(f'L{i}: banned "{re.search(b, low).group(0)}"')
        if ln.startswith(NEW_TEXT_MARKERS) or (ln.startswith('|') is False and ln.startswith(tuple(f'{k}. ' for k in range(0, 10)))):
            for sc in SCREEN:
                if re.search(sc, low):
                    issues.append(f'L{i}: screen verb "{re.search(sc, low).group(0)}"')
        # cümle uzunluğu: yalnız yeni düzyazı (Setup / Step by step / Try it yourself), tablo ve teknik hariç
        if ln.startswith(NEW_TEXT_MARKERS):
            for snt in sentences(re.sub(r'\*[^*]+\*', '', ln)):
                n = len(snt.split())
                if n > 30:
                    issues.append(f'L{i}: {n}-word sentence: "{snt[:60]}…"')
    figs = re.findall(r'^\*\*Figure (\d+)\.(\d+) · ', body, re.M)
    lives = re.findall(r'Live demo: \[QR (\d+)\.(\d+)\]', body)
    if figs != lives:
        issues.append(f'Figure blocks {len(figs)} vs Live demo lines {len(lives)}')
    for m in re.finditer(r'!\[Figure [\d.]+\]\(\.\./\.\./figures/out/en/([^)]+)\)', body):
        if not os.path.exists(os.path.join(FIG, m.group(1))):
            issues.append(f'missing figure file: {m.group(1)}')
    return figs, issues


def main(files):
    total_figs, total_issues = 0, 0
    for f in files:
        figs, issues = check(f)
        total_figs += len(figs); total_issues += len(issues)
        print(f'{os.path.relpath(f, ROOT)}: {len(figs)} figures, {len(issues)} issues')
        for it in issues:
            print('   ', it)
    print(f'TOTAL: {total_figs} figures, {total_issues} issues')
    return 1 if total_issues else 0


if __name__ == '__main__':
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, 'print', 'src', 'en', 'M0*.md')))
    sys.exit(main(files))

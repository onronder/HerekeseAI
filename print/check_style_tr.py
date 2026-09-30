#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TR el yazması stil denetimi (YAZIM-KILAVUZU.md §1). Kullanım: python3 print/check_style_tr.py [dosyalar]"""
import glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIG = os.path.join(ROOT, 'print', 'figures', 'out', 'tr')
BANNED = [r'\bşaşırtıcı', r'\bkritik\b', r'\bbu (?:bölümde|modülde)\b.{0,40}\bgöreceğiz', r'\bkulağa tuhaf gelebilir', r'\bunutmayın ki', r'^\s*özetle\b', r'^\s*sonuç olarak\b', r'\bdevrim niteliğinde', r'\boyunun kurallarını değiştir']
SCREEN = [r'\btıkla', r'\bsürükle', r'\bbutona bas', r'\başağıdaki demo', r'\bkaydıracı', r'\bkaydırıcı']
NEW = ('*Kurulum.*', '*Adım adım.*', '*Kendin dene.*', '*Kendini sına.*')
ALLOW = ['kritik altyapı', 'kritik kararlarda']  # kaynak (birebir) metin
def sentences(t):
    t = re.sub(r'\([^)]*\)', '', t)
    return [x.strip() for x in re.split(r'(?<=[.!?])[”"’]?\s+(?=[A-ZÇĞİÖŞÜ“"0-9])', t) if x.strip()]
def check(path):
    md = open(path, encoding='utf-8').read(); body = re.sub(r'<!--.*?-->', '', md, flags=re.S); issues = []
    for i, ln in enumerate(body.split('\n'), 1):
        if '—' in ln: issues.append(f'L{i}: uzun tire')
        low = ln.lower()
        for a in ALLOW: low = low.replace(a, '')
        if ln.startswith('|'): continue
        for b in BANNED:
            if re.search(b, low): issues.append(f'L{i}: yasak kalıp "{re.search(b, low).group(0)}"')
        if ln.startswith(NEW) or re.match(r'^\d+\. ', ln):
            for sc in SCREEN:
                if re.search(sc, low): issues.append(f'L{i}: ekran fiili "{re.search(sc, low).group(0)}"')
        if ln.startswith(NEW):
            for s in sentences(re.sub(r'\*[^*]+\*', '', ln)):
                n = len(s.split())
                if n > 30: issues.append(f'L{i}: {n} kelimelik cümle: "{s[:60]}…"')
    figs = re.findall(r'^\*\*Şekil (\d+)\.(\d+) · ', body, re.M); lives = re.findall(r'Canlı demo: \[QR (\d+)\.(\d+)\]', body)
    if figs != lives: issues.append(f'Şekil blokları {len(figs)} vs Canlı demo satırları {len(lives)}')
    for m in re.finditer(r'!\[Şekil [\d.]+\]\(\.\./\.\./figures/out/tr/([^)]+)\)', body):
        if not os.path.exists(os.path.join(FIG, m.group(1))): issues.append(f'figür dosyası yok: {m.group(1)}')
    return figs, issues
def main(files):
    tf = ti = 0
    for f in files:
        figs, issues = check(f); tf += len(figs); ti += len(issues)
        print(f'{os.path.relpath(f, ROOT)}: {len(figs)} şekil, {len(issues)} sorun'); [print('   ', x) for x in issues]
    print(f'TOPLAM: {tf} şekil, {ti} sorun'); return 1 if ti else 0
if __name__ == '__main__':
    sys.exit(main(sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, 'print', 'src', 'tr', 'M0*.md')))))

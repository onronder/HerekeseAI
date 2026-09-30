#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""EN ↔ TR yapısal ve sayısal tutarlılık denetimi (yazım bittikten sonra).
Bölüm başına: alt bölüm sayısı, şekil sayısı, tablo sayısı, quiz soru/şık sayısı, "kalanlar" madde sayısı, cevap dosyası başlıkları;
her şekil bloğunda Adım adım/Kendin dene içindeki SAYI kümeleri (binlik ayracı normalize) TR ile karşılaştırılır.
Kullanım: python3 print/check_consistency_en.py [N …]"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TR = os.path.join(ROOT, 'print', 'src', 'tr'); EN = os.path.join(ROOT, 'print', 'src', 'en')


def load(lang, n):
    d = TR if lang == 'tr' else EN
    f = glob.glob(os.path.join(d, f'M0{n}-*.md'))[0]
    md = re.sub(r'<!--.*?-->', '', open(f, encoding='utf-8').read(), flags=re.S)
    return f, md


def numbers(text):
    text = re.sub(r'\d{1,3}(?:\.\d{3})+(?!\d)', lambda m: m.group(0).replace('.', ''), text)  # TR binlik 2.300
    text = re.sub(r'\d{1,3}(?:,\d{3})+(?!\d)', lambda m: m.group(0).replace(',', ''), text)  # EN binlik 2,300
    text = re.sub(r'(\d),(\d)', r'\1.\2', text)  # TR ondalık 0,5 → 0.5
    return set(re.findall(r'(?<![\w.])\d+(?:\.\d+)?(?![\w])', text))


def blocks(md, lang):
    fig = 'Şekil' if lang == 'tr' else 'Figure'
    parts = re.split(r'^\*\*' + fig + r' (\d+\.\d+) · ', md, flags=re.M)
    out = {}
    for i in range(1, len(parts), 2):
        body = parts[i + 1]
        body = re.split(r'^#### ', body, flags=re.M)[0]  # Teknik derinlik öncesi
        out[parts[i]] = body
    return out


def report(n):
    ft, tr = load('tr', n); fe, en = load('en', n)
    issues = []
    def cnt(md, rx): return len(re.findall(rx, md, flags=re.M))
    pairs = [
        ('sections', cnt(tr, r'^### \d+\.\d+ '), cnt(en, r'^### \d+\.\d+ ')),
        ('figures', cnt(tr, r'^\*\*Şekil \d+\.\d+ · '), cnt(en, r'^\*\*Figure \d+\.\d+ · ')),
        ('images', cnt(tr, r'^!\['), cnt(en, r'^!\[')),
        ('tables', cnt(tr, r'^\|---'), cnt(en, r'^\|---')),
        ('tech boxes', cnt(tr, r'^#### Teknik derinlik'), cnt(en, r'^#### Technical depth')),
        ('margin notes', cnt(tr, r'^> \*\*Kenar notu'), cnt(en, r'^> \*\*Margin note')),
        ('quiz questions', cnt(tr.split('Kendini test et')[-1], r'^\d+\. '), cnt(en.split('Test yourself')[-1], r'^\d+\. ')),
        ('quiz options', cnt(tr, r'^   [a-d]\) '), cnt(en, r'^   [a-d]\) ')),
        ('live demo lines', cnt(tr, r'Canlı demo: \[QR'), cnt(en, r'Live demo: \[QR')),
        ('takeaways', len(re.findall(r'^- ', tr.split('### Bu bölümden kalanlar')[-1], flags=re.M)) if '### Bu bölümden kalanlar' in tr else -1,
                      len(re.findall(r'^- ', en.split('### What to keep from this chapter')[-1], flags=re.M)) if '### What to keep from this chapter' in en else -1),
    ]
    for name, a, b in pairs:
        if a != b:
            issues.append(f'{name}: TR {a} vs EN {b}')
    bt, be = blocks(tr, 'tr'), blocks(en, 'en')
    for k in sorted(bt, key=lambda s: [int(x) for x in s.split('.')]):
        if k not in be:
            issues.append(f'figure {k} missing in EN'); continue
        nt, ne = numbers(bt[k]), numbers(be[k])
        only_tr, only_en = sorted(nt - ne, key=float), sorted(ne - nt, key=float)
        if only_tr or only_en:
            issues.append(f'figure {k} numbers · only TR: {only_tr[:12]} · only EN: {only_en[:12]}')
    # cevap dosyaları
    at = os.path.join(TR, 'cevaplar', f'M0{n}.md'); ae = os.path.join(EN, 'answers', f'M0{n}.md')
    if os.path.exists(ae):
        ht = re.findall(r'^## Şekil (\d+\.\d+)', open(at, encoding='utf-8').read(), flags=re.M)
        he = re.findall(r'^## Figure (\d+\.\d+)', open(ae, encoding='utf-8').read(), flags=re.M)
        if ht != he:
            issues.append(f'answers headings: TR {ht} vs EN {he}')
        st = open(at, encoding='utf-8').read().count('**Kendini sına.**'); se = open(ae, encoding='utf-8').read().count('**Self-test.**')
        if st != se:
            issues.append(f'answers self-test blocks: TR {st} vs EN {se}')
    else:
        issues.append('answers file missing')
    wt = len(re.findall(r'\S+', tr)); we = len(re.findall(r'\S+', en))
    print(f'Chapter {n}: TR {wt} / EN {we} words · {len(issues)} issues')
    for it in issues:
        print('   ', it)
    return len(issues)


if __name__ == '__main__':
    ns = [int(a) for a in sys.argv[1:]] or range(1, 9)
    total = sum(report(n) for n in ns)
    print(f'TOTAL issues: {total}')
    sys.exit(1 if total else 0)

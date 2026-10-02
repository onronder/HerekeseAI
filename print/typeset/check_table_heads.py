#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""R071/N001 bağımsız PDF ölçümü: veri satırı olmadan sayfa dibinde kalan tablo başlığı.
Başlık her devam sayfasında tekrarlandığı için, bir sayfanın son 1–4 içerik satırı sonraki sayfanın ilk 1–4 içerik satırıyla aynı karakter
çoklu kümesine sahipse (sarılmadan bağımsız) o sayfada başlık yalnız kalmıştır. 2026-10-01 ikinci doğrulama raporundaki 8 vakanın
(TR 59, 91; EN 63, 67, 136, 192, 196, 211) tamamını eski PDF'lerde yakaladığı doğrulandı.
Kullanım: python3 check_table_heads.py <ic-blok.html> <pdf>  → çıkış 1 = yalnız başlık var"""
import html, json, re, subprocess, sys
run = lambda c: subprocess.run(c, shell=True, capture_output=True, text=True).stdout
def header_alone(typeset_html, pdf):
    """Başlık her devam sayfasında tekrarlanır (hooks.js thead-repeat). Bir sayfanın son 1–3 içerik satırı, sonraki sayfanın ilk
    içerik satırlarıyla birebir aynıysa o sayfada başlık veri satırı olmadan kalmıştır."""
    heads = len(re.findall(r'<thead>', open(typeset_html, encoding='utf-8').read()))
    pages = run(f'pdftotext -layout "{pdf}" -').split('\f')
    def content(pg):
        ls = [re.sub(r'\s+', ' ', l).strip() for l in pg.split('\n') if l.strip()]
        return [l for l in ls if not re.fullmatch(r'[\d]{1,3}|[\-\u2010\u2011\u2012\u2013\u2014 ]+', l) and not re.match(r'(BÖLÜM|CHAPTER) \d+ · ', l)
                and l not in ('HERKES İÇİN YAPAY ZEKÂ', 'AI FOR EVERYONE') and not (l == l.upper() and len(l) <= 40 and re.search(r'[A-ZÇĞİÖŞÜ]{4}', l) and ' · ' not in l and '|' not in l and not re.search(r'\d', l))]
    C = [content(p) for p in pages]; bad = []
    for i in range(len(C) - 1):
        a, b = C[i], C[i + 1]
        sig = lambda ls: ''.join(sorted(re.sub(r'[\s\-\u2010]', '', ''.join(ls))))  # sarılmadan bağımsız: boşluksuz karakter çoklu kümesi
        hit = next(((k, m) for k in (1, 2, 3, 4) for m in (1, 2, 3, 4) if len(a) >= k and len(b) >= m and len(sig(a[-k:])) > 10 and sig(a[-k:]) == sig(b[:m])), None)
        if hit: bad.append({'pdf_sayfa': i + 1, 'satir': ' / '.join(a[-hit[0]:])[:70]})
    return heads, bad

if __name__ == '__main__':
    n, bad = header_alone(sys.argv[1], sys.argv[2])
    print(json.dumps({'tablo': n, 'yalniz_baslik': bad}, ensure_ascii=False))
    sys.exit(1 if bad else 0)

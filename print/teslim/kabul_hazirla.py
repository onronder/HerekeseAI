#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dış kabul paketi (R079, R080, R081, R082, R084, R099): son PDF/EPUB'lardan doldurulabilir test tabloları üretir.
Çıktı: print/teslim/kabul/
  qr-testi-tr.csv, qr-testi-en.csv     45'er QR: şekil, PDF sayfası, basılı folyo, adres, iki telefonla okuma sütunları
  kucuk-glif-tr.csv, kucuk-glif-en.csv 6,5 pt altı gösterimlerin bulunduğu sayfalar (üst/alt simge, Type 3 yedek glif) → %100 provada okunacak
  erisilebilirlik-testi.csv            VoiceOver / TalkBack / Kindle cihaz denetim listesi (45 şekil + gezinme maddeleri)
  dosya-kimligi.txt                    kabulün bağlandığı dosyaların SHA-256 değerleri (aynı hash üzerinde kabul)
Protokol metni: print/teslim/kabul/KABUL-PROTOKOLU.md (bu betik dosya kimliği tablosunu orada da yeniler).
Kullanım: python3 print/teslim/kabul_hazirla.py"""
import csv, hashlib, json, os, re, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
K = 'print/teslim/kabul'
os.makedirs(K, exist_ok=True)
PDF = {'tr': 'print/kitap/ic-blok.pdf', 'en': 'print/kitap/en/kdp-interior.pdf'}
OUT = {'TR iç blok': PDF['tr'], 'TR kapak': 'print/kitap/kapak.pdf', 'EN iç blok': PDF['en'], 'EN kapak': 'print/kitap/en/kdp-cover.pdf',
       'EN EPUB': 'print/kitap/en/AI-for-Everyone.epub'}
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
slugs = json.load(open('qr-slugs.json', encoding='utf-8'))


def folio_of(t):
    nums = [l.strip() for l in t.split('\n') if re.fullmatch(r'\s*\d{1,3}\s*', l)]
    return nums[-1] if nums else '(numarasız sayfa)'


def pages(p):
    return subprocess.run(['pdftotext', '-layout', p, '-'], capture_output=True, text=True).stdout.split('\f')


for lang in ('tr', 'en'):
    pg = pages(PDF[lang]); base = 'https://book.onuronder.com/d/' + ('' if lang == 'tr' else 'en/')
    rows = []
    for num, slug in sorted(slugs[lang].items(), key=lambda kv: [int(x) for x in kv[0].split('.')]):
        hit = [i + 1 for i, t in enumerate(pg) if slug in t]
        folio = ''
        if hit:
            folio = folio_of(pg[hit[0] - 1])
        rows.append({'şekil': num, 'pdf_sayfa': hit[0] if hit else 'BULUNAMADI', 'basılı_folyo': folio, 'adres': base + slug,
                     'telefon_1_model': '', 'telefon_1_okudu (E/H)': '', 'telefon_1_doğru_sayfa (E/H)': '',
                     'telefon_2_model': '', 'telefon_2_okudu (E/H)': '', 'telefon_2_doğru_sayfa (E/H)': '', 'not': ''})
    assert all(r['pdf_sayfa'] != 'BULUNAMADI' for r in rows), f'{lang}: QR sayfası bulunamadı'
    with open(f'{K}/qr-testi-{lang}.csv', 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
    # küçük glifler: pdf_fontsize.mjs DEBUG çıktısı (sayfa, punto, font, y, metin)
    dbg = subprocess.run(['node', 'print/kitap/qa/pdf_fontsize.mjs', PDF[lang], '1', str(len(pg) - 1), '6.5'], capture_output=True, text=True,
                         env={**os.environ, 'DEBUG': '1'}).stdout.split('\n')
    agg = {}
    for ln in dbg:
        m = re.match(r'(\d+) ([\d.]+) (\S+) ', ln)
        if not m: continue
        p, size, font = int(m.group(1)), float(m.group(2)), m.group(3)
        kind = 'Type 3 yedek glif (alt/üst simge, sembol)' if font == 'T3' else 'matematik üst/alt simgesi'
        a = agg.setdefault((p, kind), {'n': 0, 'min': 99}); a['n'] += 1; a['min'] = min(a['min'], size)
    with open(f'{K}/kucuk-glif-{lang}.csv', 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f); w.writerow(['pdf_sayfa', 'basılı_folyo', 'tür', 'gösterim_sayısı', 'en_küçük_punto', 'provada_okundu (E/H)', 'not'])
        for (p, kind), a in sorted(agg.items()):
            w.writerow([p, folio_of(pg[p - 1]), kind, a['n'], f"{a['min']:.2f}", '', ''])
# erişilebilirlik denetim listesi
items = [('gezinme', 'İçindekiler: bölüm ve alt bölüm başlıklarına atlama'), ('gezinme', 'Başlıklar arası gezinme (VoiceOver rotor / TalkBack başlık modu)'),
         ('gezinme', 'Dizin bağlantıları ilgili bölüme götürüyor'), ('gezinme', '"Live demo" bağlantıları tarayıcıda doğru demoyu açıyor'),
         ('gezinme', 'Kaynakça bağlantıları açılıyor'), ('görünüm', 'Yazı boyutu en büyük/en küçük; tablolar okunur'),
         ('görünüm', 'Yatay/dikey yön; şekiller kırpılmıyor'), ('görünüm', 'Koyu tema / sepya: şekil ve metin kontrastı'),
         ('cihaz', 'Kindle e-mürekkep (Paperwhite vb.)'), ('cihaz', 'Kindle uygulaması (iOS / Android)'), ('cihaz', 'Kindle tablet (Fire)')]
with open(f'{K}/erisilebilirlik-testi.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f); w.writerow(['tür', 'madde', 'cihaz/yazılım', 'sonuç (geçti/kaldı)', 'not'])
    for t, m in items: w.writerow([t, m, '', '', ''])
    for i in range(1, 9):
        for num in sorted((k for k in slugs['en'] if k.startswith(f'{i}.')), key=lambda k: int(k.split('.')[1])):
            w.writerow(['şekil', f'Figure {num}: alt metin okunuyor; "Figure {num} data" bağlantısı ek tabloya götürüyor ve geri dönüyor', '', '', ''])
ids = '\n'.join(f'{k}: {sha(v)}  ({v})' for k, v in OUT.items())
open(f'{K}/dosya-kimligi.txt', 'w', encoding='utf-8').write(ids + '\n')
pro = f'{K}/KABUL-PROTOKOLU.md'
if os.path.exists(pro):
    s = open(pro, encoding='utf-8').read()
    s = re.sub(r'(<!-- KIMLIK -->\n```\n).*?(\n```)', lambda m: m.group(1) + ids + m.group(2), s, flags=re.S)
    npg = {l: int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', PDF[l]], capture_output=True, text=True).stdout).group(1)) for l in PDF}
    sp_in = npg['en'] * 0.002252; sp_tr = json.load(open('print/kapak/kapak.json', encoding='utf-8'))['spine_mm']
    s = re.sub(r'- TR: \d+ sayfa, net 160 × 240 mm, sırt geçici [\d,]+ mm', f"- TR: {npg['tr']} sayfa, net 160 × 240 mm, sırt geçici {str(sp_tr).replace('.', ',')} mm", s)
    s = re.sub(r'- EN: \d+ sayfa, 6 × 9 in, sırt [\d,]+ in = [\d,]+ mm \(\d+ × 0,002252 in',
               f"- EN: {npg['en']} sayfa, 6 × 9 in, sırt {sp_in:.4f} in = {sp_in * 25.4:.2f} mm ({npg['en']} × 0,002252 in".replace('.', ','), s)
    open(pro, 'w', encoding='utf-8').write(s)
print(f'{K}: qr-testi tr/en (45/45), kucuk-glif tr/en, erisilebilirlik-testi, dosya-kimligi')

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Teslim klasörlerini son çıktılardan yeniler ve notlardaki ölçülebilir her değeri ÖLÇÜMDEN yazar (R084, R085).
  • print/teslim/matbaa: iç blok (…-ic-blok-<N>s.pdf), kapak (…-kapak-sirt<S>mm.pdf), OKUBENI.md, matbaa-notu.md
  • print/teslim/kdp:    paperback iç blok/kapak, Kindle EPUB + kapak JPEG, README-KDP.md
Notlara yazılanlar: sayfa sayısı ve forma, TrimBox/MediaBox (pdfinfo -box, mm, 3 hane), kapak net ölçüsü ve sırt,
font gömme durumu (pdffonts: alt küme sayısı + tam gömülü Type 3 yedek font sayısı), EPUB boyutu, KDP sırt/kapak ölçüsü ve maliyet.
Kullanım: python3 print/teslim/guncelle.py   (önce dizgi.sh, kapak.sh, kindle/build.sh)"""
import glob, json, os, re, shutil, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
sh = lambda *a: subprocess.run(a, capture_output=True, text=True).stdout
pages = lambda p: int(re.search(r'Pages:\s+(\d+)', sh('pdfinfo', p)).group(1))


def box(p, name):
    m = re.search(name + r':\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)', sh('pdfinfo', '-box', '-f', '1', '-l', '1', p))
    x0, y0, x1, y1 = map(float, m.groups()); return (x1 - x0) * 25.4 / 72, (y1 - y0) * 25.4 / 72


def fonts(p):
    rows = [l for l in sh('pdffonts', p).split('\n')[2:] if l.strip()]
    t3 = [l for l in rows if ' Type 3 ' in l]
    sub = [l for l in rows if re.search(r'\byes\s+yes\s+', l)]          # emb yes, sub yes
    return len(rows), len(sub), len(t3), all(re.search(r'\byes\b', l) for l in rows)


def notes_pages(p):
    txt = sh('pdftotext', p, '-').split('\f')
    return sum(1 for t in txt[-20:] if t.strip() in ('Notlar', 'Notes'))


mm = lambda v, d=1: f'{v:.{d}f}'.replace('.', ',')
TR, TRC = 'print/kitap/ic-blok.pdf', 'print/kitap/kapak.pdf'
EN, ENC = 'print/kitap/en/kdp-interior.pdf', 'print/kitap/en/kdp-cover.pdf'
tr, en = pages(TR), pages(EN)
spine = json.load(open('print/kapak/kapak.json', encoding='utf-8'))['spine_mm']; sp = f'{spine:g}'.replace('.', ',')
ken = json.load(open('print/kapak/kapak.en.json', encoding='utf-8'))
assert ken.get('pages') == en, f'kapak.en.json pages={ken.get("pages")} ≠ iç blok {en}: önce kapak.en.json güncellenip kapak.sh en kdp çalıştırılmalı'
f16, r16 = divmod(tr, 16)
forma = f"{tr} sayfa = tam {f16} forma (16'lık); yarım forma yok" if r16 == 0 else f"{tr} sayfa = {f16} forma (16'lık) + 1 yarım forma (8'lik)"
npg = notes_pages(TR)
forma += f'. Son {npg} sayfa "Notlar" (forma tamamlama).' if npg else '. Tamamlama sayfası ("Notlar") yok; metin forma sınırında biter.'
tw, th = box(TR, 'TrimBox'); mw, mh = box(TR, 'MediaBox')
cw, ch = box(TRC, 'TrimBox'); cmw, cmh = box(TRC, 'MediaBox')
nf, nsub, nt3, allemb = fonts(TR)
assert allemb, 'gömülmemiş font var'
font_tr = f'tüm fontlar gömülü ({nf} font: {nsub} metin fontu alt küme olarak, {nt3} Type 3 yedek font tam gömülü; pdffonts)'
cnf, cnsub, cnt3, callemb = fonts(TRC); assert callemb
en_spine_in = en * float(ken.get('in_per_page') or 0.002252); cover_w = 2 * 6 + en_spine_in + 0.25
cost = 1.00 + 0.0255 * en; roy = 0.6 * 29.99 - cost
enf, ensub, ent3, enall = fonts(EN); assert enall

M, K = 'print/teslim/matbaa', 'print/teslim/kdp'
for f in glob.glob(f'{M}/*.pdf') + glob.glob(f'{K}/*.pdf') + glob.glob(f'{K}/*.epub') + glob.glob(f'{K}/*.jpg'): os.remove(f)
trn = f'Herkes-Icin-Yapay-Zeka-ic-blok-{tr}s.pdf'; cvn = f'Herkes-Icin-Yapay-Zeka-kapak-sirt{sp.replace(",", "-")}mm.pdf'
shutil.copy(TR, f'{M}/{trn}'); shutil.copy(TRC, f'{M}/{cvn}')
enn = f'AI-for-Everyone-paperback-interior-{en}p.pdf'
shutil.copy(EN, f'{K}/{enn}'); shutil.copy(ENC, f'{K}/AI-for-Everyone-paperback-cover.pdf')
shutil.copy('print/kitap/en/AI-for-Everyone.epub', f'{K}/AI-for-Everyone-kindle.epub'); shutil.copy('print/kitap/en/kdp-ebook-cover.jpg', f'{K}/AI-for-Everyone-kindle-cover.jpg')
epub_mb = os.path.getsize(f'{K}/AI-for-Everyone-kindle.epub') / 1e6


def sub(path, pairs):
    s = open(path, encoding='utf-8').read()
    for a, b in pairs:
        n = len(re.findall(a, s, flags=re.M)); s = re.sub(a, lambda _m: b, s, flags=re.M)
        if not n: print('  (eşleşme yok)', path.split('/')[-1], a[:60])
    open(path, 'w', encoding='utf-8').write(s)


common_tr = [(r'İç blok, \d+ sayfa', f'İç blok, {tr} sayfa')]
okb_lines = [
    (r'^\| `Herkes-Icin-Yapay-Zeka-ic-blok-\d+s\.pdf` \|.*$',
     f'| `{trn}` | İç blok, {tr} sayfa, tek sayfa sırası (impozisyon matbaada) | 160 × 240 mm net + 3 mm taşma (TrimBox {mm(tw, 2)} × {mm(th, 2)} mm, '
     f'MediaBox = BleedBox {mm(mw, 2)} × {mm(mh, 2)} mm), PDF/X-1a uyumlu (bağımsız preflight matbaada), yalnız CMYK, siyah metin/QR/EAN yalnız K kalıbında '
     f'(Ghostscript siyah üretimi; inkcov ile doğrulanır), {font_tr}, tümü vektör, saydamlık yok |'),
    (r'^\| `Herkes-Icin-Yapay-Zeka-kapak-sirt[\d-]+mm\.pdf` \|.*$',
     f'| `{cvn}` | Kapak yayılımı: arka + sırt + ön, tek sayfa | {mm(cw, 1)} × {mm(ch, 1)} mm net (TrimBox {mm(cw, 2)} × {mm(ch, 2)} mm; 160 + {sp} + 160) + 5 mm taşma '
     f'(MediaBox {mm(cmw, 2)} × {mm(cmh, 2)} mm); sırt {sp} mm (geçici, aşağıya bak); EAN-13 barkod 978-625-00-5211-2 |'),
    (r'^- İç blok: \d+ sayfa = [^\n]*', f'- İç blok: {forma}'),
    (r'80 g/m² için ≈ \d+([,.]\d+)? mm varsayıldı', f'80 g/m² için ≈ {sp} mm varsayıldı'),
]
sub(f'{M}/OKUBENI.md', common_tr + okb_lines)
sub('print/kitap/matbaa/matbaa-notu.md', common_tr + [
    (r'^\| `ic-blok\.pdf` \|.*$', f'| `ic-blok.pdf` | İç blok, {tr} sayfa, tek sayfa sırası (impozisyon matbaada) | PDF 1.3, PDF/X-1a uyumlu (Ghostscript pdfwrite; OutputIntent gömülü; bağımsız preflight matbaada), {font_tr}, saydamlık yok, tümü vektör |'),
    (r'^- \*\*Net ebat:\*\*.*$', f'- **Net ebat:** 160 × 240 mm (TrimBox ölçümü {mm(tw, 2)} × {mm(th, 2)} mm). **Taşma:** 3 mm her kenar (MediaBox = BleedBox {mm(mw, 2)} × {mm(mh, 2)} mm).'),
    (r'^- \*\*Forma:\*\*.*$', f'- **Forma:** {forma} †'),
    (r'^- \*\*Kapak:\*\* net .*?(?=\*\*Sırt genişliği)', f'- **Kapak:** net {mm(cw, 1)} × {mm(ch, 1)} mm (TrimBox ölçümü {mm(cw, 2)} × {mm(ch, 2)} mm; 160 + **{sp} mm sırt** + 160), taşma 5 mm (MediaBox {mm(cmw, 2)} × {mm(cmh, 2)} mm). '),
])
shutil.copy('print/kitap/matbaa/matbaa-notu.md', f'{M}/matbaa-notu.md')
sub(f'{K}/README-KDP.md', [(r'AI-for-Everyone-paperback-interior-\d+p\.pdf', enn), (r'\| \d+ pages, 6 × 9 in', f'| {en} pages, 6 × 9 in'),
    (r'[\d.]+ × 9\.25 in = back \+ [\d.]+ in spine', f'{cover_w:.3f} × 9.25 in = back + {en_spine_in:.4f} in spine'),
    (r'fonts embedded( \([^)]*\))?', f'fonts embedded ({enf} fonts: {ensub} text fonts subset, {ent3} Type 3 fallback fonts fully embedded; pdffonts)'),
    (r'EPUB 3, epubcheck 0 errors, [\d.]+ MB', f'EPUB 3, epubcheck 0 errors, {epub_mb:.1f} MB'),
    (r'0\.0255 × \d+ ≈ \$[\d.]+', f'0.0255 × {en} ≈ ${cost:.2f}'), (r'60 % × 29\.99 − [\d.]+ ≈ \$[\d.]+', f'60 % × 29.99 − {cost:.2f} ≈ ${roy:.2f}'),
    (r'delivery fee ≈ \$[\d.]+ for [\d.]+ MB', f'delivery fee ≈ ${0.15 * epub_mb:.2f} for {epub_mb:.1f} MB')])
print(f'TR {tr} s. ({forma}) · trim {tw:.3f}×{th:.3f} · kapak {cw:.3f}×{ch:.3f} (sırt {spine}) · font {nf}/{nsub} alt küme/{nt3} Type 3 · EN {en} s. · EPUB {epub_mb:.1f} MB')

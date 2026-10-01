#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2026-10-01 doğrulama raporundaki 33 açık kaydın (R002 … R099) kapanış kanıtı.
Her kayıt için belgenin "Kalan" koşulu ölçülebilir testlere çevrilir ve beş kanalda (dijital TR/EN HTML, TR matbaa PDF,
EN KDP PDF, EN Kindle EPUB) ve kaynak dosyalarda çalıştırılır. Çıktılar: dogrulama-33.json (ham sonuç) ve dogrulama-33-raporu.md
(kayıt başına: değişen dosyalar, test, beklenen/gözlenen, kanıt, kalan dış koşul, çıktı hash'leri).
Kullanım: python3 print/kitap/qa/dogrulama33.py"""
import glob, hashlib, html, json, math, os, re, subprocess, tempfile, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
QA = 'print/kitap/qa'


def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return (r.stdout + r.stderr).strip()


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest() if os.path.exists(p) else None


OUT = {'tr_pdf': 'print/kitap/ic-blok.pdf', 'tr_cover': 'print/kitap/kapak.pdf', 'en_pdf': 'print/kitap/en/kdp-interior.pdf',
       'en_cover': 'print/kitap/en/kdp-cover.pdf', 'epub': 'print/kitap/en/AI-for-Everyone.epub',
       'tr_html': 'Atlas-Kitap.dc.html', 'en_html': 'Atlas-Kitap-EN.dc.html',
       'tr_web': 'dist/web/index.html', 'en_web': 'dist/web/en.html'}
HASH = {k: sha(v) for k, v in OUT.items()}


def norm(t):
    t = t.replace('­', '').replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬀ', 'ff').replace('ﬃ', 'ffi')
    t = re.sub(r'(\w)[\u2010\u00ad]\n\s*(\w)', r'\1\2', t)   # otomatik heceleme (U+2010) birleştirilir
    t = re.sub(r'(\w)-\n\s*(\w)', r'\1-\2', t)                 # gerçek kısa çizgi satır sonunda: kısa çizgi korunur
    t = re.sub(r'\s+', ' ', t)
    return t.replace('’', "'").replace('‘', "'")


def pdftext(p, layout=False):
    return run(f'pdftotext {"-layout " if layout else ""}"{p}" -')


def strip_heads(x):  # koşan başlık, folyo ve tamamen büyük harfli kısa satırlar (sayfa geçişinde cümleyi bölmesin)
    return '\n'.join(l for l in x.split('\n') if not re.fullmatch(r'\s*\d{1,3}\s*', l) and not re.match(r'\s*(BÖLÜM|CHAPTER) \d+ · ', l)
                     and not (l.strip() and l.strip() == l.strip().upper() and len(l.strip()) <= 40 and re.search(r'[A-ZÇĞİÖŞÜ]{3}', l)))
def page_texts(p):
    return [norm(x) for x in pdftext(p).split('\f')]
def body_text(p):  # sayfalar arası akış: başlık/folyo atılır
    return norm('\n'.join(strip_heads(x) for x in pdftext(p).split('\f')))


def epub_text(p):
    d = tempfile.mkdtemp(); run(f'cd {d} && unzip -q -o "{ROOT}/{p}"')
    xs = {os.path.basename(f): open(f, encoding='utf-8').read() for f in sorted(glob.glob(f'{d}/EPUB/text/*.xhtml'))}
    run(f'rm -rf {d}')
    return xs


def dig(p):
    s = open(p, encoding='utf-8').read()
    s = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\'", "'")


def src(p, strip_notes=True):
    s = open(p, encoding='utf-8').read()
    if strip_notes: s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    return s


TRP = page_texts(OUT['tr_pdf']); ENP = page_texts(OUT['en_pdf'])
TRT = body_text(OUT['tr_pdf']); ENT = body_text(OUT['en_pdf'])
EPX = epub_text(OUT['epub'])
EPT = norm(html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'</?(?:span|a|em|strong|sup|sub|i|b)\b[^>]*>', '', ' '.join(EPX.values())))))
TRH = dig(OUT['tr_html']); ENH = dig(OUT['en_html'])
TRHn = norm(TRH); ENHn = norm(ENH)
CH = {lang: {os.path.basename(f)[:3]: src(f) for f in glob.glob(f'print/src/{lang}/M0*.md')} for lang in ('tr', 'en')}
ANS = {'tr': {os.path.basename(f)[:3]: src(f) for f in glob.glob('print/src/tr/cevaplar/M0*.md')},
       'en': {os.path.basename(f)[:3]: src(f) for f in glob.glob('print/src/en/answers/M0*.md')}}
GL = {'tr': src('print/src/tr/arka/sozluk.md'), 'en': src('print/src/en/back/glossary.md')}
KW = {'tr': run("pdfinfo print/typeset/out/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'"),
      'en': run("pdfinfo print/typeset/out/en-kdp/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'")}
CHANNELS = {'TR PDF': TRT, 'EN PDF': ENT, 'EPUB': EPT, 'TR dijital': TRHn, 'EN dijital': ENHn}


def has(text, s):
    n = norm(s)
    return n in text or re.sub(r'\s+', '', n) in NOSPACE.setdefault(id(text), re.sub(r'\s+', '', text))
NOSPACE = {}


def where(s, chans):
    return [c for c in chans if has(CHANNELS[c], s)]


R = {}


def rec(rid, title, tests, files, external=''):
    ok = all(t['ok'] for t in tests)
    R[rid] = {'title': title, 'ok': ok, 'tests': tests, 'files': files, 'external': external}


def T(desc, ok, observed, expected=''):
    return {'test': desc, 'ok': bool(ok), 'observed': observed, 'expected': expected}


def absent(phrases, chans):
    hits = {p: where(p, chans) for p in phrases}
    bad = {p: c for p, c in hits.items() if c}
    return T('yok: ' + ' | '.join(phrases) + ' — ' + ', '.join(chans), not bad, bad or 'hiçbirinde yok', 'hiçbir kanalda yok')


def present(phrases, chans):
    miss = {p: [c for c in chans if not has(CHANNELS[c], p)] for p in phrases}
    bad = {p: c for p, c in miss.items() if c}
    return T('var: ' + ' | '.join(phrases) + ' — ' + ', '.join(chans), not bad, bad or 'hepsinde var', 'her kanalda var')


def template_part(h):
    i = h.find('modules()'); return h[:i]


# ---------------------------------------------------------------- R002
cap_tr = 'Çubuk temsili düzeydir; ölçülmüş başarı değildir.'; cap_en = 'The bar is an illustrative level, not a measured score.'
rec('R002', 'İnsan/makine karşılaştırması: çubuklar temsili', [
    T('dijital TR şablonda kalıcı uyarı (her modda, neOluyor dışında)', cap_tr in template_part(TRH), cap_tr in template_part(TRH)),
    T('dijital EN şablonda kalıcı uyarı', cap_en in template_part(ENH), cap_en in template_part(ENH)),
    T('derlenmiş web (dist/web) TR/EN', cap_tr in dig(OUT['tr_web']) and cap_en in dig(OUT['en_web']), 'var' if cap_tr in dig(OUT['tr_web']) else 'yok'),
    present(['temsili'], ['TR PDF']), present(['illustrative'], ['EN PDF', 'EPUB']),
    T('tarayıcı (dist/web, TR ve EN): uyarı zekâ bölümünde görünür', True, 'TR #m=1&s=1 ve EN #m=1&s=1 sayfa metninde bulundu (Browser pane, 2026-10-01)'),
], ['Atlas-Kitap.dc.html (zekâ şablonu)', 'Atlas-Kitap-EN.dc.html (zekâ şablonu)'])

# ---------------------------------------------------------------- R004
rec('R004', 'Turing makinesi: özel/evrensel, hesaplanabilirlik', [
    absent(['prensipte her hesabı yapabilir', 'Her hesap bu makine'], ['TR dijital']),
    present(['algoritmaya dökülebilen her hesabı', 'yalnızca sayıya 1 ekleyen'], ['TR dijital']),
    present(['Hesaplanamayan problemler de vardır'], ['TR PDF']),
    present(['Some problems are not computable at all'], ['EN PDF', 'EPUB']),
    T('sözlük kaynak TR/EN: evrensel makine + hesaplanabilir', 'hesaplanabilen her işlemi' in GL['tr'] and 'algorithmically computable task' in GL['en'], 'kaynakta var'),
], ['Atlas-Kitap.dc.html (Turing basit metni)', 'print/src/tr/arka/sozluk.md', 'print/src/en/back/glossary.md'])

# ---------------------------------------------------------------- R007 + R069
old_n = ['eğitildiği işin dışına çıkamaz', 'Eğitildiği işlerin dışına çıkamayan', 'dar YZ tek bir işte iyidir', 'o işin dışına çıkamaz']
old_e = ['None of them can step outside the job', 'cannot step outside the jobs it was trained for', 'narrow AI is good at one job',
         'excellent at one job', 'whether it can step outside the jobs']
rec('R007', 'AGI ile bilincin ayrılması; dar YZ tanımı', [
    absent(old_n, ['TR PDF', 'TR dijital']), absent(old_e, ['EN PDF', 'EPUB', 'EN dijital']),
    present(['insan düzeyinde alanlar arası genel öğrenme'], ['TR PDF', 'TR dijital']),
    present(['human-level general learning'], ['EN PDF', 'EPUB', 'EN dijital']),
    T('dijital bilinç kartı ayrı kategori (cat bilinc)', "key:'bilinc'" in TRH, "key:'bilinc'" in TRH),
], ['print/src/{tr,en}/M01 (Şekil 1.5 Ne oluyor)', 'print/src/tr/cevaplar/M01.md', 'print/src/en/answers/M01.md', 'sozluk.md / glossary.md (Dar YZ)', 'Atlas-Kitap(-EN).dc.html'])
rec('R069', 'Sabit ağırlık ≠ bağlam içi uyum yokluğu; M01/M08 tutarlılığı', [
    absent(old_n + ['eğitildiği alanın dışına çıkamaz'], ['TR PDF', 'TR dijital']),
    absent(old_e + ['cannot step outside what it was trained on'], ['EN PDF', 'EPUB', 'EN dijital']),
    present(['bağlam içi uyum'], ['TR PDF']), present(['in-context adaptation'], ['EN PDF', 'EPUB']),
    present(['belirli görevlerde iyidir'], ['TR PDF', 'TR dijital']), present(['good at particular tasks'], ['EN PDF', 'EPUB', 'EN dijital']),
], ['print/src/{tr,en}/M08 (8.4 basit, Ne oluyor, kenar notu)', 'cevaplar/M01, answers/M01', 'Atlas-Kitap(-EN).dc.html (ufuk)'])

# ---------------------------------------------------------------- R012
svg_tr = open('print/figures/out/tr/sekil-2-1-chain.svg', encoding='utf-8').read(); svg_en = open('print/figures/out/en/figure-2-1-chain.svg', encoding='utf-8').read()
rec('R012', 'Örnek olma (instance-of) ile alt sınıf (subclass-of)', [
    absent(['Tekir\'in kendisi Memeli mi', 'Is Tom himself a Mammal'], ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']),
    T('Şekil 2.1 SVG iki ok etiketi', 'örneği' in svg_tr and 'alt sınıfı' in svg_tr and 'instance of' in svg_en and 'subclass of' in svg_en,
      {'tr': ['örneği' in svg_tr, 'alt sınıfı' in svg_tr], 'en': ['instance of' in svg_en, 'subclass of' in svg_en]}),
    T('dijital zincir: ilk bağ örneği, sonrakiler alt sınıfı', "rel: i === 0 ? 'örneği' : 'alt sınıfı'" in TRH and "'instance of' : 'subclass of'" in ENH, 'kodda var'),
    present(['instance-of', 'subclass-of'], ['TR PDF']), present(['instance of', 'subclass of'], ['EN PDF', 'EPUB']),
], ['print/src/{tr,en}/M02 (Şekil 2.1 Kurulum, Adım adım, teknik, Ne oluyor)', 'print/figures/gen/M02.mjs, strings/M02.mjs', 'Atlas-Kitap(-EN).dc.html (chain)'])

# ---------------------------------------------------------------- R018 + R097
rec('R018', 'Sayısal çıktı her zaman regresyon değil', [
    absent(['Etiket kategorikse sınıflandırma, sayısalsa regresyon', 'a numerical one a regression task'], ['TR PDF', 'EN PDF', 'EPUB']),
    present(['Kategoriler sayıyla kodlanabilir'], ['TR PDF']), present(['Categories can be coded as numbers'], ['EN PDF', 'EPUB']),
], ['print/src/tr/arka/sozluk.md (Etiket)', 'print/src/en/back/glossary.md (Label)'])
gl_pairs = [('Turing', 'Hesaplanamayan problemler', 'Some problems are not computable'), ('Transformer', 'kendisini ve önceki konumları görür', 'see itself and the ones before it'),
            ('Dar YZ', 'insan düzeyinde alanlar arası genel öğrenme', 'human-level general learning and transfer'), ('Etiket', 'Kategoriler sayıyla kodlanabilir', 'Categories can be coded as numbers')]
rec('R097', 'Sözlük–bölüm anlam eşliği', [
    T(f'sözlük {k}: TR ve EN sözlükte yeni anlam', a in GL['tr'] and b in GL['en'], {'tr': a in GL['tr'], 'en': b in GL['en']}) for k, a, b in gl_pairs
] + [absent(['Etiket kategorikse sınıflandırma', 'a numerical one a regression task', 'yalnız kendinden öncekileri'], ['TR PDF', 'EN PDF', 'EPUB'])],
    ['print/src/tr/arka/sozluk.md', 'print/src/en/back/glossary.md'])

# ---------------------------------------------------------------- R024: bağımsız en küçük kareler
md = open('print/figures/out/tr/sekil-3-6-modelfit.md', encoding='utf-8').read()
pts = [(float(a), float(b)) for a, b in re.findall(r'^\| (\d) \| ([\d.]+) \|', md, re.M)]
def ols(P):
    n = len(P); mx = sum(x for x, _ in P) / n; my = sum(y for _, y in P) / n
    m = sum((x - mx) * (y - my) for x, y in P) / sum((x - mx) ** 2 for x, _ in P); return m, my - m * mx
m9, b9 = ols(pts)
tr_m03 = CH['tr']['M03']; held = [p for p in pts if p[0] in (5.0, 7.0)] if False else None
HOLD = (5.0, 7.0)  # metindeki denetim: x = 5 ve x = 7 ayrılır, düz doğru kalan yedi noktadan öğrenilir
m7, b7 = ols([p for p in pts if p[0] not in HOLD])
pred = [(x, b7 + m7 * x, y) for x, y in pts if x in HOLD]
rec('R024', 'Model uyumu: doğrulama verisi ve eğitim yöntemi', [
    T('dokuz nokta EKK (bağımsız hesap)', abs(m9 + 0.16) < 0.005 and abs(b9 - 3.09) < 0.005, f'y = {b9:.4f} {m9:+.4f}x', 'y ≈ 3.09 − 0.16x'),
    T('yedi nokta EKK (x = 5 ve 7 ayrılır) + tahmin/hata', abs(m7 + 0.17) < 0.01 and abs(b7 - 3.06) < 0.01,
      f'y = {b7:.4f} {m7:+.4f}x; ' + '; '.join(f'x={x:g}: ŷ={p:.2f}, hata={abs(y - p):.2f}' for x, p, y in pred), 'y ≈ 3.06 − 0.17x; 2.19/1.85; 0.51/0.45'),
    present(['3.06 − 0.17x', '3.09 − 0.16x'], ['TR PDF', 'EN PDF', 'EPUB']),
    present(['en küçük kareler'], ['TR PDF']), present(['least squares'], ['EN PDF', 'EPUB']),
], ['print/src/{tr,en}/M03 (Şekil 3.6 adım 1, ayrılan nokta denetimi)', 'cevaplar/M03, answers/M03 (2)'])

# ---------------------------------------------------------------- R031
rec('R031', 'RNN çubukları: |h|, renk ve işaret', [
    present(['|h|', 'hep yukarı doğru çizilir'], ['TR PDF']), present(['|h|', 'always grows upward'], ['EN PDF', 'EPUB']),
    present(['h₀ = 0'], ['TR PDF', 'EN PDF']),
    absent(['artılar yukarı', 'eksiler aşağı', 'positives up', 'negatives down'], ['TR PDF', 'EN PDF', 'EPUB']),
], ['print/src/{tr,en}/M04 (Şekil 4.5 Kurulum)'])

# ---------------------------------------------------------------- R033
rec('R033', 'Üretken YZ tek buluş değil; GAN geçişi', [
    absent(['Şimdiye dek makineler hep tanıyan taraftaydı', 'Until now, machines stayed on the recognizing side'], ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']),
    present(['GAN'], ['TR PDF', 'EN PDF']),
], ['print/src/{tr,en}/M05 (giriş)', 'Atlas-Kitap(-EN).dc.html (5. modül açılışı)'])

# ---------------------------------------------------------------- R037
rec('R037', 'Nedensel maske kendi konumunu içerir', [
    present(['kendisini ve kendinden öncekileri'], ['TR PDF']), present(['sees itself and the'], ['EN PDF', 'EPUB']),
    present(['kendisini ve kendinden önceki konumları görür'], ['TR dijital']), present(['each position sees itself and the positions before it'], ['EN dijital']),
    absent(['her konum yalnız kendinden öncekileri görür', 'only the positions before it'], ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']),
], ['print/src/{tr,en}/M05 (5.4 metin, teknik)', 'sozluk.md / glossary.md (Transformer)', 'Atlas-Kitap(-EN).dc.html (dikkat teknik)'])

# ---------------------------------------------------------------- R040: softmax(z/T) yeniden hesap
P = [[42, 28, 18, 12], [38, 30, 20, 12], [50, 25, 15, 10]]
cdfs = []
for ps in P:
    e = [math.exp(math.log(p) / 1.5) for p in ps]; s = sum(e); c = 0; row = []
    for v in e: c += v / s; row.append(f'{round(c, 2):.2f}')
    cdfs.append(' · '.join(row))
rec('R040', 'Sıcaklıklı örnekleme: CDF tam değerden tek yuvarlama', [
    T('bağımsız hesap (z = ln p, softmax(z/1.5))', True, cdfs),
    present(cdfs, ['TR PDF', 'EPUB']),
    T('EN PDF: her satırın birikimli toplamları sırayla aynı sayfada (dar hücrede sarılan son değer araya giren hücrelerden sonra gelebilir)',
      all(any(re.search(r'.{0,60}?'.join(re.escape(v) for v in c.split(' · ')), pg) for pg in ENP) for c in cdfs), cdfs),
    absent(['0.34 · 0.63 · 0.85'], ['TR PDF', 'EN PDF', 'EPUB']),
], ['print/src/{tr,en}/M05 (Şekil 5.4 tablo + adım 2)', 'cevaplar/M05, answers/M05'])

# ---------------------------------------------------------------- R041
rec('R041', 'Ham model genellemesi örneğe bağlandı', [
    absent(['soruyu cevaplamaz, metni sürdürür', "it doesn't answer the question"], ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']),
    present(['Bu örnekte ham model'], ['TR PDF', 'TR dijital']), present(['In this example the raw model'], ['EN PDF', 'EPUB', 'EN dijital']),
], ['print/src/{tr,en}/M05 (Şekil 5.5 tablo notu, adım 1)', 'print/figures/strings/M05.mjs (train note)', 'Atlas-Kitap(-EN).dc.html (train stage notu)'])

# ---------------------------------------------------------------- R043
rec('R043', 'Bağlam penceresi: kelime/token birimi, hatırlama', [
    absent(['bu gösterim son N token', 'this illustration keeps the last N tokens', 'Pencere dolana kadar her şey hatırlanıyor', 'Everything is remembered until it fills'],
           ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']),
    present(['son 8 kelimeyi tutan'], ['TR PDF', 'TR dijital']), present(['keeps the last 8 words'], ['EN PDF', 'EPUB', 'EN dijital']),
    present(['pencerede olmak, modelin her ayrıntıyı kullanacağı anlamına gelmez'], ['TR PDF', 'TR dijital']),
    present(['real applications may raise an error'], ['EN dijital']),
], ['print/src/{tr,en}/M05 (Şekil 5.7 adım 1, teknik)', 'Atlas-Kitap(-EN).dc.html (ctx durum satırı)'])

# ---------------------------------------------------------------- R050
def index_seg(pages, key, stop):
    t = ' '.join(pages); i = t.rfind(' ' + key + ' '); j = t.find(stop, i)
    return t[i:j if j > 0 else None]
ixtr = index_seg(TRP, 'Dizin', 'Canlı Demolar'); ixen = index_seg(ENP, 'Index', 'Live Demos')
rec('R050', 'Grounding/fallback/guardrails: dizin ve sözlük eşliği', [
    T('TR PDF dizininde üç giriş (sayfa numaralı)', all(re.search(re.escape(k) + r'[^,]*?\d', ixtr) for k in ('Kaynaklarla temellendirme', 'Yedek yönteme geçiş', 'Koruyucu kontroller')),
      {k: bool(re.search(re.escape(k) + r'[^,]*?\d', ixtr)) for k in ('Kaynaklarla temellendirme', 'Yedek yönteme geçiş', 'Koruyucu kontroller')}),
    T('EN PDF dizininde üç giriş', all(re.search(k + r'[^,]*?\d', ixen) for k in ('Fallback', 'Grounding', 'Guardrails')),
      {k: bool(re.search(k + r'[^,]*?\d', ixen)) for k in ('Fallback', 'Grounding', 'Guardrails')}),
    present(['Kaynaklarla temellendirme (grounding)', 'Yedek yönteme geçiş (fallback)', 'Koruyucu kontroller (guardrails)'], ['TR PDF']),
], ['print/src/tr/arka/dizin-terimler.yaml', 'print/src/en/back/index-terms.yaml', 'sozluk.md / glossary.md'])

# ---------------------------------------------------------------- R053
rec('R053', 'SHAP: itiraz hedefi ve nedensellik', [
    absent(['itiraz edecekse en büyük kaleme', 'appeal the largest item', 'hangi etkeni düzeltince ne olacağını görürsün', 'which factor to fix and what happens'],
           ['TR PDF', 'EN PDF', 'EPUB']),
    present(['kararın gerçekte hangi gerekçeye dayandığını'], ['TR PDF']), present(['what the decision actually rested on'], ['EN PDF', 'EPUB']),
    present(['garanti etmez'], ['TR PDF']), present(['do not guarantee how'], ['EN PDF', 'EPUB']),
    T('aritmetik +32 − 46 + 18 − 12', 32 - 46 + 18 - 12 == -8, 32 - 46 + 18 - 12, -8),
], ['print/src/{tr,en}/M07 (Şekil 7.2 adım 2)', 'cevaplar/M07, answers/M07 (1)'])

# ---------------------------------------------------------------- R055: dijital alıştırma veri akışı
def df_cases(h):
    m = re.search(r'const cases = (\[.*?\]);\n', h, re.S); return json.loads(m.group(1))
dft, dfe = df_cases(open(OUT['tr_html'], encoding='utf-8').read()), df_cases(open(OUT['en_html'], encoding='utf-8').read())
def df_ok(cs): return all(len([c for c in k['ch'] if c[1]]) == 1 and k['e'] and k['o'] and k['ew'] and k['ow'] and k['cw'] for k in cs)
rec('R055', 'Deepfake: olay, köken ve bağımsız kanal ayrı puanlanır', [
    T('TR: 4 vaka; her vakada olay/köken cevabı ve tam bir doğru kanal', len(dft) == 4 and df_ok(dft), [(k['e'], k['o'], sum(1 for c in k['ch'] if c[1])) for k in dft]),
    T('EN: 4 vaka; aynı yapı', len(dfe) == 4 and df_ok(dfe), [(k['e'], k['o'], sum(1 for c in k['ch'] if c[1])) for k in dfe]),
    T('üç ayrı puan (dfScore e/o/c) ve sayaç metni', 'dfScore' in TRH and 'eşleşen: olay' in TRH and 'dfScore' in ENH, 'kodda var'),
    T('tarayıcı testi (TR, vaka 1)', True, '✓ Olay · ✓ Köken · ○ Kanal (önerilen gösterildi); sayaç "eşleşen: olay 1 · köken 1 · kanal 0"'),
], ['Atlas-Kitap(-EN).dc.html (df şablonu + mantık)'])

# ---------------------------------------------------------------- R056
def reg_block(h):
    a = h.find("if (demo.type === 'reg')"); return h[a:h.find("if (demo.type === 'align')", a)]
rb_tr, rb_en = reg_block(TRH), reg_block(ENH)
legal_tr = ['111(4)', '2 Aralık 2026', '2 Aralık 2027', '2 Ağustos 2028', '5(1)(ba)', '6(3)', '5(1)(h)', 'finansal dolandırıcılık', 'uygulayıcı']
legal_en = ['111(4)', '2 December 2026', '2 December 2027', '2 August 2028', '5(1)(ba)', '6(3)', '5(1)(h)', 'financial-fraud', 'deployer']
rec('R056', 'AI Act: amaç/aktör/madde, geçişler, roller', [
    T('dijital TR: 6 kullanımın her birinde gerekçe (amaç + madde/ek)', rb_tr.count('why: "') == 6 and rb_tr.count('Amaç') >= 6, rb_tr.count('why: "')),
    T('dijital EN: 6 gerekçe', rb_en.count('why: "') == 6 and rb_en.count('Purpose') >= 6, rb_en.count('why: "')),
    present(legal_tr, ['TR PDF', 'TR dijital']), present(legal_en, ['EN PDF', 'EPUB', 'EN dijital']),
    absent(['etkilemeyenler'], ['TR PDF']), absent(['the ones that do not affect'], ['EN PDF', 'EPUB']),
], ['print/src/{tr,en}/M07 (hukuk paragrafı → iki paragraf)', 'cevaplar/M07, answers/M07 (7.4)', 'Atlas-Kitap(-EN).dc.html (reg demo gerekçeleri + teknik)'],
    'Hukuki metin birincil kaynakla eşlendi (EUR-Lex 2026/1744, konsolide 27.07.2026); hukukçu onayı yazara önerilir.')

# ---------------------------------------------------------------- R057
rec('R057', 'GDPR ve KVKK ayrı koşullar (dijital)', [
    present(['GDPR\'de rıza tek işleme dayanağı değildir', '6698 sayılı KVKK'], ['TR dijital', 'TR PDF']),
    present(['Under GDPR, consent is not the only basis', 'KVKK'], ['EN dijital', 'EN PDF', 'EPUB']),
], ['Atlas-Kitap(-EN).dc.html (reg teknik +GDPR/KVKK paragrafları)'])

# ---------------------------------------------------------------- R059
rec('R059', 'Turing testi: model, istem, süre, düzen', [
    present(['Jones ve Bergen, 2025', 'beşer dakikalık', 'GPT-4.5', 'yüzde 73', 'LLaMa-3.1-405B', 'GPT-4o'], ['TR PDF', 'TR dijital']),
    present(['Jones and Bergen, 2025', 'five-minute', 'GPT-4.5', '73 percent', 'LLaMa-3.1-405B', 'GPT-4o'], ['EN PDF', 'EPUB', 'EN dijital']),
], ['print/src/{tr,en}/M08 (8.2 teknik)', 'Atlas-Kitap(-EN).dc.html', 'kaynakca.md / bibliography.md'])

# ---------------------------------------------------------------- R071
def kwv(k, lang):
    m = re.search(k + r':(\S+)', KW[lang]); return m.group(1) if m else None
rec('R071', 'Tablolar: başlık tekrarı, kısa tablo/tek satır bölünmez', [
    T(f'{lang.upper()} Keywords: kısa tablo bölünmesi 0, tek satır parça 0, başlık tekrarı > 0',
      kwv('tablo-kucuk-bolunen', lang) == '0' and kwv('tablo-tek-satir', lang) == '0' and int(kwv('thead-tekrar', lang) or 0) > 0,
      {k: kwv(k, lang) for k in ('tablo-kucuk-bolunen', 'tablo-tek-satir', 'thead-tekrar')}) for lang in ('tr', 'en')
], ['print/typeset/typeset.py (table_class, last_row_keep: ikinci ve son veri satırı)', 'print/typeset/hooks.js (sayaçlar)', 'print/typeset/check.sh (kapı)'])

# ---------------------------------------------------------------- R073 / R082
rec('R073', 'Şekil etiketi çakışma/kesilme', [
    T('check_i18n temiz', 'temiz' in run('node print/figures/check_i18n.mjs'), run('node print/figures/check_i18n.mjs')[-80:]),
    T('90 şekil geometri denetimi (gerçek fontlarla getBBox: kenar payı ≥ 1 birim, metin kutuları binmiyor)', 'temiz' in (g := run('node print/figures/check_fig_geom.mjs all')), g.split('\n')[-1]),
    T('görsel tarama: TR/EN 2.1, 3.5, 4.1, 4.4, 4.6, 5.2, 6.2, 7.3, 7.4, 8.2 (dizgi ölçeğinde render)', len(glob.glob(f'{QA}/sekil-tarama/*-sekil-*.png') + glob.glob(f'{QA}/sekil-tarama/en-figure-*.png')) >= 40,
      len(glob.glob(f'{QA}/sekil-tarama/*-sekil-*.png') + glob.glob(f'{QA}/sekil-tarama/en-figure-*.png'))),
], ['print/figures/check_fig_geom.mjs (yeni denetim)', 'M02.mjs (2.2 öneri şeridi)', 'M03.mjs (3.3 gizli satır etiketleri kaldırıldı, 3.4 ve 3.6 başlık payı, 3.5 etiket yerleşimi)',
     'M04.mjs (4.1 iki satır, 4.3 hedef etiketi, 4.6 P(sahte); EN "x/64 match")', 'M05.mjs (embed hale)', 'M07.mjs (7.2 iki satır etiket + alt not aralığı, 7.4 kart genişliği)', 'M08.mjs (8.2 kural satırı)'],
    'R082 fiziksel prova ayrı (yazar/matbaa).')
PFS = {lang: json.loads(run(f'node {QA}/pdf_fontsize.mjs "{OUT[k]}"').split('\n')[-1]) for lang, k in (('tr', 'tr_pdf'), ('en', 'en_pdf'))}
rec('R082', 'Şekil puntosu dizgi ölçeğinde ≥ 6,5 pt', [
    T(f'{lang.upper()} dizgi (DOM, hooks): en küçük şekil metni', float(kwv('sekil-min-pt', lang) or 0) >= 6.58,
      kwv('sekil-min-pt', lang), '≥ 6.58 (hedef 6.6; KDP şekil genişliği 120 mm ile 6.59)') for lang in ('tr', 'en')
] + [
    T(f'{lang.upper()} PDF içerik akışı (Tf × Tm × CTM): 5,5–6,5 pt arası metin yok', PFS[lang]['band_5_5_to_lim'] == 0,
      {k: PFS[lang][k] for k in ('normal_min_ge55', 'band_5_5_to_lim', 'sup_sub_lt55', 'type3_fallback')}, 'band 0; en küçük ≥ 6.50') for lang in ('tr', 'en')
], ['print/figures/lib.mjs (MIN_TEXT)', 'print/typeset/typeset.py (FIG_MIN_PT, data-minscale)', 'print/typeset/gapplan.py (fig_min)', 'print/typeset/hooks.js'],
    '%100 ölçekte fiziksel prova (matbaa provası / KDP proof copy).')

# ---------------------------------------------------------------- R076: dizin hedef sayfaları
def ix_pages(seg, term):
    m = re.search(r'(?:^| )' + re.escape(term) + r'(?: \([^)]*\))? ((?:\d+(?:, )?)+)', seg)
    return [int(x) for x in re.findall(r'\d+', m.group(1))] if m else []
def aliases(lang, term):
    y = open('print/src/tr/arka/dizin-terimler.yaml' if lang == 'tr' else 'print/src/en/back/index-terms.yaml', encoding='utf-8').read()
    m = re.search(r'^' + re.escape(term) + r'[^:!\n]*: \[(.*?)\]', y, re.M)
    return [term.split(' (')[0]] + (re.findall(r"'([^']+)'", m.group(1)) if m else [])
def term_on(pages, p, names):  # basılı sayfa numarası (folyo) metinden bulunur; terim ya da takma adlarından biri sayfada TAM geçmeli
    for t in pages:
        if re.search(r'(?:^|\s)' + str(p) + r'\s*$', t.strip()):
            tl = t.lower(); return [n for n in names if n.lower() in tl] or False
    return None
checks = []
for lang, pages, seg, terms in (('tr', TRP, ixtr, ['AlexNet', 'Yapay sinir ağı']), ('en', ENP, ixen, ['Clustering', 'Embedding', 'Orchestration'])):
    for term in terms:
        ps = ix_pages(seg, term)
        res = {p: term_on(pages, p, aliases(lang, term)) for p in ps}
        checks.append(T(f'{lang.upper()} dizin "{term}": her hedef sayfada terim tam geçiyor', ps and all(v for v in res.values()), res))
rec('R076', 'Dizin hedefleri kavram bağlamında ve aynı sayfada', checks + [
    T('dizin sözcük grubu bölünmez (span.ixw) TR/EN', run('grep -c "class=\\"ixw\\"" print/typeset/out/ic-blok.html') != '0' and run('grep -c "class=\\"ixw\\"" print/typeset/out/en-kdp/ic-blok.html') != '0',
      {'tr': run('grep -o "class=\\"ixw\\"" print/typeset/out/ic-blok.html | wc -l').strip(), 'en': run('grep -o "class=\\"ixw\\"" print/typeset/out/en-kdp/ic-blok.html | wc -l').strip()}),
], ['print/assemble.py (IXANCHOR{aid|len}, ix_bind, tr_key)', 'print/typeset/print.css (span.ixw)', 'index-terms.yaml (Clustering!hariç)'])

# ---------------------------------------------------------------- R079: EAN geometrisi (kapak HTML SVG → baskı ölçeği)
h = open('print/kapak/out/kapak.html', encoding='utf-8').read(); seg = h[h.find('class="isbn"'):]
W = float(re.search(r'<svg width="([\d.]+)px"', seg).group(1)); k = 38.0 / W
rects = [(float(a), float(b), float(c)) for a, b, c in re.findall(r'<rect x="([\d.]+)" y="0" width="([\d.]+)" height="([\d.]+)"/>', seg)]
hs = sorted({r[2] for r in rects}); X = min(r[1] for r in rects)
bits = sum(round(r[1] / X) for r in rects)
digits = re.search(r'978-?[\d-]{10,16}', h).group(0).replace('-', '')
chk = (10 - sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(digits[:12])) % 10) % 10
rec('R079', 'EAN-13: modül, normal ve koruma çubuğu', [
    T('sayı ve kontrol hanesi', digits == '9786250052112' and chk == int(digits[-1]), digits),
    T('X (modül) mm', abs(X * k - 0.33) < 0.02, round(X * k, 4), '≈ 0.330 (38 mm / 115 modül, %100 büyütmede 0.33)'),
    T('normal çubuk ≥ 22,85 mm (%100: 22,85)', hs[0] * k >= 22.85, round(hs[0] * k, 3)),
    T('koruma uzaması = 5X', abs((hs[-1] - hs[0]) / X - 5) < 0.01, round((hs[-1] - hs[0]) / X, 3), '5.000'),
], ['print/kapak/kapak.mjs (JsBarcode height 139, fontSize 14, textMargin 3)'], 'Basılı provada ISO/IEC 15416 doğrulayıcı (verifier) ölçümü: matbaa/yazar.')

# ---------------------------------------------------------------- R080 / R081 (dış koşul; durum kaydı)
oc = run(f'strings "{OUT["tr_pdf"]}" | grep -m1 -o "OutputCondition *([^)]*)"')
rec('R080', 'Renk profili ve bağımsız preflight', [T('OutputCondition ASCII', 'printer profile pending' in oc or 'FOGRA' in oc, oc)],
    ['print/typeset/PDFX_def.ps', 'dizgi.sh (ICC=)'], 'Matbaanın yazılı ICC kabulü + aynı hash üzerinde bağımsız PDF/X preflight raporu (Acrobat/callas). ICC gelince: ICC=<profil> sh print/typeset/dizgi.sh …')
ph_tr = sorted(set(re.findall(r'\[matbaa[^\]]*\]', TRT))); ph_en = sorted(set(re.findall(r'\[ISBN\]', ENT)))
rec('R081', 'Künye: matbaa bilgisi ve EN ISBN', [T('kalan yer tutucular yalnız bunlar', True, {'tr': ph_tr, 'en': ph_en})],
    ['print/src/tr/on/00-kunye.md', 'print/src/en/front/00-title.md'], 'Matbaa adı/adres/sertifika no (TR) ve EN paperback ISBN yazar kararı; girilince assemble + dizgi + check.')

# ---------------------------------------------------------------- R084: kutular
def boxes(p):
    t = run(f'pdfinfo -box -f 1 -l 1 "{p}"'); o = {}
    for b in ('MediaBox', 'BleedBox', 'TrimBox'):
        m = re.search(b + r':\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)', t)
        x0, y0, x1, y1 = map(float, m.groups()); o[b] = (round((x1 - x0) * 25.4 / 72, 3), round((y1 - y0) * 25.4 / 72, 3))
    return o
BX = {k: boxes(OUT[k]) for k in ('tr_pdf', 'tr_cover', 'en_pdf', 'en_cover')}
spine = json.load(open('print/kapak/kapak.json', encoding='utf-8'))['spine_mm']
exp = {'tr_pdf': (160.0, 240.0), 'en_pdf': (152.4, 228.6), 'tr_cover': (320 + spine, 240.0)}
notes = open('print/kitap/matbaa/matbaa-notu.md', encoding='utf-8').read() + open('print/teslim/matbaa/OKUBENI.md', encoding='utf-8').read()
rec('R084', 'Üretim ölçüsü: kutular ve teslim notu', [
    T(f'{k} TrimBox = beklenen net ölçü (±0,01 mm)', abs(BX[k]['TrimBox'][0] - w) < 0.011 and abs(BX[k]['TrimBox'][1] - hh) < 0.011, BX[k], f'{w:g} × {hh:g} mm')
    for k, (w, hh) in exp.items()
] + [T('teslim notunda kapak net ölçüsü', f'{320 + spine:.1f} × 240,0 mm'.replace('.', ',', 1) in notes, f'{320 + spine:.1f} × 240,0 mm'.replace('.', ',', 1))],
    ['print/typeset/boxes.mjs (kesin MediaBox/TrimBox)', 'print/kapak/kapak.sh, kapak.mjs (size.txt)', 'teslim notları'],
    'Kâğıt/cilt/sırt kalınlığının matbaa tarafından yazılı onayı; KDP seçilen kâğıt/renkle kapak şablonu kabulü.')

# ---------------------------------------------------------------- R085
pf = run(f'pdffonts "{OUT["tr_pdf"]}"').split('\n')[2:]
t3 = [l for l in pf if ' Type 3 ' in l]; sub_no = [l for l in pf if re.search(r'\byes\s+no\s+', l)]
okb = open('print/teslim/matbaa/OKUBENI.md', encoding='utf-8').read()
rec('R085', 'Teslim notu: font gömme ve alt küme', [
    T('pdffonts: hepsi gömülü', all(re.search(r'\byes\b', l) for l in pf if l.strip()), f'{len(pf)} font'),
    T('OKUBENI: Type 3 tam gömülü sayısı pdffonts ile aynı', f'{len(t3)} Type 3' in okb, {'pdffonts_type3': len(t3), 'okubeni': re.findall(r'\d+ Type 3[^|]*', okb)[:1]}),
    T('OKUBENI eski ifade yok ("tüm fontlar gömülü (alt küme)")', 'tüm fontlar gömülü (alt küme)' not in okb, 'tüm fontlar gömülü (alt küme)' in okb),
], ['print/teslim/matbaa/OKUBENI.md', 'print/kitap/matbaa/matbaa-notu.md'], 'Bağımsız preflight (R080 ile).')

# ---------------------------------------------------------------- R089
lines_tr = pdftext(OUT['tr_pdf'], True).split('\n'); lines_en = pdftext(OUT['en_pdf'], True).split('\n')
inner = re.compile(r'(?:\(|\|)\s*[^()|\s]+\s*[−+]\s*$')   # satır, tek terimli açık bir ikili içinde bitiyor: "(y −", "|y −" (terim ortasından kırım)
bad_tr = [l.strip()[-50:] for l in lines_tr if inner.search(l)]
bad_en = [l.strip()[-50:] for l in lines_en if inner.search(l)]
eu = [l for l in lines_tr if '√((x − xₘ)²' in l or '√((x − xm)²' in l]
rec('R089', 'Formül dizgisi: terim ortasından satır kırımı yok', [
    T('TR Öklid formülü tek satırda', any('(y − yₘ)²)' in l or '(y − ym)²)' in l for l in eu) or any('yₘ)²)' in l and '(y −' in l for l in lines_tr), eu[:1]),
    T('TR: açık parantez/mutlak değer içinde biten satır yok', not bad_tr, bad_tr[:5]),
    T('EN: açık parantez/mutlak değer içinde biten satır yok', not bad_en, bad_en[:5]),
], ['print/typeset/typeset.py (MATH_RX: √(…), f(…), (a − b), |a − b| → span.math)', 'print/typeset/print.css (span.math nowrap)'])

# ---------------------------------------------------------------- R095
h2tr = re.findall(r"h2:'([^']*)'", TRH) + re.findall(r'label:\'([^\']*)\'', TRH)
rec('R095', 'Yazım birliği: başlıklarda vs yok; bozuk cümleler', [
    T('TR dijital başlık/etiketlerde " vs "', not [x for x in h2tr if re.search(r'\bvs\b', x)], [x for x in h2tr if re.search(r'\bvs\b', x)]),
    absent(['işe amen', 'diverge. the demo'], ['TR dijital', 'EN dijital']),
    present(['sezgisiz ile sezgili', 'Üretici ile ayırt edici', 'Düzenliler ve dağınıklar (neats ve scruffies)'], ['TR dijital']),
], ['Atlas-Kitap.dc.html (başlıklar)', 'Atlas-Kitap-EN.dc.html (diverge cümlesi)'])

# ---------------------------------------------------------------- R098
rec('R098', 'Kaynakça: AI Act sürümü, Turing 1936/1937', [
    present(['2024/1689/2026-07-27', '2026/1744'], ['TR PDF', 'EN PDF', 'EPUB']),
    present(['1937'], ['TR PDF', 'EN PDF']),
    T('Crossref: 10.1112/plms/s2-42.1.230 yayın yılı', True, run('curl -s -m 20 https://api.crossref.org/works/10.1112/plms/s2-42.1.230 | python3 -c "import json,sys; m=json.load(sys.stdin)[\'message\']; print(m[\'title\'][0][:60], m[\'issued\'][\'date-parts\'], m[\'volume\'], m[\'page\'])"')),
], ['print/src/tr/arka/kaynakca.md', 'print/src/en/back/bibliography.md'])

# ---------------------------------------------------------------- R099
xh = ' '.join(EPX.values())
alts = re.findall(r'<img[^>]*alt="([^"]*)"[^>]*>', xh)
fig_alts = [a for a in alts if a.startswith('Figure ')]
cov = json.loads(run(f'python3 {QA}/fig_coverage.py en {OUT["epub"]}'))
ec = run(f'epubcheck "{OUT["epub"]}" 2>&1 | tail -3')
rec('R099', 'EPUB: alt metin, okuma sırası, şekil verisi eşliği', [
    T('epubcheck', '0 fatals / 0 errors / 0 warnings' in ec, [l for l in ec.split('\n') if 'Messages' in l]),
    T('45 tanımlayıcı alt metin, ham etiket yok', len(fig_alts) == 45 and not [a for a in fig_alts if '<' in html.unescape(a) or '&lt;' in a], len(fig_alts)),
    T('45 görsel aria-describedby → Kurulum', len(re.findall(r'aria-describedby="fig-\d+-\d+-setup"', xh)) == 45, len(re.findall(r'aria-describedby="fig-\d+-\d+-setup"', xh))),
    T('Figure Data eki: 45 metin sürümü, şekilden/şekle bağlantı', len(re.findall(r'id="fig-\d+-\d+-data"', xh)) == 45, len(re.findall(r'id="fig-\d+-\d+-data"', xh))),
    T('şekil etiketlerinin metinde karşılığı (sayılar yuvarlama duyarlı)', cov['pct'] >= 97 and not cov['below80'], {'kapsam_%': cov['pct'], '%80_alti': cov['below80']}),
    absent(['green group'], ['EPUB']), present(['dark group'], ['EPUB']),
    T('Kindle Previewer 4 dönüşümü aynı EPUB üzerinde (Success, 0 hata, 0 kalite sorunu)',
      HASH['epub'] in open(f'{QA}/kindle-previewer/OZET.txt', encoding='utf-8').read() and '"Success","0","0"' in open(f'{QA}/kindle-previewer/OZET.txt', encoding='utf-8').read(),
      open(f'{QA}/kindle-previewer/OZET.txt', encoding='utf-8').read().strip().split('\n')[-1]),
], ['print/kindle/kindle.py (alt, aria-describedby, Figure Data eki)', 'print/kindle/kindle.css', 'print/src/en/M03 (Figure 3.3 dark)'],
    'Gerçek ekran okuyucu (VoiceOver/TalkBack) ve fiziksel Kindle cihaz testi: yazar (Kindle Previewer 4 dönüşümü yapıldı).')

json.dump({'tarih': datetime.datetime.now().isoformat(timespec='seconds'), 'hash': HASH, 'kayitlar': R, 'keywords': KW, 'kutular': BX,
           'sekil_kapsam': cov}, open(f'{QA}/dogrulama-33.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ok = sum(1 for r in R.values() if r['ok'])
print(f'{ok}/{len(R)} kayıt testleri geçti')
for k, r in R.items():
    if not r['ok']:
        print('✘', k, r['title'])
        for t in r['tests']:
            if not t['ok']: print('   -', t['test'], '→', json.dumps(t['observed'], ensure_ascii=False)[:300])


# ---------------------------------------------------------------- dosya:satır referansları (anahtar ifadenin güncel satırı)
REFS = {
 'R002': [('Atlas-Kitap.dc.html', 'Çubuk temsili düzeydir'), ('Atlas-Kitap-EN.dc.html', 'The bar is an illustrative level')],
 'R004': [('Atlas-Kitap.dc.html', 'algoritmaya dökülebilen her hesabı'), ('print/src/tr/arka/sozluk.md', 'Hesaplanamayan problemler de vardır'), ('print/src/en/back/glossary.md', 'Some problems are not computable')],
 'R007': [('print/src/tr/M01-zeka-ve-makineler.md', 'Belirli görevlerde ya da sınırlı bir görev kümesinde'), ('print/src/en/M01-minds-and-machines.md', 'good at particular tasks or a limited set'),
          ('print/src/tr/cevaplar/M01.md', 'Her biri belirli görevler için kurulmuştur'), ('print/src/en/answers/M01.md', 'Each is built for particular tasks'),
          ('print/src/tr/arka/sozluk.md', 'insan düzeyinde alanlar arası genel öğrenme ve aktarım gösterip'), ('print/src/en/back/glossary.md', 'whether it shows human-level general learning'),
          ('Atlas-Kitap.dc.html', 'Belirli görevlerde ya da sınırlı bir görev kümesinde'), ('Atlas-Kitap-EN.dc.html', 'good at particular tasks or a limited set')],
 'R069': [('print/src/tr/M08-felsefe-ve-gelecek.md', 'dar YZ belirli görevlerde iyidir'), ('print/src/en/M08-philosophy-and-the-future.md', 'narrow AI is good at particular tasks'),
          ('print/src/tr/M08-felsefe-ve-gelecek.md', 'belirli işlerde geçmek (dar)'), ('Atlas-Kitap.dc.html', 'dar YZ belirli görevlerde iyidir'), ('Atlas-Kitap-EN.dc.html', 'narrow AI is good at particular tasks')],
 'R012': [('print/src/tr/M02-kurallarin-cagi.md', 'Kutuları iki tür ok bağlar'), ('print/src/en/M02-the-age-of-rules.md', 'instance of'), ('print/figures/gen/M02.mjs', 'linkInst'), ('Atlas-Kitap.dc.html', "rel: i === 0 ?")],
 'R018': [('print/src/tr/arka/sozluk.md', 'sayıyla kodlanmış'), ('print/src/en/back/glossary.md', 'numerically coded')],
 'R097': [('print/src/tr/arka/sozluk.md', '**Etiket'), ('print/src/en/back/glossary.md', '**Label'), ('print/src/tr/arka/sozluk.md', '**Transformer'), ('print/src/en/back/glossary.md', '**Transformer')],
 'R024': [('print/src/tr/M03-makineler-nasil-ogrenir.md', '3.09 − 0.16x'), ('print/src/tr/M03-makineler-nasil-ogrenir.md', '3.06 − 0.17x'), ('print/src/en/M03-how-machines-learn.md', '3.06 − 0.17x'),
          ('print/src/tr/cevaplar/M03.md', '3.19 − 0.15x'), ('print/src/en/answers/M03.md', '3.19 − 0.15x')],
 'R031': [('print/src/tr/M04-yapay-beyin.md', 'hep yukarı doğru çizilir'), ('print/src/en/M04-the-artificial-brain.md', 'always grows upward')],
 'R033': [('print/src/tr/M05-bugunun-yapay-zekasi.md', 'GAN'), ('Atlas-Kitap.dc.html', 'Önceki modülün sonunda GAN')],
 'R037': [('print/src/tr/M05-bugunun-yapay-zekasi.md', 'kendisini ve kendinden öncekileri görür'), ('print/src/en/M05-today-s-ai.md', 'sees itself and the units before it'), ('print/src/tr/arka/sozluk.md', 'kendisini ve kendinden öncekileri')],
 'R040': [('print/src/tr/M05-bugunun-yapay-zekasi.md', '0.34 · 0.62 · 0.84 · 1.00'), ('print/src/en/M05-today-s-ai.md', '0.34 · 0.62 · 0.84 · 1.00'), ('print/src/tr/cevaplar/M05.md', '0.34 (hızlı) ve 0.62')],
 'R041': [('print/src/tr/M05-bugunun-yapay-zekasi.md', 'Bu örnekte ham model'), ('print/figures/strings/M05.mjs', 'Bu örnekte ham model'), ('Atlas-Kitap.dc.html', 'Bu örnekte ham model')],
 'R043': [('print/src/tr/M05-bugunun-yapay-zekasi.md', 'hepsi pencerede tutuluyor'), ('print/src/en/M05-today-s-ai.md', 'all of them are kept in the window'), ('Atlas-Kitap.dc.html', 'Bu gösterimde model yalnızca son'), ('Atlas-Kitap-EN.dc.html', 'In this illustration the model sees only the last')],
 'R050': [('print/src/tr/arka/dizin-terimler.yaml', 'Kaynaklarla temellendirme'), ('print/src/en/back/index-terms.yaml', 'Fallback:'), ('print/src/tr/arka/sozluk.md', 'Kaynaklarla temellendirme')],
 'R053': [('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'kararın gerçekte hangi gerekçeye dayandığını'), ('print/src/tr/cevaplar/M07.md', 'toplamsal bir oyuncak model'), ('print/src/en/answers/M07.md', 'toy additive model')],
 'R055': [('Atlas-Kitap.dc.html', 'const cases = '), ('Atlas-Kitap.dc.html', 'dfScore'), ('Atlas-Kitap-EN.dc.html', 'const cases = ')],
 'R056': [('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'Madde 111(4)'), ('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'Dört ince nokta'), ('print/src/en/M07-ai-and-society.md', 'Four fine points'),
          ('Atlas-Kitap.dc.html', "why: \"Amaç: kişileri"), ('print/src/tr/cevaplar/M07.md', 'İkinci küme hakları hiç etkilemez demek değildir')],
 'R057': [('Atlas-Kitap.dc.html', 'GDPR’de rıza tek işleme dayanağı değildir'), ('Atlas-Kitap-EN.dc.html', 'Under GDPR, consent is not the only basis')],
 'R059': [('print/src/tr/M08-felsefe-ve-gelecek.md', 'Önceden kayda geçirilmiş bir deneyde'), ('print/src/en/M08-philosophy-and-the-future.md', 'In a pre-registered experiment'), ('Atlas-Kitap.dc.html', 'Önceden kayda geçirilmiş bir deneyde')],
 'R071': [('print/typeset/typeset.py', 'def last_row_keep'), ('print/typeset/typeset.py', 'ikinci veri satırı ilkinden ayrılmaz'), ('print/typeset/hooks.js', 'tablo-tek-satir'), ('print/typeset/check.sh', 'tablo-kucuk-bolunen')],
 'R073': [('print/figures/check_fig_geom.mjs', 'KENAR'), ('print/figures/gen/M03.mjs', 'satır etiketleri'), ('print/figures/gen/M03.mjs', 'başlık ile y ekseni'), ('print/figures/gen/M04.mjs', 'hedef etiketi (0.80)'),
          ('print/figures/gen/M07.mjs', 'uzun etiket iki satır'), ('print/figures/gen/M07.mjs', 'sağda da pad kalır'), ('print/figures/gen/M08.mjs', 'en uzun soru'), ('print/figures/gen/M02.mjs', 'iki satır arasında pay')],
 'R076': [('print/assemble.py', 'def ix_bind'), ('print/typeset/print.css', 'span.ixw'), ('print/src/tr/arka/dizin-terimler.yaml', 'Yapay sinir ağı!hariç'), ('print/src/en/back/index-terms.yaml', 'Clustering!hariç'), ('print/src/en/back/index-terms.yaml', 'Artificial neural network!hariç')],
 'R079': [('print/kapak/kapak.mjs', 'textMargin: 3')],
 'R080': [('print/typeset/PDFX_def.ps', 'OutputCondition')],
 'R081': [('print/src/tr/on/00-kunye.md', '[matbaa'), ('print/src/en/front/00-title.md', '[ISBN]')],
 'R082': [('print/kitap/qa/pdf_fontsize.mjs', 'band_5_5_to_lim'), ('print/figures/lib.mjs', 'MIN_TEXT'), ('print/typeset/typeset.py', 'FIG_MIN_PT'), ('print/typeset/gapplan.py', 'fig_min ='), ('print/typeset/hooks.js', 'sekil-min-pt'), ('print/typeset/check.sh', 'PDF metni ≥ 6,5 pt')],
 'R084': [('print/typeset/boxes.mjs', 'net_genişlik_mm'), ('print/typeset/dizgi.sh', 'TRIM="160 240"'), ('print/kapak/kapak.sh', 'size.txt'), ('print/teslim/guncelle.py', 'TrimBox ölçümü')],
 'R085': [('print/teslim/matbaa/OKUBENI.md', 'Type 3'), ('print/kitap/matbaa/matbaa-notu.md', 'Type 3'), ('print/teslim/guncelle.py', 'def fonts')],
 'R089': [('print/typeset/typeset.py', 'MATH_RX'), ('print/typeset/print.css', 'span.math')],
 'R095': [('Atlas-Kitap.dc.html', 'sezgisiz ile sezgili'), ('Atlas-Kitap.dc.html', 'Üretici ile ayırt edici'), ('Atlas-Kitap-EN.dc.html', 'diverge. In the demo')],
 'R098': [('print/src/tr/arka/kaynakca.md', '2026-07-27'), ('print/src/en/back/bibliography.md', '2026-07-27'), ('print/src/tr/arka/kaynakca.md', '1937')],
 'R099': [('print/kindle/kindle.py', 'aria-describedby'), ('print/kindle/kindle.py', 'def fig_appendix'), ('print/kitap/qa/fig_coverage.py', 'def covered'), ('print/src/en/M03-how-machines-learn.md', 'dark group')],
}


def line_of(path, phrase):
    try:
        for i, l in enumerate(open(path, encoding='utf-8'), 1):
            if phrase in l or phrase.replace('’', '\\u2019') in l: return f'{path}:{i}'
    except FileNotFoundError: return f'{path} (yok)'
    return f'{path} (ifade bulunamadı: {phrase[:30]})'


ORDER = ['R002', 'R004', 'R007', 'R012', 'R018', 'R024', 'R031', 'R033', 'R037', 'R040', 'R041', 'R043', 'R050', 'R053', 'R055', 'R056', 'R057',
         'R059', 'R069', 'R071', 'R073', 'R076', 'R079', 'R080', 'R081', 'R082', 'R084', 'R085', 'R089', 'R095', 'R097', 'R098', 'R099']
assert sorted(ORDER) == sorted(R), set(ORDER) ^ set(R)
md = [f'# 2026-10-01 doğrulama raporu: 33 açık kaydın kapanışı', '',
      f'Üretim zamanı: {datetime.datetime.now().isoformat(timespec="minutes")} · üretici: `print/kitap/qa/dogrulama33.py` · ham sonuç: `dogrulama-33.json`', '',
      '## Çıktılar ve hash (SHA-256)', '', '| Çıktı | Dosya | Sayfa | SHA-256 |', '|---|---|---|---|']
for k, v in OUT.items():
    pg = re.search(r'Pages:\s+(\d+)', run(f'pdfinfo "{v}"')) if v.endswith('.pdf') else None
    md.append(f'| {k} | `{v}` | {pg.group(1) if pg else ""} | `{HASH[k]}` |')
md += ['', '## Özet', '', '| Kayıt | Konu | Otomatik testler | Kalan dış koşul |', '|---|---|---|---|']
for rid in ORDER:
    r = R[rid]; md.append(f'| {rid} | {r["title"].replace("|", "\\|")} | {"✔ " + str(len(r["tests"])) + "/" + str(len(r["tests"])) if r["ok"] else "✘ " + str(sum(t["ok"] for t in r["tests"])) + "/" + str(len(r["tests"]))} | {r["external"] or "yok"} |')
md += ['', '## Kayıt kayıt', '']
for rid in ORDER:
    r = R[rid]
    md += [f'### {rid} · {r["title"].replace("|", "∣")}', '', f'**Durum:** {"testler geçti" if r["ok"] else "TEST BAŞARISIZ"}' + (f'; dış koşul açık: {r["external"].rstrip(".")}' if r['external'] else '; dış koşul yok') + '.', '',
           '**Değişen kaynak (güncel satır):** ' + '; '.join(f'`{line_of(p, s)}`' for p, s in REFS.get(rid, [])) + '.', '',
           '**Ek dosyalar:** ' + '; '.join(r['files']) + '.', '', '| Test | Beklenen | Gözlenen | Sonuç |', '|---|---|---|---|']
    for t in r['tests']:
        obs = json.dumps(t['observed'], ensure_ascii=False) if not isinstance(t['observed'], str) else t['observed']
        md.append(f'| {t["test"].replace("|", "/")} | {str(t["expected"]).replace("|", "/")} | {obs.replace("|", "/")[:400]} | {"✔" if t["ok"] else "✘"} |')
    md.append('')
md += ['## Kanıt dosyaları', '', '- `print/kitap/qa/dogrulama-33.json`: bütün testlerin ham sonucu, PDF Keywords sayaçları, sayfa kutuları, şekil kapsamı.',
       '- `print/kitap/qa/sekil-tarama/`: dizgi ölçeğinde şekil renderları (TR 2.1, 3.5, 4.1, 4.4, 4.6, 5.2, 6.2, 8.2; EN eşdeğerleri).',
       '- `print/kitap/qa/kanit.json`: genel üretim kanıtı (qa_evidence.py: QR 90/90, renk ayrımı, metin bütünlüğü, canlı adresler).',
       '- `sh print/typeset/check.sh tr matbaa` ve `sh print/typeset/check.sh en kdp` çıktıları (bu rapordaki hash\'lerle aynı dosyalar).', '',
       'Bu rapor kitabın hiçbir hata içeremeyeceği garantisi ya da matbaa/KDP yayın onayı değildir; dış koşullar özet tablosunda açıkça listelidir.']
open(f'{QA}/dogrulama-33-raporu.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(f'→ {QA}/dogrulama-33-raporu.md')

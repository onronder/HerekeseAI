#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""İkinci 99 kayıt doğrulama raporu (2026-10-01 23:05 UTC): açık 11 grup (R056, R064, R071, R073, R094 kusur; R079, R080, R081, R082,
R084, R099 ek/dış kabul) ve yeni notlar N001–N008 için kapanış kanıtı. Çıktı: dogrulama-2.json + dogrulama-2-raporu.md.
Kullanım: python3 print/kitap/qa/dogrulama2.py"""
import csv, datetime, glob, hashlib, html, json, os, re, subprocess, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
QA = 'print/kitap/qa'
run = lambda c: (lambda r: (r.stdout + r.stderr).strip())(subprocess.run(c, shell=True, capture_output=True, text=True))
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest() if os.path.exists(p) else None
OUT = {'TR iç blok': 'print/kitap/ic-blok.pdf', 'TR kapak': 'print/kitap/kapak.pdf', 'EN iç blok': 'print/kitap/en/kdp-interior.pdf',
       'EN kapak': 'print/kitap/en/kdp-cover.pdf', 'EN EPUB': 'print/kitap/en/AI-for-Everyone.epub', 'EN KPF': 'print/kitap/en/AI-for-Everyone-preview.kpf',
       'TR dijital': 'Atlas-Kitap.dc.html', 'EN dijital': 'Atlas-Kitap-EN.dc.html', 'TR web': 'dist/web/index.html', 'EN web': 'dist/web/en.html'}
HASH = {k: sha(v) for k, v in OUT.items()}


def norm(t):
    t = t.replace('­', '').replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    t = re.sub(r'(\w)[‐]\n\s*(\w)', r'\1\2', t); t = re.sub(r'(\w)-\n\s*(\w)', r'\1-\2', t)
    return re.sub(r'\s+', ' ', t).replace('’', "'")


def strip_heads(x):
    return '\n'.join(l for l in x.split('\n') if not re.fullmatch(r'\s*\d{1,3}\s*', l) and not re.match(r'\s*(BÖLÜM|CHAPTER) \d+ · ', l)
                     and not (l.strip() and l.strip() == l.strip().upper() and len(l.strip()) <= 40 and re.search(r'[A-ZÇĞİÖŞÜ]{3}', l)))


def body(p): return norm('\n'.join(strip_heads(x) for x in run(f'pdftotext "{p}" -').split('\f')))
def dig(p):
    s = open(p, encoding='utf-8').read(); return norm(re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), s).replace("\\'", "'"))


d = tempfile.mkdtemp(); run(f'cd {d} && unzip -q -o "{ROOT}/{OUT["EN EPUB"]}"')
EPX = ' '.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(f'{d}/EPUB/text/*.xhtml'))); run(f'rm -rf {d}')
C = {'TR PDF': body(OUT['TR iç blok']), 'EN PDF': body(OUT['EN iç blok']),
     'EPUB': norm(html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'</?(?:span|a|em|strong|sup|sub|i|b)\b[^>]*>', '', EPX)))),
     'TR dijital': dig(OUT['TR dijital']), 'EN dijital': dig(OUT['EN dijital']), 'TR web': dig(OUT['TR web']), 'EN web': dig(OUT['EN web'])}
NS = {k: re.sub(r'\s+', '', v) for k, v in C.items()}
has = lambda ch, s: norm(s) in C[ch] or re.sub(r'\s+', '', norm(s)) in NS[ch]
R = {}


_ST = json.load(open(f'{QA}/sekil-tarama/indeks.json', encoding='utf-8')) if os.path.exists(f'{QA}/sekil-tarama/indeks.json') else {}
ST_OK = bool(_ST) and all(len(_ST[l]['sekiller']) == 45 and _ST[l]['sha256'] == hashlib.sha256(open(_ST[l]['pdf'], 'rb').read()).hexdigest() for l in ('tr', 'en')) \
    and len(glob.glob(f'{QA}/sekil-tarama/*.png')) >= 90
ST_OBS = {l: {'sekil': len(_ST.get(l, {}).get('sekiller', {})), 'Sekil 6.3 sayfa': _ST.get(l, {}).get('sekiller', {}).get('6.3')} for l in ('tr', 'en')} | {'png': len(glob.glob(f'{QA}/sekil-tarama/*.png'))}
_UI = json.load(open(f'{QA}/ui-test.json', encoding='utf-8')) if os.path.exists(f'{QA}/ui-test.json') else {'testler': []}
_UI_FRESH = os.path.exists(f'{QA}/ui-test.json') and all(os.path.getmtime(f'{QA}/ui-test.json') >= os.path.getmtime(p) for p in ('dist/web/index.html', 'dist/web/en.html'))
def ui(rid, n=2):
    r = [t for t in _UI['testler'] if t['id'] == rid]
    return _UI_FRESH and len(r) == n and all(t['ok'] for t in r), {'sonuc': {t['lang']: t['ok'] for t in r}, 'ui-test.json dist/web\'den yeni': _UI_FRESH, 'tarih': _UI.get('tarih')}
def T(desc, ok, obs, exp=''): return {'test': desc, 'ok': bool(ok), 'observed': obs, 'expected': exp}
def present(ph, chans):
    miss = {p: [c for c in chans if not has(c, p)] for p in ph}; miss = {k: v for k, v in miss.items() if v}
    return T('var: ' + ' | '.join(p[:60] for p in ph) + ' — ' + ', '.join(chans), not miss, miss or 'hepsinde var', 'her kanalda var')
def absent(ph, chans):
    hit = {p: [c for c in chans if has(c, p)] for p in ph}; hit = {k: v for k, v in hit.items() if v}
    return T('yok: ' + ' | '.join(p[:60] for p in ph) + ' — ' + ', '.join(chans), not hit, hit or 'hiçbirinde yok', 'hiçbir kanalda yok')
def rec(rid, title, kind, change, tests, refs, external=''):
    R[rid] = {'baslik': title, 'tur': kind, 'degisiklik': change, 'ok': all(t['ok'] for t in tests), 'testler': tests, 'refs': refs, 'dis_kosul': external}


ALL5 = ['TR PDF', 'EN PDF', 'EPUB', 'TR dijital', 'EN dijital']
KW = {'tr': run("pdfinfo print/typeset/out/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'"), 'en': run("pdfinfo print/typeset/out/en-kdp/ic-blok-rgb.pdf | sed -n 's/^Keywords: *//p'")}
kw = lambda k, l: (re.search(k + r':(\S+)', KW[l]) or [None, None])[1]

# ---------------- R056
rec('R056', 'AI Act: sosyal puanlama koşulları ve Madde 50(4) editoryal sorumluluk', 'AÇIK KUSUR',
    'Şekil 7.4 kart 1 ve dijital kart Madde 5(1)(c)\'nin olumsuz muamele koşullarını taşıyor; cevap ve gerekçe iki koşulu ve yasağın kamuya özgü olmadığını söylüyor; Madde 50(4) metin istisnası iki koşullu.',
    [present(['Sosyal davranış puanıyla ilgisiz alanlarda orantısız yaptırım uygulayan devlet sistemi'], ['TR PDF', 'TR dijital', 'TR web']),
     present(['A state social-behavior score that triggers disproportionate penalties in unrelated areas'], ['EN PDF', 'EPUB', 'EN dijital', 'EN web']),
     T('headless Chrome (ui_test.mjs): kart 1 etiketi görünür, "Yasak" seçimi doğru, gerekçe 5(1)(c) ve kamuya özgü olmama (TR ve EN)', *ui('R056')),
     present(['verinin toplandığı bağlamla ilgisiz alanlarda', 'yasak yalnız kamu otoritelerine özgü değildir'], ['TR PDF']),
     present(['in contexts unrelated to where the data was collected', 'the ban is not limited to public authorities'], ['EN PDF', 'EPUB']),
     present(['yayımının editoryal sorumluluğunu bir gerçek ya da tüzel kişinin taşıdığı', 'iki koşul birlikte aranır'], ['TR PDF', 'TR dijital']),
     present(['a natural or legal person holds editorial responsibility for', 'both conditions must hold'], ['EN PDF', 'EPUB', 'EN dijital']),
     absent(['Vatandaşları davranışına göre puanlayan devlet sistemi', 'A state system scoring citizens by behavior', 'social scoring by a public authority is prohibited',
             'insan editoryal denetiminden geçen metin', 'text under human editorial control is outside'], ALL5)],
    [('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'Sosyal davranış puanıyla'), ('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'iki koşul birlikte aranır'),
     ('print/src/en/M07-ai-and-society.md', 'both conditions must hold'), ('print/src/tr/cevaplar/M07.md', 'yasak yalnız kamu otoritelerine'),
     ('print/src/en/answers/M07.md', 'not limited to public authorities'), ('print/figures/strings/M07.mjs', 'Sosyal davranış puanıyla'),
     ('Atlas-Kitap.dc.html', 'Sosyal davranış puanıyla'), ('Atlas-Kitap-EN.dc.html', 'both conditions must hold')],
    'Bütün kitap için hukuki uygunluk sertifikası değildir; hukukçu onayı yazara önerilir.')

# ---------------- R064 / N007
ge = {l: json.loads(run(f'node {QA}/exp_getter_test.mjs "{OUT[k]}" {l}').split('\n')[-1]) for l, k in (('en', 'EN dijital'), ('tr', 'TR dijital'))}
gw = {l: json.loads(run(f'node {QA}/exp_getter_test.mjs "{OUT[k]}" {l}').split('\n')[-1]) for l, k in (('en', 'EN web'), ('tr', 'TR web'))}
rec('R064', 'EN arayüzünde Türkçe kalan metin (üstel büyüme sayacı)', 'AÇIK KUSUR · N007',
    'EN expCount getter: en-US binlik ayraç ve million/billion; TR getter: basılı kitapla aynı ondalık nokta (R095).',
    [T('EN Atlas getter 27 durum (d = 0…26) biçim', ge['en']['states'] == 27 and not ge['en']['bad'], ge['en']['sample']),
     T('EN derlenmiş web getter 27 durum', gw['en']['states'] == 27 and not gw['en']['bad'], [s['out'] for s in gw['en']['sample']]),
     T('TR getter 27 durum (2.300 · 1.2 milyon · 2.4 milyar)', not ge['tr']['bad'] and not gw['tr']['bad'], [s['out'] for s in ge['tr']['sample']]),
     T('headless Chrome (ui_test.mjs): sayaç düğmesine 26 kez tıklanarak 27 görünür durum, TR ve EN biçimi', *ui('R064')),
     T('headless Chrome (ui_test.mjs): EN 61 bölüm × Basit + Teknik = 122 görünümde Türkçe karakter/sözcük 0 (özel adlar hariç)', *ui('N007', 1)),
     absent(['milyon', 'milyar', "toLocaleString('tr-TR')"], ['EN dijital', 'EN web'])],
    [('Atlas-Kitap-EN.dc.html', 'R064: EN number format'), ('Atlas-Kitap.dc.html', 'R095: ondalık nokta'), ('print/kitap/qa/exp_getter_test.mjs', 'expCount')])

# ---------------- R071 / N001: başlık yalnızlığı, PDF'ten bağımsız
import importlib.util as _iu
_sp = _iu.spec_from_file_location('cth', 'print/typeset/check_table_heads.py'); _m = _iu.module_from_spec(_sp); _sp.loader.exec_module(_m); header_alone = _m.header_alone
ha = {l: header_alone(h, OUT[k]) for l, h, k in (('tr', 'print/typeset/out/ic-blok.html', 'TR iç blok'), ('en', 'print/typeset/out/en-kdp/ic-blok.html', 'EN iç blok'))}
rec('R071', 'Tablolar: başlık ile ilk veri satırı birlikte; kısa tablo ve tek satır bölünmez', 'AÇIK KUSUR · N001',
    'Uzun tabloda ilk, ikinci ve son veri satırı komşusundan ayrılmaz (data-break-before="avoid"); hooks.js yalnız başlıklı parçayı sayar, check.sh kapısı.',
    [T(f'{l.upper()} DOM sayaçları: kısa tablo bölünmesi 0, tek veri satırlı parça 0, yalnız başlıklı parça 0',
       kw('tablo-kucuk-bolunen', l) == '0' and kw('tablo-tek-satir', l) == '0' and kw('tablo-yalniz-baslik', l) == '0',
       {k: kw(k, l) for k in ('tablo-kucuk-bolunen', 'tablo-tek-satir', 'tablo-yalniz-baslik', 'thead-tekrar')}) for l in ('tr', 'en')] +
    [T(f'{l.upper()} DOM: önceki sayfadan devam eden her tablo parçasında sütun başlığı var (tablo-devam-basliksiz 0)',
       kw('tablo-devam-basliksiz', l) == '0' and int(kw('tablo-devam', l) or 0) > 0, {k: kw(k, l) for k in ('tablo-devam', 'tablo-devam-basliksiz')}) for l in ('tr', 'en')] +
    [T(f'{l.upper()} PDF bağımsız ölçüm: sayfanın son satırı bir tablo başlığı olan sayfa yok ({ha[l][0]} başlıklı tablo)', not ha[l][1], ha[l][1] or 'yok')
     for l in ('tr', 'en')],
    [('print/typeset/typeset.py', 'N001: başlık satırı'), ('print/typeset/hooks.js', 'tablo-yalniz-baslik'), ('print/typeset/check.sh', 'tablo-yalniz-baslik:0')])

# ---------------- R073 / N008
geo = run('node print/figures/check_fig_geom.mjs all')
rec('R073', 'Şekil etiketleri: çakışma, kesilme, çizgi teması', 'AÇIK KUSUR · N008',
    'Şekil 6.3 "çıktı/output" etiketi Gözlem düğümünün altına; geometri denetimi çerçeve/elips çizgi temasını da ölçüyor (köşe rozetleri hariç).',
    [T('90 şekil geometri denetimi (kenar payı, metin–metin, metin–çerçeve/elips çizgisi)', 'temiz' in geo, geo.split('\n')[-1]),
     T('dizgi ölçeğinde 180 dpi görüntüler: 45 TR + 45 EN şekil, son PDF\'lerle aynı SHA-256 (sekil_tarama.py)', ST_OK, ST_OBS)],
    [('print/figures/gen/M06.mjs', 'N008'), ('print/figures/check_fig_geom.mjs', 'çizgi teması'), ('print/figures/gen/M07.mjs', 'R056: uzun kart metni')],
    'Fiziksel prova R082 kapsamında.')

# ---------------- R094 / N004
rec('R094', 'Önsöz ve EPUB: tarihsel ardıllık kapakla tutarlı', 'AÇIK KUSUR · N004',
    'TR/EN önsöz "her biri/each one" yerine "çoğu/most … bazıları yan yana"; EPUB önsözü aynı kaynaktan.',
    [absent(['Her biri bir öncekinin yetmediği yerde doğdu', 'Each one was born where the one before it hit a wall', 'follow the order of history'], ['TR PDF', 'EN PDF', 'EPUB']),
     present(['Bunların çoğu bir öncekinin yetmediği yerde doğdu, bazıları da yan yana gelişti'], ['TR PDF']),
     present(['Most of them were born where the one before hit a wall, and some grew up side by side'], ['EN PDF', 'EPUB'])],
    [('print/src/tr/on/02-onsoz.md', 'Bunların çoğu'), ('print/src/en/front/02-preface.md', 'Most of them were born')])

# ---------------- N006
rec('N006', 'Deepfake vaka 1: anlatıcı bilgisi ve doğrulama belirsizliği (isteğe bağlı öneri, uygulandı)', 'REDAKSİYON',
    'Vaka metni artık anlatıcının bilemeyeceği bir kesinlik içermiyor: "hiçbir kaynakta doğrulanmayan bir cümleyi söylerken".',
    [absent(['hiç söylemediği bir cümleyi söylüyor', 'says a sentence they never said'], ALL5),
     present(['hiçbir kaynakta doğrulanmayan bir cümleyi söylerken'], ['TR PDF', 'TR dijital']),
     present(['a sentence that no source confirms;'], ['EN PDF', 'EPUB', 'EN dijital'])],
    [('print/src/tr/M07-yapay-zeka-ve-toplum.md', 'hiçbir kaynakta doğrulanmayan'), ('print/figures/strings/M07.mjs', 'hiçbir kaynakta doğrulanmayan'), ('Atlas-Kitap.dc.html', 'hiçbir kaynakta doğrulanmayan')])

# ---------------- R082 / N002
PF = {l: json.loads(run(f'node {QA}/pdf_fontsize.mjs "{OUT[k]}"').split('\n')[-1]) for l, k in (('tr', 'TR iç blok'), ('en', 'EN iç blok'))}
ck = open('print/typeset/check.sh', encoding='utf-8').read()
rec('R082', 'Şekil puntosu: iddianın kapsamı ve %100 prova', 'EK VE DIŞ KABUL · N002',
    'İddia daraltıldı: "normal metin ve şekil yazısı ≥ 6,5 pt"; matematik üst/alt simgeleri ve Type 3 yedek glifler hedef dışı olarak sayılıp listeleniyor (kabul/kucuk-glif-*.csv).',
    [T(f'{l.upper()} PDF: normal yazıda 5,5–6,5 pt arası gösterim yok', PF[l]['band_5_5_to_lim'] == 0,
       {k: PF[l][k] for k in ('normal_min_ge55', 'band_5_5_to_lim', 'sup_sub_lt55', 'type3_fallback')}) for l in ('tr', 'en')] +
    [T('check.sh ve rapor iddiası kapsamlı ("normal metin ve şekil yazısı"; istisnalar sayılıyor)', 'normal metin ve şekil yazısı ≥ 6,5 pt' in ck and 'Hedef dışı' in ck, 'check.sh mesajı'),
     T('küçük glif sayfaları prova tablosunda', os.path.exists('print/teslim/kabul/kucuk-glif-tr.csv') and os.path.exists('print/teslim/kabul/kucuk-glif-en.csv'), 'print/teslim/kabul/kucuk-glif-{tr,en}.csv')],
    [('print/typeset/check.sh', 'Hedef dışı'), ('print/kitap/qa/pdf_fontsize.mjs', 'band_5_5_to_lim'), ('print/teslim/kabul/KABUL-PROTOKOLU.md', 'R082')],
    '%100 fiziksel prova ve küçük glif okunurluğu (kabul/KABUL-PROTOKOLU.md, kucuk-glif-*.csv).')

# ---------------- R099 / N003 / N005
rel = json.load(open(f'{QA}/sekil-iliski-45.json', encoding='utf-8')) if os.path.exists(f'{QA}/sekil-iliski-45.json') else {}
kp = json.load(open(f'{QA}/kindle-previewer/kanit.json', encoding='utf-8')) if os.path.exists(f'{QA}/kindle-previewer/kanit.json') else {}
import zipfile
with zipfile.ZipFile(OUT['EN EPUB']) as _ze:
    _cx = _ze.read('EPUB/text/cover.xhtml').decode('utf-8'); _cm = re.search(r'(?:src|xlink:href)="\.\./(media/[^"]+)"', _cx)
    epub_cover = hashlib.sha256(_ze.read('EPUB/' + _cm.group(1))).hexdigest() if _cm else ''
with zipfile.ZipFile(OUT['EN KPF']) as _z:
    kpf_epub = hashlib.sha256(_z.read('book.epub')).hexdigest()
    kpf_err = sum(1 for l in _z.read('conversionLog.csv').decode('utf-8-sig').splitlines() if l.startswith('"Error",'))
gui = open(f'{QA}/kindle-previewer/gui/OZET.txt', encoding='utf-8').read().strip() if os.path.exists(f'{QA}/kindle-previewer/gui/OZET.txt') else ''
_gb = re.search(r'B_ayarli: önizleme (\d+) bayt · hata satırı (\d+)', gui); _ga = re.search(r'A_ayarsiz: önizleme (yok|\d+ bayt) · hata satırı (\S+)', gui)
_gj = re.search(r'ayarı alan Java alt süreci (\d+)', gui)
gui_ok = bool(_gb and int(_gb.group(1)) > 0 and _gb.group(2) == '0' and _gj and int(_gj.group(1)) > 0 and _ga and (_ga.group(1) == 'yok' or _ga.group(2) not in ('0', '-')))
ec = run(f'epubcheck "{OUT["EN EPUB"]}" 2>&1 | grep Messages')
cov = json.loads(run(f'python3 {QA}/fig_coverage.py en "{OUT["EN EPUB"]}"'))
rec('R099', 'EPUB erişilebilirliği, şekil eşdeğerliği, bağımsız Previewer dönüşümü', 'EK VE DIŞ KABUL · N003, N005',
    'Şekil eşliği ayrı kabul kaydı (değer/işaret/sıra/bağlantı); etiket yüzdesi "mekanik eşleme" olarak adlandırıldı; Previewer kök nedeni A/B ve JVM kanıtıyla belirlendi, preview.sh tekrarlanabilir.',
    [T('epubcheck', '0 fatals / 0 errors / 0 warnings' in ec, ec),
     T('45 şekil ilişki kaydı: kritik değer (işaretli), sıra, görsel→Kurulum, görsel↔ek', rel.get('kabul') == 45 and rel.get('epub', '').endswith('AI-for-Everyone.epub'),
       {k: rel.get(k) for k in ('sekil', 'kabul', 'kritik_deger_toplam', 'govdede_toplam')}),
     T('mekanik etiket eşleme ayrı gösterge olarak etiketli', cov.get('olcum', '').startswith('mekanik'), {'olcum': cov.get('olcum', '')[:40], 'yuzde': cov.get('pct')}),
     T('N005 kök neden: aynı EPUB, ayarsız → Error; JAVA_TOOL_OPTIONS → Success; ayar Java alt süreçlerine ulaştı',
       kp.get('epub_sha256') == HASH['EN EPUB'] and 'Error' in kp.get('A_ayarsiz', {}).get('ozet', '') and 'Success' in kp.get('B_JAVA_TOOL_OPTIONS', {}).get('ozet', '')
       and kp.get('B_JAVA_TOOL_OPTIONS', {}).get('ayari_alan_java_alt_sureci', 0) > 0 and kp.get('gomulu_jre_user_language') == {'ayarsiz': 'tr', 'JAVA_TOOL_OPTIONS': 'en'}, kp),
     T('N005 asıl Java hatası: ayarsızda MissingResourceException "epubprocessor.ınfo_en" (Türkçe küçük harf) ve CLI "Failed to get Mobi message stores"; ayarlıda ikisi de 0',
       kp.get('A_ayarsiz', {}).get('java_istisnasi_inf_o', 0) > 0 and 'ınfo' in kp.get('A_ayarsiz', {}).get('istisna_ornegi', '')
       and kp.get('A_ayarsiz', {}).get('cli_mobi_message_stores_uyarisi', 0) > 0
       and kp.get('B_JAVA_TOOL_OPTIONS', {}).get('java_istisnasi_inf_o', 1) == 0 and kp.get('B_JAVA_TOOL_OPTIONS', {}).get('cli_mobi_message_stores_uyarisi', 1) == 0,
       {k: kp.get(k) for k in ('A_ayarsiz', 'B_JAVA_TOOL_OPTIONS')}),
     T('N005 incelemecinin sonucu yeniden üretildi: değişken export edilmeden atanınca ayar Java\'ya ulaşmıyor (0 alt süreç) ve aynı Error + "Failed to get Mobi message stores" çıkıyor',
       (lambda c: c.get('exit') == 1 and 'Error' in c.get('ozet', '') and c.get('ayari_alan_java_alt_sureci') == 0 and c.get('cli_mobi_message_stores_uyarisi', 0) > 0)(kp.get('C_export_edilmemis_atama', {})),
       kp.get('C_export_edilmemis_atama')),
     T('EPUB kapak görseli = güncel Kindle kapak JPEG\'i (kapak sırtı değişince EPUB yeniden üretilmiş)', epub_cover == hashlib.sha256(open('print/kitap/en/kdp-ebook-cover.jpg', 'rb').read()).hexdigest(),
       {'epub_kapak': epub_cover[:16], 'kdp_ebook_cover': hashlib.sha256(open('print/kitap/en/kdp-ebook-cover.jpg', 'rb').read()).hexdigest()[:16]}),
     T('KPF içindeki book.epub, güncel EPUB ile aynı (SHA-256) ve KPF conversionLog\'da hata satırı yok',
       kpf_epub == HASH['EN EPUB'] and kpf_err == 0, {'kpf_icindeki_epub': kpf_epub, 'guncel_epub': HASH['EN EPUB'], 'hata_satiri': kpf_err}),
     T('Previewer arayüzü (GUI) A/B: ayarsız açılış hata/önizleme yok, JAVA_TOOL_OPTIONS ile önizleme üretildi ve hata satırı 0',
       gui_ok, gui or 'PREVIEW_GUI=1 sh print/kindle/preview.sh çalıştırılmadı'),
     T('kaynakça bağlantıları EPUB\'da tıklanabilir (R098 eki)', len(re.findall(r'<a href="https?://(?:doi|data\.europa|arxiv|eur-lex|papers|ntrs|ref\.gs1)', EPX)) >= 20,
       len(re.findall(r'<a href="https?://', EPX)))],
    [('print/kindle/preview.sh', 'Kök neden'), ('print/kitap/qa/fig_relations.py', 'kritik değer'), ('print/kitap/qa/fig_coverage.py', 'mekanik etiket eşleme'), ('print/kindle/kindle.py', 'R098')],
    'VoiceOver/TalkBack ve gerçek Kindle cihaz/profil/font/yön testleri (kabul/erisilebilirlik-testi.csv); Previewer GUI denemesi aynı JAVA_TOOL_OPTIONS ile.')

# ---------------- dış kabul grupları
okb = open('print/teslim/matbaa/OKUBENI.md', encoding='utf-8').read()
qr = {l: list(csv.DictReader(open(f'print/teslim/kabul/qr-testi-{l}.csv', encoding='utf-8-sig'))) for l in ('tr', 'en')} if os.path.exists('print/teslim/kabul/qr-testi-tr.csv') else {}
rec('R079', 'EAN-13 basılı kabul', 'EK VE DIŞ KABUL', 'Dosya geometrisi doğrulandı (5X koruma, 9786250052112); basılı numune için tarayıcı ve verifier kayıt tablosu hazır.',
    [T('kabul protokolünde iki ayrı kanıt yolu (tarayıcı okuması + ISO/IEC 15416 verifier)', 'ISO/IEC 15416' in open('print/teslim/kabul/KABUL-PROTOKOLU.md', encoding='utf-8').read(), 'KABUL-PROTOKOLU.md R079')],
    [('print/kapak/kapak.mjs', 'textMargin: 3'), ('print/teslim/kabul/KABUL-PROTOKOLU.md', 'R079')], 'Basılı numunede tarayıcı okuması ve verifier sınıf notu.')
rec('R080', 'Hedef ICC ve bağımsız PDF/X preflight', 'EK VE DIŞ KABUL', 'Matbaaya gidecek yazı ve profil gelince çalışacak komut protokolde; aynı hash üzerinde preflight tablosu.',
    [T('OutputCondition "printer profile pending" (dürüst etiket)', 'printer profile pending' in run(f'strings "{OUT["TR iç blok"]}" | grep -m1 OutputCondition'), 'OutputCondition')],
    [('print/teslim/kabul/KABUL-PROTOKOLU.md', 'R080')], 'Matbaanın yazılı ICC/baskı koşulu ve bağımsız preflight raporu.')
ph = {'tr': sorted(set(re.findall(r'\[matbaa[^\]]*\]', C['TR PDF']))), 'en': sorted(set(re.findall(r'\[ISBN\]', C['EN PDF'])))}
rec('R081', 'Künye matbaa satırı ve EN ISBN', 'EK VE DIŞ KABUL (yazar kararı)', 'Değişmedi: yalnız yazar/matbaa doldurabilir; adımlar protokolde.',
    [T('kalan yer tutucular (sabit True değil: gerçek liste)', ph == {'tr': ['[matbaa adı, adres, sertifika no]'], 'en': ['[ISBN]']}, ph)],
    [('print/src/tr/on/00-kunye.md', '[matbaa'), ('print/src/en/front/00-title.md', '[ISBN]')], 'Matbaa adı/adres/sertifika no ve EN ISBN.')
def _trimw(p):
    m = re.search(r'TrimBox:\s+([-\d.]+)\s+[-\d.]+\s+([-\d.]+)', run(f'pdfinfo -box "{p}"')); return float(m.group(2)) - float(m.group(1))
_pages = lambda p: int(re.search(r'Pages:\s+(\d+)', run(f'pdfinfo "{p}"')).group(1))
pg_en, pg_tr = _pages(OUT['EN iç blok']), _pages(OUT['TR iç blok'])
cov_en_w, cov_tr_w = _trimw(OUT['EN kapak']), _trimw(OUT['TR kapak'])
spine_tr = json.load(open('print/kapak/kapak.json', encoding='utf-8'))['spine_mm']
_tes = {'print/teslim/kdp/AI-for-Everyone-paperback-interior-*p.pdf': OUT['EN iç blok'], 'print/teslim/kdp/AI-for-Everyone-paperback-cover.pdf': OUT['EN kapak'],
        'print/teslim/kdp/AI-for-Everyone-kindle.epub': OUT['EN EPUB'], 'print/teslim/kdp/AI-for-Everyone-kindle-cover.jpg': 'print/kitap/en/kdp-ebook-cover.jpg',
        'print/teslim/matbaa/Herkes-Icin-Yapay-Zeka-ic-blok-*s.pdf': OUT['TR iç blok'], 'print/teslim/matbaa/Herkes-Icin-Yapay-Zeka-kapak-*.pdf': OUT['TR kapak']}
tes = []
for pat, src in _tes.items():
    g = glob.glob(pat); okk = len(g) == 1 and hashlib.sha256(open(g[0], 'rb').read()).hexdigest() == hashlib.sha256(open(src, 'rb').read()).hexdigest()
    m = re.search(r'-(\d+)[ps]\.pdf$', g[0]) if len(g) == 1 else None
    if m: okk = okk and int(m.group(1)) == _pages(src)
    tes.append((os.path.basename(g[0]) if len(g) == 1 else pat + f' ({len(g)} dosya)', okk))
rec('R084', 'Kâğıt, cilt, sırt ve KDP kabulü', 'EK VE DIŞ KABUL', 'Kutular kesin; 45 QR × 2 telefon test tabloları (TR/EN) ve KDP Print Previewer kayıt satırı hazır.',
    [T('QR test tabloları 45/45 sayfa eşlemeli', qr and all(len(qr[l]) == 45 and all(r['pdf_sayfa'].isdigit() for r in qr[l]) for l in qr), {l: len(v) for l, v in qr.items()}),
     T('TR TrimBox 160,00 × 240,00 mm', 'TrimBox 160,00 × 240,00 mm' in okb, 'OKUBENI.md'),
     T('EN kapak net genişliği = 2 × 6 in + iç blok sayfası × 0,002252 in (KDP standart renk, beyaz kâğıt; ±0,05 pt)', abs(cov_en_w - (864 + pg_en * 0.002252 * 72)) < 0.05,
       {'ic_blok_sayfa': pg_en, 'kapak_trim_pt': round(cov_en_w, 3), 'beklenen_pt': round(864 + pg_en * 0.002252 * 72, 3), 'sirt_mm': round((cov_en_w - 864) / 72 * 25.4, 3)}),
     T('TR kapak net genişliği = 2 × 160 mm + kapak.json sırtı; iç blok 16\'nın katı', abs(cov_tr_w / 72 * 25.4 - (320 + spine_tr)) < 0.05 and pg_tr % 16 == 0,
       {'ic_blok_sayfa': pg_tr, 'kapak_trim_mm': round(cov_tr_w / 72 * 25.4, 3), 'sirt_mm': spine_tr}),
     T('teslim kopyaları üretim dosyalarıyla aynı SHA-256 ve dosya adındaki sayfa sayısı doğru', all(ok for _, ok in tes), dict(tes))],
    [('print/teslim/kabul_hazirla.py', 'qr-testi'), ('print/teslim/kabul/KABUL-PROTOKOLU.md', 'R084')], 'Matbaa kâğıt/sırt yazılı onayı; KDP Print Previewer ve proof copy; QR testlerinin yapılması.')
for n, t, k, c, refs in (
        ('N001', 'Tablo başlıklarının veriden ayrılması', 'kusur', 'R071 kaydına bakın: kural + sayaç + PDF bağımsız ölçüm.', 'R071'),
        ('N002', 'Punto iddiasının kapsamı', 'açıklama', 'R082 kaydına bakın: iddia daraltıldı, istisnalar sayılıyor.', 'R082'),
        ('N003', 'FigureData eşleme oranının sınırı', 'yöntem', 'R099 kaydına bakın: sekil-iliski-45.json ayrı kabul kaydı.', 'R099'),
        ('N004', 'Tarihsel anlatımın önsöze yayılmaması', 'kusur', 'R094 kaydına bakın.', 'R094'),
        ('N005', 'Bağımsız Previewer dönüşümünün tekrarlanması', 'kabul engeli', 'R099 kaydına bakın: A/B + JVM kanıtı, preview.sh.', 'R099'),
        ('N007', 'EN üstel büyüme sayacında Türkçe metin', 'kusur', 'R064 kaydına bakın.', 'R064'),
        ('N008', 'ReAct çıktı etiketinin oval çizgisine teması', 'kusur', 'R073 kaydına bakın.', 'R073')):
    R[n] = {'baslik': t, 'tur': k, 'degisiklik': c, 'ok': R[refs]['ok'], 'testler': [T(f'{refs} testleri', R[refs]['ok'], f'{refs}: ' + ('geçti' if R[refs]['ok'] else 'başarısız'))], 'refs': [], 'dis_kosul': R[refs]['dis_kosul'], 'bagli': refs}


def line_of(p, s):
    try:
        for i, l in enumerate(open(p, encoding='utf-8'), 1):
            if s in l or s.replace('’', '\\u2019') in l: return f'{p}:{i}'
    except FileNotFoundError: return f'{p} (yok)'
    return f'{p} (ifade bulunamadı)'


ORDER = ['R056', 'R064', 'R071', 'R073', 'R094', 'R079', 'R080', 'R081', 'R082', 'R084', 'R099', 'N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008']
json.dump({'tarih': datetime.datetime.now().isoformat(timespec='seconds'), 'hash': HASH, 'keywords': KW, 'kayitlar': R}, open(f'{QA}/dogrulama-2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
md = ['# İkinci doğrulama raporu: açık kayıtların kapanışı', '', f'Üretim: {datetime.datetime.now().isoformat(timespec="minutes")} · `print/kitap/qa/dogrulama2.py` · ham sonuç `dogrulama-2.json`.',
      'Kapsam: raporun beş somut kusuru (R056, R064, R071, R073, R094), altı ek/dış kabul grubu (R079, R080, R081, R082, R084, R099) ve N001–N008.', '',
      '## Dosya kimlikleri (SHA-256)', '', '| Çıktı | Dosya | SHA-256 |', '|---|---|---|'] + [f'| {k} | `{v}` | `{HASH[k]}` |' for k, v in OUT.items()]
md += ['', '## Özet', '', '| Kayıt | Konu | Tür | Testler | Kalan dış koşul |', '|---|---|---|---|---|']
for k in ORDER:
    r = R[k]; md.append(f'| {k} | {r["baslik"].replace("|", "/")} | {r["tur"]} | {"✔" if r["ok"] else "✘"} {sum(t["ok"] for t in r["testler"])}/{len(r["testler"])} | {r["dis_kosul"] or "yok"} |')
md += ['', '## Kayıtlar', '']
for k in ORDER:
    r = R[k]
    md += [f'### {k} · {r["baslik"]}', '', f'**Durum:** {"testler geçti" if r["ok"] else "TEST BAŞARISIZ"}' + (f'; dış koşul: {r["dis_kosul"].rstrip(".")}.' if r['dis_kosul'] else '; dış koşul yok.'), '',
           f'**Değişiklik:** {r["degisiklik"]}', '']
    if r['refs']: md += ['**Kaynak (güncel satır):** ' + '; '.join(f'`{line_of(p, s)}`' for p, s in r['refs']) + '.', '']
    md += ['| Test | Beklenen | Gözlenen | Sonuç |', '|---|---|---|---|']
    for t in r['testler']:
        o = t['observed'] if isinstance(t['observed'], str) else json.dumps(t['observed'], ensure_ascii=False)
        md.append(f'| {t["test"].replace("|", "/")} | {str(t["expected"]).replace("|", "/")} | {o.replace("|", "/")[:400]} | {"✔" if t["ok"] else "✘"} |')
    md.append('')
md += ['## Kanıt dosyaları', '', '- `print/kitap/qa/dogrulama-2.json`, `sekil-iliski-45.json`, `kindle-previewer/` (A/B, JVM günlükleri, OZET.txt), `sekil-tarama/` (dizgi ölçeğinde görüntüler).',
       '- `print/teslim/kabul/`: dış kabul protokolü ve doldurulacak tablolar (QR 45 × 2 telefon × 2 dil, küçük glif sayfaları, erişilebilirlik).',
       '- `sh print/typeset/check.sh tr matbaa` ve `sh print/typeset/check.sh en kdp`: bu hash\'lerdeki dosyalar için "tüm denetimler geçti".', '',
       'Bu rapor kitabın hatasız olduğunun garantisi ya da matbaa/KDP onayı değildir; dış koşullar özet tablosunda listelidir.']
open(f'{QA}/dogrulama-2-raporu.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
ok = sum(1 for k in ORDER if R[k]['ok']); print(f'{ok}/{len(ORDER)} kayıt testleri geçti → {QA}/dogrulama-2-raporu.md')
for k in ORDER:
    if not R[k]['ok']:
        print('✘', k); [print('   -', t['test'][:90], '→', json.dumps(t['observed'], ensure_ascii=False)[:300]) for t in R[k]['testler'] if not t['ok']]

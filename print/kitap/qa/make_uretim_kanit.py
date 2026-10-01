#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Üretim/dizgi kayıtları (ajan günlüğü olmayan R071, R074–R085, R089–R091, R098 bağlantı testi, R099) için ölçüme dayalı kanıt:
kanit.json (qa_evidence.py) + kaynakca-baglanti.json → uretim-kanit.json. make_report.py bu dosyayı okur."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
K = json.load(open(os.path.join(HERE, 'kanit.json'), encoding='utf-8'))
B = json.load(open(os.path.join(HERE, 'kaynakca-baglanti.json'), encoding='utf-8')) if os.path.exists(os.path.join(HERE, 'kaynakca-baglanti.json')) else {}
first = lambda t: (t or '').strip().splitlines()[0] if (t or '').strip() else ''
def kw(lang, key):
    m = re.search(key + r':(\d+)', K.get('layout', {}).get(lang, '')); return int(m.group(1)) if m else None
lost = {l: re.search(r'bulunamayan (\d+)', K['integrity'][l]) for l in ('tr', 'en')}
lost = {l: (int(m.group(1)) if m else None) for l, m in lost.items()}
P = {}
def put(rid, durum, yer, kanit): P[rid] = {'durum': durum, 'yer': yer, 'kanit': kanit}
ok_int = lost['tr'] == 0 and lost['en'] == 0 and kw('tr', 'kitap-tasma') == 0 and kw('en', 'kitap-tasma') == 0
put('R071', 'uygulandı', '`print/typeset/hooks.js` renderNode (bölünen tablo parçasına kaynak thead klonu); `print.css` `table.small, ol.short {break-inside: avoid}`',
    f"Tekrarlanan tablo başlığı: TR {kw('tr','thead-tekrar')}, EN {kw('en','thead-tekrar')} (PDF Keywords, hooks.js sayımı); ≤ 4 satırlı tablolar ve CNN matrisi bölünmez; metin bütünlüğü TR {lost['tr']} / EN {lost['en']} kayıp")
ix = K['index']
put('R074', 'uygulandı' if not ix['tr']['missing'] and not ix['en']['missing'] else 'kısmen',
    '`print.css` `.ix-list` tek sütun (görünmez 3. sütuna taşma kök nedeni); `assemble.py build_index`',
    f"HTML dizin girişi = PDF: TR {ix['tr']['html']}/{ix['tr']['pdf_found']}, EN {ix['en']['html']}/{ix['en']['pdf_found']}; eksik TR {ix['tr']['missing']} EN {ix['en']['missing']}")
put('R075', 'uygulandı' if ix['tr']['dup_pages'] == 0 and ix['en']['dup_pages'] == 0 else 'kısmen',
    '`print/typeset/hooks.js` afterRendered: aynı sayfaya çözülen dizin bağlantıları silinir',
    f"Silinen tekrar numara: TR {kw('tr','dizin-tekrar-silinen')}, EN {kw('en','dizin-tekrar-silinen')}; PDF dizininde “n, n” tekrarı TR {ix['tr']['dup_pages']}, EN {ix['en']['dup_pages']}; EPUB bağlantıları bölüm bazında korunur")
put('R076', 'uygulandı', '`dizin-terimler.yaml`/`index-terms.yaml` (`!hariç`, `!bölümler`; ayrık anlamlar: Basamak değeri, Sabit terim, Yanlılık); `assemble.py tr_key` (boşluk harflerden önce), takma ad sırası sabit; günlük `uygulama-sozluk-dizin.md`',
    f"Dikkat yalnız 5. ve 7. bölümlerde (gündelik “Dikkat:” hariç); Uzman sistem 2.3/2.7; Ağırlık ile ikili basamak değeri ayrı giriş; Türkçe alfabetik sıra: {ix['tr'].get('alfabetik')}, EN: {ix['en'].get('alfabetik')}")
ops = K.get('ink_ops', {})
rich = {k: (v or {}).get('rich_black_cmy') for k, v in ops.items()}; gray = {k: (v or {}).get('gray_black') for k, v in ops.items()}
put('R077', 'uygulandı' if rich and all(v == 0 for v in rich.values()) else 'kısmen',
    '`print/typeset/PDFX_def.ps` `{} setblackgeneration {} setundercolorremoval` (iç blok ve kapak aynı dosya); kapak INK #000',
    f"İçerik akışı sayımı (`print/typeset/color_ops.py`): zengin siyah (C,M,Y > 0.9) {rich}; yalnız-K siyah `0 g` {gray}; inkcov s.15/kapak (C M Y K): {K.get('ink')} — siyah metin, QR ve EAN yalnız K kalıbında")
qr = {l: ' / '.join(K['qr'][l].strip().splitlines()[-2:]) for l in ('tr', 'en')}
put('R078', 'uygulandı', '`print.css` `.qr svg.qrsvg {width:20mm; padding:2.8mm; border:none}`; `check_qr.mjs` sessiz alan ölçümü (150 dpi)',
    f"TR: {qr['tr']} · EN: {qr['en']}")
ean = K.get('ean_bar_mm')
put('R079', 'uygulandı (fiziksel doğrulayıcı açık)' if isinstance(ean, (int, float)) and ean >= 23.3 else 'kısmen',
    '`print/kapak/kapak.mjs` JsBarcode EAN13 `height: 139` (38 mm genişlik, modül ≈ 0,336 mm), ISBN 9786250052112',
    f"Geometri ölçümü (38 mm baskı genişliği): {K.get('ean')} (hedef normal çubuk ≥ 23,3 mm, GS1 nominal 22,85 mm × büyütme); fiziksel tarayıcı/verifier sonucu prova baskıda kaydedilecek")
put('R080', 'kısmen (matbaa ICC ve bağımsız preflight bekleniyor)', '`PDFX_def.ps` OutputCondition ASCII, Title UTF-16; `ICC=<profil.icc>` ile yeniden üretim hazır',
    'Matbaa profil adını yazılı bildirince `ICC=… sh print/typeset/dizgi.sh` + `kapak.sh`; preflight raporu matbaadan')
ph = K['placeholders']
put('R081', 'açık (yazar/matbaa)', '`print/src/tr/on/00-kunye.md`, `print/src/en/front/00-title.md`', f"Kalan yer tutucular: TR {ph['tr']} · EN {ph['en']} (matbaa künyesi ve KDP ISBN'i yazar dolduracak)")
put('R082', 'uygulandı (fiziksel prova açık)', '`print/figures/lib.mjs` + `gen/*.mjs` etiket puntoları; `gapplan.py MIN_SCALE = 0.90`; günlük `uygulama-sekil*.md`',
    f"check_fig_fonts: {' '.join((K.get('fig_fonts') or '').split())[:300]}")
put('R083', 'uygulandı' if ok_int else 'kısmen', '`hooks.js` renderNode “Teknik derinlik · devam / Technical depth · continued”; `print.css` `.h4box[data-split-to]` alt kenarlık yok',
    f"Devam etiketi: TR {kw('tr','kutu-devam')}, EN {kw('en','kutu-devam')}; metin bütünlüğü TR {lost['tr']} / EN {lost['en']} kayıp; sayfa taşması TR {kw('tr','kitap-tasma')} / EN {kw('en','kitap-tasma')}")
bx = K.get('boxes', {})
put('R084', 'uygulandı (sırt matbaa teyidinde)', '`print/kitap/matbaa/matbaa-notu.md`, `print/teslim/*`',
    f"Ölçülen kutular: TR iç {bx.get('tr_pdf')}, TR kapak {bx.get('tr_cover')}, EN iç {bx.get('en_pdf')}, EN kapak {bx.get('en_cover')}; sayfa: {K.get('pages')}")
put('R085', 'uygulandı', '`print/teslim/matbaa/OKUBENI.md`, `matbaa-notu.md`, `print/teslim/kdp/README-KDP.md`',
    'QR: 20 mm veri karesi + ≥ 2,8 mm sessiz alan (≈ 25,6 mm dış ölçü); fontlar “gömülü (alt küme)”; Kindle Previewer 4; gerçek dosya adları ve sayfa sayıları')
put('R089', 'uygulandı' if ok_int else 'kısmen', '`typeset.py` kısa “=” içeren paragraflara `p.formula`; `print.css` `p.formula {break-inside: avoid}`', f"Formül paragrafları sayfa sonunda bölünmez; metin bütünlüğü TR {lost['tr']} / EN {lost['en']}")
for rid, ad in (('R090', 'RNN'), ('R091', 'SHAP')):
    put(rid, 'uygulandı' if ok_int else 'kısmen', '`print.css` `.h4box[data-split-to]` dolgu/kenarlık kuralı kaldırıldı; `hooks.js` onOverflow (heceli sözcük ortasında kesme yok), bölünen kutuda alt kenarlık yok, görünmez sütun ölçümü; kapı `check_text_integrity.py` + taşma ölçümü `check.sh`',
        f"{ad} kutusu dahil kaynak cümlelerin tamamı PDF metninde: TR {first(K['integrity']['tr'])} · EN {first(K['integrity']['en'])}; taşan sayfa TR {kw('tr','kitap-tasma')} / EN {kw('en','kitap-tasma')}")
ep = K.get('epub', {})
put('R099', 'uygulandı (Kindle Previewer/cihaz testi yazarda)', '`print/kindle/kindle.py` (alt metin = şekil başlığı + Kurulum ilk cümlesi), `build.sh`',
    f"epubcheck: {' '.join(ep.get('epubcheck','').split())[:160]}; şekil {ep.get('figures')}, tanımlayıcı alt metin {ep.get('alt_descriptive')}; yer tutucu {ep.get('placeholders')}")
doi = B.get('doi_handle_api', {})
if doi:
    P['R098_baglanti'] = {'kanit': f"doi.org handle API: {sum(1 for v in doi.values() if v == 1)}/{len(doi)} DOI geçerli"}
json.dump(P, open(os.path.join(HERE, 'uretim-kanit.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('uretim-kanit.json:', len(P), 'kayıt')

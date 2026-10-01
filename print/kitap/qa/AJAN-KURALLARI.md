# Düzeltme turu — ajan kuralları (2026-10-01)

Kaynak belge: `print/kitap/qa/duzeltme-kayitlari.json` (99 kayıt; alanlar: id, title, bulgu, tr, en, guncel, baski, kabul, tam).
Her kaydın `tam` alanı belgedeki tam metindir; "TR düzeltme / EN düzeltme / Güncel düzeltme metni / Önerilen ifade" cümleleri uygulanacak metinlerdir
(gerekirse kitabın sesine uyarlanır; anlam korunur). "Kabul testi" satırı, işin bittiğini neyin kanıtlayacağını söyler.

## Dosya haritası
- Dijital kitap kaynağı: `Atlas-Kitap.dc.html` (TR), `Atlas-Kitap-EN.dc.html` (EN). İki dosya satır satır paraleldir. İçerik `modules()` literalinde
  (bölüm başına `basit`, `teknik`, `tip`, `demo.neOluyorBasit`, `demo.neOluyor`, `quiz`), demo mantığı `renderVals()` ve HTML şablonlarında.
  **Yalnız demo-kod ajanı bu iki dosyayı düzenler.** İçerik ajanları dijital paragraf değişikliklerini SOURCE-CHANGES bloklarına yazar (aşağıda).
- Basılı bölümler: `print/src/tr/M0N-*.md`, `print/src/en/M0N-*.md`; cevaplar `print/src/tr/cevaplar/M0N.md`, `print/src/en/answers/M0N.md`;
  ön/arka: `print/src/tr/on/*`, `print/src/en/front/*`, `print/src/tr/arka/{sozluk.md,kaynakca.md,dizin-terimler.yaml}`,
  `print/src/en/back/{glossary.md,bibliography.md,index-terms.yaml}`. Kapak metinleri `print/kapak/kapak.json`, `kapak.en.json`.
- Basılı bölümlerde kaynak paragraflar dijitalle BİREBİR olmalıdır (`python3 print/check_verbatim_tr.py` / `_en.py` fark listesi; her fark ya
  SOURCE-CHANGES'ta ya da notlarda gerekçeli). Şekil blokları (Kurulum, Adım adım, Kendin dene, tablolar) basılıya özgü metindir; serbestçe düzenlenir.
- Şekil üreticileri: `print/figures/gen/M0N.mjs`, dizgiler `print/figures/strings/M0N.mjs`; `node print/figures/make.mjs tr|en`; TR çıktısı
  `print/figures/out/tr-baseline` ile karşılaştırılır (bilerek değişenler baseline'a kopyalanır); `node print/figures/check_i18n.mjs`.
- Ortak sayılar: `print/kitap/qa/demo-data.json` (`python3 print/demo_data.py` üretir): 4.3 gerçek eğitim turları, 4.5 RNN gizli durumları, 5.4 sıcaklık kuralı.

## SOURCE-CHANGES (içerik ajanları → dijital)
Bölüm dosyasının sonundaki REDAKSİYON NOTLARI / EDITORIAL NOTES bloğundan ÖNCE şu blok (varsa aynı bloğa satır ekle):
```
<!-- SOURCE-CHANGES
ESKİ dijital paragraf metni (birebir, tek satır) ||| YENİ metin (tek satır)
-->
```
- ESKİ, dijital kaynak paragrafıyla (book.json'daki metin: `print/src/tr/book.json` / `print/src/en/book.json`) birebir olmalı; tırnaklar ’ “ ” dahil.
- Sınav sorusu/şık metni de aynı yolla değiştirilebilir (ESKİ = şık metni). Doğru cevap her zaman dijitalde `opts[0]`; şıkların anlamı değişirse
  basılı dosyadaki harf sırası ve `export.py` anahtarı tutarlı kalır (metni değiştir, sırayı değiştirme).
- Basılı paragrafı da aynı anda YENİ metne getir (verbatim).
- Silinecek demo-tekrarı paragraflar için YENİ = `[SİL]` (yalnız basılıdan silinir; dijitalde kalır) — bu turda gerekmez.

## Genel kurallar
- TR ve EN aynı anlamı taşır; sayılar aynı; stil: `print/YAZIM-KILAVUZU.md`, `print/STYLE-GUIDE-EN.md` (uzun tire yok, ekran fiili basılıda yok,
  "exactly/just/really" yok). TR ondalık: düzyazıda ve tabloda nokta (0.55); binlik için nokta yalnız M01 tablosunda ("2.300") — R095 kararı.
- Demo ve şekil "temsili" ise bunu söyle ama kitabın sesini koru (kısa, düz cümle; "Bu şekildeki sayılar anlatım için seçilmiştir" gibi).
- Hukuk metinleri (R056, R057): sürüm tarihi ve madde atfı yaz; kesinlik iddiası yok.
- Her değişiklik için kayıt: `print/kitap/qa/uygulama-<ajan>.md` → satır biçimi: `R0NN | dosya:satır | yapılan (bir cümle) | durum (uygulandı / kısmen / uygulanmadı: neden)`.
  Aynı kayıt birden çok dosyaya dokunuyorsa her dosya ayrı satır.
- Kaynak dosyada `<!-- … -->` yorum blokları hariç yer tutucu bırakma; TODO yazma. Git komutu çalıştırma; `export.py --force` çalıştırma.
- Denetim: işin sonunda `python3 print/check_style_tr.py`, `python3 print/check_style_en.py`, `python3 print/check_consistency_en.py <bölümler>`,
  `python3 print/check_verbatim_tr.py`, `python3 print/check_verbatim_en.py` çalıştır, sonucu rapora yaz.

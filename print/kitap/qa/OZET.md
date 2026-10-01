# Kapsamlı kalite denetimi — özet (2026-09-30 / 10-01)

Beş denetim ajanı (dijital TR/EN · basılı TR · KDP paperback EN · Kindle · içerik tutarlılığı) rapor yazdı
(`dijital.md`, `basili-tr.md`, `kdp-paperback.md`, `kindle.md`, `icerik-tutarlilik.md`). Aşağıda bulgular ve yapılanlar.

## Yayın engeli (A) bulguları → hepsi giderildi

| Bulgu | Sürüm | Düzeltme |
|---|---|---|
| Şekil 2.5 teknik "Ne oluyor?" kutusunda okura redaksiyon notu görünüyordu ("basılı sürümde silindi…") | dijital TR + QR sayfası | kaynak metin geri kondu; `apply_source_changes.py` artık `[SİL] (not)` satırlarını silme sayar; export + build yenilendi |
| Sırt başlığı sırtın dışında (arka kapakta) basılıyordu | TR kapak + EN kapak | `kapak.mjs` sırt başlığı `writing-mode: vertical-rl`; TR 168.7–174.3 mm (sırt 165–178), EN 6.28–6.52 in (sırt 6.125–6.66) |
| Koşan başlık ve sayfa numarası KDP'nin 0.375 in güvenli alanının içindeydi | KDP | `profiles/kdp.css`: kenar 0.78 in, başlık 0.54 in, folyo 0.50 in içeride (ölçüldü) |
| Künye/önsöz yer tutucuları (`[month, year]`, `[place, date]`, `[printer…]`) | EN paperback + Kindle | "September 2026", "Istanbul, September 2026", "Printed on demand by Amazon KDP."; Kindle künyesinde basılı satırlar ve ISBN yok |
| Kindle: cevap anahtarı ve dizin tek paragraf, "QR kod" ifadeleri, teknik kutular stilsiz, içindekiler eksik, başlık üç kez | Kindle | `kindle.py`/`kindle.css`: soru başına paragraf, `div.ix`, bağlantı ifadeleri, `.tech` seçicisi, `--toc-depth=3` + "Chapter N · Başlık", pandoc başlık sayfası, Unicode üst/alt simgeler → `<sup>/<sub>`, karanlık mod için sabit arka plan yok |

## Düzeltilmeli (B) bulguları → yapılanlar

- Dizin sayfa numaraları alt bölüm başını gösteriyordu → `assemble.py` her terim için alt bölümdeki ilk geçişe çapa koyar; dizgi sayfa numarası o çapaya gider (TR "Searle 29" ✓ metin 29; EN "ReAct 138, 150" ✓).
- Sol sayfalarda koşan başlık yoktu (`string-set` body'de işlenmiyor) → sabit metin olarak CSS'e yazılır.
- Cevap anahtarı tek paragrafa akıyordu, uzun tire kullanıyordu → soru başına paragraf, "·" ayraç (TR/EN/Kindle).
- Sınav şıkları her bölümde aynı deseni veriyordu (1. soru hep d) → yeni karışım tohumu `qi·7 + 13·n + 5` (harf dağılımı 14/12/13/11), 16 bölüm dosyası yeniden karıştırıldı, anahtarlar yenilendi; **dijital kitap da aynı tohumu kullanır** (bölüme göre değişir; basılı anahtarla aynı).
- TR ondalık virgül/nokta karışıklığı (M01, M08, cevaplar/M01) → nokta.
- Şekil 2.4 göndermesi şekilde olmayan tabloya işaret ediyordu (TR/EN) → "Şekil 2.4'ün altındaki tabloda…".
- Şekil 7.1 EN formülünde yuvarlama eksikti → `round(...)`.
- "Kapaktaki kadran" (TR/EN "dial") → kapak "ağ" konsepti: "Kapaktaki ızgara ve ağ".
- Ekran fiili kalıntıları (TR 4.3/4.6 "tur tur ilerle… izle", 5.2/5.3 "bir kelime seç") → okuma fiilleri.
- PDF meta verisi "Onur ÃŒnder" → UTF-16 pdfmark (Title/Author doğru).
- Sınav şıkları sayfa sonunda bölünmesin → `ol.short` (≤ 5 madde) bölünmez. Tablolar bölünebilir kalır (bölünmez tablo sayfa sonunda boşluk yaratıyordu).
- Künyede e-posta kırılması → ön bölümde `hyphens: manual`.
- KDP barkod alanı → beyaz alan kesimden 0.25 in içeride, 2 × 1.2 in (KDP'nin bastığı yerle çakışır).
- Kindle Live Demos tablosu dar ekranda taşıyordu → kısa bağlantı metni; EN KDP "How to read" ve Live Demos taşmaları → profil CSS.
- Dijital EN 3.2 teknik "Sort the tasks of Figure 3.2" → "below".

## Kabul edilen / yazara kalan

- **Yer tutucular (yazar):** TR teşekkür `[İsimler]` ×3, künye `[matbaa adı, adres, sertifika no]` (matbaa verir); EN teşekkür `[names]` ×3 (Kindle ve paperback'te de görünür!), EN paperback `[ISBN]` (KDP ücretsiz ISBN ya da kendi ISBN'in).
- Ertelenmiş şekiller: metinde "Şekil N.j" göndermesi şekilden en çok 2 sayfa önce (8 EN, 18 TR) — yüzen şekil düzeninin doğası; ≥ 3 sayfa yok.
- Küçültülmüş şekillerde (×0.8–0.9) en küçük yazı ≈ 4–5 pt → fiziksel provada okunurluğu teyit et (TR 1.1, 5.5, 5.7).
- Bölüm sonu boşlukları (son sayfa %30–65 dolu) ve açılış öncesi boş versolar kitap geleneği.
- Bölüm 5 (EN) kuyruk için satır aralığı 1.44 / punto ×0.96 ile sıkıldı; TR bölüm 1/3/7 ve kaynakça benzer ayarlarla (`_tighten`).
- Dizinde aynı sayfaya düşen iki alt bölüm çift numara verebilir (ör. "GOFAI 55, 55") — dizgi anında birleştirilemiyor; kozmetik.
- Kapak yazar tanıtımı (TR: "tam olarak", "devrim"; EN: üçüncü → birinci kişi geçişi) yazarın metni; dokunulmadı.
- Kindle kapağı 1706 × 2560 (1.5:1; KDP ideali 1.6:1, kabul ediyor).

## Son durum

| Sürüm | Çıktı | Durum |
|---|---|---|
| Dijital TR/EN | `Atlas-Kitap*.dc.html` → dist/, store/d ×90, gated | betikler geçerli; sızan not yok; yazar `upload_book.py` + `git push` |
| Basılı TR (matbaa) | `print/kitap/ic-blok.pdf` 232 s. (226 + 6 Notlar), `kapak.pdf` sırt 13 mm | check.sh geçti; QR 45/45 |
| KDP paperback EN | `print/kitap/en/kdp-interior.pdf` 236 s., `kdp-cover.pdf` sırt 13.5 mm | check.sh geçti; başlık 0.54 in, folyo 0.50 in; `[ISBN]`, `[names]` bekliyor |
| Kindle EN | `print/kitap/en/AI-for-Everyone.epub` 2.1 MB | epubcheck 0; 106 TOC girdisi; `[names]` bekliyor |

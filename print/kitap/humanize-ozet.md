# İnsanlaştırma geçişi — özet (2026-09-30)

İki dilde, basılı bölüm dosyaları (`print/src/{tr,en}/`) üzerinde 8 editör ajanla yürütüldü; kaynak paragraflardaki
değişiklikler `apply_source_changes.py` ile dijital kitaba (`Atlas-Kitap.dc.html`, `Atlas-Kitap-EN.dc.html`) taşındı.
Ayrıntılı bulgular: `humanize-tr-report.md`, `humanize-en-report.md`. Bölüm bazlı karar günlükleri: `REDAKSIYON-NOTLARI.md`,
`en/EDITORIAL-NOTES.md` ("2026-09-30 insanlaştırma geçişi / humanizing pass" satırları).

## Ne temizlendi (iki dilde aynı liste)

- Köprü şablonları: "Peki …? Cevap … Sıradaki bölüm …" / "[Özet]. But [soru]? The next section…" — her köprü düz, birbirinden farklı cümleyle yeniden yazıldı.
- Vurgu kalıpları: "tam da/işte/aslında/yani/dürüst(çe)", "exactly/just/really/actually/honestly/simply", "… budur." punchline'ları, "That is why/how" kapanışları.
- Yönlendirme kalıpları: "Bir de şunu fark et", "üç şeye bak / Birincisi… İkincisi…", "Notice / Look at / Think of it this way", "in one sentence".
- Ekran–kâğıt çerçeveleri: "Ekranda … kâğıtta …" / "On screen … on paper" cümleleri (bilgi kaybı olmadan) silindi; "dijital sürümde" göndermeleri "canlı gösterim"e indirildi.
- Şişirme sözler: büyü/devrim/harika/yolculuk, magic/revolution/power; "güç–sorumluluk" klişesi; kavram tırnakları azaltıldı; iki nokta sonrası küçük harf.
- Sloganların tekrarı: "kötü niyetten değil çarpık veriden" 5→2, "genel ≠ bilinçli" 6→3, "kanıtlanmış kehanet değil" 4→1, "gerçek beyin" 6→2, "responsibly and measurably" 3→1.
- Üretim sızıntıları: "kaynağın kodundan", "gösterimdeki kartlardan", geri bildirim dizeleri, kenar notu göndermeleri.
- Sınav öncesi köprüler tek biçimde ("Altı soru kaldı." / "Six questions follow."); cevap dosyalarında "Serbest cevap/Open-ended" yalnız açık uçlularda ("Answers vary.").
- Teknik "Ne oluyor?" paragrafları: teknik paragrafı kelimesi kelimesine tekrar edenler basılıdan kırpıldı ya da tek cümleye indirildi (TR 1.x–8.x, EN 1.1–8.6). **Dijitalde aynen kalır** (demo altında tek başına anlamlı).
- Basılıda ekran fiili kalmadı: TR 4.2 "Kaydıraçları oynattıkça" → "Girdileri değiştirdikçe"; 7.2 teknik "Gösterimdeki" → "Şekil 7.2’deki". Dijitalde kaydıraç/bas/sürükle metinleri korunur.

## Sayılar

| | TR | EN |
|---|---|---|
| Değiştirilen cümle (yaklaşık) | 1–2: 125 · 3–4: 58 · 5–6: 130 · 7–8: 90 + ön/arka | 1–2: 75 · 3–4: 39 · 5–6: ~90 · 7–8: ~80 + ön/arka |
| Kaynak paragraf değişikliği (SOURCE-CHANGES) | 43 + 33 + 29 + 22 = 127 satır | 36 + 34 + 18 + 10 = 98 satır |
| Dijitale aktarım | doğrudan 97 · kelime-düzeyi 17 · elle 10 · silme 1 | doğrudan 67 · kelime-düzeyi 12 · elle 8 · basılıya özgü 2 |
| Web kaynak satırı değişen | 114 | 79 |

Elle gözden geçirilen aktarımlar `web-overrides-{tr,en}.md`; betik raporu `sync-report-{tr,en}.md`.

## Doğrulama (geçiş sonrası)

- `check_style_tr.py` 45 şekil 0 sorun · `check_style_en.py` 45 figures 0 issues.
- `check_consistency_en.py`: 6 kalan fark, hepsi önceden gerekçeli (tablo sayıları TR/EN yerleşim farkı; 5.1 tokenizer örnek metni; 7.1 "9").
- `check_verbatim_{tr,en}.py`: birebir olmayan her kaynak paragraf ya SOURCE-CHANGES'ta (dijitale taşındı) ya da notlarda "yalnız basılı" olarak gerekçeli.
- Dijital kitap: iki HTML'in satır içi betiği sözdizimsel olarak geçerli; `export.py --lang tr|en` ve `build.py` yeniden çalıştırıldı (web, store/d ×90, gated).
- Baskı çıktıları: bkz. `ilerleme.md` son madde (sayfa sayıları, check.sh, epubcheck).

## Yazara kalanlar

- `python3 upload_book.py` (gated kitapların yeni metni) ve `git push` (Vercel).
- Tercih: basılıdan kırpılan teknik "Ne oluyor?" tekrarları dijitalde de kırpılsın mı? (Şu an dijitalde duruyor.)
- Kapak: `kapak.json` author_bio yazım hataları ("karşılacağı", "gerekli.İnsanlığın"), `kapak.en.json` author_bio yer tutucu; EN paperback için ayrı ISBN.

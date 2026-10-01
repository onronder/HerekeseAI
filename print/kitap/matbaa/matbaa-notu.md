# Herkes İçin Yapay Zekâ — matbaa teslim notu

Teslim dosyaları (bu klasörün bir üstünde, `print/kitap/`):

| Dosya | İçerik | Standart |
|---|---|---|
| `ic-blok.pdf` | İç blok, 232 sayfa, tek sayfa sırası (impozisyon matbaada) | PDF 1.3, PDF/X-1a uyumlu (Ghostscript pdfwrite; OutputIntent gömülü), tüm fontlar gömülü ve alt küme, saydamlık yok, tümü vektör |
| `kapak.pdf` | Kapak yayılımı: arka + sırt + ön, tek sayfa | Aynı standart |

## Ölçüler
- **Net ebat:** 160 × 240 mm (TrimBox). **Taşma:** 3 mm her kenar (MediaBox = BleedBox = 166 × 246 mm).
- **Kenar boşlukları:** üst 20 mm, alt 20 mm, iç (sırt tarafı) 20 mm, dış 16 mm. Sayfa numarası alt ortada, koşan başlık üstte.
- **Forma:** 232 sayfa = 14 forma (16'lık) + 1 yarım forma (8). Dosya 8'in katına tamamlanmıştır (son 6 sayfa "Notlar"); matbaa 16'nın katı isterse `MULT=16 sh print/typeset/dizgi.sh` ile 240 sayfa üretilir (14 Notlar sayfası). †
- **Kapak:** net 333 × 240 mm (160 + **13 mm sırt** + 160), taşma 5 mm. **Sırt genişliği geçicidir:** kâğıt seçilince matbaanın verdiği değerle `print/kapak/kapak.json → spine_mm` güncellenip kapak yeniden üretilir (`sh print/kapak/kapak.sh`).

## Renk
- İç blok **tam renk (CMYK 4/4)**; siyah metin %100 K (zengin siyah değil). Figürlerdeki aksan rengi RGB #e85d3a'dan çevrildi (yaklaşık C0 M60 Y75 K9). Saydam öğeler düzleştirildi.
- Renk profili: dosyadaki OutputIntent Ghostscript varsayılan CMYK profilidir. **Matbaanın istediği profil** (ör. ISO Coated v2 / FOGRA39 ya da PSO Uncoated / FOGRA47 için kuşe olmayan kâğıt) bildirilince `ICC=<profil.icc> sh print/typeset/dizgi.sh` ile yeniden üretilir; renk dönüşümü aynı, yalnız OutputIntent değişir.
- Kapak 4/0, laminasyon: mat selofan (öneri). †

## Kâğıt (öneri, matbaa teyidi †)
- İç blok: 80–90 g/m² krem ya da doğal beyaz kitap kâğıdı (Enso/ Holmen; kuşe değil, figürler vektör olduğundan kuşe gerekmez).
- Kapak: 300 g/m² Amerikan bristol ya da 250–300 g/m² kuşe, mat selofan. Amerikan cilt (yapıştırma) ya da iplik dikiş (232 sayfa için iplik dikiş daha dayanıklı). †

## QR kodlar
- 45 QR kod, her biri 22 mm kare + 1,5 mm beyaz sessiz alan, hata düzeltme M, siyah/beyaz vektör. Prova baskıda en az 10 kod üç farklı telefonla okutulmalı.
- Adresler `https://book.onuronder.com/d/<kod>` biçiminde; giriş gerektirmez.

## Yasal ve künye (yayımcı = yazar; matbaa ile netleşecek)
- **ISBN (basılı):** 978-625-00-5211-2 (künyede ve arka kapak EAN-13 barkodunda; barkod 38 mm, beyaz zemin). Birinci basım: Eylül 2026.
- **Bandrol:** FSEK gereği her kopyaya bandrol; adet = baskı adedi; kim yapıştıracak (matbaa) yazılı teyit. †
- **Künye:** matbaa adı, adresi, sertifika numarası ve basım tarihi künyeye yazılacak (`[matbaa adı, adres, sertifika no]`, `[ay, yıl]`).
- **Derleme:** Derleme Kanunu nüshalarını (Milli Kütüphane vb.) kimin teslim edeceği yazılı teyit. †
- Kapakta ve künyede "Pazarlama ve satış: Fittechs Yazılım A.Ş." satırı mevcut.

## Prova ve onay
1. Matbaa preflight raporu (font, renk, taşma, çözünürlük). Beklenen: uyarı yok.
2. Dijital prova (soft proof) → sayfa sırası, koşan başlıklar, dizin sayfa numaraları.
3. **1 fiziksel prova** (tercihen gerçek kâğıt): QR okutma, aksan rengi, iç kenar (metin sırta gömülmüyor), sırt yazısı hizası. †
4. Onay sonrası baskı adedi ve bandrol.

## Yeniden üretim (yazar tarafında)
```bash
sh print/typeset/dizgi.sh && sh print/kapak/kapak.sh && sh print/typeset/check.sh
```
Redaksiyon sonrası aynı komutlar; `check.sh` tüm maddeler ✔ olmadan dosya gönderilmez.

† = matbaadan teyit alınacak madde.

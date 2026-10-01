# Herkes İçin Yapay Zekâ — matbaa teslim notu

Teslim dosyaları (bu klasörün bir üstünde, `print/kitap/`):

| Dosya | İçerik | Standart |
|---|---|---|
| `ic-blok.pdf` | İç blok, 256 sayfa, tek sayfa sırası (impozisyon matbaada) | PDF 1.3, PDF/X-1a uyumlu (Ghostscript pdfwrite; OutputIntent gömülü), tüm fontlar gömülü (alt küme; Type 3 kaynaklar hariç), saydamlık yok, tümü vektör |
| `kapak.pdf` | Kapak yayılımı: arka + sırt + ön, tek sayfa | Aynı standart |

## Ölçüler
- **Net ebat:** 160 × 240 mm (TrimBox; dosyada 160,1 × 239,9 mm — Paged.js px→pt yuvarlaması, ±0,1 mm). **Taşma:** 3 mm her kenar (MediaBox = BleedBox ≈ 166,1 × 245,9 mm).
- **Kenar boşlukları:** üst 20 mm, alt 20 mm, iç (sırt tarafı) 20 mm, dış 16 mm. Sayfa numarası alt ortada, koşan başlık üstte.
- **Forma:** 256 sayfa = tam 16 forma (16'lık); yarım forma yok. Son 5 sayfa "Notlar" (8'in katına tamamlama, aynı zamanda 16'nın katı). †
- **Kapak:** net 334,2 × 240 mm (160 + **14,2 mm sırt** + 160), taşma 5 mm. **Sırt genişliği geçicidir:** kâğıt seçilince matbaanın verdiği değerle `print/kapak/kapak.json → spine_mm` güncellenip kapak yeniden üretilir (`sh print/kapak/kapak.sh`).

## Renk
- İç blok **tam renk (CMYK 4/4)**; siyah metin, QR ve EAN yalnız K kalıbında (zengin siyah yok; `print/typeset/color_ops.py` ve inkcov ile ölçüldü). Figürlerdeki aksan rengi RGB #e85d3a'dan çevrildi (yaklaşık C0 M60 Y75 K9). Saydam öğeler düzleştirildi.
- Renk profili: dosyadaki OutputIntent Ghostscript varsayılan CMYK profilidir. **Matbaanın istediği profil** (ör. ISO Coated v2 / FOGRA39 ya da PSO Uncoated / FOGRA47 için kuşe olmayan kâğıt) bildirilince `ICC=<profil.icc> sh print/typeset/dizgi.sh` ile yeniden üretilir (profil gömülür ve OutputIntent değişir; siyah ayrımı `check.sh`'teki inkcov ölçümüyle yeniden doğrulanır). Dosyadaki PDF/X etiketi bağımsız preflight yerine geçmez: matbaanın kendi preflight raporu istenir.
- Kapak 4/0, laminasyon: mat selofan (öneri). †
- **Kapak zemini düz %100 K'dır** (koyu zemin, yazılar ve EAN yalnız K kalıbında). Matbaa geniş koyu alan için zengin siyah (ör. C40 M30 Y30 K100) isterse zemin rengi ayrıca ayarlanıp kapak yeniden üretilir; yazı ve barkod yine yalnız K kalır. †

## Kâğıt (öneri, matbaa teyidi †)
- İç blok: 80–90 g/m² krem ya da doğal beyaz kitap kâğıdı (Enso/ Holmen; kuşe değil, figürler vektör olduğundan kuşe gerekmez).
- Kapak: 300 g/m² Amerikan bristol ya da 250–300 g/m² kuşe, mat selofan. Amerikan cilt (yapıştırma) ya da iplik dikiş (256 sayfa için iplik dikiş daha dayanıklı). †

## QR kodlar
- 45 QR kod (Version 3, 29×29 modül): veri karesi 20 mm + her yönde ≥ 2,8 mm beyaz sessiz alan (≥ 4 modül) = toplam ≈ 25,6 mm; çerçeve yok; hata düzeltme M; yalnız K kalıbında vektör. Prova baskıda en az 10 kod üç farklı telefonla okutulmalı.
- Adresler `https://book.onuronder.com/d/<kod>` biçiminde; giriş gerektirmez.

## Yasal ve künye (yayımcı = yazar; matbaa ile netleşecek)
- **ISBN (basılı):** 978-625-00-5211-2 (künyede ve arka kapak EAN-13 barkodunda; barkod 38 mm, beyaz zemin). Birinci basım: Eylül 2026.
- **Bandrol:** FSEK gereği her kopyaya bandrol; adet = baskı adedi; kim yapıştıracak (matbaa) yazılı teyit. †
- **Künye:** matbaa adı, adresi ve sertifika numarası künyeye yazılacak (`[matbaa adı, adres, sertifika no]` yer tutucusu); basım tarihi "Eylül 2026" yazılıdır.
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

# Matbaa teslim paketi — Herkes İçin Yapay Zekâ (basılı, 1. basım, Eylül 2026)

Bu klasördeki her şey matbaaya gider. Başka dosya gerekmez.

| Dosya | Ne | Özellik |
|---|---|---|
| `Herkes-Icin-Yapay-Zeka-ic-blok-256s.pdf` | İç blok, 256 sayfa, tek sayfa sırası (impozisyon matbaada) | 160 × 240 mm net + 3 mm taşma (TrimBox/BleedBox tanımlı), PDF/X-1a uyumlu, yalnız CMYK, siyah metin/QR/EAN yalnız K kalıbında (Ghostscript siyah üretimi; inkcov ile doğrulanır), tüm fontlar gömülü (alt küme), tümü vektör, saydamlık yok |
| `Herkes-Icin-Yapay-Zeka-kapak-sirt14-2mm.pdf` | Kapak yayılımı: arka + sırt + ön, tek sayfa | 334,2 × 240 mm net + 5 mm taşma; sırt 14,2 mm (geçici, aşağıya bak); EAN-13 barkod 978-625-00-5211-2 |
| `matbaa-notu.md` | Matbaaya giden şartname | kâğıt, cilt, selofan, prova, QR testi, bandrol/derleme sorumluluğu; † işaretli maddeler matbaayla netleşir |

## Teslimden önce yapılacak iki şey

1. **Künyedeki matbaa satırı.** Sayfa 2'de `[matbaa adı, adres, sertifika no]` yer tutucusu var (Basın Kanunu gereği basımcı bilgisi).
   Matbaa seçilince `print/src/tr/on/00-kunye.md` içindeki satır doldurulur ve iç blok yeniden üretilir:
   `python3 print/assemble.py --lang tr && sh print/typeset/dizgi.sh --lang tr --profile matbaa && sh print/typeset/check.sh tr matbaa`
   ("SONUÇ: tüm denetimler geçti" görülmeden dosya gönderilmez.) Sayfa sayısı değişmez (tek satır).
2. **Sırt genişliği.** Matbaa kâğıt gramajına göre sırtı verir (80 g/m² için ≈ 14,2 mm varsayıldı). Değer farklıysa
   `print/kapak/kapak.json → spine_mm` güncellenir ve kapak yeniden üretilir: `sh print/kapak/kapak.sh && sh print/typeset/check.sh tr matbaa`.

## Matbaaya söylenecekler (kısa)

- İç blok: 256 sayfa = tam 16 forma (16'lık); yarım forma yok (son 5 sayfa "Notlar").
- Tam renk iç blok (CMYK); siyah metin, QR ve EAN yalnız K kalıbında. Kapak zemini düz %100 K (koyu zemin, mat selofan önerilir); matbaa geniş alan için zengin siyah isterse zemin ayarlanıp kapak yeniden üretilir.
- Her şeklin altında QR kod: veri karesi 20 mm (Version 3, 29×29 modül) + her yönde ≥ 2,8 mm beyaz sessiz alan (≥ 4 modül) = toplam ≈ 25,6 mm; çerçeve yok. Provada 2–3 telefonla okutma testi istenir.
- Fiziksel prova: sırt yazısı hizası, iç kenar (20 mm) ve QR okunurluğu kontrol edilir.

Üretim: `print/` altındaki hat (assemble → typeset/dizgi.sh → kapak/kapak.sh → check.sh). Ayrıntı: `print/README.md`.

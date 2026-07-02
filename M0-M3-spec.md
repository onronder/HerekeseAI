# M0–M3 — yeniden tasarım çalışma notu (referans: uploads/Herkes-Icin-Yapay-Zeka-v2.html)

## DİREKTİF (kullanıcı, m0018)
- Genel **"AI-explainer" tasarım dili YOK**: neon/parlayan pill (ör. "● KURALDAN · DERİN ÖĞRENMEYE"), parlayan sinir ağı arka planı, koyu cyber-glow estetiği — hepsi at.
- Sakin, **sayfaya/içeriğe uygun** bir dil. v2.html'deki sade, açık, kart tabanlı dil korunur; her şey v2.html'deki gibi olacak.
- v2.html = her şeyin referansı (içerik + yapı + ton).
- Kapsam: **M0–M3** (giriş/kapak + ilk 3 modül). v2'de modüller 1–8 numaralı; "M0" = giriş ekranı.

## v2.html yapısal kalıbı (doğrulandı)
- Üst bar: "İçindekiler" • "Modül N · ETİKET" • Önceki/Sonraki • N/8 sayaç.
- Modül başlık kartı: yuvarlak ikon + "MODÜL N · ETİKET" (renkli mono kicker) + başlık + alt başlık. Sağda: TR dil toggle + **Basit/Teknik** segmenti (Basit yeşil aktif).
- Alt-sekme şeridi (chip'ler): ör. M1 → Giriş · Zekâ Nedir? · Düşünmek = Hesaplamak · Babbage → Turing · Modern Bilgisayar. Aktif chip koyu dolu.
- İçerik kartı: H2 + paragraflar + sarı "💡 ipucu" kutusu.
- Alt navigasyon: Geri · N/8 · İleri (mavi) ; footer: "İçindekiler" · sonraki modül adı.
- Renk dili: stone-50 zemin, beyaz kartlar, modül başına aksan rengi (M1 mavi, M2 amber, M3 yeşil/teal, M4 mavi, M5 mor...).
- Animasyon keyframes mevcut: mz-pop, mz-rise, mz-flow, mz-grow, mz-fade, mz-draw → sakin pop/rise/flow/draw. Bunları kullan, yenisini icat etme.

## Modül içerikleri (TOC'tan doğrulanmış başlık/konu)
- **M1 · TEMELLER — "Zekâ ve Makineler"** / alt: "Bir makine düşünebilir mi?"
  Konular: Zekâ nedir, düşünmek hesaplamak mıdır, Turing makinesi, von Neumann mimarisi, dar/genel YZ.
  Alt-sekmeler: Giriş · Zekâ Nedir? · Düşünmek = Hesaplamak · Babbage → Turing · Modern Bilgisayar.
  Giriş gövdesi (v2'den, aynen): "Yapay zekânın hikâyesi bilgisayarlarla değil, çok daha eski bir soruyla başlar: 'Düşünmek nedir ve bir makine bunu yapabilir mi?' …" + ipucu: "YZ aslında yeni değil: 'makineler düşünebilir mi?' sorusu 1600'lerden beri filozofları meşgul ediyor. Yeni olan, buna cevap verebilecek donanım."
- **M2 · KURALLARIN ÇAĞI — "Kuralların Çağı"** / alt: "Öğrenmeden önce: elle yazılan zekâ"
  Konular: Çıkarım zincirleri, uzman sistemler, yol bulma ve Markov zincirleri; kuralların duvara tosladığı yer.
- **M3 · İSTATİSTİKSEL YZ — "Makineler Nasıl Öğrenir"** / alt: "Kuraldan örüntüye"
  Konular: Özellik ve etiket, üç öğrenme türü, sınıflandırma/regresyon, kümeleme, gradyan inişi ve aşırı uyum.
- (sonraki) M4 · DERİN ÖĞRENME — "Yapay Beyin" / "Nörondan sinir ağına": yapay nöron, katmanlar, geri yayılım, CNN, RNN, GAN.

## YAPILACAK (sonraki oturum)
1. v2.html'i render et; her modülün her alt-sekmesinde Basit+Teknik metinleri DOM innerText ile sırayla çek (gövde paragrafları + ipucu + demo başlıkları). Tam metni buraya/JSON'a kaydet.
2. M0–M3'ü v2 diline sadık tek DC olarak kur (üst bar, başlık kartı, alt-sekme şeridi, içerik kartı, alt nav). Aksan renkleri modül bazlı.
3. v2'deki interaktif demoları sade dille koru (neon değil); mz-* keyframe'leriyle sakin geçiş.
4. Kapak-Giris.dc.html'i bu sakin dile göre revize et / ya da v2 kapağıyla hizala (neon "Canlı Ağ" yönünü kaldır).

## NOT
- Kapak-Giris.dc.html mevcut (2 neon-ağırlıklı yön). Kullanıcı bu yönü reddetti; revize edilecek, silinmeyecek.

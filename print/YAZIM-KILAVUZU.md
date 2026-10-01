# Basılı sürüm yazım kılavuzu (TR)

Bu kılavuz `print/src/tr/M0x-*.md` bölüm dosyalarının **nihai el yazması** biçimini tanımlar. Dosyalar bu biçime
getirildikten sonra `print/assemble.py` ile tek parça kitaba birleştirilir. Kaynak metin (basit, teknik, kenar notu,
"Ne oluyor?") `Atlas-Kitap.dc.html`'den gelir ve **birebir korunur**; yeni yazılan her şey onun etrafına örülür.

## 1. Ton ve dil kuralları (kaynaktaki redaksiyon kararları, ilerleme.md)

- Okura **"sen"** diye hitap edilir ("kendini sisli bir vadide düşün", "kendin gör"). "Siz" yok.
- Basit akışta cümle **en fazla 30 kelime**. Bir cümle bir fikir. Kısa paragraflar (2–5 cümle).
- Jargon ilk geçtiği yerde Türkçe karşılığıyla verilir: "kayıp (loss)", "öğrenme oranı (learning rate)". Sonra Türkçesi kullanılır.
- **Uzun tire (—) kullanılmaz.** Ayraç için virgül, noktalı virgül, iki nokta ya da yeni cümle.
- Yasak kalıplar: "şaşırtıcı", "kritik", "Bu bölümde/modülde ... göreceğiz", "Kulağa tuhaf gelebilir", "unutmayın ki",
  "özetle", "sonuç olarak" ile başlayan paragraf, "devrim niteliğinde", "oyunun kurallarını değiştiren".
- Ekrana özgü fiiller basılı metinde yok: "tıkla", "sürükle", "butona bas", "aşağıdaki demoda", "izle", "kaydıracı".
  Bunların yerine "aşağıdaki şekilde", "tabloya bak", "kendin hesapla", "Şekil 3.5'te".
- Basit paragraflarda kaynakta geçen "Aşağıda topu adım adım indir" gibi ekran cümleleri **çıkarılmaz**; onun yerine
  hemen ardından gelen Şekil bloğu bu cümleyi kâğıtta karşılar. Yalnız açıkça anlamsız kalanlar (ör. "Kaydıracı sağa sürükle")
  en az müdahaleyle uyarlanır: "Kaydıracı sağa sürükle" → "Şekil 5.6'daki kareleri soldan sağa izle". Bu tür her uyarlama
  dosya sonundaki `<!-- REDAKSİYON NOTLARI -->` bloğuna satır olarak yazılır ki yazar görsün.
- Sayılar (R095 kararı, 2026-10-01): ondalık ayırıcı düzyazıda, tabloda ve formülde nokta ("0.55", "yüzde 0.4"); virgüllü ondalık yok.
  Binlik ayırıcı yalnız M01 tablosunda nokta ("2.300"); başka hiçbir yerde binlik ayırıcı kullanılmaz ("1200 sayfa"). Oran farkı "yüzde puan"la
  yazılır ("80 yüzde puan"), "yüzde 80" değil. Küçük sayılar düzyazıda Türkçe yazım ("yüzde 40", "iki katına"). Kod sabitleri ve formül değişkenleri
  mekanik olarak değiştirilmez.
- Yabancı terim ilk geçişte Türkçe karşılığının ardından parantez içinde verilir ("yanlılık (bias)", "vektör gösterimi (embedding)"); sonra yalnız Türkçesi.
  Aynı sözcüğün farklı kavramları ayrı karşılık alır: nöron için "sabit terim (bias)", toplumsal bağlam için "yanlılık (bias)".
- Şekil ve karşılaştırma başlıklarında "vs" yok; "ile" ya da "karşı" kullanılır ("Hedef ile niyet", "Üretici ile ayırt edici"). Kaynak metinden gelen
  "vs"li demo başlıkları (Şekil 2.3, 2.6, 4.6) bu kurala göre uyarlanır ve REDAKSİYON NOTLARI'na yazılır.
- Formüller kaynaktaki Unicode biçimiyle kalır: θ ← θ − η·∇L(θ). LaTeX yok.
- Teknik metinde kaynaktaki terimler ve formüller olduğu gibi kalır; yalnız yeni eklenen cümleler doğal akar.

## 2. Bölüm dosyası biçimi (nihai)

```markdown
# Bölüm 3
## Makineler Nasıl Öğrenir
*Kuraldan örüntüye*

<!-- acc #1d6149 · tag İstatistiksel YZ -->

### 3.1 Giriş: kuraldan örüntüye          ← "N.k " + h2 (kaynaktaki h2 aynen)

(basit paragraflar, aynen)

> **Kenar notu.** (tip aynen)

**Şekil 3.1 · Özellikleri ve etiketi gör**           ← demo başlığı aynen
![Şekil 3.1](../../figures/out/tr/sekil-3-1-spam.svg)

*Kurulum.* 2–4 cümle: okur şekilde ne görüyor. Kaynaktaki `hint` tohumdur ama ekran fiilleri temizlenir.

*Adım adım.* Etkileşimin kâğıtta yürütülmüş hâli. Numaralı liste ya da Markdown tablo. **Gerçek sayılar**,
gerçek örnekler: demonun verisi (`book.json`, dosyadaki "Demo verisi" bloğu) ve "Demoya gömülü metinler" listesi
buraya erir. Süreç demolarında (film şeridi) her kare bir madde. Sonuç/verdict cümleleri de burada.

*Ne oluyor?* (neOluyorBasit aynen)

*Kendin dene.* 1–3 kalem-kâğıt sorusu, kaynak veriyle çözülebilir. Sonunda: `Canlı demo: [QR 3.1]`.
Cevaplar bu dosyaya değil, `print/src/tr/cevaplar/M03.md` dosyasına yazılır.

#### Teknik derinlik
(teknik paragraflar aynen)

(demonun teknik "Ne oluyor?" metni aynen; varsa formül/tablo eklenir; en fazla 1 sayfa ≈ 350 kelime)

(1–2 cümlelik geçiş; bir sonraki bölümün sorusunu açar. Ayrı başlık yok, düz paragraf.)

### 3.2 …

### 3.8 Kendini test et
1. soru
   a) … b) … c) … d) …          ← export'un ürettiği karışık sıra AYNEN korunur

### Bu bölümden kalanlar
- 5–7 madde, her biri tek cümle, bölümün sırasıyla.

<!-- REDAKSİYON NOTLARI
- 3.6 basit: "Öğrenme oranını yükselt ve kendin gör" → "Şekil 3.5'in sağ panelinde ne olduğuna bak"
-->
```

Kurallar:
- Bölüm numarası `N` = modül numarası (01 → 1). Alt bölüm `N.k`, k = kaynaktaki sıra (quiz dahil). Şekil `N.j`, j = o bölümdeki demo sırası (export'un verdiği numara).
- Demo olmayan bölümde Şekil bloğu yoktur. Kenar notu her zaman basit paragraflarından sonra, Şekil bloğundan önce.
- Teknik derinlik her zaman Şekil bloğundan sonra, geçiş cümlesinden önce. Teknik bloğu Basit'in tanıtmadığı bir kavramı ilk kez tanıtmaz.
- Export'un çalışma notları (`` `id: …` ``, "canlı demo: <url>", `<details>` blokları, "Demoya gömülü metinler" listeleri,
  `[YAZILACAK]` işaretleri, "### Basit / ### Teknik ▸" başlıkları) nihai dosyada **kalmaz**; içerikleri kullanılıp silinir.
- Şekil dosya adı: `sekil-N-j-<demo type>.svg` (henüz üretilmemiş olsa da yol yazılır).
- "Kendini sına" tipi demolar (classify ×3, df, reg, tur, responsibility): Adım adım yerine soru listesi verilir;
  ipuçları ve gerekçeler `cevaplar/M0N.md`'ye yazılır. Metinde "cevaplar kitabın sonunda" denir.
- Ölçü: her Şekil bloğu toplam 250–400 kelime yeni metin (Kurulum + Adım adım + Kendin dene). Şişirme yok.

## 3. cevaplar/M0N.md biçimi

```markdown
# Bölüm N cevapları

## Şekil N.j · başlık
**Kendin dene.** 1) … 2) …
**Kendini sına.** (yalnız sınama demolarında) madde → doğru cevap: kısa gerekçe
```

Quiz cevapları buraya yazılmaz; `cevap-anahtari.md` otomatik üretilir.

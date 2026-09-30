// Bölüm 4 figür etiketleri ve verileri (iki dil). TR: gen/M04.mjs'deki eski sabitlerin birebir aynısı.
// EN: Atlas-Kitap-EN.dc.html renderVals() neuron/ffnet/backprop/conv/rnn/gan dalları + şablon etiketleri; ekranda olmayan
// figür-özel etiketler (durak, harita, uyuşan, lejant, .md başlıkları) burada İngilizceleştirildi.
export default {
  tr: {
    neuron: {
      inputs: 'GİRDİLER', sum: 'TOPLAM', activation: 'AKTİVASYON', output: 'ÇIKTI',
      sumBox: 'Σ + b', phi: 'φ', actFns: 'sigmoid · ReLU',
      verdict: { fired: 'Nöron ateşledi!', quiet: 'sessiz' },
      weightedSum: 'Ağırlıklı toplam',
      arrow: { fired: '→ ateşler', quiet: '→ sessiz' },
      mdTitle: 'Hesap', mdHead: '| x₁ | x₂ | x₃ | Ağırlıklı toplam | Sigmoid | ReLU | Durum |',
      mdState: { fired: 'ateşler', quiet: 'sessiz' },
    },
    ffnet: {
      input: (ins) => `GİRDİ [${ins}]`, hidden: (j) => `G${j}`, out: (k) => `Ç${k}`,
      layers: ['Girdi', 'Gizli', 'Çıktı'], prediction: (k) => `tahmin: Ç${k}`,
      mdTitle: 'Aktivasyonlar', mdRows1: 'W⁽¹⁾ satırları: ', mdRows2: 'W⁽²⁾ satırları: ',
      mdHead: '| Girdi | G1 | G2 | G3 | G4 | Ç1 | Ç2 | Tahmin |',
    },
    backprop: {
      round: (r) => `TUR ${r}`, error: (e) => `hata ${e}`, errorArrow: 'hata ◄', output: 'çıktı', target: 'hedef',
      mdTitle: 'Adım tablosu', mdRule: 'hata(r) = 0.43 · 0.6ʳ, çıktı = 0.80 − hata',
      mdHead: '| Tur | Hata | Çıktı | Hedefe uzaklık |', points: (n) => `${n} puan`,
    },
    conv: {
      kernels: { vert: 'DİKEY KENAR ÇEKİRDEĞİ', horiz: 'YATAY KENAR ÇEKİRDEĞİ' },
      kernel: 'çekirdek', image: 'görüntü 7×7', map: 'harita', stop: (n, v) => `durak ${n}: ${v}`, fullMap: 'harita 5×5, 25 durak',
      legendPlus: 'artı (koyudan açığa)', legendMinus: 'eksi (açıktan koyuya)', legendMag: 'koyuluk = büyüklük',
      mdTitle: 'Özellik haritaları', mdNote: 'Görüntü: 7×7 artı (4. satır ve 4. sütun = 1). Dolgu yok, adım 1 → 5×5 harita.',
    },
    rnn: {
      words: ['yapay', 'zekâ', 'öğreniyor'],
      frame: (n) => `KARE ${n}`, processed: (n) => `${n} kelime işlendi`, memory: 'hafıza',
      mdTitle: 'Gizli durum (%)', mdHead: '| Kelime | h₁ | h₂ | h₃ | h₄ | h₅ | h₆ | h₇ | h₈ |', empty: '(boş)',
      mdNote: '> Gösterim: çubuklar yalnız adım sayısına bağlı sabit bir kuralla üretilir (kelimeye bağlı değil).',
    },
    gan: {
      target: 'HEDEF (GERÇEK GÖRÜNTÜ)',
      intro: ['Ortada dolu daire; 64 pikselin 24’ü koyu.',
        'Her karede: üreticinin çıktısı, ayırt edicinin sahte olasılığı ve hükmü.',
        'Sahte olasılığı %50’nin üstü “Sahte!”, altı “Gerçek?”.'],
      round: (r) => `TUR ${r}`, generator: 'üretici', fakeProb: 'sahte olasılığı',
      verdict: { fake: 'Sahte!', real: 'Gerçek?' }, matching: (n) => `${n}/64 uyuşan`,
      mdTitle: 'Turlar',
      mdRule: 'p(r) = max(6, 95 − 11·r) %, piksel: rand(i) < r/8 ise hedef, değilse gürültü (tohum sin(i·12.9898+78.233)·43758.5453)',
      mdHead: '| Tur | Sahte olasılığı | Hüküm | Uyuşan piksel |',
    },
  },
  en: {
    neuron: {
      inputs: 'INPUTS', sum: 'SUM', activation: 'ACTIVATION', output: 'OUTPUT',
      sumBox: 'Σ + b', phi: 'φ', actFns: 'sigmoid · ReLU',
      verdict: { fired: 'The neuron fired!', quiet: 'quiet' },
      weightedSum: 'Weighted sum',
      arrow: { fired: '→ fires', quiet: '→ quiet' },
      mdTitle: 'Calculation', mdHead: '| x₁ | x₂ | x₃ | Weighted sum | Sigmoid | ReLU | State |',
      mdState: { fired: 'fires', quiet: 'quiet' },
    },
    ffnet: {
      input: (ins) => `INPUT [${ins}]`, hidden: (j) => `H${j}`, out: (k) => `O${k}`,
      layers: ['Input', 'Hidden', 'Output'], prediction: (k) => `prediction: O${k}`,
      mdTitle: 'Activations', mdRows1: 'W⁽¹⁾ rows: ', mdRows2: 'W⁽²⁾ rows: ',
      mdHead: '| Input | H1 | H2 | H3 | H4 | O1 | O2 | Prediction |',
    },
    backprop: {
      round: (r) => `ROUND ${r}`, error: (e) => `error ${e}`, errorArrow: 'error ◄', output: 'output', target: 'target',
      mdTitle: 'Step table', mdRule: 'error(r) = 0.43 · 0.6ʳ, output = 0.80 − error',
      mdHead: '| Round | Error | Output | Distance to target |', points: (n) => `${n} ${n === 1 ? 'point' : 'points'}`,
    },
    conv: {
      kernels: { vert: 'VERTICAL EDGE KERNEL', horiz: 'HORIZONTAL EDGE KERNEL' },
      kernel: 'kernel', image: 'image 7×7', map: 'map', stop: (n, v) => `stop ${n}: ${v}`, fullMap: 'map 5×5, 25 stops',
      legendPlus: 'plus (dark to light)', legendMinus: 'minus (light to dark)', legendMag: 'darkness = magnitude',
      mdTitle: 'Feature maps', mdNote: 'Image: 7×7 plus sign (4th row and 4th column = 1). No padding, stride 1 → 5×5 map.',
    },
    rnn: {
      words: ['machines', 'are', 'learning'],
      frame: (n) => `FRAME ${n}`, processed: (n) => `${n} ${n === 1 ? 'word' : 'words'} processed`, memory: 'memory',
      mdTitle: 'Hidden state (%)', mdHead: '| Word | h₁ | h₂ | h₃ | h₄ | h₅ | h₆ | h₇ | h₈ |', empty: '(empty)',
      mdNote: '> Illustration: the bars follow a fixed rule that depends only on the step count (not on the word).',
    },
    gan: {
      target: 'TARGET (REAL IMAGE)',
      intro: ['A filled circle in the middle; 24 of the 64 pixels are dark.',
        'Per frame: generator output, discriminator’s fake probability, verdict.',
        'Fake probability above 50% means “Fake!”, below means “Real?”.'],
      round: (r) => `ROUND ${r}`, generator: 'generator', fakeProb: 'fake prob.',
      verdict: { fake: 'Fake!', real: 'Real?' }, matching: (n) => `${n}/64 matching`,
      mdTitle: 'Rounds',
      mdRule: 'p(r) = max(6, 95 − 11·r) %, pixel: target if rand(i) < r/8, otherwise noise (seed sin(i·12.9898+78.233)·43758.5453)',
      mdHead: '| Round | Fake probability | Verdict | Matching pixels |',
    },
  },
};

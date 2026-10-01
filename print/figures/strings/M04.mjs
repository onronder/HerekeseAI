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
      round: (r) => `TUR ${r}`, loss: (l) => `kayıp L ${l}`, errorArrow: 'hata ◄', output: 'çıktı ŷ', target: 'hedef y',
      footer: (x, y, lr) => [`girdi x = [${x}] · hedef y = ${y} · η = ${lr} · L = ½(y − ŷ)²`, 'gerçek gradyan güncellemesi: ağırlıklar her tur değişir (2 → 2 → 1 ağ)'],
      mdTitle: 'Adım tablosu',
      mdRule: (x, y, lr) => `Gerçek eğitim turları (print/kitap/qa/demo-data.json bp43): girdi x = [${x}], hedef y = ${y}, η = ${lr}; ağ 2 → 2 (sigmoid) → 1 (sigmoid); L = ½(y − ŷ)²; her tur ağırlıklar gradyanla güncellenir.`,
      mdHead: '| Tur | Çıktı ŷ | Hata y − ŷ | Kayıp L |',
      mdNote: '> Şekilde ŷ iki, L dört ondalıkla gösterilir; tam değerler demo-data.json içindedir. Eski 0.43·0.6ʳ kuralı kullanılmaz (R027).',
    },
    conv: {
      kernels: { vert: 'DİKEY KENAR ÇEKİRDEĞİ', horiz: 'YATAY KENAR ÇEKİRDEĞİ' },
      kernel: 'çekirdek', image: 'görüntü 7×7', map: 'harita', stop: (n, v) => `durak ${n}: ${v}`, fullMap: 'harita 5×5, 25 durak',
      legendPlus: 'artı (koyudan açığa)', legendMinus: 'eksi (açıktan koyuya)', legendMag: 'koyuluk = büyüklük',
      mdTitle: 'Özellik haritaları', mdNote: 'Görüntü: 7×7 artı (4. satır ve 4. sütun = 1). Dolgu yok, adım 1 → 5×5 harita.',
    },
    rnn: {
      // kelimeler ve h değerleri demo-data.json rnn45.tr içinden gelir (R031)
      frame: (n) => `KARE ${n}`, processed: (n) => `${n} kelime işlendi`, memory: 'hafıza h',
      legend: 'çubuk boyu = |h| · koyu çubuk = eksi değer · etiket işaretli değer · h₀ = 0',
      formula: 'hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁) · 4 gizli birim · sabit küçük ağırlıklar',
      mdTitle: 'Gizli durum', mdHead: '| Kare | Kelime | h₁ | h₂ | h₃ | h₄ |', empty: '(boş)',
      mdNote: '> Değerler gerçek yineleme formülünden (tanh) hesaplanır; kare 0 boş başlangıç h₀ = 0. Ağırlıklar print/kitap/qa/demo-data.json rnn45 içinde.',
    },
    gan: {
      target: 'HEDEF (GERÇEK GÖRÜNTÜ)',
      intro: ['Ortada dolu daire; 64 pikselin 24’ü koyu.',
        'Her karede: üretici çıktısı, P(sahte) (sahtelik olasılığı) ve hüküm.',
        'Sahte olasılığı %50’nin üstü “Sahte!”, altı “Gerçek?”.'],
      round: (r) => `TUR ${r}`, generator: 'üretici', fakeProb: 'P(sahte)', // R073: uzun etiket sağ sütunda kesiliyordu
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
      round: (r) => `ROUND ${r}`, loss: (l) => `loss L ${l}`, errorArrow: 'error ◄', output: 'output ŷ', target: 'target y',
      footer: (x, y, lr) => [`input x = [${x}] · target y = ${y} · η = ${lr} · L = ½(y − ŷ)²`, 'real gradient updates: the weights change every round (2 → 2 → 1 network)'],
      mdTitle: 'Step table',
      mdRule: (x, y, lr) => `Real training rounds (print/kitap/qa/demo-data.json bp43): input x = [${x}], target y = ${y}, η = ${lr}; network 2 → 2 (sigmoid) → 1 (sigmoid); L = ½(y − ŷ)²; weights are updated by the gradient every round.`,
      mdHead: '| Round | Output ŷ | Error y − ŷ | Loss L |',
      mdNote: '> The figure shows ŷ with two and L with four decimals; full values are in demo-data.json. The old 0.43·0.6ʳ rule is no longer used (R027).',
    },
    conv: {
      kernels: { vert: 'VERTICAL EDGE KERNEL', horiz: 'HORIZONTAL EDGE KERNEL' },
      kernel: 'kernel', image: 'image 7×7', map: 'map', stop: (n, v) => `stop ${n}: ${v}`, fullMap: 'map 5×5, 25 stops',
      legendPlus: 'plus (dark to light)', legendMinus: 'minus (light to dark)', legendMag: 'darkness = magnitude',
      mdTitle: 'Feature maps', mdNote: 'Image: 7×7 plus sign (4th row and 4th column = 1). No padding, stride 1 → 5×5 map.',
    },
    rnn: {
      frame: (n) => `FRAME ${n}`, processed: (n) => `${n} ${n === 1 ? 'word' : 'words'} processed`, memory: 'memory h',
      legend: 'bar length = |h| · dark bar = negative value · label = signed value · h₀ = 0',
      formula: 'hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁) · 4 hidden units · fixed small weights',
      mdTitle: 'Hidden state', mdHead: '| Frame | Word | h₁ | h₂ | h₃ | h₄ |', empty: '(empty)',
      mdNote: '> Values come from the actual recurrence (tanh); frame 0 is the empty start h₀ = 0. Weights are in print/kitap/qa/demo-data.json rnn45.',
    },
    gan: {
      target: 'TARGET (REAL IMAGE)',
      intro: ['A filled circle in the middle; 24 of the 64 pixels are dark.',
        'Per frame: generator output, P(fake) (the fake probability), verdict.',
        'Fake probability above 50% means “Fake!”, below means “Real?”.'],
      round: (r) => `ROUND ${r}`, generator: 'generator', fakeProb: 'P(fake)',
      verdict: { fake: 'Fake!', real: 'Real?' }, matching: (n) => `${n}/64 match`,
      mdTitle: 'Rounds',
      mdRule: 'p(r) = max(6, 95 − 11·r) %, pixel: target if rand(i) < r/8, otherwise noise (seed sin(i·12.9898+78.233)·43758.5453)',
      mdHead: '| Round | Fake probability | Verdict | Matching pixels |',
    },
  },
};

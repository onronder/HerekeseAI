// Bölüm 3 figür etiketleri (tr birebir mevcut çıktı; en: Atlas-Kitap-EN.dc.html renderVals + print/src/en/book.json).
// Veri (e-postalar, özellik adları, hüküm satırları) book.json'dan gelir; burada yalnız figür-özel etiketler var.
export default {
  tr: {
    common: { table: 'Adım tablosu' },
    classify: { itemOverride: {} }, // Şekil 3.2: TR book.json görev metinleri bölüm dosyasıyla aynı
    spam: {
      groupIn: 'ÖZELLİKLER (GİRDİ)', groupOut: 'ETİKET (ÇIKTI)', email: 'E-posta', label: 'Etiket',
      spamValue: 'Spam', // book.json içindeki etiket değeri (vurgu rengi için karşılaştırma)
      cueOn: 'ipucu var', cueOff: 'ipucu yok',
      featureOverride: { 1: 'link veya şifre isteği' }, // R017: tek tanım (book.json: "link / şifre isteği")
    },
    scatter: {
      reg: 'Regresyon (sayı)', cls: 'Sınıflandırma (kategori)', raw: 'ham veri', bestLine: 'en iyi doğru', boundary: 'sınır',
      groupA: 'koyu grup', groupB: 'turuncu grup',
      md: {
        regHead: '| # | x | y | doğru | fark |',
        stats: (f) => `x̄ = ${f.mx}, ȳ = ${f.my}, pay = ${f.num}, payda = ${f.den}, m = ${f.m}, b = ${f.b}; hata kareleri toplamı = ${f.sse}`,
        clsHead: '| grup (ekran rengi) | baskı | noktalar |',
        rowA: 'yeşil | koyu (INK)', rowB: 'turuncu | vurgu (EMBER)',
        boundary: 'Sınır: (1, 5.5)–(8.5, 1) → y = 6.1 − 0.6x.',
      },
    },
    kmeans: {
      before: 'önce: etiketsiz noktalar', after: 'sonra: en yakın merkeze atama',
      clusterA: 'A kümesi', clusterB: 'B kümesi', outlier: 'aykırı', centroid: '✕ küme merkezi',
      md: {
        centers: (a, b) => `Merkezler: A = (${a}), B = (${b}). Aykırı nokta demoda sabit indeksle (11. nokta) işaretlenir.`,
        head: '| # | Nokta | A’ya uzaklık | B’ye uzaklık | Küme |',
      },
    },
    descent: {
      min: 'en düşük nokta', loss: 'kayıp', low: 'düşük öğrenme oranı', high: 'yüksek öğrenme oranı',
      step: 'adım', x: 'x', gradient: 'eğim',
      note: '> Web demosundaki "yüksek" η = 0.92 aşım yapmaz; basılı figür metindeki salınımı göstermek için η = 4.6 kullanır.',
    },
    modelfit: {
      labelOverride: { good: 'Daha düzgün\ntemsili eğri' }, // R024: "İyi (dengeli)" → temsili eğri (veriden eğitilmemiş)
      verdictOverride: { good: 'Temsili eğri: az ve aşırı uyum arasındaki dengeyi kavramsal olarak gösterir; veriden eğitilmedi, doğrulama hatası ölçülmedi.' },
      md: {
        head: '| x | y | eksik (3.1 − 0.18x) | daha düzgün temsili eğri (3.0 − 0.16x + 0.15·sin 0.6x) | aşırı |',
        sse: (u, g) => `Hata kareleri toplamı: eksik ${u}, daha düzgün temsili eğri ${g}, aşırı 0.`,
        note: '> Eğriler az ve aşırı uyumu kavramsal olarak gösterir; ortadaki eğri veriden eğitilmemiş, temsili bir eğridir (R024).',
      },
    },
  },
  en: {
    common: { table: 'Step table' },
    classify: { itemOverride: { 4: 'Learning to achieve a high score by playing a game' } }, // R065: book.json "Learning a high score …"
    spam: {
      groupIn: 'FEATURES (INPUT)', groupOut: 'LABEL (OUTPUT)', email: 'Email', label: 'Label',
      spamValue: 'Spam',
      cueOn: 'has cue', cueOff: 'no cue',
      featureOverride: { 1: 'link or password request' }, // R017
    },
    scatter: {
      reg: 'Regression (number)', cls: 'Classification (category)', raw: 'raw data', bestLine: 'best line', boundary: 'boundary',
      groupA: 'dark group', groupB: 'orange group',
      md: {
        regHead: '| # | x | y | line | residual |',
        stats: (f) => `x̄ = ${f.mx}, ȳ = ${f.my}, numerator = ${f.num}, denominator = ${f.den}, m = ${f.m}, b = ${f.b}; sum of squared errors = ${f.sse}`,
        clsHead: '| group (screen color) | print | points |',
        rowA: 'green | dark (INK)', rowB: 'orange | accent (EMBER)',
        boundary: 'Boundary: (1, 5.5)–(8.5, 1) → y = 6.1 − 0.6x.',
      },
    },
    kmeans: {
      before: 'before: unlabeled points', after: 'after: nearest-center groups',
      clusterA: 'cluster A', clusterB: 'cluster B', outlier: 'outlier', centroid: '✕ cluster center',
      md: {
        centers: (a, b) => `Centers: A = (${a}), B = (${b}). The demo flags the outlier by a fixed index (point 11).`,
        head: '| # | Point | Distance to A | Distance to B | Cluster |',
      },
    },
    descent: {
      min: 'minimum', loss: 'loss', low: 'low learning rate', high: 'high learning rate',
      step: 'step', x: 'x', gradient: 'slope',
      note: '> The web demo’s "high" η = 0.92 does not overshoot; the printed figure uses η = 4.6 to show the oscillation described in the text.',
    },
    modelfit: {
      labelOverride: { good: 'Smoother\nillustrative curve' }, // R024
      verdictOverride: { good: 'Illustrative curve: shows the balance between under- and overfitting conceptually; not fitted to the data, no validation error measured.' },
      md: {
        head: '| x | y | underfit (3.1 − 0.18x) | smoother illustrative curve (3.0 − 0.16x + 0.15·sin 0.6x) | overfit |',
        sse: (u, g) => `Sum of squared errors: underfit ${u}, smoother illustrative curve ${g}, overfit 0.`,
        note: '> The curves illustrate underfitting and overfitting conceptually; the middle curve is not fitted to the data, it is illustrative (R024).',
      },
    },
  },
};

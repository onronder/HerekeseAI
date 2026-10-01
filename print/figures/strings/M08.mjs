// Bölüm 8 figür etiketleri ve veri dizileri (tr / en).
// TR: gen/M08.mjs içindeki eski sabitlerin birebir aynısı. EN: Atlas-Kitap-EN.dc.html renderVals() (tur, chineseroom,
// capability, singularity, responsibility) ve print/src/en/book.json `embedded`; ekranda olmayan figür etiketleri burada İngilizceleştirildi.
// Çince Oda glifleri dile bağlı değil: gen/M08.mjs içinde (CR_PAIRS).
export default {
  tr: {
    tur: {
      chats: [
        { prompt: '“En sevdiğin yemek ne?”', reply: 'Bir yapay zekâ olarak yemek yiyemem, dolayısıyla bir favorim yok. Ancak istersen popüler yemekler hakkında bilgi verebilirim.' },
        { prompt: '“Bu sabah trafiğe takıldın mı?”', reply: 'Sorma ya, köprüde tam 40 dakika kaldım, kahvem de soğudu :( en azından güzel bir podcast vardı.' },
        { prompt: '“17 × 24 kaç eder?”', reply: '408.' },
        { prompt: '“Hafta sonu ne yaptın?”', reply: 'Annemlere gittik, çok yedik, dönüşte de yağmura yakalandık. Klasik yani 😅' },
      ],
      exchange: (n) => `YAZIŞMA ${n}`,
      human: 'insan',
      machine: 'makine',
      mdTitle: (title) => `# ${title} — yazışmalar (cevaplar kitabın sonunda)`,
      mdHead: ['| # | Soru | Cevap |', '|---|---|---|'],
    },
    chineseroom: {
      // CR_PAIRS ile aynı sırada: gelen notun ve cevabın anlamı (figürde yok, yalnız .md)
      meanings: [
        { in: 'Nasılsın?', out: 'İyiyim, teşekkürler!' },
        { in: 'Adın ne?', out: 'Adım Küçük Yardımcı.' },
        { in: 'Saat kaç?', out: 'Saat öğleden sonra üç.' },
      ],
      incoming: 'GELEN NOT',
      room: 'ODA',
      outgoing: 'ÇIKAN CEVAP',
      rulebook: 'kural kitabı',
      you: 'sen: Çince bilmiyorsun',
      mdTitle: (title) => `# ${title} — kural kitabı`,
      mdHead: ['| # | Gelen not | Kural | Verilen cevap | Anlamı (figürde yok) |', '|---|---|---|---|---|'],
    },
    capability: {
      tiers: {
        narrow: { name: 'Dar YZ', status: 'Bugün var ✓', desc: 'Bir görevde ya da belirli bir görev kümesinde çok iyi (satranç, çeviri, görüntü tanıma); insan düzeyinde genel öğrenme ve aktarım göstermez. Bugünkü sistemler buradadır.' }, // R069
        agi: { name: 'Genel YZ (AGI)', status: 'Henüz yok; tartışmalı', desc: 'İnsan gibi her alanda öğrenip uyum sağlayabilen, varsayımsal bir düzey. Gelip gelmeyeceği ve ne zaman geleceği uzmanlar arasında tartışmalıdır.' },
        super: { name: 'Süper Zekâ', status: 'Spekülatif', desc: 'Her bilişsel alanda insanı kat kat aşan, tümüyle kuramsal bir düzey. Hem büyük fırsat hem ciddi risk senaryolarının konusudur.' },
      },
      axis: 'yetenek alanı →',
      barNote: 'çubuklar temsili düzey: sıralama, ölçüm değil', // R069
      mdTitle: (title) => `# ${title}`,
      mdHead: ['| Basamak | Bugün | Çubuk (temsili) | Tanım |', '|---|---|---|---|'],
      mdNote: '> Çubuk yüzdeleri (30/70/100) kaynak koddan; temsili düzey, yalnız sıralama, ölçüm değil.',
    },
    singularity: {
      curves: { accel: 'Hızlanan', plateau: 'Yavaşlayan', uncertain: 'Belirsiz' },
      yAxis: 'zekâ (0–10, birimsiz)',
      xAxis: 'zaman (0–10, birimsiz) →',
      mdTitle: (title) => `# ${title} — beş zaman noktası (0–10)`,
      mdTime: 'Zaman',
    },
    responsibility: {
      scenarios: [
        'Sürücüsüz bir araç, üreticinin yazılım hatası yüzünden kaza yapar.',
        'Bir kurum, YZ tavsiyesini kör biçimde uygulayıp müşteriye zarar verir.',
        'Bir kullanıcı, birini aldatmak ya da zarara uğratmak için bir YZ aracıyla sahte kanıt üretir.', // R062
      ],
      // her taraf iki satır (sütun başlığı)
      parties: [['Üretici /', 'geliştirici'], ['İşleten', 'kurum'], ['Son', 'kullanıcı'], ['YZ’nin', 'kendisi']],
      scenario: 'SENARYO',
      who: 'İLK İNCELENECEK TARAF', // R062
      shared: 'sorumluluk çoğu olayda paylaşılır · yaygın görüş kitabın sonunda',
      mdTitle: (title) => `# ${title} — senaryolar (ilk incelenecek taraf; yaygın görüş kitabın sonunda)`,
      mdHead: ['| # | Senaryo |', '|---|---|'],
      mdParties: 'Taraflar: ',
    },
  },
  en: {
    tur: {
      chats: [
        { prompt: '“What’s your favorite food?”', reply: 'As an AI I cannot eat, so I don’t have a favorite. However, I can share information about popular dishes if you’d like.' },
        { prompt: '“Did you hit traffic this morning?”', reply: 'Don’t ask; stuck on the bridge a full 40 minutes, and my coffee went cold :( at least the podcast was good.' },
        { prompt: '“What’s 17 × 24?”', reply: '408.' },
        { prompt: '“What did you do this weekend?”', reply: 'Visited my folks, ate far too much, got caught in the rain on the way back. Classic 😅' },
      ],
      exchange: (n) => `EXCHANGE ${n}`,
      human: 'human',
      machine: 'machine',
      mdTitle: (title) => `# ${title} — exchanges (answers at the end of the book)`,
      mdHead: ['| # | Prompt | Reply |', '|---|---|---|'],
    },
    chineseroom: {
      meanings: [
        { in: 'How are you?', out: 'I’m fine, thanks!' },
        { in: 'What’s your name?', out: 'My name is Little Helper.' },
        { in: 'What time is it?', out: 'It’s three in the afternoon.' },
      ],
      incoming: 'INCOMING NOTE',
      room: 'ROOM',
      outgoing: 'REPLY OUT',
      rulebook: 'rule book',
      you: 'you: know no Chinese',
      mdTitle: (title) => `# ${title} — rule book`,
      mdHead: ['| # | Incoming note | Rule | Reply given | Meaning (not in figure) |', '|---|---|---|---|---|'],
    },
    capability: {
      tiers: {
        narrow: { name: 'Narrow AI', status: 'Exists today ✓', desc: 'Very good at one task or a set of tasks (chess, translation, vision); shows no human-level general learning and transfer. Today’s systems live here.' }, // R069
        agi: { name: 'General AI (AGI)', status: 'Not yet; contested', desc: 'A hypothetical level able to learn and adapt across every domain like a human. Whether and when it arrives is debated among experts.' },
        super: { name: 'Superintelligence', status: 'Speculative', desc: 'A wholly theoretical level surpassing humans many times over in every cognitive field. The subject of both great-opportunity and serious-risk scenarios.' },
      },
      axis: 'capability range →',
      barNote: 'bars are illustrative levels: ordering, not a measurement', // R069
      mdTitle: (title) => `# ${title}`,
      mdHead: ['| Rung | Today | Bar (illustrative) | Definition |', '|---|---|---|---|'],
      mdNote: '> Bar percentages (30/70/100) are from the source code; illustrative levels, ordering only, not a measurement.',
    },
    singularity: {
      curves: { accel: 'Accelerating', plateau: 'Plateauing', uncertain: 'Uncertain' },
      yAxis: 'intelligence (0–10, unitless)',
      xAxis: 'time (0–10, unitless) →',
      mdTitle: (title) => `# ${title} — five time points (0–10)`,
      mdTime: 'Time',
    },
    responsibility: {
      scenarios: [
        'A self-driving car crashes because of the maker’s software bug.',
        'An organization blindly applies an AI’s advice and harms a customer.',
        'A user creates fabricated evidence with an AI tool to deceive or harm someone.', // R062
      ],
      parties: [['Maker /', 'developer'], ['Operating', 'organization'], ['End', 'user'], ['The AI', 'itself']],
      scenario: 'SCENARIO',
      who: 'PARTY TO EXAMINE FIRST', // R062
      shared: 'responsibility is usually shared · prevailing view at the end of the book',
      mdTitle: (title) => `# ${title} — scenarios (party to examine first; prevailing view at the end of the book)`,
      mdHead: ['| # | Scenario |', '|---|---|'],
      mdParties: 'Parties: ',
    },
  },
};

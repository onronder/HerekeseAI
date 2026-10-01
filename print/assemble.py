#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
El yazması birleştirici — print/src/tr/ altındaki parçalardan tek kitap üretir.

  print/kitap/Herkes-Icin-Yapay-Zeka-TR.md    tek parça Markdown (redaksiyon için)
  print/kitap/Herkes-Icin-Yapay-Zeka-TR.html  aynı içerik, kitap sayfası görünümlü HTML (tarayıcıdan PDF alınabilir)

Sıra: ön bölümler (on/*.md) → İçindekiler (otomatik) → Bölüm 1–8 (M0x-*.md) → arka bölümler:
Cevap Anahtarı (cevap-anahtari.md + cevaplar/M0x.md), Sözlük (arka/sozluk.md), Kaynakça (arka/kaynakca.md),
Canlı Demolar (book.json'dan otomatik), Dizin notu.

Kullanım: python3 print/assemble.py [--lang tr|en]   (EN çıktısı print/kitap/en/AI-for-Everyone-EN.*)
"""
import ast
import glob
import html
import json
import os
import re
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def tr_lower(s):
    return s.replace('İ', 'i').replace('I', 'ı').lower()


TR_ORDER = 'aâbcçdefgğhıiîjklmnoöprsştuüûvyz'


def tr_key(s):
    # boşluk ve ayraçlar tüm harflerden önce gelir: "Ön eğitim" < "Önyargı" (sözlük sırası, R076)
    return [-1 if c in ' -–/(),' else (TR_ORDER.index(c) if c in TR_ORDER else 100 + ord(c)) for c in tr_lower(s)]


# Dil tablosu: TR çıktısı bayt bayt eskisi gibi kalır; EN aynı hattın İngilizce dosya/başlık/klasör karşılıkları.
LANGS = {
    'tr': dict(
        src='tr', slug='tr', live='https://book.onuronder.com/d/', fig_dir='tr', qr_img='../figures/out/tr/',
        fig_fix=('src="../../figures/out/tr/', 'src="../figures/out/tr/'),
        front='on', back='arka', answers='cevaplar', answer_key_file='cevap-anahtari.md',
        glossary_file='sozluk.md', biblio_file='kaynakca.md', index_terms='dizin-terimler.yaml',
        h_contents='İçindekiler', chapter='Bölüm', h_answers='Cevap Anahtarı', h_glossary='Sözlük',
        h_biblio='Kaynakça ve İleri Okuma', h_live='Canlı Demolar', h_index='Dizin',
        selftest_split='## Kendini sına demoları', quiz_hdr=('## Bölüm sonu quizleri', '## Bölüm sonu sınavları'),
        question='Soru', h_fig_answers='## Şekil alıştırmaları ve kendini sına cevapları',
        live_intro='Kitaptaki her şekil, dijital sürümde elle oynanan bir demodur. Aşağıdaki bağlantılar (ve şekillerin altındaki QR kodlar) '
                   'yalnız o demoyu açar; giriş gerekmez. Kitabın tamamı dijital sürümde: https://book.onuronder.com',
        live_cols='| Şekil | Demo | Bağlantı |', live_marker='Canlı demo',
        index_intro='Sayılar bölüm ve alt bölümü gösterir (3.6 = Bölüm 3, altıncı kesim). Sayfa numaraları dizgide eklenecektir.',
        glossary_missing='# Sözlük\n\n[Henüz yazılmadı.]\n', index_missing='# Dizin\n\n[dizin-terimler.yaml yok]\n',
        tech='Teknik derinlik', fig_word='Şekil', out_sub='', out_base='Herkes-Icin-Yapay-Zeka-TR',
        html_title='Herkes İçin Yapay Zekâ · el yazması', html_lang='tr', lower=tr_lower, key=tr_key,
        todo_rx=r'\[(?:YENİ ISBN|ay, yıl|yayınevi|matbaa|ad\]|yer, tarih|İsimler|isimler|Teşekkür metni|Henüz yazılmadı|Dizgi aşamasında)',
        todo_word=r'\[YAZILACAK', words_label='kelime', pages_label='sayfa (300 kelime/sayfa)', todo_label='açık yer tutucu',
    ),
    'en': dict(
        src='en', slug='en', live='https://book.onuronder.com/d/en/', fig_dir='en', qr_img='../../figures/out/en/',
        fig_fix=('src="../../figures/out/en/', 'src="../../figures/out/en/'),
        front='front', back='back', answers='answers', answer_key_file='answer-key.md',
        glossary_file='glossary.md', biblio_file='bibliography.md', index_terms='index-terms.yaml',
        h_contents='Contents', chapter='Chapter', h_answers='Answer Key', h_glossary='Glossary',
        h_biblio='Bibliography and Further Reading', h_live='Live Demos', h_index='Index',
        selftest_split='## Self-test demos', quiz_hdr=('## End-of-chapter quizzes', '## End-of-chapter quizzes'),
        question='Question', h_fig_answers='## Figure exercises and self-test answers',
        live_intro='Every figure in this book is a hands-on demo in the digital edition. The links below (and the QR codes under the figures) '
                   'open only that demo; no sign-in is needed. The whole book, with all its demos, is in the digital edition: https://book.onuronder.com/en',
        live_cols='| Figure | Demo | Link |', live_marker='Live demo',
        index_intro='Numbers refer to chapter and section (3.6 = Chapter 3, sixth section). Page numbers are added at typesetting.',
        glossary_missing='# Glossary\n\n[Not written yet.]\n', index_missing='# Index\n\n[index-terms.yaml missing]\n',
        tech='Technical depth', fig_word='Figure', out_sub='en', out_base='AI-for-Everyone-EN',
        html_title='AI for Everyone · manuscript', html_lang='en', lower=str.lower, key=lambda s: s.lower(),
        todo_rx=r'\[(?:ISBN|month, year|publisher|printer|name\]|place, date|names|Not written yet|To be added|index-terms)',
        todo_word=r'\[TO WRITE', words_label='words', pages_label='pages (300 words/page)', todo_label='open placeholders',
    ),
}
L = LANGS['tr']
SRC = OUT = LIVE = None
SLUGS = {}


def set_lang(lang):
    global L, SRC, OUT, LIVE, SLUGS
    L = LANGS[lang]
    SRC = os.path.join(ROOT, 'print', 'src', L['src'])
    OUT = os.path.join(ROOT, 'print', 'kitap', L['out_sub']) if L['out_sub'] else os.path.join(ROOT, 'print', 'kitap')
    LIVE = L['live']
    SLUGS = json.load(open(os.path.join(ROOT, 'qr-slugs.json'), encoding='utf-8')).get(L['slug'], {})


set_lang('tr')


def read(path):
    return open(path, encoding='utf-8').read().strip() + '\n'


def strip_comments(md):
    return re.sub(r'<!--.*?-->\n?', '', md, flags=re.S)


# ---------------------------------------------------------------- parçalar

def chapters():
    files = sorted(glob.glob(os.path.join(SRC, 'M0*-*.md')))
    return [read(f) for f in files]


def toc(chapter_mds):
    """# Bölüm N / ## Başlık / ### N.k … başlıklarından içindekiler."""
    lines = ['# ' + L['h_contents'], '']
    for md in chapter_mds:
        m = re.search(r'^# (' + L['chapter'] + r' \d+)\n+## (.+)$', md, re.M)
        if not m:
            continue
        lines.append(f'**{m.group(1)} · {m.group(2)}**')
        lines.append('')
        for s in re.findall(r'^### (\d+\.\d+ .+)$', md, re.M):
            lines.append(f'- {s}')
        lines.append('')
    lines += [f"**{L['h_answers']}**", '', f"**{L['h_glossary']}**", '', f"**{L['h_biblio']}**", '', f"**{L['h_live']}**", '', f"**{L['h_index']}**", '']
    return '\n'.join(lines) + '\n'


def answer_key():
    parts = ['# ' + L['h_answers'], '']
    quiz = strip_comments(read(os.path.join(SRC, L['answer_key_file'])))
    quiz = re.sub(r'^# .*\n', '', quiz).strip()
    # yalnız quiz bloğunu al (Kendini sına bölümü cevaplar/ dosyalarında daha eksiksiz)
    quiz = quiz.split(L['selftest_split'])[0].strip()
    quiz = quiz.replace(L['quiz_hdr'][0], L['quiz_hdr'][1])
    quiz = re.sub(r'^(\d)\.(\d+) / (\d+): ', r'\1.\2 · ' + L['question'] + r' \3: ', quiz, flags=re.M)
    parts.append(quiz)
    parts.append('')
    parts.append(L['h_fig_answers'])
    parts.append('')
    for f in sorted(glob.glob(os.path.join(SRC, L['answers'], 'M0*.md'))):
        body = strip_comments(read(f))
        body = re.sub(r'^# (.+)$', r'### \1', body, count=1, flags=re.M)
        body = re.sub(r'^## ', '#### ', body, flags=re.M)
        parts.append(body)
    return '\n'.join(parts) + '\n'


def live_demos():
    book = json.load(open(os.path.join(SRC, 'book.json'), encoding='utf-8'))
    rows = ['# ' + L['h_live'], '', L['live_intro'], '', L['live_cols'], '|---|---|---|']
    for mod in book['modules']:
        n = int(mod['n']); fig = 0
        for si, sec in enumerate(mod['sections']):
            if not sec.get('demo'):
                continue
            fig += 1
            rows.append(f"| {n}.{fig} | {sec['demo']['title']} | {LIVE}{SLUGS.get(f'{n}.{fig}', '?')} |")
    rows += ['']
    return '\n'.join(rows)


def qr_map():
    """Şekil N.j → (canlı URL, qr dosya adı). QR'lar print/qr/make_qr.mjs ile üretilir (slug: qr-slugs.json)."""
    book = json.load(open(os.path.join(SRC, 'book.json'), encoding='utf-8'))
    m = {}
    for mod in book['modules']:
        n = int(mod['n']); fig = 0
        for si, sec in enumerate(mod['sections']):
            if not sec.get('demo'):
                continue
            fig += 1
            m[(n, fig)] = (f"{LIVE}{SLUGS.get(f'{n}.{fig}', '?')}", f"qr-{n}-{fig}")
    return m


QR = None


def qr_md(md):
    """Markdown kopyası: [QR N.j] yanına URL."""
    lm = L['live_marker']
    return re.sub(lm + r': \[QR (\d+)\.(\d+)\]',
                  lambda m: f"{lm}: [QR {m.group(1)}.{m.group(2)}] {QR.get((int(m.group(1)), int(m.group(2))), ('', ''))[0]}", md)


def qr_html_marker(md):
    """HTML yolu: [QR N.j] → {{QR N.j}} işareti (inline() görsele çevirir)."""
    return re.sub(L['live_marker'] + r': \[QR (\d+)\.(\d+)\]', L['live_marker'] + r': {{QR \1.\2}}', md)



def ix_bind(body):
    """R076: dizin çapası ile terimin kendisi aynı satırda/sayfada kalsın: çapa grubunu ve ardından gelen terimi (en uzun data-l kadar
    görünür karakter) bölünmez bir span içine alır. Terimin içinde başka etiket varsa (çapa dışında) sarmaz."""
    out, i = [], 0
    rx = re.compile(r'(?:<a id="ix-[\w-]+" data-l="\d+"></a>)+')
    for m in rx.finditer(body):
        if m.start() < i: continue
        L_ = max(int(x) for x in re.findall(r'data-l="(\d+)"', m.group(0)))
        j, n, ok = m.end(), 0, True
        while n < L_ and j < len(body):
            if body[j] == '<':
                t = re.match(r'<a id="ix-[\w-]+" data-l="\d+"></a>', body[j:])
                if not t: ok = False; break
                j += t.end(); continue
            if body[j] == '&':
                e = body.find(';', j); j = e + 1 if 0 < e - j < 9 else j + 1
            else: j += 1
            n += 1
        out.append(body[i:m.start()])
        out.append(f'<span class="ixw">{body[m.start():j]}</span>' if ok and n == L_ else body[m.start():m.end()])
        i = j if ok and n == L_ else m.end()
    out.append(body[i:])
    return re.sub(r' data-l="\d+"', '', ''.join(out))


def build_index(chapter_mds):
    """Terim → alt bölüm dizini. Kaynak: arka/dizin-terimler.yaml ("Terim: [takma adlar]")."""
    path = os.path.join(SRC, L['back'], L['index_terms'])
    if not os.path.exists(path):
        return L['index_missing']
    terms = []
    exclude, only_ch = {}, {}  # "Terim!hariç: ['Dikkat:']" → bu kalıbı içeren satırda eşleşme sayılmaz; "Terim!bölümler: [4, 5]" → yalnız o bölümler
    for ln in open(path, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#') or ': ' not in ln:
            continue
        name, rest = ln.split(': ', 1)
        try:
            aliases = ast.literal_eval(rest)
        except Exception:
            aliases = []
        if '!' in name:
            base, opt = name.split('!', 1)
            if opt.strip() == 'hariç': exclude[base.strip()] = [str(a) for a in aliases]
            elif opt.strip() == 'bölümler': only_ch[base.strip()] = {int(a) for a in aliases}
            continue
        pats = {name.split(' (')[0].strip()}
        for a in aliases:
            for piece in str(a).split(','):
                piece = piece.strip()
                if len(piece) >= 3:
                    pats.add(piece)
        terms.append((name, sorted(pats, key=lambda p: (-len(p), p))))
    # bölüm metinleri: her terim için alt bölümdeki ilk geçiş yerine çapa konur (IXANCHOR{…} → html'de <a id="ix-…">),
    # böylece dizin sayfa numarası alt bölüm başını değil terimin geçtiği sayfayı gösterir. chapter_mds yerinde güncellenir.
    def safe_line(text, pos):
        ls = text.rfind('\n', 0, pos) + 1
        line = text[ls:text.find('\n', pos) if text.find('\n', pos) >= 0 else len(text)]
        return not (line.startswith('#') or line.startswith('!') or line.startswith('<') or line.startswith('|') or line.startswith('>')
                    or '[QR ' in line or 'IXANCHOR{' in line[:pos - ls]
                    or re.match(r'\*\*(Şekil|Figure) \d', line))  # şekil başlığı/tablo/kenar notu satırına çapa konmaz (R076: kavram bağlamı)
    out = ['# ' + L['h_index'], '', L['index_intro'], '']
    entries = []
    inserts = [dict() for _ in chapter_mds]  # ci → {offset: token}
    lowered = []
    for ci, md in enumerate(chapter_mds):
        body = strip_comments(md)
        chapter_mds[ci] = body
        low = L['lower'](body)
        assert len(low) == len(body), 'küçük harf dönüşümü uzunluğu değiştirdi'
        secs = [(m.group(1), m.start()) for m in re.finditer(r'^### (\d+\.\d+) ', body, flags=re.M)]
        lowered.append((body, low, secs))
    for ti, (name, pats) in enumerate(terms):
        hits = []
        exc = [L['lower'](x) for x in exclude.get(name, [])]
        for ci, (body, low, secs) in enumerate(lowered):
            if name in only_ch and (ci + 1) not in only_ch[name]: continue
            for si, (label, start) in enumerate(secs):
                end = secs[si + 1][1] if si + 1 < len(secs) else len(body)
                seg = low[start:end]
                seg_clean = re.sub(r'!\[[^\]]*\]\([^)]*\)', lambda m: ' ' * len(m.group(0)), seg)  # görsel yolları eşleşmesin
                found = None
                for pat in pats:
                    rx = r'(?<![\wâîû])' + re.escape(L['lower'](pat)) + r'(?![\wâîû])'
                    ms = list(re.finditer(rx, seg_clean))
                    if not ms: continue
                    ms = [m for m in ms if not any(x in seg_clean[max(0, m.start() - 40):m.end() + 40] for x in exc)]
                    if not ms: continue
                    for m in ms:
                        if safe_line(body, start + m.start()):
                            found = start + m.start(); flen = m.end() - m.start(); break
                    if found is None:
                        continue  # yalnız tablo/kenar notu/şekilde geçiyor → bu alt bölüm dizine girmez (R076)
                    break
                if found is None: continue
                aid = f'{label.replace(".", "-")}-{ti}'
                if found >= 0:
                    inserts[ci][found] = inserts[ci].get(found, '') + f'IXANCHOR{{{aid}|{flen}}}'  # aynı konumda birden çok terim olabilir; |uzunluk: çapa terimle birlikte sarılır (R076)
                    hits.append((label, f'#ix-{aid}'))
                else:
                    hits.append((label, f'#sec-{label.replace(".", "-")}'))
        if hits:
            entries.append((name, hits))
    for ci, ins in enumerate(inserts):
        body = chapter_mds[ci]
        for off in sorted(ins, reverse=True):
            body = body[:off] + ins[off] + body[off:]
        chapter_mds[ci] = body
    for name, hits in sorted(entries, key=lambda e: L['key'](e[0])):
        refs = ', '.join(f'[{h}]({href})' for h, href in hits)
        out.append(f'**{name}** · {refs}  ')
    out.append('')
    return '\n'.join(out) + '\n'


def glossary():
    p = os.path.join(SRC, L['back'], L['glossary_file'])
    return read(p) if os.path.exists(p) else L['glossary_missing']


def index_note():
    return '# Dizin\n\n<!-- Dizin dizgi aşamasında (sayfa numaraları belli olunca) üretilecek. -->\n[Dizgi aşamasında eklenecek.]\n'


# ---------------------------------------------------------------- markdown → html (kitap için yeterli alt küme)

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<figure><img src="\2" alt="\1"><figcaption>\1</figcaption></figure>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'&lt;(https?://[^&]+)&gt;', r'<a href="\1">\1</a>', s)
    s = re.sub(r'\{\{QR (\d+)\.(\d+)\}\}',
               lambda m: (lambda url, name: f'<span class="qr"><img src="{L["qr_img"]}{name}.svg" alt="QR {m.group(1)}.{m.group(2)}">'
                          f'<span class="mono">{html.escape(url.replace("https://", ""), quote=False)}</span></span>')(
                   *QR.get((int(m.group(1)), int(m.group(2))), ('', 'qr-missing'))), s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    return s


def md_to_html(md):
    out, i = [], 0
    lines = md.split('\n')
    para = []

    def flush():
        if para:
            out.append('<p>' + inline(' '.join(para)) + '</p>')
            para.clear()

    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            flush(); i += 1; continue
        if ln.startswith('<!--'):
            while i < len(lines) and '-->' not in lines[i]:
                i += 1
            i += 1; continue
        if ln.startswith('---'):
            flush(); out.append('<hr class="pb">'); i += 1; continue
        m = re.match(r'^(#{1,4}) (.+)$', ln)
        if m:
            flush(); lvl = len(m.group(1))
            mm = re.match(r'^(\d+)\.(\d+) ', m.group(2))
            attr = f' id="sec-{mm.group(1)}-{mm.group(2)}"' if (lvl == 3 and mm) else ''
            out.append(f'<h{lvl}{attr}>{inline(m.group(2))}</h{lvl}>'); i += 1; continue
        if ln.startswith('> '):
            flush(); q = []
            while i < len(lines) and lines[i].startswith('> '):
                q.append(lines[i][2:]); i += 1
            out.append('<blockquote><p>' + inline(' '.join(q)) + '</p></blockquote>'); continue
        if ln.startswith('|'):
            flush(); rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            cells = [[c.strip() for c in r.strip().strip('|').split('|')] for r in rows if not re.match(r'^\|[\s:|-]+\|$', r)]
            if cells:
                t = ['<table>', '<thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in cells[0]) + '</tr></thead>', '<tbody>']
                for r in cells[1:]:
                    t.append('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>')
                t += ['</tbody>', '</table>']
                out.append('\n'.join(t))
            continue
        m = re.match(r'^(\s*)([-*]|\d+[.)]|[a-z]\))\s+(.+)$', ln)
        if m:
            flush()
            ordered = m.group(2)[0].isdigit()
            tag = 'ol' if ordered else 'ul'
            start = int(re.match(r'\d+', m.group(2)).group(0)) if ordered else 1  # "2." ile başlayan liste numarayı sürdürür (quiz)
            items = []
            while i < len(lines):
                mm = re.match(r'^(\s*)([-*]|\d+[.)]|[a-z]\))\s+(.+)$', lines[i])
                if not mm:
                    break
                indent, marker, body = len(mm.group(1)), mm.group(2), mm.group(3)
                if indent > 0 and items:
                    items[-1] += '<br>' + marker + ' ' + inline(body)  # a) b) c) şıkları soru maddesinin içinde, harfiyle
                else:
                    items.append(inline(body))
                i += 1
            attr = f' start="{start}"' if start != 1 else ''
            out.append(f'<{tag}{attr}>' + ''.join(f'<li>{it}</li>' for it in items) + f'</{tag}>')
            continue
        para.append(ln.strip()); i += 1
    flush()
    return '\n'.join(out)


CSS = """
@page { size: 160mm 240mm; margin: 22mm 20mm 24mm 20mm; }
:root { --ink:#1f1f1f; --ink2:#37332a; --muted:#8a8270; --ember:#e85d3a; --paper:#f4efe6; --plate:#faf7ef; --rule:rgba(26,26,26,0.16); }
html { background:#ddd8cc; }
body { margin:0; padding:40px 0; font-family:'Work Sans','Helvetica Neue',Arial,sans-serif; color:var(--ink); line-height:1.6; }
.page { max-width:640px; margin:0 auto; background:var(--paper); padding:56px 64px; box-shadow:0 2px 14px rgba(0,0,0,.12); font-size:11.5pt; }
h1,h2 { font-family:'Instrument Serif',Georgia,serif; font-weight:400; line-height:1.15; }
h1 { font-size:34pt; margin:1.4em 0 .3em; page-break-before:always; }
h1:first-child { page-break-before:auto; }
h1 + h2 { font-size:22pt; margin:0 0 .3em; color:var(--ink2); }
h2 { font-size:18pt; margin:1.6em 0 .5em; }
h3 { font-family:'Instrument Serif',Georgia,serif; font-weight:400; font-size:16pt; margin:1.8em 0 .5em; page-break-after:avoid; }
h4 { font-family:'Space Mono',Menlo,monospace; font-size:8.5pt; letter-spacing:.14em; text-transform:uppercase; color:var(--ember); margin:1.6em 0 .4em; }
p { margin:0 0 .85em; }
em { font-style:italic; }
blockquote { margin:1em 0; padding:.6em 1em; border-left:2px solid var(--ember); background:var(--plate); font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:12pt; color:var(--ink2); }
blockquote p { margin:0; }
figure { margin:1.4em 0 .6em; text-align:center; }
figure img { max-width:100%; border:1px solid var(--rule); background:var(--plate); }
figcaption { font-family:'Space Mono',Menlo,monospace; font-size:8pt; letter-spacing:.1em; color:var(--muted); margin-top:.4em; }
table { border-collapse:collapse; margin:.8em 0 1.2em; font-size:9.5pt; width:100%; }
th,td { border-bottom:1px solid var(--rule); padding:.35em .5em; text-align:left; vertical-align:top; }
th { font-family:'Space Mono',Menlo,monospace; font-size:8pt; letter-spacing:.08em; color:var(--muted); font-weight:400; }
code { font-family:'Space Mono',Menlo,monospace; font-size:.88em; }
ul,ol { padding-left:1.4em; margin:0 0 .9em; }
li { margin:.2em 0; }
hr { border:0; border-top:1px solid var(--rule); margin:2em 0; }
/* Teknik derinlik kutusu: h4'ten bir sonraki h3/h4/hr'a kadar olan blok dizgide kutulanır; burada yalnız kenar çizgisi */
h4 + p, h4 ~ p { }
.h4box { border:1px solid var(--rule); background:var(--plate); padding:.2em 1em .4em; margin:1.2em 0; }
a { color:var(--ember); text-decoration:none; }
hr.pb { border:0; margin:2em 0; page-break-after:always; break-after:page; }
.qr { display:inline-flex; align-items:center; gap:8px; vertical-align:middle; margin-left:4px; }
.qr img { width:52px; height:52px; border:none; background:#fff; }
.qr .mono { font-family:'Space Mono',Menlo,monospace; font-size:7.5pt; color:var(--muted); }
@media print { html { background:#fff; } body { padding:0; } .page { box-shadow:none; max-width:none; padding:0; background:#fff; } }
"""


def box_technical(h):
    """'Teknik derinlik' h4 başlığından sonraki paragrafları, bir sonraki h3/h4/hr/strong-Şekil satırına kadar kutuya alır."""
    parts = re.split(r'(<h4>' + L['tech'] + r'</h4>)', h)
    out = [parts[0]]
    for k in range(1, len(parts), 2):
        rest = parts[k + 1]
        m = re.search(r'(?=<h[1-4][ >]|<hr>|<p><strong>' + L['fig_word'] + r' )', rest)  # h3 id="…" da kesme noktası
        cut = m.start() if m else len(rest)
        box = rest[:cut]
        # bloğun son paragrafı geçiş cümlesidir (kılavuz §2): kutunun dışında kalır
        last = box.rfind('<p>')
        if last > 0 and box.count('<p>') >= 2:
            box, tail = box[:last], box[last:]
        else:
            tail = ''
        out.append('<div class="h4box">' + parts[k] + box + '</div>' + tail + rest[cut:])
    return ''.join(out)


def build():
    os.makedirs(OUT, exist_ok=True)
    global QR
    QR = qr_map()
    fronts = [read(f) for f in sorted(glob.glob(os.path.join(SRC, L['front'], '*.md')))]
    chaps = chapters()
    bib = os.path.join(SRC, L['back'], L['biblio_file'])
    index_md = build_index(chaps)  # chaps yerinde güncellenir (dizin çapaları); pieces'tan ÖNCE çağrılmalı
    pieces = fronts + [toc(chaps)] + chaps + [answer_key(), glossary(), read(bib) if os.path.exists(bib) else '# ' + L['h_biblio'] + '\n\n[To be added]\n',
                                              live_demos(), index_md]
    md = '\n\n'.join(p.strip() for p in pieces) + '\n'
    md_path = os.path.join(OUT, L['out_base'] + '.md')
    open(md_path, 'w', encoding='utf-8').write(re.sub(r'IXANCHOR\{[\w-]+(?:\|\d+)?\}', '', qr_md(md)))

    body = box_technical(md_to_html(qr_html_marker(strip_comments(md))))
    body = body.replace(*L['fig_fix'])
    body = re.sub(r'IXANCHOR\{([\w-]+)\|(\d+)\}', r'<a id="ix-\1" data-l="\2"></a>', body)  # dizin çapaları
    body = ix_bind(body)
    doc = (f'<!doctype html>\n<html lang="{L["html_lang"]}"><head><meta charset="utf-8"><title>{L["html_title"]}</title>'
           '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&family=Space+Mono&display=swap" rel="stylesheet">'
           f'<style>{CSS}</style></head><body><div class="page">\n{body}\n</div></body></html>\n')
    html_path = os.path.join(OUT, L['out_base'] + '.html')
    open(html_path, 'w', encoding='utf-8').write(doc)

    words = len(re.findall(r'\S+', strip_comments(md)))
    todo = len(re.findall(L['todo_word'], md)) + len(re.findall(L['todo_rx'], md))
    print(f"{os.path.relpath(md_path, ROOT)}  ·  {words} {L['words_label']}  ·  ~{words // 300} {L['pages_label']}  ·  {L['todo_label']}: {todo}")
    print(f'{os.path.relpath(html_path, ROOT)}  ({date.today().isoformat()})')


if __name__ == '__main__':
    import sys
    lang = 'tr'
    if '--lang' in sys.argv:
        lang = sys.argv[sys.argv.index('--lang') + 1]
    set_lang(lang)
    build()

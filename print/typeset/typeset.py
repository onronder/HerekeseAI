#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dizgi hazırlığı — print/kitap/Herkes-Icin-Yapay-Zeka-TR.html (assemble.py çıktısı) → print/typeset/out/ic-blok.html

Yapılanlar:
  • Google Fonts bağlantısı yerine yerel @font-face (store/assets/fonts.css + woff2; PDF'e gömülür)
  • 45 figür ve 45 QR SVG'si inline (img içinde belge fontları yüklenmez; inline'da yüklenir, vektör kalır)
  • SVG'de metin siyahı #1f1f1f → #000 (CMYK'da %100 K); marker id'leri figür başına öneklenir
  • h1 başına <section> (ön bölüm / bölüm / arka bölüm), koşan başlık dizgisi, kimlikler (bolum-N, arka-*)
  • İçindekiler ve Dizin: bağlantılar Paged.js target-counter ile sayfa numarasına dönüşür
  • --pad N: arka bölüm sonuna N "Notlar" sayfası (forma katına tamamlama)

Kullanım: python3 print/typeset/typeset.py [--lang tr|en] [--profile matbaa|kdp] [--pad N]
  TR/matbaa (varsayılan) → out/ic-blok.html; diğerleri → out/<lang>-<profile>/ic-blok.html
"""
import html as H
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FONTS_CSS = os.path.join(ROOT, 'store', 'assets', 'fonts.css')
FONTS_DIR = os.path.join(ROOT, 'store', 'assets', 'fonts')

LANGS = {
    'tr': dict(html='Herkes-Icin-Yapay-Zeka-TR.html', sub='', fig='tr', fig_prefix='sekil', img_dir=r'\.\./figures/out/tr/',
               title='Herkes İçin Yapay Zekâ', chapter='Bölüm', contents='İçindekiler', index='Dizin', notes='Notlar',
               back={'Cevap Anahtarı': 'arka-cevap-anahtari', 'Sözlük': 'arka-sozluk', 'Kaynakça ve İleri Okuma': 'arka-kaynakca-ve-ileri-okuma',
                     'Canlı Demolar': 'arka-canli-demolar', 'Dizin': 'arka-dizin'},
               index_intro=('Sayılar bölüm ve alt bölümü gösterir (3.6 = Bölüm 3, altıncı kesim). Sayfa numaraları dizgide eklenecektir.',
                            'Sayılar sayfa numarasını gösterir.'), lang='tr'),
    'en': dict(html='AI-for-Everyone-EN.html', sub='en', fig='en', fig_prefix='figure', img_dir=r'\.\./\.\./figures/out/en/',
               title='AI for Everyone', chapter='Chapter', contents='Contents', index='Index', notes='Notes',
               back={'Answer Key': 'arka-answer-key', 'Glossary': 'arka-glossary', 'Bibliography and Further Reading': 'arka-bibliography-and-further-reading',
                     'Live Demos': 'arka-live-demos', 'Index': 'arka-index'},
               index_intro=('Numbers refer to chapter and section (3.6 = Chapter 3, sixth section). Page numbers are added at typesetting.',
                            'Numbers are page numbers.'), lang='en'),
}
L = LANGS['tr']
PROFILE = 'matbaa'
SRC = FIG = OUT = TITLE = None


def set_lang(lang, profile):
    global L, PROFILE, SRC, FIG, OUT, TITLE
    L = LANGS[lang]; PROFILE = profile
    SRC = os.path.join(ROOT, 'print', 'kitap', L['sub'], L['html']) if L['sub'] else os.path.join(ROOT, 'print', 'kitap', L['html'])
    FIG = os.path.join(ROOT, 'print', 'figures', 'out', L['fig'])
    OUT = os.path.join(HERE, 'out') if (lang == 'tr' and profile == 'matbaa') else os.path.join(HERE, 'out', f'{lang}-{profile}')
    TITLE = L['title']


set_lang('tr', 'matbaa')


def slug(s):
    s = re.sub(r'<[^>]+>', '', s)
    tr = str.maketrans('çğıöşüÇĞİÖŞÜâ', 'cgiosucgiosua')
    s = s.translate(tr).lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def fonts_css():
    css = open(FONTS_CSS, encoding='utf-8').read()
    return css.replace('url(fonts/', f'url(file://{FONTS_DIR}/')


BASE = (0xfa, 0xf7, 0xef)  # figür zemini (--plate); saydam renkler bunun üstüne düzleştirilir


def _blend(rgb, a, base=BASE):
    return '#%02x%02x%02x' % tuple(round(a * c + (1 - a) * b) for c, b in zip(rgb, base))


def flatten_alpha(svg):
    """Saydamlık PDF/X-1a'da yok (Ghostscript sayfayı rasterleştirir): rgba() ve *-opacity düzleştirilir."""
    svg = re.sub(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)',
                 lambda m: _blend((int(m.group(1)), int(m.group(2)), int(m.group(3))), float(m.group(4))), svg)

    def elem(m):
        tag = m.group(0)
        for prop in ('fill', 'stroke'):
            mo = re.search(rf'\s{prop}-opacity="([0-9.]+)"', tag)
            if not mo:
                continue
            a = float(mo.group(1))
            mc = re.search(rf'\s{prop}="#([0-9a-fA-F]{{6}})"', tag)
            if mc:
                h = mc.group(1)
                rgb = (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
                tag = tag.replace(mc.group(0), f' {prop}="{_blend(rgb, a)}"').replace(mo.group(0), '')
        mo = re.search(r'\sopacity="([0-9.]+)"', tag)
        if mo:
            a = float(mo.group(1))
            for prop in ('fill', 'stroke'):
                mc = re.search(rf'\s{prop}="#([0-9a-fA-F]{{6}})"', tag)
                if mc:
                    h = mc.group(1)
                    rgb = (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
                    tag = tag.replace(mc.group(0), f' {prop}="{_blend(rgb, a)}"')
            if not tag.startswith('<g'):
                tag = tag.replace(mo.group(0), '')
        return tag
    svg = re.sub(r'<[a-z]+\s[^>]*opacity="[0-9.]+"[^>]*>', elem, svg)
    # #rrggbbaa (8 haneli hex): beyaz düğüm/kutu üstüne çizilir → beyaz zemine düzleştirilir
    svg = re.sub(r'#([0-9a-fA-F]{6})([0-9a-fA-F]{2})(?=")',
                 lambda m: 'none' if int(m.group(2), 16) < 5 else
                 _blend((int(m.group(1)[0:2], 16), int(m.group(1)[2:4], 16), int(m.group(1)[4:6], 16)),
                        int(m.group(2), 16) / 255, (255, 255, 255)), svg)
    left = re.findall(r'opacity="[0-9.]+"|rgba\(|#[0-9a-fA-F]{8}"', svg)
    assert not left, f'düzleştirilemeyen saydamlık: {left[:3]}'
    return svg


SUB = {'₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
       '₊': '+', '₋': '-', 'ₜ': 't', 'ᵢ': 'i', 'ₓ': 'x', 'ₕ': 'h', 'ₖ': 'k', 'ₘ': 'm', 'ⱼ': 'j', 'ₙ': 'n'}
SUP = {'⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
       '⁺': '+', '⁻': '-', '⁽': '(', '⁾': ')', 'ⁿ': 'n', 'ⁱ': 'i', 'ˡ': 'l'}
_SUBSUP_RX = re.compile('([' + ''.join(SUB) + ']+)|([' + ''.join(SUP) + ']+)')


def _subsup_text(t):
    def rep(m):
        if m.group(1):
            return '<tspan font-size="70%" baseline-shift="sub">' + ''.join(SUB[c] for c in m.group(1)) + '</tspan>'
        return '<tspan font-size="70%" baseline-shift="super">' + ''.join(SUP[c] for c in m.group(2)) + '</tspan>'
    return _SUBSUP_RX.sub(rep, t)


def svg_subsup(svg):
    """Unicode alt/üst simge karakterleri → tspan (yedek font + sentetik kalın Type 3 fonta ve rasterleşmeye yol açıyor)."""
    def text(m):
        inner = re.sub(r'>([^<]+)<', lambda mm: '>' + _subsup_text(mm.group(1)) + '<', '>' + m.group(2) + '<')[1:-1]
        return m.group(1) + inner + '</text>'
    return re.sub(r'(<text[^>]*>)(.*?)</text>', text, svg, flags=re.S)


def inline_svg(name, alt, kind, n):
    path = os.path.join(FIG, name)
    svg = open(path, encoding='utf-8').read()
    svg = re.sub(r'<\?xml[^>]*\?>\s*', '', svg)
    # id çakışması: her figürün marker'ı kendine
    svg = re.sub(r'id="([A-Za-z_][\w-]*)"', lambda m: f'id="f{n}-{m.group(1)}"', svg)
    svg = re.sub(r'url\(#([\w-]+)\)', lambda m: f'url(#f{n}-{m.group(1)})', svg)
    svg = re.sub(r'href="#([\w-]+)"', lambda m: f'href="#f{n}-{m.group(1)}"', svg)
    if kind == 'fig':
        # metin siyahı → saf siyah (CMYK: yalnız K)
        svg = re.sub(r'(<text[^>]*?)fill="#1f1f1f"', r'\1fill="#000000"', svg)
        svg = flatten_alpha(svg)
        svg = svg_subsup(svg)
        svg = svg.replace("'Helvetica Neue', Arial, sans-serif", "'Arial Unicode MS', sans-serif").replace("Georgia, serif", "'Arial Unicode MS', serif")
        # boyut: metin genişliği (matbaa 124 mm, KDP 120 mm); uzun figürler 120 mm yüksekliğe sığdırılır (sayfa sonu boşluğu azalsın)
        vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
        W = 120.0 if PROFILE == 'kdp' else 124.0
        if vb:
            vw, vh = float(vb.group(1)), float(vb.group(2))
            h = W * vh / vw
            if h > FIG_HMAX: h = FIG_HMAX; W = h * vw / vh
            svg = re.sub(r'\s(width|height)="[^"]*"', '', svg, count=2)
            svg = svg.replace('<svg ', f'<svg style="width:{W:.1f}mm;height:{h:.1f}mm" ', 1)
        svg = svg.replace('<svg ', f'<svg class="fig" role="img" aria-label="{H.escape(alt)}" ', 1)
    else:
        svg = svg.replace('<svg ', '<svg class="qrsvg" ', 1)
    return svg


def inline_images(body):
    n = [0]

    def fig(m):
        n[0] += 1
        return inline_svg(m.group(1), m.group(2), 'fig', n[0])

    def qr(m):
        n[0] += 1
        return inline_svg(m.group(1), m.group(2), 'qr', n[0])

    body = re.sub(r'<img src="' + L['img_dir'] + r'(' + L['fig_prefix'] + r'-[^"]+\.svg)" alt="([^"]*)">', fig, body)
    body = re.sub(r'<img src="' + L['img_dir'] + r'(qr-[^"]+\.svg)" alt="([^"]*)">', qr, body)
    assert '<img' not in body, 'inline edilmemiş img kaldı'
    return body


def sectionize(body):
    """Her <h1> bir bölüm başlatır. Kimlik, sınıf ve koşan başlık dizgisi eklenir."""
    parts = re.split(r'(?=<h1[^>]*>)', body)
    out = [parts[0]]
    seen_chapter = False
    for p in parts[1:]:
        m = re.match(r'<h1[^>]*>(.*?)</h1>', p, re.S)
        h1 = m.group(1).strip()
        mb = re.match(L['chapter'] + r' (\d+)$', h1)
        if mb:
            seen_chapter = True
            mh2 = re.search(r'</h1>\s*<h2>(.*?)</h2>', p, re.S)
            title = mh2.group(1).strip() if mh2 else ''
            sid = f'bolum-{mb.group(1)}'
            cls = 'chapter'
            head = f'{h1} · {title}' if title else h1
            # bölüm açılışı: numara + başlık
            p = re.sub(r'<h1[^>]*>.*?</h1>\s*<h2>(.*?)</h2>',
                       lambda mm: f'<div class="ch-open"><span class="ch-no">{mb.group(1)}</span><h1>{h1}</h1><h2>{mm.group(1)}</h2></div>', p, count=1, flags=re.S)
        elif h1 == TITLE:
            sid, cls, head = 'baslik', 'front title', ''
        elif seen_chapter:
            sid, cls, head = f'arka-{slug(h1)}', 'back' + (' index' if h1 == L['index'] else ''), h1
        else:
            sid, cls, head = f'on-{slug(h1)}', 'front' + (' toc' if h1 == L['contents'] else ''), h1
        rh = f'<span class="rh">{head}</span>' if head else ''
        out.append(f'<section id="{sid}" class="{cls}">{rh}{p}</section>\n')
    return ''.join(out)


def toc_links(body):
    """İçindekiler: bölüm satırları ve alt bölümler bağlantıya; sayfa numarası CSS'ten (target-counter)."""
    i = body.find('class="front toc"')
    i = body.rfind('<section', 0, i)
    j = body.find('</section>', i)
    toc = body[i:j]
    toc = re.sub(r'<p><strong>' + L['chapter'] + r' (\d+) · (.*?)</strong></p>',
                 r'<p class="toc-ch"><a class="t" href="#bolum-\1">' + L['chapter'] + r' \1 · \2</a><a class="pn" href="#bolum-\1"></a></p>', toc)
    toc = re.sub(r'<li>(\d+)\.(\d+) (.*?)</li>',
                 r'<li><a class="t" href="#sec-\1-\2">\1.\2 \3</a><a class="pn" href="#sec-\1-\2"></a></li>', toc)
    for name, sid in L['back'].items():
        toc = toc.replace(f'<p><strong>{name}</strong></p>',
                          f'<p class="toc-ch"><a class="t" href="#{sid}">{name}</a><a class="pn" href="#{sid}"></a></p>')
    return body[:i] + toc + body[j:]


def index_pages(body):
    """Dizin: 'Terim · 3.6, 4.2' → 'Terim  12, 40' (sayfa numaraları target-counter ile); her madde ayrı satır."""
    i = body.find('class="back index"')
    if i < 0:
        return body
    i = body.rfind('<section', 0, i)
    j = body.find('</section>', i)
    ix = body[i:j]
    ix = ix.replace(*L['index_intro'])
    m = re.search(r'<p>(<strong>.*)</p>', ix, re.S)
    if m:
        entries = re.split(r'\s*(?=<strong>)', m.group(1).strip())
        items = []
        for e in entries:
            if not e.strip():
                continue
            e = re.sub(r'<a href="(#(?:sec|ix)-[\w-]+)">[\d.]+</a>', r'<a class="ix" href="\1"></a>', e)
            e = e.replace(' · ', ' ')
            items.append(f'<div class="ix-e">{e}</div>')
        ix = ix[:m.start()] + '<div class="ix-list">' + ''.join(items) + '</div>' + ix[m.end():]
    return body[:i] + ix + body[j:]


# Emoji baskıda yok (renkli bitmap glif; PDF/X'e uymaz): metinden düşürülür, boşluk temizlenir.
EMOJI = ['😅', '💨', '🧥', '🧣', '☂️', '☂', '🙂', '🌱', '\ufe0f']


def strip_emoji(body):
    for e in EMOJI:
        body = body.replace(' ' + e, '').replace(e, '')
    return body


FIG_HMAX = 120.0  # mm; daha uzun figürler orantılı küçültülür


def live_lines(body):
    """'Live demo: [QR]' kısmı kendi satırına (sola yaslı): aksi hâlde QR kutusu alt satıra taşınca üstteki satır yayılıyor."""
    return re.sub(r' ?((?:Live demo|Canlı demo): <span class="qr">)', r'</p><p class="live">\1', body)


def live_into_figure(body):
    """Canlı demo QR'ı, ait olduğu şeklin altına (figcaption satırına) taşınır: 'her şeklin altındaki QR kod'.
    Böylece QR hiçbir zaman şekilden kopup sayfa başına düşmez; figür bloğu (break-inside: avoid) onu da taşır."""
    moved = [0]

    def mv(m):
        live = m.group(1)
        start = m.start()
        i = body.rfind('<figcaption>', 0, start)
        j = body.find('</figcaption>', i)
        assert i >= 0 and j > i and 'class="live"' not in body[i:j], 'canlı demo satırının şekli bulunamadı'
        cap = body[i + len('<figcaption>'):j]
        pieces.append((i, j + len('</figcaption>'), f'<figcaption><span class="cap">{cap}</span><span class="live">{live}</span></figcaption>'))
        moved[0] += 1
        return ''
    pieces = []
    out = re.sub(r'<p class="live">(.*?)</p>', mv, body, flags=re.S)
    # figcaption değişimlerini (konumlar orijinal gövdeye göre) uygula: sondan başa
    for i, j, rep in sorted(pieces, reverse=True):
        # out içinde aynı figcaption metni; orijinal konumu değil metni eşle (p.live silindiğinden konum kaydı)
        old = body[i:j]
        k = out.find(old)
        assert k >= 0
        out = out[:k] + rep + out[k + len(old):]
    return out


TOP_TAGS = ('p', 'table', 'ol', 'ul', 'blockquote', 'div', 'aside', 'h2', 'h3', 'h4', 'section', 'hr', 'figure')
STOP_RX = re.compile(r'<(h2|h3|h4|section|hr)[ >]|<p class="figtitle">')  # teknik kutu geçilebilir (son çare), sonraki şekil/başlık geçilemez


def top_elements(body, start, limit=12):
    """start konumundan itibaren üst düzey blok öğelerini (başlangıç, bitiş) olarak sayar; durdurucu öğede kesilir."""
    els = []
    i = start
    while len(els) < limit:
        m = re.compile(r'\s*<(' + '|'.join(TOP_TAGS) + r')(?=[ >])').match(body, i)
        if not m: break
        tag = m.group(1)
        s = m.end() - len(tag) - 1
        if STOP_RX.match(body, s): break
        close = f'</{tag}>'
        e = body.find(close, s)
        if e < 0: break
        e += len(close)
        els.append((s, e))
        i = e
    return els


def fig_blocks(body):
    """<p><strong>Şekil N.j · …</strong> <figure>…</figure></p> → <p class="figtitle">…</p><figure>…</figure>
    (tarayıcı p içinde figure'a izin vermez; DOM'da zaten böyle ayrışır, artık boş <p> de kalmaz)."""
    return re.sub(r'<p><strong>((?:Şekil|Figure) \d+\.\d+ ·[^<]*)</strong>\s*(<figure>.*?</figure>)\s*</p>',
                  r'<p class="figtitle"><strong>\1</strong></p>\n\2', body, flags=re.S)


def defer_figures(body, plan):
    """Sayfa sonunda sığmayan şekil bloğunu (başlık + figür + altındaki QR) izleyen k blok öğesinin arkasına taşır
    (dizgide 'sayfa üstüne yüzen şekil' davranışı). plan: {'Şekil 1.4': k}. Öğeler h3/h4/kutu/sonraki şekle kadar sayılır."""
    for label, v in plan.items():
        k, scale = (v.get('k', 0), v.get('scale', 1.0)) if isinstance(v, dict) else (v, 1.0)
        if not k and scale >= 0.999: continue
        m = re.search(r'<p class="figtitle"><strong>' + re.escape(label) + r' ·.*?</figure>', body, re.S)
        if not m:
            print(f'  uyarı: {label} bloğu bulunamadı'); continue
        blk = body[m.start():m.end()]
        if scale < 0.999:  # figürü orantılı küçült (sayfa sonundaki boşluğa sığsın)
            blk = re.sub(r'style="width:([\d.]+)mm;height:([\d.]+)mm"',
                         lambda mm: f'style="width:{float(mm.group(1)) * scale:.1f}mm;height:{float(mm.group(2)) * scale:.1f}mm"', blk, count=1)
        if k < 0:  # -1: bloğu alt bölüm başlığının (h3) hemen altına al ("sayfa üstüne yüzen şekil")
            h = body.rfind('</h3>', 0, m.start())
            if h < 0: print(f'  uyarı: {label} için h3 yok'); continue
            h += len('</h3>')
            body = body[:h] + '\n' + blk + body[h:m.start()] + body[m.end():]
            continue
        els = top_elements(body, m.end())
        k = min(k, len(els))
        ins = els[k - 1][1] if k else m.end()
        body = body[:m.start()] + body[m.end():ins] + ('\n' if k else '') + blk + body[ins:]
    return body


def live_table(body):
    """Canlı Demolar tablosu: tam URL yerine kısa yol (sütun taşmasın)."""
    return body.replace('<td>https://book.onuronder.com/d/', '<td class="mono">book.onuronder.com/d/')


def notes_pages(n):
    lines = '<div class="lines">' + '<div class="ln"></div>' * 22 + '</div>'  # gradient değil (Chrome rasterleştirir), kenarlıklı satırlar
    return ''.join(f'<section class="back notes"><span class="rh">{L["notes"]}</span><h1>{L["notes"]}</h1>{lines}</section>\n' for _ in range(n))


def build(pad=0, plan=None):
    doc = open(SRC, encoding='utf-8').read()
    body = doc.split('<div class="page">', 1)[1].rsplit('</div></body>', 1)[0]
    body = inline_images(body)
    body = fig_blocks(body)
    body = sectionize(body)
    body = toc_links(body)
    body = index_pages(body)
    body = live_table(body)
    body = live_lines(body)
    body = live_into_figure(body)
    # sınav şıkları gibi kısa listeler (≤ 5 madde, ≤ 400 karakter) sayfa sonunda bölünmesin; tablolar bölünebilir
    # (bölünmez tablo sayfa sonlarında boşluk yaratıyordu; yerleşim motoru yalnız şekil bloklarını taşıyabiliyor)
    def short_list(m):
        inner = m.group(3)
        if m.group(1) == 'ol' and 'class=' not in m.group(2) and inner.count('<li>') <= 5 and len(re.sub(r'<[^>]+>', '', inner)) <= 400:
            return f'<{m.group(1)}{m.group(2)} class="short">'
        return m.group(0)
    body = re.sub(r'<(ol|ul)([^>]*)>(?=((?:(?!</\1>).)*?</\1>))', short_list, body, flags=re.S)
    # ≤ 4 satırlı tablolar/matrisler bölünmez (R071); kısa formül paragrafları bölünmez (R089)
    body = re.sub(r'<table>(?=((?:(?!</table>).)*?</table>))', lambda m: '<table class="small">' if m.group(1).count('<tr>') <= 4 else '<table>', body, flags=re.S)
    body = re.sub(r'<p>(?=([^<]{0,220}</p>))', lambda m: '<p class="formula">' if ('=' in m.group(1) and ('√' in m.group(1) or 'Σ' in m.group(1) or '²' in m.group(1) or '(' in m.group(1))) else '<p>', body)
    body = defer_figures(body, {k: v for k, v in (plan or {}).items() if not k.startswith('_')})
    extra_css = ''
    for sid, v in (plan or {}).get('_tighten', {}).items():  # bölüm kuyruğu tek başına sayfaya taşıyorsa satır/paragraf aralığını ayarla
        vals = [1.5, .8, 1.0]
        for j, x in enumerate(v if isinstance(v, list) else [v]): vals[j] = x
        lh, pm, fs = vals
        body = re.sub(r'<section([^>]*id="' + re.escape(sid) + r'"[^>]*)>', lambda m: f'<section{m.group(1)} style="line-height:{lh};font-size:{fs}em">', body, count=1)
        extra_css += f'section#{sid} p {{ margin-bottom: {pm}em; }}\n'
    body = strip_emoji(body).replace('𝔼', 'E')  # çift çizgili E fontta yok (PDF'te boş glif); düz E (R: metin bütünlüğü)
    body += notes_pages(pad)
    css = open(os.path.join(HERE, 'print.css'), encoding='utf-8').read()
    prof = os.path.join(HERE, 'profiles', PROFILE + '.css')
    css += '\n' + (open(prof, encoding='utf-8').read() if os.path.exists(prof) else '')
    css = css.replace('string(book)', '"' + TITLE.replace('"', '\\"') + '"')  # sol sayfa koşan başlığı: body string-set Paged.js'te işlenmiyor, sabit metin (CSS dizgisi; \\u kaçışı yok)
    css += '\nbody { string-set: book "' + TITLE + '"; }\n' + extra_css
    out = (f'<!doctype html>\n<html lang="{L["lang"]}"><head><meta charset="utf-8">'
           f'<title>{TITLE}</title>\n<style>\n{fonts_css()}\n</style>\n<style>\n{css}\n</style></head>\n'
           f'<body>\n{body}\n</body></html>\n')
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, 'ic-blok.html')
    open(path, 'w', encoding='utf-8').write(out)
    n_fig = out.count('<svg class="fig"'); n_qr = out.count('<svg class="qrsvg"')
    n_sec = out.count('<section '); n_toc = out.count('class="pn"'); n_ix = out.count('class="ix"')
    print(f'{path}: {len(out)//1024} KB · figür {n_fig} · QR {n_qr} · bölüm {n_sec} · içindekiler {n_toc} · dizin bağlantısı {n_ix} · notlar {pad}')


if __name__ == '__main__':
    pad = 0
    if '--pad' in sys.argv:
        pad = int(sys.argv[sys.argv.index('--pad') + 1])
    lang = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'tr'
    profile = sys.argv[sys.argv.index('--profile') + 1] if '--profile' in sys.argv else 'matbaa'
    set_lang(lang, profile)
    plan = {}
    if '--defer' in sys.argv:
        pth = sys.argv[sys.argv.index('--defer') + 1]
        if os.path.exists(pth):
            plan = json.load(open(pth, encoding='utf-8'))
    build(pad, plan)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Atlas-Kitap paketleme scripti.

Üretilenler:
  dist/tek-dosya/Herkes-Icin-Yapay-Zeka-TR.html   — tek dosya, internetsiz çalışır (satılacak ürün)
  dist/tek-dosya/AI-for-Everyone-EN.html          — tek dosya EN
  dist/web/index.html                             — web yayını (TR), support.js ayrı
  dist/web/en.html                                — web yayını (EN)
  dist/web/demo.html                              — ücretsiz vitrin: yalnız Bölüm 1 (TR)
  dist/web/support.js

Kullanım:  python3 build.py
Fontlar Google Fonts'tan bir kez indirilir ve dist/fonts-cache/ altında saklanır.
"""
import base64, os, re, sys, urllib.request, pathlib

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"
CACHE = DIST / "fonts-cache"
TR = ROOT / "Atlas-Kitap.dc.html"
EN = ROOT / "Atlas-Kitap-EN.dc.html"
SUPPORT = ROOT / "support.js"

FONT_CSS_URL = ("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700"
                "&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap")
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def inline_fonts_css() -> str:
    """Google Fonts CSS'ini indir, woff2'leri base64 data-URI olarak göm."""
    CACHE.mkdir(parents=True, exist_ok=True)
    css_path = CACHE / "fonts.css"
    if css_path.exists():
        css = css_path.read_text()
    else:
        css = fetch(FONT_CSS_URL).decode("utf-8")
        css_path.write_text(css)
    urls = sorted(set(re.findall(r"url\((https://[^)]+\.woff2)\)", css)))
    print(f"  font dosyası: {len(urls)}")
    for u in urls:
        name = u.rsplit("/", 2)[-2] + "-" + u.rsplit("/", 1)[-1]
        fp = CACHE / name
        if not fp.exists():
            fp.write_bytes(fetch(u))
        b64 = base64.b64encode(fp.read_bytes()).decode()
        css = css.replace(u, f"data:font/woff2;base64,{b64}")
    return css


def single_file(src_html: str, fonts_css: str, support_js: str, sibling_map: dict) -> str:
    """Tek dosyalık sürüm: fontlar + support.js gömülü; TR/EN linkleri kardeş dosyalara çevrilir."""
    out = src_html
    # 1) Google Fonts link'lerini gömülü CSS ile değiştir
    out = re.sub(r'<link rel="preconnect"[^>]*/>\s*', "", out)
    out = re.sub(r'<link href="https://fonts\.googleapis\.com[^"]*"[^>]*/>',
                 "<style>\n" + fonts_css + "\n</style>", out, count=1)
    # 2) support.js'i göm
    out = out.replace('<script src="./support.js"></script>',
                      "<script>\n" + support_js + "\n</script>", 1)
    # 3) TR/EN linklerini tek-dosya adlarına çevir
    for old, new in sibling_map.items():
        out = out.replace(old, new)
    return out


def demo_variant(src_html: str) -> str:
    """Ücretsiz vitrin: yalnız Modül 1'in İLK 2 alt konusu; 2-8 upcoming()'de kilitli görünür."""
    out = src_html
    mi = out.index("modules() {")
    m2 = out.index("      { n: '02'", mi)
    me = out.index("    ];\n  }", mi)
    kept = out[mi:m2]                       # modules başı + M1
    out = out[:mi] + kept + out[me:]        # M2-M8 verisini at
    # M1'i ilk 3 alt konuya indir; kalanlar kenar çubuğunda KİLİTLİ görünsün
    s4 = out.index("{ id:'babbage'")        # 4. alt konu başlangıcı
    se = out.index("\n        ] }", s4)     # sections dizisinin kapanışı
    removed = out[s4:se]
    labels = re.findall(r"\{ id:'[a-z0-9-]+', label:'((?:[^'\\]|\\.)*)'", removed)
    head = out[:s4].rstrip()
    if head.endswith(","):
        head = head[:-1]
    locked = ", lockedSections:[" + ",".join("'" + l + "'" for l in labels) + "]"
    out = head + "\n        ]" + locked + " }" + out[se + len("\n        ] }"):]
    # Kapak meta barındaki TR·EN linki yerine satışa dönüş linki
    out = out.replace(
        '<span><a href="./index.html" style="color:#e85d3a;text-decoration:none;">TR</a> · '
        '<a href="./en.html" style="color:#8c8470;text-decoration:none;">EN</a></span>',
        '<span><a href="/#satin-al" style="color:#e85d3a;text-decoration:none;">'
        'Ücretsiz demo · Tamamı ₺349</a></span>', 1)
    # upcoming(): 2-8'i "yakında" değil "tam sürümde" olarak listele
    up = """upcoming() {
    return [
      { n:'02', tag:'Klasik YZ', title:'Kuralların Çağı', right:'Tam sürümde', dot:'#bb4d17' },
      { n:'03', tag:'İstatistiksel YZ', title:'Makineler Nasıl Öğrenir', right:'Tam sürümde', dot:'#1d6149' },
      { n:'04', tag:'Derin Öğrenme', title:'Yapay Beyin', right:'Tam sürümde', dot:'#3155c4' },
      { n:'05', tag:'Üretken Çağ', title:'Bugünün Yapay Zekâsı', right:'Tam sürümde', dot:'#7a3fb0' },
      { n:'06', tag:'Uygulama', title:'YZ\\u2019yi Kullanmak ve İnşa Etmek', right:'Tam sürümde', dot:'#2a7d86' },
      { n:'07', tag:'Toplum', title:'Yapay Zekâ ve Toplum', right:'Tam sürümde', dot:'#b03a52' },
      { n:'08', tag:'Felsefe & Gelecek', title:'Felsefe ve Gelecek', right:'Tam sürümde', dot:'#9a5a1f' }
    ];
  }"""
    out = re.sub(r"upcoming\(\) \{\s*return \[\];\s*\}", lambda _: up, out, count=1)
    return out


GATED_EXTRAS = """
<div id="wm-badge" style="position:fixed;bottom:8px;right:10px;z-index:99998;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.04em;color:rgba(128,124,116,0.5);pointer-events:none;user-select:none;">%%WM_LABEL%% %%WM_EMAIL%% \\u00b7 %%WM_ORDER%%</div>
<!--wm:%%WM_HASH%%-->
<script data-guard>
(function(){
  var stop=function(e){e.preventDefault();return false;};
  document.addEventListener('contextmenu',stop);
  document.addEventListener('selectstart',stop);
  document.addEventListener('copy',stop);
  document.addEventListener('dragstart',stop);
  var st=document.createElement('style');
  st.textContent='body{-webkit-user-select:none;user-select:none;}';
  document.head.appendChild(st);
})();
</script>
<!--wm:%%WM_HASH%%-->
"""


def gated_variant(single_html: str, wm_label: str) -> str:
    """Satılan çevrimiçi sürüm: filigran yuvaları + hafif caydırıcılık.

    %%WM_EMAIL%% / %%WM_ORDER%% / %%WM_HASH%% yer tutucuları servis anında
    (book-content Edge Function) alıcı bilgisiyle doldurulur.
    """
    out = single_html
    extras = GATED_EXTRAS.replace("%%WM_LABEL%%", wm_label).replace("\\u00b7", "·")
    out = out.replace("</body>", extras + "\n</body>", 1)
    # içeriğe dağıtılmış ek gizli işaret (kapak kökünden hemen sonra)
    out = out.replace("<x-dc>", "<x-dc data-lic=\"%%WM_HASH%%\">", 1)
    return out


def main():
    print("== Atlas-Kitap build ==")
    tr = TR.read_text(encoding="utf-8")
    en = EN.read_text(encoding="utf-8")
    support = SUPPORT.read_text(encoding="utf-8")

    print("• fontlar gömülüyor...")
    fonts = inline_fonts_css()

    # --- tek dosya ---
    td = DIST / "tek-dosya"
    td.mkdir(parents=True, exist_ok=True)
    tr_single = single_file(tr, fonts, support, {
        './Atlas-Kitap.dc.html"': './Herkes-Icin-Yapay-Zeka-TR.html"',
        './Atlas-Kitap-EN.dc.html"': './AI-for-Everyone-EN.html"',
    })
    en_single = single_file(en, fonts, support, {
        './Atlas-Kitap.dc.html"': './Herkes-Icin-Yapay-Zeka-TR.html"',
        './Atlas-Kitap-EN.dc.html"': './AI-for-Everyone-EN.html"',
    })
    (td / "Herkes-Icin-Yapay-Zeka-TR.html").write_text(tr_single, encoding="utf-8")
    (td / "AI-for-Everyone-EN.html").write_text(en_single, encoding="utf-8")
    print(f"• tek-dosya: TR {len(tr_single)//1024} KB, EN {len(en_single)//1024} KB")

    # --- web ---
    web = DIST / "web"
    web.mkdir(parents=True, exist_ok=True)
    tr_web = tr.replace('./Atlas-Kitap.dc.html"', './index.html"').replace('./Atlas-Kitap-EN.dc.html"', './en.html"')
    en_web = en.replace('./Atlas-Kitap.dc.html"', './index.html"').replace('./Atlas-Kitap-EN.dc.html"', './en.html"')
    (web / "index.html").write_text(tr_web, encoding="utf-8")
    (web / "en.html").write_text(en_web, encoding="utf-8")
    (web / "support.js").write_text(support, encoding="utf-8")
    # ücretsiz vitrin (M1'in ilk 2 alt konusu)
    demo = demo_variant(tr_web)
    (web / "demo.html").write_text(demo, encoding="utf-8")
    store_demo = ROOT / "store" / "demo"
    if store_demo.is_dir():
        (store_demo / "demo.html").write_text(demo, encoding="utf-8")
        (store_demo / "support.js").write_text(support, encoding="utf-8")
        print("• store/demo güncellendi (ilk 3 konu)")
    print(f"• web: index.html, en.html, demo.html (ilk 3 konu), support.js")

    # --- gated (satılan çevrimiçi sürüm; filigran yuvalı) ---
    gd = DIST / "gated"
    gd.mkdir(parents=True, exist_ok=True)
    (gd / "book-tr.html").write_text(gated_variant(tr_single, "Lisans:"), encoding="utf-8")
    (gd / "book-en.html").write_text(gated_variant(en_single, "Licensed to"), encoding="utf-8")
    print("• gated: book-tr.html, book-en.html (filigran yuvalı)")
    print("BİTTİ →", DIST)


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rota manifestinden (tools/site/routes.json) kamu sayfalarının head bloğunu, store/sitemap.xml,
store/robots.txt ve store/llms.txt dosyalarını üretir. Demo sayfalarının head'ini build.py aynı manifestten yazar.
Kullanım: python3 tools/site/gen_site.py   (sonra python3 build.py)"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import seo
ROOT = seo.ROOT; os.chdir(ROOT)
m = seo.load()
OLD = re.compile(r'^(?:<title>.*?</title>|<meta name="(?:description|robots)"[^>]*>|<meta property="og:[a-z_]+"[^>]*>|'
                 r'<link rel="(?:alternate|canonical)"[^>]*>)\n', re.M)
for r in m['routes']:
    if r.get('generated_by'):
        continue
    p = r['file']; s = open(p, encoding='utf-8').read(); block = seo.head_block(m, r['id'])
    if seo.BEGIN in s:
        a = s.index(seo.BEGIN); b = s.index(seo.END, a) + len(seo.END)
        s = s[:a] + block + s[b:]
    else:
        head_end = s.index('</head>'); head = OLD.sub('', s[:head_end])
        vp = '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        assert vp in head, p
        head = head.replace(vp, vp + block + '\n', 1)
        s = head + s[head_end:]
    open(p, 'w', encoding='utf-8').write(s)
# sitemap: yalnız index=true rotalar; dil eşleri xhtml:link; lastmod yok (kararlar.lastmod)
xs = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for r in m['routes']:
    if not r['index']:
        continue
    alt = m['by_id'][r['alt']]
    xs.append('  <url>')
    xs.append(f'    <loc>{seo.abs_url(m, r["url"])}</loc>')
    for x in sorted([r, alt], key=lambda x: x['lang'] != 'tr'):
        xs.append(f'    <xhtml:link rel="alternate" hreflang="{x["lang"]}" href="{seo.abs_url(m, x["url"])}"/>')
    if r.get('x_default'):
        xs.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{seo.abs_url(m, "/")}"/>')
    xs.append('  </url>')
xs.append('</urlset>')
open('store/sitemap.xml', 'w', encoding='utf-8').write('\n'.join(xs) + '\n')
open('store/robots.txt', 'w', encoding='utf-8').write(
    '# Tarama politikası: kamu sayfaları taranabilir. Özel içerik (okuyucu, satın alma, yönetim) sunucu yetkilendirmesi\n'
    '# ve private storage ile korunur; o sayfalar noindex taşır. robots.txt bir erişim kontrolü değildir.\n'
    'User-agent: *\nAllow: /\n\n' f'Sitemap: {m["site"]}/sitemap.xml\n')
by = m['by_id']
L = lambda rid: f'{seo.abs_url(m, by[rid]["url"])}'
open('store/llms.txt', 'w', encoding='utf-8').write(f"""# Herkes İçin Yapay Zekâ / AI for Everyone

> Onur Önder'in interaktif dijital kitabı: kurallardan derin öğrenmeye yapay zekâ, 8 bölüm ve 45 canlı demo; Basit ve Teknik okuma modları, Türkçe ve İngilizce. Kitabın tamamı satın alındıktan sonra okunur; aşağıdaki bağlantılar kamuya açıktır.

## Türkçe
- [Ana sayfa]({L('home-tr')}): kitabın tanıtımı, içindekiler, fiyat ve sık sorulan sorular
- [Ücretsiz demo]({L('demo-tr')}): ilk bölümden üç konu, canlı demolarıyla
- [Hakkımızda]({L('about-tr')}): kitap, yazar ve satıcı
- [Yasal metinler]({L('legal-tr')}): ön bilgilendirme, mesafeli satış, teslimat ve iade, lisans, gizlilik

## English
- [Home]({L('home-en')}): about the book, contents, price and FAQ
- [Free demo]({L('demo-en')}): three topics from the first chapter with their live demos
- [About]({L('about-en')}): the book, the author and the seller
- [Legal information]({L('legal-en')}): summary of the terms (the Turkish text is binding)
""")
print('gen_site: head blokları', sum(1 for r in m['routes'] if not r.get('generated_by')), '· sitemap', sum(1 for r in m['routes'] if r['index']), 'URL · robots.txt · llms.txt')

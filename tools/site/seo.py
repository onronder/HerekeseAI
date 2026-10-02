# -*- coding: utf-8 -*-
"""Rota manifestinden (tools/site/routes.json) head bloğu üretir. gen_site.py ve build.py ortak kullanır."""
import html, json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MAN = os.path.join(ROOT, 'tools', 'site', 'routes.json')
BEGIN, END = '<!-- SEO:BEGIN (tools/site/gen_site.py üretir; elle düzenlemeyin) -->', '<!-- SEO:END -->'
LOCALE = {'tr': 'tr_TR', 'en': 'en_US'}


def load():
    m = json.load(open(MAN, encoding='utf-8'))
    m['by_id'] = {r['id']: r for r in m['routes']}
    return m


def abs_url(m, path):
    return m['site'] + path


def head_block(m, rid):
    r = m['by_id'][rid]; alt = m['by_id'][r['alt']]; e = lambda s: html.escape(s, quote=True)
    lines = [BEGIN,
             f'<title>{e(r["title"])}</title>',
             f'<meta name="description" content="{e(r["description"])}">',
             f'<meta name="robots" content="{"index, follow" if r["index"] else "noindex, nofollow"}">',
             f'<link rel="canonical" href="{abs_url(m, r["url"])}">']
    pair = sorted([r, alt], key=lambda x: x['lang'] != 'tr')
    for x in pair:
        lines.append(f'<link rel="alternate" hreflang="{x["lang"]}" href="{abs_url(m, x["url"])}">')
    if r.get('x_default'):
        lines.append(f'<link rel="alternate" hreflang="x-default" href="{abs_url(m, "/")}">')
    lines += [f'<meta property="og:type" content="website">',
              f'<meta property="og:url" content="{abs_url(m, r["url"])}">',
              f'<meta property="og:title" content="{e(r.get("og_title", r["title"]))}">',
              f'<meta property="og:description" content="{e(r.get("og_description", r["description"]))}">',
              f'<meta property="og:locale" content="{LOCALE[r["lang"]]}">',
              END]
    return '\n'.join(lines)

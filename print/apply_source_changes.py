#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bölüm dosyalarındaki <!-- SOURCE-CHANGES … --> bloklarını (ESKİ ||| YENİ) dijital kitabın HTML kaynağına uygular.
Kullanım: python3 print/apply_source_changes.py tr|en [--dry-run] [--report DOSYA]

Üç kademe:
 1. ESKİ metin HTML'de birebir (düz ya da \\uXXXX kaçışlı) tek kez geçiyorsa → doğrudan değiştirilir.
 2. Geçmiyorsa ESKİ çoğu kez basılıya uyarlanmış (ör. "Aşağıda" → "Şekil 3.2'de") bir paragraftır: book.json'daki en
    yakın kaynak paragraf bulunur (benzerlik ≥ 0.55) ve ESKİ→YENİ arasındaki kelime düzeyi farklar, yalnız web
    paragrafında da aynen geçen bölgelere uygulanır. Basılı uyarlama bölgesine denk gelen farklar atlanır ve raporlanır.
 3. Hiçbiri olmazsa BULUNAMADI.
YENİ = [SİL]/[DELETE] satırları dijitale uygulanmaz (basılıdan çıkarılan ekran-tekrarı paragraflar)."""
import difflib, glob, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang = sys.argv[1]; dry = '--dry-run' in sys.argv
report_path = sys.argv[sys.argv.index('--report') + 1] if '--report' in sys.argv else None
html_path = os.path.join(ROOT, 'Atlas-Kitap.dc.html' if lang == 'tr' else 'Atlas-Kitap-EN.dc.html')
html = open(html_path, encoding='utf-8').read()
ESC = {'’': '\\u2019', '‘': '\\u2018', '“': '\\u201c', '”': '\\u201d', '—': '\\u2014', '–': '\\u2013', '…': '\\u2026'}
PREFIX = re.compile(r'^(?:>\s*)?(?:\*(?:What is happening\?|Ne oluyor\?)\*\s*|\*\*(?:Margin note|Kenar notu)\.\*\*\s*)')

def esc_all(t):
    for k, x in ESC.items(): t = t.replace(k, x)
    return t
def variants(t):
    v = [t]
    e = esc_all(t)
    if e != t: v.append(e)
    e2 = t.replace('’', '\\u2019').replace('‘', '\\u2018')
    if e2 not in v: v.append(e2)
    return v
def find_unique(t):
    """HTML'de tek kez geçen varyantı döndürür; (hit, count) — count>1 çoklu, 0 yok."""
    for ov in variants(t):
        n = html.count(ov)
        if n == 1: return ov, 1
        if n > 1: return None, n
    return None, 0

# kaynak paragraf havuzu (book.json)
book = json.load(open(os.path.join(ROOT, 'print', 'src', lang, 'book.json'), encoding='utf-8'))
paras = []
for mod in book['modules']:
    for sec in mod['sections']:
        for k in ('basit', 'teknik'):
            paras += [(f"{mod['n']}/{sec['id']}/{k}", p) for p in (sec.get(k) or [])]
        if sec.get('tip'): paras.append((f"{mod['n']}/{sec['id']}/tip", sec['tip']))
        d = sec.get('demo') or {}
        paras += [(f"{mod['n']}/{sec['id']}/{k}", d[k]) for k in ('neOluyorBasit', 'neOluyor') if d.get(k)]
striptags = lambda t: re.sub(r'<[^>]+>', '', t)

def carry_over(old, new, web):
    """ESKİ→YENİ kelime farklarını web paragrafına taşır. (web_yeni, uygulanan, atlanan, atlanan_örnekler)"""
    a, b = old.split(), new.split()
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    applied = skipped = 0; notes = []
    out = web
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal': continue
        oldspan, newspan = a[i1:i2], b[j1:j2]
        done = False
        for ctx in (2, 1, 0):
            pre, post = a[max(0, i1 - ctx):i1], a[i2:i2 + ctx]
            if not oldspan and ctx == 0: break
            probe = ' '.join(pre + oldspan + post)
            if not probe: continue
            if out.count(probe) == 1:
                out = out.replace(probe, ' '.join(pre + newspan + post), 1)
                done = True; break
        if done: applied += 1
        else:
            skipped += 1; notes.append(f'“{" ".join(oldspan)[:60]}” → “{" ".join(newspan)[:60]}”')
    out = re.sub(r' {2,}', ' ', out).strip()
    out = re.sub(r' ([,;.!?])', r'\1', out)
    return out, applied, skipped, notes

applied = missing = ambiguous = skipped = carried = partial = 0
rep = []
# Elle gözden geçirilmiş web değişiklikleri (WEB_ESKİ ||| WEB_YENİ); önce uygulanır, aynı paragrafa otomatik taşıma yapılmaz.
ov_path = sys.argv[sys.argv.index('--overrides') + 1] if '--overrides' in sys.argv else os.path.join(ROOT, 'print', 'kitap', f'web-overrides-{lang}.md')
overrides = {}
if os.path.exists(ov_path):
    for line in open(ov_path, encoding='utf-8'):
        if '|||' not in line: continue
        o, n = [x.strip() for x in line.split('|||', 1)]
        if o: overrides[o] = n
ov_applied = ov_same = ov_missing = 0
for o, n in overrides.items():
    hit, cnt = find_unique(o)
    if not hit:
        ov_missing += 1; print(f'  OVERRIDE BULUNAMADI ({cnt}): {o[:80]}…'); continue
    if o == n: ov_same += 1; continue
    nv = esc_all(n) if hit != o else n
    if not dry: html = html.replace(hit, nv, 1)
    ov_applied += 1
def overridden(t):
    return t in overrides or PREFIX.sub('', t) in overrides
for f in sorted(glob.glob(os.path.join(ROOT, 'print', 'src', lang, 'M0*-*.md'))):
    md = open(f, encoding='utf-8').read()
    fn = os.path.basename(f)
    for blk in re.findall(r'<!-- SOURCE-CHANGES\n(.*?)-->', md, re.S):
        for line in blk.strip().split('\n'):
            if '|||' not in line: continue
            old, new = [x.strip() for x in line.split('|||', 1)]
            if not old: continue
            if new.strip('[] ').upper() in ('SİL', 'SIL', 'DELETE', 'REMOVE'):
                skipped += 1; continue
            old, new = PREFIX.sub('', old), PREFIX.sub('', new)
            if overridden(old): continue  # elle yazılmış web sürümü uygulandı
            hit, n = find_unique(old)
            if n > 1:
                ambiguous += 1; print(f'  ÇOKLU ({n}): {fn}: {old[:70]}…'); continue
            if hit:
                nv = esc_all(new) if hit != old else new
                if not dry: html = html.replace(hit, nv, 1)
                applied += 1; continue
            # kademe 2: en yakın kaynak paragraf
            cand = max(paras, key=lambda p: difflib.SequenceMatcher(None, old, striptags(p[1]), autojunk=False).ratio())
            r = difflib.SequenceMatcher(None, old, striptags(cand[1]), autojunk=False).ratio()
            web = striptags(cand[1])
            if r >= 0.55 and overridden(web): continue  # bu paragraf için elle yazılmış web sürümü var
            whit, wn = find_unique(web) if r >= 0.55 else (None, 0)
            if not whit:
                missing += 1; print(f'  BULUNAMADI: {fn}: {old[:80]}…  (en yakın {cand[0]} r={r:.2f}, html eşleşme {wn})')
                rep.append(f'## BULUNAMADI · {fn} · en yakın {cand[0]} r={r:.2f}\nESKİ ||| {old}\nYENİ ||| {new}\nWEB ||| {web}\n')
                continue
            webtxt = whit if whit == web else web  # düz metin üzerinde çalış, sonra kaçışla
            new_web, ap, sk, notes = carry_over(old, new, webtxt)
            if ap == 0:
                missing += 1; print(f'  TAŞINAMADI: {fn}: {old[:80]}…  ({cand[0]}, {sk} fark basılıya özgü)')
                rep.append(f'## TAŞINAMADI · {fn} · {cand[0]}\nESKİ ||| {old}\nYENİ ||| {new}\nWEB ||| {web}\n')
                continue
            if new_web != webtxt:
                nv = esc_all(new_web) if whit != web else new_web
                if not dry: html = html.replace(whit, nv, 1)
            carried += 1
            if sk:
                partial += 1
                print(f'  KISMİ ({ap} uygulandı, {sk} atlandı): {fn}: {old[:60]}…')
                rep.append(f'## KISMİ · {fn} · {cand[0]} · atlanan: ' + ' ; '.join(notes) + f'\nESKİ ||| {old}\nYENİ ||| {new}\nWEB_ESKİ ||| {web}\nWEB_YENİ ||| {new_web}\n')
            else:
                rep.append(f'## TAŞINDI · {fn} · {cand[0]}\nWEB_ESKİ ||| {web}\nWEB_YENİ ||| {new_web}\n')
if not dry: open(html_path, 'w', encoding='utf-8').write(html)
if report_path: open(report_path, 'w', encoding='utf-8').write('\n'.join(rep))
print(f'{lang}: doğrudan {applied} · taşındı {carried} (kısmi {partial}) · elle {ov_applied} (aynı {ov_same}, bulunamadı {ov_missing}) · bulunamadı {missing} · çoklu {ambiguous} · atlandı (silme) {skipped}' + (' (dry-run)' if dry else ''))

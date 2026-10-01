#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kapanış raporu: duzeltme-kayitlari.json (99 kayıt) + uygulama-*.md (ajan günlükleri) + kanit.json (ölçümler) → duzeltme-raporu.md
Her kayıt: uygulanan dosya/satır, yapılan, test/kanıt, durum. Belgenin "Kapanış kaydı" şablonuna göre."""
import glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
recs = json.load(open(os.path.join(HERE, 'duzeltme-kayitlari.json'), encoding='utf-8'))
K = json.load(open(os.path.join(HERE, 'kanit.json'), encoding='utf-8')) if os.path.exists(os.path.join(HERE, 'kanit.json')) else {}
logs = {}
for f in sorted(glob.glob(os.path.join(HERE, 'uygulama-*.md'))):
    src = os.path.basename(f).replace('uygulama-', '').replace('.md', '')
    for ln in open(f, encoding='utf-8'):
        m = re.match(r'\s*\|?\s*(R\d{3})\s*\|(.*)$', ln)
        if not m: continue
        parts = [x.strip() for x in m.group(2).strip().strip('|').split('|')]
        if len(parts) < 3: continue
        logs.setdefault(m.group(1), []).append((src, parts[0], ' | '.join(parts[1:-1]), parts[-1]))
# üretim/dizgi kayıtları için kanıt eşlemesi (ajan günlüğü yerine ölçüm)
prod = json.load(open(os.path.join(HERE, 'uretim-kanit.json'), encoding='utf-8')) if os.path.exists(os.path.join(HERE, 'uretim-kanit.json')) else {}
def status(rid):
    if rid in prod: return prod[rid].get('durum', 'uygulandı'), prod[rid].get('kanit', '')
    rows = logs.get(rid, [])
    if not rows: return 'KAYIT YOK', ''
    st = [r[3].lower() for r in rows]
    # kapsam devri ("figür ajanı", "kapsam dışı", "gerek yok"…) başka bir günlükte uygulandıysa açık sayılmaz
    DEVIR = ('kapsam', 'ajan', 'gerek yok', 'nota yaz', 'ilgili terim yok', 'dışında', 'not olarak')
    applied = any(s.startswith('uygulandı') or ' | uygulandı' in s for s in st)
    rest = [s for s in st if not (s.startswith('uygulandı') or ' | uygulandı' in s)]
    rest = [s for s in rest if not (applied and any(d in s for d in DEVIR))]
    extra = prod.get(rid + '_baglanti', {}).get('kanit', '')
    rest = [s for s in rest if not (extra and 'erişim testi' in ' '.join(r[2].lower() for r in rows if r[3].lower() == s))]
    if applied and not rest: return 'uygulandı', extra
    if any('uygulanmadı' in s for s in rest): return 'kısmen/açık', extra
    return ('kısmen' if rest else 'uygulandı'), extra
out = ['# Düzeltme belgesi kapanış raporu — 99 kayıt', '', f"Üretildi: {__import__('datetime').date.today().isoformat()} · kanıt ölçümleri `kanit.json`, ajan günlükleri `uygulama-*.md`, kayıt tanımları `duzeltme-kayitlari.json`.", '',
       '> **2026-10-01 doğrulama turu:** bağımsız doğrulama raporunun açık bıraktığı 33 kayıt (R002, R004, R007, R012, R018, R024, R031, R033, R037, R040, R041, R043, R050, R053, R055, R056, R057, R059, R069, R071, R073, R076, R079, R080, R081, R082, R084, R085, R089, R095, R097, R098, R099) yeniden düzeltildi; kayıt başına dosya:satır, test, beklenen/gözlenen, kanıt ve kalan dış koşul `dogrulama-33-raporu.md` içinde (üretici `dogrulama33.py`). O kayıtlar için bu raporun satırları yerine o rapor geçerlidir.', '']
if K:
    out += ['## Çıktı kimlikleri (SHA256) ve sayfa sayıları', '']
    for k, v in K.get('hash', {}).items(): out.append(f'- `{k}`: {v} · sayfa {K.get("pages", {}).get(k, "-")}')
    out += ['', '## Ölçümler (özet)', '']
    out.append(f"- Yer tutucu: TR {K['placeholders']['tr']} · EN {K['placeholders']['en']}")
    out.append(f"- Metin bütünlüğü: TR `{K['integrity']['tr'].splitlines()[0]}` · EN `{K['integrity']['en'].splitlines()[0]}`")
    out.append(f"- QR: TR `{K['qr']['tr'].splitlines()[0]} / {K['qr']['tr'].splitlines()[1] if len(K['qr']['tr'].splitlines())>1 else ''}` · EN `{K['qr']['en'].splitlines()[0]}`")
    out.append(f"- EAN (TR kapak, SVG geometrisi): {K.get('ean')} (hedef normal çubuk ≥ 23,3 mm)")
    out.append(f"- Siyah ayrımı (inkcov s.15 / kapak): {K['ink']} · renk operatörleri (zengin siyah / `0 g`): {K['ink_ops']}")
    out.append(f"- Dizin: TR HTML {K['index']['tr']['html']} / PDF {K['index']['tr']['pdf_found']} (eksik {K['index']['tr']['missing']}, tekrar {K['index']['tr']['dup_pages']}) · EN HTML {K['index']['en']['html']} / PDF {K['index']['en']['pdf_found']} (eksik {K['index']['en']['missing']}, tekrar {K['index']['en']['dup_pages']})")
    out.append(f"- Figür etiket puntoları: {K.get('fig_fonts', '')}")
    out.append(f"- EN görünür Türkçe dize: {K.get('en_turkish_visible')}")
    out.append(f"- Canlı demo URL: {K.get('live_urls')}")
    out.append(f"- EPUB: {K['epub']}")
    out.append(f"- Denetleyiciler: {K['checkers']}")
    out.append('')
out += ['## Kayıt bazında durum', '', '| Kayıt | Başlık | Durum | Uygulanan yer ve değişiklik | Kanıt / test |', '|---|---|---|---|---|']
counts = {}
for r in recs:
    st, ev = status(r['id'])
    counts[st.split('/')[0]] = counts.get(st.split('/')[0], 0) + 1
    rows = logs.get(r['id'], [])
    where = '<br>'.join(f'`{w}` — {d}' for _, w, d, _ in rows)[:900] if rows else (prod.get(r['id'], {}).get('yer', ''))
    out.append(f"| {r['id']} | {r['title'][:60]} | {st} | {where} | {ev or r['kabul'][:220]} |")
out += ['', f'Özet: {counts}', '', '## Açık kalanlar (yazar / matbaa / cihaz)', '']
for r in recs:
    st, ev = status(r['id'])
    if st != 'uygulandı': out.append(f"- {r['id']} {r['title']}: {st} — {ev or (logs.get(r['id'], [('', '', '', '')])[0][3])}")
open(os.path.join(HERE, 'duzeltme-raporu.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('duzeltme-raporu.md:', counts)

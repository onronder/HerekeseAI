#!/usr/bin/env python3
"""Bir .sql dosyasındaki her sorguyu bağlı Supabase projesinde AYRI çalıştırır (SQL Editor yalnız sonuncuyu gösterir).
Kullanım (Final kökünden):  python3 tests/p2/sql/sorgula.py tests/p2/sql/p2-0-envanter.sql
Çıktı ekrana ve tests/p2/out/<dosya>.txt'ye yazılır (gitignore). Yalnız salt okunur dosyalar için kullanın."""
import pathlib, re, subprocess, sys

src = pathlib.Path(sys.argv[1])
text = "\n".join(l for l in src.read_text().splitlines() if not l.lstrip().startswith("--"))
stmts = [s.strip() for s in re.split(r";\s*\n", text + "\n") if s.strip()]
out_dir = pathlib.Path("tests/p2/out"); out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / (src.stem + ".txt")
log = []
for i, s in enumerate(stmts, 1):
    head = f"\n### {i}/{len(stmts)}: {' '.join(s.split())[:110]}"
    r = subprocess.run(["supabase", "db", "query", "--linked", "-o", "table", s + ";"], capture_output=True, text=True)
    body = r.stdout.strip() or r.stderr.strip()
    print(head); print(body); log += [head, body]
out.write_text("\n".join(log) + "\n")
print(f"\n→ {out}")

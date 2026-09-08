#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
dist/gated/ altındaki filigran-yuvalı kitap dosyalarını Supabase Storage'daki
private `book` bucket'ına yükler (upsert).

Kullanım:
  SUPABASE_URL=https://<ref>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=... \
  python3 upload_book.py

Service role anahtarı YALNIZ ortam değişkeninden okunur; asla repo'ya yazılmaz.
"""
import os
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).parent
FILES = ["book-tr.html", "book-en.html"]


def main() -> int:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        print("HATA: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri gerekli.")
        return 1
    for name in FILES:
        path = ROOT / "dist" / "gated" / name
        if not path.exists():
            print(f"HATA: {path} yok — önce `python3 build.py` çalıştır.")
            return 1
        data = path.read_bytes()
        req = urllib.request.Request(
            f"{url}/storage/v1/object/book/{name}",
            data=data,
            method="POST",
            headers={
                "Authorization": f"Bearer {key}",
                "apikey": key,
                "Content-Type": "text/html; charset=utf-8",
                "x-upsert": "true",
            },
        )
        with urllib.request.urlopen(req, timeout=60) as r:
            print(f"• {name}: {r.status} ({len(data)//1024} KB)")
    print("Yükleme tamam.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

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
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).parent
FILES = ["book-tr.html", "book-en.html"]


def main() -> int:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        print("HATA: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri gerekli.")
        return 1
    # Yapıştırmada gelen boşluk ve tırnakları (düz ve kıvrık: ' " ‘ ’ “ ”) uçlardan temizle.
    key = key.strip().strip("'\"‘’“”` ").strip()
    if len(key) < 30:
        print(f"HATA: anahtar çok kısa ({len(key)} karakter); yapıştırma boş gelmiş olabilir.")
        return 1
    bad = [(i + 1, f"U+{ord(c):04X}") for i, c in enumerate(key) if ord(c) > 126 or ord(c) < 33]
    if bad:
        # Anahtarın kendisi yazdırılmaz; yalnız uzunluk ve sorunlu karakterlerin yeri/kodu.
        print(f"HATA: anahtar {len(key)} karakter ve geçersiz karakter içeriyor: {bad[:5]}"
              f" (ör. U+2019 = kıvrık kesme işareti). Yapıştırmaya fazladan metin karışmış;"
              f" anahtarı Supabase panelinden yeniden kopyalayıp tek başına yapıştır.")
        return 1
    print(f"anahtar uzunluğu: {len(key)} karakter")
    # İki anahtar biçimi: eski service_role JWT (eyJ…) → Authorization Bearer; yeni sb_secret_… → yalnız apikey.
    headers = {"apikey": key, "Content-Type": "text/html; charset=utf-8", "x-upsert": "true"}
    if key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {key}"
    print(f"anahtar biçimi: {'service_role JWT' if key.startswith('eyJ') else 'sb_secret (apikey)'}")
    for name in FILES:
        path = ROOT / "dist" / "gated" / name
        if not path.exists():
            print(f"HATA: {path} yok — önce `python3 build.py` çalıştır.")
            return 1
        data = path.read_bytes()
        req = urllib.request.Request(f"{url}/storage/v1/object/book/{name}", data=data, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                print(f"• {name}: {r.status} ({len(data)//1024} KB)")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")[:300]
            print(f"HATA: {name}: HTTP {e.code} — {body}")
            return 1
    print("Yükleme tamam.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

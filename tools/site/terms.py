#!/usr/bin/env python3
"""Satış koşullarının değişmez kopyası (sözleşme kanıtı).

Ödeme öncesinde gösterilen koşullar (yasal sayfanın sözleşme bölümleri + onay beyanları) sürümlü düz metne çevrilir,
SHA-256 ile özetlenir ve değiştirilemez dosya olarak yayımlanır:

  store/kosullar/<sürüm>-tr.txt   bağlayıcı Türkçe metin (Ön Bilgilendirme, Mesafeli Satış, Teslimat ve İade, Telif, satıcı)
  store/kosullar/<sürüm>-en.txt   İngilizce özet (bilgi amaçlı; bağlayıcı olan Türkçe metin)
  store/kosullar/manifest.json    sürüm → dosya özetleri (yayımlanan dosyalar asla değişmez)
  supabase/sql/kosullar-<sürüm>.sql  book_policy_version satırları (veritabanı özeti içerikle ayrıca doğrular)

Sürüm store/assets/config.js TERMS_VERSION'dan okunur; sunucudaki TERMS_VERSION ile aynı olmalıdır.

  python3 tools/site/terms.py --write   yeni sürümün dosyalarını üretir (var olan sürümü farklı içerikle EZMEZ)
  python3 tools/site/terms.py --check   yayımlanan dosyalar manifestle, güncel sayfa metni güncel sürümle aynı mı (CI)

Koşul metni değişirse sürüm de değişmelidir: --check, sürüm değişmeden metin değiştiğinde hata verir.
"""
import hashlib
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORE = ROOT / "store"
OUT = STORE / "kosullar"
SQL_DIR = ROOT / "supabase" / "sql"
SITE = "https://book.onuronder.com"

# Bağlayıcı Türkçe metnin bölümleri (yasal sayfadaki h2 kimlikleri, bu sırayla). KVKK, çerez ve uluslararası
# bölümler aydınlatma metnidir; sözleşme kabulünün parçası değildir.
TR_SECTIONS = ["hakkinda", "iletisim", "on-bilgilendirme", "mesafeli-satis", "teslimat-iade", "telif"]
EN_EXCLUDE = {"privacy"}


def version() -> str:
    m = re.search(r'TERMS_VERSION:\s*"([^"]+)"', (STORE / "assets" / "config.js").read_text(encoding="utf-8"))
    if not m:
        sys.exit("config.js: TERMS_VERSION bulunamadı")
    return m.group(1)


def to_text(fragment: str) -> str:
    """HTML parçasını kararlı düz metne çevirir: başlık '## ', paragraflar boş satırla ayrılır."""
    s = re.sub(r"<!--.*?-->", "", fragment, flags=re.S)
    s = re.sub(r"<h2[^>]*>(.*?)</h2>", lambda m: "\n\n## " + m.group(1) + "\n\n", s, flags=re.S)
    s = re.sub(r"</p\s*>|<br\s*/?>|</li\s*>", "\n\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    paras = []
    for block in re.split(r"\n\s*\n", s):
        t = " ".join(block.split())
        if t:
            paras.append(t)
    return "\n\n".join(paras)


def sections(page: str) -> list[tuple[str, str]]:
    """(kimlik, html) listesi: her h2'den bir sonraki h2'ye (ya da kapsayıcı sonuna) kadar."""
    body = page[page.index("<body"):]
    body = body[:body.rfind("</section>")] if "</section>" in body else body
    body = body[:body.find("<footer")] if "<footer" in body else body  # alt bilgi (bağlantılar, logolar) metne girmez
    parts = re.split(r"(?=<h2\b)", body)
    out = []
    for p in parts:
        m = re.match(r'<h2\b([^>]*)>', p)
        if not m:
            continue
        idm = re.search(r'id="([^"]+)"', m.group(1))
        out.append((idm.group(1) if idm else "", p))
    return out


def js_string(src: str, key: str, nth: int) -> str:
    """store.js sözlüğünden 'key: "..." + "..."' biçimli dizeyi okur (nth: 0 TR, 1 EN)."""
    hits = [m.end() for m in re.finditer(r"\b" + re.escape(key) + r":\s*", src)]
    if len(hits) <= nth:
        sys.exit(f"store.js: {key} bulunamadı")
    i, parts = hits[nth], []
    while True:
        m = re.match(r'\s*(["`])((?:\\.|(?!\1).)*)\1\s*', src[i:], flags=re.S)
        if not m:
            break
        parts.append(m.group(2))
        i += m.end()
        if src[i:i + 1] != "+":
            break
        i += 1
    if not parts:
        sys.exit(f"store.js: {key} bir dize değil")
    raw = "".join(parts).replace('\\"', '"').replace("\\'", "'")
    raw = re.sub(r"\$\{[^}]*\}", "", raw)  # şablon değişkenleri (sürüm bağlantısı) metne girmez
    return " ".join(to_text(raw).split())


def bundle(v: str) -> dict[str, str]:
    js = (STORE / "assets" / "store.js").read_text(encoding="utf-8")
    tr_page = (STORE / "yasal.html").read_text(encoding="utf-8")
    en_page = (STORE / "en" / "legal.html").read_text(encoding="utf-8")

    tr_map = dict(sections(tr_page))
    missing = [k for k in TR_SECTIONS if k not in tr_map]
    if missing:
        sys.exit(f"yasal.html: bölüm bulunamadı: {missing}")
    tr_body = "\n\n".join(to_text(tr_map[k]) for k in TR_SECTIONS)
    tr = (f"# Herkes İçin Yapay Zekâ — Satış koşulları\n\nSürüm: {v} · Dil: Türkçe (bağlayıcı metin)\n"
          f"Kaynak: {SITE}/yasal\n\n{tr_body}\n\n## Ödeme öncesi onay beyanları\n\n"
          f"1. {js_string(js, 'consentContractLabel', 0)}\n\n2. {js_string(js, 'consentLabel', 0)}\n")

    en_body = "\n\n".join(to_text(h) for k, h in sections(en_page) if k not in EN_EXCLUDE)
    en = (f"# AI for Everyone — Terms of sale (English summary)\n\nVersion: {v} · Language: English (summary; the Turkish "
          f"original is legally binding: {SITE}/kosullar/{v}-tr.txt)\nSource: {SITE}/en/legal\n\n{en_body}\n\n"
          f"## Statements given before payment\n\n1. {js_string(js, 'consentContractLabel', 1)}\n\n"
          f"2. {js_string(js, 'consentLabel', 1)}\n")
    return {"tr": tr, "en": en}


def sha(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def sql_for(v: str, texts: dict[str, str]) -> str:
    rows = []
    for loc, t in texts.items():
        if "$kosul$" in t:
            sys.exit("metin dolar alıntı işaretini içeriyor")
        rows.append(f"  ('terms_bundle', '{loc}', '{v}', '{sha(t)}', $kosul${t}$kosul$, '/kosullar/{v}-{loc}.txt')")
    return (f"-- Satış koşulları sürüm {v} (tools/site/terms.py üretir; elle düzenlemeyin).\n"
            f"-- Çalıştırma: supabase db query --linked -f supabase/sql/kosullar-{v}.sql\n"
            "-- Satırlar değiştirilemez (tetikleyici); veritabanı content_hash'i içerikten yeniden hesaplayıp doğrular.\n"
            "INSERT INTO public.book_policy_version (kind, locale, version, content_hash, content, immutable_path) VALUES\n"
            + ",\n".join(rows) + "\nON CONFLICT (kind, locale, version) DO NOTHING;\n\n"
            f"SELECT kind, locale, version, content_hash FROM public.book_policy_version WHERE version = '{v}' ORDER BY locale;\n")


def load_manifest() -> dict:
    f = OUT / "manifest.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}


def write() -> None:
    v = version()
    texts = bundle(v)
    man = load_manifest()
    OUT.mkdir(parents=True, exist_ok=True)
    for loc, t in texts.items():
        f = OUT / f"{v}-{loc}.txt"
        if f.exists() and f.read_text(encoding="utf-8") != t:
            sys.exit(f"{f.name} farklı içerikle zaten yayımlanmış: koşul metni değiştiyse config.js TERMS_VERSION'ı yükseltin")
        f.write_text(t, encoding="utf-8")
    man[v] = {loc: sha(t) for loc, t in texts.items()}
    (OUT / "manifest.json").write_text(json.dumps(man, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (SQL_DIR / f"kosullar-{v}.sql").write_text(sql_for(v, texts), encoding="utf-8")
    for loc, t in texts.items():
        print(f"• {v}-{loc}.txt  sha256 {sha(t)}  ({len(t)} karakter)")
    print(f"• supabase/sql/kosullar-{v}.sql")


def check() -> int:
    v = version()
    errs = []
    man = load_manifest()
    for ver, locs in man.items():
        for loc, h in locs.items():
            f = OUT / f"{ver}-{loc}.txt"
            if not f.exists():
                errs.append(f"{f.name} yok")
            elif sha(f.read_text(encoding="utf-8")) != h:
                errs.append(f"{f.name} yayımlandıktan sonra değişmiş (yayımlanan koşul dosyaları değiştirilemez)")
    if v not in man:
        errs.append(f"güncel sürüm {v} için koşul dosyası yok: python3 tools/site/terms.py --write")
    else:
        for loc, t in bundle(v).items():
            if sha(t) != man[v].get(loc):
                errs.append(f"yasal sayfa/onay metni ({loc}) sürüm {v} ile yayımlanandan farklı: TERMS_VERSION'ı yükseltip --write çalıştırın")
        sql = SQL_DIR / f"kosullar-{v}.sql"
        if not sql.exists() or any(h not in sql.read_text(encoding="utf-8") for h in man[v].values()):
            errs.append(f"{sql.name} yok ya da özetler uyuşmuyor")
    for e in errs:
        print("✗ " + e)
    if not errs:
        print(f"✓ koşullar: sürüm {v}, {sum(len(x) for x in man.values())} dosya manifestle aynı; sayfa metni güncel sürümle aynı")
    return 1 if errs else 0


if __name__ == "__main__":
    if "--write" in sys.argv:
        write()
    elif "--check" in sys.argv:
        sys.exit(check())
    else:
        print(__doc__)

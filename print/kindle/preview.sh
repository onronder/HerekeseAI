#!/bin/sh
# Kindle Previewer 4 bağımsız dönüşüm testi (R099/N005) — sh print/kindle/preview.sh [epub]
# Kök neden: macOS yerel ayarı tr_TR iken Previewer'ın gömülü Java'sı (OpenJDK 11) user.language=tr ile açılır ve dönüşüm
# "Not Supported / Error / 0 / 0" ile biter (Türkçe küçük harf: "Info" → "ınfo"). Çözüm: JAVA_TOOL_OPTIONS ile İngilizce yerel ayar.
# Betik üç şeyi kanıtlar ve kaydeder: (A) ayarsız deneme sonucu, (B) ayarlı deneme sonucu, (C) ayarın Java alt süreçlerine fiilen
# ulaştığı (her JVM, JAVA_TOOL_OPTIONS içindeki -Xlog:…:file=jvm-%p.log seçeneğiyle kendi PID'ine bir dosya açar).
# Çıktı: print/kitap/qa/kindle-previewer/{A,B}/Summary_Log.csv, jvm/*.log, OZET.txt, kanit.json; KPF → print/kitap/en/AI-for-Everyone-preview.kpf
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
EPUB="${1:-$ROOT/print/kitap/en/AI-for-Everyone.epub}"
CLI="/Applications/Kindle Previewer 4.app/Contents/MacOS/KindlePreviewer4CLI"
JRE="/Applications/Kindle Previewer 4.app/Contents/Resources/KFXGen/jre/bin/java"
Q="$ROOT/print/kitap/qa/kindle-previewer"
[ -x "$CLI" ] || { echo "Kindle Previewer 4 yok: $CLI"; exit 2; }
rm -rf "${Q:?}/A" "${Q:?}/B" "${Q:?}/C" "${Q:?}/jvmC" "${Q:?}/jvm" "${Q:?}/out" "${Q:?}/exc"; mkdir -p "$Q/A" "$Q/B" "$Q/C" "$Q/jvm" "$Q/jvmC" "$Q/exc/A" "$Q/exc/B"
W="$(mktemp -d)"; cp "$EPUB" "$W/AI-for-Everyone.epub"
SHA="$(shasum -a 256 "$EPUB" | cut -d' ' -f1)"
LOCALE="$(defaults read -g AppleLocale 2>/dev/null || echo ?)"
JLANG_DEF="$("$JRE" -XshowSettings:properties -version 2>&1 | sed -n 's/^ *user.language = //p')"
JLANG_EN="$(JAVA_TOOL_OPTIONS='-Duser.language=en -Duser.country=US' "$JRE" -XshowSettings:properties -version 2>&1 | sed -n 's/^ *user.language = //p')"
# (A) ayarsız — yerel ayar değiştirilmez; yalnız JVM istisna günlüğü açılır (-Xlog:exceptions), asıl Java hatası kaydedilsin
set +e
JAVA_TOOL_OPTIONS="-Xlog:exceptions=info:file=$Q/exc/A/exc-%p.log" "$CLI" "$W/AI-for-Everyone.epub" --convert --output "$Q/A" > "$Q/A/cli.log" 2>&1; EA=$?
# (B) ayarlı + JVM'ye ulaşma kanıtı
JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US -Xlog:gc+init:file=$Q/jvm/jvm-%p.log -Xlog:exceptions=info:file=$Q/exc/B/exc-%p.log" \
  "$CLI" "$W/AI-for-Everyone.epub" --convert --output "$Q/B" > "$Q/B/cli.log" 2>&1; EB=$?
# (C) yaygın hata: değişken export edilmeden atanır (ör. "JAVA_TOOL_OPTIONS=…; KindlePreviewer4CLI …") → ayar Java'ya hiç ulaşmaz
env -u JAVA_TOOL_OPTIONS sh -c 'JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US -Xlog:gc+init:file=$1/jvmC/jvm-%p.log"; "$2" "$3" --convert --output "$1/C"' \
  _ "$Q" "$CLI" "$W/AI-for-Everyone.epub" > "$Q/C/cli.log" 2>&1; EC=$?
set -e
RC="$(tail -1 "$Q/C/Summary_Log.csv" 2>/dev/null | cut -d, -f2-5)"; NJC="$(ls "$Q/jvmC" | wc -l | tr -d ' ')"; MC="$(grep -c 'Failed to get Mobi message stores' "$Q/C/cli.log" || true)"
RA="$(tail -1 "$Q/A/Summary_Log.csv" 2>/dev/null | cut -d, -f2-5)"; RB="$(tail -1 "$Q/B/Summary_Log.csv" 2>/dev/null | cut -d, -f2-5)"
NJVM="$(ls "$Q/jvm" | wc -l | tr -d ' ')"
# kök neden kanıtı: Türkçe küçük harf "Info" → "ınfo" kaynak paketi bulunamıyor; CLI bunu "Failed to get Mobi message stores" diye gösterir
XA="$(cat "$Q"/exc/A/*.log 2>/dev/null | grep -c 'MissingResourceException.*epubprocessor\.ınfo' || true)"
XB="$(cat "$Q"/exc/B/*.log 2>/dev/null | grep -c 'MissingResourceException.*epubprocessor\.ınfo' || true)"
XMSG="$(cat "$Q"/exc/A/*.log 2>/dev/null | grep -o "Can't find bundle for base name [^ ,]*" | head -1)"
MA="$(grep -c 'Failed to get Mobi message stores' "$Q/A/cli.log" || true)"; MB="$(grep -c 'Failed to get Mobi message stores' "$Q/B/cli.log" || true)"
KPF="$(find "$Q/B" -name '*.kpf' | head -1)"
[ -n "$KPF" ] && mv "$KPF" "$ROOT/print/kitap/en/AI-for-Everyone-preview.kpf" && rm -rf "$Q/B/KPF"
rm -rf "$W"
cat > "$Q/kanit.json" <<EOJ
{"tarih": "$(date -u +%Y-%m-%dT%H:%M:%SZ)", "epub_sha256": "$SHA", "macos_AppleLocale": "$LOCALE",
 "gomulu_jre_user_language": {"ayarsiz": "$JLANG_DEF", "JAVA_TOOL_OPTIONS": "$JLANG_EN"},
 "A_ayarsiz": {"exit": $EA, "ozet": "$(echo "$RA" | sed 's/"//g')", "java_istisnasi_inf_o": $XA, "istisna_ornegi": "$XMSG", "cli_mobi_message_stores_uyarisi": $MA},
 "B_JAVA_TOOL_OPTIONS": {"exit": $EB, "ozet": "$(echo "$RB" | sed 's/"//g')", "ayari_alan_java_alt_sureci": $NJVM, "java_istisnasi_inf_o": $XB, "cli_mobi_message_stores_uyarisi": $MB},
 "C_export_edilmemis_atama": {"exit": $EC, "ozet": "$(echo "$RC" | sed 's/"//g')", "ayari_alan_java_alt_sureci": $NJC, "cli_mobi_message_stores_uyarisi": $MC},
 "kpf": "print/kitap/en/AI-for-Everyone-preview.kpf"}
EOJ
{ echo "Kindle Previewer 4 CLI, $(date -u +%Y-%m-%d)"; echo "Girdi EPUB SHA-256: $SHA"; echo "macOS yerel ayarı: $LOCALE · gömülü JRE user.language: ayarsız=$JLANG_DEF, ayarlı=$JLANG_EN";
  echo "A (ayarsız): exit $EA · $RA · Java istisnası ($XMSG): $XA · CLI 'Failed to get Mobi message stores': $MA"
  echo "B (JAVA_TOOL_OPTIONS): exit $EB · $RB · ayarı alan Java alt süreci: $NJVM · aynı istisna: $XB · aynı CLI uyarısı: $MB"; echo "C (export edilmeden atama, yaygın hata): exit $EC · $RC · ayarı alan Java alt süreci: $NJC · CLI 'Failed to get Mobi message stores': $MC"
  echo "Çıktı: print/kitap/en/AI-for-Everyone-preview.kpf"; } > "$Q/OZET.txt"
cat "$Q/OZET.txt"
# (D) arayüz (GUI) A/B — PREVIEW_GUI=1 ile: uygulama kapalıyken open -a ile açılır, dönüşüm çıktısı uygulamanın geçici klasöründen okunur
if [ "${PREVIEW_GUI:-0}" = 1 ]; then
  set +e  # GUI adımları: uygulama kapalıyken pkill/osascript 1 döndürür; ölçüm sonuçları aşağıda ayrıca denetlenir
  TMPK="$(getconf DARWIN_USER_TEMP_DIR)KindlePreviewer"; GQ="$Q/gui"; rm -rf "${GQ:?}"; mkdir -p "$GQ/jvm"
  GW="$(mktemp -d)"; cp "$EPUB" "$GW/AI-for-Everyone.epub"
  gui_run() {  # $1 = etiket, $2 = JAVA_TOOL_OPTIONS değeri ("" = ayarsız)
    osascript -e 'quit app "Kindle Previewer 4"' >/dev/null 2>&1 || true; sleep 3; pkill -f "Kindle Previewer 4.app" 2>/dev/null || true; sleep 1
    rm -rf "${TMPK:?}"/* 2>/dev/null || true
    if [ -n "$2" ]; then JAVA_TOOL_OPTIONS="$2" open -a "Kindle Previewer 4" "$GW/AI-for-Everyone.epub"; else env -u JAVA_TOOL_OPTIONS open -a "Kindle Previewer 4" "$GW/AI-for-Everyone.epub"; fi
    n=0; until [ -n "$(find "$TMPK" -name '*.mobi' 2>/dev/null)" ] || [ $n -ge 120 ]; do sleep 1; n=$((n+1)); done; sleep 3
    n=0; until [ -n "$(find "$TMPK" -name conversionLog.csv 2>/dev/null)" ] || [ $n -ge 60 ]; do sleep 1; n=$((n+1)); done; sleep 2
    M="$(find "$TMPK" -name '*.mobi' 2>/dev/null | head -1)"; L="$(find "$TMPK" -name conversionLog.csv 2>/dev/null | head -1)"
    [ -n "$L" ] && cp "$L" "$GQ/$1-conversionLog.csv"
    echo "$1: önizleme $( [ -n "$M" ] && echo "$(wc -c < "$M" | tr -d ' ') bayt" || echo yok ) · hata satırı $( if [ -n "$L" ]; then grep -c '^"Error",' "$L" || true; else echo '-'; fi )"
  }
  { gui_run A_ayarsiz ""; gui_run B_ayarli "-Duser.language=en -Duser.country=US -Xlog:gc+init:file=$GQ/jvm/jvm-%p.log"; echo "B: ayarı alan Java alt süreci $(ls "$GQ/jvm" | wc -l | tr -d ' ')"; } | tee "$GQ/OZET.txt"
  osascript -e 'quit app "Kindle Previewer 4"' >/dev/null 2>&1; rm -rf "$GW"
fi
case "$RB" in *Supported*Success*\"0\"*\"0\"*) [ "$NJVM" -gt 0 ] && [ "$XA" -gt 0 ] && [ "$XB" -eq 0 ] && exit 0 ;; esac
echo "BAŞARISIZ: ayarlı dönüşüm başarılı değil ya da ayar Java'ya ulaşmadı"; exit 1

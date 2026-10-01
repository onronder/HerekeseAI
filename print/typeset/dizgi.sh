#!/bin/sh
# Baskıya hazır iç blok: el yazması HTML → Paged.js → PDF (RGB) → Ghostscript PDF/X-1a (CMYK, fontlar gömülü, TrimBox).
#   sh print/typeset/dizgi.sh [--lang tr|en] [--profile matbaa|kdp] [--pad N]
#   TR/matbaa → print/kitap/ic-blok.pdf (16'nın katı); EN/kdp → print/kitap/en/kdp-interior.pdf (çift sayfa, 6×9 in, 0.125 in taşma)
# ICC profili: ICC=/yol/ISOcoated_v2_eci.icc (FOGRA39) ya da matbaanın profili; verilmezse Ghostscript default_cmyk.icc kullanılır
# ve OutputConditionIdentifier "Custom" yazılır (matbaa isterse profil değiştirilip yeniden üretilir).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
cd "$HERE"
LANG_=tr; PROFILE=matbaa; ARGS=""
while [ $# -gt 0 ]; do case "$1" in
  --lang) LANG_="$2"; shift 2 ;; --profile) PROFILE="$2"; shift 2 ;; *) ARGS="$ARGS $1"; shift ;; esac; done
# MULT: matbaa 8 (yarım forma; 16 istenirse MULT=16 sh dizgi.sh …), KDP 2 (çift sayfa). TEXT_W: metin genişliği (mm), ölçüm için.
if [ "$LANG_" = tr ] && [ "$PROFILE" = matbaa ]; then O="out"; FINAL="$ROOT/print/kitap/ic-blok.pdf"; TITLE="Herkes İçin Yapay Zekâ"; BLEED_MM=3; MULT="${MULT:-8}"; TEXT_W=124
else O="out/$LANG_-$PROFILE"; mkdir -p "$ROOT/print/kitap/$LANG_"; FINAL="$ROOT/print/kitap/$LANG_/$PROFILE-interior.pdf"; BLEED_MM=3; MULT="${MULT:-8}"; TEXT_W=124
  [ "$LANG_" = en ] && TITLE="AI for Everyone" || TITLE="Herkes İçin Yapay Zekâ"
  [ "$PROFILE" = kdp ] && { BLEED_MM=3.175; MULT=2; TEXT_W=123; }
fi
mkdir -p "$O"
render() { npx pagedjs-cli "$O/ic-blok.html" -o "$O/ic-blok-rgb.pdf" --timeout 600000 $( [ -n "$NOHOOKS" ] || echo --additional-script hooks.js ) 2>&1 | tee "$O/render.log" | grep -E "Rendering|rror|TAŞMA|taşan" || true; }
PLAN="$O/defer.json"; rm -f "$PLAN" "$O/heights.json"
python3 typeset.py --lang "$LANG_" --profile "$PROFILE" $ARGS
render
# sayfa sonu boşlukları: sığmayan şekil blokları izleyen metnin arkasına ertelenir (yüzen şekil); en çok 4 tur
i=0
while [ $i -lt 24 ]; do
  [ -f "$O/heights.json" ] || node measure.mjs "$O/ic-blok.html" "$TEXT_W" "$O/heights.json"
  rc=0; python3 gapplan.py "$O/ic-blok-rgb.pdf" "$O/ic-blok.html" "$O/heights.json" "$LANG_" "$PROFILE" "$PLAN" || rc=$?
  [ "$rc" -eq 3 ] || break
  python3 typeset.py --lang "$LANG_" --profile "$PROFILE" --defer "$PLAN" $ARGS
  render
  i=$((i + 1))
done
# forma: matbaa 16'nın katı, KDP çift sayfa; eksik "Notlar" sayfalarıyla tamamlanır (--pad verilmişse dokunulmaz)
case " $ARGS " in *" --pad "*) ;; *)
  pages=$(pdfinfo "$O/ic-blok-rgb.pdf" | awk '/^Pages/{print $2}')
  pad=$(( (MULT - pages % MULT) % MULT ))
  if [ "$pad" -gt 0 ]; then echo "sayfa $pages → $((pages + pad)) (Notlar ×$pad)"; python3 typeset.py --lang "$LANG_" --profile "$PROFILE" --defer "$PLAN" --pad "$pad"; render; fi ;;
esac

GSICC="$(find /opt/homebrew /usr/local /usr/share -name default_cmyk.icc 2>/dev/null | head -1)"
if [ -n "$ICC" ]; then
  PROF="$ICC"; COND="$(basename "$ICC" .icc)"; CID="FOGRA39"
else
  PROF="$GSICC"; COND="Ghostscript default CMYK (printer profile pending)"; CID="Custom"
fi
[ -f "$PROF" ] || { echo "ICC profili bulunamadı: $PROF"; exit 1; }
TITLE_HEX=$(python3 -c 'import sys; print(sys.argv[1].encode("utf-16-be").hex().upper())' "$TITLE")  # PDF metin dizgisi UTF-16BE (Türkçe karakterler)
sed -e "s|ICCPROFILE|($PROF)|" -e "s|OUTPUTCONDITIONID|$CID|" -e "s|OUTPUTCONDITION|$COND|" -e "s|TITLEHEX|$TITLE_HEX|" PDFX_def.ps > "$O/PDFX_def.ps"

# Sayfa kutuları: MediaBox = kâğıt (net + taşma, Paged.js); BleedBox = MediaBox; TrimBox = taşma kadar içeri (pdf-lib).
node boxes.mjs "$O/ic-blok-rgb.pdf" "$O/ic-blok-boxed.pdf" "$BLEED_MM"
gs -q -dBATCH -dNOPAUSE -dNOSAFER -dPDFX -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress \
   -sColorConversionStrategy=CMYK -dUseFastColor=true -dProcessColorModel=/DeviceCMYK \
   -dEmbedAllFonts=true -dSubsetFonts=true -dCompressFonts=true -dCompatibilityLevel=1.3 \
   -dPrinted=true -dPreserveAnnots=false -dAutoRotatePages=/None -dDownsampleColorImages=false \
   -sOutputICCProfile="$PROF" -sOutputFile="$FINAL" \
   -f "$O/PDFX_def.ps" "$O/ic-blok-boxed.pdf"
echo "→ $FINAL ($(pdfinfo "$FINAL" | awk '/^Pages/{print $2}') sayfa)"

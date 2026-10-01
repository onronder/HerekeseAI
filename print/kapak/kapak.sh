#!/bin/sh
# Kapak: kapak(.en).json → out/kapak*.html → Chrome PDF → Ghostscript PDF/X (CMYK)
#   sh kapak.sh              → print/kitap/kapak.pdf (TR matbaa, 160×240, 5 mm taşma)
#   sh kapak.sh en kdp       → print/kitap/en/kdp-cover.pdf (6×9 in, 0.125 in taşma) + kdp-ebook-cover.jpg (1600×2560, RGB)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"; cd "$HERE"
LANG_="${1:-tr}"; PROFILE="${2:-matbaa}"
if [ "$LANG_" = tr ] && [ "$PROFILE" = matbaa ]; then H="kapak.html"; FINAL="$ROOT/print/kitap/kapak.pdf"; B_MM=5; TITLE="Herkes İçin Yapay Zekâ - kapak"
else H="kapak-$LANG_-$PROFILE.html"; mkdir -p "$ROOT/print/kitap/$LANG_"; FINAL="$ROOT/print/kitap/$LANG_/$PROFILE-cover.pdf"; B_MM=5
  [ "$PROFILE" = kdp ] && B_MM=3.175; [ "$LANG_" = en ] && TITLE="AI for Everyone - cover" || TITLE="Herkes İçin Yapay Zekâ - kapak"; fi
node kapak.mjs --lang "$LANG_" --profile "$PROFILE"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$HERE/out/kapak-rgb.pdf" "file://$HERE/out/$H" >/dev/null 2>&1
read NW NH < out/size.txt
(cd ../typeset && node boxes.mjs "$HERE/out/kapak-rgb.pdf" "$HERE/out/kapak-boxed.pdf" "$B_MM" "$NW" "$NH")
GSICC="$(find /opt/homebrew /usr/local /usr/share -name default_cmyk.icc 2>/dev/null | head -1)"
if [ -n "$ICC" ]; then PROF="$ICC"; COND="$(basename "$ICC" .icc)"; CID="FOGRA39"; else PROF="$GSICC"; COND="Ghostscript default CMYK (printer profile pending)"; CID="Custom"; fi
TITLE_HEX=$(python3 -c 'import sys; print(sys.argv[1].encode("utf-16-be").hex().upper())' "$TITLE")
sed -e "s|ICCPROFILE|($PROF)|" -e "s|OUTPUTCONDITIONID|$CID|" -e "s|OUTPUTCONDITION|$COND|" -e "s|TITLEHEX|$TITLE_HEX|" ../typeset/PDFX_def.ps > out/PDFX_def.ps
gs -q -dBATCH -dNOPAUSE -dNOSAFER -dPDFX -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress \
   -sColorConversionStrategy=CMYK -dUseFastColor=true -dProcessColorModel=/DeviceCMYK \
   -dEmbedAllFonts=true -dSubsetFonts=true -dCompatibilityLevel=1.3 -dPreserveAnnots=false -dAutoRotatePages=/None \
   -sOutputICCProfile="$PROF" -sOutputFile="$FINAL" -f out/PDFX_def.ps out/kapak-boxed.pdf
pdfinfo -box "$FINAL" | grep -E "Pages|MediaBox|TrimBox"
if [ "$PROFILE" = kdp ]; then
  # Kindle kapağı: ön panel (net alan) → JPEG 1600×2560, RGB (KDP e-kitap kapağı ölçütü)
  W=$(pdfinfo "$FINAL" | awk '/^Page size/{print $3}'); HH=$(pdfinfo "$FINAL" | awk '/^Page size/{print $5}')
  python3 - "$W" "$HH" "$B_MM" <<'EOP' > out/crop.txt
import sys; w,h,b=float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3])*72/25.4
fw=6*72; x0=w-b-fw; y0=b; dpi=2560/(9*72)*72
print(int(x0/72*dpi), int(y0/72*dpi), int(fw/72*dpi), int(9*dpi), int(dpi))
EOP
  read X Y CW CH DPI < out/crop.txt
  pdftoppm -r "$DPI" -x "$X" -y "$Y" -W "$CW" -H "$CH" -jpeg -jpegopt quality=92 out/kapak-rgb.pdf "$ROOT/print/kitap/$LANG_/kdp-ebook-cover" && mv "$ROOT/print/kitap/$LANG_/kdp-ebook-cover-1.jpg" "$ROOT/print/kitap/$LANG_/kdp-ebook-cover.jpg"
  echo "→ $ROOT/print/kitap/$LANG_/kdp-ebook-cover.jpg $(python3 -c "import struct,sys;d=open('$ROOT/print/kitap/$LANG_/kdp-ebook-cover.jpg','rb').read();i=d.find(b'\xff\xc0');h,w=struct.unpack('>HH',d[i+5:i+9]);print(f'{w}x{h}')")"
fi

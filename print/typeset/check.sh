#!/bin/sh
# Baskı öncesi denetim: sh print/typeset/check.sh [tr|en] [matbaa|kdp]
#   tr matbaa → print/kitap/{ic-blok,kapak}.pdf (16'nın katı, 160×240 mm); en kdp → print/kitap/en/kdp-{interior,cover}.pdf (çift, 6×9 in)
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"; K="$ROOT/print/kitap"
LANG_="${1:-tr}"; PROFILE="${2:-matbaa}"
if [ "$LANG_" = tr ] && [ "$PROFILE" = matbaa ]; then IN="$K/ic-blok.pdf"; CV="$K/kapak.pdf"; else IN="$K/$LANG_/$PROFILE-interior.pdf"; CV="$K/$LANG_/$PROFILE-cover.pdf"; fi
if [ "$PROFILE" = kdp ]; then MULT=2; TRIM_RX="TrimBox: *9.00 *9.00 *441.0[0-9] *657.0[0-9]"; TRIM_TXT="TrimBox 6×9 in, taşma 0.125 in"; else MULT="${MULT:-8}"; TRIM_RX="TrimBox: *8.50 *8.50 *462.3[0-9] *688.4[0-9]"; TRIM_TXT="TrimBox 160×240 mm, taşma 3 mm"; fi
fail=0
chk() { if [ "$1" = ok ]; then echo "  ✔ $2"; else echo "  ✘ $2"; fail=1; fi; }
for F in ic-blok kapak; do
  if [ "$F" = ic-blok ]; then P="$IN"; else P="$CV"; fi; echo "== $(basename "$P")"
  [ -f "$P" ] || { echo "  ✘ dosya yok"; fail=1; continue; }
  pages=$(pdfinfo "$P" | awk '/^Pages/{print $2}')
  ver=$(pdfinfo "$P" | awk '/^PDF version/{print $3}')
  if [ "$F" = ic-blok ]; then
    [ $((pages % MULT)) -eq 0 ] && chk ok "sayfa sayısı $pages ($MULT'nin katı)" || chk no "sayfa sayısı $pages ($MULT'nin katı değil → --pad)"
    [ "$PROFILE" = kdp ] && { [ "$pages" -le 600 ] && chk ok "KDP standart renk sınırı (≤ 600)" || chk no "KDP standart renk sınırı aşıldı ($pages > 600)"; }
    pdfinfo -box "$P" | grep -q "$TRIM_RX" && chk ok "$TRIM_TXT" || chk no "TrimBox beklenen değil: $(pdfinfo -box "$P" | grep TrimBox)"
  else
    chk ok "kapak $pages sayfa, $(pdfinfo "$P" | awk '/^Page size/{print $3"x"$5" pt"}') ($(pdfinfo -box "$P" | grep TrimBox | awk '{printf "%.1fx%.1f mm net", ($4-$2)*25.4/72, ($5-$3)*25.4/72}'))"
  fi
  [ "$ver" = 1.3 ] && chk ok "PDF 1.3 (PDF/X-1a/X-3 uyumlu sürüm)" || chk no "PDF sürümü $ver"
  notemb=$(pdffonts "$P" | awk 'NR>2 && $(NF-4)!="yes"' | wc -l | tr -d ' ')
  [ "$notemb" = 0 ] && chk ok "fontlar gömülü ($(pdffonts "$P" | awk 'NR>2' | wc -l | tr -d ' ') font)" || chk no "$notemb font gömülü değil"
  rgb=$(pdfimages -list "$P" 2>/dev/null | awk 'NR>2 && $6=="rgb"' | wc -l | tr -d ' ')
  [ "$rgb" = 0 ] && chk ok "RGB görüntü yok" || chk no "$rgb RGB görüntü"
  raster=$(pdfimages -list "$P" 2>/dev/null | awk 'NR>2' | wc -l | tr -d ' ')
  echo "  · rasterlenmiş görüntü: $raster (0 = tamamen vektör)"
  python3 - "$P" <<'EOP'
import sys
d=open(sys.argv[1],'rb').read()
ok = b'/GTS_PDFX' in d and b'/OutputIntents' in d and d.count(b'/DeviceRGB')==0
print(('  ✔' if ok else '  ✘')+f" PDF/X: OutputIntent {'var' if b'/OutputIntents' in d else 'YOK'}, GTS_PDFX {'var' if b'/GTS_PDFX' in d else 'YOK'}, DeviceRGB {d.count(b'/DeviceRGB')}, Annots {d.count(b'/Annots')}")
sys.exit(0 if ok else 1)
EOP
  [ $? -eq 0 ] || fail=1
done
echo "== QR"; node "$HERE/check_qr.mjs" "$IN" "$LANG_" || fail=1
echo; [ $fail -eq 0 ] && echo "SONUÇ: tüm denetimler geçti" || echo "SONUÇ: hata var"
exit $fail

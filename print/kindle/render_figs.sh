#!/bin/sh
# EN figür SVG'leri → PNG (1600 px genişlik, Kindle için). Çıktı: print/kindle/out/img/figure-N-j.png
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"; OUT="$HERE/out/img"; mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for SVG in "$ROOT"/print/figures/out/en/figure-*.svg; do
  base=$(basename "$SVG" .svg); name=$(echo "$base" | sed -E 's/^(figure-[0-9]+-[0-9]+)-.*/\1/')
  PNG="$OUT/$name.png"; [ -f "$PNG" ] && [ "$PNG" -nt "$SVG" ] && continue
  W=$(grep -o 'width="[0-9.]*pt"' "$SVG" | head -1 | grep -o '[0-9.]*'); H=$(grep -o 'height="[0-9.]*pt"' "$SVG" | head -1 | grep -o '[0-9.]*')
  CSSW=$(python3 -c "print(int($W*4/3)+2)"); CSSH=$(python3 -c "print(int($H*4/3)+2)"); SCALE=$(python3 -c "print(round(1600/($W*4/3),3))")
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=$SCALE --window-size=$CSSW,$CSSH --screenshot="$PNG" "file://$SVG" >/dev/null 2>&1
  command -v pngquant >/dev/null && pngquant --force --quality=70-90 --output "$PNG" "$PNG" 2>/dev/null
done
ls "$OUT" | wc -l | tr -d ' ' | sed 's/$/ png/'; du -sh "$OUT" | cut -f1

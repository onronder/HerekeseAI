#!/bin/sh
# SVG → PNG (headless Chrome, 3x). Kullanım: print/figures/render.sh <svg> <png>
SVG="$1"; PNG="$2"
W=$(grep -o 'width="[0-9.]*pt"' "$SVG" | head -1 | grep -o '[0-9.]*'); H=$(grep -o 'height="[0-9.]*pt"' "$SVG" | head -1 | grep -o '[0-9.]*')
WW=$(python3 -c "print(int($W*4/3)+2)"); HH=$(python3 -c "print(int($H*4/3)+2)")
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=3 --window-size=$WW,$HH --screenshot="$PNG" "file://$(cd "$(dirname "$SVG")" && pwd)/$(basename "$SVG")" >/dev/null 2>&1
ls -la "$PNG"

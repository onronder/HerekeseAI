#!/bin/sh
# Kindle EPUB: sh print/kindle/build.sh → print/kitap/en/AI-for-Everyone.epub (+ epubcheck)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"; cd "$HERE"
python3 "$ROOT/print/assemble.py" --lang en | head -1
sh render_figs.sh
python3 kindle.py
COVER="$ROOT/print/kitap/en/kdp-ebook-cover.jpg"; [ -f "$COVER" ] || { echo "kapak yok: önce sh print/kapak/kapak.sh en kdp"; exit 1; }
OUTE="$ROOT/print/kitap/en/AI-for-Everyone.epub"
pandoc out/book.html -o "$OUTE" --from html --to epub3 --split-level=1 --toc --toc-depth=3 --css kindle.css \
  --epub-cover-image="$COVER" --resource-path=out \
  --metadata title="AI for Everyone" --metadata subtitle="From rules to deep learning" --metadata author="Onur Önder" \
  --metadata lang=en-US --metadata rights="© 2026 Onur Önder" --metadata publisher="Onur Önder" \
  --metadata description="A two-century story of artificial intelligence, from the first calculating gears to today's chatbots, with 45 experiments worked out on paper and live on your phone."
echo "→ $OUTE ($(du -h "$OUTE" | cut -f1))"
if command -v epubcheck >/dev/null; then epubcheck "$OUTE" 2>&1 | tail -3; else echo "epubcheck yok (brew install epubcheck)"; fi

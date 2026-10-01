# Amazon KDP upload package — AI for Everyone (English edition)

Two products from the same manuscript: a **paperback** (standard color, 6 × 9 in) and a **Kindle eBook**. Create them as one title with two formats in KDP so they are linked on the product page.

| File | Use | Facts |
|---|---|---|
| `AI-for-Everyone-paperback-interior-272p.pdf` | Paperback → Manuscript | 272 pages, 6 × 9 in trim with 0.125 in bleed ("Bleed (PDF)"), PDF/X-1a, CMYK (black text and codes on the K plate only), fonts embedded, running heads 0.54 in and page numbers 0.50 in inside the trim |
| `AI-for-Everyone-paperback-cover.pdf` | Paperback → Cover (single full-wrap PDF) | 12.863 × 9.25 in = back + 0.6125 in spine + front + 0.125 in bleed; spine computed for **white paper, standard color** (0.002252 in/page); bottom-right 2 × 1.2 in white area left for KDP's barcode |
| `AI-for-Everyone-kindle.epub` | Kindle eBook → Manuscript | EPUB 3, epubcheck 0 errors, 2.5 MB, 45 figures (1600 px), 45 "Live demo" links, linked index, no print-only text |
| `AI-for-Everyone-kindle-cover.jpg` | Kindle eBook → Cover | 1706 × 2560 px, RGB JPEG (KDP minimum 1000 × 1600; ideal 1600 × 2560) |

## Before uploading: one placeholder

The paperback copyright page (p. 2) still reads `Print edition ISBN: [ISBN]`.
- **Free KDP ISBN:** KDP assigns it when you create the paperback. Put the number into `print/src/en/front/00-title.md` and `print/kapak/kapak.en.json → "isbn"` (the cover will then print its own EAN-13 barcode in the white area; or leave `isbn` empty and let KDP print the barcode), then rebuild:
  `python3 print/assemble.py --lang en && sh print/typeset/dizgi.sh --lang en --profile kdp && sh print/kapak/kapak.sh en kdp && sh print/typeset/check.sh en kdp`
- **Own ISBN:** same steps with your number. The web edition's 978-625-00-5299-0 and the Turkish print ISBN 978-625-00-5211-2 must **not** be reused.
- The Kindle eBook needs no ISBN (Amazon assigns an ASIN).

## Paperback — KDP form, step by step

1. **Paperback details:** Language English · Title "AI for Everyone" · Subtitle "From rules to deep learning" · Series none · Edition 1 · Author Onur Önder · Description (up to 4,000 characters; base: the back-cover text in `print/kapak/kapak.en.json`) · Publishing rights "I own the copyright" · Primary audience: not sexually explicit, no reading age · Categories (3): Computers › Artificial Intelligence › General; Computers › Machine Learning; Science › History · Keywords (7): artificial intelligence for beginners; machine learning explained; deep learning introduction; history of AI; neural networks; large language models; AI and society.
2. **Paperback content:** ISBN (see above) · Publication date (leave blank = release day) · Print options: **Standard color interior, white paper, 6 × 9 in, Bleed (PDF), matte cover** (dark cover suits matte; glossy also fine) · Manuscript: upload the interior PDF · Cover: "Upload a cover you already have (print-ready PDF)" → the cover PDF; tick "barcode" only if `isbn` was left empty in the cover (then KDP prints it in the white area) · AI-generated content: answer per the actual production of text and figures · **Launch Previewer**: check that no text enters the 0.375 in margins and that the barcode lands inside the white area. If you choose **cream** paper or **premium** color, the spine changes (cream 0.0025 in/page, premium color 0.002347 in/page): add `"in_per_page": 0.0025` (or 0.002347) to `print/kapak/kapak.en.json`, run `sh print/kapak/kapak.sh en kdp`, and upload the new cover; do not upload the current cover with those options.
3. **Paperback rights & pricing:** Territories: all · Primary marketplace Amazon.com · List price: KDP shows the minimum (print cost ≈ $1.00 + 0.0255 × 272 ≈ $7.94 for standard color US); at $29.99 the royalty is 60 % × 29.99 − 7.94 ≈ $10.06 · Expanded distribution: optional (40 % royalty) · Request a **proof copy** before approving.

## Kindle eBook — KDP form, step by step

1. **eBook details:** same title/subtitle/author/description/categories/keywords as the paperback (KDP can copy them) · Edition 1 · Language English.
2. **eBook content:** DRM: your choice (cannot be changed later; "No" is usual for non-fiction) · Manuscript: upload the EPUB · Cover: upload the JPG · AI-generated content declaration · **Launch Previewer** (or install the current Kindle Previewer, version 4; versions 3 and older are no longer supported by Amazon, and the EPUB must be opened in a working Previewer or a real device before publishing): check a chapter with a table, a Technical depth box, the answer key and the index on phone and e-ink layouts; the "Live demo" buttons must be tappable links.
3. **eBook pricing:** KDP Select: **do not enrol** if you want to keep selling the interactive edition elsewhere (Select requires digital exclusivity; check the terms) · Royalty 70 % (list price $2.99–$9.99; delivery fee ≈ $0.37 for 2.5 MB) · Suggested $9.99 / €9.99 / £7.99 · Territories: all.

## After publishing

- Link paperback and eBook on one product page (KDP does this automatically for matching title/author; otherwise contact KDP support).
- Keep the source of truth in the repo: any text change → rerun `sh print/kindle/build.sh` and the paperback chain, then re-upload (KDP allows updates).
- Promotion links: the interactive edition at https://book.onuronder.com (mentioned in the book) and the live demos under `/d/en/…`.

# Kindle edition QA — `print/kitap/en/AI-for-Everyone.epub`

**Verdict: NEEDS FIXES** — the package is technically valid (epubcheck 5.4.0: 0 fatals / 0 errors / 0 warnings, 2.2 MB, 45/45 figures, 45/45 live-demo links correct), but the file still carries paperback-only text and placeholders on the copyright and acknowledgments pages, and the Answer Key quizzes and the Index collapse into single run-on paragraphs. Those are reader-visible; fix them, rebuild, then upload.

Reviewed 2026-09-30. Sources checked: the unzipped EPUB (OPF, nav, NCX, 19 XHTML files, CSS, 45 PNG + cover JPEG), `print/kindle/build.sh`, `print/kindle/kindle.py`, `print/kindle/kindle.css`, `print/kindle/render_figs.sh`, `print/kindle/out/book.html`, `qr-slugs.json`, `print/src/en/*`. Renders: headless Chrome at 376 px and 960 px content width for every chapter (overflow measured in the DOM) plus screenshots of front matter, Chapter 1, Chapter 4 formulas, a Chapter 6 table, Glossary, Answer Key, Index, Live Demos.

---

## A — blocks upload or reader-visible defect

### A1. Copyright page still has paperback placeholders
File: `EPUB/text/ch001.xhtml` (source: `print/src/en/front/00-title.md` → `kindle.py` keeps the print colophon verbatim).

> Print edition ISBN: [ISBN]
> First edition: [month, year]
> Printing and binding: [printer name, address, certificate no.]

Three bracketed placeholders plus two lines that make no sense in an eBook (print ISBN, printer). Suggestion: `kindle.py` should substitute a Kindle colophon — drop the "Print edition ISBN" and "Printing and binding" lines, set "First edition: October 2026" (or the real month), and either add "Kindle edition" with its own ISBN or say "Kindle edition (ASIN assigned by Amazon)". Keep the "Interactive digital edition ISBN: 978-625-00-5299-0" line only if that number really belongs to the web edition, not to this file (see B7).

### A2. Acknowledgments has `[names]` three times
File: `EPUB/text/ch002.xhtml` (source `print/src/en/front/01-acknowledgments.md`).

> My thanks go to my first readers, [names] above all.
> …were not shy to say "this part is not clear": [names].
> …for months: [names].

Fill in the names or rewrite the sentences without them. Same defect exists in the paperback source, so fix it once in `print/src/en/front/01-acknowledgments.md`.

### A3. Answer Key quiz answers run together in one paragraph
File: `EPUB/text/ch013.xhtml`, section "End-of-chapter quizzes" (50 answers). Rendered text:

> 1.8 · Question 1: **d** — That intelligence has many kinds, not one 1.8 · Question 2: **c** — 0 and 1 1.8 · Question 3: **a** — In principle any computation…

Cause: `print/src/en/answer-key.md` writes one answer per line without a blank line or trailing `\`; pandoc treats them as one paragraph. The paperback path (`typeset.py`) re-parses the Markdown itself, so the paperback is fine, but `kindle.py` starts from `AI-for-Everyone-EN.html`, where the lines are already merged. Fix in `kindle.py`: split the quiz paragraphs on `(\d\.\d · Question \d+:)` into `<p>` or `<li>` elements (or emit `<br/>` between answers).

### A4. Index is a single 17 KB paragraph
File: `EPUB/text/ch017.xhtml` — 98 entries, 351 links, all in one `<p>`:

> **Accountability** · 7.3, 8.6 **Activation function** · 4.1, 4.2, 4.3, 4.8 **Agent** · 3.3, 3.8, 6.1 …

The links themselves are correct (every `ch0NN.xhtml#sec-N-j` anchor exists; the "page numbers added at typesetting" note was already replaced by "Entries link to the section where the term appears"). Only the layout is broken. Fix in `kindle.py`: wrap each `<strong>…</strong> · links` group in its own `<p class="ix">` (the same split `typeset.py` does with `.ix-e`), with `margin:0 0 .25em; padding-left:1.2em; text-indent:-1.2em` in `kindle.css`.

### A5. "QR code" wording survives in two places
- `EPUB/text/ch004.xhtml` (How to Read This Book): "**Live demos.** The QR code under each figure opens the live version of that experiment on your phone."
- `EPUB/text/ch016.xhtml` (Live Demos): "The links below (and the QR codes under the figures) open only that demo"

There are no QR codes in the eBook (they were correctly replaced by 45 "open the live demo" links). Suggestion: `kindle.py` replaces "The QR code under each figure opens" → "The *open the live demo* link under each figure opens", and "(and the QR codes under the figures)" → "(and the links under the figures)". The Preface sentence "the link to the live demo sits under every figure" is already eBook-correct.

---

## B — should fix before upload

### B1. "Technical depth" boxes lose their box
`kindle.py` emits `<aside class="tech">`, but pandoc rewrites it as `<section id="technical-depth" class="level4 aside tech">` (53 occurrences), so the selector `aside.tech { border…; background… }` in `kindle.css` never matches. Rendered result: the orange "TECHNICAL DEPTH" label appears, then plain paragraphs with no frame or tint, so the reader cannot see where the box ends and the main text resumes. Fix: change the selector to `.tech, section.tech { … }` (and see C4 for dark-mode colour).

### B2. TOC splits every chapter into "Chapter N" + nested title, and hides the sections
`EPUB/nav.xhtml`: `Chapter 1 → Minds and Machines`, `Chapter 2 → The Age of Rules` … The top level of the Kindle "Go to" menu therefore reads "Chapter 1 … Chapter 8" with the titles collapsed one level down, and the 1.1–8.8 section headings (which are `<h3>`) are not in the TOC at all because `--toc-depth=2` is used up by the split. Cause: the print HTML has `<h1>Chapter 1</h1><h2>Minds and Machines</h2>`. Fix in `kindle.py`: merge into one `<h1>Chapter 1 · Minds and Machines</h1>` (keep the italic tagline), promote section headings so they become level 2, and rebuild; the TOC then shows 8 chapters with their 8–9 sections nested.

Related: the `h1 + h2` rule in `kindle.css` (subtitle styling) also never matches because pandoc inserts a `<section>` between them.

### B3. Title block printed three times, copyright page listed in the TOC as "AI for Everyone → From rules to deep learning"
Pandoc generates `title_page.xhtml` (title, subtitle, author, publisher, rights), then `ch001.xhtml` repeats `<h1>AI for Everyone</h1><h2>From rules to deep learning</h2>` and, inside it, **Onur Önder / AI for Everyone / Onur Önder** again before the copyright text. Both the nav and the NCX list this page as the first entry under the book title. Fix: strip the title/subtitle/author lines from the colophon in `kindle.py` and head it `<h1>Copyright</h1>` (or give it `epub:type="copyright-page"`), so the TOC reads Copyright · Acknowledgments · Preface · How to Read This Book · Chapter 1 …

### B4. Live Demos table overflows at phone width
`EPUB/text/ch016.xhtml`: at a 376 px content width the 3-column table is 23 px wider than the screen and every `https://book.onuronder.com/d/en/xxxxxxxxxx` link runs 9–16 px past the right edge (measured; the only real overflow in the book besides B5). Long URLs cannot wrap. Suggestion: keep the href but shorten the visible text to "Open" (or the 10-character slug), and/or add `word-break: break-all` to `td a` in `kindle.css`. Also consider dropping the "https://" from the visible text of the one plain URL in the intro paragraph.

### B5. One Chapter 6 table is 7 px too wide at phone width
`EPUB/text/ch010.xhtml`, table beginning "Field · Example 1 · Example 2 · Example 3 · Health · Spotting anomalies…" (longest cell 199 characters). Minor, but Kindle clips rather than scrolls. Fix: allow `th, td { word-break: break-word; }` or shorten the header labels. All other 53 tables (max 9 columns in Chapter 1 binary tables, up to 152-character cells) fit at 376 px and 960 px.

### B6. Unicode-only maths — verify in Kindle Previewer
There are 0 `<sup>`/`<sub>` tags; all formulas rely on Unicode glyphs: `e⁻⁰·⁶⁹`, `2ⁿ`, `2²⁶`, `10¹¹`, `−0.656`, `√((x − xₘ)² + …)`, `‖x − μₖ‖²`, `x̄` (combining macron), and in Chapter 4 `a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾)`, `e⁻ᶻ`. Superscript digits and minus render everywhere; the risk is `⁽ ⁾` (U+207D/E), `ˡ` (U+02E1), `ᶻ` (U+1DBB) and `‖`, which older Kindle e-ink fonts may show as boxes. Chrome rendered them all correctly. Suggestion: either open the file in Kindle Previewer (not installed on this Mac: `brew install --cask kindle-previewer`) and check Chapter 3 §3.5–3.6 and Chapter 4 §4.2/4.4 on the "Kindle E-reader" profile, or have `kindle.py` convert the layer-index notation to `<sup>(l)</sup>` / `<sup>−z</sup>`.

### B7. ISBN / identifier decision
OPF: `dc:identifier` = `urn:uuid:6d79ba2c-…` (fine — KDP assigns an ASIN and ignores it). The colophon prints "Interactive digital edition ISBN: 978-625-00-5299-0". If that ISBN was registered for the web edition it must not be entered as the Kindle ISBN in KDP (one ISBN per format); leave the KDP ISBN field empty, or register a separate Kindle ISBN and put it in both the colophon and `--metadata identifier=`.

### B8. Cover JPEG ratio
`print/kitap/en/kdp-ebook-cover.jpg`: 1706 × 2560 px, RGB, baseline JPEG, 438 KB, 284 dpi. Meets KDP minimums (≥ 1000 × 1600, ≤ 50 MB, RGB) but the ratio is 1.5:1 (paperback trim), not the recommended 1.6:1 (1600 × 2560). KDP accepts it; the thumbnail will just be slightly wider than neighbouring covers. Export a 1600 × 2560 variant from `print/kapak/kapak.mjs` if you want the ideal ratio. The same JPEG is embedded as `media/file45.jpg` with `properties="cover-image"`, `<meta name="cover">`, guide `type="cover"` and a landmarks entry — all correct.

---

## C — cosmetic / nice to have

- **C1. Redundant link caption.** Every exercise ends with "Live demo: ↗ open the live demo" (label twice). Use either "Live demo ↗" as the link text or drop the "Live demo:" prefix. The `↗` (U+2197) glyph may be missing on e-ink fonts; a plain "Open the live demo →" is safer.
- **C2. Figure label printed twice.** `<p><strong>Figure 1.1 · Explore multiple intelligences</strong></p>` is followed by pandoc's `<figcaption aria-hidden="true">Figure 1.1</figcaption>` under the image. Either move the full title into the `<figcaption>` (and set `alt` to the title, currently all 45 alts are just "Figure N.j") or hide the auto caption with `figcaption { display:none }`.
- **C3. TOC page heading.** `nav.xhtml` `<h1 id="toc-title">` reads "AI for Everyone"; readers expect "Contents" (`--metadata toc-title="Contents"`).
- **C4. Dark-mode colours.** `kindle.css` hard-codes `#444`, `#666` (figcaption, table headers) and, once B1 is fixed, a cream `background:#faf7ef` with no `color` set. Kindle night mode usually overrides these, but the Kindle iOS/Android apps honour backgrounds in some themes, giving light text on a light box. Add `color:#222` to `.tech` or drop the background and keep only the border. Screenshots on a black page show the orange labels and blockquote rule remain legible.
- **C5. Front matter typed as bodymatter.** Acknowledgments, Preface and How to Read are `epub:type="bodymatter"`; only the pandoc title page is `frontmatter`. Harmless for KDP, but marking them `frontmatter` lets Kindle set the "start reading" location at Chapter 1.
- **C6. Accessibility metadata slightly wrong.** `schema:accessMode` = `textual` and `accessModeSufficient` = `textual` although the book has 45 informational images; declare `textual, visual`. Also the description meta starts with "A two-century story…" — fine, but it is not what KDP uses (KDP has its own description field).
- **C7. Title page shows "Onur Önder" twice** (author and publisher lines in `title_page.xhtml`). Set `--metadata publisher=` to an imprint name (e.g. "Fittechs") if you don't want the repeat.
- **C8. Dense figures on phones.** All 45 figures are 1605 × 536–1991 px (`render_figs.sh` targets 1600 px, pngquant applied; 43–120 KB each, 1.9 MB total). At 400 px display width the RAG on/off figure (Chapter 6) and similar dense panels are only legible after tap-to-zoom, which Kindle supports. Nothing to fix; just be aware.
- **C9. "the paper version of the dial on the cover"** (How to Read, Two depths paragraph) — still accurate since the same cover art is used, but "paper version" reads oddly in an eBook; consider "the reading version of the dial on the cover".

---

## Package facts (all OK)

| Check | Result |
|---|---|
| epubcheck 5.4.0 | `No errors or warnings detected. Messages: 0 fatals / 0 errors / 0 warnings / 0 infos` |
| Container / mimetype | `EPUB/content.opf`, `application/epub+zip` first, uncompressed |
| Metadata | title "AI for Everyone", creator Onur Önder (role aut), language `en-US`, publisher Onur Önder, rights "© 2026 Onur Önder", date 2026-09-30, description present, identifier urn:uuid (no bogus ISBN in OPF); subtitle only on the title page (KDP has its own field) |
| Cover | `media/file45.jpg` 1706×2560 RGB, `properties="cover-image"`, `<meta name="cover">`, guide + landmarks reference `text/cover.xhtml` |
| Navigation | `nav.xhtml` (30 entries) + `toc.ncx` (31 navPoints); nav is also in the spine as a visible contents page; all 17 chapters listed in book order: Copyright block, Acknowledgments, Preface, How to Read, Chapters 1–8, Answer Key (2 sub-entries), Glossary, Bibliography (2 sub-entries), Live Demos, Index |
| Spine | cover → title page → nav → ch001…ch017, linear, matches the paperback order |
| Images | 45 PNG figures, each referenced exactly once; widths 1605–1608 px, smallest height 536 px; 45 `alt` attributes present |
| Live demos | 45 `<a class="live" href="https://book.onuronder.com/d/en/<slug>">` in the chapters (6/5/6/6/7/5/5/5 per chapter) — slugs match `qr-slugs.json` figure by figure and the 45-row Live Demos table; no `qr-` images left, no `../figures` paths left |
| Index / glossary links | 351 index links → `ch0NN.xhtml#sec-N-j`; every anchor exists; glossary entries are separate paragraphs (fine) |
| Size | EPUB 2,238,604 bytes (2.2 MB): 1.9 MB figures, 0.43 MB cover, 0.42 MB XHTML. Largest files: cover 438 KB, figure `file31.png` 120 KB, `file30.png` 92 KB. KDP delivery fee at $0.15/MB ≈ $0.34 (70 % plan); well under the 6 MB comfort limit |
| Fonts / scripts / remote | No embedded fonts (`font-family: serif`), no `<script>`, no `@import`, no external CSS/font URLs, no remote resources; single stylesheet `styles/stylesheet1.css` = `kindle.css` |
| Tables | 54 tables; at 376 px only ch016 (Live Demos, +23 px) and one ch010 table (+7 px) overflow — see B4/B5; at 960 px nothing overflows |
| Text integrity | No U+FFFD or mojibake; no "see page", "next page", "Notes" pages, empty headings or running-head residue; only the items in A1, A2, A5 |

---

## KDP eBook listing — fields the author must supply

| KDP field | Suggested value / note |
|---|---|
| Language | English |
| Book title | AI for Everyone |
| Subtitle | From rules to deep learning |
| Series | none (unless you want to pair TR + EN as "Herkese AI") |
| Edition number | 1 |
| Author | Onur Önder (primary contributor; no "Fittechs" as author) |
| Contributors | none |
| Description | Up to 4,000 characters, HTML allowed. Draft from the OPF description: "A two-century story of artificial intelligence, from the first calculating gears to today's chatbots, with 45 experiments worked out on paper and live on your phone." — expand with the eight chapters, the two reading depths, the 45 live demos at book.onuronder.com (no sign-in), the glossary/answer key |
| Publishing rights | "I own the copyright and I hold necessary publishing rights" |
| Primary audience | Not sexually explicit; reading age optional (13+ / adult); no low-content flags |
| Primary marketplace | Amazon.com (check that Fittechs / KDP tax interview is complete) |
| Categories (up to 3) | e.g. Computers & Technology › Artificial Intelligence › General; Science › History of Science; Computers › Computer Science |
| Keywords (7) | artificial intelligence for beginners; machine learning explained; deep learning introduction; history of AI; neural networks; large language models; AI and society |
| Pre-order | choose "release now" or set a date |
| Manuscript | upload `AI-for-Everyone.epub` after the A/B fixes and rebuild (`sh print/kindle/build.sh`) |
| Cover | `kdp-ebook-cover.jpg` (or a 1600 × 2560 export, see B8) |
| AI-generated content disclosure | KDP asks whether text/images/translations are AI-generated or AI-assisted — answer per the actual production of the text, figures and the EN translation |
| ISBN | Optional for Kindle; leave blank (Amazon assigns an ASIN) unless you register a Kindle-specific ISBN (B7) |
| Publisher | Onur Önder, or Fittechs Yazılım A.Ş. if it should appear as imprint (then also change `--metadata publisher=`) |
| DRM | decide at upload (cannot be changed later) — not evaluated here |
| Territories | All territories (worldwide rights) |
| Pricing | Choose 70 % royalty (price $2.99–$9.99, delivery fee ≈ $0.34) or 35 %; set list price per marketplace; consider KDP Select/Kindle Unlimited enrolment (requires digital exclusivity — note the web edition at book.onuronder.com is a different product, but check the Select terms) |
| Kindle Previewer | Run KDP's own converter (Kindle Previewer 3) once on the rebuilt EPUB before pressing Publish; it is not installed on this Mac |

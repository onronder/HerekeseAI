# KDP paperback QA (EN) — `print/kitap/en/kdp-interior.pdf` + `kdp-cover.pdf`

> Historical QA snapshot: the measurements below describe the reviewed 228-page files, not the current build. For current cover generation, use `pages` in [`kapak.en.json`](../../kapak/kapak.en.json) and the `SP` calculation in [`kapak.mjs`](../../kapak/kapak.mjs); see the [English KDP workflow](../../README.md#ingilizce-sürüm--amazon-kdp-p5). Do not copy this report's spine measurements into the config.

**Verdict: NEEDS FIXES** — the interior is technically sound (PDF/X-1a, 228 pages, 6.25 × 9.25 in with 0.125 in bleed, all fonts embedded, body text inside a 0.65 in gutter / 0.50 in outside margin, TOC 74/74 correct, 45/45 figures in order with caption rows and QR codes, quizzes match the answer key), and the cover file has exactly the size KDP's calculator gives for 228 pages. But three things block upload as they stand: the copyright/acknowledgments/preface pages still carry 8 bracketed placeholders, the running heads and folios sit 0.25–0.29 in from the trim (KDP wants ≥ 0.375 in with bleed), and the spine title "AI for Everyone" is printed 0.25 in to the left of the spine, on the back cover. Fix those, rebuild, then upload.

Reviewed 2026-09-30 against the files dated 17:06. Method: `pdfinfo -box`, `pdffonts`, `pdftotext -layout` and `pdftotext -bbox-layout` (line boxes for every page → margin, fill, widow/orphan and stranded-label checks), `defer.json`, `kapak.en.json`, `sips` on the JPG; renders with `pdftoppm` at 45 dpi (24 interior pages), 100 dpi (figures 3.1, 3.2, 5.7, 6.4, 7.3; full cover), 200 dpi (spine crops, ligature crop). Page numbers below are PDF page = printed folio (Chapter 1 opens on p. 13 in both).

---

## 1. KDP print specs — pass/fail table

| Requirement | Measured | Result |
|---|---|---|
| Trim 6 × 9 in | TrimBox 9–441 × 9–657 pt = 6.000 × 9.000 in | pass |
| Bleed 0.125 in (page 6.25 × 9.25 in) | MediaBox = BleedBox = 450 × 666 pt = 6.25 × 9.25 in | pass |
| Page count even, 24–828 | 228 pages | pass |
| Inside (gutter) margin ≥ 0.5 in (151–300 pp) | body ink starts 0.650 in from the inside trim on every page (recto p. 15/61/121/201: 0.650; verso p. 14/60/120/200: 0.650) | pass |
| Outside margin ≥ 0.375 in (with bleed) | body ink 0.500 in from the outside trim (same 8 pages: 0.500) | pass |
| Top / bottom margin ≥ 0.375 in for *all* content incl. headers and page numbers | body top ≥ 0.58 in, body bottom ≥ 0.66 in — but recto running head ink at **0.25 in** from the top trim and the folio at **0.29 in** from the bottom trim on all numbered pages | **FAIL (A2)** |
| Nothing crosses the trim / no ink in the bleed | no text line reaches the trim on any page (checked all 228) | pass |
| Fonts embedded | 44 subsets, all `emb yes` (Work Sans, Instrument Serif, Space Mono + Menlo/Helvetica/Arial Unicode MS/Type 3 from the figure SVGs) | pass |
| No transparency, CMYK | PDF/X-1:2001 (PDF 1.3), Ghostscript 10.08 | pass |
| Cover full-wrap = 2×6 + 228×0.002252 + 2×0.125 = 12.7635 × 9.25 in | 918.96 × 666 pt = 12.763 × 9.250 in; TrimBox 12.513 × 9.0 | pass |
| Spine text allowed (≥ 79 pp) and ≥ 0.0625 in from spine edges | author on spine at 6.34–6.42 in (spine 6.125–6.638 in): pass; **title at 5.74–5.90 in = off the spine** | **FAIL (A3)** |
| Barcode zone 2 × 1.2 in bottom-right of back cover kept clear | clear, but the white placeholder box is 2.14 × 1.34 in at 3.34–5.48 × 7.22–8.56 in, i.e. 0.65 in from the spine and 0.57 in from the bottom trim — not where KDP prints (0.25 in / 0.25 in) | see B1 |
| eBook cover | 1706 × 2560 px, RGB, 438 KB, ratio 1.50:1 (ideal 1.6:1, 1600 × 2560) | accepted, see C8 |

---

## A — blocks upload

### A1. Placeholders still in the print file (p. 2, 3, 5)
`pdftotext` finds eight bracketed placeholders; all others in the PDF are vectors like `[0.7, −0.5, 0.9]`.

- p. 2 copyright: `Print edition ISBN: [ISBN]` · `First edition: [month, year]` · `Printing and binding: [printer name, address, certificate no.]`
- p. 3 acknowledgments: `My thanks go to my first readers, [names] above all.` · `…“this part is not clear”: [names].` · `…for months: [names]. This book is yours too.`
- p. 5 preface: `[place, date]` under the signature.

Suggestion: decide the ISBN first (see the KDP field list at the end — a free KDP ISBN cannot be known before you create the title, so either use your own ISBN now or leave the line out and add it in the second upload), set "First edition: October 2026", replace the printer line with "Printed on demand by Amazon KDP" (KDP has no certificate number), fill or delete the three `[names]`, and write the place/date or drop the line. Source: `print/src/en/front/*` (same fix the Kindle QA asked for; the paperback build must not inherit the placeholders either).

### A2. Running heads and page numbers inside KDP's 0.375 in margin (every numbered page)
Recto running head `CHAPTER 1 · MINDS AND MACHINES` (p. 15 and all odd pages): line box top at 25.4 pt from the page edge → ink starts ≈ 0.25 in below the trim. Folio (p. 13–228): line box 627–638 pt → baseline ≈ 0.29 in above the trim. KDP: with bleed, outside/top/bottom margins must be ≥ 0.375 in *including headers, footers and page numbers*; the print previewer flags these as "content outside the margins" and may refuse the file. Body text is fine (0.58 in top, 0.66 in bottom), so only the two `@page` margin-box offsets need to move.

Suggestion: in `print/typeset/print.css` push the head and folio inward so their ink is ≥ 0.40 in from the trim (e.g. top margin box padding-top ≈ 0.19 in more, folio ≈ 0.12 in more), then re-measure with `pdftotext -bbox-layout`.

### A3. Spine title printed on the back cover, not on the spine
`kdp-cover.pdf` at 100 dpi: the vertical "AI for Everyone" occupies x = 5.74–5.90 in, y = 0.60–1.46 in. The spine (for 228 pages) runs x = 6.125–6.638 in, centre 6.382 in. The author name is correctly centred (6.34–6.42 in). So the title is 0.23–0.39 in left of the fold and will wrap around onto the back cover; the printed spine will show only "ONUR ÖNDER" at the bottom. Also visible in the 40 dpi full render (the title sits over the back-cover panel's top-right corner). Suggestion: in `print/kapak/kapak.mjs` position the spine title with the same centre-x as the author (spine centre), or check the rotate/transform-origin of that element; verify with a 200 dpi crop of x = 6.0–6.75 in.

---

## B — should fix before upload

### B1. White barcode placeholder does not sit where KDP will print the barcode (back cover)
KDP places its own barcode (2 × 1.2 in, white background) 0.25 in from the bottom trim and 0.25 in from the spine. The cover's white box is 2.14 × 1.34 in at 0.65 in from the spine and 0.57 in from the bottom trim (page coordinates 3.34–5.48 × 7.22–8.56 in). The KDP barcode zone is therefore 3.875–5.875 × 7.675–8.875 in: the two rectangles overlap only partially and the result on a dark cover will be a white box plus a second, offset white barcode panel. Suggestion: either delete the white box (KDP adds its own white field; on a dark cover that is the normal look) or move/resize it to exactly 2.0 × 1.2 in at 0.25 in / 0.25 in. If you use your own ISBN and want your own barcode, place it in that same zone; KDP only skips its barcode when it detects one already printed there.

### B2. Index page numbers are section-start pages, not the pages where the term appears (p. 227–228)
The index says "Numbers are page numbers", but every number checked is the first page of the *section* that contains the term, so readers land 1–3 pages early: `Searle, John 28, 175, 178` → actually p. 30, 177, 178–180; `SHAP 158` → p. 160–161; `Learning rate 70, 86` → p. 71–73, 90; `Overfitting 73, 76` → p. 73–75, 77; `ReAct 132, 140` → p. 132, 142–143; `Reward hacking 118, 168` → p. 121, 169–170; `Specification gaming 118, 168` → p. 170 only; `Symbolic AI (GOFAI) 38, 39, 52, 55` → "GOFAI" appears only on p. 38; `Context window 104, 105, 124, 128` → p. 105, 107, 124–127, 129. Entries that hit exactly: `ENIAC 25`, `Turing, Alan 21, 174, 175` (sic — Turing is on 21, 174, 175 and many more), `Superintelligence 174, 181, 190`, `Narrow AI 28, 174, 181, 190`, `Fine-tuning 104, 118, 128`. Suggestion: regenerate the index from the final pagination (search each term in `pdftotext` output per page, which is what this review did), or change the note to "Numbers are the first page of the section in which the term appears".

### B3. Em dashes in the answer key (p. 193–195, 50 occurrences)
Every quiz answer is set as `1.8 · Question 1: d — That intelligence has many kinds, not one`. The style guide bans em dashes (the manuscript file even documents the rule at line 2485 and rewrote figure strings to avoid them), yet the source `AI-for-Everyone-EN.md` line 3131 ff. uses them for all 8 chapters. Suggestion: `1.8 · Question 1: d. That intelligence…` or a colon/en-dash rule applied in `typeset.py`.

### B4. E-mail address hyphenated across lines on the copyright page (p. 2)
`Email: support@fittechs.-` / `com. Web: onuronder.com` — the address breaks after "fittechs." with a hyphen. Suggestion: wrap the address in a `nowrap` span or write it at line start.

### B5. Figure referenced two pages before it appears (deferred figures)
`defer.json` deferred 31 figures; eight of them are first mentioned exactly two pages before the figure page (the mention is on a verso, the figure two pages on, i.e. after a page turn):

| Figure | first mention | figure page | quote |
|---|---|---|---|
| 1.6 | p. 31 | p. 33 | "Do it yourself in the table of Figure 1.6" |
| 3.1 | p. 59 | p. 61 | "Each example in Figure 3.1 shows its clues" |
| 4.5 | p. 93 | p. 95 | "In Figure 4.5 the words are fed in one at a time" |
| 5.2 | p. 108 | p. 110 | "Pick a word in Figure 5.2 and meet its neighbors" |
| 5.5 | p. 118 | p. 120 | "Read the three stages of Figure 5.5 one by one" |
| 5.6 | p. 121 | p. 123 | "Follow the frames of Figure 5.6 from left to right" |
| 6.2 | p. 137 | p. 139 | "compare RAG off and on in Figure 6.2" |
| 6.4 | p. 144 | p. 146 | "Look at the parts of Figure 6.4 one by one" |

None is ≥ 3 pages apart, and no figure lands before its own section. Acceptable for a trade book; if you want zero page-turns, add "(p. 33)" style cross-references for these eight or let `gapplan.py` allow a 1-page defer only.

### B6. Back-cover author bio reads as a translation and switches voice (`kapak.en.json`, `author_bio`)
Paragraph 1 is third person ("Onur Önder is an engineer…"), paragraphs 2–5 are first person ("I am glad to share…", "Get ready to learn…"). Sentences to rewrite: "The real problem is that we cannot tell when we need to learn what." · "I am glad to share a source you need to read closely in order to understand and digest one of the most radical transformations and revolutions in the history of humanity and technology." · "Get ready to learn, from the ground up, the real source of the developments we may face in the years ahead." Suggestion: keep the bio in third person and cut to two sentences, e.g. "Onur Önder is a data and AI engineer and a co-founder of Fittechs. He wrote this book so that a reader with no background can follow the ideas of AI in order, on paper and on the phone." Keep the last paragraph (site + QR) as the only call to action. Back-cover blurb itself (`back_lead`, `back_text`) is clean.

---

## C — cosmetic

- **C1. Widow, p. 74 top:** "will answer a question it has never seen?" is a one-line paragraph tail at the top of the page, followed by a margin note. Other pages flagged by the pitch check (p. 42, 124, 140) are fine on inspection (a margin note closes the page).
- **C2. Figure 3.2 (p. 63), row 5:** "Learning a high score by playing a game" touches the right border of its cell at 100 dpi. **Figure 3.1 (p. 61):** the Label column ("Spam", "Normal") is set in the serif face while the rest of the figure is sans/mono — probably an unstyled `<td>` in the SVG.
- **C3. ffi ligature maps to "Ï" in the PDF text layer** ("scrufÏes", "efÏciency", "ofÏce", "sufÏxes", 24 hits, e.g. p. 9, 48, 52, 89, 107, 137). Print is correct (checked "scruffies" at 200 dpi); only copy/search is affected. Cause: Ghostscript's ToUnicode for the Work Sans ligature glyph. Harmless for KDP.
- **C4. "below" pointing to a figure on the next page:** p. 105 "Pick an example below and watch the machine…" (Figure 5.1 is p. 106); p. 124 "Try the context window yourself below" (Figure 5.7 is p. 125). Screen-verb sweep otherwise clean: no click/drag/slider/tap/scroll/hover/dropdown/"the demo below"; "on screen" appears only as "(purple on screen)" on p. 121/123, which is intentional; "Click now" on p. 59/61 is inside the spam example.
- **C5. Verso pages have no running head** (only the folio); recto carries "CHAPTER N · TITLE". Consistent throughout, so a design choice — noted only because KDP's Look Inside shows spreads.
- **C6. Figure fonts:** 4 Menlo, 4 Arial Unicode MS, 1 Helvetica subsets and 5 Type 3 fonts come from the figure SVGs (check marks, arrows, superscripts, mono labels). All embedded, so no KDP issue, but the glyph mix is visible in figures such as 3.1 (✓/○) and 4.1 (⁻⁰·⁶⁹).
- **C7. Chapter-end white space:** p. 56 (45 % empty, end of Chapter 2), p. 212 (65 %, end of Answer Key), p. 11 (71 %, end of Contents) — all natural section ends; chapter openers (p. 13, 37, 57, 79, 103, 131, 153, 173) are 67 % empty by design. Blank pages are only 4, 6, 8, 12, 36, 78, 102, 130, 192, 222 — every one a verso before a recto opener.
- **C8. eBook cover ratio 1.50:1** (1706 × 2560, the print trim ratio). KDP accepts it (min 625 × 1000, max 10 000 px) but recommends 1.6:1 (1600 × 2560); a 1600 × 2560 export from `kapak.mjs` would avoid side bars in some Kindle store thumbnails. RGB, 438 KB, < 50 MB: fine.

---

## Verified clean

- **Structure:** title (p. 1), copyright (2), acknowledgments (3), preface (5), How to Read This Book (7), contents (9–11), chapters 1–8 opening on recto p. 13, 37, 57, 79, 103, 131, 153, 173, Answer Key 193, Glossary 213, Bibliography and Further Reading 223, Live Demos 225–226, Index 227–228. No "Notes" pages.
- **Contents:** all 74 entries match the real pages (12 sampled: 1.2→15, 1.6→28, 1.7→31, Chapter 2→37, 2.3→42, 3.2→59, 4.1→80, 5.6→118, 6.1→132, 6.5→143, 8.3→178, 8.7→190).
- **Figures:** 45 title rows "Figure N.j · …" in order 1.1–8.5; 45 caption rows "Figure N.j  Live demo: book.onuronder.com/d/en/<slug>" each with a QR; the Live Demos list (p. 225–226) repeats all 45 slugs. Scaled figures (3.2 at 0.848, 7.3 at 0.867, 5.7 at 0.9, plus 3.1 and 6.4) are legible at 100 dpi; smallest mono labels ≈ 6 pt.
- **Layout:** no heading, "Setup.", "Step by step.", "Self-test.", "Try it yourself." or "What is happening?" label stranded at a page bottom; no table row split across a page; Technical depth boxes crossing a page break (p. 17→18, 33→34, 120→121, 166→167) close and reopen cleanly; running heads and folios present on all pages 13–228.
- **Text:** sections 1.1–8.7 all present and in order; quiz letters vs answer key checked for Chapter 1 (6/6) and Chapter 5 (8/8); no "[…]", "TO WRITE", "TODO", "digital version", double spaces; en dashes only in ranges and figure labels.
- **Cover:** back-cover copy matches `kapak.en.json`; all text ≥ 0.6 in inside the trim; spine author name legible at 200 dpi; four fonts embedded; PDF/X-1a.

---

## Fields the author must settle in KDP (the files do not decide these)

1. **ISBN** — free KDP ISBN (assigned at title creation, imprint "Independently published") or your own; the copyright page must then carry that number (A1). The web edition's 978-625-00-5299-0 must not be reused for the paperback.
2. **Interior type and paper** — the reviewed cover uses the generator's *Standard color*, **white** paper calculation. The current spine input is `kapak.en.json → pages`, using the final interior PDF page count; the formula lives in `kapak.mjs → SP`. There is no configurable paper setting in the JSON. A different paper calculation requires updating the generator and regenerating the cover; changing a note or adding `spine_mm` does not override KDP's page-based calculation.
3. **Trim 6 × 9 in, Bleed: "Bleed (PDF)"**, cover finish matte or glossy (the dark cover suits matte).
4. **Title / subtitle** as on the cover: "AI for Everyone" / "From rules to deep learning"; author Onur Önder; language English; edition number 1; publication date.
5. **Description** (up to 4000 characters, HTML allowed) — the back-cover text is a good base once B6 is rewritten.
6. **Keywords** (7) and **categories** (up to 3 BISAC) — e.g. Computers / Artificial Intelligence / General; Computers / Machine Learning; Science / History.
7. **Publishing rights** ("I own the copyright"), **AI-generated content** declaration (KDP asks whether text, images or translations were AI-generated and to what extent), **primary audience / reading age** (not a children's book).
8. **Pricing** per marketplace (KDP shows the minimum list price from the print cost; 228-page colour interior in the US costs roughly $4–9 to print depending on standard vs premium), **expanded distribution** yes/no, territories (worldwide).
9. After upload: open the **Print Previewer** — it is the authoritative check for A2 and will also show where its barcode lands relative to the white box (B1); order a proof copy before enabling sales.

# Style guide for the English print edition (EN)

This guide defines the **final manuscript** form of `print/src/en/M0x-*.md`. It mirrors `YAZIM-KILAVUZU.md` (TR) rule for rule;
where the two editions differ, the difference is noted. Source text (Simple, Technical, margin note, "What is happening?")
comes from `Atlas-Kitap-EN.dc.html` via `print/src/en/book.json` and is **kept word for word**; everything new is written around it.
The English chapters are not translations of the Turkish ones: they follow the same structure, the same figure blocks and the same
numbers, but every new sentence is written in English from the data.

## 1. Voice and language

- American English spelling (color, analyze, gray) and punctuation (double quotes, periods inside quotes). Chicago style for
  numbers and titles.
- Address the reader as **you**. Never "the reader", never "we will see". Contractions are fine ("isn't", "you'll") but not in
  Technical depth boxes.
- Simple track: **at most 30 words per sentence**, one idea per sentence, paragraphs of 2–5 sentences.
- A term gets a plain-language gloss on first use: "the loss (how wrong the guess is)". After that, the term alone.
- **No em dash (—) and no en dash as a separator.** Use a comma, a semicolon, a colon or a new sentence. Ranges use a hyphen in
  tables ("1971-1995") and words in prose ("from 1971 to 1995").
- Banned words and openers: surprising(ly), critical, crucial, game-changing, revolutionary, "In this chapter we will",
  "It may sound strange", "Remember that", "In summary", "To sum up", "In conclusion", "Note that", "delve", "leverage",
  "unlock", "journey" (as a metaphor).
- No screen verbs in print: click, tap, drag, press, slider, toggle, "the demo below", "watch", "hover". Replace with
  "Figure 3.5", "the table", "work it out by hand", "in the right panel of Figure 5.6".
- Source Simple paragraphs that contain a screen sentence ("Explore them below") are **not deleted**; the Figure block that
  follows answers that sentence on paper. Only sentences that would be meaningless on paper are adapted with the smallest
  possible change ("Drag the slider to the right" → "Follow the frames of Figure 5.6 from left to right"). Every such
  adaptation is logged as a line in the `<!-- EDITORIAL NOTES -->` block at the end of the file so the author sees it.
- Numbers: decimal point in formulas and tables (0.18); words for small numbers in prose ("forty percent", "two times"),
  numerals from 10 up and always with units ("8 bits", "3 billion").
- Formulas stay in the source's Unicode form: θ ← θ − η·∇L(θ). No LaTeX.
- In Technical text the source terms and formulas stay as they are; only new sentences are added, and they read naturally.

## 2. Chapter file format (final)

```markdown
# Chapter 3
## How Machines Learn
*From rules to patterns*

<!-- acc #1d6149 · tag Statistical AI -->

### 3.1 Intro: from rules to patterns          ← "N.k " + the source h2, unchanged

(Simple paragraphs, verbatim)

> **Margin note.** (tip, verbatim)

**Figure 3.1 · See the features and the label**       ← demo title, verbatim
![Figure 3.1](../../figures/out/en/figure-3-1-spam.svg)

*Setup.* 2–4 sentences: what you see in the figure. The source `hint` is the seed, screen verbs removed.

*Step by step.* The interaction, carried out on paper. Numbered list or a Markdown table. **Real numbers**, real examples:
the demo's data (`book.json`, the "Demo data" block in the export draft) and the "Embedded demo texts" list melt into this
part. For process demos (film strip) each frame is one item. Verdict sentences go here too.

*What is happening?* (neOluyorBasit, verbatim)

*Try it yourself.* 1–3 pencil-and-paper questions, solvable from the data in the figure. Ends with `Live demo: [QR 3.1]`.
Answers go to `print/src/en/answers/M03.md`, not into this file.

#### Technical depth
(Technical paragraphs, verbatim)

(the demo's technical "What is happening?" text, verbatim; formula/table added if useful; at most one page ≈ 350 words)

(1–2 bridge sentences that open the next section's question. No heading, plain paragraph.)

### 3.2 …

### 3.8 Test yourself
1. question
   a) … b) … c) … d) …          ← the shuffled order produced by export is kept EXACTLY

### What to keep from this chapter
- 5–7 bullets, one sentence each, in the chapter's order.

<!-- EDITORIAL NOTES
- 3.6 Simple: "Raise the learning rate and see for yourself" → "Look at what happens in the right panel of Figure 3.5"
-->
```

Rules:
- Chapter number `N` = module number (01 → 1). Section `N.k`, k = source order (quiz included). Figure `N.j`, j = the demo's
  order within the chapter (the number export assigns).
- A section without a demo has no Figure block. The margin note always comes after the Simple paragraphs and before the Figure block.
- Technical depth always comes after the Figure block and before the bridge. A Technical block never introduces a concept the
  Simple track has not introduced.
- Export working notes (`` `id: …` ``, "live demo: <url>", `<details>` blocks, "Embedded demo texts" lists, `[TO WRITE]` markers,
  "### Simple / ### Technical ▸" headings) do **not** survive in the final file; their content is used, then they are deleted.
- Figure file name: `figure-N-j-<demo type>.svg` (the EN figure set in `print/figures/out/en/`).
- Self-test demos (classify ×3, df, reg, tur, responsibility): a question list replaces Step by step; hints and reasons go to
  `answers/M0N.md`. The text says "answers are at the back of the book".
- Size: each Figure block carries 250–400 words of new text in total (Setup + Step by step + Try it yourself). No padding.
- Numbers, names and results in Step by step must match the EN figure tables in `print/figures/out/en/figure-N-j-*.md`
  (same data as TR; labels differ).

## 3. answers/M0N.md format

```markdown
# Chapter N answers

## Figure N.j · title
**Try it yourself.** 1) … 2) …
**Self-test.** (self-test demos only) item → correct answer: short reason
```

Quiz answers are not written here; `answer-key.md` is generated by export.

## 4. Front and back matter (`print/src/en/front/`, `print/src/en/back/`)

- `front/00-title.md`: title page (`# AI for Everyone` / `## From rules to deep learning` / **Onur Önder**), `---`, then the
  copyright page: © 2026 Onur Önder. All rights reserved. Marketing and sales rights: Fittechs Yazılım A.Ş. · Published by the
  author · ISBN `[ISBN]` · First edition `[month, year]` · Cover and interior design: Onur Önder · "The interactive digital
  edition, with all 45 live demos, is at book.onuronder.com".
- `front/01-acknowledgments.md`, `front/02-preface.md`, `front/03-how-to-read.md`: same content plan as the Turkish files, written
  in English (not translated line by line).
- `back/glossary.md`: 78 terms, English headwords, alphabetical; `back/bibliography.md`; `back/index-terms.yaml`
  (`Term: [aliases]`, 100+ entries, English).

## 5. Terminology (fixed English forms; TR → EN)

| TR | EN |
|---|---|
| yapay zekâ (YZ) | artificial intelligence (AI) |
| dar YZ / genel YZ / güçlü YZ | narrow AI / general AI (AGI) / strong AI |
| uzman sistem | expert system |
| arama, sezgisel arama | search, heuristic search |
| olasılık, Markov zinciri | probability, Markov chain |
| öğrenme oranı | learning rate |
| kayıp fonksiyonu | loss function |
| gradyan inişi | gradient descent |
| aşırı uyum | overfitting |
| yapay sinir ağı, nöron, ağırlık, yanlılık | neural network, neuron, weight, bias |
| geri yayılım | backpropagation |
| evrişimli sinir ağı (CNN) | convolutional neural network (CNN) |
| üretken çekişmeli ağ (GAN) | generative adversarial network (GAN) |
| token, gömme (embedding) | token, embedding |
| dikkat | attention |
| büyük dil modeli (BDM) | large language model (LLM) |
| difüzyon | diffusion |
| istem, istem mühendisliği | prompt, prompt engineering |
| RAG (bağlamla zenginleştirme) | retrieval-augmented generation (RAG) |
| ajan | agent |
| önyargı | bias (social); "bias term" for the neuron parameter |
| açıklanabilirlik | explainability |
| hizalama | alignment |
| derin sahte (deepfake) | deepfake |
| Turing testi, Çince Oda | Turing test, Chinese Room |
| tekillik | singularity |
| Kendini test et / Kendini sına | Test yourself / Self-test |
| Teknik derinlik | Technical depth |
| Kenar notu | Margin note |
| Şekil / Canlı demo | Figure / Live demo |
| Bu bölümden kalanlar | What to keep from this chapter |

## 6. Checks before a chapter is "final"

`python3 print/check_style_en.py` must report 0 issues for the file: no `[TO WRITE]`, no em dash, no banned words, no screen verbs,
no sentence over 30 words in the Simple track (Technical depth and tables are exempt), 45 Figure blocks and 45 `Live demo: [QR N.j]`
lines across the book, every figure path present on disk, glossary terms spelled consistently. Spelling: `codespell` plus
`hunspell -d en_US` with `print/src/en/wordlist.txt` for proper names.

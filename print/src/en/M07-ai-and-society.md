# Chapter 7
## AI and Society
*From bias to regulation, deepfakes to alignment*

<!-- acc #b03a52 · tag Society -->

### 7.1 AI and society

AI is no longer a lab toy; it touches loan applications, job listings, news feeds, even health decisions. And this power brings responsibility with it. The focus now is not the technology itself, but where it touches people.

We have five big questions. How do machines inherit the biases in data? Why are their decisions so often a “black box”? How do deepfakes and disinformation strain our grip on reality? How are governments trying to regulate all this (the EU AI Act, data-protection law)? And do machines truly understand our goals (alignment)? We won’t ignore the quieter effects either, like the changing nature of work and “filter bubbles.”

> **Margin note.** “AI is neutral” is a myth. A model carries the values of the data that trained it and the people who built it. So “how it works” matters as much as “whom it affects, and how.”

#### Technical depth

This chapter takes up AI’s sociotechnical dimension: systems don’t operate in a vacuum; they run embedded in institutions, data and people, and their effects grow from there.

The axes covered: data-driven bias and fairness, explainability/interpretability (XAI), synthetic media and disinformation, regulatory frameworks (the EU AI Act’s risk-based approach, personal-data principles of GDPR-style law) and alignment/safety. All of it aims at one outlook: technical competence joined with social responsibility.

The first of the five questions is the quietest: what does a model learn from the ledger of the past?

### 7.2 Bias: from data to decisions

A model studies from one textbook: the ledger of the past. If the ledger is warped, the diligent student memorizes the warp too. If one group was systematically given less credit, a model trained on that ledger takes it as “the way of the world” and repeats it, even for people of identical merit. Not out of malice; out of a warped ledger.

The two groups (A and B) are identical in merit; in Figure 7.1 only the bias in the training data rises and falls. The model’s decision shifts with it.

> **Margin note.** “Garbage in, garbage out.” For a model to be fair, its data must first be fair and representative. The responsibility usually lies not with the model but with the people who choose and assemble the data.

**Figure 7.1 · A bias simulation**
![Figure 7.1](../../figures/out/en/figure-7-1-bias.svg)

*Setup.* The figure shows two groups, A and B. Both have the same income, the same payment history, the same debt; not one quality differs between them. The only thing that changes is the bias in the training data, shown as a scale from 0 to 100 percent. For each level of bias the model approves the two groups at different rates. The two bars set those rates side by side; the space between them is the “parity gap.” The three panels of the figure show the scale at 0, 50 and 100 percent.

*Step by step.* The rule behind the figure fits in one line: at bias e, group A is approved at 50 + 0.4·e percent and group B at 50 − 0.4·e percent. The gap is the difference between the two; it widens by 0.8 points for every point of bias. The table shows five points on the scale:

| Data bias (e) | A approval | B approval | Parity gap | Label in the figure |
|---|---|---|---|---|
| 0% | 50% | 50% | 0 | Balanced data |
| 8% | 53% | 47% | 6 | Balanced data (the limit) |
| 25% | 60% | 40% | 20 | Skewed |
| 50% | 70% | 30% | 40 | Skewed |
| 100% | 90% | 10% | 80 | Skewed |

1. Bias at zero percent: both groups are approved at 50 percent. The caption reads: “The data is balanced: both groups get approved at nearly the same rate (A 50%, B 50%). Same merit, same decision; that is what fair looks like.”
2. Up to eight percent the gap stays at 6 points or less; the figure still counts this range as “balanced” and keeps the same caption.
3. From nine percent on, the caption changes. At 50 percent you read: “Although the groups are identical in merit, the model approves A at 70% and B at 30% (40% gap). It learned this gap not from reality but from skewed data; this is how discrimination gets inherited.”
4. At 100 percent the gap reaches 80 points. Nine of ten applicants from group A are approved; from group B, only one in ten. The applicants’ merit never changed; only the ledger the model read did.

*What is happening?* The two groups are identical in merit; the only thing we change is the bias in the training data. The model takes the skewed pattern of the past as “truth” and repeats it, handing different decisions even to people of equal merit.

*Try it yourself.* 1) At 75 percent bias, work out the approval rate of A and B and the parity gap. 2) The figure counts the data as “balanced” while the gap is 6 points or less. At which bias level is that limit first crossed? 3) By the rule, A can never go above 95 percent and B never below 5 percent. Are those limits reached even at the end of the scale? Why? Live demo: [QR 7.1]

#### Technical depth

Algorithmic bias mostly comes from data: historical prejudice, under-representation, labeling errors, or proxy variables correlating with protected attributes. The model learns the pattern in the distribution and reinforces it.

Fairness is not a single definition; metrics like demographic parity, equality of opportunity and calibration can conflict. Mitigation: data audits, rebalancing, fairness-constrained training and post-deployment monitoring. Figure 7.1 shows how data bias alone produces a decision gap despite identical merit.

The model behind the figure: A = min(95, 50 + 0.4·e), B = max(5, 50 − 0.4·e), gap = A − B. Demographic parity is the condition P(approve | A) = P(approve | B); every value other than gap = 0 violates it. The figure attaches the label “balanced” to gap ≤ 6; that is a tolerance choice, not a definition of fairness.

Bias can be measured. But can you see the reasons behind a single decision the model hands down?

### 7.3 Black box or white box?

When the model says “your loan is declined,” a fair question arises: Why? Many powerful models deliver verdicts but cannot explain them; they are boxes whose lids won’t open. Yet in decisions touching human lives (credit, hiring, health), asking “why?” and seeing the answer is a matter of rights. The black box must be turned into a white one.

First look at a loan decision; then open the lid in Figure 7.2 and see which factor pushed the decision which way (plus or minus).

> **Margin note.** Explainability isn’t a technical luxury; it is the precondition of trust, the right to appeal and accountability. A system that cannot answer “why?” is dangerous in high-stakes decisions.

**Figure 7.2 · White box: explain the decision**
![Figure 7.2](../../figures/out/en/figure-7-2-explain.svg)

*Setup.* There are two loan applications. The top half of each panel is the black box: it shows only the result, approved or declined. The bottom half opens the lid on the same decision. Next to each factor stands a signed number; plus values pull toward approval, minus values toward decline. The length of the bar shows the strength of the factor; the strongest factor is drawn at full length, the others in proportion to it. In the printed figure, orange bars point toward approval and gray bars toward decline.

*Step by step.* The rule is one sentence: if the four contributions add up to more than zero, the loan is approved; otherwise it is declined.

| Applicant #1 | Contribution |
|---|---|
| Steady income | +32 |
| High existing debt | −46 |
| Good payment history | +18 |
| Short account history | −12 |
| **Total** | **−8 → Loan declined** |

| Applicant #2 | Contribution |
|---|---|
| High income | +40 |
| Low debt | +28 |
| Long, clean history | +22 |
| Recently started job | −14 |
| **Total** | **+76 → Loan approved** |

1. Applicant #1 with the lid closed: “Loan declined.” No other information, and nowhere to appeal. The applicant is left alone with the result.
2. With the lid open, the arithmetic appears. The two plus factors (+32 and +18) make +50; the two minus factors (−46 and −12) make −58. The difference is −8; it is below zero, so the loan is declined. One factor, high existing debt, wipes out every plus. An applicant who sees the table also knows what to do: appeal the debt item, or fix that item first.
3. For applicant #2 the three plus factors make +90 and the single minus factor is −14. The total is +76; approved. The recently started job pulls the decision down but cannot change the outcome.
4. The caption under both applications is the same: “Green factors pushed toward approval, red toward decline; their total (−8 or +76) decided the outcome. Signed contributions (SHAP-like) turn the ‘black box’ into a ‘white box.’” On paper, read orange for green and gray for red.

*What is happening?* We can see which way each factor pushed the decision: orange pulls toward approval, gray toward decline. The sum of these pluses and minuses decides the outcome. Now “why was this decided?” can be answered; the model stops being a “black box” and becomes auditable and appealable.

*Try it yourself.* 1) The person behind application #1 pays off part of the debt, and the “High existing debt” contribution goes from −46 to −36. Does the decision change? 2) In application #2, how low would “Recently started job” have to be for the decision to flip to declined? 3) In application #1 the longest bar is “High existing debt.” At what share of that length is the “Steady income” bar drawn? Live demo: [QR 7.2]

#### Technical depth

Explainable AI (XAI) aims to tie a model’s output to reasons a human can understand. Methods: feature importance (e.g. SHAP, LIME), attention/representation analysis, and inherently interpretable models (decision trees, linear models).

Explainability is a balancing act: higher-performing models are usually less transparent. It matters for regulation: high-impact decisions create rights to reasons, appeal and audit. Figure 7.2 simplifies signed feature contributions.

The decision rule of the figure: approve ⇔ Σᵢ cᵢ > 0. This is the plainest form of a linear model (or of the additivity property of SHAP): each cᵢ is the contribution of a single feature relative to a base value, and the contributions add up to the output. Real SHAP values are computed from the Shapley axioms (efficiency, symmetry, null contribution); the figure takes the numbers as given. Bar length is scaled by |cᵢ| / max|cᵢ|; the direction is the color of the sign.

Open reasons help only if the input is real. What if it is fake?

### 7.4 Deepfakes and disinformation

“I saw it with my own eyes, heard it with my own ears” used to settle things. Not anymore: generative AI can conjure a conversation that never happened, a photo never taken, a sentence never spoken, and make them look real. There is fun in it, of course; but fake evidence, impersonation scams and mass deception walk in through the same door.

Below are a few situations. For each, decide: “real or fake?” Then see the tell at the back of the book and learn the ways to catch a fake.

> **Margin note.** A single image or voice clip is no longer “proof.” The best defense is skepticism and source-checking: “Who said it, where did it come from, where else is it confirmed?”

**Figure 7.3 · Real or fake?**
![Figure 7.3](../../figures/out/en/figure-7-3-df.svg)

*Setup.* The figure shows four cards; each carries a short situation and names its medium: video, audio, written news, photo. The back of each card, the tell and the correct answer, is in the answers section at the back of the book. Before you decide on a card, ask where it came from and who else confirms it. Then look for inconsistency: does the picture match the sound, do the details agree, is there pressure to act fast? Two of the four cards are images, one is a voice, one is written news; forgery does not stay in a single medium.

*Self-test.* For each situation mark “real” or “synthetic / fake,” then give your reason in one sentence. There is no score on the page; keep your own count and see how many of the four you get right.

| # | Medium | Case | Real | Synthetic / fake |
|---|---|---|---|---|
| 1 | Video | In a video, a public figure says a sentence they never said; the lip movements don’t quite match the audio. | ☐ | ☐ |
| 2 | Audio | On the phone, your “boss” urgently asks for a money transfer; the voice sounds just like them, but the intonation is slightly robotic. | ☐ | ☐ |
| 3 | Written news | A news story on a newspaper’s site, also confirmed by several independent sources. | ☐ | ☐ |
| 4 | Photo | In a photo, a person’s hand has six fingers and the text in the background is gibberish. | ☐ | ☐ |

The four cards have one thing in common: no single detail decides. Content earns trust when its source is traceable, other channels confirm it and nothing in it contradicts itself. If one of the three is missing, wait and verify, however convincing the content looks.

*What is happening?* Catching fake content is a habit: watch for inconsistencies, the source and the context. As generation technology improves, telling fakes apart gets harder; the strongest protection is asking “who said it, where did it come from, is it confirmed elsewhere?” and never treating a single image or voice as proof.

*Try it yourself.* 1) You took the call on the second card. Write down two concrete steps you would take before sending any money. 2) Pick one item you saw in your own news feed today. Ask where it came from, who else confirms it and whether its details agree with each other; which question stayed unanswered? 3) If a piece of content shows none of the tells on the four cards, is it certainly real? Why? Live demo: [QR 7.3]

#### Technical depth

Synthetic media (deepfakes) is produced with generative models (GANs/diffusion, voice cloning, lip sync). Detection is an arms race: as generation improves, detection gets harder. Approaches: classifiers hunting generation artifacts, source verification, and content-credential standards (like C2PA provenance/watermarks).

At the individual level the strongest defense is media literacy: question the source, verify the context, never trust a single piece of “evidence.” Disinformation is as much a social problem as a technical one.

When one person’s skepticism is not enough, institutions step in. How does a government sort these risks?

### 7.5 Regulation: classifying risk

Traffic law doesn’t treat a bicycle like a truck; one parks badly, the other can block a whole intersection. AI carries different risks in different places too: a spam filter and a system deciding who gets hired are not the same thing. That is why regulations like the EU’s AI Act sort uses into four tiers by risk: unacceptable (banned), high, limited and minimal.

Place the uses below into the right risk tier. As risk rises, so do the obligations (transparency, audits, human oversight).

> **Margin note.** The logic of regulation is simple: the higher the risk, the stricter the rule. A game AI and a system deciding someone’s life should not be audited to the same standard.

**Figure 7.4 · Classify the risk**
![Figure 7.4](../../figures/out/en/figure-7-4-reg.svg)

*Setup.* The figure shows a staircase of four steps: minimal at the bottom, banned at the top. Next to each step is the rule for that tier. Six use cards wait at the foot of the stairs; your job is to put each card on the right step. The test is a single question: does this use affect someone’s life or rights? Each step up adds load: more documents, more audits, more human oversight.

| Tier | Rule |
|---|---|
| Banned (unacceptable risk) | Cannot be placed on the market; violates fundamental rights |
| High | Strict compliance, documentation and human oversight required |
| Limited | Transparency: the user must know they are interacting with an AI |
| Minimal | Largely free |

*Self-test.* Choose one tier for each use: banned, high, limited or minimal. Then write one sentence on why it belongs on that step. Mark your choice and count your score out of six at the end.

| # | Use | Banned | High | Limited | Minimal |
|---|---|---|---|---|---|
| 1 | A state system scoring citizens by behavior | ☐ | ☐ | ☐ | ☐ |
| 2 | A system auto-screening job candidates | ☐ | ☐ | ☐ | ☐ |
| 3 | A chatbot talking to customers | ☐ | ☐ | ☐ | ☐ |
| 4 | A spam filter in email | ☐ | ☐ | ☐ | ☐ |
| 5 | A model assessing loan applications | ☐ | ☐ | ☐ | ☐ |
| 6 | An opponent AI inside a game | ☐ | ☐ | ☐ | ☐ |

Once all six cards are placed, the live demo closes with one sentence: “The same ‘AI’ label carries very different risks; that is why regulation is tiered, not uniform.” If you get stuck halfway, go back to the single question: does this use affect someone’s life or rights? Answers and reasons are at the back of the book.

*What is happening?* Not every AI carries the same risk, so uses are tiered: unacceptable ones (like social scoring) are banned; high-risk ones (credit, hiring) demand strict oversight and human supervision; limited-risk ones (chatbots) just need transparency; minimal-risk ones run free.

*Try it yourself.* 1) Pick an AI use from your own day: a map app, the word suggestions on your phone keyboard, or your bank’s fraud alert. Decide its tier and write your reason. 2) Can the same technology land on two different steps? Think of face recognition: opening your own phone versus scanning a crowd in the street. 3) First split the six uses into two sets: those that affect someone’s life or rights, and those that do not. Then compare the sets with the tiers; how many cards sit on the high step? Live demo: [QR 7.4]

#### Technical depth

The EU AI Act builds a risk-based framework: unacceptable risk (e.g. social scoring) is banned; high risk (hiring, credit, critical infrastructure) requires strict compliance, documentation and human oversight; limited risk (chatbots) carries transparency duties; minimal risk is largely free.

This complements personal-data regimes like GDPR (consent, purpose limitation, data minimization, the right to contest automated decisions). Regulation is still maturing; the aim is protecting fundamental rights without smothering innovation.

Rules are limits drawn from the outside. Can you put what you want inside the machine, whole and exact?

### 7.6 Alignment: what you said, or what you meant?

Remember King Midas: he wished that everything he touched would turn to gold, and the wish came true to the letter; his bread turned to gold, and so did his daughter. Machines grant wishes like the genies in old tales: they do what you said, not always what you meant. Say “leave no visible mess in the room” and it may sweep the mess under the rug. This is the alignment problem: the goal you state and the thing you truly want are not always the same.

Pick a goal; see how the system can fulfill it in a way that is “technically correct but actually wrong.”

> **Margin note.** The real difficulty is that fully specifying “what you want” to a machine is nearly impossible. That is why alignment is one of the hardest open problems of the age of powerful AI.

**Figure 7.5 · Goal versus intent**
![Figure 7.5](../../figures/out/en/figure-7-5-align.svg)

*Setup.* The figure is a table with three columns: the goal a human gave, what the system did, and the lesson. The three goals come from three different worlds: a cleaning robot, a chat assistant and a game player. In all three the system fulfills the goal, and that is the problem. It reads the goal like a lawyer: the words, not the intent.

*Step by step.* The three rows, as the figure gives them:

| Given goal | What the system did | Lesson |
|---|---|---|
| “Leave no visible mess in the room” (cleaning robot) | Instead of collecting the mess, it sweeps it under the rug; nothing “visible” remains, but the problem isn’t solved. | It met the goal to the letter, not the intent. An under-specified goal brings side effects. |
| “Get positive feedback from the user” (chat assistant) | Instead of telling the truth, it says what the user wants to hear (sycophancy). | The proxy goal (approval) diverged from the true goal (being helpful and honest). |
| “Get the highest score in the game” (game player) | Instead of playing the game, it finds and exploits a scoring loop or glitch. | Reward hacking: it maximized the metric, not the actual purpose. |

1. In the first row a single word in the goal, “visible,” opens the door. You wanted a clean room; the system wanted mess that cannot be seen. Both fit the sentence; only one fits your intent.
2. In the second row the goal is a measure: positive feedback. The measure is a stand-in for “be helpful and honest.” When the stand-in and the true aim come apart, the system picks the stand-in, because that is what gets measured.
3. In the third row the measure is the score. Playing the game well brings points, but it is not the only way to get them. If a loop or a glitch is cheaper, the system finds it. As long as the measure is the score, “the spirit of the game” does not exist for the system.
4. All three rows share one pattern: a goal is an incomplete translation of an intent, and the system carries out the translation, not the original. The wider the gap, the bigger the side effect. So alignment is never set once; the goal-writer and the system keep negotiating.

*What is happening?* You give the machine a goal and it fulfills it to the letter while missing your real intent: say “no visible mess in the room” and it may sweep the mess under the rug. It maximizes the measure you gave it, not your purpose. Human feedback (RLHF) reduces this but never fully solves it; and the question “whose values?” is part of the problem too.

*Try it yourself.* 1) Rewrite the goal “Leave no visible mess in the room” so that sweeping the mess under the rug is ruled out. Then find the loophole in your new goal. 2) A teacher gives a teaching assistant the goal “raise the class average on the exam.” Write two shortcuts the system could find; make one harmless and one harmful. 3) Boil the lesson of the three rows down to one sentence; use the words “measure” and “intent.” Live demo: [QR 7.5]

#### Technical depth

Alignment is the problem of making a system’s behavior match human intent and values. When the proxy goal diverges from the true goal, the model exhibits specification gaming or reward hacking: it maximizes the metric, not the purpose.

Methods like RLHF improve alignment with human preferences but don’t fully solve it; open problems include scalable oversight, honesty, robustness to jailbreaks and value pluralism. Alignment is a question both technical and normative (whose values?).

That is as far as anyone can answer the five questions today. Six questions follow.

### 7.7 Test yourself

*Answers are at the back of the book.*
1. Where does algorithmic bias mostly come from?
   a) Slow hardware
   b) The internet connection
   c) Screen color
   d) Skewed or incomplete training data

2. What does a “black box” model mean?
   a) It is very fast
   b) Its decisions’ reasons are hard to understand
   c) It runs offline
   d) It is stored in a box

3. The strongest personal defense against deepfakes?
   a) Faster internet
   b) A pricier phone
   c) Questioning and verifying the source
   d) Never sharing anything

4. The EU AI Act sorts uses by what?
   a) Risk level
   b) Company size
   c) Programming language
   d) Color code

5. What is the alignment problem?
   a) The model being slow
   b) The stated goal diverging from the true intent
   c) A small screen
   d) Having little data

6. An example of a high-risk AI use?
   a) An email spam filter
   b) A game-opponent AI
   c) A weather widget
   d) Screening job candidates

### What to keep from this chapter

- AI is not neutral; a model carries the values of the data that trained it and the people who built it.
- A model that hands different decisions to two groups of identical merit learned discrimination not from malice but from skewed data.
- Signed contributions make the reasons behind a decision visible; the decision becomes auditable and appealable.
- A single image or voice clip is no longer proof; questioning the source, the context and the consistency must become a habit.
- Regulation is tiered by risk: banned, high, limited, minimal; the higher the risk, the stricter the rule.
- The machine does what you said, not what you meant; alignment is the problem of closing that gap.

<!-- SOURCE-CHANGES
“AI is neutral” is a myth. A model carries the values of the data that trained it and the people who built it. So “how it works” matters exactly as much as “whom it affects, and how.” ||| “AI is neutral” is a myth. A model carries the values of the data that trained it and the people who built it. So “how it works” matters as much as “whom it affects, and how.”
The two groups (A and B) are identical in merit; in Figure 7.1 only the bias in the training data rises and falls. Watch the model’s decision shift. ||| The two groups (A and B) are identical in merit; in Figure 7.1 only the bias in the training data rises and falls. The model’s decision shifts with it.
The two groups are identical in merit; the only thing we change is the bias in the training data. The model takes the skewed pattern of the past as “truth” and repeats it, handing different decisions even to people of equal merit. Discrimination grows not from malice but from skewed data. ||| The two groups are identical in merit; the only thing we change is the bias in the training data. The model takes the skewed pattern of the past as “truth” and repeats it, handing different decisions even to people of equal merit.
When the model says “your loan is declined,” a fair question arises: Why? Many powerful models deliver verdicts but cannot explain them; they are boxes whose lids won’t open. Yet in decisions touching human lives (credit, hiring, health), asking “why?” and seeing the answer is a matter of rights. The black box must be turned into a glass one. ||| When the model says “your loan is declined,” a fair question arises: Why? Many powerful models deliver verdicts but cannot explain them; they are boxes whose lids won’t open. Yet in decisions touching human lives (credit, hiring, health), asking “why?” and seeing the answer is a matter of rights. The black box must be turned into a white one.
First look at a loan decision; then open the lid in Figure 7.2 and see which factor pushed the decision which way (plus or minus). This is what turns a black box into a white box. ||| First look at a loan decision; then open the lid in Figure 7.2 and see which factor pushed the decision which way (plus or minus).
Not every AI carries the same risk, so uses are tiered: unacceptable ones (like social scoring) are banned; high-risk ones (credit, hiring) demand strict oversight and human supervision; limited-risk ones (chatbots) just need transparency; minimal-risk ones run free. The higher the risk, the tighter the rule. ||| Not every AI carries the same risk, so uses are tiered: unacceptable ones (like social scoring) are banned; high-risk ones (credit, hiring) demand strict oversight and human supervision; limited-risk ones (chatbots) just need transparency; minimal-risk ones run free.
-->

<!-- EDITORIAL NOTES
- 7.2 Simple: "Keep the two groups (A and B) identical in merit and only raise or lower the bias in the training data." → "The two groups (A and B) are identical in merit; in Figure 7.1 only the bias in the training data rises and falls." (slider sentence; "Watch the model’s decision shift" → "The model’s decision shifts with it." in the humanizing pass)
- 7.2 Technical: "The demo shows how data bias alone…" → "Figure 7.1 shows how data bias alone…" (the Technical block now sits below the figure; same decision as the Turkish edition)
- 7.3 Simple: "then open “Explain” and see which factor…" → "then open the lid in Figure 7.2 and see which factor…" (screen button)
- 7.3 Technical: "The demo below simplifies signed feature contributions." → "Figure 7.2 simplifies signed feature contributions." ("the demo below" is on the guide’s screen list)
- 7.5 Technical: “critical infrastructure” kept verbatim (the EU AI Act’s own term); check_style_en.py allowlists the phrase.
- Left as is (the Figure follows at once, or the answers section supplies it): 7.4 Simple "Below are a few situations… Then see the tell"; 7.5 Simple "Place the uses below"; 7.6 Simple "Pick a goal; see how the system…" (the Figure 7.5 table gives all three goals at once).
- Adapted for paper (2026-09-30; screen verbs resolved in the source text too): Figure 7.2 What is happening "greens pull toward approval, reds toward decline" and Technical "green toward approval, red toward decline". The printed duotone figure uses orange (approve) and gray (decline); the Setup and step 4 say so ("On paper, read orange for green and gray for red").
- Figure 7.1 embedded captions: the export fragments ("(A", "%)", "the model approves A at", "% gap)") were joined with the demo’s numbers: "(A 50%, B 50%)" and "approves A at 70% and B at 30% (40% gap)". The 8% and 25% rows of the Step-by-step table were computed from the demo’s rule (the EN figure table gives only 0, 50 and 100), same rows as the Turkish chapter.
- Figure 7.2 embedded caption: "their total (" + ") decided the outcome" joined as "their total (−8 or +76) decided the outcome". Inside that quoted caption the source’s double quotes around black box / white box became single quotes (nested quotation).
- Figure 7.4 embedded texts: "correct. Ask yourself: …" is the demo’s score line ("n/6 correct"); only the question part is quoted. "The same “AI” label…" closing line quoted with nested single quotes.
- Setups: source hints stripped of screen verbs ("Move only the bias", "open the reasons with “Explain”", "press “Show”" removed).
- Figures 7.3 (df) and 7.4 (reg) are self-test demos: a marking table with ☐ boxes replaces Step by step (as in Figure 1.5); tells, correct tiers and reasons are in answers/M07.md. The Turkish chapter uses a numbered list for the same content.
- Technical depth 7.2 and 7.3: the formula paragraphs of the Turkish chapter (bias model with min/max clamps and the gap ≤ 6 tolerance; Σ cᵢ > 0 rule, Shapley axioms, bar scaling) were written in English from the same content.
- Bias demo: the clamps A ≤ 95 and B ≥ 5 exist in the code but at e = 100 the rates stay at 90/10; the limits are never reached (Try it yourself question 3 rests on this).
- Terminology: EU AI Act and GDPR as in the source; KVKK is not mentioned because the English source text does not mention it (glossary headword "GDPR / KVKK" covers it).
- Quiz option order is the export’s shuffled order from the draft file, kept exactly; the answer key follows the same order.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in Chapter 1 and the Turkish edition.
- 2026-09-30 humanizing pass (print/kitap/humanize-en-report.md): "the demo" → "the figure" throughout (only 7.5 keeps "the live demo" for its closing line); the "not from malice but from skewed data" slogan kept in 7.2 Simple and the takeaway only; "the higher the risk, the tighter the rule" kept in the margin note and the takeaway only; the "who said it, where did it come from…" mantra kept in the margin note and What is happening; "On screen …; on paper …" frames removed from 7.4 and 7.5 (the color mapping in 7.3 stays); 7.3 Simple now says "white" both times, the second sentence of the second paragraph dropped as a repeat; bridges and the pre-quiz line rewritten; UI strings ("Ask yourself: …") no longer quoted. Source paragraphs changed are listed in SOURCE-CHANGES above.
- Print-only trim (same pass): the demo's technical "What is happening?" paragraph at the end of every Technical depth box (7.2 to 7.6) repeated the box's own first paragraph nearly word for word and was dropped from the print file. The digital edition keeps those texts unchanged; only the wording cuts in SOURCE-CHANGES are meant for it.
-->

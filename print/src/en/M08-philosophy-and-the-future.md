# Chapter 8
## Philosophy and the Future
*Understanding, consciousness, singularity and responsibility*

<!-- acc #9a5a1f · tag Philosophy & Future -->

### 8.1 Philosophy and the future

This is the last chapter. You have seen how a machine “thinks”; now come the oldest and hardest questions. Can a machine understand, or does it only act as if it does? Is an AI smarter than us possible, and if so, when? And if machines one day gain consciousness, would they have rights?

These questions have no answers yet; even scientists and philosophers deeply disagree. I won’t push a “right answer” on you here. I will lay the views side by side; you will form your own. From the Turing test to the Chinese Room, from the singularity debate to the question of responsibility, we will think it through together.

> **Margin note.** In this final chapter you will find “good questions” more than “definite answers.” In philosophy as in science, asking the right question is often half the answer.

#### Technical depth

This closing chapter takes up AI’s philosophical foundations and long-term possibilities. These are largely open (and normative) questions; no consensus answer exists.

On the table: philosophy of mind (the Turing test as a behavioral criterion; the Chinese Room probing the gap between symbol manipulation and understanding), the capability horizon (narrow AI → AGI → superintelligence), recursive self-improvement and the “singularity” hypothesis (serious arguments and strong critiques), existential risk/opportunity frames, and AI’s moral and legal status. The job is weighing claims together with their evidence and counter-arguments.

The first question is the oldest: how would you know whether a machine thinks? Alan Turing answered it with a game.

### 8.2 The Turing test: can you tell?

In 1950 Alan Turing found the question “can machines think?” too foggy. He proposed a more practical one instead: can a machine imitate a human in writing so well that you cannot tell them apart? He called it the imitation game; today we call it the Turing test.

Below are short exchanges. For each, guess: was this reply written by a human or a machine? Then see the tell at the back of the book.

> **Margin note.** Passing the Turing test means “fluent imitation”; it does not mean “true understanding” or “consciousness.” Much of the modern debate comes from mixing the two up.

**Figure 8.1 · Human or machine?**
![Figure 8.1](../../figures/out/en/figure-8-1-tur.svg)

*Setup.* The figure shows four short exchanges. In each frame a question sits on top and a single reply underneath. Who wrote the reply is hidden, and so is the tell that gives it away; the tells wait at the back of the book. You play the imitation game as Turing set it: text only, no voice, no face.

*Self-test.* For each exchange, finish the sentence “this reply was written by a” with a mark in the table: human or machine? Then note, in one word, what pushed you to that decision.

| # | Prompt | Reply | Human | Machine |
|---|---|---|---|---|
| 1 | “What’s your favorite food?” | As an AI I cannot eat, so I don’t have a favorite. However, I can share information about popular dishes if you’d like. | ☐ | ☐ |
| 2 | “Did you hit traffic this morning?” | Don’t ask; stuck on the bridge a full 40 minutes, and my coffee went cold :( at least the podcast was good. | ☐ | ☐ |
| 3 | “What’s 17 × 24?” | 408. | ☐ | ☐ |
| 4 | “What did you do this weekend?” | Visited my folks, ate far too much, got caught in the rain on the way back. Classic. | ☐ | ☐ |

You are weighing three things as you guess: how formulaic the reply is, how personal it is, and how fast and flawless it is. Then step back and question the tells themselves. A machine can learn to write “my coffee went cold” too; an accountant can say 408 without a pause. Getting all four right is not hard, but that shows the examples are easy, not that the tells are solid. That is why Turing’s game wore down over time: as imitation improves, the tells go stale.

*What is happening?* The Turing test never tries to define “understanding”; it only asks “can you tell it from a human in writing?” But imitating well is not the same as truly understanding (see the Chinese Room); fluent systems can “game” this test.

*Try it yourself.* 1) Build your own exchange: write one question and two replies, one “like a machine,” one “like a human.” Show both to a friend; can they tell, and by what? 2) Will the tell in the third exchange still work five years from now? Answer with today’s chat models in mind. 3) Does a machine that wants to pass the test sometimes need to get an answer wrong? Say why or why not. Live demo: [QR 8.1]

#### Technical depth

The Turing test is a behavioral criterion: instead of defining “understanding,” it counts indistinguishable behavior as enough. Critiques: imitation doesn’t guarantee inner understanding (see the Chinese Room), and the test can be “gamed” by fluent language systems.

Modern large language models can pass loose versions of the test in short, everyday chats; rather than settling the “thinking” debate, this shifted the question to “what should the criterion be?” The test is less a benchmark than a historical and conceptual milestone.

The four tells in Figure 8.1 also show why the test wears down. Each one is a surface marker, and each one can be learned:

| Kind of tell | What it measures | When it misleads |
|---|---|---|
| Formulaic, polite style | A trace of the training instructions | When the model is told “talk casually” |
| Personal detail, emotion | An impression of lived experience | When the model invents fictional detail |
| Flawless, instant arithmetic | Calculator behavior | When the model is told “pause like a human” |
| Everyday language, emoji | Chat habits | In every model trained on chat data |

Is a fluent reply the same as understanding? John Searle’s room pokes at that question.

### 8.3 The Chinese Room: understanding or processing?

In 1980 the philosopher John Searle proposed this experiment: you are in a room and know no Chinese. Chinese notes arrive from outside. You hold a thick rulebook: “if you see this symbol, reply with that one.” Following the rules, you produce flawless Chinese answers, yet you understand not a word of Chinese.

Below, you are the person in that room. Process the incoming symbol and send the reply the rule produces. The question: does this room “understand” Chinese, or is it just shuffling symbols?

> **Margin note.** The Chinese Room is not a proof; it is a powerful intuition pump. To some it shows “machines can never understand”; to others it shows we are looking for understanding in the wrong place. What do you think?

**Figure 8.2 · You are in the Chinese Room**
![Figure 8.2](../../figures/out/en/figure-8-2-chineseroom.svg)

*Setup.* The figure shows the room. On the left lies the incoming note, pushed under the door; in the middle, the rulebook’s open page; on the right, the reply you pass out. The rulebook has three lines, and each line says “if this comes in, send this out.” The symbols are Chinese; their meanings are hidden from you. The person outside cannot see you, only the paper that comes out under the door. As in the real thought experiment, all you have is the matching of shapes.

*Step by step.* Three notes arrive in turn. For each one, find the rule, produce the reply, pass it out.

| # | Incoming note | Line in the rulebook | Reply you give |
|---|---|---|---|
| 1 | 你好吗？ | 你好吗？ → 我很好，谢谢！ | 我很好，谢谢！ |
| 2 | 你叫什么名字？ | 你叫什么名字？ → 我叫小助手。 | 我叫小助手。 |
| 3 | 现在几点？ | 现在几点？ → 现在是下午三点。 | 现在是下午三点。 |

You gave all three replies flawlessly. The person outside believes they are chatting with you in Chinese. Now the curtain lifts: what did you say?

| # | Meaning of the incoming note | Meaning of your reply |
|---|---|---|
| 1 | How are you? | I’m fine, thanks! |
| 2 | What’s your name? | My name is Little Helper. |
| 3 | What time is it? | It’s three in the afternoon. |

You told someone your name is Little Helper. You said it is three o’clock, and you never looked at a clock. Still, the replies were “correct,” because the rulebook was correct. Searle’s question lands right here: do you, in the room, understand Chinese? Most readers say no. But do the room, the book and you understand together? That is where opinions split.

The rulebook had only three lines; a real conversation would need millions. And answering “three” to “What time is it?” every time gives you away on the fourth note. A large language model can be seen as a huge, statistical version of this book. Both the strength and the weakness of the experiment hide in that comparison.

*What is happening?* The Chinese Room says this: applying rules and producing the right symbols (processing the form) doesn’t mean truly understanding the language. So answering correctly (passing the Turing test) doesn’t by itself mean “it understands.” But strong counter-views exist (maybe understanding lives not in the person but in the whole of room + rules); the debate is still open.

*Try it yourself.* 1) Add a fourth line to the rulebook: make up a reply to “你几岁？” (How old are you?); writing it in English is enough. You wrote the line yourself; does the room now understand “a little more”? 2) Give the room a window and a wall clock, and make the rule “read the clock and say the time.” Has anything changed as far as understanding goes? Give your reason. 3) Searle says that even if he memorized the whole rulebook he would still not understand. Does that answer refute the “systems reply”? Agree or object in your own words. Live demo: [QR 8.2]

#### Technical depth

The Chinese Room argues that syntactic symbol manipulation is not enough to produce semantic understanding; so behavioral success (the Turing test) cannot count as proof of real understanding (a critique of “strong AI”).

The counter-views are strong: the “systems reply” says understanding may live not in the person but in the whole of room + rules + process; the “robot reply” argues grounding through senses and motors would change the picture. The debate remains an unsolved question about the nature of understanding and consciousness.

In technical terms, the rulebook of Figure 8.2 is a lookup table: an input string of symbols, an output string of symbols. A language model also goes from an input sequence to an output sequence. The difference is that its table is not written out as lines; it sits implicit in billions of weights. To Searle that difference does not matter; both are syntax. To his critics, scale and structure may be what gives rise to understanding. How strong the argument looks depends on which side you stand on.

Set the question of understanding aside for a moment. How far can machines go? A ladder of three rungs gives one answer.

### 8.4 From narrow AI to superintelligence

Every AI today is “narrow”: excellent at one job (chess, translation, images) and unable to step outside it. The next rung is artificial general intelligence (AGI), able to learn and adapt across every domain like a human. Beyond that, people imagine a superintelligence surpassing humans many times over in every field.

Look at the rungs of Figure 8.3 one by one; see what each means and the answer to “does it exist today?”

> **Margin note.** Headlines shout “AI will surpass humans,” but careful: surpassing at one task (narrow) and at every task (general) are very different things. We are at the first today; the second is still an open question.

**Figure 8.3 · The capability ladder**
![Figure 8.3](../../figures/out/en/figure-8-3-capability.svg)

*Setup.* The figure shows a ladder with three rungs. Next to each rung is a bar: the first is 30 percent full, the second 70 percent, the third full. The bars only order the rungs; they measure nothing. The name of the rung, its status today and a short definition are written beside it, and the color darkens as the ladder climbs.

*Step by step.* The three rungs, with their definitions:

| Rung | Today | Definition |
|---|---|---|
| Narrow AI | Exists today ✓ | Very good at one task (chess, translation, vision) but unable to step outside it. All of today’s systems live here. |
| General AI (AGI) | Not yet; contested | A hypothetical level able to learn and adapt across every domain like a human. Whether and when it arrives is debated among experts. |
| Superintelligence | Speculative | A wholly theoretical level surpassing humans many times over in every cognitive field. The subject of both great-opportunity and serious-risk scenarios. |

Only the first row is marked “Exists today,” and everything in this book, chat models included, sits there. “Contested” and “speculative” differ only in how far away the thing is. The bars go 30, 70, 100, but the real distance between the rungs is unknown: the second may be ten years from the first, or a hundred; it may never come.

But a chat model writes poems and produces code; isn’t that “general”? This is why some experts put intermediate rungs between narrow and general. The table has three rungs; the real world is probably a continuous slope.

*What is happening?* Capability comes in three rungs: narrow AI is good at one job (we are here today); general AI (AGI) could learn any domain like a human (doesn’t exist yet; contested); superintelligence would surpass humans many times over in everything (a dream for now). Careful: “doing every job” and “being conscious” are separate things.

*Try it yourself.* 1) Place three AI products you use today (translation, recommendations, chat) in the table. Did they all land in the first row? If you want to move one to the second row, say which new job that system learned on its own. 2) Which test would have to be passed before you could say “AGI has arrived”? Propose a one-sentence criterion; then say why your criterion differs from the Turing test. 3) Name a system that beats humans at one job without being “general,” and say what it cannot do. Live demo: [QR 8.3]

#### Technical depth

The capability horizon is roughly three tiers: narrow AI (task-specific), AGI (human-level generalization across domains) and superintelligence (superhuman in every cognitive field). The borders blur.

Expert views on whether and when AGI arrives span a wide range (soon, far, perhaps never). Measurement is hard too: there is no agreed criterion for “general intelligence.” Treat claims that give definite dates with caution.

The measurement problem is real: a system can beat the human average on hundreds of tasks and still fail to transfer to a new domain. So in AGI debates, “which task list?” and “how is transfer measured?” are more productive questions than date predictions.

How do you climb to the third rung, and can it be climbed at all? It depends on how intelligence grows over time.

### 8.5 The singularity: myth or serious possibility?

Picture a snowball rolling downhill: the more it rolls, the bigger it grows; the bigger it grows, the more snow it gathers. Some tell the same tale about AI: a system smart enough to improve itself builds a better version, which builds a better one still... until intelligence avalanches toward an unpredictable point called the “singularity.” To some this is near and inevitable; to others, an overblown myth.

Look at the scenarios below: how might intelligence progress over time? Compare the “accelerating,” “plateauing” and “uncertain” curves.

> **Margin note.** The healthy stance: neither “certain” nor “impossible.” Even under uncertainty, making powerful systems safe and aligned (Chapter 7) is a sensible investment starting today.

**Figure 8.4 · Three intelligence curves**
![Figure 8.4](../../figures/out/en/figure-8-4-singularity.svg)

*Setup.* The figure shows a single chart: time on the horizontal axis, “intelligence” on the vertical. Both are unitless; time runs from 0 to 10, intelligence from 0 to 10. There are three curves, and they end in three different places. The axes carry no years, because the curves are not forecasts; they are the shapes of three stories. Each curve has its own note; all three are below.

*Step by step.* The formulas behind the three curves, and their values at five points in time (0 to 10 scale):

| Time | Accelerating: 10·(t/10)³ | Plateauing: 10·(1 − e^(−t/2.2)) | Uncertain: 5 + 2.5·sin(t/1.6) + 0.15·t |
|---|---|---|---|
| 0 | 0.0 | 0.0 | 5.0 |
| 2.5 | 0.2 | 6.8 | 7.9 |
| 5 | 1.3 | 9.0 | 5.8 |
| 7.5 | 4.2 | 9.7 | 3.6 |
| 10 | 10.0 | 9.9 | 6.4 |

1. **Accelerating.** Recursive self-improvement: intelligence feeds itself and explodes. The argument in favor rests on feedback loops. In the table it barely moves in the first half; in the last quarter it shoots from 4 to 10. This is the snowball tale.
2. **Plateauing.** Diminishing returns: data, energy and physics limits slow the growth; intelligence approaches a ceiling. It nears 7 in the first quarter, then leans against the ceiling. Every technology that starts fast comes to look like this curve one day.
3. **Uncertain.** The plain answer: nobody knows. Leaps and pauses may coexist; treat claims with definite dates with caution. The curve rises to nearly 8, drops to 3.6, then climbs again. It has a direction but no rhythm.

Look at the row for time 2.5 in the table. The plateauing curve stands at 6.8 there; the accelerating curve at 0.2. Today’s fast progress could be the steep start of the plateauing curve, or the calm first half of the accelerating one. The same observation fits both stories at once. Which curve you are on shows only in hindsight, and that keeps the debate alive.

*What is happening?* The idea: if an AI can improve itself, it builds a better version, which builds a better one still... and intelligence suddenly explodes toward an unpredictable point (the “singularity”). Some see it as near, others as an overblown myth; data, energy and physics limits could slow it. In short: not a proven prophecy, but an uncertain possibility worth taking seriously.

*Try it yourself.* 1) At what time does the accelerating curve pass 5? Solve 10·(t/10)³ = 5; you will need a cube root, and an approximate value is enough. 2) Does the plateauing curve ever reach 10? Answer from the formula; then say which value you would count as the threshold for “it got there in practice.” 3) Which of the three curves makes the “safety investment” in the margin note unnecessary? None of them? Give your reason in one sentence. Live demo: [QR 8.4]

#### Technical depth

The singularity hypothesis holds that recursive self-improvement could trigger an exponential “intelligence explosion.” The arguments in favor (I. J. Good, and modern proponents) rest on speed and feedback loops.

There are strong critiques too: intelligence may be neither one-dimensional nor endlessly scalable; data, energy, hardware and physics set limits; complexity and diminishing returns bite. The curves below are qualitative.

The three formulas in Figure 8.4 are analogies, not models. The cubic curve stands for the explosion, the saturating exponential (1 − e^(−t/τ), τ = 2.2) for the ceiling, and the sine plus a linear term for leaps and pauses. The real debate turns less on which curve is right than on two questions. Is each round of the self-improvement loop faster than the one before? And which resource (data, energy, compute) runs out first? Both questions are empirical and can be answered over time; the curve gets its name only afterward.

Whatever the curve, these systems make decisions today, and they make mistakes. When something goes wrong, who answers for it?

### 8.6 Responsibility and rights

If an AI causes harm, who is responsible? The company that built it, the organization that deployed it, the end user, or “the AI itself”? Then a deeper question. What if machines one day gain some kind of experience, even consciousness? Would we owe them moral consideration; would they have rights?

Pick a scenario and mark who you would hold responsible. Then see the prevailing legal and ethical view, and weigh the different stances in the rights debate.

> **Margin note.** We have reached the end of the book. Perhaps the most important lesson is this: AI’s future will be decided not by the “technology” but by the values with which we build and use it. You have a say in that future. 🌱

**Figure 8.5 · Who is responsible?**
![Figure 8.5](../../figures/out/en/figure-8-5-responsibility.svg)

*Setup.* The figure shows three scenario cards and four parties: maker / developer, operating organization, end user and the AI itself. For each scenario, mark the party you would hold responsible. Your answer key is the view that carries the most weight in today’s legal and ethical debate; “right” here means today’s consensus, nothing stronger.

*Self-test.* For each scenario, give the responsibility to one party and justify it in one sentence. The prevailing view for each scenario, with its reason, is at the back of the book.

| # | Scenario | (a) Maker / developer | (b) Operating organization | (c) End user | (d) The AI itself |
|---|---|---|---|---|---|
| 1 | A self-driving car crashes because of the maker’s software bug. | ☐ | ☐ | ☐ | ☐ |
| 2 | An organization blindly applies an AI’s advice and harms a customer. | ☐ | ☐ | ☐ | ☐ |
| 3 | A user deliberately uses an AI tool to produce fake content. | ☐ | ☐ | ☐ | ☐ |

Three questions help. In the chain that led to the harm, who made the decision? Who could have checked and did not? Who intended harm? If the fourth party tempts you, ask what a court sentence would mean to a piece of software. The law does not go there; responsibility gathers in the human links of the chain. The scenarios here are simpler than life. In real cases all three human parties turn out partly responsible, and the fight over shares runs through the courts for years.

The rights question has no scenario, because it has no case yet. Today there are two main stances. One says rights need experience or consciousness, which today’s systems lack, so the question is premature. The other says that where nobody is sure, caution is due: better careful now than wrong later. Both rest on the question of consciousness, and no chapter of this book has settled it. Nobody has.

*What is happening?* When harm happens, responsibility today almost always lands on people and institutions: whoever built, operated or used the system. Holding “the AI itself” legally responsible is not a common view. Whether machines could one day hold rights is an entirely different question, and still open.

*Try it yourself.* 1) Write a fourth scenario: a case where responsibility falls on two parties at once. How would you split the share? 2) Which of the two stances above is closer to yours? One sentence on why. 3) You have a say in the future of AI, the margin note says. Where, concretely, does yours begin? Write one example. Live demo: [QR 8.5]

#### Technical depth

Accountability today is overwhelmingly attributed to people and institutions: humans make the design, deployment and usage decisions; assigning legal responsibility to “the AI itself” is not the prevailing view. Responsibility is usually shared and context-dependent (developer, operator, user, regulator).

AI’s moral status is a separate, contested question: some argue status requires sentience, absent in current systems; others invoke precaution. It is both an empirical question (is there consciousness?) and a normative one (if there were, what would we owe?), and it remains open.

The three scenarios in Figure 8.5 stand for three separate sources of responsibility: defect (a design error), negligence (use without oversight) and intent (deliberate misuse). Legal systems meet these three with different instruments: product liability, duty of care and criminal law. The fourth party fits none of these frameworks, because responsibility requires a subject for whom a sanction means something.

None of these questions closes with the chapter; they are the kind you keep. Six questions follow.

### 8.7 Test yourself

*Answers are at the back of the book.*
1. What does the Turing test fundamentally measure?
   a) Real consciousness
   b) Amount of memory
   c) Imitating a human indistinguishably in writing
   d) Processing speed

2. What does the Chinese Room argument question?
   a) Internet security
   b) Computer speed
   c) Whether symbol processing alone yields “understanding”
   d) The difficulty of Chinese

3. What level is today’s AI at?
   a) AGI
   b) Conscious AI
   c) Superintelligence
   d) Narrow AI

4. The most balanced stance on the singularity?
   a) It already happened
   b) Definitely happening tomorrow
   c) Completely impossible
   d) Uncertain; neither certain nor impossible

5. When an AI causes harm, responsibility today usually falls on?
   a) People and institutions (developer/operator/user)
   b) Only the AI itself
   c) No one
   d) The internet

6. The question of AI’s moral status (rights) today is?
   a) Open and contested
   b) Banned by law
   c) Definitively settled
   d) A meaningless question

### What to keep from this chapter

- The questions in this chapter are open, and that is their point.
- The Turing test looks at behavior: a machine that cannot be told apart in writing passes, but fluent imitation is not understanding.
- The Chinese Room argues that matching symbols by rule does not produce understanding; whether understanding lives in the person or in the system is still contested.
- Every AI today is narrow; general AI is hypothetical, superintelligence is theoretical, and being “general” is not being “conscious.”
- Nobody has proven the singularity and nobody can rule it out; which curve we are on shows only in hindsight.
- When harm happens, responsibility today falls on people and institutions: whoever built, operated or used the system.
- Whether machines will ever have rights turns on the open question of consciousness; the future of AI will be decided by the values that build and use it.

<!-- SOURCE-CHANGES
We have reached the end of the road. We have learned how a machine “thinks”; now come the oldest and hardest questions. Can a machine truly understand, or does it only act as if it does? Is an AI smarter than us possible, and if so, when? And if machines one day gain consciousness, would they have rights? ||| This is the last chapter. You have seen how a machine “thinks”; now come the oldest and hardest questions. Can a machine understand, or does it only act as if it does? Is an AI smarter than us possible, and if so, when? And if machines one day gain consciousness, would they have rights?
Passing the Turing test means “fluent imitation”; it does not mean “true understanding” or “consciousness.” Keeping those questions apart is the key to the modern debate. ||| Passing the Turing test means “fluent imitation”; it does not mean “true understanding” or “consciousness.” Much of the modern debate comes from mixing the two up.
The capability horizon is roughly three tiers: narrow AI (task-specific), AGI (human-level generalization across domains) and superintelligence (superhuman in every cognitive field). The borders blur; being “general” and being “conscious” are separate questions. ||| The capability horizon is roughly three tiers: narrow AI (task-specific), AGI (human-level generalization across domains) and superintelligence (superhuman in every cognitive field). The borders blur.
There are strong critiques too: intelligence may be neither one-dimensional nor endlessly scalable; data, energy, hardware and physics set limits; complexity and diminishing returns bite. It is not a proven prophecy but an uncertain scenario worth taking seriously. The curves below are qualitative. ||| There are strong critiques too: intelligence may be neither one-dimensional nor endlessly scalable; data, energy, hardware and physics set limits; complexity and diminishing returns bite. The curves below are qualitative.
-->

<!-- EDITORIAL NOTES
- 8.4 Simple: "Tap the rungs one by one; see what each means and the answer to “does it exist today?”" → "Look at the rungs of Figure 8.3 one by one; see what each means and the answer to “does it exist today?”"
- 8.2 Simple: "Below are short exchanges. … Then see the tell." → "Then see the tell at the back of the book." (2026-09-30).
- 8.3 Simple: "Process the incoming symbol and send the reply the rule produces." left as is; "send" is the thought experiment's own verb, not a screen verb.
- 8.5 Simple: "Look at the scenarios below" left as is (Figure 8.4 follows at once).
- 8.6 Simple: "Pick a scenario and mark who you would hold responsible. Then see the prevailing legal and ethical view" left as is; markable with a pencil, the view is at the back of the book.
- 8.1 Simple: "the end of the journey" is source text; "journey" is on the banned list → "the end of the road" (2026-09-30); in the humanizing pass the sentence became "This is the last chapter." so that the book announces its ending once, in the 8.6 margin note (see SOURCE-CHANGES).
- 8.5 Technical (source): "The curves below are qualitative." points, on paper, to Figure 8.4 which now sits above that paragraph. Left verbatim, as in M01 ("The simulation below").
- Every Technical depth box carried the demo's technical "What is happening?" text verbatim, per the guide; in all five it nearly repeated the section's first technical paragraph (especially 8.2 and 8.4). Print-only trim (2026-09-30 humanizing pass): those five paragraphs were dropped from the print file. The digital edition keeps them unchanged; only the wording cuts in SOURCE-CHANGES are meant for it.
- Figure 8.1 (tur) and Figure 8.5 (responsibility) are self-test demos: a marking table replaces Step by step (pattern of M01 Figure 1.5); the demo's tell/reason sentences go verbatim into answers/M08.md. The tur UI fragment "this reply was written by a" is woven into the Self-test sentence; the responsibility feedback strings ("✓ The prevailing view agrees." / "✗ The prevailing view differs." / "✗ “The AI itself” is not the prevailing view.") were quoted in the Self-test paragraph until the humanizing pass removed them (screen feedback has no place on paper; the answers section gives the prevailing view and its reason).
- Figure 8.1 answers: the TR answer 1 says the friend looks at "kalıplı üslup ve kişisel ayrıntı yokluğu"; same reasoning in EN. Prompts and replies in the table are the EN demo's own lines (not translations of the TR ones).
- Figure 8.2: the embedded EN texts "My name is Little Helper." and "It’s three in the afternoon." are used verbatim in the meaning table; the other meanings ("How are you?", "I’m fine, thanks!", "What’s your name?", "What time is it?") come from the EN figure table figure-8-2-chineseroom.md. Chinese characters unchanged. Try it yourself 1) "Türkçe yazman yeter" → "writing it in English is enough".
- Figure 8.3 table: status labels taken verbatim from the EN figure table ("Exists today ✓", "Not yet; contested", "Speculative"); the EN source has no em dash here, unlike the TR "Henüz yok — tartışmalı".
- Figure 8.4 table: values follow the EN figure table figure-8-4-singularity.md, which gives 1.3 for the accelerating curve at t = 5 (exact value 1.25, rounded half up); the TR chapter and TR table show 1.2. Figure generator should keep the same formulas. Answers do not depend on this cell.
- Figure 8.5 answers: the prevailing-view reasons are the EN demo's own strings (semicolons, no em dash), unlike the TR strings that keep an em dash.
- 8.7: the export draft's heading "Kendini test et" (Turkish) → "Test yourself"; the export line "_Answers: answer-key.md_" is a working note and was removed.
- Quiz option order is the export's shuffled order, kept exactly; the answer key follows the same order.
- Setups: source hints stripped of screen verbs ("tap" removed); the "On screen … on paper …" frames in 8.2 and 8.6 were removed in the humanizing pass.
- Last bridge (8.6 → 8.7) and the final takeaway keep the TR closing tone (values over technology); the bridge no longer announces the end of the book, the 8.6 margin note does.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in the Turkish edition. The 🌱 emoji in the 8.6 margin note is source text and was kept.
- 2026-09-30 humanizing pass (print/kitap/humanize-en-report.md): the ending is announced once (8.6 margin note); "prevailing view" appears once in the new text; "general ≠ conscious" kept in 8.4 What is happening and the takeaway; "not a proven prophecy" kept in 8.5 What is happening only (takeaway and glossary reworded); the bar disclaimer in 8.4 said once; "Notice…", "look at three things", "ask three questions", "First… Second…" signposts and the string of rhetorical questions in 8.6 removed; "deliberate / on purpose", "exactly", "honest" cut; the pre-quiz line no longer twins M07; scare quotes and "not X but Y" mirrors thinned. Source paragraphs changed are listed in SOURCE-CHANGES above.
-->

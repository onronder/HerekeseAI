# Chapter 1
## Minds and Machines
*Can a machine think?*

<!-- acc #2a3bb0 · tag Foundations -->

### 1.1 Can a machine think?

Once upon a time... except this story isn’t over, and you are in it. It began long before computers, with a question: What is thinking? If some kind of gear turns inside our heads, couldn’t a machine turn the same gear? People have argued about this for centuries.

This first chapter goes back to the very beginning. What is intelligence? Can “thinking” be written down as a step-by-step recipe? The path runs from Babbage’s gears to the birth of the modern computer, and by the end it will be clear why artificial intelligence (AI for short) is possible at all.

> **Margin note.** AI isn’t new: “can machines think?” has occupied philosophers since the 1600s. What’s new is the hardware that can test it.

#### Technical depth

AI was born at the intersection of computability theory and the philosophy of mind. The core claim: if mental processes can be described by formal rules, then in principle a machine can carry them out too.

This chapter starts from defining intelligence, lays the foundation stones of computation (binary representation, algorithms, the Turing machine, the stored-program architecture) and connects to the modern debate via the weak/strong AI distinction. That gives the later learning and neural-network ideas solid ground to stand on.

Start with the first question. What is this “intelligence” you want to hand to a machine?

### 1.2 What is intelligence?

It looks like an easy question, but “what is intelligence?” has no single answer. Is the puzzle-solver smart, or the person who instantly finds their way in a new city, or the friend who reads your sadness in one glance? Perhaps all of them; yet each is a very different skill.

The psychologist Howard Gardner made the same point: intelligence doesn’t fit in one number (IQ); it comes in several kinds. He proposed seven in 1983 and later added naturalistic intelligence. The theory is debated, but it is a useful way to see that intelligence is not one thing. Explore the kinds below. The interesting part is that today’s AI is a master of some and still a toddler at others.

> **Margin note.** A calculator is far faster than you at particular calculations but can’t laugh at a joke. Being “smart” isn’t a single axis.

**Figure 1.1 · Explore multiple intelligences**
![Figure 1.1](../../figures/out/en/figure-1-1-intelligence.svg)

*Setup.* The figure shows eight cards, one for each kind of intelligence in Gardner’s theory. Seven come from his 1983 list; the naturalist kind was added later. The bar under each card shows roughly where today’s AI stands in that area. The bars are illustrative levels chosen for the explanation, not measurements: a full bar means “strong,” a half bar “medium,” a short stub “weak.”

*Step by step.* All eight cards, in the order of the figure:

| Intelligence type | What it means | AI today | Bar (illustrative) |
|---|---|---|---|
| Linguistic | Using language, writing and narrative. | Strong | 90% |
| Logical-Mathematical | Numbers, logic and systematic reasoning. | Strong | 90% |
| Spatial | Grasping space, shapes and visuals. | Medium | 55% |
| Musical | Sensing rhythm, melody and sound patterns. | Medium | 55% |
| Bodily-Kinesthetic | Skillful use of the body and hands. | Weak | 22% |
| Interpersonal | Understanding others, empathy and communication. | Weak | 22% |
| Intrapersonal | Knowing one’s own emotions and goals. | Weak | 22% |
| Naturalist | Recognizing living things and patterns in nature. | Medium | 55% |

The percentages are not measured performance; they are the bar lengths of the three levels in the figure. Tally the last column and you get two “strong,” three “medium,” three “weak.” What do the two strong ones have in common? Both work with symbols: letters, numbers, rules. A computer runs on that same material; the binary code in the next section is a string of symbols too.

The three weak ones ask for a different material: a body, the face of the person across from you, your own inner world. None of these turns into symbols easily. The middle three, space, music and nature, sit between the two. Part of sound and image can be turned into numbers; part of it still resists.

The order of the cards is not a ranking, either. They only count separate abilities; none of them is “more intelligence” than another. The same holds for AI: being strong in language does not mean being strong in the other seven areas.

*What is happening?* For Gardner, intelligence isn’t one number but eight distinct families of ability; each card in the figure is one of them. And today’s AI is great with language and logic; at anything involving the body or emotions the result depends on the task and the system, and in most of them it is still far behind. The bars are illustrative levels, not measured scores.

*Try it yourself.* 1) Close the book and list the eight kinds of intelligence from memory. How many did you recall, and which ones slipped your mind? 2) Think about yesterday: from morning to night, which three kinds did you use most? According to the table, in how many of those is today’s AI strong? 3) What do the three “weak” kinds in the table have in common? Live demo: [QR 1.1]

#### Technical depth

There is no agreed single definition of intelligence; working definitions cluster around “goal-directed adaptation, abstraction, learning and problem-solving capacity.” The AI field uses a pragmatic one: systems that perform tasks requiring human intelligence.

Gardner’s Theory of Multiple Intelligences (Frames of Mind, 1983) splits intelligence into relatively independent domains. The original 1983 list had seven: linguistic, logical-mathematical, spatial, musical, bodily-kinesthetic, interpersonal and intrapersonal. Gardner added the naturalistic domain later; the eight-item list used here is not identical to the original 1983 list. The theory is contested in psychometrics, but it usefully shows that intelligence is multi-dimensional: today’s AI is wildly uneven across these dimensions.

Each card is one of the eight domains in Gardner’s theory: AI is strong in language and logic, weak in the bodily and social/intrapersonal domains. The three levels in the figure are illustrative labels, not measured performance; the result changes with the task and the system.

If intelligence comes in pieces, can at least one of those pieces be written down as a step-by-step recipe? A kitchen is a good place to find out.

### 1.3 Is thinking computation?

Step into the kitchen for a moment. You hold a cake recipe: crack the eggs, whisk, add the flour, into the oven. Someone following that recipe to the letter will produce a cake without “understanding” baking at all. The idea beneath all of AI is the same: maybe “thinking,” too, is applying small, mechanical steps in order.

If so, a machine can do those steps too. Today’s digital computers use two things for it:

• A simple alphabet the machine can use (usually binary: 0 and 1)

• A clear list of steps (the recipe itself: an algorithm)

See how binary works for yourself below.

> **Margin note.** The word “algorithm” comes from the name of the 9th-century Persian mathematician al-Khwarizmi. Binary itself was formalized by Leibniz in 1703.

**Figure 1.2 · Crack the binary code**
![Figure 1.2](../../figures/out/en/figure-1-2-binary.svg)

*Setup.* The figure shows eight boxes in a row. Above each box is its place value; from left to right, 128, 64, 32, 16, 8, 4, 2 and 1. A lit box means 1, a dark box means 0. The top row shows the opening state, 01001001. The number underneath is the sum of the place values of the lit boxes. Under it, three worked rows show 5, 73 and 255 written the same way.

*Step by step.* First, the place-value chart:

| Box | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Place value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Start | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |

1. Decode the opening number. The lit boxes are 2, 5 and 8; their values are 64, 8 and 1. Add them: 64 + 8 + 1 = 73. So 01001001 = 73.
2. Now go the other way and write the number 5 into the boxes. Start from the left and ask each box: “Does your value fit into the number?” 128, 64, 32, 16 and 8 do not fit; they all stay dark. 4 fits: light it, and 1 is left. 2 does not fit. 1 fits: light it, and 0 is left. The result is 00000101.
3. Write 73 the same way. 128 does not fit. 64 fits, 9 left. 32 and 16 do not fit. 8 fits, 1 left. 4 and 2 do not fit. 1 fits, 0 left. The result is 01001001, the same pattern as the opening state.
4. Finally, 255: light every box. 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255, that is, 11111111. This is the largest number eight boxes can say. One more, 256, needs a ninth box.

Did you spot the rule? Going from left to right, “if it fits, light it and carry on with the remainder” is all it takes. Every number has one pattern and one only; two different patterns never give the same number. Eight boxes hold 256 different numbers, from 0 to 255; computer people call that a byte.

*What is happening?* Eight boxes, eight bulbs: off means 0, on means 1. But who handed out the values? Start from the right: the rightmost box holds the smallest value, 1. Moving left, each box carries double its right-hand neighbor: 1, 2, 4, 8, 16, 32, 64, and 128 on the far left. Why always double? Because each new box must be able to say one more than all the boxes to its right combined; otherwise some numbers could never be written. Now add up the values of the lit boxes: there is your number. A computer’s whole world is this game of on and off.

*Try it yourself.* 1) Write the number 10 with eight boxes. 2) Which number is the pattern 10110000? 3) If only the leftmost box is lit, what is the number? If you added a ninth box, what would the largest number be? Live demo: [QR 1.2]

#### Technical depth

This view is called computationalism: the mind is an information-processing system, and cognition is computation in the form of symbol manipulation. Its roots reach back to Hobbes (“reasoning is reckoning”); its modern form developed with Putnam and Fodor.

In practice, two building blocks are used. Binary representation: modern digital computers usually encode information in base-2 (bits); binary is not a precondition of computation, since decimal and analog machines compute too (ENIAC worked in decimal). Boolean algebra (Boole, 1854) and Shannon’s 1937 thesis showed that logic can be realized with electrical switches. Algorithm: a finite sequence of well-defined steps (the term comes from the 9th-century mathematician al-Khwarizmi). Together they make algorithms mechanically executable; whether all thinking can be reduced to computation is a separate question.

Binary 01001001 = the sum of its place values = 64 + 8 + 1 = 73. Each bit represents 128, 64, 32, ... from left to right. 8 bits (1 byte) encode any number from 0 to 255.

General rule: value = Σ bᵢ · 2ⁱ, with i = 0…7 counted from right to left; bᵢ is the 0 or 1 of that bit. n bits encode 2ⁿ distinct numbers; for 8 bits, 2⁸ = 256.

The alphabet and the recipe are ready. Someone still has to carry the recipe out, and the first candidates, back in the 1800s, were made of gears.

### 1.4 From Babbage to Turing

In the 1800s, Charles Babbage envisioned a programmable calculating machine. He drew it as a giant of gears and levers: the Analytical Engine. Money and years ran out; he died without ever seeing it built. But his friend Ada Lovelace wrote the first “recipe” for that imaginary machine. So she counts as history’s first programmer.

About a century later, Alan Turing carried the dream a step further. Picture a single little box that reads a tape, writes on it and slides left or right. Given the right rules and enough tape, it can perform any calculation that can be written as an algorithm. It is called a Turing machine. Follow a small one that only adds 1 to a number as it “thinks,” frame by frame, in Figure 1.3.

> **Margin note.** In 1948 Turing designed a chess algorithm called “Turochamp.” No machine of the era could run it, so Turing worked out the moves by hand on paper.

**Figure 1.3 · A working Turing machine (+1)**
![Figure 1.3](../../figures/out/en/figure-1-3-turing.svg)

*Setup.* The figure shows a tape of six cells; the arrow (▲) moving above it is the machine’s head. The tape reads 000101, which is 5 in binary. The machine has three states: “move right,” “add” (add 1 with carry) and “done.” The nine frames of the film strip show every step taken while 1 is added to 5.

*Step by step.* Read the frames in order; each frame gives the tape, the head position and the state. The cells are numbered 0 to 5 from left to right.

0. Start. The head is on the leftmost cell (0), the state is “move right.” The tape reads 0 0 0 1 0 1, that is, 5.
1. The head slides one cell to the right, to cell 1. The tape does not change. The head (▲) steps right to find the number’s rightmost digit. As in adding by hand, the work starts from the far right.
2. The head is on cell 2. It is still only reading, not writing.
3. The head is on cell 3; there is a 1 here, but in this state the machine ignores it and moves on.
4. The head is on cell 4.
5. The head is on the last cell (5). The tape still reads 0 0 0 1 0 1.
6. No cell is left on the right. The machine changes state: “add” (add 1 with carry). The head stays put, the tape stays the same.
7. The head sees a 1 on the last cell. It turns the 1 into 0 and carries one to the left; the head moves to cell 4. The tape reads 0 0 0 1 0 0, for a moment 4. The head now works backward, adding 1 leftward: every 1 it sees becomes 0 with a carry, and at the first 0 it writes 1 and stops. The same “carry the one” rule you learned in school.
8. The head sees a 0 on cell 4. It writes a 1 there and stops; the state is “done.” The tape reads 0 0 0 1 1 0, that is, 6. Done. With only a handful of simple rules like “read, write, move left/right,” the machine added 1 to a binary number. That is all this machine can do; another calculation needs another rule table. Computing, for a Turing machine, means nothing more than this.

Eight moves in all: five steps to the right, one state change, one clear, one write. Five plus one made six; the tape says it as 000110.

*What is happening?* The machine walks the tape like an ant: first it heads right to find the end of the number, then turns back and adds 1. The way it carries the digit is no different from how you carry in addition on paper. This machine only adds 1; other rules give other calculations. Any calculation that can be written as a recipe comes down, in the end, to moves this small.

*Try it yourself.* 1) Start the tape at 001111 (15) and draw the frames yourself on paper. How many 1s get cleared, in how many moves does the machine finish, and which number is left on the tape? 2) Start the tape at 010110 (22). When the head reaches the end and turns back, what is the first digit it sees? In how many moves does it finish? 3) What would happen with a tape of 111111 (63)? The machine sees a 1 even on the leftmost cell; it cannot move left, so it stops. Live demo: [QR 1.3]

#### Technical depth

Babbage’s Analytical Engine (1837) was a general-purpose design with a “mill” (processing unit) and a “store” (memory), programmable via punched cards. Ada Lovelace’s 1843 notes contain the algorithm for computing Bernoulli numbers, generally regarded as the first computer program.

Alan Turing’s 1936 paper “On Computable Numbers” introduced the abstract Turing machine and the universal Turing machine; this is the formal basis of computability. Given enough time and tape, a universal Turing machine can run programs for any algorithmically computable task; the same paper shows that uncomputable problems exist as well. The simulation in Figure 1.3 is not universal but a particular machine: it adds 1 to a binary number, doing arithmetic with only read/write and state transitions.

The machine slides right to the end of the tape, then turns left and adds 1 to the binary number (carry logic): the 1s it sees become 0, and the first 0 becomes 1.

The transition table of the machine in Figure 1.3, taken from the source code:

| State | Read | Write | Move | New state |
|---|---|---|---|---|
| move right | 0 or 1 | same | right | move right; at the end of the tape, “add 1” |
| add 1 | 1 | 0 | left | add 1; at the start of the tape, “done” |
| add 1 | 0 | 1 | stay | done |

Three rows, a six-cell tape and a single head: enough to add 1 to any number from 0 to 62. For 63 the tape overflows and 0 remains.

Turing’s machine was a thought on paper. Pouring it into real tubes and wires is another story.

### 1.5 ENIAC and the birth of the modern computer

In 1945 a giant machine came to life: ENIAC; it was unveiled to the public in 1946. It weighed tons, ran on tens of thousands of tubes, and was one of the first general-purpose electronic digital computers. It had a grumpy streak: teaching it a new job meant days of unplugging and replugging cables by hand.

The fix was an elegant idea: keep the recipe next to the ingredients, in memory. Then, instead of rewiring the machine, you load new “instructions.” Nearly every computer today, including the phone in your pocket, runs on this arrangement. Follow the cycle in the figure below, then look at what its parts do.

> **Margin note.** Reprogramming ENIAC took days; the cables had to be reconnected by hand. Putting the program in memory changed all of that.

**Figure 1.4 · The Fetch – Execute – Write cycle**
![Figure 1.4](../../figures/out/en/figure-1-4-cycle.svg)

*Setup.* The figure shows three boxes, Memory, Processor and Input / Output, in three frames side by side: “1 · Fetch,” “2 · Execute,” “3 · Store / Write.” In each frame the part at work in that phase is dark. After the third frame the cycle starts over. The figure is an illustrative cycle; in a real processor an instruction is not split into three phases of equal length, and not every instruction reaches the outside world.

*Step by step.* The parts first, as the figure describes them:

| Phase | Active part | What it does |
|---|---|---|
| 1 · Fetch | Memory | Stores both the program (instructions) and the data together. The real revolution is here: instructions are kept just like data. |
| 2 · Execute | Processor | The ALU computes (adding, comparing); the control unit fetches instructions from memory in order and executes them. |
| 3 · Store / Write | Register or memory; Input / Output on an output instruction | Save the result: it is written to a register or to memory. Only on an output instruction does the result go to Input / Output, the link to the outside world: keyboard, screen, sensors. Data comes in here, results go out here. |

Now turn the cycle with a small program. Let memory hold two lines: the first line says “add 5 and 3,” the second says “write the result to the screen.” The numbers 5 and 3 sit in memory too.

1. Fetch. The control unit reaches into memory and takes the instruction on the first line: “add 5 and 3.” The instruction came from memory the same way 5 and 3 did; it is data, not a cable.
2. Execute. The ALU does the addition: 5 + 3 = 8. For now the result stays inside the processor.
3. Write. The 8 is put back into memory; in this round the Input / Output part has nothing to do, and nothing appears on the screen.
4. Fetch. The cycle has come back to the start; the control unit takes the second line: “write the result to the screen.”
5. Execute. The processor reads the 8 from memory and prepares it for output.
6. Write. An 8 appears on the screen. The two-line program is finished; if there is a next instruction, the cycle goes on.

Two rounds, six phases. On ENIAC, changing the first line meant days of pulling cables. Here the only thing to do is write a different instruction into the first line of memory, say “multiply 5 by 3.” The cycle stays the same; only the instruction it picks up changes. A stored program means no more than that: you change one line in memory, not the wiring.

*What is happening?* A computer performs a three-step dance nonstop: grab the next instruction from memory (fetch), do what it says (execute), save the result to a register or to memory, or display it if the instruction is an output (write). This is the loop beating at the heart of your phone and your computer alike.

*Try it yourself.* 1) You typed 7 × 6 into the calculator on your phone. Describe the three phases in your own words; which part is at work in each one? 2) Add a third line to the program above: “multiply the result by 2.” How many more phases are needed, and which number is written to memory? 3) Picture a processor that runs 3 billion cycles per second. Each cycle has three phases. How many phases in one second? Live demo: [QR 1.4]

#### Technical depth

ENIAC (Mauchly & Eckert) was one of the first general-purpose electronic digital computers; it became operational in 1945 and was publicly unveiled in 1946. It used ~17,500 vacuum tubes and was programmed by rewiring plugboards (its first programmers were six women mathematicians). Internally it worked in decimal, not binary.

John von Neumann’s 1945 EDVAC report popularized the stored-program principle: program and data live in the same memory. The architecture consists of a processor (ALU + control unit), memory and input/output, talking over a bus. The processor runs a continual “fetch–decode–execute” cycle. The “von Neumann bottleneck” is this design’s well-known limit.

In the “fetch” phase, the control unit reads the next instruction from memory and decodes it; the program sits in memory just like data (the stored-program principle). In “execute” the processor does the work; in “write” the result is saved to a register or to memory. Sending it to the screen is a separate input/output instruction; not every instruction uses an input or output device.

The three frames of Figure 1.4 are an illustrative simplification of the fetch–decode–execute cycle: decoding is folded into “Fetch,” and saving the result is shown as a separate frame at the end of execution.

The machine can now run any recipe. So what does “artificial intelligence” mean today, and how much intelligence is in it?

### 1.6 Narrow AI or General AI?

The all-understanding AI of the movies doesn’t exist yet. Today’s AI systems count as “narrow”: masters of the jobs they were trained for, and quickly out of their depth the further they stray from them. A chess engine can beat you, yet you can’t ask it for a soup recipe.

The hypothetical system with broad, transferable abilities that can learn across every domain like a human is called “artificial general intelligence” (AGI); nobody has built one yet. Doing many tasks does not by itself make a system general; consciousness is a separate question altogether. Sort the examples below: Which exists today, and which is still science fiction?

> **Margin note.** A system with broad abilities that transfer across domains (general) and a system truly “understanding / being conscious” (strong) are different questions. Keeping them apart is key to the modern AI debate.

**Figure 1.5 · Real today, or science fiction?**
![Figure 1.5](../../figures/out/en/figure-1-5-classify.svg)

*Setup.* The figure shows three columns: “In use today,” “Hypothetical” and “Consciousness question.” Five cards sit in the middle, and the boxes next to them are empty; you fill them in with a pencil. The third column is for a separate question: consciousness is not the same thing as general ability (AGI).

*Self-test.* Put each card in a column. The first two columns have one test: is the system in use today, or is it a hypothesis nobody has built yet? Judge each card by whether it exists, not by how impressive it sounds. A card that asks about consciousness rather than ability goes in the third column. The fourth card is about general ability (AGI). The fifth is about consciousness, a separate question that is not part of the definition of AGI. Answers and reasons are at the back of the book.

| # | Example | In use today | Hypothetical | Consciousness question |
|---|---|---|---|---|
| 1 | Chess engine | ☐ | ☐ | ☐ |
| 2 | Face recognition system | ☐ | ☐ | ☐ |
| 3 | Chatbot (language model) | ☐ | ☐ | ☐ |
| 4 | A machine that learns any profession like a human and has its own goals | ☐ | ☐ | ☐ |
| 5 | A self-aware, conscious AI | ☐ | ☐ | ☐ |

After you have marked all five, count: how many cards are in each column? The fourth and fifth cards both describe something that does not exist today, but they do not ask the same question. Name the difference in one sentence and you have the main idea of the chapter.

*What is happening?* The rule is simple: any system that is good at particular tasks or a limited set of them, without human-level general learning and transfer across domains, is “narrow,” chatbots that write poems and code and adapt somewhat to a new task from examples in the prompt included. “General” means a machine with transferable abilities that can learn across every domain like a human, and no such machine exists yet. A conscious machine is a separate question; being general does not require consciousness.

*Try it yourself.* 1) Write down three AI examples from your own daily life: navigation, translation, movie recommendations. Give each one a column. 2) Neither the fourth nor the fifth card exists today; are they the same thing? Apply the two questions in the margin note (“general” and “strong”) to each of them separately. Could a machine be general and yet not conscious? 3) What happens if you ask a chess engine for a soup recipe? Answer with a definition of narrow AI. Live demo: [QR 1.5]

#### Technical depth

Two separate distinctions are in play here. Narrow versus general AI is a distinction of capability: narrow AI works on specific tasks, general AI means broad, transferable capabilities across domains; today’s systems, multi-task ones included, are narrow. Weak versus strong AI is a philosophical distinction; the terms were coined by philosopher John Searle (1980, the Chinese Room argument). For Searle, weak AI is a program that models the mind without genuine understanding or consciousness; that is not the same thing as the narrow capability class.

An important distinction: Searle’s “strong AI” is about whether the machine truly understands (has a mind); in everyday usage it is often conflated with “artificial general intelligence” (AGI). AGI is a hypothetical capability level that generalizes across domains; “strong AI” is a philosophical claim. They are not the same thing.

Careful: “general” (AGI, cross-domain generalization) and “strong AI” (Searle: does the machine truly understand / is it conscious?) are different questions. Even AGI carries no consciousness requirement: being general does not mean being conscious.

The ideas had been on the table for a hundred years. So why did even narrow AI arrive only in the last few years?

### 1.7 Why now? Moore’s law

The ideas were ready by the mid-1900s; the machines were feeble. Do you know the old rice fable? One grain on the first square of a chessboard, double on every square after... Halfway across the board, the 32 squares hold 2³² − 1 grains; at 25 milligrams a grain, about 107 tons. Toward the end of the board the amount becomes enormous. In 1965 Gordon Moore noticed the transistor count on chips doubling at a steady beat, just like that, about every year at the time; in 1975 he revised the pace for the years ahead to roughly every two years.

Doubling looks innocent, but repeated it explodes. Do it yourself in the table of Figure 1.6: double the number every two years and see how it rockets. This compounding computation is what carries modern AI.

> **Margin note.** If a sheet of paper 0.1 mm thick could be folded 42 times, it would be about 440,000 km thick, more than the distance to the Moon. That is exponential growth; chips grew at that pace for decades.

**Figure 1.6 · Feel exponential growth**
![Figure 1.6](../../figures/out/en/figure-1-6-exp.svg)

*Setup.* The figure starts in 1971. That year the first microprocessor, the Intel 4004, went on sale with 2,300 transistors. Each step in the figure means “two years passed, the count doubled.” The table stops after 13 doublings, in 1997; the two small charts on the right carry the numbers on to 2023. On the linear scale the curve hugs the floor and then shoots up; on the log scale it is a straight line.

*Step by step.* Follow the table row by row. The third column is 2ⁿ, the fourth is 2,300 × 2ⁿ. Each row is twice the one before; there is no other rule. This is not the historical Moore curve itself but an illustrative table built to make exponential growth felt.

| Doubling (n) | Year | 2ⁿ | Transistors |
|---|---|---|---|
| 0 | 1971 | 1 | 2,300 |
| 1 | 1973 | 2 | 4,600 |
| 2 | 1975 | 4 | 9,200 |
| 3 | 1977 | 8 | 18,400 |
| 4 | 1979 | 16 | 36,800 |
| 5 | 1981 | 32 | 73,600 |
| 6 | 1983 | 64 | 147,200 |
| 7 | 1985 | 128 | 294,400 |
| 8 | 1987 | 256 | 588,800 |
| 9 | 1989 | 512 | 1,177,600 |
| 10 | 1991 | 1,024 | 2,355,200 |
| 11 | 1993 | 2,048 | 4,710,400 |
| 12 | 1995 | 4,096 | 9,420,800 |
| 13 | 1997 | 8,192 | 18,841,600 |

The first rows look tame: 2,300, 4,600, 9,200. In ten years the count grows 32-fold but is still in the tens of thousands. In 1989 it crosses the one-million line: 1,177,600, shown as “1.2 million” in the live demo. In 1997 it is 18.8 million. The table stops after 13 doublings, 26 years; the charts go on to 26 doublings.

What if you keep going? After 20 doublings, in 2011, 2ⁿ = 1,048,576 and the count is 2,411,724,800, or 2.4 billion. After 26 doublings, in 2023, 2ⁿ = 67,108,864 and the count is 154,350,387,200: 154.4 billion. Between the first row and the last there is a factor of 67 million. In the rice fable, 107 tons had piled up by the 32nd square; chips reached the 26th square in 2023. A bigger count is not the same as more speed: more transistors do not bring a proportional speedup for every workload.

*What is happening?* Every row means “two years passed, the transistor count doubled.” Within a few rows the number takes off; that is what exponential growth is like. Transistor counts grew at this pace for decades; speed did not grow at the same rate for every workload, but that accumulation is what made today’s AI possible.

*Try it yourself.* 1) Extend the table by two rows: 2ⁿ and the transistor count for 1999 and 2001. 2) Starting from 2,300, which row is the first to pass one million; how many years did it take? 3) If the doubling time were 3 years instead of 2, how many transistors would there be in 1995? Compare with the 1995 value in the table. Live demo: [QR 1.6]

#### Technical depth

Moore’s law is not a law of nature but an empirical observation and economic trend. Moore’s 1965 prediction was that the number of components on an integrated circuit would double about every year; in 1975 he revised it, for the years ahead, to a doubling about every two years. It is not a law of physics that says computing power must grow at the same rate; more transistors do not imply a proportional speedup for every workload. Even so, this exponential growth made the heavy matrix computation deep learning needs economical.

The exponential trend held for ~50 years (1971 Intel 4004: ~2,300 transistors → 2020s: tens of billions). As some transistor structures approach atomic scales, manufacturing and physical limits (heat among them) become important, and the trend has been slowing in recent years; the industry now leans on parallelism and specialized AI hardware such as GPUs/TPUs.

Exponential growth: ×2 roughly every 2 years; n doublings give a 2^n-fold increase.

The formula behind Figure 1.6: N(t) = N₀ · 2^(t/2), where t is the number of years since 1971 and N₀ = 2,300. For t = 52, N = 2,300 · 2²⁶ ≈ 1.5 × 10¹¹. Real chips sit a little below this curve; the doubling time has stretched since the 2000s.

The building blocks of the chapter are in place: intelligence, binary code, algorithm, Turing machine, stored program, the narrow-versus-general distinction, exponential growth. Six questions follow.

### 1.8 Test yourself

*Answers are at the back of the book.*
1. What did Howard Gardner propose?
   a) That the brain is a computer
   b) That intelligence has many kinds, not one
   c) That IQ fully measures intelligence
   d) That machines can never think

2. Binary code is made of which symbols?
   a) A to Z
   b) Dots and dashes
   c) 0–9
   d) 0 and 1

3. What can a universal Turing machine fundamentally do?
   a) Only play chess
   b) Any computable task, via simple rules, given enough time and tape
   c) Only addition
   d) Only store text

4. The core idea of the von Neumann architecture?
   a) Inventing the internet
   b) Keeping program and data in the same memory
   c) Rewiring for each new task
   d) Using binary instead of decimal

5. What kind are today’s AI systems?
   a) Strong AI
   b) Narrow AI
   c) General AI (AGI)
   d) Conscious AI

6. What does Moore’s law say?
   a) Internet speed is constant
   b) AI will surpass humans
   c) Transistor count ~doubles every 2 years
   d) Computers get cheaper yearly

### What to keep from this chapter

- Intelligence is not one number; across Gardner’s eight kinds, today’s AI is strong in language and logic, weak in body and emotion.
- Today’s computers run on two building blocks: binary code (0 and 1) and an algorithm (a clear list of steps). Binary is a common choice, not a condition of computation; whether all thinking is computation is a separate question.
- Eight boxes hold every number from 0 to 255; adding up the place values of the lit boxes is all it takes.
- A Turing machine works with nothing but read, write and move one cell; a universal one, given enough tape and the right program, performs any computable task. The particular machine in the figure only adds 1; adding 1 to 5 took eight moves.
- Stored program: an instruction sits in memory just like data; the processor fetches, decodes and executes each instruction and saves the result to a register or to memory. Sending it to the screen is a separate input/output instruction.
- Today’s AI systems are narrow, even the ones that do many tasks; general AI (AGI) does not exist yet; consciousness is a question separate from generality.
- Moore’s law: the transistor count doubles every year in the 1965 prediction and roughly every two years in the 1975 revision; a bigger count is not the same as more speed. The table’s 2,300 of 1971 reach 154 billion after 26 doublings.

<!-- SOURCE-CHANGES
This first chapter goes back to the very start of the road. What is intelligence? Can “thinking” really be written down as a step-by-step recipe? We’ll walk from Babbage’s gears to the birth of the modern computer. And at the end of the road, it will become clear why artificial intelligence (AI for short) is possible at all. ||| This first chapter goes back to the very beginning. What is intelligence? Can “thinking” be written down as a step-by-step recipe? The path runs from Babbage’s gears to the birth of the modern computer, and by the end it will be clear why artificial intelligence (AI for short) is possible at all.
AI isn’t really new: “can machines think?” has occupied philosophers since the 1600s. What’s new is the hardware that can test it. ||| AI isn’t new: “can machines think?” has occupied philosophers since the 1600s. What’s new is the hardware that can test it.
Psychologist Howard Gardner said exactly this: Intelligence doesn’t fit in one number (IQ); it comes in several kinds. Explore them below, and notice the interesting part: today’s AI is a master of some and still a toddler at others. ||| The psychologist Howard Gardner made the same point: intelligence doesn’t fit in one number (IQ); it comes in several kinds. Explore them below. The interesting part is that today’s AI is a master of some and still a toddler at others.
For Gardner, intelligence isn’t one number but eight distinct families of ability; each card in the figure is one of them. Notice something too: today’s AI is great with language and logic, yet far behind a small child at anything involving the body or emotions. ||| For Gardner, intelligence isn’t one number but eight distinct families of ability; each card in the figure is one of them. And today’s AI is great with language and logic, yet far behind a small child at anything involving the body or emotions.
Each card is one of the eight domains in Gardner’s theory of multiple intelligences (contested in psychometrics). The real lesson: intelligence is not one-dimensional, and AI is wildly uneven across these dimensions; strong in language and logic, weak in bodily and social/intrapersonal domains. ||| Each card is one of the eight domains in Gardner’s theory: AI is strong in language and logic, weak in the bodily and social/intrapersonal domains.
Step into the kitchen for a moment. You hold a cake recipe: crack the eggs, whisk, add the flour, into the oven. Someone following that recipe to the letter will produce a cake without “understanding” baking at all. The idea beneath all of AI is exactly that: Maybe “thinking,” too, is applying small, mechanical steps in order. ||| Step into the kitchen for a moment. You hold a cake recipe: crack the eggs, whisk, add the flour, into the oven. Someone following that recipe to the letter will produce a cake without “understanding” baking at all. The idea beneath all of AI is the same: maybe “thinking,” too, is applying small, mechanical steps in order.
If so, we can get a machine to do those steps too. That takes two things: ||| If so, a machine can do those steps too. That takes two things:
Eight boxes, eight bulbs: off means 0, on means 1. But who handed out the values? Think of it this way: The rightmost box holds the smallest, a 1. Moving left, each box carries double its right-hand neighbor: 1, 2, 4, 8, 16, 32, 64, and 128 on the far left. Why always double? Because each new box must be able to say one more than all the boxes to its right combined; otherwise some numbers could never be written. Now add up the values of the lit boxes: there is your number. A computer’s whole world is this game of on and off. ||| Eight boxes, eight bulbs: off means 0, on means 1. But who handed out the values? Start from the right: the rightmost box holds the smallest value, 1. Moving left, each box carries double its right-hand neighbor: 1, 2, 4, 8, 16, 32, 64, and 128 on the far left. Why always double? Because each new box must be able to say one more than all the boxes to its right combined; otherwise some numbers could never be written. Now add up the values of the lit boxes: there is your number. A computer’s whole world is this game of on and off.
The dream of a “computer” was first dreamed in the 1800s. Charles Babbage drew a giant calculating machine of gears and levers: the Analytical Engine. Money and years ran out; he died without ever seeing it built. But his friend Ada Lovelace wrote the first “recipe” for that imaginary machine. That is why she counts as history’s first programmer. ||| The dream of a “computer” was first dreamed in the 1800s. Charles Babbage drew a giant calculating machine of gears and levers: the Analytical Engine. Money and years ran out; he died without ever seeing it built. But his friend Ada Lovelace wrote the first “recipe” for that imaginary machine. So she counts as history’s first programmer.
The machine walks the tape like an ant: first it heads right to find the end of the number, then turns back and adds 1. The way it carries the digit is no different from how you carry in addition on paper. Such tiny moves can carry out any calculation; that is the whole magic. ||| The machine walks the tape like an ant: first it heads right to find the end of the number, then turns back and adds 1. The way it carries the digit is no different from how you carry in addition on paper. Moves this small can carry out any calculation at all.
The machine slides right to the end of the tape, then turns left and adds 1 to the binary number (carry logic): the 1s it sees become 0, and the first 0 becomes 1. It performs addition using only read/write and state transitions. ||| The machine slides right to the end of the tape, then turns left and adds 1 to the binary number (carry logic): the 1s it sees become 0, and the first 0 becomes 1.
The fix was an elegant idea: Keep the recipe next to the ingredients, in memory. Then, instead of rewiring the machine, you simply load new “instructions.” Nearly every computer today, including the phone in your pocket, runs on this arrangement. Follow the cycle in the figure below, then look at what its parts do. ||| The fix was an elegant idea: keep the recipe next to the ingredients, in memory. Then, instead of rewiring the machine, you load new “instructions.” Nearly every computer today, including the phone in your pocket, runs on this arrangement. Follow the cycle in the figure below, then look at what its parts do.
Reprogramming ENIAC took days; the cables had to be reconnected by hand. That is why “putting the program in memory” was a revolution. ||| Reprogramming ENIAC took days; the cables had to be reconnected by hand. Putting the program in memory changed all of that.
Here is the trick: any system that masters just one job is “narrow,” even chatbots. “General” means a machine that can learn across every domain like a human, and no such machine exists yet. A conscious machine is a different story altogether. ||| The rule is simple: any system that masters only one job is “narrow,” chatbots included. “General” means a machine that can learn across every domain like a human, and no such machine exists yet. A conscious machine is a different story altogether.
An important distinction: Searle’s “strong AI” is really about whether the machine truly understands (has a mind); in everyday usage it is often conflated with “artificial general intelligence” (AGI). AGI is a hypothetical capability level that generalizes across domains; “strong AI” is a philosophical claim. They are not the same thing. ||| An important distinction: Searle’s “strong AI” is about whether the machine truly understands (has a mind); in everyday usage it is often conflated with “artificial general intelligence” (AGI). AGI is a hypothetical capability level that generalizes across domains; “strong AI” is a philosophical claim. They are not the same thing.
Doubling looks innocent, but repeated it explodes. Do it yourself in the table of Figure 1.6: double the number every two years and see how it rockets. The power carrying modern AI is exactly this compounding computation. ||| Doubling looks innocent, but repeated it explodes. Do it yourself in the table of Figure 1.6: double the number every two years and see how it rockets. This compounding computation is what carries modern AI.
If you could fold a sheet of paper 42 times, it would reach the Moon. That is the power of exponential growth; chips grew at that pace for decades. ||| If you could fold a sheet of paper 42 times, it would reach the Moon. That is exponential growth; chips grew at that pace for decades.
Exponential growth: ×2 roughly every 2 years; n doublings give a 2^n-fold increase. It is not a law of nature but an empirical trend, and it has been slowing in recent years due to physical limits. ||| Exponential growth: ×2 roughly every 2 years; n doublings give a 2^n-fold increase.
The psychologist Howard Gardner made the same point: intelligence doesn’t fit in one number (IQ); it comes in several kinds. Explore them below. The interesting part is that today’s AI is a master of some and still a toddler at others. ||| The psychologist Howard Gardner made the same point: intelligence doesn’t fit in one number (IQ); it comes in several kinds. He proposed seven in 1983 and later added naturalistic intelligence. The theory is debated, but it is a useful way to see that intelligence is not one thing. Explore the kinds below. The interesting part is that today’s AI is a master of some and still a toddler at others.
Gardner’s Theory of Multiple Intelligences (1983) splits intelligence into relatively independent domains: linguistic, logical-mathematical, spatial, musical, bodily-kinesthetic, interpersonal, intrapersonal and naturalistic. The theory is contested in psychometrics, but it usefully shows that intelligence is multi-dimensional: today’s AI is wildly uneven across these dimensions. ||| Gardner’s Theory of Multiple Intelligences (Frames of Mind, 1983) splits intelligence into relatively independent domains. The original 1983 list had seven: linguistic, logical-mathematical, spatial, musical, bodily-kinesthetic, interpersonal and intrapersonal. Gardner added the naturalistic domain later; the eight-item list used here is not identical to the original 1983 list. The theory is contested in psychometrics, but it usefully shows that intelligence is multi-dimensional: today’s AI is wildly uneven across these dimensions.
A calculator is a million times faster than you at arithmetic but can’t laugh at a joke. Being “smart” isn’t a single axis. ||| A calculator is far faster than you at particular calculations but can’t laugh at a joke. Being “smart” isn’t a single axis.
For Gardner, intelligence isn’t one number but eight distinct families of ability; the card you tapped is one of them. And today’s AI is great with language and logic, yet far behind a small child at anything involving the body or emotions. ||| For Gardner, intelligence isn’t one number but eight distinct families of ability; the card you tapped is one of them. And today’s AI is great with language and logic; at anything involving the body or emotions the result depends on the task and the system, and in most of them it is still far behind. The bars are illustrative levels, not measured scores.
This is one of the eight domains in Gardner’s theory: AI is strong in language and logic, weak in the bodily and social/intrapersonal domains. ||| This is one of the eight domains in Gardner’s theory: AI is strong in language and logic, weak in the bodily and social/intrapersonal domains. The bars are illustrative levels chosen for the explanation, not measured performance; the result changes with the task and the system.
Is thinking = computing? ||| Is thinking computation?
If so, a machine can do those steps too. That takes two things: ||| If so, a machine can do those steps too. Today’s digital computers use two things for it:
• A simple alphabet the machine can use (binary: 0 and 1) ||| • A simple alphabet the machine can use (usually binary: 0 and 1)
In practice, two building blocks are needed. Binary representation: all information is encoded in base-2 (bits); Boolean algebra (Boole, 1854) and Shannon’s 1937 thesis showed that logic can be realized with electrical switches. Algorithm: a finite sequence of well-defined steps (the term comes from the 9th-century mathematician al-Khwarizmi). Together they make “thinking” mechanically executable. ||| In practice, two building blocks are used. Binary representation: modern digital computers usually encode information in base-2 (bits); binary is not a precondition of computation, since decimal and analog machines compute too (ENIAC worked in decimal). Boolean algebra (Boole, 1854) and Shannon’s 1937 thesis showed that logic can be realized with electrical switches. Algorithm: a finite sequence of well-defined steps (the term comes from the 9th-century mathematician al-Khwarizmi). Together they make algorithms mechanically executable; whether all thinking can be reduced to computation is a separate question.
The dream of a “computer” was first dreamed in the 1800s. Charles Babbage drew a giant calculating machine of gears and levers: the Analytical Engine. Money and years ran out; he died without ever seeing it built. But his friend Ada Lovelace wrote the first “recipe” for that imaginary machine. So she counts as history’s first programmer. ||| In the 1800s, Charles Babbage envisioned a programmable calculating machine. He drew it as a giant of gears and levers: the Analytical Engine. Money and years ran out; he died without ever seeing it built. But his friend Ada Lovelace wrote the first “recipe” for that imaginary machine. So she counts as history’s first programmer.
About a century later, Alan Turing carried the dream a step further. Picture a single little box that reads a tape, writes on it and slides left or right. In principle, it can perform any calculation. It is called a Turing machine. Watch a real one “think” below. ||| About a century later, Alan Turing carried the dream a step further. Picture a single little box that reads a tape, writes on it and slides left or right. Given the right rules and enough tape, it can perform any calculation that can be written as an algorithm. It is called a Turing machine. Watch a small one that only adds 1 to a number “think” below.
The machine walks the tape like an ant: first it heads right to find the end of the number, then turns back and adds 1. The way it carries the digit is no different from how you carry in addition on paper. Moves this small can carry out any calculation at all. ||| The machine walks the tape like an ant: first it heads right to find the end of the number, then turns back and adds 1. The way it carries the digit is no different from how you carry in addition on paper. This machine only adds 1; other rules give other calculations. Any calculation that can be written as a recipe comes down, in the end, to moves this small.
Alan Turing’s 1936 paper “On Computable Numbers” introduced the abstract Turing machine and the universal Turing machine; this is the formal basis of computability. The simulation below is a small Turing machine that adds 1 to a binary number, doing arithmetic with only read/write and state transitions. ||| Alan Turing’s 1936 paper “On Computable Numbers” introduced the abstract Turing machine and the universal Turing machine; this is the formal basis of computability. Given enough time and tape, a universal Turing machine can run programs for any algorithmically computable task; the same paper shows that uncomputable problems exist as well. The simulation below is not universal but a particular machine: it adds 1 to a binary number, doing arithmetic with only read/write and state transitions.
What can a Turing machine fundamentally do? ||| What can a universal Turing machine fundamentally do?
In principle any computation, via simple rules ||| Any computable task, via simple rules, given enough time and tape
In 1945 a giant machine roared to life: ENIAC. It weighed tons and ran on tens of thousands of tubes. And this first electronic computer had a grumpy streak: teaching it a new job meant days of unplugging and replugging cables by hand. ||| In 1945 a giant machine came to life: ENIAC; it was unveiled to the public in 1946. It weighed tons, ran on tens of thousands of tubes, and was one of the first general-purpose electronic digital computers. It had a grumpy streak: teaching it a new job meant days of unplugging and replugging cables by hand.
ENIAC (1945; Mauchly & Eckert) was a general-purpose electronic digital computer; it used ~17,500 vacuum tubes and was programmed by rewiring plugboards (its first programmers were six women mathematicians). Internally it worked in decimal, not binary. ||| ENIAC (Mauchly & Eckert) was one of the first general-purpose electronic digital computers; it became operational in 1945 and was publicly unveiled in 1946. It used ~17,500 vacuum tubes and was programmed by rewiring plugboards (its first programmers were six women mathematicians). Internally it worked in decimal, not binary.
A computer performs a three-step dance nonstop: grab the next instruction from memory (fetch), do what it says (execute), save or display the result (write). This is the loop beating at the heart of your phone and your computer alike. ||| A computer performs a three-step dance nonstop: grab the next instruction from memory (fetch), do what it says (execute), save the result to a register or to memory, or display it if the instruction is an output (write). This is the loop beating at the heart of your phone and your computer alike.
In the “fetch” phase, the control unit reads the next instruction from memory; the program sits in memory just like data (the stored-program principle). In “execute” the processor does the work; in “write” the result goes out. ||| In the “fetch” phase, the control unit reads the next instruction from memory and decodes it; the program sits in memory just like data (the stored-program principle). In “execute” the processor does the work; in “write” the result is saved to a register or to memory. Sending it to the screen is a separate input/output instruction; not every instruction uses an input or output device.
The all-understanding AI of the movies doesn’t exist yet. Every AI today is “narrow”: a champion at its own job, a beginner one step outside it. A chess engine can beat you, yet you can’t ask it for a soup recipe. ||| The all-understanding AI of the movies doesn’t exist yet. Today’s AI systems count as “narrow”: masters of the jobs they were trained for, and quickly out of their depth the further they stray from them. A chess engine can beat you, yet you can’t ask it for a soup recipe.
The hypothetical system that can learn across every domain like a human is called “artificial general intelligence” (AGI); nobody has built one yet. Sort the examples below: Which exists today, and which is still science fiction? ||| The hypothetical system with broad, transferable abilities that can learn across every domain like a human is called “artificial general intelligence” (AGI); nobody has built one yet. Doing many tasks does not by itself make a system general; consciousness is a separate question altogether. Sort the examples below: Which exists today, and which is still science fiction?
A system doing many tasks well (general) and a system truly “understanding / being conscious” (strong) are different questions. Keeping them apart is key to the modern AI debate. ||| A system with broad abilities that transfer across domains (general) and a system truly “understanding / being conscious” (strong) are different questions. Keeping them apart is key to the modern AI debate.
The rule is simple: any system that masters only one job is “narrow,” chatbots included. “General” means a machine that can learn across every domain like a human, and no such machine exists yet. A conscious machine is a different story altogether. ||| The rule is simple: any system that is good at particular tasks or a limited set of them, without human-level general learning and transfer across domains, is “narrow,” chatbots that write poems and code and adapt somewhat to a new task from examples in the prompt included. “General” means a machine with transferable abilities that can learn across every domain like a human, and no such machine exists yet. A conscious machine is a separate question; being general does not require consciousness.
Weak (narrow) AI refers to systems that perform specific tasks without genuine understanding or consciousness; all of today’s systems fall here. The terms were coined by philosopher John Searle (1980, the Chinese Room argument). ||| Two separate distinctions are in play here. Narrow versus general AI is a distinction of capability: narrow AI works on specific tasks, general AI means broad, transferable capabilities across domains; today’s systems, multi-task ones included, are narrow. Weak versus strong AI is a philosophical distinction; the terms were coined by philosopher John Searle (1980, the Chinese Room argument). For Searle, weak AI is a program that models the mind without genuine understanding or consciousness; that is not the same thing as the narrow capability class.
The ideas were ready by the mid-1900s; the machines were feeble. Do you know the old rice fable? One grain on the first square of a chessboard, double on every square after... halfway across the board, no granary on earth is enough. In 1965 Gordon Moore noticed the transistors on chips doubling at a steady beat, just like that; by 1975 he had pinned the pace at roughly every two years. ||| The ideas were ready by the mid-1900s; the machines were feeble. Do you know the old rice fable? One grain on the first square of a chessboard, double on every square after... Halfway across the board, the 32 squares hold 2³² − 1 grains; at 25 milligrams a grain, about 107 tons. Toward the end of the board the amount becomes enormous. In 1965 Gordon Moore noticed the transistor count on chips doubling at a steady beat, just like that, about every year at the time; in 1975 he revised the pace for the years ahead to roughly every two years.
If you could fold a sheet of paper 42 times, it would reach the Moon. That is exponential growth; chips grew at that pace for decades. ||| If a sheet of paper 0.1 mm thick could be folded 42 times, it would be about 440,000 km thick, more than the distance to the Moon. That is exponential growth; chips grew at that pace for decades.
Every press means “two years passed, the power doubled.” Within a few presses the number takes off; that is what exponential growth is like. Computers grew at this pace for decades, and that accumulation is what made today’s AI possible. ||| Every press means “two years passed, the transistor count doubled.” Within a few presses the number takes off; that is what exponential growth is like. Transistor counts grew at this pace for decades; speed did not grow at the same rate for every workload, but that accumulation is what made today’s AI possible.
Moore’s law is not a law of nature but an empirical observation and economic trend: the transistor count on an integrated circuit roughly doubles every two years (Moore’s 1965 observation, revised in 1975). This exponential growth made the heavy matrix computation deep learning needs economical. ||| Moore’s law is not a law of nature but an empirical observation and economic trend. Moore’s 1965 prediction was that the number of components on an integrated circuit would double about every year; in 1975 he revised it, for the years ahead, to a doubling about every two years. It is not a law of physics that says computing power must grow at the same rate; more transistors do not imply a proportional speedup for every workload. Even so, this exponential growth made the heavy matrix computation deep learning needs economical.
The exponential trend held for ~50 years (1971 Intel 4004: ~2,300 transistors → 2020s: tens of billions). It has been slowing recently due to physical limits (subatomic scale, heat); the industry now leans on parallelism and specialized AI hardware such as GPUs/TPUs. ||| The exponential trend held for ~50 years (1971 Intel 4004: ~2,300 transistors → 2020s: tens of billions). As some transistor structures approach atomic scales, manufacturing and physical limits (heat among them) become important, and the trend has been slowing in recent years; the industry now leans on parallelism and specialized AI hardware such as GPUs/TPUs.
-->

<!-- EDITORIAL NOTES
- 2026-10-02 second-verification re-audit (R007/R069 optional suggestion): narrow AI sentence now “…and quickly out of their depth the further they stray from them.” (was “beginners one step outside them”; the sharp-boundary impression is softened); print, SOURCE-CHANGES and digital match.
- 1.4 Simple: "Watch a real one 'think' below." → "Follow a real one as it 'thinks,' frame by frame, in Figure 1.3."
- 1.4 Technical: "The simulation below is" → "The simulation in Figure 1.3 is" (the figure now sits above the paragraph; same decision as the Turkish edition and chapters 2–7).
- Figure 1.3 states: the figure labels the middle state "add"; the text writes "add" (add 1 with carry) to match the label.
- 1.5 Simple: "Watch the cycle turn below, then tap its parts." → "Follow the cycle in the figure below, then look at what its parts do."
- 1.7 Simple: "Try it yourself below: press 'double' every 2 years and watch the number rocket." → "Do it yourself in the table of Figure 1.6: double the number every two years and see how it rockets."
- Left as is (they make sense on paper because the Figure follows at once): 1.2 Simple "Explore them below"; 1.3 Simple "See how binary works for yourself below"; 1.6 Simple "Sort the examples below".
- Adapted for paper (2026-09-30; screen verbs resolved in the source text too): Figure 1.1 What is happening "the card you tapped"; Figure 1.6 What is happening "Every press means…" and "Within a few presses"; 1.1 Technical (Figure 1.1 box) "This is one of the eight domains" ("This" referred to the tapped card); 1.7 Simple "every two years" (Moore's 1965 paper said every year; two years is the 1975 revision, as the Technical paragraph says).
- Setups: source hints stripped of screen verbs ("tap", "press", "⏸", "Auto" removed).
- Figure 1.5 (classify) is a self-test demo: a marking table replaces Step by step; reasons are in answers/M01.md.
- Number style: thousands separator comma in tables (2,300; 17,500) as in the source technical text; the demo's rounded prose figures with a decimal point ("1.2 million"). Ranges in quiz options keep the source en dash ("0–9") because the option text is verbatim.
- Quiz option order is the export's shuffled order, kept exactly; the answer key follows the same order.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in the Turkish edition.
- 2026-10-01 correction document: R001 (Gardner: seven in 1983, naturalist added later; Simple, Technical, Setup), R002 (“a million times” → “far faster at particular calculations”; bars illustrative, not measured; Setup, table header, both What-is-happening paragraphs), R003 (binary not a precondition of computation; Simple, Technical, takeaways), R004 (universal machine: computable tasks with enough time and tape; the figure's machine only adds 1; Simple, What is happening, Technical, quiz 3 question + option, takeaways), R005 (ENIAC one of the first general-purpose electronic digital computers; operational 1945, unveiled 1946), R006 (Figure 1.4 table row “3 · Write” = register/memory, Input/Output only on an output instruction; Setup “illustrative cycle”; both What-is-happening paragraphs; reconciliation sentence with fetch–decode–execute; takeaways; answers/M01), R007 (capability distinction narrow/general kept apart from the philosophical weak/strong one; “every AI today does one job” generalization removed; Figure 1.5 columns “In use today” / “Hypothetical”, consciousness question separate; Technical[0] rewritten; takeaways; answers/M01), R065 (heading “Is thinking computation?”; Babbage sentence “In the 1800s, Charles Babbage envisioned a programmable calculating machine”), R009 (rice: 2³²−1 grains × 25 mg ≈ 107 tons; paper 0.1 mm × 2⁴² ≈ 440,000 km; “no granary on earth” dropped to match TR), R010 (1965 yearly / 1975 two-yearly; count ≠ speed; “subatomic” → “approach atomic scales”; table labeled illustrative). GLOSSARY NOTE (for the glossary agent): back/glossary.md “Moore’s law” says “The observation (1965) … every two years”; the 1965 yearly / 1975 two-yearly split and the “approach atomic scales” wording should be carried into the glossary (R010 acceptance test). FIGURE NOTE (for the figure agent): the Figure 1.5 SVG column headers come from the demo data (catA/catB); the printed table and Setup now read “In use today” / “Hypothetical”, so the demo data and the figure should take the same labels; in the Figure 1.4 SVG the dark part in the “3 · Write” frame should be register/memory rather than Input/Output.
- 2026-09-30 humanizing pass: report findings applied (M01 :11–:304, answers :19); "On screen … on paper" frames removed from Figures 1.1, 1.4, 1.5, 1.6; "the digital version" ×5 → "the live demo" once / "the charts"; "exactly", "That is why", "Notice", "Here is the trick", "magic", "power", "revolution", "in one sentence" removed; technical "What is happening?" trimmed where it repeated the Technical paragraph (Figures 1.1, 1.3, 1.6). Source paragraph changes are listed in the SOURCE-CHANGES block above for the digital edition.
- 2026-10-01 verification round (open records R002, R004, R007, R069 and the Figure 1.6 observation): the digital intelligence demo shows a permanent caption in both modes ("The bar is an illustrative level, not a measured score."); glossary Turing machine entry separates the special-purpose and universal machine and notes uncomputable problems; the narrow-AI test no longer says "cannot step outside the jobs it was trained for" but "particular tasks, no human-level general learning and transfer across domains" (Figure 1.5 What is happening, answers/M01 Try it yourself 1 and Self-test 3, glossary, digital).
- 2026-10-02 second verification round (R064/N007): the digital Figure 1.6 counter now reads "2,300 · 1.2 million · 2.4 billion" (en-US format) in all 27 states (print/kitap/qa/exp_getter_test.mjs).
-->

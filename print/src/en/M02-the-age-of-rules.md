# Chapter 2
## The Age of Rules
*Before learning: hand-written intelligence*

<!-- acc #bb4d17 · tag Classical AI -->

### 2.1 The age of rules

Today, AI means systems that learn from data. Yet the story’s first great act was the exact opposite: the masters of that era tried to make the machine memorize the world. Whatever it needed to act intelligently (all the knowledge, all the rules) they wrote out by hand, one line at a time.

This approach is called “classical” or “symbolic” AI. Logic, rules, search and expert systems were that era’s toolbox. This chapter visits it: how did these ideas work, what did they achieve, and why did they one day hit a wall? You will try every bit of it with your own hands.

> **Margin note.** Early AI researchers thought: “If we write enough rules, the machine becomes intelligent.” It worked beautifully for some tasks, and not at all for others.

#### Technical depth

Classical AI (symbolic AI, or GOFAI, short for “Good Old-Fashioned AI”) treats intelligence as rule-based manipulation of formal symbols. The core assumption: knowledge about the world can be represented explicitly, and reasoning can run as logical operations over those representations.

This paradigm dominated from the 1950s to the 1980s and produced powerful tools such as logic programming, search algorithms and expert systems. This chapter builds them up, then shows why the “knowledge-acquisition bottleneck” and brittleness increased interest in learning-based approaches (Chapter 3) that were already being studied.

Start with the most basic question of all: how does a machine know that Tom is a cat?

### 2.2 Representing knowledge with symbols

How would you teach a machine about Tom? It cannot see him or pet him; it knows him only through the sentences you write: “Tom is a cat,” “a cat is a mammal,” “a mammal is an animal.” Classical AI stores knowledge in that form: explicit symbols and the links between them.

The best part is that the machine follows those links and reaches facts nobody ever told it. It never heard the sentence “Tom is an animal”; but walking the chain link by link, it finds that out itself. Figure 2.1 asks four questions; read how the machine “thinks” there, step by step.

> **Margin note.** Symbolic AI’s strength: it can derive many new facts from a few rules. Its weakness: someone has to write those rules first.

**Figure 2.1 · Inference along a knowledge chain**
![Figure 2.1](../../figures/out/en/figure-2-1-chain.svg)

*Setup.* The figure shows five boxes in a single row: Tom, Cat, Mammal, Animal, Living thing. Two kinds of arrow connect the boxes. The first arrow is labeled “instance of” and ties an individual to its class: Tom is an instance of the class Cat. The other three arrows are labeled “subclass of” and tie a class to a larger class: Cat is a subclass of Mammal, Mammal of Animal, Animal of Living thing. These four arrows are the machine’s entire knowledge; it knows nothing else. Under the chain are four queries; for each one the machine walks the chain from the start and states its verdict.

*Step by step.* Follow the query “Is Tom a Mammal?” first.

1. The machine starts at Tom. The class name it is looking for is “Mammal.” Tom is not a class but an individual; the “instance of” arrow leaving Tom says that Tom belongs to the class Cat.
2. It moves on to the Cat box. This box is not named “Mammal”; the “subclass of” arrow leaving Cat leads to Mammal.
3. It arrives at the Mammal box. The name matches: Tom is an instance of Cat, and Cat is a subclass of Mammal, so Tom is a mammal. In the figure the first three boxes are shaded and the verdict reads “Yes: ‘Mammal’ found in the chain (transitivity).”

It followed two arrows. Nobody wrote the sentence “Tom is a Mammal”; the machine derived it.

Now the query “Is Tom a Plant?”

1. Tom: an individual; the “instance of” arrow leads to Cat.
2. Cat: the box is not named “Plant”; the “subclass of” arrow leads to Mammal.
3. Mammal: no match; arrow to Animal.
4. Animal: no match; arrow to Living thing.
5. Living thing: no match. No arrow leaves Living thing; the chain has ended. The verdict reads “Unknown: ‘Plant’ is not in the knowledge base.”

All four queries:

| Query | Arrows followed | Verdict |
|---|---|---|
| Is Tom an Animal? | 3 | Yes |
| Is Tom a Mammal? | 2 | Yes |
| Is Tom a Plant? | 4, chain ended | Unknown |
| Is Tom a Rock? | 4, chain ended | Unknown |

The verdict is “Unknown,” not “No.” The machine does not claim that Tom is not a plant; it only says that its arrows cannot reach that fact. Staying silent about what it does not know is a virtue of symbolic systems.

*What is happening?* All the machine holds is “what kind of thing is what”: Tom is a cat, a cat is a mammal... When you ask, it follows the chain link by link and reaches a fact nobody ever told it. And if it isn’t in the chain, it admits it: “unknown.”

*Try it yourself.* 1) Add one more arrow at the end of the chain: a Living thing is an Entity. What does the machine say to “Is Tom an Entity?” and how many arrows does it follow? 2) Turn the question around: “Is a Cat a Tom?” The arrows point one way only; what does the machine answer? Do you think that answer is right? 3) What would you have to add to the knowledge base for the machine to say “Tom is not a Plant”? Live demo: [QR 2.1]

#### Technical depth

In symbolic AI, knowledge is encoded via knowledge representation: semantic networks, frames, ontologies or logical propositions. Entities and their relations (e.g. is-a, has-a) are defined explicitly.

Inference is the application of rules over these representations. The demonstration in Figure 2.1 uses transitivity in an is-a hierarchy. An ontology keeps two links apart: Tom is an instance of the class Cat (instance-of); Cat is a subclass of Mammal (subclass-of). If “Tom instance-of Cat” and “Cat subclass-of Mammal,” then “Tom instance-of Mammal” is derived, so Tom is a mammal. Figure 2.1 labels the two links differently: the first arrow “instance of,” the others “subclass of.” This is the essence of symbolic reasoning.

The knowledge base holds one instance-of link followed by subclass-of links. For each query the inference engine follows the chain using the transitivity rule: if the target is in the chain, “Yes”; otherwise, “Unknown.”

Written formally, the transitivity rule between classes reads: subclass-of(A, B) ∧ subclass-of(B, C) → subclass-of(A, C). For an instance: instance-of(a, B) ∧ subclass-of(B, C) → instance-of(a, C). The engine applies this rule over and over along the chain; on a five-node chain it either reaches the target or runs off the end within four steps.

The chain only ever followed “is a” links. Getting from what a machine knows to what it should do takes another kind of sentence: if it is raining, then what?

### 2.3 If... then...: rules and expert systems

At the heart of classical AI beats one tiny sentence: “IF this is true, THEN do that.” This is a rule. Stack enough rules and systems are born that act like masters of a field. These are expert systems: apprentices that hold a doctor’s knowledge as question-and-answer rules.

In the 1980s these apprentices worked everywhere, from medicine to engineering. Below is a tiny one: switch the conditions on and off in your head; see in Figure 2.2 which rule “fires” and how the advice is born.

> **Margin note.** One rule’s output can trigger another rule; this is “chaining.” From a single fact the system can build a long chain of reasoning.

**Figure 2.2 · A tiny expert system**
![Figure 2.2](../../figures/out/en/figure-2-2-expert.svg)

*Setup.* At the top of the figure are three facts: “It’s raining” is on, “It’s cold” and “It’s windy” are off. Under them sit five rule cards, R1 to R5; the IF condition is on the left of each card, the THEN advice on the right. A rule that fires is shaded; R5 carries a “chain” mark because it depends on another rule. The advice of every fired rule is lined up at the bottom. At the start only R1 fires: “Take an umbrella.” A small table in the figure lists three scenarios; the text below walks through them.

*Step by step.* The system does the same three jobs every time. It looks at the facts that are on, compares each rule’s IF part with those facts, and fires the rules that match. Three scenarios:

| Scenario | Facts on | Rules fired | Advice line |
|---|---|---|---|
| A (initial) | Rain | R1 | Take an umbrella |
| B | Rain, Wind | R1, R5 | Take an umbrella · Careful: the umbrella may flip! |
| C | Cold, Wind | R2, R3 | Wear a coat · Wear a scarf |

In scenario A only rain is on. R1’s condition is “It’s raining”: it holds, so R1 fires. R2 and R3 ask for cold, R5 asks for wind; all three stay silent. R4 says “No rain”; it is raining, so R4 is silent too.

In scenario B wind is on as well. The IF part of R5 names no fact but the result of another rule: “Umbrella” fired. So the engine runs two rounds. In the first round R1 fires and drops an “umbrella” note into working memory. In the second round R5 sees that note, combines it with the wind and fires. Two facts gave two pieces of advice; the second is built on the first. This is chaining. Set rain to off and R1 goes dark, no note is dropped, and R5 stays silent too: wind alone is not enough.

In scenario C rain is off, cold and wind are on. R1 and R5 are silent. Cold fires R2; cold AND windy fires R3. R4 gets past its “no rain” condition, but its “not cold” condition fails; it stays silent.

*What is happening?* The system checks every condition that is on against its rules: whichever rule’s “IF” part holds, that rule fires and gives its advice. R5 is the odd one out: it waits for another rule’s result. One rule feeding the next is chaining.

*Try it yourself.* 1) All three facts are on: which rules fire, and how many pieces of advice are on the advice line? 2) Only “It’s windy” is on. What does the system advise? Does that advice make sense to you; which rule is missing? 3) If R5 depended on “It’s windy” alone, what would be lost? Live demo: [QR 2.2]

#### Technical depth

Production rules take the IF-THEN form; an inference engine triggers rules whose conditions match facts in working memory. Forward chaining goes from facts to conclusions; backward chaining works from a goal toward evidence.

Expert systems (e.g. MYCIN, 1970s) used this architecture: a knowledge base (rules) plus an inference engine. In Figure 2.2 you will also see a fact produced by one rule trigger another rule (chaining). The limit: rules must be hand-written, and exceptions explode.

R5 is a chain: it triggers only if R1 fired (umbrella) and it is windy.

The engine of the demonstration makes two passes. The first pass evaluates only the rules that depend on facts and adds the derived facts they produce (R1 → umbrella) to working memory. The second pass evaluates every rule again against this extended memory. For longer chains the same loop repeats until no new fact is produced.

Rules say what to do. When there are thousands of options, though, which one should be tried first? Classical AI had a second tool for that: search.

### 2.4 Search and heuristic shortcuts

Finding the way out of a maze, picking a chess move, plotting a route through town... all versions of the same game: a crowd of possibilities lies before you, and you are hunting the one that reaches the goal.

The most patient method is trying every possibility one by one, but that can be terribly slow. A heuristic takes a shortcut: it guesses “which direction looks more promising?” Figure 2.3 races the two: the uninformed one scans everywhere; the informed one points its nose at the goal.

> **Margin note.** Greedy heuristics buy speed, but at a price: they can sometimes miss the best solution. They prefer “good enough” over “perfect.” More careful methods such as A* win the guarantee back with a suitable heuristic.

**Figure 2.3 · Pathfinding: uninformed vs informed**
![Figure 2.3](../../figures/out/en/figure-2-3-grid.svg)

*Setup.* The figure shows a grid of 8 columns and 6 rows; 11 of the 48 cells are black walls. S (start) is top left, G (goal) bottom right. The walls form three vertical barriers: four cells from the top in column 3, four from the bottom in column 5, three in the middle of column 7. So the path passes the first barrier at the bottom, the second at the top, the third at the bottom. Both panels show the same grid: uninformed search left, informed right. Light orange cells are the explored cells, dark orange cells the path; each cell’s number is its exploration order.

*Step by step.* Uninformed search (BFS):

1. It starts at S and queues S’s neighbors; first in, first out.
2. It spreads in rings: cells one step from S, then two, then three. With no sense of direction, it scans the left corridor, the bottom row and the middle corridor alike.
3. It stops when G leaves the queue. The counter reads 36 cells explored, 36 of the 37 empty cells; only column 8, row 4 was never touched.
4. The path is read backward: 19 cells (S and G included), that is, 18 steps. This is the path with the fewest steps possible; since every step on the grid costs the same, it is the cheapest path too.

Greedy informed search:

1. It scores every cell by its street distance to the goal: column difference plus row difference. For S, 7 + 5 = 12.
2. It always takes the lowest-scoring cell from the queue. It goes down the left corridor, passes under the first barrier and reaches column 4.
3. Here it is fooled: the bottom row shares G’s row, so it looks close. Because the wall in column 5, row 6 blocks the way to the right, it tries columns 4, 3, 2 and 1 of the bottom row, then column 1, row 5: five cells wasted.
4. Following the scores, it climbs column 4 to row 2, comes down column 6 and reaches G. The counter reads 24 cells.
5. The path: again 19 cells, 18 steps.

| Method | Cells explored | Path (cells) |
|---|---|---|
| Uninformed (BFS) | 36 | 19 |
| Greedy informed | 24 | 19 |

The greedy search visited a third fewer cells and still found the shortest path. That is luck, not a guarantee: a low-scoring dead end cost it five cells, and a more devious maze could mean a long detour. BFS’s 36 cells are the price of the guarantee. A*, which adds the distance already traveled to the score, keeps both the guarantee and the savings with the same heuristic.

*What is happening?* You are racing two searchers. The uninformed one patiently scans in every direction; when every step costs the same, it finds the path with the fewest steps in the end, but it visits many squares. The greedy informed one always runs toward the goal; it visits few squares but sometimes misses the shortest path. That is the trade-off between speed and guarantee; methods such as A* win the guarantee back by counting the distance already traveled.

*Try it yourself.* 1) Score two cells: column 4, row 2 and column 1, row 6. Which looks closer to the goal? Which one is on the path? 2) S scores 12, but the shortest path is 18 steps. Where does the difference come from? 3) Remove the wall in column 5, row 6: how many steps is the shortest path now? Live demo: [QR 2.3]

#### Technical depth

Many classical AI problems are modeled as state-space search. Uninformed search, such as breadth-first search (BFS), scans systematically without any direction information; when all edges have the same cost it guarantees a minimum-step and therefore minimum-cost path, but it expands many nodes. Unequal edge costs require a different method.

Informed search estimates closeness to the goal with a heuristic function h(n); greedy best-first uses only h (fast but no optimality guarantee), while A* uses g(n)+h(n): with an admissible h (one that never exceeds the true distance) it finds the shortest path in tree search; graph search also needs h to be consistent, or nodes reached by a better path to be reopened. In Figure 2.3, compare how many cells BFS and heuristic search each explore.

BFS (uninformed) expands layer by layer with a FIFO queue and guarantees the shortest path on an equal-cost grid. Informed (greedy best-first) search picks the node minimizing the Manhattan distance h(n) to the goal; it opens far fewer cells but does not guarantee the shortest path.

On this grid, with zero-based coordinates, h(n) = |x − 7| + |y − 5|. Results: BFS expanded 36 nodes, greedy search 24; both found the 18-step shortest path. Because h never exceeds the true distance at any node (it is admissible) and changes by at most 1 between neighboring cells (it is consistent), A* with the same h also finds the shortest path in graph search and usually expands fewer nodes than BFS.

Search assumed that the world is certain: a wall is a wall, and the goal stays where it is. Tomorrow’s weather offers no such certainty, and knowledge that is not certain needs a different tool.

### 2.5 Handling uncertainty: probability and Markov

Strict rules stumble in the real world, because the world is uncertain. “If it rains, take an umbrella” is easy to say; but will it rain? Nobody knows for certain. At best, you can name the odds.

Classical AI found an elegant answer: move from state to state by probability. The Markov chain is the most famous example: a weather game played with a loaded die. The table under Figure 2.4 holds a seven-day example: follow the weather there as it changes according to its odds.

> **Margin note.** The Markov property: “given the present, the future does not depend on the earlier past; how you got here doesn’t matter.” It looks simple, yet it is everywhere, from weather to Google search.

**Figure 2.4 · A weather Markov chain**
![Figure 2.4](../../figures/out/en/figure-2-4-markov.svg)

*Setup.* The figure shows three state boxes, Sunny, Cloudy and Rainy, joined by arrows; the number on each arrow is the chance of that move, in percent. Next to them the same numbers form the transition matrix: rows are today, columns are tomorrow; every row adds up to 100.

| today \ tomorrow | Sunny | Cloudy | Rainy |
|---|---|---|---|
| Sunny | 70 | 20 | 10 |
| Cloudy | 30 | 40 | 30 |
| Rainy | 20 | 40 | 40 |

*Step by step.* First the loaded die. Say today is sunny; the first row reads 70 / 20 / 10. Picture a die with one hundred faces: 1 to 70 mean sun, 71 to 90 cloud, 91 to 100 rain. The machine draws a number from 1 to 100; the range it lands in is tomorrow’s weather. The die is loaded: after sun, more sun has a 70 percent share; rain gets only 10.

Now a seven-day chain. The live demo draws the numbers at random; the seven draws here were chosen so that you can follow every step. In each row, find today’s ranges, then place the number drawn.

| Day | Today | Ranges (S / C / R) | Number drawn | Tomorrow |
|---|---|---|---|---|
| 1 | Sunny | 1-70 / 71-90 / 91-100 | 42 | Sunny |
| 2 | Sunny | 1-70 / 71-90 / 91-100 | 83 | Cloudy |
| 3 | Cloudy | 1-30 / 31-70 / 71-100 | 55 | Cloudy |
| 4 | Cloudy | 1-30 / 31-70 / 71-100 | 91 | Rainy |
| 5 | Rainy | 1-20 / 21-60 / 61-100 | 77 | Rainy |
| 6 | Rainy | 1-20 / 21-60 / 61-100 | 12 | Sunny |
| 7 | Sunny | 1-70 / 71-90 / 91-100 | 64 | Sunny |

After seven days the tally is three sunny, two cloudy, two rainy: 43 / 29 / 29 percent. Moving to rain on day 4, the machine never looked at the three days before; “today is cloudy” and the number 91 were enough.

Finally, the long run. Seven days is not much; because every state can be reached from every other in this chain, after hundreds of days the shares settle, whatever the starting day, and you can find them without any die. Let the long-run shares be S (sunny), C (cloudy), R (rainy). A sunny day arrives by three routes: after sun (0.7·S), after cloud (0.3·C), after rain (0.2·R). If the shares are steady, that sum must again be S:

S = 0.7·S + 0.3·C + 0.2·R  
C = 0.2·S + 0.4·C + 0.4·R  
R = 0.1·S + 0.3·C + 0.4·R, and S + C + R = 1.

Solution: S = 6/13, C = 4/13, R = 3/13; about 46 / 31 / 23 percent. Check: 0.7·6 + 0.3·4 + 0.2·3 = 4.2 + 1.2 + 0.6 = 6. Run the live demo long enough and its bars sway around these numbers.

*What is happening?* Tomorrow’s weather is predicted by looking only at today; once today is known, yesterday doesn’t matter. Each day rolls a die, but the die is loaded: after a sunny day, more sun is likely. As the days pile up, the shares settle into the same proportions every time.

*Try it yourself.* 1) Today is rainy and the number drawn is 35: what is tomorrow’s weather? 2) Today is sunny. What is the chance of rain two days from now? Hint: work out tomorrow’s three possibilities separately, then add them. 3) If the Sunny row became 90 / 5 / 5, which way would the long-run split move? Guess first, then check with the first equation. Live demo: [QR 2.4]

#### Technical depth

Probabilistic models are used to reason under uncertainty. A Markov chain is a stochastic process where, given the current state, the next state does not depend on earlier history (the Markov property: conditional independence given the present); transitions are defined by a probability matrix whose rows each sum to 1.

A finite, irreducible, aperiodic chain converges from any starting state to a unique stationary distribution; the existence of a stationary distribution alone does not guarantee convergence. The idea extends to hidden Markov models, PageRank and the Markov decision processes of reinforcement learning. In Figure 2.4, observe how the long-run distribution forms.

Each new day samples from P’s current row; the transition matrix P itself never changes.

The stationary distribution π solves two equations:

πP = π  
Σπᵢ = 1

For this P, π = (6/13, 4/13, 3/13) ≈ (0.462, 0.308, 0.231). Every entry of the matrix is positive, so the chain is irreducible and aperiodic; that is why this finite three-state chain converges to the same π from any start. From a sunny start the expected distribution evolves as follows: day 1 (0.70, 0.20, 0.10), day 2 (0.57, 0.26, 0.17), day 3 (0.51, 0.29, 0.20), day 5 (0.47, 0.30, 0.23). Convergence is largely complete within five days; the counter in the demonstration is a sample, so it fluctuates around these values.

Probability loosened the rules a little; but a human still writes the table, the rules and the chain by hand. How much of that load can a person carry? On that question AI researchers split into two camps.

### 2.6 Neats and scruffies

For years, AI researchers were split into two rival camps. The “neats” wanted every step proven with clean mathematics. The “scruffies” shrugged: “If it works, it’s good; we’ll find the theory later.”

This quarrel isn’t only history; it continues today. Sort the statements below into the right camp. At the end it will be clear why classical AI hit its wall, and how that collision raised interest in an idea already under study: machines that “learn.”

> **Margin note.** Classical AI’s lesson: hand-writing all the world’s rules is impossible. The solution? Instead of giving the machine rules, teach it to find them in data itself. That is the next chapter.

**Figure 2.5 · Which approach?**
![Figure 2.5](../../figures/out/en/figure-2-5-classify.svg)

*Setup.* The figure shows four statement cards, one under the other; next to each card are two boxes: Neat and Scruffy. The cards are short, like slogans; each is a single sentence that could have come out of a researcher’s mouth.

*Self-test.* Pick the camp for each statement: Neat or Scruffy?

| # | Example | Neat | Scruffy |
|---|---|---|---|
| 1 | Prove everything with formal logic | ☐ | ☐ |
| 2 | Use working shortcuts, theorize later | ☐ | ☐ |
| 3 | Mathematical rigor is essential | ☐ | ☐ |
| 4 | The real world is messy; be flexible | ☐ | ☐ |

The words can mislead: “rigor” and “prove” come from one camp, “shortcuts” and “flexible” from the other, but the test is the attitude. Does the speaker want it proven first, or working first? The first is Neat, the second Scruffy. Answers and reasons are at the back of the book.

*What is happening?* Two camps, two personalities: neats want every step proven with mathematics; scruffies say “make it work first, theory comes later.” Both turned out right in places; today’s AI is a blend of the two.

*Try it yourself.* 1) Sort the five methods of this chapter into the two camps: the knowledge chain, the expert system, uninformed search, informed search, the Markov chain. Which ones promise an exact result, and which settle for “good enough”? 2) The heuristic score (Figure 2.3) is which camp’s invention? The guarantee that A* adds to it moves it to which camp? 3) Find an example from your own life: a moment when you first made something work and thought about the theory later. Live demo: [QR 2.5]

#### Technical depth

The “neat” vs “scruffy” distinction (attributed to Roger Schank) names a methodological tension in AI: between formal, provable, principled approaches (neats; logic and probability theory, for instance) and heuristic, engineering-driven, empirical ones (scruffies).

Classical symbolic AI hit two fundamental limits: the knowledge-acquisition bottleneck (hand-writing every rule doesn’t scale) and brittleness (collapsing on unforeseen cases). These limits increased interest in learning-based methods that were already being studied; symbolic and learning-based approaches developed alongside one another (Rosenblatt’s perceptron dates from 1958). That is how the shift to statistical AI (Chapter 3), which learns from data instead of hand-coding knowledge, picked up speed.

Classical AI’s wall, in two ideas: the knowledge-acquisition bottleneck and brittleness.

The quarrel proved both camps partly right; the next chapter tells how. First, six questions.

### 2.7 Test yourself

*Answers are at the back of the book.*
1. How does classical (symbolic) AI represent knowledge?
   a) By learning from data
   b) Only with images
   c) With explicit symbols and rules
   d) By random guessing

2. What is “if it’s raining, take an umbrella”?
   a) A probability
   b) A neural network
   c) A rule (IF-THEN)
   d) A dataset

3. Key property of greedy heuristic search?
   a) They always guarantee the optimal solution
   b) They guess at random
   c) They learn from data
   d) They speed up the search but don’t guarantee the best

4. In a Markov chain, the next state depends on?
   a) Only the current state
   b) The entire history
   c) The future
   d) Nothing

5. Classical AI’s biggest challenge was?
   a) Hand-writing all rules, and the messiness of the world
   b) Being too fast
   c) Depending on the internet
   d) Being too cheap

6. What do “Neat” and “Scruffy” describe?
   a) Two approaches in AI research
   b) Two robot types
   c) Two programming languages
   d) Two computer brands

### What to keep from this chapter

- Classical AI stores knowledge as explicit symbols and hand-written rules.
- An “is a” chain (instance to class, class to larger class) derives facts nobody wrote down, thanks to transitivity; for anything not in the chain it says “unknown.”
- An expert system fires the IF-THEN rules that match the facts that are on; one rule’s result can trigger another rule.
- On an equal-cost grid, uninformed search guarantees the path with the fewest steps but visits many cells; greedy informed search visits fewer but gives no guarantee; A* combines the two with an admissible heuristic.
- In a Markov chain, once today is known, tomorrow does not depend on the earlier past; in a finite chain where every state can be reached and no cycle locks in, the long-run distribution settles at one fixed ratio.
- Neats want proof first, scruffies want results first; modern AI took something from each.
- Hand-writing rules does not scale and is brittle; these limits raised interest in the learning research that ran alongside the symbolic era.

<!-- SOURCE-CHANGES
This approach is called “classical” or “symbolic” AI. Logic, rules, search and expert systems were that era’s toolbox. We are visiting it now: How did these ideas work, what did they achieve, and why did they one day hit a wall? You will try every bit of it with your own hands. ||| This approach is called “classical” or “symbolic” AI. Logic, rules, search and expert systems were that era’s toolbox. This chapter visits it: how did these ideas work, what did they achieve, and why did they one day hit a wall? You will try every bit of it with your own hands.
How would you teach a machine about Tom? It cannot see him or pet him; it knows him only through the sentences you write: “Tom is a cat,” “a cat is a mammal,” “a mammal is an animal.” That is how classical AI stores knowledge: explicit symbols and the links between them. ||| How would you teach a machine about Tom? It cannot see him or pet him; it knows him only through the sentences you write: “Tom is a cat,” “a cat is a mammal,” “a mammal is an animal.” Classical AI stores knowledge in that form: explicit symbols and the links between them.
Here is the lovely part: The machine follows those links and reaches facts nobody ever told it. It never heard the sentence “Tom is an animal”; but walking the chain link by link, it finds that out itself. Figure 2.1 asks four questions; read how the machine “thinks” there, step by step. ||| The best part is that the machine follows those links and reaches facts nobody ever told it. It never heard the sentence “Tom is an animal”; but walking the chain link by link, it finds that out itself. Figure 2.1 asks four questions; read how the machine “thinks” there, step by step.
All the machine really holds is “what kind of thing is what”: Tom is a cat, a cat is a mammal... When you ask, it follows the chain link by link and reaches a fact nobody ever told it. And if it isn’t in the chain, it honestly says “unknown.” ||| All the machine holds is “what kind of thing is what”: Tom is a cat, a cat is a mammal... When you ask, it follows the chain link by link and reaches a fact nobody ever told it. And if it isn’t in the chain, it admits it: “unknown.”
The knowledge base contains only consecutive “is-a” links. Pick a query; the inference engine follows the chain using the transitivity rule. If the target is in the chain: “Yes”; otherwise: “Unknown.” ||| The knowledge base holds one instance-of link followed by subclass-of links. For each query the inference engine follows the chain using the transitivity rule: if the target is in the chain, “Yes”; otherwise, “Unknown.”
In the 1980s these apprentices worked everywhere, from medicine to engineering. Below is a tiny one: Switch the conditions on and off in your head; see in Figure 2.2 which rule “fires” and how the advice is born. ||| In the 1980s these apprentices worked everywhere, from medicine to engineering. Below is a tiny one: switch the conditions on and off in your head; see in Figure 2.2 which rule “fires” and how the advice is born.
The system checks every condition that is on against its rules: whichever rule’s “IF” part holds, that rule fires and gives its advice. Look at R5: it waits for another rule’s result. That is how rules chain together. ||| The system checks every condition that is on against its rules: whichever rule’s “IF” part holds, that rule fires and gives its advice. R5 is the odd one out: it waits for another rule’s result. One rule feeding the next is chaining.
Facts in working memory fire the production rules whose conditions match (forward chaining). R5 is a chain: it triggers only if R1 fired (umbrella) and it is windy. ||| R5 is a chain: it triggers only if R1 fired (umbrella) and it is windy.
Finding the way out of a maze, picking a chess move, plotting a route through town... all versions of the same game: A crowd of possibilities lies before you, and you are hunting the one that reaches the goal. ||| Finding the way out of a maze, picking a chess move, plotting a route through town... all versions of the same game: a crowd of possibilities lies before you, and you are hunting the one that reaches the goal.
The most patient method is trying every possibility one by one, but that can be terribly slow. A heuristic takes a shortcut: it guesses “which direction looks more promising?” We raced the two in Figure 2.3: The uninformed one scans everywhere; the informed one points its nose at the goal. ||| The most patient method is trying every possibility one by one, but that can be terribly slow. A heuristic takes a shortcut: it guesses “which direction looks more promising?” Figure 2.3 races the two: the uninformed one scans everywhere; the informed one points its nose at the goal.
Strict rules stumble in the real world, because the world is uncertain. “If it rains, take an umbrella” is easy to say; but will it rain? Nobody knows for certain. At best, we can name the odds. ||| Strict rules stumble in the real world, because the world is uncertain. “If it rains, take an umbrella” is easy to say; but will it rain? Nobody knows for certain. At best, you can name the odds.
Tomorrow’s weather is predicted by looking only at today; yesterday doesn’t matter. Each day rolls a die, but the die is loaded: after a sunny day, more sun is likely. As the days pile up, the bars of Figure 2.4 settle into the same proportions every time. ||| Tomorrow’s weather is predicted by looking only at today; yesterday doesn’t matter. Each day rolls a die, but the die is loaded: after a sunny day, more sun is likely. As the days pile up, the shares settle into the same proportions every time.
The transition matrix P is fixed; the next state depends only on the current one (the Markov property). Each new day samples from P’s current row; in the long run the distribution converges to the stationary one. ||| Each new day samples from P’s current row; the transition matrix P itself never changes.
For years, AI researchers were split into two rival camps. The “neats” wanted every step proven with clean mathematics. The “scruffies” just shrugged: “If it works, it’s good; we’ll find the theory later.” ||| For years, AI researchers were split into two rival camps. The “neats” wanted every step proven with clean mathematics. The “scruffies” shrugged: “If it works, it’s good; we’ll find the theory later.”
This quarrel isn’t just history; it continues today. Sort the statements below into the right camp. At the end it will be clear why classical AI hit its wall, and how that collision gave birth to the idea of machines that “learn.” ||| This quarrel isn’t only history; it continues today. Sort the statements below into the right camp. At the end it will be clear why classical AI hit its wall, and how that collision gave birth to the idea of machines that “learn.”
Classical AI’s lesson: hand-writing all the world’s rules is impossible. The solution? Instead of giving the machine rules, teach it to find them in data itself. That is exactly what the next chapter is about. ||| Classical AI’s lesson: hand-writing all the world’s rules is impossible. The solution? Instead of giving the machine rules, teach it to find them in data itself. That is the next chapter.
Two camps, two personalities: neats want every step proven with mathematics; scruffies say “make it work first, theory comes later.” Both turned out right in places; today’s AI is really a blend of the two. ||| Two camps, two personalities: neats want every step proven with mathematics; scruffies say “make it work first, theory comes later.” Both turned out right in places; today’s AI is a blend of the two.
This is a methodological tension in AI: principled/provable approaches (neat: logic, probability) versus empirical/engineering-driven ones (scruffy). Classical AI’s wall: the knowledge-acquisition bottleneck and brittleness. ||| Classical AI’s wall, in two words: the knowledge-acquisition bottleneck and brittleness.
Classical AI’s wall, in two words: the knowledge-acquisition bottleneck and brittleness. ||| Classical AI’s wall, in two ideas: the knowledge-acquisition bottleneck and brittleness.
This paradigm dominated from the 1950s to the 1980s and produced powerful tools such as logic programming, search algorithms and expert systems. This chapter builds them up, then shows why the “knowledge-acquisition bottleneck” and brittleness drove the shift to statistical, learning approaches (Chapter 3). ||| This paradigm dominated from the 1950s to the 1980s and produced powerful tools such as logic programming, search algorithms and expert systems. This chapter builds them up, then shows why the “knowledge-acquisition bottleneck” and brittleness increased interest in learning-based approaches (Chapter 3) that were already being studied.
Inference is the application of rules over these representations. The demo below uses transitivity in an is-a hierarchy: if “Tom is-a Cat” and “Cat is-a Mammal,” then “Tom is-a Mammal” can be derived. This is the essence of symbolic reasoning. ||| Inference is the application of rules over these representations. The demo below uses transitivity in an is-a hierarchy. An ontology keeps two links apart: Tom is an instance of the class Cat (instance-of); Cat is a subclass of Mammal (subclass-of). If “Tom instance-of Cat” and “Cat subclass-of Mammal,” then “Tom instance-of Mammal” is derived, so Tom is a mammal. The demo draws both links as one arrow type, “is a.” This is the essence of symbolic reasoning.
Heuristics buy speed, but at a price: they can sometimes miss the best solution. They prefer “good enough” over “perfect.” ||| Greedy heuristics buy speed, but at a price: they can sometimes miss the best solution. They prefer “good enough” over “perfect.” More careful methods such as A* win the guarantee back with a suitable heuristic.
You are racing two searchers. The uninformed one patiently scans in every direction; it finds the shortest path in the end but visits many squares. The informed one always runs toward the goal; it visits few squares but sometimes misses the shortest path. That is the trade-off between speed and guarantee. ||| You are racing two searchers. The uninformed one patiently scans in every direction; when every step costs the same, it finds the path with the fewest steps in the end, but it visits many squares. The greedy informed one always runs toward the goal; it visits few squares but sometimes misses the shortest path. That is the trade-off between speed and guarantee; methods such as A* win the guarantee back by counting the distance already traveled.
Many classical AI problems are modeled as state-space search. Uninformed search, such as breadth-first search (BFS), scans systematically without any direction information and guarantees the shortest path, but expands many nodes. ||| Many classical AI problems are modeled as state-space search. Uninformed search, such as breadth-first search (BFS), scans systematically without any direction information; when all edges have the same cost it guarantees a minimum-step and therefore minimum-cost path, but it expands many nodes. Unequal edge costs require a different method.
Informed search estimates closeness to the goal with a heuristic function h(n); greedy best-first uses only h (fast but no optimality guarantee), while A* balances optimality and efficiency with g(n)+h(n) (if h is admissible). Below, compare how many cells BFS and heuristic search each explore. ||| Informed search estimates closeness to the goal with a heuristic function h(n); greedy best-first uses only h (fast but no optimality guarantee), while A* uses g(n)+h(n): with an admissible h (one that never exceeds the true distance) it finds the shortest path in tree search; graph search also needs h to be consistent, or nodes reached by a better path to be reopened. Below, compare how many cells BFS and heuristic search each explore.
Key property of heuristic methods? ||| Key property of greedy heuristic search?
The Markov property: “the future depends only on the present; how you got here doesn’t matter.” It looks simple, yet it is everywhere, from weather to Google search. ||| The Markov property: “given the present, the future does not depend on the earlier past; how you got here doesn’t matter.” It looks simple, yet it is everywhere, from weather to Google search.
Tomorrow’s weather is predicted by looking only at today; yesterday doesn’t matter. Each press rolls a die, but the die is loaded: after a sunny day, more sun is likely. As the days pile up, watch the bars below settle into the same proportions every time. ||| Tomorrow’s weather is predicted by looking only at today; once today is known, yesterday doesn’t matter. Each press rolls a die, but the die is loaded: after a sunny day, more sun is likely. As the days pile up, watch the bars below settle into the same proportions every time.
Probabilistic models are used to reason under uncertainty. A Markov chain is a stochastic process where the next state depends only on the current state (the Markov property: independence from history); transitions are defined by a probability matrix. ||| Probabilistic models are used to reason under uncertainty. A Markov chain is a stochastic process where, given the current state, the next state does not depend on earlier history (the Markov property: conditional independence given the present); transitions are defined by a probability matrix whose rows each sum to 1.
Over enough steps the distribution usually converges to a stationary distribution. The idea extends to hidden Markov models, PageRank and the Markov decision processes of reinforcement learning. In the demo, observe how the long-run distribution forms. ||| A finite, irreducible, aperiodic chain converges from any starting state to a unique stationary distribution; the existence of a stationary distribution alone does not guarantee convergence. The idea extends to hidden Markov models, PageRank and the Markov decision processes of reinforcement learning. In the demo, observe how the long-run distribution forms.
This quarrel isn’t only history; it continues today. Sort the statements below into the right camp. At the end it will be clear why classical AI hit its wall, and how that collision gave birth to the idea of machines that “learn.” ||| This quarrel isn’t only history; it continues today. Sort the statements below into the right camp. At the end it will be clear why classical AI hit its wall, and how that collision raised interest in an idea already under study: machines that “learn.”
Classical symbolic AI hit two fundamental limits: the knowledge-acquisition bottleneck (hand-writing every rule doesn’t scale) and brittleness (collapsing on unforeseen cases). These limits accelerated the shift to statistical AI (Chapter 3), which learns from data instead of hand-coding knowledge. ||| Classical symbolic AI hit two fundamental limits: the knowledge-acquisition bottleneck (hand-writing every rule doesn’t scale) and brittleness (collapsing on unforeseen cases). These limits increased interest in learning-based methods that were already being studied; symbolic and learning-based approaches developed alongside one another (Rosenblatt’s perceptron dates from 1958). That is how the shift to statistical AI (Chapter 3), which learns from data instead of hand-coding knowledge, picked up speed.
Mathematical rigour is essential ||| Mathematical rigor is essential
-->

<!-- EDITORIAL NOTES
- 2.2 Simple: "Ask a question below and watch it “think.”" → "Figure 2.1 asks four questions; read how the machine “thinks” there, step by step."
- 2.3 Simple: "Below is a tiny one: Flip the conditions on and off; watch which rule “fires” and how the advice is born." → "Below is a tiny one: Flip the conditions on and off on paper; see in Figure 2.2 which rule “fires” and how the advice is born."
- 2.4 Simple: "Race the two below:" → "We raced the two in Figure 2.3:"
- 2.5 Simple: "Try it below: press “Next day” and watch the weather change according to its odds." → "Figure 2.4 holds a seven-day example: follow the weather there as it changes according to its odds."
- 2.6 Simple: "Sort the statements below into the right camp." left as is (the Figure 2.5 table answers it on paper). "At the end we’ll see why…" is a source sentence and was kept verbatim although the guide discourages "we will see"; → "At the end it will be clear why…" (digital source too; 2026-09-30).
- Technical paragraphs kept verbatim except for the screen references that end up BELOW the Figure block in the final layout; following the author decision recorded in the Turkish chapter (2026-09-10: "demo" → "Şekil N.j"), the smallest change was applied: 2.2 "The demo below uses transitivity" → "The demonstration in Figure 2.1 uses transitivity"; 2.3 "In the demo you will also see" → "In Figure 2.2 you will also see"; 2.4 "Below, compare how many cells" → "In Figure 2.3, compare how many cells"; 2.5 "In the demo, observe how" → "In Figure 2.4, observe how".
- Adapted for paper (2026-09-30; screen verbs resolved in the source text too): Figure 2.2 What is happening "every condition you switch on", "Watch R5"; Figure 2.4 What is happening "Each press rolls a die", "watch the bars below settle"; Figure 2.4 technical "“Next day” samples from P’s current row".
- Setups: source hints stripped of screen verbs ("Ask a question", "Toggle", "press “Search”", "Advance the days with “Next day” or “Auto”", "Place each statement" removed or rephrased).
- Figure 2.1: the two "Text embedded in the demo" fragments ("” found in the chain (transitivity)." and "” is not in the knowledge base.") are woven verbatim into Step by step as the full verdict lines shown in the figure: "✓ Yes: “Mammal” found in the chain (transitivity)." and "✗ Unknown: “Plant” is not in the knowledge base." Query order in the table follows the EN figure (Animal, Mammal, Plant, Rock); the Turkish table lists Mammal first.
- Figure 2.1: the glossary entries "Inference" and "Knowledge representation" use the cat name "Tabby"; the demo data and figure use "Tom", so the chapter uses "Tom". Author to align the glossary if desired. "Entity" was chosen for the Turkish exercise's "Varlık".
- Figure 2.2: emojis in the rule and advice texts (☂️ 🧥 🧣 👕 💨) were dropped, as in the printed figure (figure-2-2-expert.md). Rule R5 is shown as "R5" (the source id "R5 ⛓" becomes the "chain" mark in the figure).
- Figure 2.3: computed from the demo code (GRID + runGrid), same as TR: BFS explores 36 cells, greedy 24; both find the 19-cell (18-step) path. On this grid greedy search does NOT miss the shortest path; the text says so honestly ("luck, not a guarantee"). The verbatim Simple "What is happening?" sentence "sometimes misses the shortest path" stays true as a general statement. Grid description uses 1-based column/row numbers (as in the figure); the h(n) formula in Technical depth uses the code's zero-based coordinates, stated in the text.
- Figure 2.4: the seven draws (42, 83, 55, 91, 77, 12, 64) are example numbers chosen by the author, identical to the Turkish chapter; the demo uses Math.random. The text says so. Stationary distribution 6/13, 4/13, 3/13 and the day 1-5 expected values were re-verified by script. The EN figure shows the state diagram plus the transition matrix and no day counter; the matrix table from figure-2-4-markov.md is repeated in the Setup (as in TR); may count as duplication if the SVG also carries it.
- Figure 2.4: ranges in the table use a hyphen (1-70) per the guide; the equations are given as three consecutive lines exactly as in the Turkish chapter.
- Figure 2.5 (classify) is a self-test demo: a marking table replaces Step by step; the column header "Example" follows figure-2-5-classify.md; the statements are verbatim from the demo data, including the British spelling "rigour" (source text). Reasons are in answers/M02.md.
- Number style: percentages in prose as "70 percent", "43 / 29 / 29 percent"; fractions and decimals as in the source (6/13, 0.462).
- Word budget: new text per Figure block (Setup + Step by step + Try it yourself, tables excluded) is 361 / 373 / 435 / 413 / 315 words. Figure 2.3 (two search walkthroughs on the 11-wall grid) and Figure 2.4 (die, seven-day chain, stationary derivation; the 413 includes the three equation lines) follow the Turkish blueprint's content (372 and 329 Turkish words) and were trimmed twice; cutting further would drop blueprint steps. Author may shorten if the page budget requires.
- Quiz option order is the export's shuffled order, kept exactly; the export draft's Turkish heading "Kendini test et" was replaced by "Test yourself".
- Margin notes moved after the Simple paragraphs and before the Figure block, as in Chapter 1 and the Turkish edition.
- 2026-10-01 correction document: R011 (learning not the successor of the symbolic collapse; “already being studied” + parallel development: 2.1 Technical, 2.6 Simple, 2.6 Technical, takeaways), R012 (instance-of / subclass-of kept apart: Setup, 2.2 Technical, formal rule, takeaways; answers/M02), R013 (BFS guarantee tied to equal edge costs: Technical[0], step 4, What is happening, takeaways; quiz 3 question narrowed to greedy search), R014 (greedy and A* separated: margin note, Step-by-step heading and table “Greedy informed”, What is happening, Technical admissibility + consistency/reopening in graph search; answers/M02), R015 (Markov: conditional independence given the present; finite/irreducible/aperiodic chain converges to a unique stationary distribution; rows sum to 1; πP = π and Σπᵢ = 1 on separate lines; margin note, Setup, Step by step, What is happening, Technical, takeaways), R016 (“in two words” → “in two ideas”; “rigour” → “rigor” in the Figure 2.5 table, the Self-test prose and answers/M02; the demo item label is listed in SOURCE-CHANGES for the digital edition), R066 (no bias/embedding usage in Chapters 1–2; nothing to do).
- 2026-09-30 humanizing pass: report findings applied (M02 :21–:268, answers :33); "On screen … on paper" frames removed from Figures 2.4 and 2.5; "the digital version" → "the live demo"; the ✓/✗ verdict marks dropped and the figure's verdict lines quoted; Figure 2.5 hand-holding cut to the one-sentence test; "exactly", "That is why", "Notice", "Here is the lovely part", "just", "really", "we" removed; Figure 2.4 What is happening now says "the shares" (the EN figure has no bars); technical "What is happening?" trimmed where it repeated the Technical paragraphs (Figures 2.2, 2.4, 2.5). Source paragraph changes are listed in the SOURCE-CHANGES block above for the digital edition.
- 2026-10-01 verification round (R012): Figure 2.1 shows two labeled edge types ("instance of" individual → class, "subclass of" class → superclass) in Setup, both Step-by-step queries, Technical and What is happening; the figure generator draws the labels above the arrows and the digital chain shows the same labels.
-->

# Chapter 5
## Today’s AI
*From tokens to language models, attention to diffusion*

<!-- acc #7a3fb0 · tag Generative Era -->

### 5.1 The generative era: from recognizing to creating

Until now, machines stayed on the “recognizing” side: Is this spam, is this a cat, what is this house worth? Like a painter’s apprentice spending years just studying canvases. Then one day the apprentice picked up the brush: Machines began to create. They write, they paint, they generate code, they hold conversations.

One invention made all of it possible: the Transformer architecture and the idea of “attention” at its heart. The story starts with the smallest piece: how does a sentence look to a machine? The answer lies in small chunks of text called “tokens.” From there the chapter moves to embeddings, which turn meaning into numbers, to the attention mechanism, and to how a language model writes word by word. Then comes training, the diffusion models behind image generation, and finally the limits of these systems.

> **Margin note.** The answer to “why right now?” stands on three legs: plentiful data (the internet), powerful hardware (GPUs) and the right architecture (the Transformer). When the three came together, the generative era began.

#### Technical depth

Generative AI marks the shift from discriminative to generative modeling: instead of p(y|x), model the distribution that generates the data, p(x) or p(x|condition). The modern leap came largely from the Transformer architecture (Vaswani et al., 2017, “Attention Is All You Need”) and the accumulation of data and compute able to train it at scale.

This chapter builds the generative stack end to end: tokenization → embedding space → self-attention → autoregressive generation → the training pipeline (pretraining, fine-tuning, RLHF) → diffusion-based image generation → and the practical limits (hallucination, context window, cost). By the end, you will have an intuitive but accurate picture of why and how today’s LLMs and generative models work.

The stack starts with the smallest piece. You read a sentence letter by letter, word by word; what does the machine read?

### 5.2 How a machine sees words: tokens

A language model never sees letters or words “as they are.” It first breaks text into tiny Lego bricks called tokens. A token is sometimes a whole word, sometimes a broken piece of one, sometimes just a comma.

Why break things up? Think of a Lego box: a limited set of bricks builds endless things. Memorizing every word in the world is impossible; but with a limited kit of pieces, any word can be built. Pick an example below and watch the machine take a sentence apart.

> **Margin note.** The same text takes a different number of tokens in different languages. So asking an LLM something in Turkish can be more “expensive” than asking in English.

**Figure 5.1 · Split a sentence into tokens**
![Figure 5.1](../../figures/out/en/figure-5-1-token.svg)

*Setup.* The figure shows three example sentences and, under each, the same sentence taken apart into tokens. Every token sits in its own box. A plain box is a stand-alone piece; a shaded box is a continuation piece and starts with “##.” Two counts appear under each sentence: the number of tokens and the number of words. The splitter behind the figure follows one simple rule, given below.

*Step by step.* The splitter’s rule fits in three lines. A word of six letters or fewer stays a single token. A longer word is cut into four-character pieces; the first piece is written plain, the rest with “##.” A comma, a period or an exclamation mark is always a token of its own. Apply the rule to the three sentences:

| Sentence | Tokens | Words | Tokens |
|---|---|---|---|
| Hello world, today is 2026. | Hello · world · , · today · is · 2026 · . | 5 | 7 |
| Artificial intelligence splits text into tokens. | Arti · ##fici · ##al · inte · ##llig · ##ence · splits · text · into · tokens · . | 6 | 11 |
| Tokenization is surprisingly important! | Toke · ##niza · ##tion · is · surp · ##risi · ##ngly · impo · ##rtan · ##t · ! | 4 | 11 |

In the first sentence every word is short: Hello, world and today have five letters each, so all of them stay whole. “2026” is a number, but to the splitter it is an ordinary four-character word. The comma after “world” and the final period each get a box of their own. Five words become seven tokens. In the second sentence “Artificial” has ten letters and breaks into three pieces, four, four and two. “intelligence” has twelve letters and breaks into three pieces of four. “splits” and “tokens” have six letters each; they sit on the limit and stay whole.

The third sentence is the striking one: four words, eleven tokens. “Tokenization” and the adverb after “is” have twelve letters each and take three pieces apiece (Toke · ##niza · ##tion; surp · ##risi · ##ngly). The word “important” has nine letters and ends in a one-letter tail (impo · ##rtan · ##t). Only “is” stays untouched.

Count tokens per word and the three sentences come out at 1.4, 1.8 and 2.75. The second and third sentences both make 11 tokens, one from six words, the other from four. The count depends less on how many words there are than on how many of them are long and rare. Turkish suffixes make words longer, so the same text takes more tokens in Turkish than in English, and costs more.

*What is happening?* The model never sees a sentence whole; it first chops it into small pieces (tokens). Short words stay in one piece, long words split into chunks marked “##,” and punctuation counts separately. These pieces are the machine’s entire alphabet.

*Try it yourself.* 1) Split “Artificial intelligence learns.” with the same rule. How many tokens do you get? 2) How many pieces does the word “internationalization” break into? Write them out. 3) How many tokens per word does the third sentence carry? Compare it with the first sentence. Live demo: [QR 5.1]

#### Technical depth

Modern models use subword tokenization (e.g. BPE, WordPiece, SentencePiece): frequent sequences become single tokens, rare words split into several pieces. Vocabularies typically hold 30K–100K+ tokens; each maps to an integer ID.

Roughly, 1 token ≈ 0.75 words in English; agglutinative languages like Turkish can use more tokens per word. Model context and cost are measured in tokens: both the context window and pricing depend on token count. Figure 5.1 is a simplified subword splitter (long words break into pieces marked with “##”).

The rule of Figure 5.1 (at most 6 characters for a single token, then four-character pieces) is not a stand-in for a real BPE vocabulary. In a real vocabulary a frequent word like “Artificial” would be a single token, while “Tokenization” would split into two or three pieces according to the vocabulary’s frequency statistics. The rule is simple, but the result points the same way: rare and long words take more pieces.

Every token now carries an ID number, and an ID number says nothing about “cat” being close to “dog.” Where does meaning come from?

### 5.3 Turning meaning into numbers: embeddings

Tokens enter the machine as numbers, but a dry ID number carries no “meaning.” Enter the embedding: Every word is given an address in a vast city. That address is a list of numbers carrying the word’s meaning.

In this city, words with similar meanings move into the same neighborhood. “Cat” and “dog” are next-door neighbors; so are “king” and “queen.” Pick a word in Figure 5.2 and meet its neighbors.

> **Margin note.** Embeddings aren’t just for words: sentences, images and sounds can live in the same space. This is the foundation of multimodal models and semantic search.

**Figure 5.2 · The meaning map**
![Figure 5.2](../../figures/out/en/figure-5-2-embed.svg)

*Setup.* The figure places nine words on a two-dimensional map. Three dashed circles mark three families of meaning: animals (cat, dog, bird), royalty (king, queen, prince) and food (apple, bread, cheese). Each point carries its word; the coordinates are in the table below. Points that sit close together are close in meaning too. Distance is measured with a plain ruler.

*Step by step.* The positions on the map and the two nearest neighbors of every word:

| Word | Family | x | y | 2 nearest neighbors (distance) |
|---|---|---|---|---|
| cat | animal | 58 | 62 | dog (28.6), bird (30.6) |
| dog | animal | 84 | 50 | cat (28.6), bird (52.8) |
| bird | animal | 52 | 92 | cat (30.6), dog (52.8) |
| king | royalty | 198 | 54 | queen (28.8), prince (34.1) |
| queen | royalty | 222 | 70 | king (28.8), prince (31.6) |
| prince | royalty | 196 | 88 | queen (31.6), king (34.1) |
| apple | food | 128 | 132 | cheese (17.2), bread (26.8) |
| bread | food | 152 | 120 | apple (26.8), cheese (42.8) |
| cheese | food | 118 | 146 | apple (17.2), bread (42.8) |

The distance comes from Pythagoras: take the horizontal and vertical differences between two points, square them, add them, take the square root. For “cat” and “dog” the differences are 26 and 12; their squares are 676 and 144; the sum is 820; the square root is 28.6. Do this for all nine words and every word’s two nearest neighbors come from its own family, without exception. The figure’s own caption for “cat” reads: “The 2 nearest neighbors: dog (28.6), bird (30.6); both from the ‘animal’ family.”

Between families the distances grow. From “cat” to “apple” is 99 units; from “cat” to “queen” is 164. The map tells you who is a neighbor, who is a stranger, and by how much. There is a border zone as well: the third-nearest word to “prince” is “bread” (54.4), so the royalty district and the food district touch. What the machine calls “meaning” is nothing more than this geometry.

*What is happening?* Every word becomes a point on a map. Words close in meaning sit close on the map too; the 2 nearest points are the 2 most similar words. The machine learned this placement itself, by seeing which words appear in similar sentences.

*Try it yourself.* 1) Compute the distance between “bird” and “cheese.” Compare it with the largest within-family distance in the table. 2) Suppose you want to add the word “lion” to the map. Which region would you put it in? Propose a sensible x and y pair and find its two nearest neighbors. 3) Which word is third-nearest to “bread,” and from which family? What does that tell you about the map? Live demo: [QR 5.2]

#### Technical depth

An embedding maps a token to a dense vector (typically hundreds to thousands of dimensions). These vectors are learned in training; semantic and syntactic relations are reflected in the geometry. Similarity is usually measured with cosine similarity.

The famous example: with vector arithmetic, analogies like king − man + woman ≈ queen can emerge. The visualization in Figure 5.2 is a 2D reduction (PCA/t-SNE-like) of a high-dimensional space; real embeddings have far more dimensions.

The distance in Figure 5.2 is the Euclidean distance: d = √((x₁ − x₂)² + (y₁ − y₂)²). Real embeddings are more often compared with cosine similarity: cos θ = (a·b) / (‖a‖·‖b‖). This measure compares the direction of the vectors, not their length; a value near 1 means the same direction, 0 means perpendicular (unrelated), −1 means opposite directions.

Every word has an address. Inside a sentence, though, how does a word choose which neighbor to look at?

### 5.4 Attention: the heart of the Transformer

Read this sentence: “The cat ran away because it was scared.” Who is “it”? Without even noticing, you glanced back at “the cat.” The attention mechanism teaches a machine that very glance: Each word learns which other words to “look at” for its meaning.

Pick a word in Figure 5.3; see how much it “attends” to the others by the depth of the color. The darker the color, the stronger the tie.

> **Margin note.** “Attention Is All You Need” (2017): the attention mechanism removed the RNN’s one-at-a-time processing constraint. Looking at every word at once boosted both speed and understanding.

**Figure 5.3 · Which word looks at which?**
![Figure 5.3](../../figures/out/en/figure-5-3-attn.svg)

*Setup.* The figure lays the sentence out as a heat map of five units: “The cat,” “ran,” “because,” “it” and “was scared.” The figure joins “The” to “cat” and “was” to “scared,” and leaves out “away,” so five units stand for the sentence. Rows are the unit doing the looking (the query); columns are the unit being looked at. Each cell holds an attention weight, and the numbers in a row add up to 1.00. The darker the cell, the larger the weight. The darkest cell of every row is printed in bold.

*Step by step.* The weight table:

| Query ↓ · Attends to → | The cat | ran | because | it | was scared |
|---|---|---|---|---|---|
| The cat | **0.50** | 0.30 | 0.05 | 0.10 | 0.05 |
| ran | **0.50** | 0.30 | 0.10 | 0.05 | 0.05 |
| because | 0.20 | **0.40** | 0.20 | 0.10 | 0.10 |
| it | **0.55** | 0.10 | 0.05 | 0.20 | 0.10 |
| was scared | 0.30 | 0.10 | 0.05 | **0.40** | 0.15 |

Read the rows one at a time:

1. “The cat”: the highest weight is on itself (0.50). After itself, it looks most at “ran” (0.30); the subject is looking for its verb.
2. “ran”: half of the weight goes to “The cat.” The verb wants to know who ran.
3. “because”: it looks most at “ran” (0.40). The conjunction holds on to the event it explains.
4. “it”: the row the section is about. The darkest cell is 0.55, at “The cat”; the share it keeps for itself is only 0.20. The pronoun works out what it stands for by looking at the cat.
5. “was scared”: it looks most at “it” (0.40), with “The cat” in second place (0.30). The predicate finds its subject in two hops: first the pronoun, then the cat the pronoun points to.

Two more things. The table is not symmetric: “it” looks at the cat with 0.55, but “The cat” looks at “it” with only 0.10; looking runs one way. And distance does not matter: two units stand between “it” and “The cat,” yet the weight is the highest in the whole table. That is where the older models, which read one word after another, ran into trouble.

*What is happening?* To make sense of a sentence, each word decides which others it should “pay attention” to. The darker the color, the stronger the bond. That is how the model works out what a little word like “it” refers to.

*Try it yourself.* 1) Check the sum of every row; is each one 1.00? 2) If the sentence were “The cat ran because the dog was scared,” where would the darkest cell of the “was scared” row move? Write down why. 3) Why are the weights in the “because” column so low? What does that say about how much meaning a conjunction carries? Live demo: [QR 5.3]

#### Technical depth

Self-attention produces query (Q), key (K) and value (V) vectors for every token; weights are computed with softmax(Q·Kᵀ/√d), and the output is the weighted sum of the values. Every position can thus reach the whole sequence regardless of distance.

The Transformer does this with multiple heads: different “heads” capture different kinds of relation (syntax, coreference, and so on). Positional encoding adds order information. The cost is O(n²) in sequence length; that is the main reason context windows are limited.

Every row of Figure 5.3 is a softmax output: the weights lie between 0 and 1 and sum to 1. The output at the position of “it” is the weighted sum of the value vectors: 0.55·V(The cat) + 0.10·V(ran) + 0.05·V(because) + 0.20·V(it) + 0.10·V(was scared). The new representation of “it” is therefore a blend, more than half of which comes from “The cat.” The asymmetry of the table comes from the same place: each row is computed with its own query, and Q·Kᵀ is not a symmetric matrix.

Every word knows whom to look at. How does the next word, not yet written, grow out of these glances?

### 5.5 A language model: predict the next word

You know the game: someone says “The early bird catches the...” and you shout “worm!” Odd as it sounds, that is a language model’s only job: look at the text so far and guess the most likely next word (token). It adds the guess to the text and guesses again. Playing this tiny game thousands of times, it writes whole paragraphs.

Follow the steps of Figure 5.4: which words the model weighs at each step, with what probability, and how the sentence takes shape. Compare the two “creativity” (temperature) rows too: should it always pick the most likely word, or take a little risk?

> **Margin note.** “Does it understand, or does it just predict?” In a way, both: it couldn’t predict this coherently without capturing some meaning. But at its core, all it does is guess the next token.

**Figure 5.4 · Generate word by word**
![Figure 5.4](../../figures/out/en/figure-5-4-generate.svg)

*Setup.* The figure is a film strip of three generation steps, laid out in two rows. The starting text is the single word “AI”. In each frame the model shows four candidate words and the probability it gives each one; the length of the bar is proportional to the probability. The top row of the strip is low creativity (temperature), the bottom row high creativity. The two rows build two different sentences from the same candidates.

*Step by step.* The candidate lists of the three steps:

| Step | Candidates and probabilities |
|---|---|
| 1 | now 42% · already 28% · today 18% · rapidly 12% |
| 2 | learns 38% · writes 30% · creates 20% · reasons 12% |
| 3 | fast 50% · well 25% · daily 15% · deeply 10% |

At low creativity the model takes the most likely candidate at every step:

1. “now” (42%) → “AI now”
2. “learns” (38%) → “AI now learns”
3. “fast” (50%) → “AI now learns fast.”

At high creativity the figure takes the second candidate at every step, to keep the illustration simple:

1. “already” (28%) → “AI already”
2. “writes” (30%) → “AI already writes”
3. “well” (25%) → “AI already writes well.”

Both sentences are grammatical; the second takes a less expected road. A real model with sampling on rolls dice: with these probabilities it picks the 42-percent candidate in about 42 of a hundred tries and the 12-percent candidate in about 12. The higher the temperature, the more evenly the dice are weighted. From the same start a different sentence can come out every time. At low temperature there are no dice; the result is the same every time.

The probabilities at each step are spread over four candidates and add up to a hundred percent. In reality the model spreads this distribution over tens of thousands of tokens; the four candidates are only the top of the list. And each choice changes the next step’s question. After “now,” “learns” is likely; after “already” it is likely too. But in a real model the list of step 2 is recomputed according to the choice made in step 1.

*What is happening?* At each step the model asks “what is the most likely word after the text so far?” It picks one, adds it to the sentence and starts over. Creativity off: always the top word. Creativity on: sometimes a less likely one; that is where surprise comes from.

*Try it yourself.* 1) What would the sentence be if the model took the third candidate at every step? 2) Multiply the probabilities of the low-creativity sentence: 0.42 × 0.38 × 0.50. Do the same for the high-creativity sentence; which one is more likely, and by how many times? 3) In which of the three steps is the model least sure? Look at the share of the top candidate. Live demo: [QR 5.4]

#### Technical depth

LLMs are autoregressive: they produce the distribution P(tokenₜ | token₁…tokenₜ₋₁), convert it to probabilities with softmax, pick a token and append it. Greedy (argmax) picks the most likely; sampling draws from the distribution.

Temperature sharpens or flattens the distribution: low temperature gives steadier, more repetitive output; high temperature gives more varied, riskier output (together with top-k / top-p). The probabilities in Figure 5.4 are illustrative; a real model produces a distribution over its whole vocabulary.

The temperature T divides the model’s scores before the softmax: pᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T). As T shrinks, the distribution collapses onto a single candidate and the choice approaches argmax; as T grows, the distribution flattens, and even the 12-percent “rapidly” gains a reasonable chance. The “take the second candidate” behavior of Figure 5.4 is a convenience of the illustration; real sampling draws at random from this distribution. The probability of a sentence is the product of its steps: P(now, learns, fast) = 0.42 × 0.38 × 0.50 ≈ 0.08.

The model knows how to spread probability at every step. Where did it learn these probabilities? It went through three stages of training.

### 5.6 How a model is raised: the training pipeline

A chat assistant grows up like a child; it passes through three schools. First comes “pretraining” on massive text: there it learns language and the world. Then, at the “fine-tuning” school, it learns to answer questions and follow instructions. Last comes “alignment with human feedback”: there it learns to be helpful, honest and safe; its manners, you could say.

Read the three stages of Figure 5.5 one by one and see how the model answers the same question differently after each.

> **Margin note.** Pretraining gives the model “what it knows”; fine-tuning and RLHF give it “how to behave.” The same fact can be delivered in very different tones.

**Figure 5.5 · An assistant in three stages**
![Figure 5.5](../../figures/out/en/figure-5-5-train.svg)

*Setup.* The figure is a table with three columns; each column is one training stage. Every stage has four rows: the data the model sees, what it learns, its sample answer to the same question about a capital city, and a short note. The question is the same in all three columns, “capital of Türkiye?”; only the shape of the answer changes.

*Step by step.* Put the three stages side by side:

| | 1 · Pretraining | 2 · Fine-tuning | 3 · RLHF / alignment |
|---|---|---|---|
| Data | Massive internet text | Instruction–response pairs | Human preferences (a reward model) |
| What it learns | Language and the world (next-word prediction) | Following instructions (answering the question) | Being helpful, honest and safe |
| Sample output | “The capital of Türkiye is Ankara, with a population of about six million. The city...” | “The capital of Türkiye is Ankara.” | “The capital of Türkiye is Ankara. If you’d like, I can also share a few interesting facts about the city.” |
| Note | The raw model is a “completer”: it doesn’t answer the question, it continues the text. | Now it answers directly and concisely. | Same fact; a more helpful, polite, aligned tone. |

1. Pretraining: the answer starts with the right fact but does not stop. It adds the population and goes on with “The city...” The model does not know it has been asked a question; it writes as if continuing an encyclopedia page from the internet. The knowledge is there; the manners are not.
2. Fine-tuning: the same fact, one sentence. The model has now learned the pattern “a question came, answer it, stop” from thousands of instruction–response pairs.
3. RLHF / alignment: the same answer again, with an offer on top: would you like more? People were shown two answers and asked “which is better?”; the model was adjusted toward the preferred tone.

Only one thing stays the same across the three columns: the fact, Ankara. What changes is how the fact is delivered. The order matters too: each stage needs the one before it, knowledge first, then behavior.

*What is happening?* An assistant grows up in three stages. First, in “pretraining,” it learns language and the world from massive text. Then in “fine-tuning” it learns from example Q&A pairs how to answer. Finally, with human feedback, it learns to be helpful and polite. Same fact, three very different manners.

*Try it yourself.* 1) If the question were “At what temperature does water boil?”, predict the stage-one model’s output; then write the stage-two output. 2) In the third stage, people are shown two answers, one “wrong but polite” and one “right but rude.” Which should be preferred? How do the three goals of alignment (helpful, honest, safe) decide? 3) Which row of the table shows the split between “what it knows” and “how to behave” most clearly? Live demo: [QR 5.5]

#### Technical depth

1) Pretraining: on a large corpus, the model learns the statistics of language through a self-supervised next-token objective. 2) Supervised fine-tuning (SFT): it learns instruction-following from instruction–response pairs. 3) RLHF/preference alignment: a reward model is trained on human preferences and the policy (e.g. PPO or DPO) is updated against that signal.

The result: a shift from a raw “text completer” to a helpful, honest and reasonably safe assistant. Alignment isn’t perfect; open problems like jailbreaks, reward hacking and distribution shift remain.

The three stages have different objectives. In pretraining the loss rests on the probability of the next token: L = −Σₜ log P(tokenₜ | token₁…tokenₜ₋₁). The first column of Figure 5.5 is the natural output of this objective; continuing the text is the behavior that lowers this loss. SFT applies the same loss, but only on the response part and only on selected pairs. In the alignment stage the objective is a reward signal. The reward model estimates which of two answers is preferred, and the policy is updated in the direction that raises that estimate.

Text models are raised that way. Image models start somewhere else entirely: pure noise.

### 5.7 Making images: diffusion

Image-making models rest on a different idea altogether: diffusion. Picture a fogged-up window; the scene behind it is a blur. Now wipe the glass slowly: the picture emerges stroke by stroke. A diffusion model learns that wiping; only it starts from a screen of pure static (noise) and cleans a little at each step until an image appears.

Follow the frames of Figure 5.6 from left to right: the further right you go, the more noise the model clears, and the image slowly appears.

> **Margin note.** Diffusion removes noise a little at a time, step by step, until the shape emerges. It also trains more stably than GANs.

**Figure 5.6 · From noise to image**
![Figure 5.6](../../figures/out/en/figure-5-6-diffuse.svg)

*Setup.* The figure is a film strip of nine frames. Each frame is a tiny canvas of 8 × 8, that is, 64 pixels. The first frame on the left is pure noise: dark and light gray pixels scattered at random. The last frame on the right holds a heart of 40 orange pixels (purple on screen); the other 24 pixels are light. In the seven frames between, the model resolves a few more pixels at every step. Under each frame the cleaned share is printed as a percentage.

*Step by step.* Each frame is one step:

| Step | Cleaned share | Resolved pixels (of 64) | Visible heart pixels | What the frame shows |
|---|---|---|---|---|
| 0 | 0% | 0 | 0 | Noise only; a screen full of static |
| 1 | 13% | 6 | 4 | A few orange dots, no shape yet |
| 2 | 25% | 12 | 9 | Scattered dots |
| 3 | 38% | 21 | 12 | The body starts to show |
| 4 | 50% | 29 | 17 | The heart can be guessed |
| 5 | 63% | 40 | 24 | The shape is certain, the edges rough |
| 6 | 75% | 46 | 29 | A few specks of noise |
| 7 | 88% | 55 | 36 | The last specks |
| 8 | 100% | 64 | 40 | A clean heart: 40 orange, 24 light pixels |

The resolved-pixel count does not grow evenly: 6, 12, 21, 29, 40... The illustration decides which pixel opens at which step with a fixed random seed, so the strip is the same every time, but the steps are not equal. And the shape is recognizable halfway through. At step 4, the midpoint of the strip, 29 of the 64 pixels are resolved, 17 of them heart pixels. The heart is already unmistakable; the remaining steps fill in the detail.

One warning: a real diffusion model does not “open” pixels. At every step it reduces the noise a little across the whole image; all the pixels sharpen at the same time, slowly. The number of steps is not 8 either, but dozens or hundreds. This strip is simplified to carry the idea: the noise shrinks, the shape emerges.

*What is happening?* Diffusion is like cleaning up a snowy TV screen (pure noise) step by step until a picture emerges from inside it. The model learned one skill: “estimate the noise in this image and remove a little of it.” Done over and over, noise turns into a picture.

*Try it yourself.* 1) In the last frame 40 of the 64 pixels are orange. If 29 pixels are resolved at step 4 and pixels open at random, about how many of them would you expect to be orange? 2) If there were 16 steps instead of 8, what share would be cleaned at each step? 3) In which direction of the strip is the “forward process” described in Technical depth read, and in which direction the “reverse process”? Live demo: [QR 5.6]

#### Technical depth

Diffusion has two processes. The forward process gradually adds Gaussian noise to an image (fixed, not learned). The reverse process is a neural network that estimates and removes the noise added at each step (denoising); this walks from noise back to the data distribution.

In text-to-image generation, the process is conditioned on a text embedding (usually CLIP-like) and, for speed, run in latent space (latent diffusion). Figure 5.6 is a qualitative illustration; real models use a learned noise-prediction network.

In the forward process the image at step t is corrupted as xₜ = √(1 − βₜ)·xₜ₋₁ + √βₜ·ε, where ε is standard Gaussian noise and βₜ a small noise share. Given xₜ and t, the network learns to estimate the added ε; the training loss is the squared difference between the estimate and the true noise: ‖ε − ε_θ(xₜ, t)‖². Generation runs the other way: start from pure noise x_T, subtract the estimated noise at every step, arrive at x₀. The “resolved pixels” counter of Figure 5.6 is a coarse stand-in for this estimate.

Text and images can both be generated. Now for the limits: where do these models go wrong, and where do they get stuck?

### 5.8 Limits: hallucination, context and cost

These models impress, but they aren’t magic. Their most famous flaw is hallucination: without missing a beat, the model can tell you something that sounds right and is flat wrong. Its job, after all, isn’t knowing the truth but producing a “plausible continuation.” The other limit is the context window: the model carries a small notebook and can hold only so many tokens at once. When the notebook fills, the oldest lines are erased.

Try the context window yourself below: as you add words the window fills, and the oldest words beyond the limit are “forgotten.”

> **Margin note.** The golden rule: treat an LLM not as an “all-knowing oracle” but as a “very fluent intern who is sometimes wrong.” Always verify the facts that matter.

**Figure 5.7 · The context window**
![Figure 5.7](../../figures/out/en/figure-5-7-ctx.svg)

*Setup.* The figure shows a twelve-word sentence passing through an eight-word window. The sentence: “Language models hold text inside a limited window and forget older words.” The window holds at most 8 words. The seven frames of the strip are the sentence at 0, 1, 4, 8, 9, 10 and 12 words. The orange line marks the window the model sees: the last eight words. Words with a dark border are inside the window; faded words have fallen out of it, that is, been forgotten.

*Step by step.* The words arrive one at a time:

| Word added | In the window | Forgotten |
|---|---|---|
| 0 | (empty) | |
| 1 | Language | |
| 4 | Language models hold text | |
| 8 | Language models hold text inside a limited window | (the window has just filled) |
| 9 | models hold text inside a limited window and | Language |
| 10 | hold text inside a limited window and forget | Language models |
| 12 | inside a limited window and forget older words | Language models hold text |

1. From zero to eight: the window starts empty and holds at most 8 words. Every new word finds a place; at the eighth word all 8 are inside the window. Everything is remembered until it fills.
2. The ninth word: the window is full; when “and” comes in, “Language” drops out and fades. The figure’s caption marks the moment: “The window is full!” From here on the model sees only the last 8 words.
3. The twelfth word: the first four words are gone. The text the model sees is “inside a limited window and forget older words.” The subject of the sentence, “Language models,” is no longer in the window. The model does not know what it has forgotten.

The real scale is much larger: this window holds 8 words; real models hold thousands of tokens, some of them hundreds of thousands. The idea is the same. There is a limit, and when it fills, something falls out. So an assistant “forgets” what it said at the start of a long conversation. This also connects to hallucination: in place of the information that fell out of the window, the model produces a “plausible continuation.” The gap gets filled, but not necessarily with the truth.

*What is happening?* The model has a “short-term memory” and can hold only so many words at once. As you add words the window fills; once it is full, the oldest slip out one by one and the model no longer sees them. This is why long documents get trimmed or summarized.

*Try it yourself.* 1) If the window held 5 words instead of 8, how many words would be forgotten when the twelfth word is added? Write down the words that remain. 2) How many tokens does this twelve-word sentence make with the splitter of Figure 5.1? If the window counted tokens instead of words, at which word would it fill? 3) Suppose you wanted to give a twenty-page document to a model with this window. Which of the two fixes in the section, truncating or summarizing, would you choose, and why? Live demo: [QR 5.7]

#### Technical depth

Hallucination is a natural consequence of probabilistic generation; there is no guarantee of truth. Mitigations: source-grounded generation (RAG), tool use and verification, and better alignment (Chapter 6). The context window is a fixed token limit; since attention costs O(n²), growing the window is expensive.

Other limits: the knowledge cutoff, bias (inherited from training data), instability/non-reproducibility (sampling), and compute/energy cost. Knowing these limits is the precondition for using these tools responsibly and effectively.

The context window is a fixed token limit; the model “remembers” only the last N tokens, and once the window fills the oldest fall out. Because attention costs O(n²), enlarging the window is expensive; that is why long documents get truncated or summarized.

The window of Figure 5.7 is a sliding queue: after n words have been added, the number forgotten is max(0, n − N), with N = 8. In real models the unit is not the word but the token. With the rule of Figure 5.1 the same sentence makes 15 tokens, so a token window fills one word earlier and starts forgetting two words earlier than a word window. The O(n²) cost comes from here: the heat map of Figure 5.3 has n × n cells for n tokens. When the window grows from 8 to 16, the cell count grows from 64 to 256, four times as many.

The chapter’s stack is complete: token, embedding, attention, generation, training, diffusion and limits. Eight questions follow.

### 5.9 Test yourself

*Answers are at the back of the book.*

1. What is a token?
   a) A kind of neural network
   b) A model weight
   c) A GPU core
   d) A small piece of text the model processes

2. What is true of the embedding space?
   a) Semantically similar words land near each other
   b) Every word is at the same point
   c) Words are placed randomly
   d) Only numbers are stored, no meaning

3. What does the attention mechanism provide?
   a) Each word “looking at” the others with weights
   b) Enlarging images
   c) Deleting data
   d) Slowing the model

4. What does an LLM fundamentally do?
   a) Applies hand-written rules
   b) Queries a database
   c) Predicts the next token
   d) Searches the internet

5. The correct order of the training pipeline?
   a) Pretraining → fine-tuning → RLHF
   b) RLHF → pretraining → fine-tuning
   c) Pretraining only
   d) Fine-tuning → pretraining → RLHF

6. How does a diffusion model create an image?
   a) Downloading it from the internet
   b) Copying it in one shot
   c) Leaving pixels random
   d) Starting from noise and cleaning it step by step

7. What is hallucination?
   a) Running faster
   b) The model producing confident but wrong information
   c) The model crashing
   d) Generating an image

8. What does the context window limit?
   a) Screen resolution
   b) How many tokens the model attends to at once
   c) Internet speed
   d) Disk size

### What to keep from this chapter

- A language model reads text as small pieces called tokens, not as letters or words; long and rare words take more tokens.
- An embedding turns every token into an address on a map; words close in meaning sit side by side on that map.
- With attention, every word spreads weights over the others in the sentence; that is how the pronoun “it” learns to look at the cat.
- A language model predicts the next token at every step; temperature decides whether it always takes the most likely one or sometimes a less likely one.
- An assistant is raised in three stages: pretraining gives the knowledge, fine-tuning the instruction-following, alignment the helpful and safe tone.
- A diffusion model starts from pure noise and brings the image out by cleaning a little at every step.
- Hallucination and the context window are structural limits of these models; always verify the facts that matter.

<!-- SOURCE-CHANGES
One invention made all of it possible: the Transformer architecture and the idea of “attention” at its heart. The story starts with the smallest piece: how does a sentence look to a machine? The answer lies in small chunks of text called “tokens.” From there we move to embeddings, which turn meaning into numbers, to the attention mechanism, and to how a language model writes word by word. We will see how the model is trained, visit the diffusion models behind image generation, and end with these systems’ limits. ||| One invention made all of it possible: the Transformer architecture and the idea of “attention” at its heart. The story starts with the smallest piece: how does a sentence look to a machine? The answer lies in small chunks of text called “tokens.” From there the chapter moves to embeddings, which turn meaning into numbers, to the attention mechanism, and to how a language model writes word by word. Then comes training, the diffusion models behind image generation, and finally the limits of these systems.
The same text takes a different number of tokens in different languages. That is why asking an LLM something in Turkish can be more “expensive” than asking in English. ||| The same text takes a different number of tokens in different languages. So asking an LLM something in Turkish can be more “expensive” than asking in English.
The beauty of this city: Words with similar meanings move into the same neighborhood. “Cat” and “dog” are next-door neighbors; so are “king” and “queen.” Pick a word in Figure 5.2 and meet its neighbors. ||| In this city, words with similar meanings move into the same neighborhood. “Cat” and “dog” are next-door neighbors; so are “king” and “queen.” Pick a word in Figure 5.2 and meet its neighbors.
To make sense of a sentence, each word decides which others it should “pay attention” to. The darker the color, the stronger the bond. That is how the model works out what a little word like “it” actually refers to. ||| To make sense of a sentence, each word decides which others it should “pay attention” to. The darker the color, the stronger the bond. That is how the model works out what a little word like “it” refers to.
Follow the steps of Figure 5.4; watch which words the model weighs at each step, with what probability, and how the sentence takes shape. Try the “creativity” (temperature) rows too: should it always pick the most likely word, or take a little risk? ||| Follow the steps of Figure 5.4: which words the model weighs at each step, with what probability, and how the sentence takes shape. Compare the two “creativity” (temperature) rows too: should it always pick the most likely word, or take a little risk?
An assistant grows up in three stages. First, in “pretraining,” it learns language and the world from massive text. Then in “fine-tuning” it learns from example Q&A pairs how to actually answer. Finally, with human feedback, it learns to be helpful and polite. Same fact, three very different manners. ||| An assistant grows up in three stages. First, in “pretraining,” it learns language and the world from massive text. Then in “fine-tuning” it learns from example Q&A pairs how to answer. Finally, with human feedback, it learns to be helpful and polite. Same fact, three very different manners.
Image-making models rest on a different idea altogether: diffusion. Picture a fogged-up window; the scene behind it is a blur. Now wipe the glass slowly: the picture emerges stroke by stroke. A diffusion model learns exactly that wiping; only it starts from a screen of pure static (noise) and cleans a little at each step until an image appears. ||| Image-making models rest on a different idea altogether: diffusion. Picture a fogged-up window; the scene behind it is a blur. Now wipe the glass slowly: the picture emerges stroke by stroke. A diffusion model learns that wiping; only it starts from a screen of pure static (noise) and cleans a little at each step until an image appears.
Diffusion works like a sculptor: it faces a block of marble (noise) and chips away the excess, step by step, until the shape emerges. It also trains more stably than GANs. ||| Diffusion removes noise a little at a time, step by step, until the shape emerges. It also trains more stably than GANs.
These models impress, but they aren’t magic. Their most famous flaw is hallucination: without missing a beat, the model can tell you something that sounds right and is simply wrong. Its job, after all, isn’t knowing the truth but producing a “plausible continuation.” The other limit is the context window: the model carries a small notebook and can hold only so many tokens at once. When the notebook fills, the oldest lines are erased. ||| These models impress, but they aren’t magic. Their most famous flaw is hallucination: without missing a beat, the model can tell you something that sounds right and is flat wrong. Its job, after all, isn’t knowing the truth but producing a “plausible continuation.” The other limit is the context window: the model carries a small notebook and can hold only so many tokens at once. When the notebook fills, the oldest lines are erased.
Try the context window yourself below: as you add words the window fills, and the oldest words beyond the limit are “forgotten.” This is exactly why long documents get truncated or summarized. ||| Try the context window yourself below: as you add words the window fills, and the oldest words beyond the limit are “forgotten.”
-->

<!-- EDITORIAL NOTES
- 5.3 Simple: "Tap a word below and meet its neighbors." → "Pick a word in Figure 5.2 and meet its neighbors."
- 5.4 Simple: "Tap a word; see how much it “attends” to the others…" → "Pick a word in Figure 5.3; see how much it “attends” to the others…"
- 5.5 Simple: "Press “Generate”; watch which words…" → "Follow the steps of Figure 5.4: which words…"; "Try the “creativity” (temperature) switch too" → "Compare the two “creativity” (temperature) rows too" (2026-09-30: "watch" and "Try" removed).
- 5.6 Simple: "Tap the three stages one by one and see…" → "Read the three stages of Figure 5.5 one by one and see…"
- 5.7 Simple: "Drag the slider: the further right you go…" → "Follow the frames of Figure 5.6 from left to right: the further right you go…" (the guide's own example pattern).
- Left as is (the Figure block answers them on paper): 5.2 Simple "Pick an example below and watch the machine take a sentence apart."; 5.8 Simple "Try the context window yourself below…" (its second sentence, "This is exactly why long documents get truncated or summarized.", cut 2026-09-30; the line stays in the What is happening? and the Technical depth).
- Technical paragraphs (following the TR author decision of 2026-09-10 on "demo" words; the figure now sits above the box): 5.2 "The demo below is a simplified subword splitter" → "Figure 5.1 is a simplified subword splitter"; 5.3 "The visualization below is a 2D reduction" → "The visualization in Figure 5.2 is a 2D reduction"; 5.5 "The probabilities below are illustrative" → "The probabilities in Figure 5.4 are illustrative"; 5.7 "The demo below is a qualitative illustration" → "Figure 5.6 is a qualitative illustration". Author to confirm.
- What is happening? paragraphs (Simple and Technical) are verbatim; none needed adapting in EN.
- Figure 5.1: the third demo sentence ("Tokenization is surprisingly important!") contains a banned word. It is demo data and is kept verbatim, as the TR edition decided for "şaşırtıcı"; check_style_en.py therefore reports exactly one issue on that table line. Resolution belongs to the author: whitelist demo data in the checker or change the demo sentence in the source.
- Figure 5.3: the demo folds "The cat" and "was scared" into single units and drops "away" (figure strings: attn.tokens); the Simple paragraph's sentence keeps "ran away". The Setup explains the five units instead of hiding the gap.
- Figure 5.4: the start text "AI" comes from the figure strings (generate.prefix); "second candidate" at high creativity is the demo's own convention.
- Figure 5.5: the question label ("capital of Türkiye?") is shown in the EN figure's output row, so the Setup names it. The 🙂 emoji in the stage-3 output is demo data; the figure removes it for duotone print (KEEP_EMOJI). Removed from the print table (2026-09-30).
- Figure 5.6: the frame captions are not quoted in the print text (paragraph dropped 2026-09-30); their content is carried by the table's last column. Heart color: orange in print, "purple on screen" as the figure legend says. Step percentages and resolved/heart pixel counts are from the EN figure table (same seed as TR).
- Figure 5.7: only one caption is quoted in the print text ("The window is full!"); the other fragments ("8 words added", "The first 1 word(s) are now “forgotten”", "Feed it with “Add word”") are paraphrased or dropped (2026-09-30).
- Numbers recomputed for EN data (differ from TR): Figure 5.1 word/token counts (5/7, 6/11, 4/11) and tokens per word (1.4, 1.8, 2.75); Technical depth 5.8 and answers 5.7 Q2: the EN sentence makes 15 tokens with the Figure 5.1 rule (TR: 19), so a token window fills one word earlier (at "limited", 7th word) rather than "more than twice as fast". check_consistency_en.py will list these as TR/EN number differences by design. Figure 5.6 also carries the "Visible heart pixels" column (4, 9, 12, 17, 24, 29, 36, 40) from the EN figure table, which the TR table omits.
- Answers file: 5.1 Q1–Q3 and 5.7 Q2 recomputed from the EN figure tables; 5.2, 5.3, 5.4, 5.5, 5.6 use the same numbers as TR with EN words.
- Number style: percentages with % in tables and candidate lists, "42 percent" in prose; decimal point; en dashes in verbatim source terms ("instruction–response", "30K–100K+") untouched.
- Quiz option order is the export's shuffled order, kept exactly; "5.9 Kendini test et" in the draft rendered as "Test yourself".
- Margin notes moved after the Simple paragraphs and before the Figure block, as in M01 and the Turkish edition.
- 2026-09-30 humanizing pass (print/kitap/humanize-en-report.md, M05 findings and the "counts only" patterns): "exactly", "That is why / This is exactly why" closers ("long documents get truncated" now twice: What is happening? 5.8 and Technical depth 5.8), signposts ("Look at one more thing", "Two things stand out. First… Second…", "Here is the link"), pre-quiz and section bridges, margin-note back-references (5.2, 5.6 ×2), unquoted UI captions (5.3, 5.4, 5.6, 5.7), "the digital edition", "honest warning", mirror sentences, the sculptor metaphor in the 5.7 margin note. Source paragraphs changed are listed in SOURCE-CHANGES above. Print only, not a source change: the technical "What is happening?" paragraphs of 5.2, 5.3, 5.4, 5.5, 5.6 and 5.7 were cut from the Technical depth boxes because they repeat the Technical paragraphs above them word for word; 5.8's is kept (the Figure 5.7 paragraph builds on it). Figure blocks, tables, numbers, quiz order and takeaway count unchanged.
-->

# Chapter 4
## The Artificial Brain
*From neuron to network*

<!-- acc #3155c4 · tag Deep Learning -->

### 4.1 The artificial brain: deep learning

Billions of tiny messengers live inside your head: neurons. Each listens to its neighbors’ whispers; when the whispers grow loud enough, it shouts and passes the news along. Researchers looked at this simple game and wondered: What if we built a rough mathematical imitation of it?

Artificial neural networks were born from that question. Stack “artificial neurons” into layers and out comes a powerful learning machine. As the layers multiply, the name changes too: deep learning. This chapter sits beside a single messenger first, then moves to a whole network, and on to the special networks that handle images and sequences.

> **Margin note.** An “artificial neuron” is not a real copy of the brain; it is a very crude mathematical analogy. A single neuron does little; the patterns formed by millions of them together are what count.

#### Technical depth

Artificial neural networks are only loosely inspired by biological neurons; at heart they are stacks of nonlinear transformations arranged in layers. Each artificial neuron adds a bias to a weighted sum of its inputs and passes the result through an activation function.

Deep learning is the stacking of many hidden layers; this depth lets the network learn increasingly abstract representations from raw data (edge → shape → object). Without activation functions, stacked linear layers collapse into a single linear function; nonlinearity is what makes depth meaningful. The field entered its modern era with AlexNet’s leap on ImageNet in 2012.

The smallest piece of this whole structure is a single artificial neuron. What does it compute on its own, and how does it turn three numbers into a decision?

### 4.2 A single artificial neuron

Think of the artificial neuron as a gatekeeper. A few messages arrive at its door; the keeper gives each a level of importance (called a weight), adds them up, then adds its own temperament on top (the bias). If the total clears a threshold, it rings the bell; that decision is what “activation” means.

In Figure 4.1 the inputs are strengthened and weakened in turn. Follow how the total changes and when the keeper rings the bell; that moment is the neuron “firing.”

> **Margin note.** All a neuron does is “weigh the inputs, sum them, pass them through a threshold.” Repeated millions of times, an operation this simple can recognize faces and write text.

**Figure 4.1 · Run the neuron**
![Figure 4.1](../../figures/out/en/figure-4-1-neuron.svg)

*Setup.* The figure shows three inputs: x₁, x₂ and x₃. Each carries a value between 0 and 1; at the start, 0.60, 0.30 and 0.80. Next to each input sits a fixed weight: w = [0.7, −0.5, 0.9]. The box in the middle adds them up and adds the bias b = −0.3 on top. The box on the right applies the activation, sigmoid or ReLU. When the total clears the threshold, the panel on the right reads “The neuron fired!”; in the table you change the inputs yourself.

*Step by step.* Work through the keeper’s arithmetic with the opening values.

1. Multiply each input by its weight: 0.7 × 0.60 = 0.42; −0.5 × 0.30 = −0.15; 0.9 × 0.80 = 0.72.
2. Add the three: 0.42 − 0.15 + 0.72 = 0.99. Add the bias: 0.99 − 0.3 = 0.69. The line “Weighted sum = 0.69” in the figure is this number.
3. With sigmoid selected, the output is 1 / (1 + e⁻⁰·⁶⁹) = 0.666. That is above the 0.5 threshold, so the panel on the right says “The neuron fired!”
4. With ReLU, the output is max(0, 0.69) = 0.690. It is above zero, so the neuron fires again.
5. Raise x₂ to 1.00. Its weight is negative, so the sum drops: 0.42 − 0.50 + 0.72 − 0.3 = 0.34. Sigmoid gives 0.584; the neuron still fires, but more weakly.
6. Put x₂ back to 0.30 and set x₃ to zero. The sum becomes 0.42 − 0.15 + 0 − 0.3 = −0.03. Sigmoid gives 0.493, ReLU 0.000; in both cases the neuron stays silent.

| x₁ | x₂ | x₃ | Weighted sum | Sigmoid | ReLU | State |
|---|---|---|---|---|---|---|
| 0.60 | 0.30 | 0.80 | 0.69 | 0.666 | 0.690 | fires |
| 0.60 | 1.00 | 0.80 | 0.34 | 0.584 | 0.340 | fires |
| 0.60 | 0.30 | 0.00 | −0.03 | 0.493 | 0.000 | silent |
| 0.00 | 0.00 | 0.00 | −0.30 | 0.426 | 0.000 | silent |

In the last row every input is zero, and still the sum is −0.30. That is the bias at work: by temperament, the keeper starts out closed. x₂ always pulls the sum down; x₁ and x₃ push it up, and x₃ pushes hardest because its weight is largest.

*What is happening?* A neuron does something simple: it multiplies each input by an “importance weight,” adds them up, then adds a small threshold value (the bias). If the total is big enough, the neuron “fires,” giving a strong output. Change the inputs and the sum and the output change together.

*Try it yourself.* 1) Set all three inputs to 1.00. What are the weighted sum and the sigmoid output; does the neuron fire? 2) Only x₃ = 1.00, the others 0. Compute the sum and the ReLU output. 3) Only x₂ = 1.00, the others 0. Does the sigmoid output pass 0.5? Live demo: [QR 4.1]

#### Technical depth

An artificial neuron computes z = Σ wᵢxᵢ + b, then applies an activation function: a = φ(z). Common choices are sigmoid (0–1), tanh (−1–1) and ReLU = max(0, z). The weights tune each input’s importance and the bias tunes the threshold; both are learned in training.

The activation’s role is decisive: without added nonlinearity, the network, however many layers, would equal a single linear transformation. ReLU has become the de facto standard in deep networks thanks to its simplicity and its preservation of gradient flow.

The sigmoid in the figure is σ(z) = 1 / (1 + e⁻ᶻ); at z = 0 it gives 0.5, which is why the firing threshold in the figure is 0.5. For ReLU the threshold is z > 0.

A single neuron can draw only one line through the space of its inputs. When dozens are stacked in layers, how does the signal travel through them?

### 4.3 Layers and the forward pass

One gatekeeper alone can’t achieve much. But house the keepers on the floors of a building and everything changes. News flows from the ground floor to the top; the “hidden” floors in between refine the raw news a little more at every stop.

News flowing from entrance to exit is called the forward pass. Figure 4.2 shows two input patterns; follow the signal as it climbs floor by floor and see which neurons light up.

> **Margin note.** The secret of depth: early layers learn simple features (edges), later layers learn their combinations (shapes, objects). No one programs this by hand; the network discovers it itself.

**Figure 4.2 · A live neural network (forward pass)**
![Figure 4.2](../../figures/out/en/figure-4-2-ffnet.svg)

*Setup.* The figure has two panels, each with three layers. On the left of a panel are three input boxes, each on (1) or off (0). In the middle sit four hidden neurons, H1 to H4; on the right, two output neurons, O1 and O2. Every connection has a fixed weight; the values appear in the calculation. There is no bias. Each neuron sums the incoming signals by their weights and passes the total through a sigmoid. The darker a neuron, the higher its activation. The left panel shows the opening state: x₁ and x₃ on, x₂ off. In the right panel only x₂ is on.

*Step by step.* Compute the left panel, the input [1, 0, 1]. The input weights of the hidden neurons are, in order: H1 [0.6, −0.4, 0.8], H2 [0.5, 0.7, −0.3], H3 [−0.6, 0.5, 0.6], H4 [0.3, −0.7, 0.5].

1. H1: 0.6 × 1 + (−0.4) × 0 + 0.8 × 1 = 1.40; sigmoid 0.80. The brightest neuron in the layer.
2. H2: 0.5 + 0 − 0.3 = 0.20; sigmoid 0.55.
3. H3: −0.6 + 0 + 0.6 = 0.00; sigmoid 0.50. Even with a sum of zero, the neuron stays at half brightness.
4. H4: 0.3 + 0 + 0.5 = 0.80; sigmoid 0.69.
5. Output O1, weights [0.7, −0.5, 0.6, 0.4]: 0.7 × 0.80 − 0.5 × 0.55 + 0.6 × 0.50 + 0.4 × 0.69 = 0.86; sigmoid 0.70.
6. Output O2, weights [−0.4, 0.6, 0.5, −0.6]: −0.32 + 0.33 + 0.25 − 0.41 = −0.15; sigmoid 0.46.
7. O1 > O2. The network’s prediction is the first output; in the figure it is the darkest box.

In the right panel only x₂ is on. The same procedure gives this table:

| Input | H1 | H2 | H3 | H4 | O1 | O2 | Prediction |
|---|---|---|---|---|---|---|---|
| [1, 0, 1] | 0.80 | 0.55 | 0.50 | 0.69 | 0.70 | 0.46 | O1 |
| [0, 1, 0] | 0.40 | 0.67 | 0.62 | 0.33 | 0.61 | 0.59 | O1 |

When the input changes, the brightness pattern of the hidden layer flips: on the left H1 stands out, on the right H2 and H3 shine. The winner does not change, though; in the second case O1 leads by only 0.02. Nobody has trained these weights, so the network’s “opinion” is still arbitrary.

*What is happening?* The signal moves left to right, layer by layer: each neuron sums what reaches it and passes it on to the next layer. The brighter a neuron, the stronger its response. And the brightest box on the far right is the network’s final prediction.

*Try it yourself.* 1) With every input off ([0, 0, 0]), what value do the four hidden neurons take? Compute the outputs as well. 2) For the input [1, 1, 1], find H1’s sum and its sigmoid value. 3) Does O2 win for any of the eight possible input patterns? Guess first, then test two of them by calculation. Live demo: [QR 4.2]

#### Technical depth

In a feedforward network each layer takes the previous layer’s activations: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). The input layer carries the raw data, hidden layers carry intermediate representations, and the output layer carries the prediction. The weight matrices and bias vectors are the network’s learned parameters.

The network in Figure 4.2 performs a real forward pass: with fixed weights, the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is the network’s “prediction.” Training is the act of tuning these weights, and that comes next.

In the network of Figure 4.2, W⁽¹⁾ is 4 × 3 and W⁽²⁾ is 2 × 4; b⁽¹⁾ = b⁽²⁾ = 0. There are 12 + 8 = 20 learnable weights in all; φ is the sigmoid in both layers.

This network gives the same answer for all eight input patterns, because nobody has tuned its weights. Can the error itself be used to correct them?

### 4.4 Backpropagation: learning from error

The network starts out guessing at random; forgive its first-day clumsiness. So how does it become a master? First it compares its guess with the right answer and measures how wrong it was: the error. Then that error walks backward, from exit to entrance, telling every connection it passes: “adjust your small share of the blame.”

That backward walk is called backpropagation. Follow Figure 4.3 round by round: the error flows back and the output edges toward the right answer. As the error shrinks, the backward whisper fades too; soon there is hardly any blame left to hand out.

> **Margin note.** The forward pass means “make a guess”; backpropagation means “learn from the error.” Repeat those two steps millions of times and that is deep learning; there is nothing more to it.

**Figure 4.3 · Learn from error (animation)**
![Figure 4.3](../../figures/out/en/figure-4-3-backprop.svg)

*Setup.* The figure is laid out like a film strip; each frame is one training round. On the left of a frame is a small network with an arrow running back from output to input: the error flowing backward. In the middle, a vertical bar shows the network’s output, and the line above it marks the right answer, 80 percent. Under each frame is that round’s error. In round 0 the network has not been trained at all.

*Step by step.* Read the frames in order.

1. Round 0: error 0.43. The output bar stands at 37 percent, far below the target. The weights are random.
2. Round 1: the error has flowed backward and the connections have been corrected. The error falls to 0.26; the bar jumps to 54 percent. A 17-point leap in a single round.
3. Round 2: error 0.15, bar at 65 percent. The step has shrunk: 11 points.
4. Round 3: error 0.09, bar at 71 percent. The error is below 0.10 for the first time.
5. Round 4: error 0.06, bar at 74 percent.
6. Round 5: error 0.03, bar at 77 percent.
7. Rounds 6 and 7: error 0.02, then 0.01. The bar reads 78 and 79 percent; it is glued to the target line.
8. Round 8: error still 0.01, bar at 79 percent. There is almost no blame left to carry backward; the network counts as trained.

| Round | Error | Output | Distance to target |
|---|---|---|---|
| 0 | 0.43 | 37% | 43 points |
| 1 | 0.26 | 54% | 26 points |
| 2 | 0.15 | 65% | 15 points |
| 3 | 0.09 | 71% | 9 points |
| 4 | 0.06 | 74% | 6 points |
| 5 | 0.03 | 77% | 3 points |
| 6 | 0.02 | 78% | 2 points |
| 7 | 0.01 | 79% | 1 point |
| 8 | 0.01 | 79% | 1 point |

The rule is regular: each round removes 40 percent of the error and keeps 60. Big corrections at first, then finer and finer adjustments. This is an animation; in real training the curve does not descend this smoothly, and now and then it even rises. But the direction is the same: the error shrinks, and the guess closes in on the target.

*What is happening?* The network starts by guessing at random, so the error (loss) is high. Each round, it spreads the error backward from output to input and adjusts every connection slightly to reduce it. Bit by bit, the output closes in on the right answer.

*Try it yourself.* 1) If the rule kept going, what would the error be in round 9? Write it with two decimals. 2) From round 2 to round 3, how many points did the output bar rise? Roughly how many times smaller is that step than the one from round 0 to round 1? 3) If the target were 100 percent instead of 80, where would the bar start with the round 0 error of 0.43? Live demo: [QR 4.3]

#### Technical depth

Backpropagation efficiently computes the gradient of the loss with respect to every weight using the chain rule; gradients are carried backward layer by layer, from output to input. Gradient descent then updates the weights: W ← W − η·∂L/∂W.

This method (popularized by Rumelhart, Hinton and Williams in 1986) is the key to training deep networks. The animation in Figure 4.3 qualitatively shows the backward flow of error and the output converging to the target; real training repeats the same loop over millions of examples.

The error curve in the figure follows L(r) = 0.43 · 0.6ʳ, and the output is 0.80 − L(r), where r is the round number. This constant-ratio decay is close to the typical look of gradient descent with a well-chosen learning rate.

Backpropagation trains networks of every kind. Feeding the tens of thousands of pixels of a photo into a flat layer is wasteful, though; an image calls for a layout of its own.

### 4.5 Seeing images: convolutional networks (CNN)

An image holds tens of thousands of pixels; listening to each one separately would be madness. Convolutional neural networks (CNNs) are craftier: like sweeping a flashlight around a dark room, they glide a small “filter” across the image, hunting local patterns; an edge here, a corner there.

In Figure 4.4 the flashlight sweeps the image step by step. At every stop it examines a tiny region and marks its findings on a “feature map.” Swap the flashlight (the filter) and see which edges it catches this time.

> **Margin note.** The same small filter is used across the whole image (weight sharing). So it can spot an edge in the top-left and the bottom-right alike, and it learns with far fewer parameters.

**Figure 4.4 · Convolution: slide the filter**
![Figure 4.4](../../figures/out/en/figure-4-4-conv.svg)

*Setup.* On the left is a 7 × 7 image; dark cells hold 1, light cells 0. The image is a plus sign: the fourth row and the fourth column are dark throughout. In the middle is the 3 × 3 kernel, that is, the filter. The vertical edge kernel has [1, 0, −1] in each of its three rows. The horizontal edge kernel has [1, 1, 1] on top, zeros in the middle and [−1, −1, −1] at the bottom. On the right is the 5 × 5 feature map: 25 stops, left to right and top to bottom, one cell per stop. Plus means a change from dark to light, minus from light to dark; darkness shows the magnitude. Two stops of each kernel are picked out.

*Step by step.* Slide the vertical edge kernel along the first row, stop by stop.

1. Stop 1: rows 1 to 3, columns 1 to 3. All zeros; the sum is 0.
2. Stop 2: columns 2 to 4. Its right column (column 4 of the image) is 1 in all three rows. Three rows of 1×0 + 0×0 + (−1)×1 give −3. Cell 2 of the map: a minus at full darkness; the figure picks out this stop.
3. Stop 3: columns 3 to 5. The dark column lands in the middle, where the kernel is zero. The sum is 0.
4. Stop 4: columns 4 to 6. The dark column is now on the left, weight +1. The sum is +3; the figure picks out this stop too.
5. Stop 5: columns 5 to 7. All zeros again.
6. In the second row (window rows 2 to 4) the window meets the horizontal arm, where left and right cancel. The values fall to −2 and +2.

All 25 stops:

| Vertical kernel | | | | |
|---|---|---|---|---|
| 0 | −3 | 0 | 3 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −2 | 0 | 2 | 0 |
| 0 | −3 | 0 | 3 | 0 |

| Horizontal kernel | | | | |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| −3 | −2 | −2 | −2 | −3 |
| 0 | 0 | 0 | 0 | 0 |
| 3 | 2 | 2 | 2 | 3 |
| 0 | 0 | 0 | 0 | 0 |

The vertical kernel marks only the two sides of the vertical line; the horizontal arm vanishes. The horizontal kernel does the opposite; its picked-out stops are 6 (−3) and 16 (+3). The same nine numbers travel the whole image; wherever the edge is, it gets found.

*What is happening?* A small “filter” roams the image step by step, like a magnifying glass. At every stop, if the little region holds the pattern it is looking for (say a vertical edge), it marks that spot bright. The result is a map showing where in the image that pattern lives.

*Try it yourself.* 1) With the vertical kernel, compute stop 22: rows 5 to 7, columns 2 to 4. 2) With the horizontal kernel, compute the center stop: rows 3 to 5, columns 3 to 5. 3) With a 5 × 5 kernel instead of 3 × 3, how many cells would the feature map have? Live demo: [QR 4.4]

#### Technical depth

CNNs detect local patterns with shared-weight convolution kernels; the kernel slides across the image, and at each position the sum of element-wise products produces a feature map. Pooling reduces dimensionality; as layers deepen, the network learns hierarchical representations, from edges to shapes to objects.

Weight sharing and local connectivity greatly reduce the parameter count and grant translation invariance. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. Figure 4.4 shows a real convolution operation.

The operation in the figure is (I ∗ K)(r, c) = Σᵢ Σⱼ K(i, j) · I(r + i, c + j), with i, j ∈ {0, 1, 2}. There is no padding and the stride is 1, so a 7 × 7 image and a 3 × 3 kernel give a map of size (7 − 3 + 1) = 5. Nine weights are shared across 25 positions.

Convolution captures what sits next to what in space. What about what comes after what in time, such as the order of the words in a sentence?

### 4.6 Understanding sequences: recurrent networks (RNN)

Picture a child listening to a bedtime story: each new sentence is heard through the memory of the ones before, or the tale falls apart. Text, music and speech are the same: all sequences, and order matters. “The dog bit the man” and “The man bit the dog” carry the same words yet tell utterly different stories. That is why recurrent networks (RNNs) carry a “memory.”

An RNN listens word by word, refreshing its memory at every step; it moves forward without losing the past. In Figure 4.5 the words are fed in one at a time, and the memory shifts each time.

> **Margin note.** The essence of an RNN in one line: “process each new input together with the memory of everything seen so far.” Because the same cell is reused again and again, it views the sequence as a loop.

**Figure 4.5 · Processing with memory (animation)**
![Figure 4.5](../../figures/out/en/figure-4-5-rnn.svg)

*Setup.* The figure has four frames. Above each frame is a three-word sequence: “machines,” “are,” “learning.” Processed words are shaded dark. Below them, eight vertical bars show the hidden state, that is, the network’s memory; each bar holds a fill between 0 and 100 percent. Under the frame is the count of words processed. In the first frame the memory is empty.

*Step by step.* Read the frames from left to right.

1. Frame 0, “0 words processed”: all eight bars stand at 4 percent. The memory is nearly zero; h₀ = 0.
2. Frame 1, “machines” processed: the bars read 87, 59, 47, 85, 79, 27, 73, 87. Even one word has begun to fill the memory; h₆ is low (27), h₁ and h₈ are high (87).
3. Frame 2, “are” processed: 96, 99, 96, 92, 100, 91, 97, 96. Every bar has risen; h₅ hits the ceiling (100). The second word did not erase the first; it was layered on top.
4. Frame 3, “learning” processed: 86, 99, 98, 88, 87, 96, 85, 86. This time the pattern was reshaped: h₅ dropped from 100 to 87, h₆ rose from 91 to 96, h₂ stayed put.

| Word | h₁ | h₂ | h₃ | h₄ | h₅ | h₆ | h₇ | h₈ |
|---|---|---|---|---|---|---|---|---|
| (empty) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| machines | 87 | 59 | 47 | 85 | 79 | 27 | 73 | 87 |
| are | 96 | 99 | 96 | 92 | 100 | 91 | 97 | 96 |
| learning | 86 | 99 | 98 | 88 | 87 | 96 | 85 | 86 |

The exact numbers matter less than the behavior: the memory is not only added to, it is reshuffled at every step. The same eight bars carry all three words; the network does not open a new memory for each word, it updates the one it has. This is an animation: the bars follow a fixed rule and know nothing about the meaning of the words. In a real RNN every value depends both on the previous memory and on that word’s numerical representation.

*What is happening?* The network reads the words one by one, carrying a “memory” as it goes. With each new word it updates that memory using both the new word and everything gathered so far. So it keeps track of order; “the dog bit the man” and “the man bit the dog” are no longer the same thing to it.

*Try it yourself.* 1) From frame 2 to frame 3, which bars fell, which rose, and which stayed put? 2) In the formula hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ), if h₀ = 0, which term contributes nothing in the first step? 3) Would a model that ignores word order produce the same memory for “the dog bit the man” and “the man bit the dog”? What does an RNN do instead? Live demo: [QR 4.5]

#### Technical depth

An RNN updates its hidden state at each timestep with hₜ = φ(Wₕ·hₜ₋₁ + Wₓ·xₜ + b); the same weights are reused at every step (parameter sharing in time). That lets it process variable-length sequences through one context vector.

Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; they come in the next chapter. The animation in Figure 4.5 shows the hidden-state update in simplified form.

Hidden state h₀ = 0. Each step updates it with hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ); the same weights are reused for every word.

The eight bars in the figure stand for an 8-dimensional hidden state vector. In a real application xₜ is the word’s embedding vector, and Wₓ and Wₕ are learned in training; in the animation the bars are produced by a fixed rule that depends only on the step count.

So far the networks have only recognized: a neuron fired, an edge was found, a sequence was remembered. Can a network produce a face it has never seen, from scratch?

### 4.7 The art of forgery: GANs

Sometimes the goal isn’t recognizing but creating: realistic faces, landscapes, sounds. The trick of generative adversarial networks (GANs) is locking a forger and a detective in the same room. The forger (generator) produces fakes; the detective (discriminator) tries to tell real from fake.

The two race without rest: as the detective catches fakes, the forger sharpens; as the forger sharpens, the detective’s eye grows keener. In Figure 4.6, round by round, an image born as pure noise edges toward the real thing as the forger masters its craft.

> **Margin note.** What makes a GAN work: “making a good fake” and “catching the fake” keep pushing each other. Like a forger racing a detective: as both improve, the result becomes strikingly realistic.

**Figure 4.6 · Generator vs Discriminator**
![Figure 4.6](../../figures/out/en/figure-4-6-gan.svg)

*Setup.* The figure is a film strip of nine frames, from round 0 to round 8. On the left of each frame is the 8 × 8 image the generator drew: dark and light pixels. The “real” image the generator is trying to learn sits at the top: a filled circle in the middle, with 24 of the 64 pixels dark. On the right of each frame is the discriminator’s decision: the probability that the image is fake, and a one-word verdict. Above 50 percent means “Fake!” and below means “Real?”.

*Step by step.* Read the frames in order.

1. Round 0: the generator draws pure noise; only 31 of the 64 pixels agree with the target, a coin toss. The detective is certain: fake probability 95 percent, verdict “Fake!”
2. Rounds 1 and 2: the probability falls to 84 percent, then 73. The first traces of the circle appear in the image; matching pixels 34, then 36.
3. Rounds 3 and 4: 62 and 51 percent. Matching pixels 40 and 45. The detective still says “Fake!” but only just; 51 percent is a hair above the line.
4. Round 5: the probability drops to 40 percent, and the verdict becomes “Real?” The detective is fooled for the first time. Matching pixels: 50.
5. Rounds 6 and 7: 29 and 18 percent. The circle is now clearly visible; matching pixels 54 and 60.
6. Round 8: 7 percent, verdict “Real?” All 64 of the 64 pixels are in place; the generator has matched the target.

| Round | Fake probability | Verdict | Matching pixels |
|---|---|---|---|
| 0 | 95% | Fake! | 31 / 64 |
| 1 | 84% | Fake! | 34 / 64 |
| 2 | 73% | Fake! | 36 / 64 |
| 3 | 62% | Fake! | 40 / 64 |
| 4 | 51% | Fake! | 45 / 64 |
| 5 | 40% | Real? | 50 / 64 |
| 6 | 29% | Real? | 54 / 64 |
| 7 | 18% | Real? | 60 / 64 |
| 8 | 7% | Real? | 64 / 64 |

The probability falls 11 points every round; that is the fixed rule of the animation. In real training both networks learn at the same time: the detective sharpens too, so the decline does not follow such a straight line. But the moment the verdict tips over is the moment a GAN is after.

*What is happening?* Two networks are racing: one (the generator) makes fake images, the other (the discriminator) tries to catch whether they are fake or real. At first the forger is clumsy and easily caught. Each round it learns to forge a little better, and the “fake” probability drops, like a forger racing a detective.

*Try it yourself.* 1) In which round does the verdict flip from “Fake!” to “Real?” and what is the probability in that round? 2) How is the 7 percent of round 8 found; write the rule and compute it. 3) If the detective said 50 percent for every image, what would that be a sign of? Live demo: [QR 4.6]

#### Technical depth

GANs (Goodfellow et al., 2014) train two networks in an adversarial game: the generator G produces samples from random noise; the discriminator D tries to separate real from generated samples. G is trained to maximize its chance of fooling D, while D is trained simultaneously not to be fooled.

Training is a min-max game; at equilibrium the generator’s samples become indistinguishable from the real distribution. GANs were a breakthrough for photorealistic images; today diffusion models are a common alternative (Chapter 5). The animation in Figure 4.6 shows this rivalry in simplified form.

The objective of the game is min_G max_D V(D, G) = 𝔼ₓ[log D(x)] + 𝔼_z[log(1 − D(G(z)))]; at equilibrium D(x) = 1/2. In the animation the fake probability is p(r) = 95 − 11·r percent, and in round r roughly r/8 of the pixels lock onto the target.

The networks have learned both to recognize and to create. Today’s systems that chat and draw take one more step, attention; that is the next chapter.

### 4.8 Test yourself

*Answers are at the back of the book.*
1. What does an artificial neuron compute?
   a) It copies the inputs as-is
   b) Just the average of the inputs
   c) A random number
   d) A weighted sum of inputs + bias, then an activation

2. What makes a neural network “deep”?
   a) Many hidden layers
   b) Having a single neuron
   c) Running very fast
   d) Being connected to the internet

3. What if there were no activation function at all?
   a) The network would get stronger
   b) The network would collapse into one linear function
   c) Nothing would change
   d) The network would get faster

4. What does backpropagation do?
   a) Enlarges the image
   b) Adds new layers
   c) Spreads the error backward and updates weights to reduce it
   d) Deletes the data

5. What data are CNNs especially strong at?
   a) Images
   b) Passwords
   c) Tables
   d) A single number

6. Which two networks compete in a GAN?
   a) Input and Output
   b) CNN and RNN
   c) Teacher and Student
   d) Generator and Discriminator

### What to keep from this chapter

- An artificial neuron is a crude mathematical imitation of the brain; one neuron does little, and everything depends on the pattern that millions of them build together.
- A neuron weighs its inputs, sums them, adds a bias and passes the total through an activation; with w = [0.7, −0.5, 0.9] a sum of 0.69 gives 0.666 in sigmoid, and the neuron fires.
- In neurons arranged in layers, the signal flows from input to output; that is the forward pass, and the highest output is the network’s prediction.
- Without activation, a network of any number of layers would collapse into a single linear function.
- Backpropagation carries the error from output to input and updates every weight in the direction that reduces it; in the animation the error shrank by 40 percent each round.
- Convolutional networks slide one small kernel across the whole image; the same nine numbers find an edge wherever it is.
- Recurrent networks process each word together with the memory of the ones before; in a GAN, the generator and the discriminator push each other toward the real thing.

<!-- SOURCE-CHANGES
Artificial neural networks were born from that question. Stack “artificial neurons” into layers and out comes an astonishingly powerful learning machine. As the layers multiply, the name changes too: deep learning. In this chapter we sit beside a single messenger first; then we move to a whole network, and on to the special networks that handle images and sequences. ||| Artificial neural networks were born from that question. Stack “artificial neurons” into layers and out comes a powerful learning machine. As the layers multiply, the name changes too: deep learning. This chapter sits beside a single messenger first, then moves to a whole network, and on to the special networks that handle images and sequences.
> **Margin note.** An “artificial neuron” is not a real copy of the brain; it is a very crude mathematical analogy. The power lies not in one neuron but in the patterns formed by millions of them together. ||| > **Margin note.** An “artificial neuron” is not a real copy of the brain; it is a very crude mathematical analogy. A single neuron does little; the patterns formed by millions of them together are what count.
Deep learning is the stacking of many hidden layers; this depth lets the network learn increasingly abstract representations from raw data (edge → shape → object). One thing to know: without activation functions, stacked linear layers collapse into a single linear function; nonlinearity is what makes depth meaningful. The field entered its modern era with AlexNet’s leap on ImageNet in 2012. ||| Deep learning is the stacking of many hidden layers; this depth lets the network learn increasingly abstract representations from raw data (edge → shape → object). Without activation functions, stacked linear layers collapse into a single linear function; nonlinearity is what makes depth meaningful. The field entered its modern era with AlexNet’s leap on ImageNet in 2012.
In Figure 4.1, strengthen or weaken the inputs; watch how the total changes and when the keeper rings the bell; that is the moment the neuron “fires.” ||| In Figure 4.1 the inputs are strengthened and weakened in turn. Follow how the total changes and when the keeper rings the bell; that moment is the neuron “firing.”
*What is happening?* A neuron does something very simple: it multiplies each input by an “importance weight,” adds them up, then adds a small threshold value (the bias). If the total is big enough, the neuron “fires,” giving a strong output. Change the inputs and the sum and the output change together. ||| *What is happening?* A neuron does something simple: it multiplies each input by an “importance weight,” adds them up, then adds a small threshold value (the bias). If the total is big enough, the neuron “fires,” giving a strong output. Change the inputs and the sum and the output change together.
News flowing from entrance to exit is called the forward pass. In Figure 4.2, compare the inputs on and off, and watch the signal climb floor by floor; see which neurons light up. ||| News flowing from entrance to exit is called the forward pass. Figure 4.2 shows two input patterns; follow the signal as it climbs floor by floor and see which neurons light up.
The demo in Figure 4.2 performs a real forward pass: with fixed weights, the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is the network’s “prediction.” Training is the act of tuning these weights; that is the next step’s topic. ||| The network in Figure 4.2 performs a real forward pass: with fixed weights, the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is the network’s “prediction.” Training is the act of tuning these weights, and that comes next.
That backward walk is called backpropagation. Follow Figure 4.3 round by round; watch the error flow back and the output edge toward the right answer each round. As the error shrinks, the backward whisper fades too; soon there is hardly any blame left to hand out. ||| That backward walk is called backpropagation. Follow Figure 4.3 round by round: the error flows back and the output edges toward the right answer. As the error shrinks, the backward whisper fades too; soon there is hardly any blame left to hand out.
> **Margin note.** The forward pass means “make a guess”; backpropagation means “learn from the error.” Repeating those two steps millions of times is, honestly, all the magic of deep learning. ||| > **Margin note.** The forward pass means “make a guess”; backpropagation means “learn from the error.” Repeat those two steps millions of times and that is deep learning; there is nothing more to it.
Below, watch the flashlight sweep the image step by step. At every stop it examines a tiny region and marks its findings on a “feature map.” Swap the flashlight (the filter) in Figure 4.4 and see which edges it catches this time. ||| In Figure 4.4 the flashlight sweeps the image step by step. At every stop it examines a tiny region and marks its findings on a “feature map.” Swap the flashlight (the filter) and see which edges it catches this time.
Weight sharing and local connectivity greatly reduce the parameter count and grant translation invariance. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. The demo in Figure 4.4 shows a real convolution operation. ||| Weight sharing and local connectivity greatly reduce the parameter count and grant translation invariance. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. Figure 4.4 shows a real convolution operation.
Picture a child listening to a bedtime story: each new sentence is heard through the memory of the ones before, or the tale falls apart. Text, music and speech are the same: all sequences, and order matters. “The dog bit the man” and “The man bit the dog” carry the same words yet tell utterly different stories. That is exactly why recurrent networks (RNNs) carry a “memory.” ||| Picture a child listening to a bedtime story: each new sentence is heard through the memory of the ones before, or the tale falls apart. Text, music and speech are the same: all sequences, and order matters. “The dog bit the man” and “The man bit the dog” carry the same words yet tell utterly different stories. That is why recurrent networks (RNNs) carry a “memory.”
An RNN listens word by word, refreshing its memory at every step; it moves forward without losing the past. Below, the words are fed in order; watch the memory shift each time. ||| An RNN listens word by word, refreshing its memory at every step; it moves forward without losing the past. In Figure 4.5 the words are fed in one at a time, and the memory shifts each time.
*What is happening?* The network reads the words one by one, carrying a “memory” as it goes. With each new word it updates that memory using both the new word and everything gathered so far. That is how it remembers order; “the dog bit the man” and “the man bit the dog” are no longer the same thing to it. ||| *What is happening?* The network reads the words one by one, carrying a “memory” as it goes. With each new word it updates that memory using both the new word and everything gathered so far. So it keeps track of order; “the dog bit the man” and “the man bit the dog” are no longer the same thing to it.
Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; we meet those in the next chapter. The animation in Figure 4.5 shows the hidden-state update in simplified form. ||| Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; they come in the next chapter. The animation in Figure 4.5 shows the hidden-state update in simplified form.
The two race without rest: as the detective catches fakes, the forger sharpens; as the forger sharpens, the detective’s eye grows keener. Follow Figure 4.6 round by round; watch an image born as pure noise edge toward the real thing as the forger masters its craft. ||| The two race without rest: as the detective catches fakes, the forger sharpens; as the forger sharpens, the detective’s eye grows keener. In Figure 4.6, round by round, an image born as pure noise edges toward the real thing as the forger masters its craft.
> **Margin note.** The beauty of a GAN: “making a good fake” and “catching the fake” keep pushing each other. Like a forger racing a detective: as both improve, the result becomes astonishingly realistic. ||| > **Margin note.** What makes a GAN work: “making a good fake” and “catching the fake” keep pushing each other. Like a forger racing a detective: as both improve, the result becomes strikingly realistic.
-->

<!-- EDITORIAL NOTES
- 4.2 Simple: "Use the sliders to strengthen or weaken the inputs; watch how the total changes…" → "In Figure 4.1, strengthen or weaken the inputs; watch how the total changes…" (rest verbatim, "watch" kept).
- 4.3 Simple: "Toggle the inputs, press “Forward pass,” and watch the signal climb floor by floor; see which neurons light up." → "In Figure 4.2, compare the inputs on and off, and watch the signal climb floor by floor; see which neurons light up."
- 4.4 Simple: "Press “Train”; watch the error flow back…" → "Follow Figure 4.3 round by round; watch the error flow back…"
- 4.5 Simple: "Swap the flashlight (the filter) and see which edges it catches this time." → "Swap the flashlight (the filter) in Figure 4.4 and see which edges it catches this time." ("Below, watch the flashlight sweep the image step by step." left as is; the Figure block answers it.)
- 4.6 Simple: "Feed the words in order below and watch the memory shift each time." → "Below, the words are fed in order; watch the memory shift each time."
- 4.7 Simple: "Press “Round”; watch an image born as pure noise…" → "Follow Figure 4.6 round by round; watch an image born as pure noise…"
- 4.3 / 4.4 / 4.5 / 4.6 / 4.7 Technical: "The demo below" / "The animation below" → "The demo in Figure 4.2" / "The animation in Figure 4.3" / "The demo in Figure 4.4" / "The animation in Figure 4.5" / "The animation in Figure 4.6". Direction fix only, because Technical depth now comes AFTER the Figure block; this follows the author decision recorded in the Turkish M04 notes (2026-09-10). Chapter 1 left "The simulation below" as is; the author may revert either way for consistency.
- Adapted for paper (2026-09-30; screen verbs resolved in the source text too): Figure 4.1 What is happening "Move the sliders and watch the sum and the output change together." (suggestion: "Change the inputs and the sum and the output change together."); Figure 4.3 What is happening "Each time you press “Train,”" (suggestion: "Each round,"); Figure 4.3 technical What is happening "Each “Train” carries the gradient…".
- Figure 4.1 technical What is happening keeps the source's hyphen-minus in "w = [0.7, -0.5, 0.9], bias b = -0.3" (verbatim); the new text and tables use the Unicode minus (−0.5, −0.3).
- Embedded demo text "⚡ The neuron fired!" woven into Figure 4.1 Step by step (item 3) as “The neuron fired!”; the lightning emoji was dropped for print.
- Setups: source hints stripped of screen verbs ("move the sliders", "toggle", "press", "pick", "feed" removed); layouts described from the EN figure files (4.2: two panels [1, 0, 1] and [0, 1, 0]; 4.3: 9 frames; 4.4: both kernels, picked-out stops 2/4 and 6/16; 4.5: 4 frames with "machines / are / learning"; 4.6: 9 frames plus the target circle).
- Figure 4.4: the map legend follows the EN figure ("plus = dark to light, minus = light to dark, darkness = magnitude"); no color names are used, because the Turkish Setup ("orange plus, gray minus") and its step 4 ("dark blue") disagree with each other.
- Figure 4.5 (RNN): the bar values in the code depend only on the step count, not on the word; stated honestly in Step by step ("the bars follow a fixed rule and know nothing about the meaning of the words"), and Try it yourself question 3 is kept conceptual.
- 4.8: the source h2 is Turkish ("Kendini test et"); rendered as "Test yourself" as in Chapter 1. The export note "_Answers: answer-key.md_" was removed (the file name does not belong in print).
- Number style: decimals with a point; percentages as "37%" in tables and "37 percent" in prose; "points" for percentage-point gaps, as in the Turkish edition. Ranges in verbatim Technical text keep the source en dash ("0–1", "−1–1").
- Quiz option order is the export's shuffled order, kept exactly; the answer key follows the same order.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in the Turkish edition.
- 2026-09-30 humanizing pass (copy edit; see the SOURCE-CHANGES block above for the source paragraphs the author should carry into the digital edition): hype ("astonishingly", "the magic of", "the beauty of", "the power lies") toned down; "exactly" as intensifier, "simply", "honestly", "very" removed; the remaining screen verb "watch" in adapted Simple sentences replaced by "follow" or a plain statement; "the demo in Figure" → "the network in / Figure"; author "we" removed; the brake/gas metaphor of Figure 4.1 replaced by plain "pulls the sum down / pushes it up" (answers/M04.md matched); bridges and the pre-quiz sentence rewritten; the "power is not in one neuron but" mirror kept once, rephrased, in the margin note and the takeaway.
- Technical "What is happening?" paragraphs dropped from print because they repeat the Technical text above them word for word (print only; the digital edition keeps them under the demo): 4.2 ("z = Σwᵢxᵢ + b, and φ(z) …"; the hyphen-minus note above is therefore moot for print), 4.3 ("a⁽ˡ⁾ = φ(…) is computed layer by layer …"), 4.4 ("Start: random weights, high loss. …"), 4.5 ("The selected kernel roams the image …"), 4.7 ("Start: G produces random noise …"). 4.6 ("Hidden state h₀ = 0. …") is kept because Try it yourself uses its tanh form.
-->

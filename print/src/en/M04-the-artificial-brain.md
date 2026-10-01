# Chapter 4
## The Artificial Brain
*From neuron to network*

<!-- acc #3155c4 · tag Deep Learning -->

### 4.1 The artificial brain: deep learning

Billions of tiny messengers live inside your head: neurons. Each listens to its neighbors’ whispers; when the whispers grow loud enough, it shouts and passes the news along. Researchers looked at this simple game and wondered: What if we built a rough mathematical imitation of it?

Artificial neural networks were born from that question. Stack “artificial neurons” into layers and out comes a powerful learning machine. As the layers multiply, the name changes too: deep learning. This chapter sits beside a single messenger first, then moves to a whole network, and on to the special networks that handle images and sequences.

> **Margin note.** An “artificial neuron” is not a real copy of the brain; it is a very crude mathematical analogy. A single neuron does little; the patterns formed by millions of them together are what count.

#### Technical depth

Artificial neural networks are only loosely inspired by biological neurons; at heart they are stacks of nonlinear transformations arranged in layers. Each artificial neuron adds a bias term to a weighted sum of its inputs and passes the result through an activation function.

Deep learning is the stacking of many hidden layers; this depth lets the network learn increasingly abstract representations from raw data (edge → shape → object). Without activation functions, stacked linear layers collapse into a single linear function; nonlinearity is what makes depth meaningful. The field entered its modern era with AlexNet’s leap on ImageNet in 2012.

The smallest piece of this whole structure is a single artificial neuron. What does it compute on its own, and how does it turn three numbers into a decision?

### 4.2 A single artificial neuron

Think of the artificial neuron as a gatekeeper. A few messages arrive at its door; the keeper gives each a level of importance (called a weight), adds them up, then adds its own temperament on top (the bias term). It passes the total through a filter and turns it into an output; that filter is what “activation” means. Whether the bell rings is a separate rule: does the output clear a threshold?

In Figure 4.1 the inputs are strengthened and weakened in turn. Follow how the total changes and when the keeper rings the bell; that moment is the neuron “firing.”

> **Margin note.** All a neuron does is “weigh the inputs, sum them, pass them through an activation function.” Repeated millions of times, an operation this simple can recognize faces and write text.

**Figure 4.1 · Run the neuron**
![Figure 4.1](../../figures/out/en/figure-4-1-neuron.svg)

*Setup.* The figure shows three inputs: x₁, x₂ and x₃. Each carries a value between 0 and 1; at the start, 0.60, 0.30 and 0.80. Next to each input sits a fixed weight: w = [0.7, −0.5, 0.9]. The box in the middle adds them up and adds the bias term b = −0.3 on top. The box on the right applies the activation, sigmoid or ReLU; the activation is the neuron’s numerical output. “Fired” is a separate decision rule of this illustration. When the sigmoid output clears 0.5, or the ReLU output clears 0, the panel on the right reads “The neuron fired!”; in the table the other cases are called “silent.”

*Step by step.* Work through the keeper’s arithmetic with the opening values.

1. Multiply each input by its weight: 0.7 × 0.60 = 0.42; −0.5 × 0.30 = −0.15; 0.9 × 0.80 = 0.72.
2. Add the three: 0.42 − 0.15 + 0.72 = 0.99. Add the bias term: 0.99 − 0.3 = 0.69. The line “Weighted sum = 0.69” in the figure is this number.
3. With sigmoid selected, the output is 1 / (1 + e⁻⁰·⁶⁹) = 0.666. That is above the decision threshold of 0.5, so the panel on the right says “The neuron fired!”
4. With ReLU, the output is max(0, 0.69) = 0.690: a positive sum passes through unchanged. It is above zero, so the neuron fires again.
5. Raise x₂ to 1.00. Its weight is negative, so the sum drops: 0.42 − 0.50 + 0.72 − 0.3 = 0.34. Sigmoid gives 0.584; the neuron still fires, but more weakly.
6. Put x₂ back to 0.30 and set x₃ to zero. The sum becomes 0.42 − 0.15 + 0 − 0.3 = −0.03. Sigmoid gives 0.493, ReLU 0.000; in both cases the neuron stays silent. Silent does not mean an output of zero: the sigmoid still gives 0.493; it only stayed below the 0.5 threshold.

| x₁ | x₂ | x₃ | Weighted sum | Sigmoid | ReLU | State |
|---|---|---|---|---|---|---|
| 0.60 | 0.30 | 0.80 | 0.69 | 0.666 | 0.690 | fires |
| 0.60 | 1.00 | 0.80 | 0.34 | 0.584 | 0.340 | fires |
| 0.60 | 0.30 | 0.00 | −0.03 | 0.493 | 0.000 | silent |
| 0.00 | 0.00 | 0.00 | −0.30 | 0.426 | 0.000 | silent |

In the last row every input is zero, and still the sum is −0.30. That is the bias term at work: by temperament, the keeper starts out closed. x₂ always pulls the sum down; x₁ and x₃ push it up, and x₃ pushes hardest because its weight is largest.

*What is happening?* A neuron does something simple: it multiplies each input by an “importance weight,” adds them up, then adds a small bias term. The activation function turns that total into the output: sigmoid gives a number between 0 and 1, ReLU zeroes a negative total and passes a positive one through unchanged. Calling the neuron “fired” once the output passes 0.5 is a decision rule of this illustration. Change the inputs and the sum and the output change together.

*Try it yourself.* 1) Set all three inputs to 1.00. What are the weighted sum and the sigmoid output; does the neuron fire? 2) Only x₃ = 1.00, the others 0. Compute the sum and the ReLU output. 3) Only x₂ = 1.00, the others 0. Does the sigmoid output pass 0.5? Live demo: [QR 4.1]

#### Technical depth

An artificial neuron computes z = Σ wᵢxᵢ + b, then applies an activation function: a = φ(z). Common choices are sigmoid (0–1), tanh (−1–1) and ReLU = max(0, z). The weights tune each input’s importance and the bias term shifts the sum; both are learned in training.

The activation’s role is decisive: without added nonlinearity, the network, however many layers, would equal a single linear transformation. ReLU has become the de facto standard in deep networks thanks to its simplicity and its preservation of gradient flow.

The sigmoid in the figure is σ(z) = 1 / (1 + e⁻ᶻ); at z = 0 it gives 0.5, which is why the firing threshold in the figure was set at 0.5. For ReLU the threshold is z > 0. The threshold is a decision rule placed on top of the output, not part of the activation: the sigmoid is not zeroed below it (0.493 for −0.03), and ReLU passes a positive input through unchanged.

A single neuron can draw only one line through the space of its inputs. When dozens are stacked in layers, how does the signal travel through them?

### 4.3 Layers and the forward pass

One gatekeeper alone can’t achieve much. But house the keepers on the floors of a building and everything changes. News flows from the ground floor to the top; the “hidden” floors in between refine the raw news a little more at every stop.

News flowing from entrance to exit is called the forward pass. Figure 4.2 shows two input patterns; follow the signal as it climbs floor by floor and see which neurons light up.

> **Margin note.** The secret of depth: early layers learn simple features (edges), later layers learn their combinations (shapes, objects). No one programs this by hand; the network discovers it itself.

**Figure 4.2 · A live neural network (forward pass)**
![Figure 4.2](../../figures/out/en/figure-4-2-ffnet.svg)

*Setup.* The figure has two panels, each with three layers. On the left of a panel are three input boxes, each on (1) or off (0). In the middle sit four hidden neurons, H1 to H4; on the right, two output neurons, O1 and O2. Every connection has a fixed weight; the values appear in the calculation. There is no bias term. The weights were chosen by hand; the two outputs carry no class meaning. Each neuron sums the incoming signals by their weights and passes the total through a sigmoid. The darker a neuron, the higher its activation. The left panel shows the opening state: x₁ and x₃ on, x₂ off. In the right panel only x₂ is on.

*Step by step.* Compute the left panel, the input [1, 0, 1]. The input weights of the hidden neurons are, in order: H1 [0.6, −0.4, 0.8], H2 [0.5, 0.7, −0.3], H3 [−0.6, 0.5, 0.6], H4 [0.3, −0.7, 0.5].

1. H1: 0.6 × 1 + (−0.4) × 0 + 0.8 × 1 = 1.40; sigmoid 0.80. The brightest neuron in the layer.
2. H2: 0.5 + 0 − 0.3 = 0.20; sigmoid 0.55.
3. H3: −0.6 + 0 + 0.6 = 0.00; sigmoid 0.50. Even with a sum of zero, the neuron stays at half brightness.
4. H4: 0.3 + 0 + 0.5 = 0.80; sigmoid 0.69.
5. Output O1, weights [0.7, −0.5, 0.6, 0.4]: 0.7 × 0.80 − 0.5 × 0.55 + 0.6 × 0.50 + 0.4 × 0.69 = 0.86; sigmoid 0.70.
6. Output O2, weights [−0.4, 0.6, 0.5, −0.6]: −0.32 + 0.33 + 0.25 − 0.41 = −0.15; sigmoid 0.46.
7. O1 > O2. The illustration calls this the network’s “prediction”; in the figure it is the darkest box. O1 and O2 stand for no class; the illustration does not show that a task has been learned.

In the right panel only x₂ is on. The same procedure gives this table:

| Input | H1 | H2 | H3 | H4 | O1 | O2 | Prediction |
|---|---|---|---|---|---|---|---|
| [1, 0, 1] | 0.80 | 0.55 | 0.50 | 0.69 | 0.70 | 0.46 | O1 |
| [0, 1, 0] | 0.40 | 0.67 | 0.62 | 0.33 | 0.61 | 0.59 | O1 |

When the input changes, the brightness pattern of the hidden layer flips: on the left H1 stands out, on the right H2 and H3 shine. The winner does not change, though; in the second case O1 leads by only 0.02. Nobody has trained these weights, so the network’s “opinion” is still arbitrary.

*What is happening?* The signal moves left to right, layer by layer: each neuron sums what reaches it and passes it on to the next layer. The brighter a neuron, the stronger its response. The brightest box on the far right is what we call the network’s “prediction”; because the weights were chosen by hand, that prediction means nothing yet.

*Try it yourself.* 1) With every input off ([0, 0, 0]), what value do the four hidden neurons take? Compute the outputs as well. 2) For the input [1, 1, 1], find H1’s sum and its sigmoid value. 3) Does O2 win for any of the eight possible input patterns? Guess first, then test two of them by calculation. Live demo: [QR 4.2]

#### Technical depth

In a feedforward network each layer takes the previous layer’s activations: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). The input layer carries the raw data, hidden layers carry intermediate representations, and the output layer carries the prediction. The weight matrices and bias-term vectors are the network’s learned parameters.

The network in Figure 4.2 computes a real forward pass with fixed weights chosen by hand: the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is called the network’s “prediction” only for the sake of the illustration; the outputs have no class meaning, and the demonstration does not show that a task has been learned. Training is the act of tuning these weights, and that comes next.

In the network of Figure 4.2, W⁽¹⁾ is 4 × 3 and W⁽²⁾ is 2 × 4; b⁽¹⁾ = b⁽²⁾ = 0. There are 12 + 8 = 20 learnable weights in all; φ is the sigmoid in both layers.

This network gives the same answer for all eight input patterns, because nobody has tuned its weights. Can the error itself be used to correct them?

### 4.4 Backpropagation: learning from error

The network starts out guessing at random; forgive its first-day clumsiness. So how does it become a master? First it compares its guess with the right answer and measures how wrong it was: the error. Then that error walks backward, from exit to entrance, telling every connection it passes: “adjust your small share of the blame.”

That backward walk is called backpropagation; it works out each connection’s share of the error. The correction is a separate step: each weight is nudged in proportion to its share (gradient descent). Follow Figure 4.3 round by round: the error flows back and the output edges toward the right answer. As the error shrinks, the backward whisper fades too; there is less blame left to hand out.

> **Margin note.** The forward pass means “make a guess”; backpropagation means “learn from the error.” Repeat those two steps millions of times and that is deep learning; there is nothing more to it.

**Figure 4.3 · Learn from error (real training)**
![Figure 4.3](../../figures/out/en/figure-4-3-backprop.svg)

*Setup.* The figure is laid out like a film strip; each frame is one training round. The network is small but the arithmetic is real: two inputs (x₁ = 1.0, x₂ = 0.5), two hidden neurons, one output; all sigmoid. The target is 0.8; the loss is L = ½(ŷ − 0.8)²; the learning rate is η = 2. The starting weights were chosen for the explanation: hidden layer W₁ = [[0.3, −0.2], [0.4, 0.1]], bias terms 0; output weights w₂ = [0.5, −0.3], b₂ = 0. On the left of a frame is the network with an arrow running back from output to input: the gradient flowing backward. In the middle, a vertical bar shows the network’s output (ŷ), and the line above it marks the target (0.8). Under each frame is that round’s error (target − ŷ). In round 0 the weights have not been updated yet; every round is one forward pass, one gradient computation and one update.

*Step by step.* Read the frames in order; work out the first round yourself.

1. Round 0, forward pass: hidden neuron 1 sums 0.3 · 1.0 + (−0.2) · 0.5 = 0.20, sigmoid 0.5498; neuron 2 sums 0.4 · 1.0 + 0.1 · 0.5 = 0.45, sigmoid 0.6106. The output sum is 0.5 · 0.5498 − 0.3 · 0.6106 + 0 = 0.0917; ŷ = sigmoid(0.0917) = 0.5229.
2. Round 0, loss: the error is 0.8 − 0.5229 = 0.2771; L = ½ · 0.2771² = 0.0384.
3. Round 0, backpropagation (computing the gradient): at the output neuron δ₂ = (ŷ − 0.8) · ŷ · (1 − ŷ) = −0.2771 · 0.5229 · 0.4771 = −0.0691. The gradient of each output weight is that number times the hidden activation: ∂L/∂w₂ = [−0.0691 · 0.5498, −0.0691 · 0.6106] = [−0.0380, −0.0422]; ∂L/∂b₂ = −0.0691. The chain goes one step further back: for hidden neuron j, δⱼ = δ₂ · w₂ⱼ · hⱼ(1 − hⱼ), and the gradient is δⱼ · xᵢ.
4. Round 0, update (optimization): w ← w − η · gradient. w₂ = [0.5 + 2 · 0.0380, −0.3 + 2 · 0.0422] = [0.5760, −0.2156]; b₂ = 0 + 2 · 0.0691 ≈ 0.1383. Hidden layer W₁ = [[0.3171, −0.1914], [0.3901, 0.0951]]. Backpropagation computed the gradient; this step is what changes the weights.
5. Round 1: a forward pass with the new weights gives ŷ = 0.5817, error 0.2183, loss 0.0238. The output came 5.9 points closer in a single round.
6. Rounds 2 to 8: the same three steps repeat; the numbers are in the table. In round 8, ŷ = 0.7390, error 0.0610, loss 0.0019.
7. The steps are shrinking: round 1 raised ŷ by 0.059, round 8 by 0.010. As the error shrinks so does the gradient, and since the update is proportional to it, the step gets shorter.

| Round | w₂ | b₂ | ŷ | Error (0.8 − ŷ) | Loss |
|---|---|---|---|---|---|
| 0 | [0.5000, −0.3000] | 0.0000 | 0.5229 | 0.2771 | 0.0384 |
| 1 | [0.5760, −0.2156] | 0.1383 | 0.5817 | 0.2183 | 0.0238 |
| 2 | [0.6354, −0.1513] | 0.2445 | 0.6258 | 0.1742 | 0.0152 |
| 3 | [0.6818, −0.1021] | 0.3261 | 0.6585 | 0.1415 | 0.0100 |
| 4 | [0.7183, −0.0639] | 0.3897 | 0.6832 | 0.1168 | 0.0068 |
| 5 | [0.7477, −0.0335] | 0.4403 | 0.7022 | 0.0978 | 0.0048 |
| 6 | [0.7716, −0.0090] | 0.4812 | 0.7172 | 0.0828 | 0.0034 |
| 7 | [0.7914, 0.0111] | 0.5148 | 0.7292 | 0.0708 | 0.0025 |
| 8 | [0.8080, 0.0279] | 0.5427 | 0.7390 | 0.0610 | 0.0019 |

There is no ready-made rule in the table; each row follows from the previous one through a gradient and an update. The error fell from 0.28 to 0.06 in eight rounds; it did not reach zero, and at this pace it would take a long time to. This is training error measured on a single example: how the network does on new examples still has to be tested. In real training over millions of examples the curve does not descend this smoothly, and now and then it even rises; but the loop is the same: forward pass, loss, gradient, update.

*What is happening?* The network starts by guessing with untrained weights, so the error (loss) is high. Each round, backpropagation computes how the loss changes with every connection (the gradient), from output back to input; then gradient descent nudges every weight in the direction that reduces the error. Bit by bit, the output closes in on the right answer. Training error has decreased on this example; performance on new examples still needs testing.

*Try it yourself.* 1) Compute the output with the weights of round 8 yourself: hidden activations h = [0.5957, 0.5994], w₂ = [0.8080, 0.0279], b₂ = 0.5427. What are the output sum and ŷ; do they agree with the table? 2) In round 0 the gradient of b₂ is −0.0691. With a learning rate of 1 instead of 2, what would b₂ be after the first update, and how does the step change? 3) In round 8 the error is 0.061. Can you say “the network has learned”? Think about what this error measures and what it does not. Live demo: [QR 4.3]

#### Technical depth

Backpropagation efficiently computes the gradient of the loss with respect to every weight using the chain rule; gradients are carried backward layer by layer, from output to input. Gradient descent then updates the weights: W ← W − η·∂L/∂W.

This method (popularized by Rumelhart, Hinton and Williams in 1986) is the key to training deep networks. The animation in Figure 4.3 runs a real training loop on a single example: forward pass, loss, gradient by the chain rule, update by gradient descent; real training repeats the same loop over millions of examples. Backpropagation computes the gradient; the optimization step is what changes the parameters.

The network in the figure is 2-2-1 with sigmoid activations throughout; the loss is L = ½(ŷ − y)², η = 2. At the output neuron δ₂ = (ŷ − y)·ŷ(1 − ŷ); for hidden neuron j, δⱼ = δ₂·w₂ⱼ·hⱼ(1 − hⱼ); the gradients are ∂L/∂w₂ⱼ = δ₂·hⱼ, ∂L/∂b₂ = δ₂ and ∂L/∂W₁ⱼᵢ = δⱼ·xᵢ. Every row of the table was computed with these formulas; there is no ready-made curve.

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

The vertical kernel marks only the two sides of the vertical line; the horizontal arm vanishes. The horizontal kernel does the opposite; its picked-out stops are 6 (−3) and 16 (+3). The same nine numbers travel the whole image; wherever the edge is, it gets found. Shift the image by one cell and the map shifts by one cell too: that is equivariance, not invariance.

*What is happening?* A small “filter” roams the image step by step, like a magnifying glass. At every stop, if the little region holds the pattern it is looking for (say a vertical edge), it marks that spot bright. The result is a map showing where in the image that pattern lives.

*Try it yourself.* 1) With the vertical kernel, compute stop 22: rows 5 to 7, columns 2 to 4. 2) With the horizontal kernel, compute the center stop: rows 3 to 5, columns 3 to 5. 3) With a 5 × 5 kernel instead of 3 × 3, how many cells would the feature map have? Live demo: [QR 4.4]

#### Technical depth

CNNs detect local patterns with shared-weight convolution kernels; the kernel slides across the image, and at each position the sum of element-wise products produces a feature map. Pooling reduces dimensionality; as layers deepen, the network learns hierarchical representations, from edges to shapes to objects.

Weight sharing and local connectivity greatly reduce the parameter count; under ideal conditions convolution produces translation-equivariant feature maps (shift the input and the map shifts with it), and operations such as pooling can provide approximate invariance to small shifts. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. Figure 4.4 shows a real convolution operation.

The operation in the figure is (I ∗ K)(r, c) = Σᵢ Σⱼ K(i, j) · I(r + i, c + j), with i, j ∈ {0, 1, 2}. There is no padding and the stride is 1, so a 7 × 7 image and a 3 × 3 kernel give a map of size (7 − 3 + 1) = 5. Nine weights are shared across 25 positions. The kernel is applied without flipping; in mathematical terms the operation is cross-correlation, which the deep-learning literature calls convolution. Because the vertical kernel is not symmetric, flipping it would reverse the signs in the map.

Convolution captures what sits next to what in space. What about what comes after what in time, such as the order of the words in a sentence?

### 4.6 Understanding sequences: recurrent networks (RNN)

Picture a child listening to a bedtime story: each new sentence is heard through the memory of the ones before, or the tale falls apart. Text, music and speech are the same: all sequences, and order matters. “The dog bit the man” and “The man bit the dog” carry the same words yet tell utterly different stories. That is why recurrent networks (RNNs) carry a “memory.”

An RNN listens word by word, refreshing its memory at every step; it moves forward without losing the past. In Figure 4.5 the words are fed in one at a time, and the memory shifts each time.

> **Margin note.** The essence of an RNN in one line: “process each new input together with the memory of everything seen so far.” Because the same cell is reused again and again, it views the sequence as a loop.

**Figure 4.5 · Processing with memory (real recurrence)**
![Figure 4.5](../../figures/out/en/figure-4-5-rnn.svg)

*Setup.* The figure has eight frames, from frame 0 to frame 7. Above each frame is the seven-word sentence “The cat ran because it was scared.” Processed words are shaded dark. Below them, four bars show the hidden state, that is, the network’s memory; each is a number between −1 and 1 (a tanh output), upward positive, downward negative. Under the frame is the count of words processed. In frame 0 all four bars are zero: h₀ = 0. The numbers are computed with hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁); Wₓ (4 × 5) and Wₕ (4 × 4) are fixed weights chosen for the explanation, not trained.

*Step by step.* Read the frames from left to right; work out the first two steps yourself. Each word enters as a unit vector: “The” is [1, 0, 0, 0, 0], “cat” is [0, 1, 0, 0, 0], and so on. Wₓ has five columns, so the sixth and seventh words reuse the first two. Wₓxₜ is therefore one column of Wₓ.

1. Frame 0, “0 words processed”: h₀ = [0, 0, 0, 0]. All four bars sit at zero.
2. Frame 1, “The” processed: column 1 of Wₓ is [0.9, −0.6, 0.2, −0.8]; Wₕh₀ = 0. h₁ = tanh([0.9, −0.6, 0.2, −0.8]) = [0.72, −0.54, 0.20, −0.66].
3. Frame 2, “cat” processed: column 2 of Wₓ is [−0.4, 0.8, −0.5, 0.3]. Now the memory speaks too: Wₕh₁ = [0.56, −0.44, −0.14, 0.02]. The total is [0.16, 0.36, −0.64, 0.32]; h₂ = [0.16, 0.34, −0.57, 0.31]. The second word did not erase the first; it mixed with it.
4. Frame 3, “ran”: h₃ = [0.16, 0.32, 0.53, −0.58]. The third component flipped from negative to positive.
5. Frame 4, “because”: h₄ = [−0.54, 0.11, 0.82, 0.68]. Even a function word reshaped the memory from end to end.
6. Frames 5 to 7, “it,” “was,” “scared”: h₅ = [0.34, −0.81, −0.16, 0.53], h₆ = [0.86, −0.57, −0.55, −0.39], h₇ = [0.09, 0.67, −0.77, 0.20]. At the end of the sentence the memory carries traces of all seven words; none sits in a place of its own, all are mixed into the same four numbers.

| Step | Word | h[1] | h[2] | h[3] | h[4] |
|---|---|---|---|---|---|
| 0 | (empty) | 0.00 | 0.00 | 0.00 | 0.00 |
| 1 | The | 0.72 | −0.54 | 0.20 | −0.66 |
| 2 | cat | 0.16 | 0.34 | −0.57 | 0.31 |
| 3 | ran | 0.16 | 0.32 | 0.53 | −0.58 |
| 4 | because | −0.54 | 0.11 | 0.82 | 0.68 |
| 5 | it | 0.34 | −0.81 | −0.16 | 0.53 |
| 6 | was | 0.86 | −0.57 | −0.55 | −0.39 |
| 7 | scared | 0.09 | 0.67 | −0.77 | 0.20 |

The exact numbers matter less than the behavior: the memory is not only added to, it is reshuffled at every step. The same four numbers carry all seven words; the network does not open a new memory for each word, it updates the one it has. Because the weights were never trained, these numbers know nothing about the meaning of the words; in a trained RNN, Wₓ and Wₕ are learned from data and each word enters as a learned vector instead of a unit vector.

*What is happening?* The network reads the words one by one, carrying a “memory” as it goes. With each new word it updates that memory using both the new word and everything gathered so far. So it keeps track of order; “the dog bit the man” and “the man bit the dog” are no longer the same thing to it.

*Try it yourself.* 1) In the formula hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ), if h₀ = 0, which term contributes nothing in the first step? 2) Feed the words in a different order, swapping the third and the fourth: The, cat, because, ran, it, was, scared. Which column of Wₓ does step 3 use now? h₂ stays the same; compute h₃ and compare it with the table. 3) Would a model that ignores word order produce the same memory for “the dog bit the man” and “the man bit the dog”? What does an RNN do instead? Live demo: [QR 4.5]

#### Technical depth

An RNN updates its hidden state at each timestep with hₜ = φ(Wₕ·hₜ₋₁ + Wₓ·xₜ + b); the same weights are reused at every step (parameter sharing in time). That lets it process variable-length sequences through one context vector.

Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; they come in the next chapter. The animation in Figure 4.5 computes the hidden state step by step with the equation hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁), using fixed, untrained weights.

Hidden state h₀ = 0. Each step updates it with hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ); the same weights are reused for every word.

The four bars in the figure stand for a 4-dimensional hidden state vector. The weights: rows of Wₓ [0.9, −0.4, 0.3, −0.7, 0.5], [−0.6, 0.8, −0.2, 0.4, −0.9], [0.2, −0.5, 0.7, 0.6, −0.3], [−0.8, 0.3, −0.6, 0.9, 0.1]; rows of Wₕ [0.5, −0.3, 0.2, 0.0], [0.1, 0.4, −0.5, 0.3], [−0.2, 0.6, 0.3, −0.4], [0.3, −0.1, 0.4, 0.5]. They are constants chosen for the explanation, not trained; in a real application xₜ is the word’s embedding vector, and Wₓ and Wₕ are learned in training.

So far the networks have only recognized: a neuron fired, an edge was found, a sequence was remembered. Can a network produce a face it has never seen, from scratch?

### 4.7 The art of forgery: GANs

Sometimes the goal isn’t recognizing but creating: realistic faces, landscapes, sounds. The trick of generative adversarial networks (GANs) is locking a forger and a detective in the same room. The forger (generator) produces fakes; the detective (discriminator) tries to tell real from fake.

The two race without rest: as the detective catches fakes, the forger sharpens; as the forger sharpens, the detective’s eye grows keener. In Figure 4.6, round by round, an image born as pure noise edges toward the real thing as the forger masters its craft.

> **Margin note.** What makes a GAN work: “making a good fake” and “catching the fake” keep pushing each other. Like a forger racing a detective: as both improve, the result becomes strikingly realistic.

**Figure 4.6 · Generator vs Discriminator**
![Figure 4.6](../../figures/out/en/figure-4-6-gan.svg)

*Setup.* The figure is a film strip of nine frames, from round 0 to round 8. This strip is illustrative: both the images and the percentages were fixed in advance for the explanation, not measured from a trained network. On the left of each frame is the 8 × 8 image the generator drew: dark and light pixels. The “real” image the generator is trying to learn sits at the top: a filled circle in the middle, with 24 of the 64 pixels dark. On the right of each frame is the discriminator’s decision: the probability that the image is fake, and a one-word verdict. Above 50 percent means “Fake!” and below means “Real?”.

*Step by step.* Read the frames in order.

1. Round 0: the generator draws pure noise; only 31 of the 64 pixels agree with the target, a coin toss. The detective is certain: fake probability 95 percent, verdict “Fake!”
2. Rounds 1 and 2: the probability falls to 84 percent, then 73. The first traces of the circle appear in the image; matching pixels 34, then 36.
3. Rounds 3 and 4: 62 and 51 percent. Matching pixels 40 and 45. The detective still says “Fake!” but only just; 51 percent is a hair above the line.
4. Round 5: the probability drops to 40 percent, and the verdict becomes “Real?” The detective is fooled for the first time. Matching pixels: 50.
5. Rounds 6 and 7: 29 and 18 percent. The circle is now clearly visible; matching pixels 54 and 60.
6. Round 8: 7 percent, verdict “Real?” All 64 of the 64 pixels are in place; in the strip the generator has matched the target. The 7 percent is an illustrative number, not a measured probability.

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

The probability falls 11 points every round; that is the fixed rule of the animation, not a training result. In real training both networks learn at the same time: the detective sharpens too, so the decline does not follow such a straight line. Nor is 7 percent the theoretical goal: at the ideal equilibrium the discriminator cannot tell real from fake and gives every image 50 percent.

*What is happening?* Two networks are racing: one (the generator) makes fake images, the other (the discriminator) tries to catch whether they are fake or real. At first the forger is clumsy and easily caught. Each round it learns to forge a little better, and the “fake” probability drops, like a forger racing a detective. In this illustration both the image and the percentage are fixed in advance; in real training the two networks learn together, and at the ideal equilibrium the discriminator cannot tell real from fake.

*Try it yourself.* 1) In which round does the verdict flip from “Fake!” to “Real?” and what is the probability in that round? 2) How is the 7 percent of round 8 found; write the rule and compute it. 3) If the detective said 50 percent for every image, what would that be a sign of? Live demo: [QR 4.6]

#### Technical depth

GANs (Goodfellow et al., 2014) train two networks in an adversarial game: the generator G produces samples from random noise; the discriminator D tries to separate real from generated samples. G is trained to maximize its chance of fooling D, while D is trained simultaneously not to be fooled.

Training is a min-max game; at equilibrium the generator’s samples become indistinguishable from the real distribution. GANs were a breakthrough for photorealistic images; today diffusion models are a common alternative (Chapter 5). In the animation of Figure 4.6 the image and the percentage are scripted, not measured training results. At the ideal GAN equilibrium, the discriminator cannot distinguish real from generated samples.

The objective of the game is min_G max_D V(D, G) = 𝔼ₓ[log D(x)] + 𝔼_z[log(1 − D(G(z)))]; at the theoretical optimum, when the generator has captured the data distribution, the optimal discriminator gives every sample D(x) = 1/2. An output of 1/2 on its own does not show that this optimum has been reached; an untrained discriminator can give the same value. In the animation the fake probability is p(r) = 95 − 11·r percent, and in round r roughly r/8 of the pixels lock onto the target; both are scripted, not measured from any training.

The networks have learned both to recognize and to create. Today’s systems that chat and draw take one more step, attention; that is the next chapter.

### 4.8 Test yourself

*Answers are at the back of the book.*
1. What does an artificial neuron compute?
   a) Just the average of the inputs
   b) A weighted sum of inputs + bias term, then an activation
   c) A random number
   d) It copies the inputs as-is

2. What makes a neural network “deep”?
   a) Running very fast
   b) Many hidden layers
   c) Having a single neuron
   d) Being connected to the internet

3. What if there were no activation function at all?
   a) The network would get faster
   b) The network would collapse into one linear function
   c) Nothing would change
   d) The network would get stronger

4. What does backpropagation do?
   a) Adds new layers
   b) Computes the loss gradient for every weight, from output back to input
   c) Enlarges the image
   d) Deletes the data

5. What data are CNNs especially strong at?
   a) A single number
   b) Passwords
   c) Tables
   d) Images

6. Which two networks compete in a GAN?
   a) Input and Output
   b) CNN and RNN
   c) Generator and Discriminator
   d) Teacher and Student

### What to keep from this chapter

- An artificial neuron is a crude mathematical imitation of the brain; one neuron does little, and everything depends on the pattern that millions of them build together.
- A neuron weighs its inputs, sums them, adds a bias term and passes the total through an activation; with w = [0.7, −0.5, 0.9] a sum of 0.69 gives 0.666 in sigmoid, and the neuron fires.
- In neurons arranged in layers, the signal flows from input to output; that is the forward pass, and the highest output counts as the network’s prediction; in an untrained network that prediction means nothing.
- Without activation, a network of any number of layers would collapse into a single linear function.
- Backpropagation computes the gradient of the loss with respect to every weight, from output back to input; gradient descent updates the weights. In Figure 4.3 the error fell from 0.28 to 0.06 in eight rounds.
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
Artificial neural networks are only loosely inspired by biological neurons; at heart they are stacks of nonlinear transformations arranged in layers. Each artificial neuron adds a bias to a weighted sum of its inputs and passes the result through an activation function. ||| Artificial neural networks are only loosely inspired by biological neurons; at heart they are stacks of nonlinear transformations arranged in layers. Each artificial neuron adds a bias term to a weighted sum of its inputs and passes the result through an activation function.
Think of the artificial neuron as a gatekeeper. A few messages arrive at its door; the keeper gives each a level of importance (called a weight), adds them up, then adds its own temperament on top (the bias). If the total clears a threshold, it rings the bell; that decision is what “activation” means. ||| Think of the artificial neuron as a gatekeeper. A few messages arrive at its door; the keeper gives each a level of importance (called a weight), adds them up, then adds its own temperament on top (the bias term). It passes the total through a filter and turns it into an output; that filter is what “activation” means. Whether the bell rings is a separate rule: does the output clear a threshold?
All a neuron does is “weigh the inputs, sum them, pass them through a threshold.” Repeated millions of times, an operation this simple can recognize faces and write text. ||| All a neuron does is “weigh the inputs, sum them, pass them through an activation function.” Repeated millions of times, an operation this simple can recognize faces and write text.
An artificial neuron computes z = Σ wᵢxᵢ + b, then applies an activation function: a = φ(z). Common choices are sigmoid (0–1), tanh (−1–1) and ReLU = max(0, z). The weights tune each input’s importance and the bias tunes the threshold; both are learned in training. ||| An artificial neuron computes z = Σ wᵢxᵢ + b, then applies an activation function: a = φ(z). Common choices are sigmoid (0–1), tanh (−1–1) and ReLU = max(0, z). The weights tune each input’s importance and the bias term shifts the sum; both are learned in training.
A neuron does something simple: it multiplies each input by an “importance weight,” adds them up, then adds a small threshold value (the bias). If the total is big enough, the neuron “fires,” giving a strong output. Move the sliders and watch the sum and the output change together. ||| A neuron does something simple: it multiplies each input by an “importance weight,” adds them up, then adds a small bias term. The activation function turns that total into the output: sigmoid gives a number between 0 and 1, ReLU zeroes a negative total and passes a positive one through unchanged. Calling the neuron “fired” once the output passes 0.5 is a decision rule of this illustration. Move the sliders and watch the sum and the output change together.
z = Σwᵢxᵢ + b, and φ(z) is computed with sigmoid or ReLU. Weights w = [0.7, -0.5, 0.9], bias b = -0.3. If the activation clears the threshold, the neuron fires. ||| z = Σwᵢxᵢ + b, and φ(z) is computed with sigmoid or ReLU. Weights w = [0.7, -0.5, 0.9], bias term b = -0.3. The illustration writes “fired” when φ(z) clears the decision threshold (0.5 for sigmoid, 0 for ReLU); that threshold is the illustration’s decision rule, not part of the activation.
In a feedforward network each layer takes the previous layer’s activations: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). The input layer carries the raw data, hidden layers carry intermediate representations, and the output layer carries the prediction. The weight matrices and bias vectors are the network’s learned parameters. ||| In a feedforward network each layer takes the previous layer’s activations: a⁽ˡ⁾ = φ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾). The input layer carries the raw data, hidden layers carry intermediate representations, and the output layer carries the prediction. The weight matrices and bias-term vectors are the network’s learned parameters.
The network below performs a real forward pass: with fixed weights, the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is the network’s “prediction.” Training is the act of tuning these weights, and that comes next. ||| The network below computes a real forward pass with fixed weights chosen by hand: the computation runs from input to output, and neuron brightness reflects the activation values. The highest output is called the network’s “prediction” only for the sake of the illustration; the outputs have no class meaning, and the demonstration does not show that a task has been learned. Training is the act of tuning these weights, and that comes next.
The signal moves left to right, layer by layer: each neuron sums what reaches it and passes it on to the next layer. The brighter a neuron, the stronger its response. And the brightest box on the far right is the network’s final prediction. ||| The signal moves left to right, layer by layer: each neuron sums what reaches it and passes it on to the next layer. The brighter a neuron, the stronger its response. The brightest box on the far right is what we call the network’s “prediction”; because the weights were chosen by hand, that prediction means nothing yet.
That backward walk is called backpropagation. Press “Train”; watch the error flow back and the output edge toward the right answer each round. As the error shrinks, the backward whisper fades too; soon there is hardly any blame left to hand out. ||| That backward walk is called backpropagation; it works out each connection’s share of the error. The correction is a separate step: each weight is nudged in proportion to its share (gradient descent). Press “Train”; watch the error flow back and the output edge toward the right answer each round. As the error shrinks, the backward whisper fades too; there is less blame left to hand out.
This method (popularized by Rumelhart, Hinton and Williams in 1986) is the key to training deep networks. The animation below qualitatively shows the backward flow of error and the output converging to the target; real training repeats the same loop over millions of examples. ||| This method (popularized by Rumelhart, Hinton and Williams in 1986) is the key to training deep networks. The animation below runs a real training loop on a single example: forward pass, loss, gradient by the chain rule, update by gradient descent; real training repeats the same loop over millions of examples. Backpropagation computes the gradient; the optimization step is what changes the parameters.
The network starts by guessing at random, so the error (loss) is high. Each time you press “Train,” it spreads the error backward from output to input and adjusts every connection slightly to reduce it. Bit by bit, the output closes in on the right answer. ||| The network starts by guessing with untrained weights, so the error (loss) is high. Each time you press “Train,” backpropagation computes how the loss changes with every connection (the gradient), from output back to input; then gradient descent nudges every weight in the direction that reduces the error. Bit by bit, the output closes in on the right answer. Training error has decreased on this example; performance on new examples still needs testing.
Start: random weights, high loss. Each “Train” carries the gradient ∂L/∂W from output to input via the chain rule and updates with W ← W − η·∂L/∂W. ||| Start: untrained weights, high loss. Each “Train” computes the gradient ∂L/∂W from output to input via the chain rule (backpropagation); gradient descent then updates with W ← W − η·∂L/∂W.
Weight sharing and local connectivity greatly reduce the parameter count and grant translation invariance. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. The demo below shows a real convolution operation. ||| Weight sharing and local connectivity greatly reduce the parameter count; under ideal conditions convolution produces translation-equivariant feature maps (shift the input and the map shifts with it), and operations such as pooling can provide approximate invariance to small shifts. LeNet (LeCun) pioneered this architecture; AlexNet (2012) made CNNs visible at scale. The demo below shows a real convolution operation.
Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; they come in the next chapter. The animation below shows the hidden-state update in simplified form. ||| Classic RNNs struggle with long dependencies due to vanishing gradients; LSTM (Hochreiter & Schmidhuber, 1997) and GRU ease this with gate mechanisms. In most modern sequence tasks, RNNs have largely given way to attention-based transformers; they come in the next chapter. The animation below computes the hidden state step by step with the equation hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁), using fixed, untrained weights.
Training is a min-max game; at equilibrium the generator’s samples become indistinguishable from the real distribution. GANs were a breakthrough for photorealistic images; today diffusion models are a common alternative (Chapter 5). The animation below shows this rivalry in simplified form. ||| Training is a min-max game; at equilibrium the generator’s samples become indistinguishable from the real distribution. GANs were a breakthrough for photorealistic images; today diffusion models are a common alternative (Chapter 5). In the animation below the image and the percentage are scripted, not measured training results. At the ideal GAN equilibrium, the discriminator cannot distinguish real from generated samples.
Two networks are racing: one (the generator) makes fake images, the other (the discriminator) tries to catch whether they are fake or real. At first the forger is clumsy and easily caught. Each round it learns to forge a little better, and the “fake” probability drops, like a forger racing a detective. ||| Two networks are racing: one (the generator) makes fake images, the other (the discriminator) tries to catch whether they are fake or real. At first the forger is clumsy and easily caught. Each round it learns to forge a little better, and the “fake” probability drops, like a forger racing a detective. In this illustration both the image and the percentage are fixed in advance; in real training the two networks learn together, and at the ideal equilibrium the discriminator cannot tell real from fake.
A weighted sum of inputs + bias, then an activation ||| A weighted sum of inputs + bias term, then an activation
Spreads the error backward and updates weights to reduce it ||| Computes the loss gradient for every weight, from output back to input
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
- 2026-10-01 correction document (R025, R026, R027, R028, R029, R030, R031, R032, R066): neuron “bias” → “bias term” (4.1 Technical, 4.2 Simple/Setup/Step by step/What is happening/Technical, 4.3 Setup/Technical, quiz 1, takeaway; the statistical “high bias” of 3.7 is untouched); activation separated from the “fired” decision threshold (4.2 Simple, margin note, Setup, Step by step 3–6, What is happening, Technical; answers 4.1/3: sigmoid(−0.8) = 0.310, not zero); Figure 4.2 fixed network: outputs carry no class meaning, no proof of learning (Setup, Step by step 7, What is happening, Technical, takeaway); Figure 4.3 is now REAL training from print/kitap/qa/demo-data.json bp43 (x = [1.0, 0.5], target 0.8, η = 2, sigmoid 2-2-1, L = ½(ŷ − y)²): Setup, Step by step (forward pass → loss → gradient → update), table (rounds 0–8: ŷ, error, loss, w₂, b₂), Try it yourself and answers rewritten; “L(r) = 0.43 · 0.6ʳ”, “scripted animation”, “40 percent each round” removed; backpropagation computes / optimizer updates distinction in Simple, What is happening, Technical and quiz 4; “near-zero error = learned” replaced by “still needs testing on new examples”; convolution: equivariance vs invariance and the cross-correlation note (4.5 Step by step, Technical; all 25 positions of both kernels recomputed and verified); Figure 4.5 now computed from demo-data.json rnn45: hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁), h₀ = 0, words The/cat/ran/because/it/was/scared (seven words; the sixth and seventh reuse Wₓ columns 1 and 2, as stated in Step by step), 4 components, frame 0 zero, Wₓ and Wₕ in the Technical text; synthetic-bar wording removed; the Turkish edition uses the five-word sentence “Kedi kaçtı çünkü o korkmuştu”, so steps 6–7 and their numbers exist only in EN (expected consistency-check difference); GAN: the 7 percent and the image are illustrative, D = 1/2 only under the ideal, well-trained discriminator assumption (Setup, Step by step 6, closing paragraph, What is happening, Technical; answers 4.6/2–3). Changed source paragraphs and quiz options are the last 19 lines of the SOURCE-CHANGES block above.
- 2026-10-01 for the figure agent: Figure 4.3 (gen/M04.mjs) must be regenerated from demo-data.json bp43: 9 frames, ŷ per round (0.5229 … 0.7390), target 0.80, frame caption “error 0.2771” etc., arrow “gradient ◄”; md table head “| Round | w₂ | b₂ | ŷ | Error (0.8 − ŷ) | Loss |”. Figure 4.5 from rnn45: 8 frames (0–7), words The/cat/ran/because/it/was/scared, 4 bars, values −1…1 (bars in both directions), frame 0 zero; strings/M04.mjs rnn.words and mdNote (the synthetic note goes). Figure 4.1 “bias” label, if any, → “bias term”.
- 2026-10-01 answer-key.md is produced by export.py (not edited by hand); the new option texts of quiz 1 and 4 land there at the next export. The “(animation)” suffix of Figures 4.3 and 4.5 is kept because it matches the digital demo titles.
-->

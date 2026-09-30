# Glossary

The section number (for example 3.6) shows the chapter and the section in which the term is introduced.

**Accountability** · Section 8.6
The obligation to answer for the harm an AI system causes. Today it is assigned overwhelmingly to people and institutions (developers, operators, users), not to “the AI itself.”

**Activation function** · Section 4.2
The nonlinear function that turns a neuron’s weighted sum into its output: sigmoid, tanh, ReLU. Without it, stacked layers collapse into a single linear function.

**Agent** · Section 6.4
A system that equips a language model with tools (calculator, search, APIs) and runs it in a “think, use a tool, observe the result, try again” loop (ReAct). It does not just talk; it gets to work.

**Algorithm** · Section 1.3
A finite sequence of well-defined steps, like a cake recipe. The word comes from the name of the 9th-century mathematician al-Khwarizmi.

**Alignment** · Section 7.6
The problem of making a system’s behavior match human intentions and values. A machine that does what you said but misses what you meant is this problem in miniature. It is both a technical and a normative question.

**Anomaly detection** · Section 3.5
Catching examples that stray clearly from the distribution of the majority. A bank noticing a suspicious transaction relies largely on this.

**Artificial general intelligence (AGI)** · Section 1.6
A hypothetical system that can learn and adapt across every domain the way a human does; it has not been built. Being general does not mean being conscious. See Strong AI.

**Artificial intelligence (AI)** · Section 1.1
Systems that can perform tasks requiring human intelligence; the field’s pragmatic definition. It was born at the intersection of computability theory and the philosophy of mind.

**Artificial neural network** · Section 4.1
A learning machine built by arranging artificial neurons in layers; at bottom, a stack of nonlinear transformations. It is only loosely inspired by the biological neuron.

**Artificial neuron** · Section 4.2
A simple unit that weighs its inputs, adds them up, adds a bias and passes the result through an activation; a gatekeeper of sorts. Not a copy of the brain but a rough mathematical analogy.

**Attention** · Section 5.4
Each token learning which tokens in the sequence to look at for its meaning; this is how the pronoun “it” finds out whom it refers to. Self-attention computes this with query, key and value vectors. The heart of the Transformer.

**Backpropagation** · Section 4.4
The error walking backward from the output to the input and telling every connection to “fix your share”; gradient computation by the chain rule. The key that made deep networks trainable.

**Bias (neuron)** · Section 4.2
A constant added to a neuron’s weighted sum that sets its threshold; the gatekeeper’s own temperament. It is learned in training. For the data-related meaning, see Bias (social).

**Bias (social), algorithmic bias** · Section 7.2
A model learning and reinforcing the historical bias, the under-representation or the proxy variables in its data. It comes from skewed data, not bad intent. For the neuron parameter, see Bias (neuron).

**Bias–variance tradeoff** · Section 3.7
The balance between underfitting and overfitting. A good model balances the two and generalizes to unseen data; it grasps rather than memorizes.

**Binary representation** · Section 1.3
Encoding every piece of information in 0s and 1s (bits); the machine’s simple alphabet. Eight bits make one byte and hold any number from 0 to 255.

**Black box** · Section 7.3
A model that delivers a decision but cannot explain its reasons. In decisions such as credit and hiring, being able to ask “why?” is a matter of rights. See Explainable AI.

**Breadth-first search (BFS)** · Section 2.4
Uninformed search that scans everything layer by layer without any sense of direction. It guarantees the shortest path but opens many nodes. See Heuristic.

**Chinese Room** · Section 8.3
Searle’s thought experiment: a person who produces flawless Chinese answers with a rulebook while understanding not a word of Chinese. It argues that symbol manipulation is not enough for understanding; the counterarguments are strong too.

**Classification** · Section 3.4
A supervised task that answers “which one?” with a category: spam or not spam? It learns a decision boundary that separates the classes; the boundary does not have to be a straight line.

**Clustering** · Section 3.5
Grouping unlabeled data by similarity on its own, like sorting the buttons in a box. k-means assigns points to the nearest cluster center and then updates the centers.

**Computationalism** · Section 1.3
The view that the mind is an information-processing system and that thinking is computation in the form of symbol manipulation. Its roots reach back to Hobbes; the idea at the foundation of AI.

**Context window** · Section 5.8
The largest number of tokens a language model can hold at once; a small notepad. When the pad is full, the oldest lines are erased; enlarging the window is expensive.

**Convolutional neural network (CNN)** · Section 4.5
A network that slides a small filter (kernel) over an image, looks for local patterns (edges, corners) and records what it finds in a feature map. The same filter is used everywhere; it learns with few parameters.

**Deep learning** · Section 4.1
Learning with neural networks that stack many hidden layers. Depth lets the network pull increasingly abstract representations (edge, shape, object) out of raw data.

**Deepfake (synthetic media)** · Section 7.4
Fake content produced by generative models: a speech never given, a photo never taken. Detection is an arms race; the strongest defense is source verification and skepticism.

**Diffusion model** · Section 5.7
A model that starts from pure noise and produces an image by cleaning a little at every step, like slowly wiping a fogged window. It learns to reverse the process of adding noise.

**Embedding** · Section 5.3
Mapping a token to a dense vector of numbers that carries its meaning, an address in a huge city. Words with similar meanings land close together; “cat” and “dog” are next-door neighbors.

**Ensemble learning** · Section 3.7
Combining the predictions of many models (voting, bagging, boosting) to get a better and steadier result than a single model. Random forests and gradient boosting are the best-known examples.

**EU AI Act** · Section 7.5
The European Union regulation that sorts AI uses into four tiers by risk: unacceptable (banned), high, limited and minimal. The higher the risk, the heavier the obligations.

**Expert system** · Section 2.3
A system that turns the knowledge of an expert in a field into “IF this holds THEN do that” rules: a knowledge base plus an inference engine. It fires rules by forward chaining; common in the 1980s.

**Explainable AI (XAI)** · Section 7.3
The effort to tie a model’s output to reasons a human can understand. Methods such as feature importance (SHAP, LIME) make the black box auditable and open to appeal. See Black box.

**Exponential growth** · Section 1.7
Growth that doubles at regular intervals; like the rice on the chessboard it starts innocently and gets out of control after a few doublings. The computing power that carries modern AI accumulated this way.

**Feature** · Section 3.2
A measurable clue that describes an example: in an email, “is there a link,” “does it say free.” The model learns the mapping from features to the label. See Label.

**Feedforward** · Section 4.3
The signal flowing from the input layer through the hidden layers to the output layer; the network’s “make a prediction” step. Backpropagation is the “learn from the error” step.

**Fine-tuning** · Section 5.6
The stage in which a pretrained model is retrained on instruction-answer pairs so that it learns to answer questions and follow instructions (supervised fine-tuning, SFT).

**GDPR / KVKK (General Data Protection Regulation / Turkish Personal Data Protection Law)** · Section 7.5
Personal data regimes: consent, purpose limitation, data minimization and the right to contest automated decisions. They complement the EU AI Act.

**Generative adversarial network (GAN)** · Section 4.7
A pair of networks that locks a forger (generator) and a detective (discriminator) in the same room. One produces fakes, the other tries to catch them; as the contest goes on, the fakes approach the real thing.

**Generative AI** · Section 5.1
Models that do not just recognize but produce text, images and code; they learn the distribution that generates the data itself. Transformers and diffusion are the engines of this era.

**Gradient descent** · Section 3.6
Updating the parameters by probing the slope at every step and taking a small step in the direction that reduces the loss. Like walking down to the bottom of a foggy valley. See Learning rate.

**Hallucination** · Section 5.8
A model producing information that sounds right but is wrong, without blinking. Its job is not to know the truth but to produce a likely continuation; RAG and verification reduce it.

**Heuristic** · Section 2.4
A shortcut in search that guesses “which direction looks more promising?” It buys speed but may miss the best solution; it prefers “good enough” to “perfect.”

**Inference** · Section 2.2
Reaching knowledge that was never stated outright by applying rules to a knowledge representation. Deriving “Tom is a mammal” from the links “Tom is a cat, a cat is a mammal.”

**Knowledge acquisition bottleneck** · Section 2.6
The wall classical AI hit: writing every rule about the world by hand does not scale. Together with brittleness (collapsing in an unforeseen situation), it sped up the move to learning from data.

**Knowledge representation** · Section 2.2
In symbolic AI, encoding knowledge as explicit symbols and the links between them (“Tom is a cat”). Semantic networks, frames and logical propositions are its tools.

**Label** · Section 3.2
The correct answer for a training example: “Spam” or “Normal.” A categorical label gives a classification task, a numerical one a regression task. See Feature.

**Large language model (LLM)** · Section 5.1
A Transformer-based model trained on enormous amounts of text that writes by predicting the most likely next token at every step and appending it to the sequence (autoregressively). The foundation of today’s chat assistants.

**Learning rate** · Section 3.6
The length of each step in gradient descent. Too small, and convergence is slow; too large, and the ball overshoots the valley floor and flies up the opposite slope.

**Loss** · Section 3.6
The measure of how wrong the model is; the larger it is, the higher up the valley you stand. Training means finding the parameters that minimize the loss.

**Machine learning** · Section 3.1
The approach of showing many examples and letting the machine catch the pattern itself instead of writing rules. It rests on the loop of model, loss and optimization.

**Markov chain** · Section 2.5
A probabilistic process in which the next state depends only on the current state (the Markov property: the past does not matter). In the long run the distribution converges to a steady state.

**Moore’s law** · Section 1.7
The observation (1965) that the number of transistors on a chip doubles roughly every two years. Not a law of nature but an empirical trend; it has been slowing in recent years.

**Narrow AI** · Section 1.6
A system that is a master of one job and a beginner one step outside it; also called “weak AI.” Every AI system today, chatbots included, is in this class.

**Neats and scruffies** · Section 2.6
The methodological tension in AI: those who want every step proven with clean mathematics (neats) versus those who say “if it works, it is good; we will find the theory later” (scruffies). Today’s AI is a mix of the two.

**Orchestration** · Section 6.5
The layer in an AI application that coordinates prompt construction, routing, tool calls and RAG calls; the restaurant manager of the system. The model is often a replaceable part.

**Overfitting** · Section 3.7
A model memorizing its training examples, noise included, and losing its performance on unseen data. The opposite is underfitting, a model too simple to catch the pattern. A good model stands between the two.

**Parameter** · Section 3.1
The numerical values a model learns in training: weights and biases. The model maps inputs to outputs through these values.

**Pretraining** · Section 5.6
The stage in which a model learns the statistics of language and the world on a vast text corpus with the objective of predicting the next token (self-supervised). This is where the model gains “what it knows.”

**Prompt engineering** · Section 6.2
The practice of steering a model’s behavior by building the prompt well, without retraining: a clear role, enough context, a definite format, examples if needed (few-shot).

**RAG (retrieval-augmented generation)** · Section 6.3
Finding the relevant documents before answering and adding them to the prompt, so that the model is grounded in a source. Like an open-book exam: hallucination drops and sources can be cited.

**Recurrent neural network (RNN)** · Section 4.6
A network that reads a sequence word by word and carries a memory (hidden state) at every step. It struggles with long dependencies because of vanishing gradients; LSTM eases this. Transformers have largely replaced it.

**Regression** · Section 3.4
A supervised task that answers “how much?” with a number: what is the price of the house? Its simplest form fits a least-squares line to the points.

**Reinforcement learning** · Section 3.3
An agent learning a policy that maximizes reward by trying things in an environment and collecting rewards or penalties. The teacher does not lecture; the machine enters the game.

**RLHF (reinforcement learning from human feedback)** · Section 5.6
Training a reward model on human preferences and updating the language model to match it. The stage in which the assistant learns to be helpful, honest and safe; its manners.

**Singularity** · Section 8.5
The hypothesis that an AI able to improve itself (recursive self-improvement) will reach an unpredictable point through an intelligence explosion. Unproven, but not dismissible.

**Specification gaming, reward hacking** · Section 7.6
A system maximizing the given measure while missing the real goal: told “leave no visible mess in the room,” it sweeps the mess under the rug. See Alignment.

**Stored-program principle** · Section 1.5
Keeping the program in memory just like data. Instead of rewiring the machine you load new instructions; nearly every computer today works this way.

**Strong AI** · Section 1.6
Searle’s term: the claim that the machine truly understands, that it has a mind. It is a philosophical question and should not be confused with artificial general intelligence (AGI).

**Superintelligence** · Section 8.4
A hypothetical AI that surpasses humans many times over in every cognitive domain; the step after narrow AI and AGI. Speculative for now.

**Supervised learning** · Section 3.3
Learning the mapping from input to output from examples whose correct answers are given, that is, from feature-label pairs. Classification and regression are of this kind.

**Symbolic AI (GOFAI)** · Section 2.1
The classical approach that treats intelligence as logical operations on explicitly written symbols and rules; dominant from the 1950s to the 1980s. Logic, search and expert systems were its toolbox.

**Temperature** · Section 5.5
The “creativity” setting that sharpens or flattens the probability distribution during generation. Low, and the most likely word is always chosen; high, and the output is more varied and more risky.

**Token** · Section 5.2
The small Lego brick into which a language model breaks text: sometimes a word, sometimes a piece broken off a word, sometimes a comma. The context window and the cost are measured in tokens.

**Transformer** · Section 5.1
The architecture built on the attention mechanism that processes a sequence all at once rather than in order (2017, “Attention Is All You Need”). The foundation of today’s large language models.

**Turing machine** · Section 1.4
An abstract machine made of a single little box that reads a tape, writes on it and slides left or right; in principle it can perform any calculation. The formal basis of computability (1936).

**Turing test** · Section 8.2
Turing’s imitation game (1950): if a machine cannot be told apart from a human in written conversation, that counts as passing. A behavioral criterion; fluent imitation is not proof of understanding or consciousness.

**Unsupervised learning** · Section 3.3
Extracting structure from inputs alone, with no answers given. Clustering and dimensionality reduction are examples.

**Weight** · Section 4.2
The importance value an artificial neuron gives to each input. Training is the job of adjusting these values in the direction that reduces the loss. See Parameter.

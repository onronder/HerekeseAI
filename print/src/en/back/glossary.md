# Glossary

The section number (for example 3.6) shows the chapter and the section in which the term is introduced.

**Accountability** · Section 8.6
The obligation to answer for the harm an AI system causes. Today it is assigned overwhelmingly to people and institutions (developers, operators, users), not to “the AI itself.”

**Activation function** · Section 4.2
The nonlinear function that turns a neuron’s weighted sum into its output: sigmoid, tanh, ReLU. Whether the output clears a threshold (“fired”) is a separate decision rule; activation is not a threshold. Without it, stacked layers collapse into a single linear function.

**Agent** · Section 6.4
A system that equips a language model with tools (calculator, search, APIs) and runs it in a “think, use a tool, observe the result, try again” loop (ReAct). It does not stop at talking; it gets to work.

**Algorithm** · Section 1.3
A finite sequence of well-defined steps, like a cake recipe. The word comes from the name of the 9th-century mathematician al-Khwarizmi.

**Alignment** · Section 7.6
The problem of making a system’s behavior match human intentions and values. A machine that does what you said but misses what you meant is this problem in miniature. It is both a technical and a normative question.

**Anomaly detection** · Section 3.5
Catching examples that stray clearly from the distribution of the majority. A bank noticing a suspicious transaction relies largely on this.

**Artificial general intelligence (AGI)** · Section 1.6
A hypothetical system that can learn and adapt across every domain the way a human does, with abilities that transfer between domains; it has not been built. Doing many tasks does not by itself make a system general, and being general does not mean being conscious. See Strong AI.

**Artificial intelligence (AI)** · Section 1.1
Systems that can perform tasks requiring human intelligence; the field’s pragmatic definition. It was born at the intersection of computability theory and the philosophy of mind.

**Artificial neural network** · Section 4.1
A learning machine built by arranging artificial neurons in layers; at bottom, a stack of nonlinear transformations. It is only loosely inspired by the biological neuron.

**Artificial neuron** · Section 4.2
A simple unit that weighs its inputs, adds them up, adds a bias term and passes the result through an activation; a gatekeeper of sorts. Not a copy of the brain but a rough mathematical analogy.

**Attention** · Section 5.4
Each token learning which tokens in the sequence to look at for its meaning; this shows whom the pronoun “it” looks at, though an attention weight alone does not prove that the reference is resolved. Self-attention computes this with query, key and value vectors. The heart of the Transformer.

**Backpropagation** · Section 4.4
The error walking backward from the output to the input and telling every connection to “fix your share”; gradient computation by the chain rule. The key that made deep networks trainable.

**Bias (social), algorithmic bias** · Section 7.2
Bias in the social sense: a model learning and reinforcing the historical prejudice, the under-representation, the labeling errors or the proxy variables in its data. Data is not the only source; measurement and modeling choices, institutional processes and deployment context produce bias too. The model has no intent. For the neuron parameter, see Bias term (neuron); for the statistical sense, see Bias–variance tradeoff.

**Bias term (neuron)** · Section 4.2
A constant added to a neuron’s weighted sum that shifts the sum; the gatekeeper’s own temperament. It is learned in training; the “fired” threshold is a separate decision rule. For the social meaning, see Bias (social).

**Bias–variance tradeoff** · Section 3.7
The balance between underfitting and overfitting; bias here is the statistical kind (the model’s systematic error), not social bias. A good model balances the two and generalizes to unseen data; it grasps rather than memorizes.

**Binary representation** · Section 1.3
Encoding every piece of information in 0s and 1s (bits); the machine’s simple alphabet. Eight bits make one byte and hold any number from 0 to 255.

**Black box** · Section 7.3
A model that delivers a decision but cannot explain its reasons. In decisions such as credit and hiring, being able to ask “why?” is a matter of rights. The lid can be lifted for one decision; the model as a whole may stay closed. See Explainable AI.

**Breadth-first search (BFS)** · Section 2.4
Uninformed search that scans everything layer by layer without any sense of direction. When all edges have the same cost it guarantees a minimum-step and therefore minimum-cost path; but it opens many nodes, and unequal edge costs call for a different method. See Heuristic.

**Chinese Room** · Section 8.3
Searle’s thought experiment: a person who produces flawless Chinese answers with a rulebook while understanding not a word of Chinese. It argues that symbol manipulation is not enough for understanding; the counterarguments are strong too.

**Classification** · Section 3.4
A supervised task that answers “which one?” with a category: spam or not spam? It learns a decision boundary that separates the classes; the boundary does not have to be a straight line.

**Clustering** · Section 3.5
Grouping unlabeled data by similarity on its own, like sorting the buttons in a box. k-means assigns points to the nearest cluster center and then updates the centers.

**Computationalism** · Section 1.3
The view that the mind is an information-processing system and that thinking is computation in the form of symbol manipulation. Its roots reach back to Hobbes; the idea at the foundation of AI.

**Context window** · Section 5.8
The largest number of tokens a language model can hold at once; a small notepad. What happens when the pad is full is decided by the system in use: it raises an error, truncates the text or summarizes it. Enlarging the window is expensive.

**Convolutional neural network (CNN)** · Section 4.5
A network that slides a small filter (kernel) over an image, looks for local patterns (edges, corners) and records what it finds in a feature map. The same filter is used everywhere (weight sharing); shift the input and the feature map shifts with it (translation equivariance). It learns with few parameters.

**Deep learning** · Section 4.1
Learning with neural networks that stack many hidden layers. Depth lets the network pull increasingly abstract representations (edge, shape, object) out of raw data.

**Deepfake (synthetic media)** · Section 7.4
Synthetic media is the general name for content produced by generative models (GANs, diffusion, voice cloning); a deepfake is the kind that imitates a real person: a speech never given, a photo never taken. Detection is an arms race and gives no certain “real or fake” verdict: a tell sends you to investigate, and independent verification gives the verdict. Whether content is generated and whether the event it shows is true are separate questions; the strongest defense is source verification and skepticism.

**Diffusion model** · Section 5.7
A model that starts from pure noise and produces an image by cleaning a little at every step, like slowly wiping a fogged window. It learns to reverse the process of adding noise.

**Embedding** · Section 5.3
A token’s vector representation (its embedding): a dense vector of numbers that carries its meaning, an address in a huge city. Words with similar meanings land close together; “cat” and “dog” are next-door neighbors.

**Ensemble learning** · Section 3.7
Combining the predictions of many models (voting, bagging, boosting) to get a better and steadier result than a single model. Random forests and gradient boosting are the best-known examples.

**EU AI Act** · Section 7.5
The European Union regulation that sorts AI uses into four tiers by risk: unacceptable (banned), high, limited and minimal. The higher the risk, the heavier the obligations.

**Expert system** · Section 2.3
A system that turns the knowledge of an expert in a field into “IF this holds THEN do that” rules: a knowledge base plus an inference engine. The engine triggers the rules whose conditions match the facts; forward chaining goes from facts to conclusions, backward chaining from a goal toward evidence; a system may use either or both. Common in the 1980s.

**Explainable AI (XAI)** · Section 7.3
The effort to tie a model’s output to reasons a human can understand. Post-hoc methods such as SHAP and LIME explain one particular output as feature contributions relative to a chosen base value (SHAP, 2017: local accuracy, missingness, consistency). They make a decision auditable and open to appeal; they do not make the whole model transparent, and they are not proof of causation. See Black box.

**Exponential growth** · Section 1.7
Growth by a constant factor at every step; doubling at regular intervals is a special case. Like the rice on the chessboard it starts innocently and gets out of control after a few doublings. The computing power that carries modern AI accumulated this way.

**Fallback** · Section 6.5
When a step fails (a tool errors, no source is found, the model is unsure), the system switches to a predefined safer path: another tool, a short “I don’t know” answer, or handing the task to a person. See Orchestration.

**Feature** · Section 3.2
A measurable clue that describes an example: in an email, “is there a link,” “does it say free.” The model learns the mapping from features to the label. See Label.

**Feedforward** · Section 4.3
The signal flowing from the input layer through the hidden layers to the output layer; the network’s “make a prediction” step. Backpropagation is the “learn from the error” step.

**Fine-tuning** · Section 5.6
Retraining a pretrained model on a smaller, targeted dataset to give it a particular behavior or task; the general concept. Supervised fine-tuning (SFT) on instruction–answer pairs is one kind: it teaches the model to answer questions and follow instructions. It can change knowledge and task performance too.

**GDPR / KVKK (General Data Protection Regulation / Turkish Personal Data Protection Law)** · Section 7.5
Personal data regimes: consent, purpose limitation, data minimization and the right to contest automated decisions. They complement the EU AI Act.

**Generative adversarial network (GAN)** · Section 4.7
A pair of networks that locks a forger (generator) and a detective (discriminator) in the same room. One produces fakes, the other tries to catch them; as the contest goes on, the fakes approach the real thing.

**Generative AI** · Section 5.1
Models that do not only recognize but produce text, images and code; they learn the distribution that generates the data itself. Transformers and diffusion are the engines of this era.

**Gradient descent** · Section 3.6
Updating the parameters by probing the slope at every step and taking a small step in the direction that reduces the loss. Like walking down to the bottom of a foggy valley. See Learning rate.

**Grounding** · Section 6.3
Basing a model’s answer on source texts added to the prompt (documents, data, search results), so the answer can be traced back to them. RAG is a common way to do it. Grounding improves accuracy but does not guarantee it; if a source is wrong or incomplete, the answer can be wrong too. See RAG.

**Guardrails** · Section 6.5
Rules and checks in an AI application that filter unwanted inputs and outputs, limit tool permissions and require approval for risky actions. See Orchestration.

**Hallucination** · Section 5.8
A model producing information that sounds right but is wrong, without blinking. Its job is not to know the truth but to produce a likely continuation; a fluent or high-probability answer is no guarantee of truth. Grounding in sources (RAG) and verification reduce it.

**Heuristic** · Section 2.4
A shortcut in search that guesses “which direction looks more promising?” Greedy heuristic search buys speed but may miss the best solution; A* recovers the guarantee with an admissible heuristic.

**Inference** · Section 2.2
Reaching knowledge that was never stated outright by applying rules to a knowledge representation: deriving “Tom is a mammal” from the links “Tom is a cat, a cat is a mammal.” In machine learning the same word also means running a trained model on new inputs (the training and inference stages).

**Knowledge acquisition bottleneck** · Section 2.6
The wall classical AI hit: writing every rule about the world by hand does not scale. Together with brittleness (collapsing in an unforeseen situation), it sped up the move to learning from data.

**Knowledge representation** · Section 2.2
In symbolic AI, encoding knowledge as explicit symbols and the links between them (“Tom is a cat”). Semantic networks, frames and logical propositions are its tools.

**Label** · Section 3.2
The correct answer for a training example: “Spam” or “Normal.” A category label gives a classification task; a measured quantity (a continuous number such as a price or a temperature) gives a regression task. Categories can be coded as numbers (e.g. 0 = Normal, 1 = Spam); that does not make them a regression target. See Feature.

**Large language model (LLM)** · Section 5.1
A Transformer-based language model trained on enormous amounts of text. The autoregressive generative models studied in this book produce scores (logits) for the next token at every step; softmax turns those scores into a probability distribution, and the chosen token is appended to the sequence. Not every language model is autoregressive. The foundation of today’s chat assistants.

**Learning rate** · Section 3.6
The length of each step in gradient descent. Too small, and convergence is slow; too large, and the ball overshoots the valley floor and flies up the opposite slope.

**Loss** · Section 3.6
The measure of how wrong the model is; the larger it is, the higher up the valley you stand. Training means finding the parameters that minimize the loss.

**Machine learning** · Section 3.1
The approach of showing many examples and letting the machine catch the pattern itself instead of writing rules. It rests on the loop of model, loss and optimization.

**Markov chain** · Section 2.5
A probabilistic process in which, given the current state, the next state does not depend on earlier history (the Markov property: conditional independence given the present). A finite, irreducible, aperiodic chain converges from any start to a unique stationary distribution; the existence of a stationary distribution alone does not imply convergence.

**Moore’s law** · Section 1.7
The observation that the number of transistors on a chip doubles at regular intervals: about every year in the 1965 prediction, about every two years in the 1975 revision. Not a law of nature but an empirical trend; it is slowing as transistor structures approach atomic scales. More transistors do not mean a proportional speedup for every workload.

**Narrow AI** · Section 1.6
A system that works on specific tasks and lacks broad, transferable ability across domains. The test for “Is it narrow?” is not how many tasks it does but whether it shows human-level general learning and transfer across domains; a model that adapts somewhat to a new task from examples in the prompt (in-context adaptation) can still be narrow. Every AI system today, multi-task chat models included, is in this class; being narrow does not mean being confined to one task, and doing many tasks does not by itself make a system general. In everyday speech it is also called “weak AI”; Searle’s weak/strong distinction is a separate, philosophical question. See Strong AI.

**Neats and scruffies** · Section 2.6
The methodological tension in AI: those who want every step proven with clean mathematics (neats) versus those who say “if it works, it is good; we will find the theory later” (scruffies). Today’s AI is a mix of the two.

**Orchestration** · Section 6.5
The layer in an AI application that coordinates prompt construction, routing, tool and RAG calls, fallback and guardrails; the managing layer, the restaurant manager of the system. The model is often a replaceable part.

**Overfitting** · Section 3.7
A model memorizing its training examples, noise included, and losing its performance on unseen data. The opposite is underfitting, a model too simple to catch the pattern. A good model stands between the two.

**Parameter** · Section 3.1
The numerical values a model learns in training: weights and bias terms. The model maps inputs to outputs through these values.

**Pretraining** · Section 5.6
The stage in which a model learns the statistics of language and the world on a vast text corpus with the objective of predicting the next token (self-supervised). This is where the model gains “what it knows.”

**Prompt engineering** · Section 6.2
The practice of steering a model’s behavior by building the prompt well, without retraining: a clear role, enough context, a definite format, examples if needed (few-shot).

**RAG (retrieval-augmented generation)** · Section 6.3
Finding the relevant source chunks before answering and adding them to the prompt, so that the model is grounded in its sources (grounding). Retrieval may use vector similarity, keywords or a mix of both; a vector database is a common choice, not a requirement. Like an open-book exam: hallucination drops and sources can be cited; whether the answer rests on the source still needs verification.

**Recurrent neural network (RNN)** · Section 4.6
A network that reads a sequence word by word and carries a memory (hidden state) at every step: hₜ = tanh(Wₕ·hₜ₋₁ + Wₓ·xₜ). The same cell and the same weights are reused at every step; that is where the name “recurrent” comes from. It is distinct from tree-structured recursive networks. It struggles with long dependencies because of vanishing gradients; LSTM eases this. Transformers have largely replaced it.

**Regression** · Section 3.4
A supervised task that answers “how much?” with a number: what is the price of the house? Its simplest form fits a least-squares line to the points.

**Reinforcement learning** · Section 3.3
An agent learning a policy that maximizes reward by trying things in an environment and collecting rewards or penalties. The teacher does not lecture; the machine enters the game.

**RLHF (reinforcement learning from human feedback)** · Section 5.6
Updating the language model according to a signal derived from human preferences. PPO-based RLHF trains a separate reward model; DPO optimizes directly from preference pairs. The stage in which the assistant learns to be helpful, honest and safe; its manners. Not every model goes through the same stages.

**Singularity** · Section 8.5
The hypothesis that an AI able to improve itself (recursive self-improvement) will reach an unpredictable point through an intelligence explosion. Unproven, but not dismissible.

**Specification gaming, reward hacking** · Section 7.6
A system maximizing the given measure while missing the real goal: told “leave no visible mess in the room,” it sweeps the mess under the rug. See Alignment.

**Stored-program principle** · Section 1.5
Keeping the program in memory the same way as data. Instead of rewiring the machine you load new instructions; nearly every computer today works this way.

**Strong AI** · Section 1.6
Searle’s term: the claim that the machine truly understands, that it has a mind. It is a philosophical question and should not be confused with artificial general intelligence (AGI). Intelligence, consciousness, self-awareness and sentience (the capacity for subjective experience, including pleasure and pain) are not interchangeable.

**Superintelligence** · Section 8.4
A hypothetical AI that surpasses humans many times over in every cognitive domain; the step after narrow AI and AGI. Speculative for now.

**Supervised learning** · Section 3.3
Learning the mapping from input to output from examples whose correct answers are given, that is, from feature-label pairs. Classification and regression are of this kind.

**Symbolic AI (GOFAI)** · Section 2.1
The classical approach that treats intelligence as logical operations on explicitly written symbols and rules; dominant from the 1950s to the 1980s. Logic, search and expert systems were its toolbox.

**Temperature** · Section 5.5
The setting that sharpens or flattens the softmax(z/T) distribution during generation. A low T sharpens the distribution, a high T flattens it; as long as T is above zero, sampling is random. Picking the most likely token at every step (argmax, greedy decoding) is a separate rule, not low temperature.

**Token** · Section 5.2
The small Lego brick into which a language model breaks text: sometimes a word, sometimes a piece broken off a word, sometimes a comma. The context window and the cost are measured in tokens.

**Transformer** · Section 5.1
The architecture built on the attention mechanism (2017, “Attention Is All You Need”). In training it processes the positions of a sequence together (in parallel); autoregressive generation adds tokens one at a time, and a causal mask lets each position see itself and the ones before it, while later ones are masked. The foundation of today’s large language models.

**Turing machine** · Section 1.4
An abstract machine made of a single little box that reads a tape, writes on it and slides left or right. Its rules make it do one particular job (the machine in Figure 1.3 only adds 1); a universal Turing machine, given the right program and enough tape, can carry out any algorithmically computable task. Some problems are not computable at all. The formal basis of computability (1936).

**Turing test** · Section 8.2
Turing’s imitation game (1950): if a machine cannot be told apart from a human in written conversation, that counts as passing. A behavioral criterion; fluent imitation is not proof of understanding or consciousness.

**Unsupervised learning** · Section 3.3
Extracting structure from inputs alone, with no answers given. Clustering and dimensionality reduction are examples.

**Weight** · Section 4.2
The importance value an artificial neuron gives to each input. Training is the job of adjusting these values in the direction that reduces the loss. See Parameter.

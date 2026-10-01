# Chapter 3
## How Machines Learn
*From rules to patterns*

<!-- acc #1d6149 · tag Statistical AI -->

### 3.1 How do machines learn?

How would you teach a child what a cat is? By writing rules, “four legs, whiskers, a tail...”? No; you point at cats, and the child works out the rest. The last chapter ran into the wall of rule-writing. So what if machines could learn the way children do?

That is the entire idea of machine learning: show plenty of examples and let it catch the pattern itself. This chapter goes behind the curtain: how is the data prepared, and how does a model grow a little more skillful with every try? You will see it all happen step by step.

> **Margin note.** Classical AI: “Here are the rules, apply them.” Machine learning: “Here are the examples, find the rule yourself.” This small idea made all of modern AI possible.

#### Technical depth

Machine learning (ML) learns a function from statistical patterns in data instead of explicitly programmed rules. Where classical AI asks “how do we represent knowledge?” ML asks “how do we estimate the input-to-output mapping from data?”

The basic setup: a model maps inputs to outputs through its parameters (weights); a loss function measures how wrong the predictions are; an optimization method (e.g. gradient descent) updates the parameters to reduce the loss. This chapter builds that loop and the core task types.

Learning from examples starts with knowing what an example is. When you hand a machine an “example,” what are you giving it?

### 3.2 Features and labels

Picture a detective: clues in one hand, and the case’s final verdict in the other. A machine learning from examples looks at the same pair. The clues are called features: measurable facts describing an example. The verdict is called the label. For an email the clues might be “word count,” “link or password request,” “mentions free”; the label is “Spam” or “Normal.”

Reading hundreds of solved cases, the model learns which clue travels with which verdict. Each example in Figure 3.1 shows its clues and its correct answer.

> **Margin note.** “Garbage in, garbage out” applies here too: if the features are poor, even the best model can’t learn. Understanding the data often matters more than choosing the model.

**Figure 3.1 · See the features and the label**
![Figure 3.1](../../figures/out/en/figure-3-1-spam.svg)

*Setup.* The figure shows four short emails and three cues for each one: does it mention “free,” is there a link or password request, does it use urgent language. A link or password request means the email asks the reader to open a link or hand over a password. A filled mark (✓) means the cue is present; an open circle (○) means it is absent. The three cue columns are headed “Features (input).” The rightmost column, headed “Label (output),” gives the correct answer: Spam or Normal. All four examples are in the table below.

*Step by step.*

| # | Email | mentions “free” | link or password request | urgency language | Label |
|---|---|---|---|---|---|
| 1 | “You won a free iPhone! Click now” | ✓ | ✓ | ✓ | Spam |
| 2 | “Meeting tomorrow at 10:00” | ○ | ○ | ○ | Normal |
| 3 | “URGENT: your account will close, enter your password” | ○ | ✓ | ✓ | Spam |
| 4 | “I’ve attached the draft report” | ○ | ○ | ○ | Normal |

1. Read the table row by row. Each row is one example: the three cue columns are that example’s features, the last column is its label. The model sees only this pair, never the email itself.
2. Email 1 carries all three cues, and its label is Spam. Email 3 never says “free,” but it asks for a password and hurries you. It is Spam too.
3. Emails 2 and 4 carry none of the three cues. Both are Normal.
4. Then compare the cue columns with the label. When the cue count is zero, the label is always Normal; when it is two or three, always Spam. “Free” alone does not decide: email 3 came out Spam without it. The link or password request and the urgent language, though, are present in both Spam examples.
5. Nobody wrote this relation; you read it off the table. The model does the same, only with thousands of rows instead of four. The “two cues means spam” rule drawn from four rows is a provisional guess; a fifth example could break it.

*What is happening?* An email’s clues (features) and its correct answer (label) sit side by side: mentions of “free,” a link or password request, urgent language... Seeing many examples, the machine learns by itself which clues go with “Spam”; nobody writes the rule, it draws it from the examples.

*Try it yourself.* 1) Mark the three cues of the email “Your password has expired; if you do not renew it today, your account will be deleted.” By the relation in the table, what is its label? 2) The email “Free coffee, let’s meet in the kitchen tomorrow at noon” is in fact Normal. If this row is added to the table, should the model trust the “free” cue more, or less? 3) Write a rule that agrees with all four rows. Does your rule also work on the email in question 2? Live demo: [QR 3.1]

#### Technical depth

In supervised learning, each example is a pair of a feature vector x and a label y. Features can be numeric or categorical; the model tries to learn the mapping f(x) ≈ y. Good feature engineering is one of the most decisive steps for performance in classical ML.

The label’s type sets the task: a categorical label → classification, a quantitative (continuous) label → regression. Categories may be coded as numbers; that does not make them regression targets. Figure 3.1 builds intuition for telling spam from normal email with simple features.

Feature vector x = [mentions “free”; link or password request; urgency language], label y = “Spam.” In supervised learning the model tries to estimate the mapping f(x) ≈ y from these (x, y) pairs, i.e. a decision rule like P(spam | x).

In the spam example every email came with its correct answer. Can a machine learn without an answer key, or with no teacher at all?

### 3.3 Three kinds of learning

The school of machines has three kinds of teacher. The first walks around with an answer key: “this is spam, this isn’t” (supervised). The second gives no answers at all: “you sort it out,” and the machine groups the data itself (unsupervised). The third never lectures; the machine enters the game and collects rewards and penalties as it tries (reinforcement).

Now take each task below to the right teacher. For each, ask: Is there an answer key, is the machine sorting alone, or is it learning by trying?

> **Margin note.** Hint: “Are correct answers given?” → Supervised. “Is the machine grouping on its own?” → Unsupervised. “Is it trying things and collecting reward?” → Reinforcement.

**Figure 3.2 · Which kind of learning?**
![Figure 3.2](../../figures/out/en/figure-3-2-classify.svg)

*Setup.* The figure shows six tasks and three columns: Supervised, Unsupervised, Reinforcement. Next to each task sit three empty boxes, one per column; you mark the right one in pencil. There is no worked solution; the answers, with their reasons, are at the back of the book.

*Self-test.* For each task, ask three questions in order. Are the correct answers given up front? Is the machine grouping the data on its own? Or is it trying things and collecting reward? Then mark one of the three boxes.

| # | Example | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|---|
| 1 | Telling cats from dogs using labeled photos | ☐ | ☐ | ☐ |
| 2 | Grouping customers by similarity | ☐ | ☐ | ☐ |
| 3 | A robot learning to walk by trial and error | ☐ | ☐ | ☐ |
| 4 | Predicting house prices from past (labeled) data | ☐ | ☐ | ☐ |
| 5 | Learning to achieve a high score by playing a game | ☐ | ☐ | ☐ |
| 6 | Clustering unlabeled news by topic | ☐ | ☐ | ☐ |

Once all six are marked, look back at the list. Three of the tasks say “labeled” or “unlabeled” outright; in the others, what told you whether a label exists? And tasks 3 and 5 have something in common: where does the correct answer come from in each? Each column gets two tasks, and that is by design.

*What is happening?* There are three ways to teach a machine: show it the right answers (supervised), give no answers and let it group things itself (unsupervised), or let it try and collect reward/penalty (reinforcement). Place each task on the right path.

*Try it yourself.* 1) Put these three tasks into the same three columns. A translation program learning from millions of translations made by humans; a chess program growing stronger by playing against itself; a supermarket finding “bought together” product groups from its receipts. 2) Turn the three questions of the self-test into a decision tree: which question comes first, and at which answer do you stop? 3) Write a task that fits two columns at once, and use it to explain the sentence “these boundaries are not sharp” from the technical text. Live demo: [QR 3.2]

#### Technical depth

Supervised learning learns f(x) ≈ y from labeled (x, y) pairs (classification/regression). Unsupervised learning extracts structure from x alone (clustering, dimensionality reduction). Reinforcement learning is an agent learning a policy that maximizes a reward signal in an environment.

These boundaries are not sharp: semi-supervised and self-supervised learning sit in between. Modern large language models are largely trained with self-supervised pretraining, generating the labels from the data itself. Sort the tasks of Figure 3.2 into the three core types.

Two tasks landed in the Supervised column: telling cats from dogs and predicting house prices. Both come with labels, yet one asks for a category and the other for a number. What does that difference change?

### 3.4 Classification and regression

Supervised learning asks two basic questions. One says “how much?”: What does this house cost? That is regression; its answer is a number. The other says “which one?”: Is this email spam or not? That is classification; its answer is a category.

Try both yourself below. In regression you’ll find the “best line” through the middle of the points; in classification you’ll draw a border between the two groups.

> **Margin note.** Simple rule: if the model predicts a quantity it’s regression, if it picks a category it’s classification. “How much?” is regression, “Which one?” is classification; a category stays a category even when it is coded as a number.

**Figure 3.3 · Two core tasks**
![Figure 3.3](../../figures/out/en/figure-3-3-scatter.svg)

*Setup.* The figure shows the two tasks side by side. On the left, “Regression (number)”: nine points and the best line fitted to them. On the right, “Classification (category)”: five dark points, five orange points and the boundary drawn between them. The top square of each panel shows the raw data; the bottom square shows the line or the boundary drawn in.

*Step by step.*

1. The regression data is nine points: (1, 1.4), (2, 1.9), (3, 2.2), (4, 3.1), (5, 3.3), (6, 4.2), (7, 4.5), (8, 5.4), (9, 5.6). As x grows, y grows, but the points do not sit on a single line.
2. The least-squares line comes from two means: the x values average 5, the y values 3.51. Slope m = 33 / 60 = 0.55; intercept b = 3.51 − 0.55 · 5 = 0.76. The line: y = 0.55x + 0.76.
3. How close is the line to each point? The measure is the vertical gap at the same x: the observed y minus the y the line gives. That gap is called the residual; it is not the shortest (perpendicular) distance to the line. At x = 3 the line says 2.41, the point is 2.2; the residual is −0.21. At x = 8 the line says 5.16, the point is 5.4; the residual is +0.24. None of the nine residuals exceeds 0.25. The sum of the squared residuals is 0.22.
4. Why is this sum the measure of “best”? Take a line drawn by eye, y = 0.5x + 1: the sum of squared vertical residuals rises to 0.37. Among all possible lines, the least-squares line is the one that makes this sum smallest.
5. The classification data is two groups. Dark: (1.5, 1.5), (2, 2.2), (2.6, 1.7), (3.1, 2.6), (1.9, 3). Orange: (6.5, 4.5), (7, 5.3), (7.6, 4.6), (6.9, 5.8), (8, 5.1).
6. The boundary is the line through the points (1, 5.5) and (8.5, 1): y = 6.1 − 0.6x. Check: at x = 3.1 the boundary says 4.24; the dark point at 2.6 is below it. At x = 6.5 it says 2.2; the orange point at 4.5 is above it. All ten points are on the right side.
7. Two answers, two kinds. Regression gives a number: for x = 10, 0.55 · 10 + 0.76 = 6.26. Classification gives a side: below the boundary is the dark group, above it the orange group.

*What is happening?* Two core jobs. Regression predicts a number: the “best line” runs between the points; the best line is the one that makes the sum of the squared vertical gaps, each point’s gap at its own x, as small as possible. Classification draws a border separating one group from the other.

*Try it yourself.* 1) By the line y = 0.55x + 0.76, what is the prediction for x = 6.5? 2) On which side of the boundary does the point (4.5, 3.5) fall: dark or orange? And (5, 3)? 3) Add a far-off point such as (9, 9) to the regression data. Does the slope go up or down? Is it a problem that the line chases a single point? Live demo: [QR 3.3]

#### Technical depth

Regression predicts a continuous target; its simplest form is the least-squares line minimizing the sum of squared errors. Classification predicts a categorical target and learns a decision boundary separating the classes (e.g. logistic regression, support vector machines).

Figure 3.3 fits a least-squares line for regression and shows a linear decision boundary separating two clusters for classification. In reality, decision boundaries need not be linear.

The closed form of the least-squares line: m = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)², b = ȳ − m·x̄. For the data of Figure 3.3 the numerator is 33 and the denominator 60. The quantity minimized is the sum of squared vertical residuals, Σ(yᵢ − m·xᵢ − b)², not the perpendicular distance to the line.

So far every point came with its label or its number. Take the labels away and nothing is left but the points. Can the machine still find an order in them?

### 3.5 Clustering and anomalies

Imagine being handed a huge box of buttons and told “sort these.” Nobody says which belongs where; still, you put like with like. That is clustering: the machine groups unlabeled data by similarity, all by itself. And there are always a few odd buttons that fit nowhere; anomaly detection catches those. It is one of the tools banks use to catch a suspicious transaction.

The points in Figure 3.4 carry no labels at all. The machine sorts them into two clusters by nearest center. The point far from both clusters is marked as the outlier.

> **Margin note.** What unsupervised learning can do: without anyone saying “these belong together,” the machine finds the structure itself. Anomaly detection is one of the tools banks use in fraud analysis.

**Figure 3.4 · Group unlabeled data**
![Figure 3.4](../../figures/out/en/figure-3-4-kmeans.svg)

*Setup.* The figure shows eleven gray points and two ✕ marks. The ✕ marks are the cluster centers: center A at the top left (2.5, 7), center B at the bottom right (7, 3). The left square, “before: unlabeled points,” is the state before grouping; every point is the same gray. In the right square, “after: nearest-center groups,” each point has taken the color of its nearest center, and one point is marked as the “outlier.” In this illustration both centers and the outlier are chosen in advance; the machine only computes the distances.

*Step by step.* Grouping rests on a single question: which center is this point closer to? The distance comes from Pythagoras: √((x − xₘ)² + (y − yₘ)²). The outlier rule is fixed in advance: a point farther than 2.4 from its nearest center counts as an outlier and joins no cluster. The order is: first assignment, then the threshold, then the center update with the remaining members.

| # | Point | Distance to A | Distance to B | Cluster |
|---|---|---|---|---|
| 1 | (1.5, 7.5) | 1.12 | 7.11 | A |
| 2 | (2, 6.5) | 0.71 | 6.10 | A |
| 3 | (3, 7.8) | 0.94 | 6.25 | A |
| 4 | (2.8, 6.2) | 0.85 | 5.28 | A |
| 5 | (1.8, 8) | 1.22 | 7.21 | A |
| 6 | (7.5, 3.2) | 6.28 | 0.54 | B |
| 7 | (6.5, 2.5) | 6.02 | 0.71 | B |
| 8 | (7.8, 3.8) | 6.19 | 1.13 | B |
| 9 | (6.8, 4) | 5.24 | 1.02 | B |
| 10 | (8, 2.8) | 6.92 | 1.02 | B |
| 11 | (5, 8.5) | 2.92 | 5.85 | outlier |

1. Point 1, (1.5, 7.5): to A, √(1² + 0.5²) = 1.12; to B, √(5.5² + 4.5²) = 7.11. A is far closer; the point goes to A.
2. Point 9, (6.8, 4): to A, √(4.3² + 3²) = 5.24; to B, √(0.2² + 1²) = 1.02. It goes to B.
3. Point 4, (2.8, 6.2): 0.85 against 5.28, A again. Do the same calculation for the first ten points; in every one, the two distances differ by a factor of at least five. The decision is never hard.
4. Point 11, (5, 8.5), is different. Its nearest center is A, but the distance is 2.92, above the threshold of 2.4. The other members of A are at most 1.22 from their center; this point is more than twice as far. It is 5.85 from B. By the rule it is an outlier and joins no cluster.
5. That was a single round. Next comes the center update: with the outlier left out, the new center of A is the mean of points 1 to 5, (2.22, 7.2). That is only 0.34 from the old center; the clusters have already settled. One caution: standard k-means knows nothing about outliers; it assigns point 11 to A as well, and the center of A becomes (2.68, 7.42) with six members. The exclusion here is the result of the threshold rule we set.

*What is happening?* The points carry no labels at all. The machine ties each point to its nearest center (✕); similar ones end up in the same cluster. The lone point far from both clusters gets flagged as an “outlier” (an odd example).

*Try it yourself.* 1) Compute the new center of cluster B: the mean x and mean y of points 6 to 10. How far did it move from the old center (7, 3)? 2) If the point (4.5, 5.5) were added to the data, which center would it go to? Looking at its distance, would you count it as an outlier? 3) The clustering used no labels at all. The “outlier” decision, though, rests on a number and a threshold: which ones, and who chose the threshold? Live demo: [QR 3.4]

#### Technical depth

Clustering discovers groups by similarity without labels; methods like k-means assign points to the nearest centroid and update the centroids. Anomaly (outlier) detection identifies examples that deviate markedly from the majority distribution.

Figure 3.4 shows k-means’ “assignment” step by assigning points to the nearer of two fixed centroids; it also highlights an outlier far from both clusters. Real k-means updates the centroids iteratively until convergence. In this illustration the cluster centers and the outlier are predefined; a real system needs a method and a threshold for detecting anomalies.

The two steps as formulas: assignment c(i) = argminₖ ‖xᵢ − μₖ‖², update μₖ ← the mean of the points assigned to cluster k. In Figure 3.4, once the outlier is excluded by the threshold rule, one update moves center A from (2.5, 7) to (2.22, 7.2) and center B from (7, 3) to (7.32, 3.26); a second assignment round changes no point, and the algorithm has converged. Without the threshold, standard k-means assigns point 11 to A; the center of A becomes (2.68, 7.42) with six members, and the point stays in A in the second round.

In clustering the center moved once and the job was done. How does a model with millions of parameters take its “correct a little” step?

### 3.6 How a model improves: loss and gradient descent

How does a model get “better”? First you measure how wrong it is; that is the loss. Now picture yourself in a fog-covered valley. The bigger the loss, the higher up you stand; your goal is the valley floor. The fog hides the path, but one thing you can still feel: the slope under your feet.

Gradient descent is that walk: feel the slope, take a small step downhill, repeat. In the left panel of Figure 3.5 the ball descends step by step and the loss melts away. And if your stride is too long? The right panel shows what happens.

> **Margin note.** Learning is this: ask “how wrong am I?”, correct a little, repeat, millions of times over. Most of today’s models, neural networks above all, are trained this way, with gradients; some methods, such as decision trees, learn another way.

**Figure 3.5 · Descending the loss valley**
![Figure 3.5](../../figures/out/en/figure-3-5-descent.svg)

*Setup.* The valley is a parabola: L(x) = 0.18·(x − 5)² + 0.1. The horizontal axis is the model’s single parameter x; the vertical axis is the loss. The floor is at x = 5, where the loss is 0.1. The ball starts at x₀ = 0.6, on the left slope, where the loss is 3.58. The left panel shows six steps at the low learning rate (η = 0.18), the right panel six steps at the high rate (η = 4.6).

*Step by step.* The rule is the same at every step: x ← x − η·L′(x). The slope is L′(x) = 0.36·(x − 5): negative to the left of the floor, positive to the right. Subtracting a negative slope makes x larger, so the ball moves right, that is, downhill.

| step | x (η = 0.18) | L(x) | x (η = 4.6) | L(x) |
|---|---|---|---|---|
| 0 | 0.60 | 3.58 | 0.60 | 3.58 |
| 1 | 0.89 | 3.15 | 7.89 | 1.60 |
| 2 | 1.15 | 2.77 | 3.11 | 0.75 |
| 3 | 1.40 | 2.43 | 6.24 | 0.38 |
| 4 | 1.63 | 2.14 | 4.19 | 0.22 |
| 5 | 1.85 | 1.88 | 5.53 | 0.15 |
| 6 | 2.06 | 1.66 | 4.65 | 0.12 |

1. Low rate, step 1: the slope is 0.36·(0.6 − 5) = −1.58. New x = 0.6 − 0.18·(−1.584) = 0.6 + 0.285 ≈ 0.89. The loss fell from 3.58 to 3.15.
2. Low rate, steps 2 to 6: each step is a little shorter than the last: 0.29, 0.26, 0.25, 0.23, 0.22, 0.21. The slope shrinks as the floor nears. After six steps x = 2.06, loss 1.66. The floor is still far off; bringing x within 0.1 of it takes close to sixty steps. Safe, but slow.
3. High rate, step 1: the same slope, but the step is 4.6·1.584 ≈ 7.29 units. The ball misses the floor and flies up the far slope to x = 7.89. The loss still fell: 1.60.
4. High rate, steps 2 to 6: the slope is now positive (+1.04), so the ball jumps left, to 3.11. Then 6.24, 4.19, 5.53, 4.65. Once right of the floor, once left: oscillation. Each jump is 0.66 times the one before, so the swings die down and the ball still closes in on the floor. Loss: 0.12.
5. Compare: after six steps the low rate stands at 1.66, the high rate at 0.12. In this valley the big stride won, but it was close to the edge: had η·0.36 passed 2, each jump would have grown and the ball would have flown out of the valley.

*What is happening?* Improving a model is like descending to a valley floor: the bigger the “loss,” the higher up you are. Each step nudges the ball downhill and the loss shrinks. But if the step is too big (a high learning rate), the ball overshoots the bottom and flies up the far slope; the step size matters as much as the direction.

*Try it yourself.* 1) Work out step 7 at the low rate: the slope at x = 2.06, the new x and the new loss. 2) Take two steps with η = 6 (η·0.36 = 2.16). Is the ball getting closer to the floor or farther away? 3) Is there a learning rate that reaches the floor of this valley in a single step? Hint: require x − η·0.36·(x − 5) = 5. Live demo: [QR 3.5]

#### Technical depth

Training means adjusting the parameters to minimize a loss function L(θ). Gradient descent moves against the gradient at every step: θ ← θ − η·∇L(θ), where η is the learning rate.

The learning rate is the most delicate dial: too small and convergence is slow; too large and it can oscillate around the minimum or diverge. Figure 3.5 shows descent on a convex loss curve and the overshoot a large learning rate causes. Deep-network loss surfaces are generally nonconvex, and gradient-based methods such as stochastic gradient descent are the norm in training; some models, such as linear regression, have convex losses, and some, such as tree-based methods, do not use gradients at all.

In this quadratic valley the step rule is linear: xₜ₊₁ − 5 = (1 − 0.36·η)·(xₜ − 5). The factor is 0.935 at η = 0.18 (one-directional, slow), −0.656 at η = 4.6 (damped oscillation), and its absolute value exceeds 1 for η > 5.56 (divergence). Every row of the table follows from the previous one through this single factor.

The loss drops toward zero and the model looks better and better. Does zero error on the training data mean zero error on new data, though?

### 3.7 Overfitting and ensembles

You know the class memorizer: word-perfect on every past exam question, lost the moment the question changes a little. Models sometimes learn “too well” in the same way: they memorize the training examples and flunk the new ones. That is overfitting. The opposite exists too: a model too simple to catch the pattern at all (underfitting). A good model stands in between; it doesn’t memorize, it grasps.

Now fit three models to the same data, like three students: the lazy one, the balanced one and the memorizer. Which one, do you think, will answer a question it has never seen?

> **Margin note.** Memorizing isn’t learning. A student who only memorizes past exam questions flunks a new one. A good model learns the pattern underneath, not the examples themselves.

**Figure 3.6 · Same data, three models**
![Figure 3.6](../../figures/out/en/figure-3-6-modelfit.svg)

*Setup.* All three panels hold the same nine points: (1, 3.2), (2, 2.4), (3, 3.0), (4, 2.0), (5, 2.7), (6, 1.7), (7, 2.3), (8, 1.4), (9, 2.0). The overall trend is downward, but the points jump up and down from one x to the next; that is measurement noise. The left panel, “Underfit,” is a straight line; the middle, “Smoother representative curve,” a gently waving curve; the right, “Overfit,” a broken line joining the nine points one by one. Under each panel stands that model’s verdict. The middle curve was not trained on the data; it was drawn by hand for the explanation.

*Step by step.*

1. Underfit: the line y = 3.1 − 0.18x. This line is chosen for the illustration; the least-squares line through all nine points is y ≈ 3.09 − 0.16x, close to it. At x = 5 it says 2.2 against a point at 2.7; the gap is 0.5. At x = 9 it says 1.48 against 2.0. The line runs above one point and below the next; it never follows the jolts. Verdict: “Underfitting: the model is too simple to capture the pattern (high bias).”
2. Smoother representative curve: y = 3.0 − 0.16x + 0.15·sin(0.6x). It says 2.22 at x = 5 and 1.44 at x = 9. It does not chase the zigzag; it carries only the downward trend and a slight wave. Verdict: “Bias–variance balance: neither so simple that it misses the pattern nor so complex that it memorizes the noise.” To call it a good generalizer, its error on data not used for training would have to be measured; the curve was drawn by hand, so that measurement does not exist here.
3. Overfit: the broken line passes through all nine points; the training error is zero. But its shape gives it away: from 5 to 6 it drops by 1.0, from 6 to 7 it rises by 0.6. Those ups and downs are noise, not pattern; a fresh measurement would not repeat them. Verdict: “Overfitting: it passes through every point but memorizes the noise; it fails on new data (high variance).”
4. The exam: hide points 5 and 7 and draw the same broken line through the remaining seven. At x = 5 the line joins (4, 2.0) to (6, 1.7) and says 1.85; the truth is 2.7, an error of 0.85. At x = 7 it says 1.55; the truth is 2.3, an error of 0.75. Do the same for the straight line: fit a line to the remaining seven points by least squares. The result is y ≈ 3.06 − 0.17x; it says 2.19 at x = 5 and 1.85 at x = 7, errors of 0.51 and 0.45. On an unseen question the memorizer does worse than the lazy one.
5. Training error on its own misleads. A model has to be tested on data it has never seen; that is what “validation” means. A fair comparison trains every candidate on the same seven points and tests it on the same two. Here that was done for the broken line and the straight line; the middle curve, drawn by hand, never sat the exam.

*What is happening?* Three different models are fitted to the same data. The too-simple one misses the pattern (underfitting); the too-complex one memorizes every point but stumbles on new data (overfitting). The best is in between: the model that also predicts examples it has never seen. These curves show the idea; which one generalizes well can only be told by the error measured on data not used for training.

*Try it yourself.* 1) What do the three models say for x = 10? Look closely at the broken line. 2) Repeat the hide-and-test exam with points 2 and 8: what errors do the broken line and the straight line make at those two points? 3) The model that passes through all nine points boasts of “zero error.” What does that number prove, and what does it not prove? Live demo: [QR 3.6]

#### Technical depth

Overfitting is when a model also learns the noise in the training data and loses performance on unseen data; underfitting is when it is too simple to capture the pattern. These are the two ends of the bias–variance tradeoff, usually managed with train/validation splits, regularization and cross-validation.

Ensemble learning combines the predictions of many models (voting, bagging, boosting); when their errors complement one another it can improve generalization, but it does not guarantee beating every individual model, and the gain is measured on validation data. Random forests and gradient boosting are the best-known examples.

The hide-and-test exam of Figure 3.6 is a single-fold train/validation split: two points form the validation set, seven the training set. Cross-validation is the k-fold version of this: the data is split into k parts, each part is held out in turn, the rest trains the model and the errors are averaged; holding out each point one at a time (here k = 9) is a special case.

One idea ran through this chapter: grasp the pattern instead of memorizing the examples. The six questions below check whether it stuck.

### 3.8 Test yourself

*Answers are at the back of the book.*
1. What is the core difference between ML and classical AI?
   a) It learns from data instead of hand-written rules
   b) It never makes mistakes
   c) It runs faster
   d) It needs the internet

2. What is an example’s “correct answer” called?
   a) Label
   b) Gradient
   c) Feature
   d) Model

3. Which task groups unlabeled data?
   a) Clustering (unsupervised)
   b) Classification
   c) Reinforcement
   d) Regression

4. What does gradient descent do?
   a) Generates labels
   b) Deletes data
   c) Slows the model
   d) Updates parameters step by step to reduce loss

5. What is overfitting?
   a) Not learning at all
   b) Learning too fast
   c) Memorizing training data and failing on new data
   d) Compressing data

6. How does an agent learn in reinforcement learning?
   a) By reward and penalty, trial and error
   b) From labeled examples
   c) By memorizing rules
   d) By clustering data

### What to keep from this chapter

- Machine learning writes no rules; it draws the rule from the examples itself.
- Every example has two parts: the features that describe it and the correct answer, the label.
- With labels it is supervised learning, without them unsupervised, and with rewards reinforcement learning.
- “How much?” is regression (a house price), “which one?” is classification (spam or not); a category coded as a number is still classification.
- Clustering groups unlabeled data by similarity; a point far from every cluster counts as an outlier by a threshold set in advance.
- Gradient descent measures the loss, reads the slope, takes a small step and repeats this millions of times.
- A model that memorizes the training data flunks new data; a good model grasps the pattern.

<!-- SOURCE-CHANGES
How would you teach a child what a cat is? By writing rules, “four legs, whiskers, a tail...”? No; you point at cats, and the child works out the rest. Last chapter we hit the wall of rule-writing. So what if machines could learn the way children do? ||| How would you teach a child what a cat is? By writing rules, “four legs, whiskers, a tail...”? No; you point at cats, and the child works out the rest. The last chapter ran into the wall of rule-writing. So what if machines could learn the way children do?
That is the entire idea of machine learning: Show plenty of examples and let it catch the pattern itself. Now we step behind the curtain: How is data prepared, and how does a model grow a little more skillful with every try? You will see it all happen step by step. ||| That is the entire idea of machine learning: show plenty of examples and let it catch the pattern itself. This chapter goes behind the curtain: how is the data prepared, and how does a model grow a little more skillful with every try? You will see it all happen step by step.
Reading hundreds of solved cases, the model learns which clue travels with which verdict. Look at an example in Figure 3.1 to see its clues and its correct answer. ||| Reading hundreds of solved cases, the model learns which clue travels with which verdict. Each example in Figure 3.1 shows its clues and its correct answer.
*What is happening?* We lay an email’s clues (features) and its correct answer (label) side by side: mentions of “free,” a link request, urgent language... Seeing many examples, the machine learns by itself which clues go with “Spam”; we never write the rule, it draws it from the examples. ||| *What is happening?* An email’s clues (features) and its correct answer (label) sit side by side: mentions of “free,” a link request, urgent language... Seeing many examples, the machine learns by itself which clues go with “Spam”; nobody writes the rule, it draws it from the examples.
*What is happening?* There are three ways to teach a machine: show it the right answers (supervised), give no answers and let it group things itself (unsupervised), or let it try and collect reward/penalty (reinforcement). Place each task on the right path, and remember: the borders aren’t always sharp. ||| *What is happening?* There are three ways to teach a machine: show it the right answers (supervised), give no answers and let it group things itself (unsupervised), or let it try and collect reward/penalty (reinforcement). Place each task on the right path.
These boundaries are not sharp: semi-supervised and self-supervised learning sit in between. Modern large language models are largely trained with self-supervised pretraining, generating the labels from the data itself. Sort the tasks below into the three core types. ||| These boundaries are not sharp: semi-supervised and self-supervised learning sit in between. Modern large language models are largely trained with self-supervised pretraining, generating the labels from the data itself. Sort the tasks of Figure 3.2 into the three core types.
*What is happening?* Two core jobs. Regression predicts a number: we draw the “best line” that runs through the middle of the points, staying as close to all of them as possible. Classification draws a border separating one group from the other. In short: “how much?” is regression, “which one?” is classification. ||| *What is happening?* Two core jobs. Regression predicts a number: the “best line” runs through the middle of the points, staying as close to all of them as possible. Classification draws a border separating one group from the other.
Imagine being handed a huge box of buttons and told “sort these.” Nobody says which belongs where; still, you put like with like. That is clustering: The machine groups unlabeled data by similarity, all by itself. And there are always a few odd buttons that fit nowhere; anomaly detection catches those. It is how banks catch a suspicious transaction. ||| Imagine being handed a huge box of buttons and told “sort these.” Nobody says which belongs where; still, you put like with like. That is clustering: the machine groups unlabeled data by similarity, all by itself. And there are always a few odd buttons that fit nowhere; anomaly detection catches those. It is how banks catch a suspicious transaction.
The points below carry no labels at all. In Figure 3.4 the machine sorts them into two clusters by similarity, and the odd one out gives itself away. ||| The points in Figure 3.4 carry no labels at all. The machine sorts them into two clusters by similarity, and the odd one out gives itself away.
> **Margin note.** The power of unsupervised learning: without anyone saying “these belong together,” the machine finds the structure itself. Banks’ fraud detection relies heavily on spotting anomalies. ||| > **Margin note.** What unsupervised learning can do: without anyone saying “these belong together,” the machine finds the structure itself. Banks’ fraud detection relies heavily on spotting anomalies.
*What is happening?* The points carry no labels at all. When you press “Group,” the machine ties each point to its nearest center (✕); similar ones end up in the same cluster. The lone point far from both clusters gets flagged as an “outlier” (an odd example); banks catch fraud in much the same way. ||| *What is happening?* The points carry no labels at all. The machine ties each point to its nearest center (✕); similar ones end up in the same cluster. The lone point far from both clusters gets flagged as an “outlier” (an odd example); banks catch fraud in much the same way.
How does a model get “better”? First we measure how wrong it is; that is the loss. Now picture yourself in a fog-covered valley. The bigger the loss, the higher up you stand; your goal is the valley floor. The fog hides the path, but one thing you can still feel: the slope under your feet. ||| How does a model get “better”? First you measure how wrong it is; that is the loss. Now picture yourself in a fog-covered valley. The bigger the loss, the higher up you stand; your goal is the valley floor. The fog hides the path, but one thing you can still feel: the slope under your feet.
Gradient descent is exactly that walk: Feel the slope, take a small step downhill, repeat. Below, lower the ball step by step and watch the loss melt away. And if your stride is too long? Look at what happens in the right panel of Figure 3.5. ||| Gradient descent is that walk: feel the slope, take a small step downhill, repeat. In the left panel of Figure 3.5 the ball descends step by step and the loss melts away. And if your stride is too long? The right panel shows what happens.
> **Margin note.** Learning really is just this: ask “how wrong am I?” correct a little, repeat; millions of times over. Nearly all modern AI, neural networks included, is trained this way. ||| > **Margin note.** Learning is this: ask “how wrong am I?”, correct a little, repeat, millions of times over. Nearly all modern AI, neural networks included, is trained this way.
*What is happening?* Improving a model is like descending to a valley floor: the bigger the “loss,” the higher up you are. Each step nudges the ball downhill and the loss shrinks. But if the step is too big (a high learning rate), the ball overshoots the bottom and flies up the far slope; that is why step size matters. ||| *What is happening?* Improving a model is like descending to a valley floor: the bigger the “loss,” the higher up you are. Each step nudges the ball downhill and the loss shrinks. But if the step is too big (a high learning rate), the ball overshoots the bottom and flies up the far slope; the step size matters as much as the direction.
The learning rate is the most delicate dial: too small and convergence is slow; too large and it can oscillate around the minimum or diverge. In Figure 3.5, follow the descent on a convex loss curve and how a large learning rate causes overshoot. In practice surfaces aren’t convex, and stochastic gradient descent is the norm. ||| The learning rate is the most delicate dial: too small and convergence is slow; too large and it can oscillate around the minimum or diverge. Figure 3.5 shows descent on a convex loss curve and the overshoot a large learning rate causes. In practice surfaces aren’t convex, and stochastic gradient descent is the norm.
*What is happening?* We fit three different models to the same data. The too-simple one misses the pattern (underfitting); the too-complex one memorizes every point but stumbles on new data (overfitting). The best is right in the middle: the model that also predicts examples it has never seen. In short, memorizing isn’t learning. ||| *What is happening?* Three different models are fitted to the same data. The too-simple one misses the pattern (underfitting); the too-complex one memorizes every point but stumbles on new data (overfitting). The best is right in the middle: the model that also predicts examples it has never seen.
Picture a detective: clues in one hand, and the case’s final verdict in the other. A machine learning from examples looks at the same pair. The clues are called features: measurable facts describing an example. The verdict is called the label. For an email the clues might be “word count,” “has a link,” “mentions free”; the label is “Spam” or “Normal.” ||| Picture a detective: clues in one hand, and the case’s final verdict in the other. A machine learning from examples looks at the same pair. The clues are called features: measurable facts describing an example. The verdict is called the label. For an email the clues might be “word count,” “link or password request,” “mentions free”; the label is “Spam” or “Normal.”
The label’s type sets the task: a categorical label → classification, a continuous (numeric) label → regression. The example below builds intuition for telling spam from normal email with simple features. ||| The label’s type sets the task: a categorical label → classification, a quantitative (continuous) label → regression. Categories may be coded as numbers; that does not make them regression targets. The example below builds intuition for telling spam from normal email with simple features.
An email’s clues (features) and its correct answer (label) sit side by side: mentions of “free,” a link request, urgent language... Seeing many examples, the machine learns by itself which clues go with “Spam”; nobody writes the rule, it draws it from the examples. ||| An email’s clues (features) and its correct answer (label) sit side by side: mentions of “free,” a link or password request, urgent language... Seeing many examples, the machine learns by itself which clues go with “Spam”; nobody writes the rule, it draws it from the examples.
Feature vector x = [mentions “free”; has a link; urgency language], label y = “Spam.” In supervised learning the model tries to estimate the mapping f(x) ≈ y from these (x, y) pairs, i.e. a decision rule like P(spam | x). ||| Feature vector x = [mentions “free”; link or password request; urgency language], label y = “Spam.” In supervised learning the model tries to estimate the mapping f(x) ≈ y from these (x, y) pairs, i.e. a decision rule like P(spam | x).
Simple rule: if the output is a number it’s regression, if it’s a label it’s classification. “How much?” is regression, “Which one?” is classification. ||| Simple rule: if the model predicts a quantity it’s regression, if it picks a category it’s classification. “How much?” is regression, “Which one?” is classification; a category stays a category even when it is coded as a number.
Two core jobs. Regression predicts a number: the “best line” runs through the middle of the points, staying as close to all of them as possible. Classification draws a border separating one group from the other. ||| Two core jobs. Regression predicts a number: the “best line” runs between the points; the best line is the one that makes the sum of the squared vertical gaps, each point’s gap at its own x, as small as possible. Classification draws a border separating one group from the other.
Imagine being handed a huge box of buttons and told “sort these.” Nobody says which belongs where; still, you put like with like. That is clustering: the machine groups unlabeled data by similarity, all by itself. And there are always a few odd buttons that fit nowhere; anomaly detection catches those. It is how banks catch a suspicious transaction. ||| Imagine being handed a huge box of buttons and told “sort these.” Nobody says which belongs where; still, you put like with like. That is clustering: the machine groups unlabeled data by similarity, all by itself. And there are always a few odd buttons that fit nowhere; anomaly detection catches those. It is one of the tools banks use to catch a suspicious transaction.
The points below carry no labels at all. Press “Group”; let the machine sort them into two clusters by similarity, and let the odd one out give itself away. ||| The points below carry no labels at all. Press “Group”; let the machine sort them into two clusters by nearest center. The point far from both clusters is marked as the outlier.
What unsupervised learning can do: without anyone saying “these belong together,” the machine finds the structure itself. Banks’ fraud detection relies heavily on spotting anomalies. ||| What unsupervised learning can do: without anyone saying “these belong together,” the machine finds the structure itself. Anomaly detection is one of the tools banks use in fraud analysis.
The demo shows k-means’ “assignment” step by assigning points to the nearer of two fixed centroids; it also highlights an outlier far from both clusters. Real k-means updates the centroids iteratively until convergence. ||| The demo shows k-means’ “assignment” step by assigning points to the nearer of two fixed centroids; it also highlights an outlier far from both clusters. Real k-means updates the centroids iteratively until convergence. In this illustration the cluster centers and the outlier are predefined; a real system needs a method and a threshold for detecting anomalies.
The points carry no labels at all. The machine ties each point to its nearest center (✕); similar ones end up in the same cluster. The lone point far from both clusters gets flagged as an “outlier” (an odd example); banks catch fraud in much the same way. ||| The points carry no labels at all. The machine ties each point to its nearest center (✕); similar ones end up in the same cluster. The lone point far from both clusters gets flagged as an “outlier” (an odd example).
Learning is this: ask “how wrong am I?”, correct a little, repeat, millions of times over. Nearly all modern AI, neural networks included, is trained this way. ||| Learning is this: ask “how wrong am I?”, correct a little, repeat, millions of times over. Most of today’s models, neural networks above all, are trained this way, with gradients; some methods, such as decision trees, learn another way.
The learning rate is the most delicate dial: too small and convergence is slow; too large and it can oscillate around the minimum or diverge. In the demo, watch descent on a convex loss curve and the overshoot a large learning rate causes. In practice surfaces aren’t convex, and stochastic gradient descent is the norm. ||| The learning rate is the most delicate dial: too small and convergence is slow; too large and it can oscillate around the minimum or diverge. In the demo, watch descent on a convex loss curve and the overshoot a large learning rate causes. Deep-network loss surfaces are generally nonconvex, and gradient-based methods such as stochastic gradient descent are the norm in training; some models, such as linear regression, have convex losses, and some, such as tree-based methods, do not use gradients at all.
Ensemble learning combines the predictions of many models (voting, bagging, boosting) for better, more stable results than any single model; random forests and gradient boosting are the best-known examples. ||| Ensemble learning combines the predictions of many models (voting, bagging, boosting); when their errors complement one another it can improve generalization, but it does not guarantee beating every individual model, and the gain is measured on validation data. Random forests and gradient boosting are the best-known examples.
Three different models are fitted to the same data. The too-simple one misses the pattern (underfitting); the too-complex one memorizes every point but stumbles on new data (overfitting). The best is right in the middle: the model that also predicts examples it has never seen. ||| Three different models are fitted to the same data. The too-simple one misses the pattern (underfitting); the too-complex one memorizes every point but stumbles on new data (overfitting). The best is in between: the model that also predicts examples it has never seen. These curves show the idea; which one generalizes well can only be told by the error measured on data not used for training.
Learning a high score by playing a game ||| Learning to achieve a high score by playing a game
-->

<!-- EDITORIAL NOTES
- 3.1 Simple: "You will watch it all happen step by step." → "You will see it all happen step by step." ("watch" is a screen verb; the Turkish edition made the same change.)
- 3.2 Simple: "Tap an example below to see its clues and its correct answer." → "Look at an example in Figure 3.1 to see its clues and its correct answer." ("tap" is a screen verb.)
- 3.5 Simple: "Press “Group”; let the machine sort them into two clusters by similarity, and let the odd one out give itself away." → "In Figure 3.4 the machine sorts them into two clusters by similarity, and the odd one out gives itself away." ("press" is a screen verb.)
- 3.6 Simple: "Raise the learning rate and see for yourself." → "Look at what happens in the right panel of Figure 3.5." (the guide's own example). "Below, lower the ball step by step and watch the loss melt away." kept as is per the guide; Figure 3.5 answers it.
- Left as is (they make sense on paper because the Figure follows at once): 3.3 Simple "Now take each task below to the right teacher"; 3.4 Simple "Try both yourself below"; 3.5 Simple "The points below carry no labels at all"; 3.7 Simple "Now fit three models to the same data".
- Adapted for paper (2026-09-30; screen verbs resolved in the source text too) (the Turkish edition replaced "demo" with "Figure N.j" by author decision of 2026-09-10): 3.2 Technical "The example below"; 3.3 Technical "Sort the tasks below"; 3.4 Technical "The demo below fits" (Figure 3.3 now sits above that paragraph); 3.5 Technical "The demo shows k-means'"; 3.6 Technical "In the demo, watch descent". Also the verbatim "What is happening?" texts with screen wording: Figure 3.4 Simple "When you press “Group,”"; Figure 3.3 Technical "“Fit the line” computes"; Figure 3.4 Technical "“Group” shows". If the author prefers, these button names can be printed as panel labels in the figures.
- 3.8: the export left the section heading in Turkish ("Kendini test et"); rendered as "Test yourself" per STYLE-GUIDE-EN §5. The export's "_Answers: answer-key.md_" line was treated as a working note and removed; "*Answers are at the back of the book.*" replaces it, as in M01.
- Setups: source hints stripped of screen verbs ("Tap", "Pick", "Press", "Step", "Auto" removed).
- Figure 3.2 (classify) is a self-test demo: a marking table replaces Step by step; answers and reasons are in answers/M03.md.
- Figure 3.3 (scatter): the group names follow the legend of the figure, "dark group" and "orange group", in both editions. The embedded demo texts "Regression (number)" and "Classification (category)" are used as panel titles in the Setup. The alternate line y = 0.5x + 1 (sum of squared errors 0.37) and the x = 10 prediction (6.26) are computed from the demo data, as in the Turkish chapter.
- Figure 3.4 (kmeans): the demo has 11 points, not 12 (10 cluster members + 1 outlier, index 10). The demo flags the outlier by a fixed index, not by a distance threshold; the text justifies it with the comparison "A's farthest member 1.22, outlier 2.92". The updated centers (2.22, 7.2) and (7.32, 3.26) are computed from the data.
- Figure 3.5 (descent): the web demo's "High" learning rate is η = 0.92, and since 1 − 0.36·0.92 = 0.67 > 0 it does NOT overshoot (the ball descends one way: 0.6 → 2.06 → 3.03 → 3.68 …). The printed text and table use the η = 4.6 table from print/figures/out/en/figure-3-5-descent.md so that the oscillation described in the source "What is happening?" and Technical texts can be shown. A reader arriving by QR and choosing "High" will not see the oscillation. Suggestion: set the web demo's high η to 4.6 (or at least 3). "Close to sixty steps" in step 2 means x coming within 0.1 of the floor (57 steps); the loss comes within 0.1 of its minimum after 27.
- Figure 3.6 (modelfit): the demo's "Good (balanced)" curve (y = 3.0 − 0.16x + 0.15·sin(0.6x)) does not give a lower error than the straight line on the training data (sum of squared errors: underfit 1.43, good 1.52, overfit 0). The text therefore makes no numeric error comparison between underfit and good; it only compares the hide-and-test exam with the overfit line. When the figure is redrawn, the "good" curve could pass a little closer to the points.
- Number style: decimal point everywhere; small numbers in words in prose ("two numbers", "a factor of at least five"); en dash in "bias–variance" is part of the verbatim source. Quiz option order is the export's shuffled order, kept exactly; the answer key follows the same order.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in M01 and the Turkish edition.
- Try it yourself answers: print/src/en/answers/M03.md
- 2026-09-30 humanizing pass (copy edit; see the SOURCE-CHANGES block above for the source paragraphs the author should carry into the digital edition): author "we" → "you" or impersonal throughout; "exactly" as intensifier, "really / just", "In short", "remember: …", "the power of …" removed; "How much? / Which one?" slogan now in the margin note and the takeaway only, "memorizing isn't learning" in the margin note only, "the borders aren't sharp" in the Technical text of 3.3 only; production leak in Figure 3.2 ("the six were chosen to introduce…") cut; margin-note back-references in the Figure 3.2 self-test replaced by the questions themselves; bridges and the pre-quiz sentence rewritten; colon consistency (lowercase after a colon unless a direct question or two sentences follow).
- Technical "What is happening?" paragraphs dropped from print because they repeat the Technical text above them word for word (print only; the digital edition keeps them under the demo): 3.3 ("Three paradigms: …"), 3.4 ("In regression the target is a continuous number; “Fit the line” computes …"), 3.5 ("Unlabeled x points, two fixed centroids …"), 3.6 ("Gradient descent: θ ← θ − η·∇L(θ). The parameter moves toward the minimum (x* = 5) …"), 3.7 ("The bias–variance tradeoff: …"). The note above about the "“Fit the line”" and "“Group”" button names therefore now applies only to the digital edition; Figure 3.4 Simple "When you press “Group,”" is resolved in the SOURCE-CHANGES block.
- 3.3 Technical "Sort the tasks below" → "Sort the tasks of Figure 3.2" (the Technical box now sits after the figure).
- 2026-10-01 correction document (R017, R018, R019, R020, R021, R022, R023, R024, R065, R068, R093): the feature is “link or password request” everywhere (3.2 Simple, table, Setup, technical vector, answers); number=regression generalization replaced by the quantity/category distinction (3.2 Technical, 3.4 margin note, takeaway, answers 3.2/4); least squares named as vertical squared residuals (3.3 Step by step 3–4, What is happening, Technical; the sums 0.22 / 0.37 re-verified with vertical residuals); Figure 3.4: centers and outlier predefined, threshold 2.4 and the order assignment → threshold → update defined, “standard k-means assigns point 11 to A, A = (2.68, 7.42)” note (Setup, Step by step, Technical, answers); bank/anomaly generalization narrowed; 3.6 margin note and Technical “nearly all AI / all surfaces” qualified; ensemble guarantee removed; Figure 3.6 middle panel “Smoother representative curve”, verdict text and validation-data warning, cross-validation as k-fold; answers Figure 3.3: 0.55 · 6.5 = 3.575; 3.575 + 0.76 = 4.335 ≈ 4.34, “previous nine”, confidence remark with the calibration condition; Figure 3.2 task 5 “Learning to achieve a high score” (R065; the last SOURCE-CHANGES line is that demo item label, not a paragraph). Changed source paragraphs are the last 16 lines of the SOURCE-CHANGES block above.
- 2026-10-01 R021: the digital demo’s “High” learning rate was set to 4.6 by the demo-code agent; the printed Figure 3.5 table (η = 4.6: 0.60 → 7.89 → 3.11 → 6.24 → 4.19 → 5.53 → 4.65) and the η = 6 divergence exercise are kept; the source “oscillate / overshoot” sentences are now true in the digital edition as well. The 0.92 note above is history.
- 2026-10-01 for the figure agent: Figure 3.6 middle panel label “Good (balanced)” → “Smoother representative curve”, verdict “Bias–variance balance: neither so simple that it misses the pattern nor so complex that it memorizes the noise.”; Figure 3.2 task 5 label “Learning to achieve a high score by playing a game” (print/figures/strings/M03.mjs).
- 2026-10-01 verification round (R018, R024, R097, R099): glossary Label entry rewritten around category vs measured quantity (a numerically coded category stays classification); Figure 3.6 step 1 separates the illustrative 3.1 − 0.18x line from the nine-point least-squares line (3.09 − 0.16x); in the two-point hold-out the straight line is learned from the same seven points by least squares: y ≈ 3.06 − 0.17x, predictions 2.19 and 1.85, errors 0.51 and 0.45 (answers/M03 2: refit 3.19 − 0.15x); Figure 3.3 text "green" → "dark".
-->

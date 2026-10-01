# Chapter 6
## Using and Building AI
*From prompts to agents, architecture to the real world*

<!-- acc #2a7d86 · tag Application -->

### 6.1 Using and building AI

Picture a master who knows everything but owns no workshop: no tools in hand, no notebook allowed, yesterday’s conversation already forgotten. A language model on its own is like that. What turns it into a useful assistant is the workshop built around it: good prompts, feeding it your own data (RAG), tool use, agents and a solid architecture. This chapter builds that workshop piece by piece, and ends with what these tools are changing in the real world.

> **Margin note.** Today the competitive edge is rarely “owning the biggest model”; it is “using the model best with your own data and tools.”

#### Technical depth

Earlier chapters built the core capabilities; this one covers the application layer: the design patterns that turn a foundation model into a reliable, context-aware product that can take action.

The scope: prompt engineering (role, context, few-shot, format), grounding with knowledge (retrieval-augmented generation), tool/function calling and agent loops (ReAct), the component architecture of a typical AI application (orchestration, knowledge base, tools, memory) and industry examples. The main idea: without changing the model, the system around it can raise reliability and usefulness.

The first tool in the workshop is also the cheapest: asking the right question. The same model gives different answers depending on how you build the prompt.

### 6.2 Prompt engineering: asking the right question

Tell a tailor “make me something” and even the tailor can’t say what will come out. Give your measurements, pick the fabric, describe the cut, and everything changes. A language model is the same: there is a world of difference between “make me a plan” and giving it a role, your situation and the shape you want.

Build a prompt piece by piece: as you add role, context, example and format, watch the model’s answer sharpen.

> **Margin note.** A good prompt = a clear role + enough context + a definite format + (if needed) an example. Before blaming the model, review your prompt; most “bad answers” are “incomplete questions.”

**Figure 6.1 · Build a prompt**
![Figure 6.1](../../figures/out/en/figure-6-1-prompt.svg)

*Setup.* The figure builds one prompt out of four pieces. At the bottom sits the base request, always the same: “Suggest a weekend trip plan for me.” Four pieces can be stacked on top of it: role, context, example and format. On the right is a quality scale, and beneath it the model’s answer for each tier. Every added piece raises the score; at set thresholds the answer changes too.

*Step by step.* First look at the sentence each piece adds to the prompt.

| Piece | Sentence added to the prompt |
|---|---|
| Base request | Suggest a weekend trip plan for me. |
| Role | You are an experienced travel advisor. |
| Context | A family of three wants a mid-budget beach trip. |
| Example | Example: “Day 1 · Morning: ..., Noon: ..., Evening: ...” |
| Format | Answer with day headers, as bullet points. |

The quality rule in the figure is simple: the base request starts at 40 percent, and every added piece brings 15 points. The rule does not care which piece you add, only how many; the figure simplifies here. Below 60 counts as low, 60 to 84 as medium, 85 and above as high. The answer changes with these three tiers.

| Pieces added | Quality | Tier | The model’s answer |
|---|---|---|---|
| 0 | 40% | low | You could go somewhere, see a few museums and eat nice food. Have a great trip! |
| 1 | 55% | low | (same answer) |
| 2 | 70% | medium | I suggest a beach destination: swimming in the morning, a short town tour in the afternoon, a fish restaurant in the evening. A budget-friendly guesthouse would fit. |
| 3 | 85% | high | Day 1 · Morning: swim at the beach; Noon: light lunch by the shore; Evening: dinner at the local fish place. Day 2 · Morning: town & market tour; Noon: family-friendly café; Evening: sunset walk. |
| 4 | 100% | high | (same answer) |

Now add the pieces in order and work through the table yourself:

1. Base request only: quality 40 percent, tier low. The answer talks about museums and food; no beach, no family, no day plan. The model does not know what you want, so it speaks in generalities.
2. Add the role: quality 55 percent. The tier is still low and the answer is the same. A job title alone does not tell the model what your problem is.
3. Add the context: quality 70 percent, tier medium. The answer suddenly moves to the coast: beach, guesthouse, fish restaurant. The model now knows who the plan is for.
4. Add the example: quality 85 percent, tier high. The answer takes on day headers and morning, noon and evening slots, the pattern of the example.
5. Add the format as well: quality 100 percent. The answer does not change; the bar reaches the ceiling. The example had already brought the shape; the format rule locks it in.

The answer changed at the second piece. In the figure that is only a matter of counting; in practice a title alone helps little, and describing the situation helps most.

*What is happening?* As you add role (who to be), context (the situation), an example and a format to a prompt, you tell the model more clearly what you want; the answer’s quality rises with every piece. The model isn’t retrained; it has been asked a better question.

*Try it yourself.* 1) With only context and format checked, what is the quality, which tier applies, and which answer comes back? 2) How many pieces at least are needed to reach the high tier? Why are two not enough? 3) Write your own role, context, example and format sentences for the request “Write me an email.” Live demo: [QR 6.1]

#### Technical depth

Prompt engineering is the practice of steering a model’s behavior without retraining it. The effective ingredients: a system/role definition, task context, output-format constraints and examples. Few-shot examples usually improve consistency over zero-shot.

Advanced techniques: chain-of-thought prompting, self-verification, imposing constraints/schemas (e.g. JSON), and splitting the task into subtasks. Prompts also affect the context window and therefore cost, because long examples consume tokens.

The quality score of Figure 6.1 is a teaching simplification: quality = min(100, 40 + 15·n), where n is the number of pieces added. Tier thresholds: quality ≥ 85 high, 60 ≤ quality < 85 medium, below that low. In real systems quality does not rise in a straight line like this; measuring it takes an evaluation set (eval set) and a scorer.

Even a well-built prompt cannot create knowledge the model has never seen. Who will tell the model your company’s leave policy?

### 6.3 RAG: give the model your own data

A language model doesn’t know your company documents, your notes or your latest data; its schooling ended on a fixed date. Ask anyway and it won’t miss a beat; it may confidently make things up (hallucination). The fix is as simple as hiring a good librarian: before answering, walk to the shelf, find the right document, and tell the model “here is the source, answer from this.”

This is called RAG (retrieval-augmented generation). Pick a question and compare RAG off and on in Figure 6.2: off, the model guesses; on, it finds the relevant document and answers from it.

> **Margin note.** RAG is like putting the model in an open-book exam: it now answers from the source in front of it, not from memory. This is the backbone of most enterprise AI applications.

**Figure 6.2 · Answers grounded in sources**
![Figure 6.2](../../figures/out/en/figure-6-2-rag.svg)

*Setup.* The figure shows three HR questions. Beside each question stand two answers: the model’s unsourced guess with RAG off, and its sourced answer with RAG on. On the RAG-on side there is one more box in between: the chunk retrieved from the company document and handed to the model. On the RAG-off side that box is empty, and the answer carries an “unverified” warning. The only difference between the two sides is whether the librarian is at work; the question and the model are the same.

*Step by step.* Compare the three questions and the two modes in a single table.

| Question | Retrieved source chunk (RAG on) | RAG off: unsourced guess | RAG on: sourced answer |
|---|---|---|---|
| How many days of annual leave do I get? | HR Policy §4: Full-time employees receive 20 days of paid annual leave per year, rising to 26 after 5 years. | Annual leave is usually around 14 days, but it varies by company. | Per HR Policy §4, full-time employees get 20 paid days a year (26 after 5 years). |
| What is the remote-work rule? | HR Policy §7: Employees may work remotely up to 3 days a week; Tuesdays are office days. | Most companies allow about 2 remote days a week, I think. | Per HR Policy §7, up to 3 remote days a week are allowed; Tuesdays are office days. |
| What is the meal expense limit? | Expense Guide §2: The per-person daily limit for business meals is 500 TL; a receipt is required. | The limit is probably around 250–300 TL, I’m not sure. | Per Expense Guide §2, the per-person daily limit for business meals is 500 TL, and a receipt is required. |

Read the rows one by one:

1. The leave question. With RAG off the model says “around 14 days,” a generic figure that fits many companies and none in particular. The company’s rule is 20 days. The model is not lying. It is answering for companies in general, because it has never seen yours. With RAG on the librarian brings §4; the answer gives both the 20 days and the 26 days after five years.
2. Remote work. The guess is “2 days, I think”; the document says 3 days and adds the Tuesday office rule. No model could know the Tuesday detail on its own; that information exists only in the document.
3. The meal limit. The guess is “around 250 to 300 TL, I’m not sure”; the document says 500 TL and requires a receipt. The guess stopped at half the real figure.

The same pattern runs through all three rows. The guesses sound reasonable, but all three are wrong, and each carries a hedge word: around, I think, probably. The sourced answers give a number, a section number and a condition. Because the source is cited, checking is easy: find §4 in the document and compare. The source chunk matters at least as much as the answer. If the wrong chunk arrives, the model uses it with the same confidence; RAG reduces fabrication, not retrieval errors.

*What is happening?* With RAG off, the model speaks only from memory and can fabricate private facts it doesn’t know (hallucination). With it on, the relevant document is first found and handed to the model; it answers looking only at that source, and cites it. The risk of fabrication drops sharply, like taking an open-book exam.

*Try it yourself.* 1) List the words of uncertainty in the three guessed answers; is there any such word in the sourced answers? 2) If the documents held no clause about leave at all, what should a well-built system say with RAG on? 3) A new question: “I have worked here for six years; how many days of leave do I get?” Write the sourced answer from the chunk in the table. Live demo: [QR 6.2]

#### Technical depth

RAG (Retrieval-Augmented Generation) turns a query into an embedding, retrieves the most relevant text chunks from a vector database and adds them to the prompt, grounding the model in those sources. Fresh or private knowledge gets used without retraining the model.

The typical pipeline: split documents into chunks → embed → index; at query time retrieve the k nearest chunks (semantic search) → add to the prompt → generate. Upside: sources can be cited and hallucination drops. Challenges: retrieval quality, chunk size, and the context-window limit.

In Figure 6.2 this pipeline runs in its smallest form: two documents, three chunks (each a single section), k = 1. The question is turned into an embedding, the nearest chunk (§4 for the leave question) is added to the prompt; the model answers from that chunk alone and writes the chunk’s name as the source. A real system holds thousands of chunks, and the main risk is retrieving the wrong one: bad retrieval means a bad answer.

With the source in front of it, the model speaks correctly. But some jobs do not end with speaking; they need a calculation, or a look at the calendar.

### 6.4 Agents: think, use tools, observe

On its own, a language model only talks. Now hand the master its tools: a calculator, search, a calendar, an API. And teach it one working rhythm: “think → use the tool → check the result → try again.” Out comes an agent: an assistant that doesn’t just talk but plans step by step and gets to work.

Figure 6.3 follows an agent through one task. In each frame you see what it thinks, which tool it calls and what it observes.

> **Margin note.** The difference: a chatbot tells you “how to do it”; an agent tries to do it for you. That is where both the power and the risk come from, which is why limits are a must.

**Figure 6.3 · Watch an agent**
![Figure 6.3](../../figures/out/en/figure-6-3-agent.svg)

*Setup.* The figure is a film strip. At the top is the task given to the agent; below it are three frames. In each frame you read three lines: the agent’s thought, the tool it calls and the observation the tool returns. In the last frame the tool line is empty; the final answer stands in its place. The agent has a single tool: a calculator.

*Step by step.* The task: “We’re buying 3 pizzas for the team (180 TL each). What’s the total, and the per-person share among 6?”

| Step | Thought | Tool call | Observation |
|---|---|---|---|
| 1 | First I need the total: 3 × 180. | calculator("3 * 180") | 540 |
| 2 | Now the per-person share: 540 ÷ 6. | calculator("540 / 6") | 90 |
| 3 | I have enough information; I can write the answer. | (no tool) | Final answer: The total is 540 TL; split among 6, that’s 90 TL per person. |

Read the frames in order:

1. First frame. The agent splits the task in two and goes for the total first. It does not do the arithmetic itself; it sends the string “3 * 180” to the calculator. The calculator returns 540. That number is not a guess the agent produced; it is an observation the tool delivered.
2. Second frame. The thought line contains 540; the observation of the first frame became the input of the second. That is what makes it a loop: each turn uses the result of the one before. The calculator returns 90.
3. Third frame. The agent looks at its two observations and decides to stop. No tool call; it puts the two numbers into one sentence. The decision to stop is the model’s decision too; nobody told it “done.”

The model could have solved this task in its head; the numbers are small. But a tool gives an exact result, and a model gives a guess. As the numbers grow, or the job reaches into a calendar, a search engine or an API, that difference becomes vital. In the figure the loop closed in three turns. A real system sets a turn limit; otherwise an agent that cannot make up its mind can call the same tool forever.

*What is happening?* An agent solves a task step by step: first it thinks “what should I do?” then uses a tool (say, a calculator), sees the tool’s result and decides the next step based on it. It repeats this “think → use → observe” loop until the goal is reached.

*Try it yourself.* 1) If the task were “4 pizzas, 200 TL each, 5 people,” write the three frames yourself with thought, tool call and observation columns. 2) If the calculator broke in the first frame and returned 450, what would the second frame and the final answer be? What does that tell you about tools? 3) Add “plus 30 TL of drinks per person” to the task. How many tool calls are needed, and what is the final answer? Live demo: [QR 6.3]

#### Technical depth

The agent loop (e.g. ReAct): the model produces a thought, chooses an action/tool call (usually via structured tool/function calling), takes the tool’s output as an observation, and repeats until the goal is reached. Tools connect the model’s abilities to the outside world (calculation, search, running code, APIs).

Design concerns: tool schemas and validation, loop/budget limits (preventing infinite loops), error handling, and safety (keeping the model from triggering dangerous actions). Multi-step agents are powerful but fragile; observability and firm limits are essential.

The tool call in Figure 6.3 is not plain prose but a structured message; the model fills in a schema: `{"tool": "calculator", "input": "3 * 180"}`. Orchestration catches this message, runs the tool and adds the output (540) to the next prompt as an observation. In Figure 6.3 the budget is three steps; at the third step an `isFinal` flag closes the loop. In a real system, on top of this limit, every tool output is validated against the schema, and dangerous actions (deleting, paying) are tied to human approval.

You now hold three tools: a good prompt, a shelf of sources, a toolbox. How do you build the skeleton that holds them together?

### 6.5 The architecture of an AI application

A real AI application is like a good restaurant; the chef doesn’t run it alone. There is a waiter who takes your order: the interface. A manager who runs the kitchen and decides who does what, when: orchestration; the real “brain.” The pantry holding the ingredients is the knowledge base, the tools on the counter are the model’s tools, and the regulars’ notebook is the memory.

Look at the parts of Figure 6.4 one by one and see what each does in the system. You are looking at the skeleton of a typical AI product.

> **Margin note.** The good news: most of these parts can be assembled from off-the-shelf tools (vector DBs, orchestration libraries). The bad news: the real difficulty isn’t the model, it is wiring these parts together reliably.

**Figure 6.4 · The parts of an AI application**
![Figure 6.4](../../figures/out/en/figure-6-4-arch.svg)

*Setup.* The figure is a flow diagram: the user on the left, then five boxes. First the interface, then orchestration; three arms leave orchestration for the knowledge base, the tools and the memory. The orchestration box is orange; each box’s role is in the numbered table beneath the diagram. The model itself is not a separate box; orchestration calls it.

*Step by step.* First read the five parts and their roles in the table.

| Part | Role in the system |
|---|---|
| Interface | Where the user types the question and sees the answer (chat screen, app). |
| Orchestration | Builds the prompt, decides which tool or knowledge to call and when, manages the flow. |
| Knowledge base | Your data (documents, notes) lives here as embeddings; RAG retrieves the relevant chunk. |
| Tools | The model’s link to the world: calculation, search, calendar, email, an API or running code. |
| Memory | Holds the conversation history and user state; keeps the context going. |

Now run one question through this skeleton from start to finish. The user writes: “Under the leave rule we discussed last week, can I take next Friday off?”

1. The interface takes the question and passes it to orchestration. The waiter has carried the order to the kitchen.
2. Orchestration reads the question and decides it needs three things: last week’s conversation, the leave rule and the calendar.
3. From memory comes last week’s summary: the user is an employee past the five-year mark who has used 12 days of leave this year.
4. From the knowledge base comes the §4 chunk of Figure 6.2: 26 days after 5 years.
5. The calendar tool is called: Friday is not a public holiday, and nobody else on the team is off that day.
6. Orchestration lines all of this up in a single prompt, adds a role and a format as in Figure 6.1, and sends it to the model.
7. The model writes the answer: 14 days remain, Friday works. The answer returns to the interface; memory notes this conversation too.

In five of the seven steps there is no model. The model is called in step six and speaks only in step seven; still, what makes the answer good is the material gathered beforehand. The hard part is running these seven steps reliably every time, not the model. The three earlier figures were each a piece of this skeleton: Figure 6.1 is orchestration preparing the prompt, Figure 6.2 the knowledge base, Figure 6.3 the toolbox.

*What is happening?* A real AI application is made of a few parts: the interface the user talks to, the orchestration layer running everything, the knowledge base holding the data, the tools the model uses, and the memory keeping the history. What truly holds it together is the orchestration layer; the model is often a swappable part.

*Try it yourself.* 1) Which box does each of these questions set in motion? “Do you remember the date I gave you yesterday?” “What is the dollar rate today?” “What is the company’s refund policy?” 2) If you swapped the model for a cheaper one, which boxes in the figure would change? 3) Complete the restaurant analogy: which box is the waiter, the manager, the pantry, the counter tools, the regulars’ notebook? Live demo: [QR 6.4]

#### Technical depth

Typical architectural layers: (1) interface/client; (2) orchestration (building prompts, routing, coordinating tool/RAG calls, sometimes an agent framework); (3) model(s) (self-hosted or API); (4) knowledge base (vector DB + RAG); (5) tools/actions (APIs, functions); (6) memory (short-term context + persistent state); (7) observability/safety (logging, evaluation, guardrails).

In practice the orchestration layer is what makes the product a product: cost, latency, caching, fallbacks and the evaluation pipeline all live here. The model itself is often a swappable component.

Figure 6.4 shows five of the seven layers. The mapping:

| Technical layer | Box in Figure 6.4 |
|---|---|
| (1) Interface/client | Interface |
| (2) Orchestration | Orchestration |
| (3) Model(s) | No separate box; orchestration calls it |
| (4) Knowledge base | Knowledge base |
| (5) Tools/actions | Tools |
| (6) Memory | Memory |
| (7) Observability/safety | Not in the figure; it wraps around orchestration |

The figure leaves out the model and the observability layer because both work from inside or around orchestration. The model is a call; logging, evaluation and guardrails are filters placed before and after every call.

The skeleton is ready. What does the same skeleton turn into in a hospital, a bank and a factory?

### 6.6 AI in the real world

When all these parts click together, AI walks out of the lab and into the street. It reads scans in hospitals, catches fraud in banks, predicts breakdowns on factory floors, proposes molecules in labs and sketches beside artists.

Pick a field; see concrete examples of how AI is used there today.

> **Margin note.** AI rarely takes over a job outright; it becomes a tool, a “copilot.” The most successful applications are designs that strengthen people rather than replace them.

**Figure 6.5 · Explore the fields**
![Figure 6.5](../../figures/out/en/figure-6-5-sector.svg)

*Setup.* The figure shows six fields side by side: Health, Finance, Manufacturing, Science, Art and Daily life. Under each field are three concrete examples in use today, eighteen in all.

*Step by step.* Read the six fields and their examples in a single table.

| Field | Example 1 | Example 2 | Example 3 |
|---|---|---|---|
| Health | Spotting anomalies in medical images (X-ray, MRI) | Summarizing and coding patient notes | Screening candidate molecules in drug discovery |
| Finance | Real-time fraud detection | Document/contract analysis and risk scoring | Customer support assistants |
| Manufacturing | Predictive maintenance (foreseeing failures) | Visual quality control | Supply/demand forecasting |
| Science | Protein folding and structure prediction | Pattern discovery in large datasets | Simulation and hypothesis generation |
| Art | Image, music and text generation | Concept design and faster sketching | Style transfer and restoration |
| Daily life | Translation and writing help | Recommendation systems (movies, products) | Voice assistants and summarization |

Read the rows first. In every field the three examples are of different kinds: in Health, reading an X-ray is a recognition job, molecule screening a prediction job, patient notes a language job. In Manufacturing, quality control is recognition; predictive maintenance and demand forecasting are prediction. Every field is mixed this way; none rests on a single skill.

Then read the table diagonally instead of row by row. The same skill turns up in different fields under different names:

| Core skill | Its examples in the table |
|---|---|
| Recognizing (classification) | Spotting anomalies in X-rays, visual quality control, fraud detection |
| Predicting | Predictive maintenance, demand forecasting, protein structure, candidate molecule screening |
| Generating | Image and music generation, concept design, style transfer, writing help, hypothesis generation |
| Retrieving and summarizing | Summarizing patient notes, contract analysis, pattern discovery, recommendation systems |
| Doing tasks step by step (agents) | Customer support assistants, voice assistants |

The classifier that finds the spot on an X-ray and the classifier that finds the crack on the production line are the same idea; only the data differs. The pattern recognition and generation of earlier chapters, plus the agent loop of this chapter, cover all eighteen examples. The skills are not new; only the data they touch is.

What does change is the cost of a mistake. In art, a wrong sketch is erased and forgotten. In finance, a false fraud alarm loses a customer; a missed alarm costs more. In health, a spot that goes unnoticed can cost a life. So every row in the table uses the same skeleton but demands different guardrails. This is where the copilot idea comes in: the person decides; the AI supplies speed and attention. In health the classifier’s output reaches the physician as a suggestion; the physician has the last word. In art, if the painter dislikes the sketch, it is deleted and a new one requested.

*What is happening?* The same core skills (recognizing, predicting, generating, retrieving, doing tasks step by step) are adapted to each industry’s data. But every field has its own rules: mistakes are costly in healthcare, auditability is mandatory in finance. So what matters isn’t just “adding AI” but using it responsibly and measurably.

*Try it yourself.* 1) Sort the eighteen examples into the five skills yourself and compare with the second table. Which examples fall under two skills at once? 2) From each field pick the example where a mistake costs the most, and say why. 3) Write an example from your own work: which skill, which field, and which boxes of Figure 6.4 would it need? Live demo: [QR 6.5]

#### Technical depth

Application domains adapt the same core capabilities (classification, prediction, generation, retrieval, agents) to different data. Examples: medical image analysis and decision support; anomaly/fraud detection and risk modeling; predictive maintenance and quality control; drug/material discovery and simulation; generative design and content production.

One point not to miss: every field has different accuracy, safety, privacy and regulatory requirements (high error costs in healthcare, auditability in finance). So “integrating AI” matters as much as “integrating it responsibly”; that is what the next chapters are about.

Six fields, five skills, one skeleton. Six questions follow.

### 6.7 Test yourself

*Answers are at the back of the book.*

1. What improves an answer in prompt engineering?
   a) Adding role, context, examples and a clear format
   b) Retraining the model
   c) A pricier GPU
   d) Writing shorter

2. What does RAG fundamentally do?
   a) Generates images
   b) Deletes data
   c) Speeds up the model
   d) Finds the relevant source and grounds the answer on it

3. What separates an “agent” from a chatbot?
   a) A colorful interface
   b) Typing faster
   c) Using tools and taking action step by step
   d) Working offline

4. What does the “orchestration” layer do in a typical AI app?
   a) Trains the model
   b) Only stores data
   c) Coordinates prompts, tools and RAG calls
   d) Only draws the screen

5. A practical way to reduce hallucination?
   a) Writing a longer prompt
   b) Turning the model off
   c) Grounding the answer in a source via RAG
   d) Maxing out the temperature

6. What are the most successful AI applications usually like?
   a) Ones needing no evaluation
   b) Ones that exclude people entirely
   c) Ones that just use the biggest model
   d) Designs that strengthen people (copilots)

### What to keep from this chapter

- A language model on its own is a master without a workshop; what makes it an assistant is the prompt, the sources, the tools and the architecture built around it.
- A good prompt carries a role, context, an example and a format; the model is not retrained, it is only asked better.
- RAG finds the right document before answering and hands it to the model; the model rests on the source, fabrication drops and the source is cited.
- An agent does multi-step work with the “think, use a tool, observe” loop; a turn limit and validation keep it safe.
- In a real AI application the real brain is the orchestration layer; the model is often a swappable part.
- The same core skills are adapted to every industry; what changes between fields is the cost of a mistake and the guardrails it demands.
- The most successful applications are copilot designs that strengthen people rather than exclude them.

<!-- SOURCE-CHANGES
Picture a master who knows everything but owns no workshop: no tools in hand, no notebook allowed, yesterday’s conversation already forgotten. A language model on its own is like that. What turns it into a useful assistant is the workshop we build around it: good prompts, feeding it your own data (RAG), tool use, agents and a solid architecture. We’ll build that workshop piece by piece, and end by seeing what these tools are changing in the real world. ||| Picture a master who knows everything but owns no workshop: no tools in hand, no notebook allowed, yesterday’s conversation already forgotten. A language model on its own is like that. What turns it into a useful assistant is the workshop built around it: good prompts, feeding it your own data (RAG), tool use, agents and a solid architecture. This chapter builds that workshop piece by piece, and ends with what these tools are changing in the real world.
Today the competitive edge is rarely “owning the biggest model”; it is “using the model best with your own data and tools.” That is what this chapter is about. ||| Today the competitive edge is rarely “owning the biggest model”; it is “using the model best with your own data and tools.”
A good prompt = a clear role + enough context + a definite format + (if needed) an example. Before blaming the model, review your prompt; most “bad answers” are really “incomplete questions.” ||| A good prompt = a clear role + enough context + a definite format + (if needed) an example. Before blaming the model, review your prompt; most “bad answers” are “incomplete questions.”
As you add role (who to be), context (the situation), an example and a format to a prompt, you tell the model more clearly what you want; the answer’s quality rises with every piece. The model isn’t retrained; it has simply been asked a better question. ||| As you add role (who to be), context (the situation), an example and a format to a prompt, you tell the model more clearly what you want; the answer’s quality rises with every piece. The model isn’t retrained; it has been asked a better question.
Watch an agent solve a task step by step in Figure 6.3. In each frame, see what it thinks, which tool it calls and what it observes. ||| Figure 6.3 follows an agent through one task. In each frame you see what it thinks, which tool it calls and what it observes.
A real AI application is made of a few parts: the interface the user talks to, the orchestration layer running everything (the real “brain”), the knowledge base holding the data, the tools the model uses, and the memory keeping the history. What truly holds it together is the orchestration layer; the model is often a swappable part. ||| A real AI application is made of a few parts: the interface the user talks to, the orchestration layer running everything, the knowledge base holding the data, the tools the model uses, and the memory keeping the history. What truly holds it together is the orchestration layer; the model is often a swappable part.
When all these parts click together, AI walks out of the lab and into the street. It helps the eye reading scans at the hospital, catches fraudsters at the bank, smells a breakdown coming on the factory floor, proposes new molecules in the lab, and pulls up a chair beside the artist. ||| When all these parts click together, AI walks out of the lab and into the street. It reads scans in hospitals, catches fraud in banks, predicts breakdowns on factory floors, proposes molecules in labs and sketches beside artists.
One point not to miss: every field has different accuracy, safety, privacy and regulatory requirements (high error costs in healthcare, auditability in finance). So “integrating AI” matters as much as “integrating it responsibly and measurably”; that is what the next chapters are about. ||| One point not to miss: every field has different accuracy, safety, privacy and regulatory requirements (high error costs in healthcare, auditability in finance). So “integrating AI” matters as much as “integrating it responsibly”; that is what the next chapters are about.
-->

<!-- EDITORIAL NOTES
- 6.3 Simple: "Pick a question and toggle RAG on and off:" → "Pick a question and compare RAG off and on in Figure 6.2:"
- 6.4 Simple: "Watch an agent solve a task step by step. Press “Next step”; see what it thinks, which tool it calls and what it observes." → "Figure 6.3 follows an agent through one task. In each frame you see what it thinks, which tool it calls and what it observes." (2026-09-30: "Watch" removed; earlier print wording was "Watch an agent solve a task step by step in Figure 6.3. In each frame, see…").
- 6.5 Simple: "Tap the parts one by one and see what each does in the system." → "Look at the parts of Figure 6.4 one by one and see what each does in the system."
- Left as is (they make sense on paper because the Figure follows at once): 6.2 Simple "Build a prompt piece by piece: … watch the model’s answer sharpen."; 6.6 Simple "Pick a field; see concrete examples …".
- Figure 6.5 technical What is happening ("…integrating “responsibly and measurably” is the critical part."): cut from the print Technical depth on 2026-09-30 as a repeat of the two Technical paragraphs above it; the checker's allowlist entry for "is the critical part" is now unused in this file.
- Figure 6.1 tables: the demo strings "Day 1 — Morning …" and "Day 2 — Morning …" (example piece and high-tier answer) carry em dashes in the source; written here with a spaced en dash ("Day 1 · Morning") so the file passes the em-dash check. If the author prefers, "Day 1 · Morning" is the alternative. The en dash in the RAG table ("250–300 TL") is verbatim demo text, as with the quiz range in M01.
- Figure 6.2 Step by step, item 1: the Turkish edition calls the 14-day guess "close to the legal minimum" (Turkish Labor Law art. 53); for the English reader this became "a generic figure that fits many companies and none in particular," with no reference to any country’s law.
- Figure 6.4 Step by step: the seven-step leave scenario (five-year employee, 12 days used, 14 left, Friday free) is not in the demo; it is the same new scenario as in the Turkish chapter, built from the data of Figures 6.1 to 6.3.
- Figure 6.5 second table (skill mapping) is not in the demo; it follows the Turkish chapter’s mapping of the five skills named in the What is happening? text, and is open to discussion.
- Figure 6.4 Technical depth: the seven-layer to five-box mapping table follows the Turkish chapter; labels are the English source terms.
- Setups: source hints stripped of screen verbs ("toggle", "press", "tap" removed); figure colors described for the duotone print (orchestration box orange).
- Currency: the English demo keeps "TL" in the RAG and agent data; kept verbatim, not converted.
- 6.7: the export’s "_Answers: answer-key.md_" working note replaced by the reader-facing "Answers are at the back of the book."
- Quiz option order is the export’s shuffled order, kept exactly; the answer key follows the same order.
- Margin notes moved after the Simple paragraphs and before the Figure block, as in the Turkish edition.
- answers/M06.md: the English figure data is identical to the Turkish data (same numbers, same section numbers, same prices), so no answer needed recomputing; only labels and example texts differ.
- 2026-09-30 humanizing pass (print/kitap/humanize-en-report.md, M06 findings and the "counts only" patterns): "exactly", "That is exactly why", "One more point", "deliberate / on purpose", margin-note back-references (6.2, 6.5, 6.6), the screen verb in 6.4 Simple, "the real “brain”" kept only in the 6.5 Simple paragraph and the takeaway, "responsibly and measurably" kept only in the 6.6 What is happening?, the five-beat brochure sentence in 6.6 Simple, mirror sentences, the pre-quiz bridge, author "we". Source paragraphs changed are listed in SOURCE-CHANGES above. Print only, not a source change: the technical "What is happening?" paragraphs of 6.2, 6.3, 6.4, 6.5 and 6.6 were cut from the Technical depth boxes because they repeat the Technical paragraphs above them. Figure blocks, tables, numbers, quiz order and takeaway count unchanged.
-->

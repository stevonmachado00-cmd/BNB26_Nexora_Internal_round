# Re:Learn — Adaptive Cognitive Python Learning Platform

> **"Don't just fix your code. Understand your mistake."**

Re:Learn is an adaptive introductory Python programming learning platform prototype designed to demonstrate the complete cognitive learning loop:

$$\text{Attempt} \longrightarrow \text{Diagnose} \longrightarrow \text{Understand} \longrightarrow \text{Practice} \longrightarrow \text{Reassess} \longrightarrow \text{Resolve} \longrightarrow \text{Remember}$$

---

## 🌟 Core Philosophy

Most programming platforms show a generic **"Wrong Answer"** banner and ask students to guess again. Others use generic LLM wrappers that output the corrected code, bypassing genuine understanding.

**Re:Learn works fundamentally differently:**
1. **Line-Level Error Localization**: Pinpoints the exact line causing the cognitive breakdown.
2. **Error Classification**: Distinguishes syntax, runtime, and logical errors from **careless slips** and **conceptual misconceptions**.
3. **Diagnostic Probes**: Uses targeted micro-questions to distinguish look-alike mistakes (e.g. *Did the student think `print()` returns a value, or did they simply forget to type `return`?*).
4. **Interactive Memory Trace**: Lets learners step through the execution frames to see what happened to variables, standard output, and return values.
5. **Contextual AI Tutor & 4-Level Hint Ladder**: Guides learners with Socratic questions, pointers, contrast examples, and worked transfers—never dumping raw solutions.
6. **Transfer Reassessment**: Generates new problems in different surface contexts (e.g. tax calculations, shipping logistics) to verify whether the concept transferred.
7. **Adaptive Teaching Style Switching**: Dynamically shifts between *Visual Memory Traces*, *Contrast Examples*, and *Step-by-Step Rule Walkthroughs* based on the learner model.
8. **Predict-and-Explain Evaluation**: Analyzes written rationale to distinguish genuine conceptual understanding from lucky guesswork.
9. **Spaced Delayed Re-Checks**: Re-tests concepts after delay intervals before marking misconceptions as permanently *Resolved*.
10. **Mastery-Driven Level System**: Level progression reflects deep understanding across skill domains rather than mere question count.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Launch

```bash
# Clone or open repository
cd "Bnb init"

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

The application will be running at:
- **Local Dev Server**: `http://localhost:5180/`

---

## 🎬 3-Minute Guided Demo Tour (Section 46)

Re:Learn includes an interactive **3-Min Demo Tour** built directly into the top bar. You can click through all 11 scenes sequentially or jump to any scene:

| Scene | Name | Description | Key Interactions |
|---|---|---|---|
| **Scene 1** | **Dashboard** | Alex Morgan's profile: Level 8, 67% Mastery, 2 active misconceptions. | Inspect skill map & click *"Continue Learning"*. |
| **Scene 2** | **Problem Environment** | Problem 12: `add(a, b)` with pre-seeded beginner code using `print(a + b)`. | Review problem statement, click *"Run Code"*. |
| **Scene 3** | **Cognitive Diagnosis** | Tests fail (stdout: `8\nNone`). Line 2 is highlighted with Monaco line decoration. | Observe diagnosis card: *Return vs Print* (87% confidence). |
| **Scene 4** | **Execution Trace** | Interactive step-through memory visualizer. | Step through variables and watch caller receive `None`. |
| **Scene 5** | **Diagnostic Probe** | "What does `x = print(5)` store in x?" | Answer `None` $\rightarrow$ AI confidence calibrates to 94%. |
| **Scene 6** | **AI Doubt Chat** | Contextual Socratic tutor with 4-level hint ladder. | Ask *"Why is print different from return?"*. |
| **Scene 7** | **Transfer Reassessment** | Generalization test: Sales Tax calculation in finance domain. | Run code with `return` keyword $\rightarrow$ Transfer success. |
| **Scene 8** | **Teaching Style Switch** | System detects residual confusion on transfer 2. | Switch to Alex's preferred representation: *Contrast Examples*. |
| **Scene 9** | **Predict & Explain** | Code prediction with sentence rationale check. | Type explanation $\rightarrow$ Cognitive model verifies understanding. |
| **Scene 10** | **Delayed Re-Check** | Spaced retention verification card. | Answer memory check $\rightarrow$ Misconception graduates to *Resolved*! |
| **Scene 11** | **Learner Model Update** | Dashboard updates: Mastery 67% $\rightarrow$ 70%, active count 2 $\rightarrow$ 1. | Inspect Misconceptions Catalog & Learning Timeline. |

---

## 🔬 Second Demo Path: Look-Alike Mistake Discrimination (Section 39)

Click the **"Learner A vs B"** button in the TopBar to inspect how Re:Learn handles identical-looking failures:
- **Learner A**: Wrote `print(a + b)` because they believed `print()` delivers data back to the caller. Probe diagnosis: **Conceptual Misconception**. Routed to transfer problems and contrast examples.
- **Learner B**: Computed `total = a + b` but omitted `return total`. Knows `print(5)` returns `None`. Probe diagnosis: **Careless Slip**. Routed to a gentle syntax hint without false-positive conceptual reteaching.

---

## 🛠️ Architecture & Clean Service Layer

```text
src/
├── types/
│   └── index.ts                 # Clean TypeScript definitions
├── services/
│   ├── problemService.ts        # Adaptive retrieval & verified problem pipeline
│   ├── executionService.ts      # Python execution interface (Pyodide-ready)
│   ├── diagnosisService.ts      # AST misconception diagnosis & probe calibration
│   ├── reassessmentService.ts   # Transfer problems, predict-and-explain & style engine
│   ├── learnerService.ts        # Learner model, mastery progression & timeline
│   ├── chatService.ts           # Socratic tutor & 4-level hint ladder
│   └── storageService.ts       # LocalStorage sync with seamless reset
├── components/
│   ├── common/                  # Sidebar, TopBar, Badge, ProgressBar, SkillBar, Modal
│   ├── learn/                   # ProblemHeader, Statement, MonacoEditor, Tests, Diagnosis, Trace, Chat
│   ├── reassessment/            # TransferRunner, PredictAndExplain, TeachingStyleSelector, DelayedRecheck
│   └── demo/                    # DemoTourGuide (11 scenes) & LearnerComparisonModal
└── pages/
    ├── LandingPage.tsx          # Value proposition, comparison cards, cognitive loop
    ├── AuthPages.tsx            # Login & Signup flows
    ├── OnboardingPage.tsx       # Goal, experience & 10-question diagnostic quiz
    ├── DashboardPage.tsx        # Skill map, active misconceptions, hero challenge
    ├── LearnPage.tsx            # Centerpiece 3-column learning environment
    ├── ReassessmentPage.tsx     # Transfer challenges, teaching switch, graduation
    ├── ProgressPage.tsx         # Learning analytics & cognitive habit charts
    ├── MisconceptionsPage.tsx   # 12-item Python misconception catalog
    ├── HistoryPage.tsx          # Learning event timeline & submitted code inspector
    └── ProfilePage.tsx          # Alex Morgan profile, mastery level & preferences
```

---

## 🎨 Visual Design

- **Dark-First Developer Theme**: Deep obsidian charcoal (`#070a10`, `#0d131f`) with clean contrast.
- **Cognitive Palette**:
  - Green (`#10B981`) for confirmed understanding & passing tests.
  - Amber (`#F59E0B`) for conceptual misconceptions & warnings.
  - Red (`#EF4444`) for runtime/syntax errors.
  - Indigo & Purple (`#6366F1`, `#8B5CF6`) for AI diagnostic models and Socratic guidance.
  - Cyan (`#06B6D4`) for interactive memory traces and variable watches.
- **Monospace Code**: JetBrains Mono & Fira Code typography with syntax highlighting.

// Re:Learn Core Type Definitions

export type ErrorClassification =
  | "syntax"
  | "runtime"
  | "logical"
  | "conceptual"
  | "careless-slip"
  | "unclassified";

export type MisconceptionStatus =
  | "never-seen"
  | "active"
  | "provisional"
  | "resolved"
  | "recurring";

export type TeachingStyle =
  | "visual-trace"
  | "contrast-examples"
  | "step-by-step";

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  isHidden?: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  concept: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  constraints: string[];
  examples: Example[];
  starterCode: string;
  demoCode?: string; // Pre-seeded learner code for demo
  correctCode?: string;
  tests: TestCase[];
  verified: boolean;
  targetMisconceptions?: string[];
}

export interface ProbeOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  diagnosisShift?: string;
}

export interface ProbeQuestion {
  id: string;
  codeSnippet: string;
  question: string;
  options: ProbeOption[];
  explanation: string;
}

export interface TraceStep {
  step: number;
  line: number;
  code: string;
  explanation: string;
  variables: Record<string, string | number | boolean | null>;
  stdout?: string;
  returnValue?: string;
}

export interface Misconception {
  id: string;
  name: string;
  category: ErrorClassification;
  faultyBelief: string;
  explanation: string;
  contrastExample: {
    flawed: string;
    sound: string;
    explanation: string;
  };
  probeQuestion: ProbeQuestion;
  status: MisconceptionStatus;
  confidence: number; // 0-100%
  occurrenceCount: number;
  resolvedCount: number;
  returnedCount: number;
  effectiveTeachingStyle?: TeachingStyle;
  lastEncountered: string;
  relatedConcept: string;
}

export interface DiagnosisAlternative {
  misconceptionId: string;
  misconceptionName: string;
  category: ErrorClassification;
  confidence: number;
  reason: string;
}

export interface Diagnosis {
  errorType: ErrorClassification;
  primaryMisconceptionId: string;
  primaryMisconceptionName: string;
  confidence: number;
  topAlternatives: DiagnosisAlternative[];
  affectedLines: number[];
  faultyCodeSnippet: string;
  whatHappened: string;
  whyHappened: string;
  mentalModelFix: string;
  probeRequired: boolean;
  probe?: ProbeQuestion;
  executionTrace?: TraceStep[];
}

export interface ExecutionResult {
  success: boolean;
  testsPassed: number;
  totalTests: number;
  tests: TestCase[];
  stdout: string;
  stderr?: string;
  returnValue?: string;
  diagnosis?: Diagnosis;
  executionTrace?: TraceStep[];
}

export interface Hint {
  level: number;
  title: string;
  content: string;
  codeExample?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "relearn";
  text: string;
  timestamp: string;
  hintLevel?: number;
  isThinking?: boolean;
}

export interface ReassessmentTransferProblem {
  id: string;
  title: string;
  surfaceContext: string; // e.g. "Tax calculation", "Shipping cost", "Discount calculation"
  underlyingConcept: string;
  prompt: string;
  starterCode: string;
  tests: TestCase[];
  predictAndExplain?: {
    code: string;
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface ReassessmentSession {
  misconceptionId: string;
  misconceptionName: string;
  status: "active" | "provisional" | "resolved" | "recurring";
  currentStep: number;
  totalSteps: number;
  problems: ReassessmentTransferProblem[];
  selectedTeachingStyle: TeachingStyle;
  delayedCheckDue: boolean;
}

export interface LearnerSkill {
  concept: string;
  masteryPercentage: number;
  status: "mastered" | "proficient" | "developing" | "needs-attention";
  trend?: string;
}

export interface LearnerProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  avatarUrl?: string;
  goal: string;
  level: number;
  levelTitle: string;
  masteryPercentage: number;
  masteryProgressToNextLevel: number;
  problemsSolved: number;
  misconceptionsResolved: number;
  activeMisconceptionsCount: number;
  recurringMisconceptionsCount: number;
  effectiveTeachingStyle: string;
  averageHintsNeeded: number;
  strongestConcepts: string[];
  needsPractice: string[];
  skills: LearnerSkill[];
}

export interface LearningHistoryEvent {
  id: string;
  date: string;
  type: "problem_solved" | "misconception_detected" | "transfer_passed" | "transfer_failed" | "misconception_resolved" | "misconception_recurring";
  title: string;
  detail: string;
  relatedConcept: string;
  codeSnippet?: string;
}

export interface ProblemHistoryRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  concept: string;
  difficulty: "easy" | "medium" | "hard";
  result: "correct" | "diagnosed" | "transfer_passed";
  attempts: number;
  date: string;
  diagnosedMisconception?: string;
  submittedCode: string;
}

export type LearningState =
  | "idle"
  | "running"
  | "correct"
  | "incorrect"
  | "diagnosing"
  | "diagnosed"
  | "probe"
  | "teaching"
  | "reassessment"
  | "resolved";

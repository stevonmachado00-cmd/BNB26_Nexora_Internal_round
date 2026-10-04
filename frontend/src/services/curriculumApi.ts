import type { Problem, TestCase } from "../types";

const baseUrl = (import.meta.env.VITE_RELEARN_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export type ApiQuestion = {
  id: string;
  variant: number;
  prompt: string;
  function: string;
  cases: Array<{ args: unknown[]; expected: unknown }>;
};

export const moduleDetails: Record<string, { title: string; theory: string; focus: string }> = {
  variables: {
    title: "Variables & Data Types",
    focus: "Foundational Python",
    theory: "A variable is a name that refers to a value. Python values have types such as int, float, str, and bool. Use variables to store a result, then use that value in later expressions. For example, total = price * quantity stores a numeric value; print(total) only displays it.",
  },
  conditions: { title: "Conditions & Branching", focus: "Control flow", theory: "Conditions evaluate to True or False. Use comparison operators such as ==, <, and >= to decide which branch of code should run." },
  lists: { title: "Lists & Sequences", focus: "Data structures", theory: "Lists hold ordered values. Python starts list indexes at zero, and some list operations change the original list while others create a new one." },
  loops: { title: "Loops & Iteration", focus: "Control flow", theory: "Loops repeat an action across values. In a for loop, range boundaries and the values produced by the iterator determine what the loop visits." },
  functions: { title: "Functions & Return Values", focus: "Modular code", theory: "Functions receive input through parameters and send useful values back with return. print() displays text but does not return that value to the caller." },
};

export async function getModuleQuestions(topic: string): Promise<ApiQuestion[]> {
  const response = await fetch(`${baseUrl}/questions?topic=${encodeURIComponent(topic)}`);
  if (!response.ok) throw new Error("Re:Learn could not load this module's questions.");
  return response.json() as Promise<ApiQuestion[]>;
}

export function toProblem(question: ApiQuestion, topic: string): Problem {
  const argumentsCount = question.cases[0]?.args.length || 1;
  const parameters = Array.from({ length: argumentsCount }, (_, index) => `value${index + 1}`).join(", ");
  const tests: TestCase[] = question.cases.map((testCase, index) => ({
    id: `${question.id}-${index}`,
    inputDescription: `${question.function}(${testCase.args.map((arg) => JSON.stringify(arg)).join(", ")})`,
    expectedOutput: JSON.stringify(testCase.expected),
  }));
  return {
    id: question.id,
    title: question.function,
    concept: moduleDetails[topic]?.title || "Python practice",
    difficulty: "easy",
    estimatedTime: "8 min",
    description: question.prompt,
    inputDescription: "Use the requested positional arguments.",
    outputDescription: "Return the requested value.",
    constraints: [question.prompt, `Define a function named ${question.function}.`],
    examples: tests.map((test) => ({ input: test.inputDescription, output: test.expectedOutput })),
    starterCode: `def ${question.function}(${parameters}):\n    # Write your solution here\n    pass\n`,
    tests,
    verified: true,
  };
}

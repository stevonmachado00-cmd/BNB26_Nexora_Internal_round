import { Problem } from "../types";
import { MOCK_PROBLEMS, DEMO_PROBLEM_1, DEMO_PROBLEM_DISCOUNT } from "../data/mockData";

export interface GenerationStep {
  text: string;
  done: boolean;
}

export const problemService = {
  getAllProblems(): Problem[] {
    return MOCK_PROBLEMS;
  },

  getProblemById(id: string): Problem | undefined {
    return MOCK_PROBLEMS.find((p) => p.id === id) || DEMO_PROBLEM_1;
  },

  async getNextProblem(): Promise<Problem> {
    // Artificial delay to simulate adaptive retrieval
    await new Promise((resolve) => setTimeout(resolve, 350));
    return DEMO_PROBLEM_1;
  },

  // Verified Problem Generation state simulator (Section 33)
  async generateAdaptiveProblem(
    onStepUpdate?: (step: string, percent: number) => void
  ): Promise<Problem> {
    const steps = [
      { text: "Matching your current skill level...", percent: 25 },
      { text: "Selecting target concept (Functions → Return Values)...", percent: 50 },
      { text: "Building automated test cases and edge constraints...", percent: 75 },
      { text: "Verifying reference solution and AST validation...", percent: 95 },
      { text: "Problem verified & ready.", percent: 100 },
    ];

    for (const step of steps) {
      if (onStepUpdate) onStepUpdate(step.text, step.percent);
      await new Promise((r) => setTimeout(r, 400));
    }

    return DEMO_PROBLEM_DISCOUNT;
  },
};

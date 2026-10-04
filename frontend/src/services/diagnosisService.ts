import { Diagnosis, ExecutionResult, Problem } from "../types";
import { MOCK_MISCONCEPTIONS, MOCK_TRACE_STEPS } from "../data/mockData";

export const diagnosisService = {
  /**
   * Evaluates learner submission to detect root conceptual misconceptions,
   * isolate affected code lines, and compute multi-candidate confidence scores.
   */
  async diagnoseCode(
    code: string,
    problem: Problem,
    execution: ExecutionResult
  ): Promise<Diagnosis> {
    // Realistic AI diagnostic latency (simulating AST parser + ML classifier)
    await new Promise((resolve) => setTimeout(resolve, 650));

    const lines = code.split("\n");
    let printLineNumber = 2;
    lines.forEach((line, idx) => {
      if (line.includes("print(a + b)") || line.includes("print(result)")) {
        if (!line.startsWith("result =")) {
          printLineNumber = idx + 1;
        }
      }
    });

    const returnPrintMisconception = MOCK_MISCONCEPTIONS.find(
      (m) => m.id === "return-vs-print"
    )!;

    return {
      errorType: "conceptual",
      primaryMisconceptionId: returnPrintMisconception.id,
      primaryMisconceptionName: returnPrintMisconception.name,
      confidence: 87,
      topAlternatives: [
        {
          misconceptionId: "return-vs-print",
          misconceptionName: "Return vs Print",
          category: "conceptual",
          confidence: 87,
          reason:
            "Code calls print() inside function body instead of returning computed sum. Caller receives None.",
        },
        {
          misconceptionId: "careless-slip-return",
          misconceptionName: "Careless Return Omission",
          category: "careless-slip",
          confidence: 9,
          reason:
            "Learner understands return mechanics in previous challenges; might have intended to write return.",
        },
        {
          misconceptionId: "function-invocation",
          misconceptionName: "Function Invocation Confusion",
          category: "logical",
          confidence: 4,
          reason: "Possible assumption that printing to standard output communicates with outer scope.",
        },
      ],
      affectedLines: [printLineNumber],
      faultyCodeSnippet: lines[printLineNumber - 1] || "print(a + b)",
      whatHappened:
        "Your function displayed 8 to the console output, but returned None to the caller.",
      whyHappened:
        "You appear to be treating print() as if it delivers the computed value back to whatever called add().",
      mentalModelFix:
        "print() displays characters on the screen for humans to read. return sends data back into your code's memory so other calculations can use it.",
      probeRequired: true,
      probe: returnPrintMisconception.probeQuestion,
      executionTrace: execution.executionTrace || MOCK_TRACE_STEPS,
    };
  },

  /**
   * Refines diagnosis confidence after the learner answers the diagnostic probe
   */
  refineDiagnosisWithProbe(
    currentDiagnosis: Diagnosis,
    selectedOptionId: string
  ): { updatedDiagnosis: Diagnosis; explanationText: string } {
    const isProbeAnswerNone = selectedOptionId === "opt-2"; // 'None' is the right answer to 'x = print(5)'

    if (isProbeAnswerNone) {
      return {
        updatedDiagnosis: {
          ...currentDiagnosis,
          confidence: 94,
          topAlternatives: [
            {
              misconceptionId: "return-vs-print",
              misconceptionName: "Return vs Print (Grounded)",
              category: "conceptual",
              confidence: 94,
              reason: "Confirmed: Learner recognizes print() evaluates to None, resolving ambiguity against careless slip.",
            },
            {
              misconceptionId: "careless-slip-return",
              misconceptionName: "Careless Return Omission",
              category: "careless-slip",
              confidence: 4,
              reason: "Downweighted following probe accuracy.",
            },
            {
              misconceptionId: "function-invocation",
              misconceptionName: "Function Invocation",
              category: "logical",
              confidence: 2,
              reason: "Downweighted.",
            },
          ],
        },
        explanationText:
          "✓ Exactly right! print(5) returns None. Since you know this, let's fix the belief that print() can pass data to functions.",
      };
    } else {
      return {
        updatedDiagnosis: {
          ...currentDiagnosis,
          confidence: 98,
          whatHappened:
            "Selecting 5 indicates a clear mental model misconception: you believed print() produces its argument as an assignment value!",
        },
        explanationText:
          "Notice that print(5) does NOT store 5! It outputs 5 to the console, and stores None. In Python, print() always returns None.",
      };
    }
  },
};

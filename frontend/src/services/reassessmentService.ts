import {
  ReassessmentSession,
  ReassessmentTransferProblem,
  TeachingStyle,
} from "../types";

export const TRANSFER_PROBLEMS: Record<string, ReassessmentTransferProblem[]> = {
  "return-vs-print": [
    {
      id: "transfer-tax-1",
      title: "Transfer Problem 1: Calculate Sales Tax",
      surfaceContext: "Tax Calculation & Finance",
      underlyingConcept: "Functions must return values for dependent calculations",
      prompt:
        "Write a function `calculate_tax(subtotal, rate)` that returns the total final price (subtotal + subtotal * rate). The returned value must be usable in further arithmetic.",
      starterCode: `def calculate_tax(subtotal, rate):
    # Calculate tax and return the total sum
    pass
`,
      tests: [
        { id: "tt1", inputDescription: "calculate_tax(100, 0.08)", expectedOutput: "108.0" },
        { id: "tt2", inputDescription: "calculate_tax(50, 0.10)", expectedOutput: "55.0" },
        { id: "tt3", inputDescription: "calculate_tax(200, 0.0)", expectedOutput: "200.0" },
      ],
      predictAndExplain: {
        code: `def get_tax(subtotal, rate):\n    print(subtotal * rate)\n\ntax = get_tax(100, 0.05)\nprint(tax)`,
        question: "What does print(tax) output on the last line?",
        options: ["5.0", "None", "5", "TypeError"],
        correctIndex: 1,
      },
    },
    {
      id: "transfer-shipping-2",
      title: "Transfer Problem 2: Shipping Fee Calculator",
      surfaceContext: "E-Commerce Shipping",
      underlyingConcept: "Value passing across multiple nested caller functions",
      prompt:
        "Write a function `add_shipping(cart_total, weight)` that returns cart_total + 10 if weight > 5, otherwise returns cart_total + 5.",
      starterCode: `def add_shipping(cart_total, weight):
    # Return total with shipping included
    pass
`,
      tests: [
        { id: "ts1", inputDescription: "add_shipping(40, 6)", expectedOutput: "50" },
        { id: "ts2", inputDescription: "add_shipping(40, 3)", expectedOutput: "45" },
        { id: "ts3", inputDescription: "add_shipping(100, 5)", expectedOutput: "105" },
      ],
    },
    {
      id: "transfer-predict-3",
      title: "Predict & Explain Transfer Check",
      surfaceContext: "Prediction Mode",
      underlyingConcept: "Distinguish between print display side-effects and returned references",
      prompt:
        "Predict what will be printed by the caller code below, and explain the underlying reason.",
      starterCode: "",
      tests: [],
      predictAndExplain: {
        code: `def double(n):\n    return n * 2\n\ndef show_double(n):\n    print(n * 2)\n\na = double(4)\nb = show_double(4)\nprint(a, b)`,
        question: "What is printed by the final line: print(a, b)?",
        options: [
          "8 8",
          "8 None",
          "None 8",
          "8 followed by an Error",
        ],
        correctIndex: 1,
      },
    },
  ],
};

export const reassessmentService = {
  getReassessmentSession(misconceptionId: string): ReassessmentSession {
    const problems = TRANSFER_PROBLEMS[misconceptionId] || TRANSFER_PROBLEMS["return-vs-print"];
    return {
      misconceptionId,
      misconceptionName: "Return vs Print",
      status: "active",
      currentStep: 1,
      totalSteps: problems.length,
      problems,
      selectedTeachingStyle: "contrast-examples",
      delayedCheckDue: false,
    };
  },

  evaluatePredictAndExplain(
    selectedOptionIndex: number,
    correctIndex: number,
    explanationText: string
  ): {
    predictionCorrect: boolean;
    explanationQuality: "sound" | "guessing" | "misconception";
    feedback: string;
  } {
    const predictionCorrect = selectedOptionIndex === correctIndex;
    const lower = explanationText.toLowerCase();

    // Check explanation keywords
    const mentionsReturnOrNone =
      lower.includes("return") ||
      lower.includes("none") ||
      lower.includes("side-effect") ||
      lower.includes("caller");

    const mentionsGuess =
      lower.includes("guess") ||
      lower.includes("idk") ||
      lower.includes("maybe") ||
      explanationText.trim().length < 8;

    if (!predictionCorrect) {
      return {
        predictionCorrect: false,
        explanationQuality: "misconception",
        feedback:
          "The prediction was incorrect. Review how functions without explicit return statements yield None.",
      };
    }

    if (mentionsGuess || !mentionsReturnOrNone) {
      return {
        predictionCorrect: true,
        explanationQuality: "guessing",
        feedback:
          "Prediction correct, but explanation suggests guessing. Notice why: show_double() prints 8 but returns None to variable b!",
      };
    }

    return {
      predictionCorrect: true,
      explanationQuality: "sound",
      feedback:
        "✓ Prediction correct & explanation demonstrates clear conceptual understanding! You clearly identified that show_double() yields None while double() returns the numeric value.",
    };
  },

  getTeachingStyleContent(style: TeachingStyle) {
    switch (style) {
      case "contrast-examples":
        return {
          title: "Contrast Comparison: Side-Effect vs Return Value",
          badge: "Your Strongest Learning Style",
          description: "Compare two identical setups side-by-side to inspect where data actually flows.",
          exampleA: {
            title: "Flawed Pattern: Using print()",
            code: `def compute_discount(price, pct):\n    print(price * pct)  # Displays to terminal only\n\nsavings = compute_discount(100, 0.2)\nfinal_price = 100 - savings # CRASH: TypeError! (100 - None)`,
            note: "Terminal shows 20, but 'savings' is None. Program crashes.",
          },
          exampleB: {
            title: "Sound Pattern: Using return",
            code: `def compute_discount(price, pct):\n    return price * pct  # Returns value to caller\n\nsavings = compute_discount(100, 0.2)\nfinal_price = 100 - savings # Works! (100 - 20 = 80)`,
            note: "Value 20 flows into 'savings', allowing math to continue.",
          },
        };
      case "visual-trace":
        return {
          title: "Visual Memory Frame Trace",
          badge: "Interactive Visualization",
          description: "Watch the execution frame close and notice where the values go.",
          steps: [
            "Step 1: Outer scope calls add(5, 3). A new local stack frame is created.",
            "Step 2: print(8) writes byte '8' to OS stdout buffer.",
            "Step 3: Frame deallocates. No return value was specified, so Python hands None to the caller.",
            "Step 4: Caller assigns result = None.",
          ],
        };
      case "step-by-step":
        return {
          title: "Step-by-Step Rule Walkthrough",
          badge: "Guided Rules",
          description: "Three strict rules for writing reliable Python functions.",
          steps: [
            "Rule 1: If someone else or another line needs the result, use 'return'.",
            "Rule 2: If only human eyes need to glance at text right now, use 'print()'.",
            "Rule 3: print() inside a function does NOT send anything back.",
          ],
        };
    }
  },
};

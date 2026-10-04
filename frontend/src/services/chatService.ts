import { ChatMessage, Hint } from "../types";

export const RETURN_PRINT_HINTS: Hint[] = [
  {
    level: 1,
    title: "Level 1: Guiding Question",
    content:
      "When your function runs `print(a + b)`, where does that 8 go? Does it go back into `result`, or does it just appear on the screen?",
  },
  {
    level: 2,
    title: "Level 2: Pointer Toward The Core Idea",
    content:
      "Notice that line 4 says `result = add(5, 3)`. To store a value in `result`, the function `add` needs to give something back using a specific Python keyword.",
  },
  {
    level: 3,
    title: "Level 3: Contrast Example",
    content:
      "Think of `print()` like a loudspeaker (it makes a sound in the room, but hands nobody an object). `return` is like handing an envelope with the answer to whoever asked.",
    codeExample: `# Loudspeaker (print):
def shout_score():
    print(100) # You hear 100, but hands you None

# Envelope (return):
def deliver_score():
    return 100 # Your variable now holds 100`,
  },
  {
    level: 4,
    title: "Level 4: Worked Transfer Example",
    content:
      "Here is how a similar function returns a calculated number so other code can use it:",
    codeExample: `def multiply(x, y):
    return x * y # Uses 'return', NOT 'print()'

doubled = multiply(4, 2)
print("Doubled is:", doubled) # 'doubled' is 8!`,
  },
];

export const chatService = {
  getInitialMessages(): ChatMessage[] {
    return [
      {
        id: "msg-welcome",
        sender: "relearn",
        text: "Hi Alex! I noticed a conceptual mismatch with print vs return on Line 2. What would you like to explore?",
        timestamp: "Just now",
      },
    ];
  },

  async askQuestion(
    question: string,
    currentHintLevel: number
  ): Promise<{ responseMessage: ChatMessage; nextHintLevel: number; hint?: Hint }> {
    // Realistic AI tutor thinking delay
    await new Promise((r) => setTimeout(r, 650));

    const lower = question.toLowerCase();
    let text = "";
    let hint: Hint | undefined;
    let nextHint = currentHintLevel;

    if (lower.includes("why is print different") || lower.includes("why print")) {
      nextHint = Math.min(4, Math.max(1, currentHintLevel + 1));
      hint = RETURN_PRINT_HINTS[nextHint - 1];
      text =
        "`print()` is an output action — it sends text to the console screen for a human to read. But the code itself gets nothing back (it gets Python's `None`). To pass the answer to another variable or function, Python requires the `return` statement.";
    } else if (lower.includes("example") || lower.includes("contrast")) {
      nextHint = 3;
      hint = RETURN_PRINT_HINTS[2];
      text =
        "Here's a quick contrast: `print()` announces a value to the room, while `return` hands the value directly to the variable waiting for it.";
    } else if (lower.includes("simply") || lower.includes("simple")) {
      nextHint = 1;
      hint = RETURN_PRINT_HINTS[0];
      text =
        "In simple terms: `print()` is for human eyes on a monitor. `return` is for your Python program to remember the number.";
    } else if (lower.includes("step by step") || lower.includes("trace")) {
      text =
        "When line 2 runs `print(a + b)`, Python writes '8' to the terminal and returns `None`. Then on line 4, `result` is assigned `None`. That's why printing `result` on line 5 displays `None`!";
    } else {
      nextHint = Math.min(4, currentHintLevel + 1);
      hint = RETURN_PRINT_HINTS[nextHint - 1];
      text = `Good question! Think about what data type line 4 receives. Since add() has no return statement, Python automatically hands back None.`;
    }

    const responseMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "relearn",
      text,
      timestamp: "Just now",
      hintLevel: hint ? hint.level : undefined,
    };

    return { responseMessage, nextHintLevel: nextHint, hint };
  },
};

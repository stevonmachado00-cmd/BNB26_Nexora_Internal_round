import {
  Misconception,
  Problem,
  LearnerProfile,
  LearningHistoryEvent,
  ProblemHistoryRecord,
  TraceStep,
} from "../types";

export const INITIAL_LEARNER: LearnerProfile = {
  id: "learner_alex_01",
  name: "Alex Morgan",
  title: "Python Learner",
  email: "alex.morgan@relearn.io",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
  goal: "Placements & Interviews",
  level: 8,
  levelTitle: "Python Explorer",
  masteryPercentage: 67,
  masteryProgressToNextLevel: 74, // progress towards Level 9
  problemsSolved: 84,
  misconceptionsResolved: 17,
  activeMisconceptionsCount: 2,
  recurringMisconceptionsCount: 3,
  effectiveTeachingStyle: "Contrast examples",
  averageHintsNeeded: 1.7,
  strongestConcepts: ["Variables", "Conditions", "Lists"],
  needsPractice: ["Functions", "Dictionaries", "Loops"],
  skills: [
    { concept: "Variables", masteryPercentage: 91, status: "mastered", trend: "+2%" },
    { concept: "Conditions", masteryPercentage: 78, status: "proficient", trend: "+5%" },
    { concept: "Lists", masteryPercentage: 73, status: "proficient", trend: "+2%" },
    { concept: "Loops", masteryPercentage: 64, status: "developing", trend: "+5%" },
    { concept: "Problem Solving", masteryPercentage: 58, status: "developing", trend: "+2%" },
    { concept: "Functions", masteryPercentage: 52, status: "needs-attention", trend: "-1%" },
    { concept: "Dictionaries", masteryPercentage: 41, status: "needs-attention", trend: "stable" },
  ],
};

export const MOCK_MISCONCEPTIONS: Misconception[] = [
  {
    id: "return-vs-print",
    name: "Return vs Print",
    category: "conceptual",
    faultyBelief: "Treating print() as if it delivers or returns a value back to the calling scope.",
    explanation:
      "print() is a side-effect function that outputs text to the standard console display. It does not hand back any value to your code; its return value is always Python's None. To pass data back to caller variables or expressions, a function must use the 'return' statement.",
    contrastExample: {
      flawed: "def add(a, b):\n    print(a + b) # Displays to screen, yields None\n\nval = add(2, 3)\nprint(val * 2) # TypeError: unsupported operand type for NoneType",
      sound: "def add(a, b):\n    return a + b # Hands value back to caller\n\nval = add(2, 3)\nprint(val * 2) # Displays 10",
      explanation: "print() only talks to the human watching the screen; return talks to the rest of the program.",
    },
    probeQuestion: {
      id: "probe-return-print-1",
      question: "What does this code store in variable x?",
      codeSnippet: "x = print(5)",
      options: [
        { id: "opt-1", label: "A", text: "5", isCorrect: false, diagnosisShift: "Strong evidence of conceptual confusion: learner believes print yields output to assignment." },
        { id: "opt-2", label: "B", text: "None", isCorrect: true, diagnosisShift: "Learner knows print returns None, so mistake in code may be a slip or context confusion." },
        { id: "opt-3", label: "C", text: '"5"', isCorrect: false, diagnosisShift: "Learner believes print returns stringified output." },
        { id: "opt-4", label: "D", text: "It causes a SyntaxError", isCorrect: false, diagnosisShift: "Learner lacks familiarity with function invocation syntax." },
      ],
      explanation: "In Python, print() always returns None. Storing the result of print(5) assigns None to x.",
    },
    status: "active",
    confidence: 87,
    occurrenceCount: 3,
    resolvedCount: 2,
    returnedCount: 2,
    effectiveTeachingStyle: "contrast-examples",
    lastEncountered: "Today, 10 minutes ago",
    relatedConcept: "Functions → Return Values",
  },
  {
    id: "loop-boundaries",
    name: "Loop boundaries & range() off-by-one",
    category: "conceptual",
    faultyBelief: "Assuming range(start, stop) includes the 'stop' integer value.",
    explanation:
      "Python's range(start, stop) is half-open: it includes 'start' but terminates strictly before 'stop' (up to stop - 1).",
    contrastExample: {
      flawed: "for i in range(1, 5): # Iterates 1, 2, 3, 4 (stops before 5)\n    print(i)",
      sound: "for i in range(1, 5 + 1): # Explicitly includes 5\n    print(i)",
      explanation: "range(a, b) generates numbers up to but not including b. Think of it as 'start <= i < stop'.",
    },
    probeQuestion: {
      id: "probe-range-1",
      question: "How many times does this loop execute?",
      codeSnippet: "for i in range(3, 7):\n    pass",
      options: [
        { id: "p1", label: "A", text: "5 times (3, 4, 5, 6, 7)", isCorrect: false },
        { id: "p2", label: "B", text: "4 times (3, 4, 5, 6)", isCorrect: true },
        { id: "p3", label: "C", text: "3 times (4, 5, 6)", isCorrect: false },
        { id: "p4", label: "D", text: "7 times", isCorrect: false },
      ],
      explanation: "7 - 3 = 4 elements: 3, 4, 5, 6.",
    },
    status: "recurring",
    confidence: 82,
    occurrenceCount: 5,
    resolvedCount: 1,
    returnedCount: 2,
    effectiveTeachingStyle: "visual-trace",
    lastEncountered: "Yesterday",
    relatedConcept: "Loops → For Loops",
  },
  {
    id: "accumulator-init",
    name: "Accumulator Initialization",
    category: "logical",
    faultyBelief: "Believing accumulator variables auto-initialize or resetting them inside the loop body.",
    explanation:
      "An accumulator like 'total = 0' must be initialized once before the loop begins. Initializing it inside the loop resets the sum on every iteration.",
    contrastExample: {
      flawed: "for num in [1, 2, 3]:\n    total = 0 # Bug: resets to 0 every time!\n    total += num",
      sound: "total = 0 # Initialize before loop\nfor num in [1, 2, 3]:\n    total += num",
      explanation: "Placing accumulator variables inside the loop wipes your previous memory on each step.",
    },
    probeQuestion: {
      id: "probe-accum-1",
      question: "What is the final value of total after the loop?",
      codeSnippet: "for x in [10, 20, 30]:\n    total = 0\n    total += x",
      options: [
        { id: "a1", label: "A", text: "60", isCorrect: false },
        { id: "a2", label: "B", text: "30", isCorrect: true },
        { id: "a3", label: "C", text: "0", isCorrect: false },
        { id: "a4", label: "D", text: "Error: total not defined", isCorrect: false },
      ],
      explanation: "On the final iteration, total is set to 0 and 30 is added, resulting in 30.",
    },
    status: "active",
    confidence: 76,
    occurrenceCount: 2,
    resolvedCount: 0,
    returnedCount: 0,
    effectiveTeachingStyle: "step-by-step",
    lastEncountered: "2 days ago",
    relatedConcept: "Loops → Accumulators",
  },
  {
    id: "list-mutation-vs-reassign",
    name: "List Mutation vs Reassignment",
    category: "conceptual",
    faultyBelief: "Expecting list methods like .append() or .sort() to return the updated list instead of None.",
    explanation:
      "Methods like list.append(x) and list.sort() modify the list in-place and return None. Writing 'my_list = my_list.append(x)' turns your list into None!",
    contrastExample: {
      flawed: "nums = [3, 1, 2]\nnums = nums.sort() # nums is now None!",
      sound: "nums = [3, 1, 2]\nnums.sort() # in-place\n# or: nums = sorted(nums)",
      explanation: "In-place mutating methods in Python intentionally return None to remind you they mutated the original object.",
    },
    probeQuestion: {
      id: "probe-mutation-1",
      question: "What does this code output?",
      codeSnippet: "items = [1, 2]\nitems = items.append(3)\nprint(items)",
      options: [
        { id: "m1", label: "A", text: "[1, 2, 3]", isCorrect: false },
        { id: "m2", label: "B", text: "None", isCorrect: true },
        { id: "m3", label: "C", text: "3", isCorrect: false },
        { id: "m4", label: "D", text: "AttributeError", isCorrect: false },
      ],
      explanation: "append() returns None, so items is reassigned to None.",
    },
    status: "recurring",
    confidence: 79,
    occurrenceCount: 4,
    resolvedCount: 2,
    returnedCount: 2,
    effectiveTeachingStyle: "contrast-examples",
    lastEncountered: "3 days ago",
    relatedConcept: "Lists → Methods",
  },
  {
    id: "equality-vs-assignment",
    name: "Equality (==) vs Assignment (=)",
    category: "syntax",
    faultyBelief: "Confusing '=' (setting a value) with '==' (testing whether values are equal).",
    explanation:
      "Single equals '=' is an assignment operator in Python. Double equals '==' is a comparison operator returning True or False.",
    contrastExample: {
      flawed: "if status = 'active': # SyntaxError in Python\n    pass",
      sound: "if status == 'active': # Compares equality\n    pass",
      explanation: "Use = to store a value; use == to ask if two values match.",
    },
    probeQuestion: {
      id: "probe-eq-1",
      question: "Which line properly checks if age is 18?",
      codeSnippet: "# Option A: if age = 18:\n# Option B: if age == 18:",
      options: [
        { id: "eq1", label: "A", text: "if age = 18", isCorrect: false },
        { id: "eq2", label: "B", text: "if age == 18", isCorrect: true },
      ],
      explanation: "== checks equality in Python conditions.",
    },
    status: "resolved",
    confidence: 96,
    occurrenceCount: 3,
    resolvedCount: 3,
    returnedCount: 0,
    effectiveTeachingStyle: "step-by-step",
    lastEncountered: "Last week",
    relatedConcept: "Conditions → Operators",
  },
  {
    id: "variable-scope",
    name: "Variable Scope Misunderstanding",
    category: "conceptual",
    faultyBelief: "Expecting variables created inside a function to exist outside in the global namespace.",
    explanation:
      "Variables created inside a function are local to that function. Once the function finishes executing, those local variables are deallocated.",
    contrastExample: {
      flawed: "def compute():\n    score = 100\n\ncompute()\nprint(score) # NameError: name 'score' is not defined",
      sound: "def compute():\n    score = 100\n    return score\n\nscore = compute()\nprint(score) # Works!",
      explanation: "Functions have their own private scratchpad (local scope). To share data outside, return it.",
    },
    probeQuestion: {
      id: "probe-scope-1",
      question: "What happens when running print(temp) after running set_temp()?",
      codeSnippet: "def set_temp():\n    temp = 98.6\nset_temp()\nprint(temp)",
      options: [
        { id: "s1", label: "A", text: "Prints 98.6", isCorrect: false },
        { id: "s2", label: "B", text: "Raises NameError", isCorrect: true },
        { id: "s3", label: "C", text: "Prints None", isCorrect: false },
        { id: "s4", label: "D", text: "Prints 0", isCorrect: false },
      ],
      explanation: "temp is local to set_temp and does not exist in the global scope.",
    },
    status: "active",
    confidence: 65,
    occurrenceCount: 2,
    resolvedCount: 0,
    returnedCount: 0,
    effectiveTeachingStyle: "visual-trace",
    lastEncountered: "Yesterday",
    relatedConcept: "Functions → Scope",
  },
  {
    id: "list-indexing-bounds",
    name: "List Indexing & Zero-Indexing",
    category: "conceptual",
    faultyBelief: "Assuming the first item in a list is at index 1 or forgetting that length N means valid indices are 0 to N-1.",
    explanation:
      "Python sequences are 0-indexed. A list with 3 elements has items at indices 0, 1, and 2. Accessing index 3 triggers IndexError.",
    contrastExample: {
      flawed: "items = ['apple', 'banana', 'cherry']\nfirst = items[1] # 'banana', not 'apple'!",
      sound: "items = ['apple', 'banana', 'cherry']\nfirst = items[0] # 'apple'",
      explanation: "Indices measure offset from the start: 0 steps away is the first element.",
    },
    probeQuestion: {
      id: "probe-idx-1",
      question: "What does items[-1] access in a non-empty Python list?",
      codeSnippet: "items = [10, 20, 30]\nval = items[-1]",
      options: [
        { id: "i1", label: "A", text: "The first element (10)", isCorrect: false },
        { id: "i2", label: "B", text: "The last element (30)", isCorrect: true },
        { id: "i3", label: "C", text: "Negative index error", isCorrect: false },
        { id: "i4", label: "D", text: "None", isCorrect: false },
      ],
      explanation: "-1 in Python indexes from the end, retrieving the last item.",
    },
    status: "resolved",
    confidence: 93,
    occurrenceCount: 2,
    resolvedCount: 2,
    returnedCount: 0,
    effectiveTeachingStyle: "contrast-examples",
    lastEncountered: "4 days ago",
    relatedConcept: "Lists → Indexing",
  },
  {
    id: "boolean-condition-precedence",
    name: "Boolean Condition Evaluation & Truthiness",
    category: "logical",
    faultyBelief: "Writing 'if x == 1 or 2:' expecting it to test whether x is either 1 or 2.",
    explanation:
      "Python evaluates 'x == 1 or 2' as '(x == 1) or (2)'. Since non-zero integers are truthy, '(2)' is always True, making the whole condition always True!",
    contrastExample: {
      flawed: "if choice == 'yes' or 'y': # Bug: 'y' is always truthy!\n    print('Confirmed')",
      sound: "if choice == 'yes' or choice == 'y': # or: if choice in ('yes', 'y'):\n    print('Confirmed')",
      explanation: "Both sides of an 'or' must be full boolean expressions or you should use 'in'.",
    },
    probeQuestion: {
      id: "probe-bool-1",
      question: "What will this print when n is 5?",
      codeSnippet: "n = 5\nif n == 1 or 2:\n    print('Match')\nelse:\n    print('No match')",
      options: [
        { id: "b1", label: "A", text: "No match", isCorrect: false },
        { id: "b2", label: "B", text: "Match", isCorrect: true },
        { id: "b3", label: "C", text: "SyntaxError", isCorrect: false },
      ],
      explanation: "Because '2' is truthy, the 'or 2' clause makes the condition evaluate to True regardless of n.",
    },
    status: "never-seen",
    confidence: 50,
    occurrenceCount: 0,
    resolvedCount: 0,
    returnedCount: 0,
    effectiveTeachingStyle: "step-by-step",
    lastEncountered: "Not yet encountered",
    relatedConcept: "Conditions → Logic",
  },
  {
    id: "dict-key-error",
    name: "Direct Key Access vs .get()",
    category: "runtime",
    faultyBelief: "Assuming dict[key] gracefully defaults to None when a key is absent.",
    explanation:
      "Accessing a dictionary with square brackets d[key] throws a KeyError if the key does not exist. Use d.get(key, default) for safe retrieval.",
    contrastExample: {
      flawed: "user = {'name': 'Alex'}\nage = user['age'] # Raises KeyError: 'age'",
      sound: "user = {'name': 'Alex'}\nage = user.get('age', 0) # Safely returns default 0",
      explanation: "Direct index lookup crashes on missing keys; .get() returns a fallback default.",
    },
    probeQuestion: {
      id: "probe-dict-1",
      question: "What happens when executing d['role']?",
      codeSnippet: "d = {'name': 'Alex'}\nr = d['role']",
      options: [
        { id: "d1", label: "A", text: "Returns None", isCorrect: false },
        { id: "d2", label: "B", text: "Raises KeyError", isCorrect: true },
        { id: "d3", label: "C", text: "Returns empty string", isCorrect: false },
      ],
      explanation: "Direct square bracket access triggers a KeyError for missing keys.",
    },
    status: "resolved",
    confidence: 91,
    occurrenceCount: 2,
    resolvedCount: 2,
    returnedCount: 0,
    effectiveTeachingStyle: "contrast-examples",
    lastEncountered: "5 days ago",
    relatedConcept: "Dictionaries → Access",
  },
  {
    id: "string-immutability",
    name: "String In-Place Modification",
    category: "runtime",
    faultyBelief: "Attempting to change individual characters in a string via item assignment (s[0] = 'X').",
    explanation:
      "Python strings are immutable. You cannot mutate characters in place. To change a string, create a new one using concatenation or slicing.",
    contrastExample: {
      flawed: "text = 'hello'\ntext[0] = 'H' # TypeError: 'str' object does not support item assignment",
      sound: "text = 'hello'\ntext = 'H' + text[1:] # Creates a new string 'Hello'",
      explanation: "Strings are read-only sequences in memory. Create new strings rather than mutating.",
    },
    probeQuestion: {
      id: "probe-str-1",
      question: "What is the result of s[0] = 'a' in Python?",
      codeSnippet: "s = 'cat'\ns[0] = 'b'",
      options: [
        { id: "st1", label: "A", text: "s becomes 'bat'", isCorrect: false },
        { id: "st2", label: "B", text: "TypeError is raised", isCorrect: true },
        { id: "st3", label: "C", text: "s becomes None", isCorrect: false },
      ],
      explanation: "Python raises TypeError because strings are immutable.",
    },
    status: "resolved",
    confidence: 94,
    occurrenceCount: 1,
    resolvedCount: 1,
    returnedCount: 0,
    effectiveTeachingStyle: "contrast-examples",
    lastEncountered: "6 days ago",
    relatedConcept: "Strings → Immutability",
  },
  {
    id: "function-param-mutability",
    name: "Default Mutable Arguments",
    category: "conceptual",
    faultyBelief: "Assuming default arguments like def f(x=[]) create a fresh empty list every time the function is called.",
    explanation:
      "Default parameter expressions are evaluated once when the function is defined, not each time it is called. A mutable default is shared across all invocations!",
    contrastExample: {
      flawed: "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst # Shares same list across calls!",
      sound: "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      explanation: "Use None as the sentinel default and create a fresh collection inside.",
    },
    probeQuestion: {
      id: "probe-param-1",
      question: "What does second call to append_val('b') return?",
      codeSnippet: "def append_val(x, l=[]):\n    l.append(x)\n    return l\nappend_val('a')\nprint(append_val('b'))",
      options: [
        { id: "prm1", label: "A", text: "['b']", isCorrect: false },
        { id: "prm2", label: "B", text: "['a', 'b']", isCorrect: true },
        { id: "prm3", label: "C", text: "None", isCorrect: false },
      ],
      explanation: "The default list is reused, retaining 'a' from the first call.",
    },
    status: "never-seen",
    confidence: 45,
    occurrenceCount: 0,
    resolvedCount: 0,
    returnedCount: 0,
    effectiveTeachingStyle: "visual-trace",
    lastEncountered: "Not yet encountered",
    relatedConcept: "Functions → Parameters",
  },
  {
    id: "careless-slip-return",
    name: "Careless Return Omission",
    category: "careless-slip",
    faultyBelief: "The learner understands the difference between print and return, but omitted return due to a typing oversight.",
    explanation:
      "The student's other code and answers show clear mental models of return values, but in this specific problem they simply forgot the return keyword.",
    contrastExample: {
      flawed: "def sum(a, b):\n    total = a + b # calculated correctly, but forgot 'return total'",
      sound: "def sum(a, b):\n    return a + b",
      explanation: "This is a slip of execution rather than a conceptual misconception.",
    },
    probeQuestion: {
      id: "probe-slip-1",
      question: "Do you know why the caller received None here?",
      codeSnippet: "def calc(a, b):\n    res = a * b\nval = calc(4, 5)",
      options: [
        { id: "sl1", label: "A", text: "Yes, I just forgot to write 'return res'", isCorrect: true },
        { id: "sl2", label: "B", text: "I thought res would be returned automatically", isCorrect: false },
      ],
      explanation: "Distinguishes a careless omission from an automated return belief.",
    },
    status: "resolved",
    confidence: 90,
    occurrenceCount: 1,
    resolvedCount: 1,
    returnedCount: 0,
    effectiveTeachingStyle: "step-by-step",
    lastEncountered: "1 week ago",
    relatedConcept: "Functions → Return Values",
  },
];

export const MOCK_TRACE_STEPS: TraceStep[] = [
  {
    step: 1,
    line: 1,
    code: "def add(a, b):",
    explanation: "Function 'add' is registered into memory with parameters 'a' and 'b'.",
    variables: { a: "unbound", b: "unbound" },
  },
  {
    step: 2,
    line: 4,
    code: "result = add(5, 3)",
    explanation: "Calling add(5, 3). Arguments are passed: a = 5, b = 3. Execution jumps into function body.",
    variables: { a: 5, b: 3 },
  },
  {
    step: 3,
    line: 2,
    code: "print(a + b)",
    explanation: "Evaluates 5 + 3 = 8. print(8) sends text '8' to the console display. print() returns None.",
    variables: { a: 5, b: 3, "a + b": 8 },
    stdout: "8",
  },
  {
    step: 4,
    line: 2,
    code: "# Function ends without explicit return",
    explanation: "End of function reached without an explicit 'return' statement. Python implicitly returns None.",
    variables: { a: 5, b: 3 },
    returnValue: "None",
  },
  {
    step: 5,
    line: 4,
    code: "result = add(5, 3)",
    explanation: "Caller assigns the return value of add(5, 3) to variable 'result'. Since return value was None, result = None.",
    variables: { result: "None" },
  },
  {
    step: 6,
    line: 5,
    code: "print(result)",
    explanation: "print(result) outputs the string representation of None to the console display.",
    variables: { result: "None" },
    stdout: "None",
  },
];

export const DEMO_PROBLEM_1: Problem = {
  id: "problem-12-functions",
  title: "Calculate Total (Sum of Two Numbers)",
  concept: "Functions → Return Values",
  difficulty: "medium",
  estimatedTime: "8 min",
  description:
    "Write a function called `add(a, b)` that takes two numeric arguments and returns their sum. Ensure the caller receives the numeric value.",
  inputDescription: "Two numbers, a and b (integers or floats).",
  outputDescription: "The numeric sum of a and b returned to the caller.",
  constraints: [
    "-10^6 <= a, b <= 10^6",
    "Must return a number, not print it to standard output",
  ],
  examples: [
    { input: "5, 3", output: "8", explanation: "add(5, 3) returns 8" },
    { input: "10, -2", output: "8", explanation: "add(10, -2) returns 8" },
  ],
  starterCode: `def add(a, b):
    # Write your solution here
    pass

result = add(5, 3)
print("Result is:", result)
`,
  demoCode: `def add(a, b):
    print(a + b)

result = add(5, 3)
print(result)
`,
  correctCode: `def add(a, b):
    return a + b

result = add(5, 3)
print(result)
`,
  tests: [
    { id: "t1", inputDescription: "add(5, 3)", expectedOutput: "8" },
    { id: "t2", inputDescription: "add(10, -2)", expectedOutput: "8" },
    { id: "t3", inputDescription: "add(0, 0)", expectedOutput: "0" },
    { id: "t4", inputDescription: "add(100, 250)", expectedOutput: "350" },
    { id: "t5", inputDescription: "add(-5, -5)", expectedOutput: "-10" },
  ],
  verified: true,
  targetMisconceptions: ["return-vs-print", "careless-slip-return"],
};

export const DEMO_PROBLEM_DISCOUNT: Problem = {
  id: "problem-14-discount",
  title: "Calculate Discount",
  concept: "Functions → Return Values",
  difficulty: "medium",
  estimatedTime: "8 min",
  description:
    "Write a function called `calculate_discount(price, discount)` that returns the final price after applying the discount percentage or amount.",
  inputDescription: "price (number), discount (number)",
  outputDescription: "The final price after subtracting discount.",
  constraints: ["price >= 0", "discount >= 0"],
  examples: [
    { input: "100, 20", output: "80", explanation: "100 - 20 = 80" },
    { input: "50, 5", output: "45", explanation: "50 - 5 = 45" },
  ],
  starterCode: `def calculate_discount(price, discount):
    # Write your solution here
    pass
`,
  demoCode: `def calculate_discount(price, discount):
    result = price - discount
    print(result)
`,
  correctCode: `def calculate_discount(price, discount):
    return price - discount
`,
  tests: [
    { id: "td1", inputDescription: "calculate_discount(100, 20)", expectedOutput: "80" },
    { id: "td2", inputDescription: "calculate_discount(50, 5)", expectedOutput: "45" },
    { id: "td3", inputDescription: "calculate_discount(0, 0)", expectedOutput: "0" },
    { id: "td4", inputDescription: "calculate_discount(200, 50)", expectedOutput: "150" },
  ],
  verified: true,
  targetMisconceptions: ["return-vs-print"],
};

export const MOCK_PROBLEMS: Problem[] = [
  DEMO_PROBLEM_1,
  DEMO_PROBLEM_DISCOUNT,
  {
    id: "problem-15-average",
    title: "Calculate Average",
    concept: "Functions → Math",
    difficulty: "easy",
    estimatedTime: "5 min",
    description: "Write a function `calculate_average(numbers)` that returns the arithmetic mean of a non-empty list of numbers.",
    inputDescription: "A list of numbers.",
    outputDescription: "A float representing the average.",
    constraints: ["len(numbers) >= 1"],
    examples: [{ input: "[10, 20, 30]", output: "20.0" }],
    starterCode: `def calculate_average(numbers):
    pass
`,
    correctCode: `def calculate_average(numbers):
    return sum(numbers) / len(numbers)
`,
    tests: [
      { id: "ta1", inputDescription: "[10, 20, 30]", expectedOutput: "20.0" },
      { id: "ta2", inputDescription: "[5, 5, 5, 5]", expectedOutput: "5.0" },
    ],
    verified: true,
  },
  {
    id: "problem-16-filter",
    title: "List Filter Even Numbers",
    concept: "Lists → Comprehensions",
    difficulty: "medium",
    estimatedTime: "10 min",
    description: "Write a function `filter_evens(nums)` that returns a new list containing only the even numbers from nums.",
    inputDescription: "A list of integers.",
    outputDescription: "A filtered list of even integers.",
    constraints: ["Preserve order of original elements"],
    examples: [{ input: "[1, 2, 3, 4, 5, 6]", output: "[2, 4, 6]" }],
    starterCode: `def filter_evens(nums):
    pass
`,
    correctCode: `def filter_evens(nums):
    return [n for n in nums if n % 2 == 0]
`,
    tests: [
      { id: "tf1", inputDescription: "[1, 2, 3, 4, 5, 6]", expectedOutput: "[2, 4, 6]" },
      { id: "tf2", inputDescription: "[1, 3, 5]", expectedOutput: "[]" },
    ],
    verified: true,
  },
];

export const MOCK_HISTORY_EVENTS: LearningHistoryEvent[] = [
  {
    id: "hist-1",
    date: "Today, 10:45 AM",
    type: "problem_solved",
    title: "Calculate Average",
    detail: "Passed all 5 test cases on attempt 1 with optimal arithmetic logic.",
    relatedConcept: "Functions → Math",
  },
  {
    id: "hist-2",
    date: "Today, 10:30 AM",
    type: "misconception_detected",
    title: "Loop boundaries & range() off-by-one",
    detail: "Identified index overrun on test case 4. Probe clarified half-open boundary model.",
    relatedConcept: "Loops → For Loops",
  },
  {
    id: "hist-3",
    date: "Today, 10:15 AM",
    type: "transfer_passed",
    title: "Transfer Problem: Tax Calculation",
    detail: "Successfully generalized return value concepts in newly encountered finance domain.",
    relatedConcept: "Functions → Return Values",
  },
  {
    id: "hist-4",
    date: "Today, 09:50 AM",
    type: "misconception_resolved",
    title: "Return vs Print",
    detail: "Provisional mastery confirmed following delayed re-check and 2 transfer evaluations.",
    relatedConcept: "Functions → Return Values",
  },
  {
    id: "hist-5",
    date: "Yesterday, 04:20 PM",
    type: "misconception_recurring",
    title: "List mutation vs reassignment",
    detail: "Encountered in nested list problem. Marked as recurring to trigger contrast examples.",
    relatedConcept: "Lists → Methods",
  },
];

export const MOCK_PROBLEM_HISTORY: ProblemHistoryRecord[] = [
  {
    id: "ph-1",
    problemId: "problem-12-functions",
    problemTitle: "Calculate Discount",
    concept: "Functions",
    difficulty: "medium",
    result: "correct",
    attempts: 1,
    date: "Today",
    submittedCode: "def calculate_discount(p, d):\n    return p - d",
  },
  {
    id: "ph-2",
    problemId: "problem-16-filter",
    problemTitle: "List Filter",
    concept: "Lists",
    difficulty: "medium",
    result: "diagnosed",
    attempts: 3,
    date: "Today",
    diagnosedMisconception: "List mutation vs reassignment",
    submittedCode: "def filter_evens(nums):\n    res = []\n    for n in nums:\n        if n % 2 == 0:\n            res = res.append(n)\n    return res",
  },
  {
    id: "ph-3",
    problemId: "problem-pattern",
    problemTitle: "Pattern Printer",
    concept: "Loops",
    difficulty: "easy",
    result: "correct",
    attempts: 2,
    date: "Yesterday",
    submittedCode: "for i in range(1, n + 1):\n    print('*' * i)",
  },
  {
    id: "ph-4",
    problemId: "problem-15-average",
    problemTitle: "Average Calculator",
    concept: "Functions",
    difficulty: "easy",
    result: "correct",
    attempts: 1,
    date: "Yesterday",
    submittedCode: "def calculate_average(nums):\n    return sum(nums) / len(nums)",
  },
];

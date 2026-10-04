export type ErrorType = 'syntax' | 'logic' | 'conceptual';

export interface DiagramStep {
  id: string;
  label: string;
  sublabel?: string;
  type: 'call' | 'print' | 'return' | 'var';
  strike?: boolean;
  value?: string;
}

export interface LineDiagnosis {
  line: number;
  startCol: number;
  endCol: number;
  status: 'ok' | 'warning' | 'error';
  annotation: string; // short Error Lens text (max 6 words)
  errorType?: ErrorType;
  headline: string; // ≤ 12 words
  caption?: string; // 1-line caption max
  diagramSteps?: DiagramStep[];
  hints: [string, string, string, { diff: string; fixedCode: string }];
  whyDeep?: {
    misconception: string;
    contrastExample: string;
  };
}

export interface RunResult {
  scenarioId: 'conceptual' | 'logic' | 'syntax' | 'passed';
  name: string;
  code: string;
  tests: { name: string; passed: boolean; expected: string; got: string }[];
  diagnoses: LineDiagnosis[];
  stdout: string;
  stderr?: string;
  returnValue?: string;
}

export interface ConceptItem {
  id: string;
  name: string;
  state: 'active' | 'resolved' | 'recurring' | 'upcoming';
  description: string; // ≤ 25 words
  history: ('pass' | 'fail')[]; // 5 segments
  isCurrent?: boolean;
}

export const INITIAL_CONCEPTS: ConceptItem[] = [
  {
    id: 'return-vs-print',
    name: 'return vs print',
    state: 'active',
    description: 'Functions send values to callers with return. print only displays text on screen.',
    history: ['fail', 'fail', 'fail'],
    isCurrent: true,
  },
  {
    id: 'function-arguments',
    name: 'function arguments',
    state: 'resolved',
    description: 'Passing parameters into function headers and accessing their bound values.',
    history: ['pass', 'pass', 'pass', 'pass', 'pass'],
  },
  {
    id: 'none-handling',
    name: 'None handling',
    state: 'upcoming',
    description: 'Understanding Python default None return when a function ends without a return.',
    history: [],
  },
];

export const MOCK_SCENARIOS: Record<string, RunResult> = {
  conceptual: {
    scenarioId: 'conceptual',
    name: 'Conceptual: return vs print',
    code: `def add(a, b):\n    print(a + b)\n\nresult = add(5, 3)\nprint(result)`,
    tests: [
      { name: 'add(5, 3)', passed: false, expected: '8', got: 'None' },
      { name: 'add(10, -2)', passed: false, expected: '8', got: 'None' },
    ],
    diagnoses: [
      {
        line: 2,
        startCol: 5,
        endCol: 17,
        status: 'error',
        annotation: '← prints 8; returns nothing',
        errorType: 'conceptual',
        headline: 'add() prints 8, but never hands it back.',
        caption: 'print() shows. return gives.',
        diagramSteps: [
          { id: 'call', label: 'add(5, 3)', type: 'call' },
          { id: 'print', label: 'print 8', sublabel: 'screen only', type: 'print' },
          { id: 'ret', label: 'returns None', sublabel: 'no value', type: 'return', strike: true },
          { id: 'var', label: 'result =', value: 'None', sublabel: 'box', type: 'var' },
        ],
        hints: [
          'What does the caller receive when a function only prints?',
          'print() shows text to the user. return gives data back to result.',
          'Replace print on line 2 with return.',
          {
            diff: '-    print(a + b)\n+    return a + b',
            fixedCode: 'def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)',
          },
        ],
        whyDeep: {
          misconception:
            'When you write print(a + b), Python writes characters to stdout. The function itself terminates and hands back None to result.',
          contrastExample:
            '# Contrast Example:\ndef double(n):\n    return n * 2  # caller receives doubled value\n\nx = double(4)      # x becomes 8',
        },
      },
    ],
    stdout: '8\nNone\n',
    returnValue: 'None',
  },

  logic: {
    scenarioId: 'logic',
    name: 'Logic: wrong operator',
    code: `def add(a, b):\n    return a - b\n\nresult = add(5, 3)\nprint(result)`,
    tests: [
      { name: 'add(5, 3)', passed: false, expected: '8', got: '2' },
      { name: 'add(10, -2)', passed: false, expected: '8', got: '12' },
    ],
    diagnoses: [
      {
        line: 2,
        startCol: 12,
        endCol: 17,
        status: 'error',
        errorType: 'logic',
        annotation: '← subtracts instead of adds',
        headline: 'Returned subtraction instead of sum.',
        caption: 'Expression evaluated a - b.',
        diagramSteps: [
          { id: 'call', label: 'add(5, 3)', type: 'call' },
          { id: 'calc', label: '5 - 3 = 2', sublabel: 'subtracted', type: 'print' },
          { id: 'ret', label: 'returns 2', type: 'return', strike: true },
          { id: 'var', label: 'result =', value: '2', sublabel: 'expected 8', type: 'var' },
        ],
        hints: [
          'What arithmetic operation does this problem ask for?',
          'Verify the mathematical operator between a and b on line 2.',
          'Change the minus sign - to a plus sign + on line 2.',
          {
            diff: '-    return a - b\n+    return a + b',
            fixedCode: 'def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)',
          },
        ],
        whyDeep: {
          misconception: 'The expression uses the subtraction operator - rather than the addition operator +.',
          contrastExample: 'return a + b  # produces 5 + 3 = 8',
        },
      },
    ],
    stdout: '2\n',
    returnValue: '2',
  },

  syntax: {
    scenarioId: 'syntax',
    name: 'Syntax: missing colon',
    code: `def add(a, b)\n    return a + b\n\nresult = add(5, 3)\nprint(result)`,
    tests: [
      { name: 'Syntax Check', passed: false, expected: 'valid syntax', got: 'SyntaxError' },
    ],
    diagnoses: [
      {
        line: 1,
        startCol: 14,
        endCol: 15,
        status: 'error',
        errorType: 'syntax',
        annotation: "← missing ':' at header end",
        headline: 'Header line is missing a colon.',
        caption: 'Python requires : before indented blocks.',
        diagramSteps: [
          { id: 'header', label: 'def add(a, b)', type: 'call' },
          { id: 'colon', label: 'expected :', sublabel: 'missing', type: 'return', strike: true },
        ],
        hints: [
          'What punctuation mark introduces an indented code block?',
          'Add a colon : at the end of the function definition line.',
          'Append : right after (a, b) on line 1.',
          {
            diff: '-def add(a, b)\n+def add(a, b):',
            fixedCode: 'def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)',
          },
        ],
        whyDeep: {
          misconception: 'Python compound statements (def, if, for, while) require a colon at the end of the header.',
          contrastExample: 'def add(a, b):  # colon is required',
        },
      },
    ],
    stdout: '',
    stderr: "SyntaxError: expected ':' at line 1",
  },

  passed: {
    scenarioId: 'passed',
    name: 'Passed: return statement used',
    code: `def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)`,
    tests: [
      { name: 'add(5, 3)', passed: true, expected: '8', got: '8' },
      { name: 'add(10, -2)', passed: true, expected: '8', got: '8' },
    ],
    diagnoses: [],
    stdout: '8\n',
    returnValue: '8',
  },
};

import { NextResponse } from 'next/server';

interface TestCase {
  input: any[];
  expected: any;
}

export async function POST(req: Request) {
  try {
    const { code, testCases, language = 'javascript' } = await req.json() as {
      code: string;
      testCases: TestCase[];
      language?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const testCaseText = testCases.map((tc, i) =>
      `Test Case ${i + 1}:\n  Input args: ${JSON.stringify(tc.input)}\n  Expected:   ${JSON.stringify(tc.expected)}`
    ).join('\n\n');

    const prompt = `You are a precise code execution engine for ${language}.

USER CODE:
\`\`\`${language}
${code}
\`\`\`

TEST CASES TO RUN:
${testCaseText}

INSTRUCTIONS:
1. Mentally execute the code for each test case.
2. Call the function with the given input args (spread them as separate arguments).
3. Compare the actual return value to the expected value.
4. For arrays, order matters unless the problem says otherwise.
5. Return ONLY this exact JSON structure, no markdown fences:

{
  "results": [
    {
      "id": 0,
      "status": "passed" | "failed" | "error",
      "input": "<human-readable input>",
      "expected": "<expected output>",
      "actual": "<what the code actually returns>",
      "error": "<error message if status is error, else null>",
      "runtime": "<estimated time complexity, e.g. O(n)>"
    }
  ],
  "summary": {
    "passed": <number>,
    "failed": <number>,
    "total": <number>,
    "verdict": "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error"
  }
}

CRITICAL RULES:
- Be ACCURATE. If the code has a bug and will return wrong answer, mark it as "failed".
- If there is a syntax error, mark ALL as "error" with the exact error message.
- Do NOT assume the code is correct — actually trace through the logic.
- "actual" must reflect what the code ACTUALLY computes, not what it should.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1, // Low temperature for deterministic code evaluation
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Extract JSON robustly (strip markdown fences if present)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI returned invalid response' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('RUN_API_ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

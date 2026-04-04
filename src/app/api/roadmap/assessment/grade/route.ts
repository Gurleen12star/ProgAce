import { NextResponse } from 'next/server';

const GRADER_PROMPT = (topic: string, code: string, language: string) => `
You are **Nexus Expert Grader**, a senior engineer at a top-tier firm (MAANG/HFT). 
Your task is to grade the user's code submission for the topic: **${topic}**.

## User's Code (${language})
\`\`\`${language}
${code}
\`\`\`

## Grading Rubric
1. **Correctness (40%)**: Does the logic solve the core problem of ${topic}?
2. **Efficiency (30%)**: Are Time and Space complexities optimal for this specific topic?
3. **Code Quality (20%)**: Clean naming, structure, and edge case handling.
4. **Industry Standards (10%)**: Does it follow professional patterns?

## Instructions
- Perform a mental execution of the code.
- Be strict but fair.
- Return your response in the following JSON format ONLY:
{
  "score": number (0-100),
  "feedback": "string (brief, professional critique)",
  "complexities": "string (e.g. O(N) time, O(1) space)",
  "verdict": "Accepted" | "Needs Improvement" | "Rejected"
}
`;

async function callGroq(apiKey: string, prompt: string): Promise<any> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) throw new Error('Groq API error');
  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

export async function POST(req: Request) {
  try {
    const { topic, code, language = 'javascript' } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
       return NextResponse.json({ 
          score: 85, 
          feedback: "AI Grading is in demo mode (API key missing). Your logic appears sound for " + topic + ".",
          complexities: "N/A",
          verdict: "Accepted"
       });
    }

    const result = await callGroq(groqKey, GRADER_PROMPT(topic, code, language));
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Grading Error:', error);
    return NextResponse.json({ error: 'Grading failed: ' + error.message }, { status: 500 });
  }
}

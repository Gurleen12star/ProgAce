import { NextResponse } from 'next/server';
import { MOCK_INTERVIEWS } from '@/data/mock_interviews';

export async function POST(req: Request) {
  try {
    const { messages = [], currentCode, language, simulationData } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').replace(/[\n\r]/g, '').trim();

    const { step, role, company, domain, mode } = simulationData || {};
    const roleKey = role || "Software Engineer";
    const currentStep = (step || 'intro').toLowerCase();

    // ── Pre-generate Fallback Response (Mock Data Safety Net) ────────────
    let fallbackQuestion = { text: "Let's explore the complexities of that approach." };
    if (MOCK_INTERVIEWS[roleKey]) {
      const roleData = MOCK_INTERVIEWS[roleKey];
      const fallbackRound = roleData[currentStep as keyof typeof roleData] || roleData.intro;
      const assistantMsgs = messages.filter((m: any) => m.role === 'assistant').length;
      const nextIdx = Math.min(assistantMsgs, fallbackRound?.questions?.length ? fallbackRound.questions.length - 1 : 0);
      fallbackQuestion = fallbackRound?.questions?.[nextIdx] || fallbackQuestion;
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing - Using Local Mock Engine");
      return NextResponse.json({ content: fallbackQuestion.text, isMock: true });
    }

    // ── Interactive AI Generation (Gemini 1.5 Flash) ────────────────────
    const systemPrompt = `You are "Nexus Auditor", an elite Technical Interviewer for ${roleKey} at ${company || 'a top-tier firm'}.
CURRENT PHASE: ${currentStep.toUpperCase()}
DOMAIN: ${domain || 'SDE'}
MODE: ${mode || 'both'}
EDITOR CODE: 
${currentCode || '(No code written yet)'}

### INTERVIEW PROTOCOL:
1. **STAY IN CHARACTER**: You are professional, exacting, but encouraging. 
2. **PHASE AWARENESS**:
   - **INTRO**: Focus on behavioral background and "Tell me about yourself".
   - **TECHNICAL**: Focus on the code in the editor. Ask them to optimize, explain time complexity, or handle edge cases.
   - **HR**: Focus on cultural fit, conflict resolution, and career goals.
3. **Socratic Guidance**: If this is a coding session, NEVER give the solution. Ask "What happens if the input is null?" or "Can we do this in O(n)?"
4. **Code Quality**: If they write code, review the \`EDITOR CODE\` block provided above. Transition naturally between their speech and their code.
5. **Conciseness**: Keep responses to 2-3 short, impactful paragraphs.
6. **Report Trigger**: If the interview feels concluded, output <nexus_report>{"Communication":8,"Technical":7,"Coding":7,"Confidence":8,"Problem Solving":7,"Behavioral":8}</nexus_report>.
7. **Boilerplate**: If starting a coding challenge, output <nexus_boilerplate>// logic</nexus_boilerplate>.

Transition naturally from the user's input.`;

    // ── Resilient AI Generation (Multi-Model Fallback) ─────────────────
    const modelsToTry = [
      'gemini-3.1-flash',
      'gemini-3-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite'
    ];

    let lastErrorMsg = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.length > 0 
              ? messages.map((m: any, i: number) => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: i === 0 ? `${systemPrompt}\n\nUser Input: ${m.content}` : m.content }]
                }))
              : [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nHello! Let's start the interview.` }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiContent) {
            return NextResponse.json({ content: aiContent, isMock: false, model: modelName });
          }
        }

        const errorBody = await response.json().catch(() => ({}));
        lastErrorMsg = errorBody.error?.message || response.statusText;
        console.warn(`Model ${modelName} failed or unavailable: ${lastErrorMsg}`);
        
        // If it's a 429 or 503, definitely try the next model
        if ([429, 503, 500].includes(response.status)) continue;
        
        // For other errors, we might want to stop, but for now we try all
        continue;

      } catch (err: any) {
        lastErrorMsg = err.message;
        console.warn(`Fetch error for ${modelName}:`, lastErrorMsg);
        continue;
      }
    }

    return NextResponse.json({ 
      error: 'ALL_MODELS_BUSY', 
      content: `SYSTEM OVERLOAD: ${lastErrorMsg}. All AI nodes are currently at capacity. Please wait 30 seconds and try again.` 
    }, { status: 503 });

  } catch (error: any) {
    console.error('CRITICAL_INTERVIEW_ERROR:', error);
    return NextResponse.json({ error: 'System Failure', content: "I'm having a connection issue. Let's try that again in a moment." }, { status: 500 });
  }
}

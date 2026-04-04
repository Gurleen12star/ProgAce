import { NextResponse } from 'next/server';
import { MOCK_INTERVIEWS } from '@/data/mock_interviews';

export async function POST(req: Request) {
  try {
    const { messages = [], currentCode, language, simulationData } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').replace(/[\n\r]/g, '').trim();

    const { step, role, company, domain, mode } = simulationData || {};
    const roleKey = role || "Software Engineer";
    const currentStep = (step || 'intro').toLowerCase();

    // ── Pre-generate Fallback Response (Mock Data Safety Net) ────────────
    const roleData = MOCK_INTERVIEWS[roleKey] || MOCK_INTERVIEWS["Software Engineer"];
    const fallbackRound = roleData[currentStep as keyof typeof roleData] || roleData.intro;
    // Estimate current index based on message history (Assistant messages)
    const assistantMsgs = messages.filter((m: any) => m.role === 'assistant').length;
    const nextIdx = Math.min(assistantMsgs, fallbackRound.questions.length - 1);
    const fallbackQuestion = fallbackRound.questions[nextIdx];

    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing - Using Local Mock Engine");
      return NextResponse.json({ content: fallbackQuestion.text, isMock: true });
    }

    // ── Interactive AI Generation (Gemini 1.5 Flash) ────────────────────
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are Nexus, an elite Technical Interviewer for ${roleKey} at ${company || 'a top-tier firm'}.
CURRENT PHASE: ${currentStep.toUpperCase()}
DOMAIN: ${domain || 'SDE'}
MODE: ${mode || 'both'}
EDITOR CODE: ${currentCode || '(None)'}

### INTERVIEW PROTOCOL:
1. Stay in character as a professional but challenging FAANG-level interviewer.
2. If this is the CODING round, guide the user through a problem but do NOT provide the solution.
3. If they give a short or weak answer like "ok" or "good", press them for technical depth or transition logically.
4. Keep responses concise and focused on the current round.
5. If the interview is complete, output <nexus_report>{"Communication":8,"Technical":7,"Coding":7,"Confidence":8,"Problem Solving":7,"Behavioral":8}</nexus_report>.
6. If starting a new coding challenge, output <nexus_boilerplate>// code logic</nexus_boilerplate>.

Transition naturally from the user's input. Current Question Guidance: "${fallbackQuestion.text}"`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }))
          ]
        })
      });

      if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackQuestion.text;

      return NextResponse.json({ content: aiContent, isMock: false });

    } catch (geminiErr: any) {
      console.warn("Gemini Engine Failed - Resiliency Fallback Triggered:", geminiErr.message);
      // Seamlessly return the scripted question if AI fails
      return NextResponse.json({ content: fallbackQuestion.text, isMock: true });
    }

  } catch (error: any) {
    console.error('CRITICAL_INTERVIEW_ERROR:', error);
    return NextResponse.json({ error: 'System Failure', content: "I'm having a connection issue. Let's continue with our previous topic." }, { status: 500 });
  }
}

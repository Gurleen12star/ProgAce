import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    if (!rawBody) return NextResponse.json({ error: 'Signal Empty' }, { status: 400 });

    const body = JSON.parse(rawBody);
    const { currentRoadmap, messages } = body;
    
    const lastUserMsg = messages?.[messages.length - 1]?.content || '';
    const contextMap = (currentRoadmap?.curriculum || []).map((c: any) => ({
      id: c.id, title: c.title, week_num: c.week_num
    }));

    const systemPromptMessage = `You are "Nexus Platinum Architect". SURGICAL RE-ARCHITECTURE TASK.
    User Request: "${lastUserMsg}"
    Structure Map: ${JSON.stringify(contextMap)}
    Return ONLY a JSON object with: { "message": "...", "modifiedWeeks": [...] }
    No filler. No backticks. Direct JSON only.`;

    // 🗝️ FORENSIC KEY SANITIZATION (v29.0)
    const googleKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').replace(/[\n\r]/g, '').trim();
    const anthropicKey = (process.env.ANTHROPIC_API_KEY || '').replace(/[^a-zA-Z0-9_-]/g, '').trim(); 

    // 🚀 STEP 1: ATTEMPT GOOGLE GEMINI 1.5 FLASH (Zero-Cost Architect v26.0)
    if (googleKey && googleKey.length > 10) {
        console.log('[ARCHITECT] Rapid Sync: Using Google Gemini 1.5 Flash (Free Tier)...');
        try {
            const genAI = new GoogleGenerativeAI(googleKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(systemPromptMessage);
            const content = result.response.text();

            if (content) {
                const delta = JSON.parse(content);
                return handleSuccessfulRefinement(delta, currentRoadmap, "Google Gemini 1.5 Flash");
            }
        } catch (e: any) {
            console.warn('[ARCHITECT] Gemini Fail-forwarding to Anthropic...', e.message);
        }
    }

    // 🕵️ STEP 2: FALLBACK TO ANTHROPIC SELF-HEALING PROBE
    if (anthropicKey && anthropicKey.length > 10) {
        const models = [
            'claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-20240620',
            'claude-3-haiku-20240307', 'claude-3-sonnet-20240229',
            'claude-2.1', 'claude-instant-1.2'
        ];

        for (const modelId of models) {
            console.log(`[ARCHITECT-PROBE] Testing model: ${modelId}...`);
            try {
                const probeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'x-api-key': anthropicKey, 
                        'anthropic-version': '2023-06-01',
                        'anthropic-beta': 'messages-2023-12-15'
                    },
                    body: JSON.stringify({
                        model: modelId,
                        max_tokens: 4000,
                        system: 'You are a professional JSON-only career architect.',
                        messages: [{ role: 'user', content: systemPromptMessage }]
                    })
                });

                if (probeResponse.ok) {
                    const aiData = await probeResponse.json();
                    const content = aiData.content?.[0]?.text || '';
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const delta = JSON.parse(jsonMatch[0]);
                        return handleSuccessfulRefinement(delta, currentRoadmap, modelId);
                    }
                }
            } catch (e: any) {
                console.warn(`[ARCHITECT-FAIL] ${modelId} | ${e.message}`);
            }
        }
    }

    return NextResponse.json({ 
        error: `Zero-Cost Architect Failed: No working AI provider found.`,
        details: "Anthropic credits ($5) are likely still in propagation lag. Please ensure GOOGLE_GENERATIVE_AI_API_KEY is correct."
    }, { status: 502 });

  } catch (error: any) {
    return NextResponse.json({ error: `Architect Error: ${error.message}` }, { status: 500 });
  }
}

// 📦 SHARED REFINEMENT HANDLER
function handleSuccessfulRefinement(delta: any, currentRoadmap: any, winningModel: string) {
    const modifiedWeeks = delta.modifiedWeeks || [];
    const assistantMsg = delta.message || `Architecture stabilized via ${winningModel}.`;

    let finalCurriculum = JSON.parse(JSON.stringify(currentRoadmap?.curriculum || []));
    modifiedWeeks.forEach((newWeek: any) => {
       const idx = finalCurriculum.findIndex((w: any) => w.id === newWeek.id);
       if (idx !== -1) finalCurriculum[idx] = { ...finalCurriculum[idx], ...newWeek };
       else finalCurriculum.push({ ...newWeek, id: newWeek.id || `mod-${Math.random().toString(36).substring(7)}` });
    });

    finalCurriculum.sort((a: any, b: any) => (a.week_num || 0) - (b.week_num || 0));

    return NextResponse.json({
      message: assistantMsg,
      updatedRoadmap: { ...currentRoadmap, curriculum: finalCurriculum },
      architectModel: winningModel
    });
}

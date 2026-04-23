import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model = 'gemma-2-27b-it' } = await req.json();
    const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '').replace(/[\n\r]/g, '').trim();

    if (!apiKey) {
      return NextResponse.json({ error: 'Google AI API Key Missing' }, { status: 500 });
    }

    // Google AI Studio REST API for Gemma 2
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages && messages.length > 0 
          ? messages.map((m: any) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          : [{ role: 'user', parts: [{ text: 'Hello' }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemma API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ 
      content, 
      model,
      provider: 'gemma' 
    });

  } catch (error: any) {
    console.error('GEMMA_ROUTE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

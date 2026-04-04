import { NextResponse } from 'next/server';

const SYSTEM_PROMPT_TEMPLATE = (problemContext: string, currentCode: string, currentLanguage: string) => `You are **Nexus AI**, a world-class DSA tutor. Your mission is to guide the user through Socratic questioning — never give the full answer directly.

## Problem Context
${problemContext}

## Code Currently in Editor (${currentLanguage})
\`\`\`${currentLanguage}
${currentCode || '// (no code written yet)'}
\`\`\`

## Your Rules
1. **Never reveal the full solution** unless the user explicitly says "just give me the solution".
2. **When giving hints**: give ONE logical step at a time.
3. **When debugging**: identify the exact line or concept that's wrong and explain *why*.
4. **When explaining**: use analogies, plain English, and always mention Time & Space complexity.
5. **Be encouraging and energetic** — you're a coach, not just a bot.
6. Always respond in clean **Markdown**.`;

async function callClaude(apiKey: string, systemPrompt: string, messages: any[]): Promise<string> {
  // Try models in order of preference
  const models = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-haiku-20240307'];
  let lastError = null;

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return data.content?.[0]?.text || '';
      }

      if (response.status === 404) {
        console.warn(`Model ${model} not found on this key, trying next...`);
        continue; // Try next model
      }

      const err = await response.json().catch(() => ({}));
      throw new Error(`Claude ${response.status}: ${err.error?.message || response.statusText}`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`Claude ${model} timed out, trying next...`);
        continue;
      }
      lastError = err;
      console.warn(`Claude ${model} failed: ${err.message}`);
    }
  }

  throw lastError || new Error('All Claude models failed or 404d');
}

async function callGroq(apiKey: string, systemPrompt: string, messages: any[]): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Groq ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: Request) {
  try {
    const { messages, problemContext, currentCode, currentLanguage = 'javascript' } = await req.json();
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE(problemContext, currentCode, currentLanguage);

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const groqKey      = process.env.GROQ_API_KEY;

    // Try Claude (Multi-model fallback)
    if (anthropicKey && !anthropicKey.includes('your_')) {
      try {
        const content = await callClaude(anthropicKey, systemPrompt, messages);
        if (content) return NextResponse.json({ content, provider: 'claude' });
      } catch (err: any) {
        console.warn('Claude provider failed completely:', err.message);
      }
    }

    // Try Groq as reliable fallback
    if (groqKey) {
      try {
        const content = await callGroq(groqKey, systemPrompt, messages);
        if (content) return NextResponse.json({ content, provider: 'groq' });
      } catch (err: any) {
        console.error('Groq fallback failed:', err.message);
      }
    }

    return NextResponse.json({ error: 'All AI providers failed.' }, { status: 500 });

  } catch (error: any) {
    console.error('AI Route Error:', error);
    return NextResponse.json({ error: 'Request failed: ' + error.message }, { status: 500 });
  }
}

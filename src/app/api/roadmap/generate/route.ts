import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from "../../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { prefs, diagnosticScore } = await req.json();
    // ── Nexus v2: Intelligent Gemini 1.5 Flash Implementation (v29.0) ──
    const geminiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').replace(/[\n\r]/g, '').trim();

    if (!geminiKey) {
      return NextResponse.json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY Missing' }, { status: 500 });
    }

    const systemPrompt = `You are "ProgAce Architect v2", an elite AI Career Strategist. 
Generate an EXPERT-LEVEL, Adaptive Learning Roadmap. This must be as high-quality as a manually curated industry roadmap.

USER PROFILE:
- Role: ${prefs.role}
- Specific Focus: ${prefs.focus}
- Target Company: ${prefs.targetCompany}
- Timeline: ${prefs.timeline}
- level: ${prefs.level} (Diagnostic Score: ${diagnosticScore}/5)
- Pace: ${prefs.pace}
- Learning Style: ${prefs.learningType}

SCALING ENGINE RULES (CRITICAL):
- If Timeline is "1 Month": Generate exactly 4 high-intensity weeks.
- If Timeline is "3 Months": Generate exactly 12 structured weeks.
- If Timeline is "6 Months": Generate 24 weeks, including periodic "Spaced Revision" & "Project Deep-Dive" weeks.
- If Timeline is "1 Year": Generate 48-52 weeks with "Advanced Research" & "Open Source" specializations.

CURRICULUM ARCHITECTURE:
1. PHASE 1 (Foundations): Focus on ${prefs.role} core and language internals.
2. PHASE 2 (Mastery): Deep-dive into ${prefs.focus} and complex DSA.
3. PHASE 3 (Elite): High-level architecture, System Design, and ${prefs.targetCompany}-specific patterns.

TASK GUIDELINES:
- Every task MUST be actionable and professional.
- Use the user's Pace (${prefs.pace}) to calibrate task load.
- If Learning Style is "Hands-On", prioritize specific project-based tasks.
- Ensure "Expert" tone. 

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "roadmap_meta": { 
     "title": "Elite ${prefs.role} Personalization Suite: ${prefs.targetCompany} Edition",
     "total_weeks": number, 
     "estimated_completion": "string" 
  },
  "phases": [
    {
      "title": "Phase 1: ...",
      "weeks": [
        {
          "week_num": number,
          "focus_topic": "string",
          "days": [
            {
              "day_num": number,
              "tasks": [ { "id", "title", "type": "video"|"practice"|"revision", "duration", "description": "string" } ],
              "is_high_priority": boolean
            }
          ]
        }
      ]
    }
  ],
  "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
  "nodes": [], "edges": []
}

Ensure the output is 100% valid JSON.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!geminiRes.ok) {
       const errText = await geminiRes.text();
       throw new Error(`Gemini Generation Failed: ${errText}`);
    }

    const geminiData = await geminiRes.json();
    const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const roadmapData = JSON.parse(content);

    // 2. PERSISTENCE (Nexus v2 Optimized)
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { error } = await supabase
          .from('user_roadmaps')
          .upsert({
            user_id: session.user.id,
            roadmap_data: roadmapData,
            metadata: {
              ...prefs,
              diagnosticScore,
              engine_version: '2.0.0'
            },
            updated_at: new Date().toISOString()
          });
        
        if (error) console.error('Nexus Save Error:', error.message);
      }
    } catch (dbErr) {
      console.warn('Persistence bypassed.');
    }

    return NextResponse.json(roadmapData);

  } catch (error: any) {
    console.error('LEECOAI_GEN_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

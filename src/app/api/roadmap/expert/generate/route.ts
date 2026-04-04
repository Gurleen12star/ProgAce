import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { company, role, timeline, level } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY Missing' }, { status: 500 });
    }

    // 📐 Universal Scaling Intelligence (Strict Protocol v14.0)
    const t = (timeline || '').toLowerCase();
    let moduleCount = 12; // default
    if (t.includes('1 month')) moduleCount = 6;
    else if (t.includes('3 month')) moduleCount = 12;
    else if (t.includes('6 month')) moduleCount = 18;
    else if (t.includes('1 year')) moduleCount = 24;

    const systemPrompt = `You are "Nexus Platinum Architect", the world's most precise technical career strategist. 
    
    CRITICAL OBJECTIVE: 
    Generate a 100% ACCURATE, industry-vetted roadmap for a ${role} position at ${company}.
    You MUST strictly adhere to the following structure:
    - TOTAL MODULES: ${moduleCount} (THIS IS MANDATORY).
    - LAYOUT: Use a "Phase-based" approach.
    - TOPIC: 100% focused on ${role} at ${company}. If Front-end, focus on UI/UX, React/Next, Performance. If Cloud, focus on AWS/Azure, Kubernetes, Terraform.
    
    CORE PLACEMENT PROTOCOL:
    - MODULES 1-${Math.ceil(moduleCount/4)}: Must cover High-Intensity CS CORE (DSA, OS, DBMS, CN, OOPS) adjusted to the seniority of ${role}.
    - INTERLEAVE: ${company}'s actual interview patterns and infrastructure requirements.
    
    HIERARCHY: Modules -> Weeks -> 5 Days -> Daily Missions.
    
    STRICT DAILY QUOTAS:
    - Each day MUST have:
      1. 'elite_lecture' (Video Type) - high-quality specific YouTube link.
      2. 'daily_quiz' (Quiz Type) - 5 specific technical questions for ${role}.
      3. 'domain_mission' (Code/Colab/Practice Type) - specific hands-on task relevant to ${role}.
    
    OUTPUT SCHEMA (STRICT JSON ONLY):
    {
      "id": "platinum-${company.toLowerCase()}-${role.toLowerCase()}-${moduleCount}",
      "title": "Elite ${role} Journey: ${company} Strategy",
      "company": "${company}",
      "description": "${moduleCount}-Module precision-curated career path for ${role} aspirants at ${company}.",
      "moduleCount": ${moduleCount},
      "modules": [
        {
          "id": "module-1",
          "title": "Module Title",
          "weeks": [
            {
               "id": "week-1",
               "title": "Topic",
               "days": [
                  {
                    "day_num": number,
                    "missions": [
                       { "id": "t1", "title": "Lecture", "type": "video", "url": "link" },
                       { "id": "t2", "title": "Task", "type": "quiz" | "code" | "practice" | "colab", "questions": ["q1", "q2", "q3", "q4", "q5"] }
                    ]
                  }
               ]
            }
          ]
        }
      ]
    }
    
    Zero preamble. Direct JSON response only. No backticks.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        messages: [{ role: 'user', content: systemPrompt }]
      })
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       return NextResponse.json({ error: 'Claude Enrichment Failed: Invalid Output' }, { status: 500 });
    }

    const roadmap = JSON.parse(jsonMatch[0]);
    const sanitizedModules = (roadmap.modules || []).map((mod: any, mIdx: number) => ({
      ...mod,
      id: mod.id || `module-${mIdx + 1}`,
      weeks: (mod.weeks || []).map((week: any, wIdx: number) => ({
        ...week,
        id: week.id || `week-${(mIdx * 4) + wIdx + 1}`,
        week_num: (mIdx * 4) + wIdx + 1,
        days: Array.from({ length: 5 }, (_, dIdx) => {
           const dayNum = dIdx + 1;
           const existingDay = (week.days || []).find((d: any) => (d.day_num || d.dayNum) === dayNum);
           return {
              day_num: dayNum,
              missions: existingDay?.missions || existingDay?.tasks || []
           };
        })
      }))
    }));

    const curriculum = sanitizedModules.flatMap((mod: any) => 
      mod.weeks.map((week: any) => ({
        ...week,
        assessment: week.assessment || { id: `gateway-${week.id}`, title: `Weekly Mastery: ${week.title}`, type: 'quiz' }
      }))
    );

    return NextResponse.json({
      ...roadmap,
      modules: sanitizedModules,
      curriculum
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

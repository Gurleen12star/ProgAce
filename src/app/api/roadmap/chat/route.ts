import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const STAGES = ['role', 'companyType', 'targetCompany', 'aceGoal', 'focus', 'timeline', 'level', 'pace', 'learningType', 'assessment', 'generate'] as const;
type Stage = typeof STAGES[number];

const NEXT_STAGE: Record<Stage, Stage> = {
  role:          'companyType',
  companyType:   'targetCompany',
  targetCompany: 'aceGoal',
  aceGoal:       'focus',
  focus:         'timeline',
  timeline:      'level',
  level:         'pace',
  pace:          'learningType',
  learningType:  'assessment',
  assessment:    'generate',
  generate:      'generate',
};

const ROLE_FOCUS_MAP: Record<string, string[]> = {
  'Software Development Engineer (SDE)': ['Data Structures & Algorithms', 'System Design', 'Backend Development', 'Low-Level Design', 'Other'],
  'Software Engineer (SWE)':           ['Software Architecture', 'Clean Code & Patterns', 'Platform Engineering', 'Test Driven Development', 'Other'],
  'Frontend Engineer':                ['React & Next.js', 'CSS & UI/UX', 'TypeScript', 'Performance Optimization', 'Other'],
  'Backend Engineer':                 ['Node.js & Express', 'Database Systems', 'Microservices', 'Cloud & AWS', 'Other'],
  'Fullstack Engineer':               ['MERN Stack', 'Database Design', 'API Architecture', 'DevOps & CI/CD', 'Other'],
  'Cloud Engineer':                   ['AWS/Azure/GCP', 'Cloud Native Patterns', 'Serverless', 'Networking & Security', 'Other'],
  'DevOps Engineer':                  ['Docker & Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code', 'Observability', 'Other'],
  'ML Engineer':                      ['Deep Learning', 'NLP & LLMs', 'MLOps & Deployment', 'Computer Vision', 'Other'],
  'AI Engineer':                      ['Generative AI', 'Agentic Workflows', 'Model Fine-tuning', 'Vector Databases', 'Other'],
  'Data Engineer':                    ['SQL & Analytics', 'Python for Data', 'Big Data (Spark)', 'Statistical Modeling', 'Other'],
  'Other':                            ['General Computer Science', 'Software Management', 'Technical Lead', 'Custom Path'],
};

const COMPANY_TYPE_OPTIONS = ['MAANG (Google, Meta, etc.)', 'HFT (Jane Street, Tower, etc.)', 'Fintech (Citi, Goldman, etc.)', 'Product-Based (Microsoft, Uber, etc.)', 'Big4 (Deloitte, EY, etc.)', 'Service-Based (TCS, Infosys, etc.)', 'Startup', 'Other'];

const SMART_SUGGESTIONS: Record<string, string[]> = {
  'MAANG':        ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft'],
  'HFT':          ['Jane Street', 'Citadel', 'HRT', 'Jump Trading', 'Hudson River', 'Tower Research'],
  'Fintech':      ['HSBC', 'Goldman Sachs', 'JPMorgan', 'Citi', 'Morgan Stanley', 'Stripe', 'PayPal'],
  'Product-Based':['Uber', 'Airbnb', 'Lyft', 'Slack', 'Salesforce', 'Adobe', 'Oracle', 'Spotify'],
  'Big4':         ['Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'McKinsey'],
  'Service-Based':['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Capgemini'],
};

// ─── Smart local extraction (no AI needed for fallback) ───────────────────────
function extractFromMessage(text: string, stage: Stage, prefs: Record<string, string>): Record<string, string> {
  const t = text.toLowerCase();
  const extracted: Record<string, string> = {};

  if (stage === 'role') {
    const roles: string[] = [];
    
    // 🚦 Exact Acronym / Phrase Priority
    if (t === 'sde' || t.includes('sde') || t.includes('software development')) {
      roles.push('Software Development Engineer (SDE)');
    } else if (t === 'swe' || (t.includes('swe') || (t.includes('software engineer') && !t.includes('development')))) {
      roles.push('Software Engineer (SWE)');
    }

    if (t.includes('front')) roles.push('Frontend Engineer');
    if (t.includes('back')) roles.push('Backend Engineer');
    if (t.includes('full')) roles.push('Fullstack Engineer');
    if (t.includes('ml') || t.includes('machine')) roles.push('ML Engineer');
    if (t.includes('ai') || t.includes('artificial')) roles.push('AI Engineer');
    if (t.includes('cloud')) roles.push('Cloud Engineer');
    if (t.includes('devops')) roles.push('DevOps Engineer');
    if (t.includes('data')) roles.push('Data Engineer');
    
    // Fallback search in map keys (lower priority)
    if (roles.length === 0) {
      for (const role of Object.keys(ROLE_FOCUS_MAP)) {
        if (t.includes(role.toLowerCase().split(' ')[0])) roles.push(role);
      }
    }
    
    if (roles.length > 0) extracted.role = roles[0]; 
    else extracted.role = text.trim();
  }

  if (stage === 'companyType') {
    const types: string[] = [];
    for (const opt of COMPANY_TYPE_OPTIONS) {
      if (t.includes(opt.toLowerCase().split(' ')[0])) types.push(opt);
    }
    if (types.length > 0) extracted.companyType = types.join(', ');
    else extracted.companyType = text.trim();
  }

  if (stage === 'targetCompany') {
    extracted.targetCompany = text.trim();
  }

  if (stage === 'focus') {
    const opts = ROLE_FOCUS_MAP[prefs.role] || [];
    for (const opt of opts) {
      if (t.includes(opt.toLowerCase().split(' ')[0])) { extracted.focus = opt; break; }
    }
    if (!extracted.focus || t === 'other') extracted.focus = text.trim();
  }

  if (stage === 'timeline') {
    if (t.includes('1 month') || t.includes('one month')) extracted.timeline = '1 Month';
    else if (t.includes('3') || t.includes('three')) extracted.timeline = '3 Months';
    else if (t.includes('6') || t.includes('six')) extracted.timeline = '6 Months';
    else if (t.includes('1 year') || t.includes('twelve')) extracted.timeline = '1 Year';
    else extracted.timeline = text.trim();
  }

  if (stage === 'level') {
    if (t.includes('begin') || t.includes('start') || t.includes('new')) extracted.level = 'Beginner';
    else if (t.includes('inter') || t.includes('some')) extracted.level = 'Intermediate';
    else if (t.includes('advan') || t.includes('expert') || t.includes('speciali')) extracted.level = 'Advanced';
    else extracted.level = text.trim();
  }

  if (stage === 'pace') {
    if (t.includes('relax') || t.includes('1') || t.includes('2h')) extracted.pace = 'Relaxed (1-2h/day)';
    else if (t.includes('standard') || t.includes('3') || t.includes('4h')) extracted.pace = 'Standard (3-4h/day)';
    else if (t.includes('aggressiv') || t.includes('5') || t.includes('6')) extracted.pace = 'Aggressive (5+h/day)';
    else extracted.pace = text.trim();
  }

  if (stage === 'learningType') {
    if (t.includes('theory') || t.includes('concept') || t.includes('reading')) extracted.learningType = 'Theory-First';
    else if (t.includes('hand') || t.includes('project') || t.includes('practic')) extracted.learningType = 'Hands-On';
    else extracted.learningType = 'Balanced Mix';
  }

  if (stage === 'aceGoal') {
    extracted.aceGoal = text.trim();
  }

  return extracted;
}

// ─── Questions + options per stage ───────────────────────────────────────────
function getStageQuestion(stage: Stage, prefs: Record<string, string>): { message: string; options: { text: string }[] } {
  const role = prefs.role || 'your field';
  const companyType = prefs.companyType || 'top-tier companies';
  const focusOpts = (ROLE_FOCUS_MAP[prefs.role] || ['Core Concepts', 'Problem Solving', 'Projects', 'Interview Prep'])
    .map(t => ({ text: t }));

  const map: Record<Stage, { message: string; options: { text: string }[] }> = {
    role: {
      message: "Welcome! 🚀 What target role are you preparing for?",
      options: [...Object.keys(ROLE_FOCUS_MAP).filter(r => r !== 'Other').map(r => ({ text: r })), { text: 'Other' }],
    },
    companyType: {
      message: "Got it! 🚀 Which type of company are you aiming for? This helps me suggest either an AI-curated or a company-specific expert roadmap.",
      options: COMPANY_TYPE_OPTIONS.map(opt => ({ text: opt })),
    },
    targetCompany: {
      message: `Excellent choice! 🎯 Which specific company are you targeting within **${companyType}**? (e.g., Microsoft, Google, Amazon, Jane Street)`,
      options: [...(SMART_SUGGESTIONS[companyType.split(' (')[0]] || []).map(s => ({ text: s })), { text: 'Other' }],
    },
    aceGoal: {
      message: "What is your primary objective? 📈 What do you want to ace right now?",
      options: [
        { text: 'Placements (On-campus)' },
        { text: 'Interviews (Off-campus)' },
        { text: 'Foundations (Fundamentals)' },
        { text: 'Competitive Programming (CP)' },
        { text: 'Career Switch' }
      ],
    },
    focus: {
      message: role === 'Other' 
        ? "Interesting! 🎯 What specific area do you want to master?"
        : `Great choice! 🎯 Which specific area within **${role}** do you want to focus on?`,
      options: focusOpts,
    },
    timeline: {
      message: `Got it! 📅 How long do you have to prepare?`,
      options: [{ text: '1 Month' }, { text: '3 Months' }, { text: '6 Months' }, { text: '1 Year' }],
    },
    level: {
      message: `What's your current skill level for ${role}? Be honest — this calibrates your roadmap! 💡`,
      options: [{ text: 'Beginner (just starting)' }, { text: 'Intermediate (some experience)' }, { text: 'Advanced (ready to specialize)' }],
    },
    pace: {
      message: `How many hours per day can you commit? ⚡`,
      options: [{ text: 'Relaxed (1-2h/day)' }, { text: 'Standard (3-4h/day)' }, { text: 'Aggressive (5+h/day)' }],
    },
    learningType: {
      message: `Last one! 🧠 How do you prefer to learn?`,
      options: [{ text: 'Theory-First (concepts & reading)' }, { text: 'Hands-On (projects & coding)' }, { text: 'Balanced Mix' }],
    },
    assessment: {
      message: `Almost there! 💎 A quick 5-question diagnostic quiz will personalize your roadmap difficulty. Ready?`,
      options: [{ text: 'Take the Quiz' }, { text: 'Skip Diagnostic' }],
    },
    generate: {
      message: `Your profile is complete! ✨ Generating your personalized roadmap options now...`,
      options: [],
    },
  };

  return map[stage];
}

export async function POST(req: Request) {
  let messages: any[] = [];
  let currentStep: Stage = 'role';
  let prefs: Record<string, string> = {};

  try {
    const body = await req.json();
    messages = body.messages || [];
    currentStep = (body.currentStep as Stage) || 'role';
    prefs = body.prefs || {};

    // ── Extract preference from last user message immediately ─────────────
    const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const localExtracted = extractFromMessage(lastUserMsg, currentStep, prefs);
    const mergedPrefs = { ...prefs, ...localExtracted };

    // ── Handle assessment stage locally (no AI needed) ────────────────────
    if (currentStep === 'assessment') {
      const t = lastUserMsg.toLowerCase();
      if (t.includes('take') || t.includes('quiz') || t.includes('yes') || t.includes('ready')) {
        return NextResponse.json({
          message: "Launching Diagnostic Suite! 🚀 Redirecting you now...",
          action: 'redirect_to_quiz',
          nextStep: 'assessment',
          extractedPrefs: mergedPrefs,
          options: [],
        });
      }
      if (t.includes('skip')) {
        return NextResponse.json({
          message: "No worries! Generating your roadmap options... ✨",
          nextStep: 'generate',
          extractedPrefs: { ...mergedPrefs, baselineScore: '3' },
          options: [],
        });
      }
      // First time seeing assessment question
      const q = getStageQuestion('assessment', mergedPrefs);
      return NextResponse.json({ ...q, nextStep: 'assessment', extractedPrefs: mergedPrefs });
    }

    // ── Catch "Other" keyword for Role or Focus (NEW: Stay in step to catch text) ───
    if ((currentStep === 'role' || currentStep === 'focus' || currentStep === 'companyType') && lastUserMsg.toLowerCase().includes('other')) {
      const msg = currentStep === 'role' 
        ? "No problem! 🚀 What target role are you preparing for? (e.g. Technical Writing, HR, Product Management)"
        : currentStep === 'companyType'
        ? "No problem! 🚀 What type of company are you aiming for? (e.g. Academic Research, FinTech, Agency)"
        : "I see you have a unique goal! 🚀 What specific subject or area would you like to master?";
      
      return NextResponse.json({
        message: msg,
        nextStep: currentStep, // STAY IN STEP to wait for text input
        extractedPrefs: mergedPrefs,
        options: [], // Clear options to force typing
      });
    }

    // ── Try Gemini 1.5 Flash for a richer AI message (v29.0 Integration) ───
    const geminiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').replace(/[\n\r]/g, '').trim();
    if (geminiKey) {
      try {
        const nextStage = NEXT_STAGE[currentStep];
        const nextQ = getStageQuestion(nextStage, mergedPrefs);

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        
        const systemPrompt = `You are ProgAce Career Strategist. The user just answered "${currentStep}" with: "${lastUserMsg}". Extracted: ${JSON.stringify(localExtracted)}. Acknowledge enthusiastically (1 sentence) and provide high-level industry context for their choice. Then, naturally transition into this specific next question: "${nextQ.message}". Return ONLY JSON: {"message": "...", "options": [...]}`;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const data = JSON.parse(raw);

          if (data.message) {
            return NextResponse.json({
              message: data.message,
              nextStep: nextStage,
              extractedPrefs: mergedPrefs,
              options: nextQ.options.length ? nextQ.options : (data.options?.length ? data.options : []),
            });
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini Chat failed, using local fallback:', geminiErr.message);
      }
    }

    // ── Pure local fallback (works even without Groq) ─────────────────────
    const nextStage = NEXT_STAGE[currentStep];
    const nextQ = getStageQuestion(nextStage, mergedPrefs);

    return NextResponse.json({
      message: nextQ.message,
      nextStep: nextStage,
      extractedPrefs: mergedPrefs,
      options: nextQ.options,
    });

  } catch (error: any) {
    console.error('CHAT_API_ERROR:', error.message);
    const q = getStageQuestion(currentStep, prefs);
    return NextResponse.json({
      message: q.message,
      nextStep: currentStep,
      extractedPrefs: prefs,
      options: q.options,
    });
  }
}

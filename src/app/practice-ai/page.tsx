'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// 🔱 Sidebar Component (Consistent across the Hub)
const SidebarLink = ({ href, icon, label, active = false }: any) => (
  <Link href={href} style={{ 
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
    background: active ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'transparent',
    borderRadius: '12px', color: active ? 'white' : '#475569', 
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, 
    boxShadow: active ? '0 4px 15px rgba(168, 85, 247, 0.2)' : 'none',
    transition: 'all 0.3s'
  }}>
    {icon}
    {label}
  </Link>
);

const SidebarSubLink = ({ href, label, active = false }: any) => (
  <Link href={href} style={{ 
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px 10px 48px', 
    color: active ? '#a855f7' : '#64748b', 
    textDecoration: 'none', fontSize: '0.85rem', fontWeight: active ? 800 : 600, 
    transition: 'all 0.2s',
    position: 'relative'
  }}>
    <div style={{ 
      position: 'absolute', left: '24px', top: '0', bottom: '0', width: '2px', 
      background: 'rgba(0,0,0,0.05)' 
    }}></div>
    {active && <div style={{ position: 'absolute', left: '24px', top: '40%', bottom: '40%', width: '2px', background: '#a855f7' }}></div>}
    {label}
  </Link>
);

// 🧊 v57.0 AI/ML Sheet Card (Expert Path Style)
const AiSheetCard = ({ sheet }: { sheet: any }) => (
  <div style={{ 
    padding: '40px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', 
    borderRadius: '32px', display: 'flex', justifyContent: 'space-between', 
    alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-10px) translateX(10px)')}
  onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0) translateX(0)')}
  >
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flex: 1 }}>
       <div style={{ 
          width: '80px', height: '80px', 
          background: sheet.levelColor.bg, 
          borderRadius: '24px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '2.5rem',
          boxShadow: `0 10px 20px ${sheet.levelColor.bg}`
       }}>
          {sheet.icon}
       </div>

       <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ 
                background: sheet.levelColor.bg, color: sheet.levelColor.text, 
                padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', 
                fontWeight: 900, letterSpacing: '0.1em' 
             }}>
                {sheet.level.toUpperCase()}
             </span>
             {sheet.provider && <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', fontWeight: 800 }}>• Provider: {sheet.provider}</span>}
          </div>
          
          <h4 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#000', marginBottom: '12px', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>{sheet.name}</h4>
          
          <div style={{ marginBottom: '16px' }}>
             <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>SYLLABUS FOCUS</span>
             <p style={{ fontSize: '0.95rem', color: '#000', fontWeight: 700, margin: 0 }}>{sheet.topics}</p>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.45)', fontWeight: 600, maxWidth: '850px', lineHeight: '1.6' }}>
            {sheet.desc}
          </p>
       </div>
    </div>

    <div style={{ display: 'flex', gap: '60px', alignItems: 'center', marginLeft: '60px' }}>
       {sheet.links ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             {sheet.links.map((link: any, idx: number) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ 
                   padding: '12px 24px', background: '#000', color: '#fff', 
                   borderRadius: '12px', textDecoration: 'none', fontSize: '0.85rem', 
                   fontWeight: 900, boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                   whiteSpace: 'nowrap', textAlign: 'center'
                }}>{link.label}</a>
             ))}
          </div>
       ) : (
          <a href={sheet.link} target="_blank" rel="noopener noreferrer" style={{ 
             padding: '20px 48px', background: '#000', color: '#fff', 
             borderRadius: '20px', textDecoration: 'none', fontSize: '1rem', 
             fontWeight: 900, boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
             whiteSpace: 'nowrap'
          }}>OPEN RESOURCE ↗</a>
       )}
    </div>
  </div>
);

// 🧊 v57.0 Project Sheet Card (Specialized)
const AiProjectCard = ({ level, projects, color }: { level: string, projects: string[], color: any }) => (
  <div style={{ 
    padding: '32px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', 
    borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
    flex: 1
  }}>
    <div style={{ 
      display: 'inline-block', padding: '6px 14px', borderRadius: '10px', 
      background: color.bg, color: color.text, fontSize: '0.7rem', 
      fontWeight: 900, letterSpacing: '0.1em', marginBottom: '24px' 
    }}>
      {level.toUpperCase()} PROJECTS
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
       {projects.map((p, i) => (
          <div key={i} style={{ 
             padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px',
             display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid transparent',
             transition: 'all 0.3s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = color.text)}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
             <span style={{ fontSize: '1.2rem' }}>🎯</span>
             <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#000' }}>{p}</span>
          </div>
       ))}
    </div>
  </div>
);

export default function PracticeAiPage() {
  const [initial, setInitial] = useState('U');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const aiContent = {
    beginner: [
      { 
        name: "ML Roadmap by Roadmap.sh", icon: '🧠', provider: "roadmap.sh",
        level: "Beginner", levelColor: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
        topics: "Python → Math → Supervised → Unsupervised → Neural Networks",
        desc: "The most structured Machine Learning roadmap in the industry. It walks you through every layer of the ML stack, starting from foundational math and Python basics to deploying basic neural networks.",
        link: "https://roadmap.sh/machine-learning"
      },
      { 
        name: "Andrew Ng ML Sheet (Course Path)", icon: '💎', provider: "Coursera / Andrew Ng",
        level: "Beginner", levelColor: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
        topics: "Linear/Logistic Regression → SVM → Clustering → Anomaly Detection",
        desc: "Widely considered the best ML beginner resource globally. This path guides you through the fundamental algorithms that power modern AI, taught by the pioneer of the field himself.",
        link: "https://www.coursera.org/learn/machine-learning"
      },
      { 
        name: "Google ML Crash Course", icon: '🔍', provider: "Google AI",
        level: "Beginner", levelColor: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
        topics: "ML Concepts → TensorFlow Basics → Realistic Exercises",
        desc: "A fast-paced, practical introduction to Machine Learning using Google's own tools and internal training methodology. Highly effective for those who want to start coding ML models immediately.",
        link: "https://developers.google.com/machine-learning/crash-course"
      }
    ],
    intermediate: [
      { 
        name: "Hands-On ML Roadmap (Book Sheet)", icon: '📘', provider: "Aurelien Geron / O'Reilly",
        level: "Intermediate", levelColor: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
        topics: "Scikit-Learn → TensorFlow → Neural Networks → CNN/RNN → Computer Vision",
        desc: "Based on the industry's most popular practical AI book. This sheet bridges the gap between basic theory and real-world implementation using Scikit-Learn and modern Deep Learning frameworks.",
        link: "https://github.com/ageron/handson-ml3" // Linking to GitHub companion Repo
      },
      { 
        name: "Fast.ai Practical Deep Learning", icon: '🚀', provider: "fast.ai",
        level: "Intermediate", levelColor: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
        topics: "Deep Learning → Image Classification → NLP → Real-world Deployment",
        desc: "The most practical Deep Learning course in existence. It teaches the top-down approach: build first, understand math later. Essential for software engineers moving into high-fidelity AI roles.",
        link: "https://course.fast.ai/"
      },
      { 
        name: "Kaggle Learn Sheet", icon: '📊', provider: "Kaggle",
        level: "Intermediate", levelColor: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
        topics: "Pandas → Feature Engineering → Computer Vision → NLP",
        desc: "Mini-courses designed for rapid skill acquisition. Kaggle's internal team created these sheets to help you compete in data science competitions and build production-ready ML pipelines.",
        link: "https://www.kaggle.com/learn"
      }
    ],
    advanced: [
      { 
        name: "Deep Learning Specialization", icon: '🌌', provider: "deeplearning.ai",
        level: "Advanced", levelColor: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
        topics: "CNN → RNN → LSTM → Transformers → Hyperparameter Tuning",
        desc: "The definitive sequence of courses that defines advanced AI engineering. It covers the deep math and architectural decisions behind modern Transformers and state-of-the-art NLP models.",
        link: "https://www.coursera.org/specializations/deep-learning"
      },
      { 
        name: "Stanford University AI Hub", icon: '🏛️', provider: "Stanford / CS229 / CS231n",
        level: "Advanced", levelColor: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
        topics: "CS229 (ML) • CS231n (CV) • CS224n (NLP)",
        desc: "Math-heavy, graduate-level AI sheets from the world's leading research institution. These provide the theoretical depth required for research-oriented or high-level AI Architect roles.",
        links: [
           { label: "CS229 (ML) ↗", url: "https://cs229.stanford.edu/" },
           { label: "CS231n (CV) ↗", url: "https://cs231n.stanford.edu/" },
           { label: "CS224n (NLP) ↗", url: "https://cs224n.stanford.edu/" }
        ]
      }
    ],
    projects: {
      beginner: ["House Price Prediction", "Spam Email Classifier", "Titanic Survival Prediction", "Iris Classification", "Movie Recommendation System"],
      intermediate: ["Image Classification (CNN)", "Face Mask Detection", "Stock Price Prediction", "Chatbot (NLP)", "Sentiment Analysis", "Resume Screening AI"],
      advanced: ["Deepfake Detection", "Self Driving Car Model", "Trading Bot (ML)", "LLM Chatbot", "AI Medical Diagnosis", "Voice Assistant"]
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push('/login'); return; }
      const meta = session.user.user_metadata;
      const displayName = meta?.full_name || meta?.name || session.user.email?.split('@')[0];
      setUserName(displayName);
      setInitial(displayName?.charAt(0).toUpperCase() || 'U');
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff', color: '#000', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 80px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
           <img src="/logo.png" alt="ProgAce" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
           <span style={{ fontSize: '1.6rem', fontWeight: 950, background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>ProgAce</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: 'white', boxShadow: '0 8px 20px rgba(168,85,247,0.3)' }}>
            {initial}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '280px', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '32px 0', background: '#ffffff', position: 'fixed', bottom: 0, top: '80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 20px' }}>
            <SidebarLink href="/dashboard" label="Dashboard" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>} />
            <SidebarLink href="/roadmap" label="My Missions" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>} />
            <div style={{ 
               display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
               color: '#000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em',
               marginTop: '12px'
            }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
               PRACTICE HUBS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <SidebarSubLink href="/practice" label="DSA Mastery" />
               <SidebarSubLink href="/practice-dev" label="Dev Roadmaps" />
               <SidebarSubLink href="/practice-ai" label="AI / ML / DL" active />
            </div>
            <SidebarLink href="/mock-interview" label="Mock Voice AI" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>} />
            <SidebarLink href="/workspace" label="Code Arena" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>} />
            <SidebarLink href="/simulation" label="Simulation" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>} />
            <SidebarLink href="/swot" label="SWOT Analysis" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>} />
            <div style={{ margin: '20px 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}></div>
            <SidebarLink href="/settings" label="Settings" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83"></path></svg>} />
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '280px', padding: '60px 100px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '80px' }}>
            <h1 style={{ fontSize: '4.2rem', fontWeight: '950', marginBottom: '16px', letterSpacing: '-0.05em', fontFamily: 'Outfit', color: '#000' }}>AI Mastery Hub</h1>
            <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.02em' }}>High-fidelity Machine Learning and Deep Learning roadmaps.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            <section>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>🟢</span> BEGINNER ML RESOURCES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {aiContent.beginner.map((s, i) => <AiSheetCard key={i} sheet={s} />)}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>🟡</span> INTERMEDIATE DL RESOURCES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {aiContent.intermediate.map((s, i) => <AiSheetCard key={i} sheet={s} />)}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>🔴</span> ADVANCED AI MASTERCLASSES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {aiContent.advanced.map((s, i) => <AiSheetCard key={i} sheet={s} />)}
              </div>
            </section>

            <section style={{ marginBottom: '100px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>📊</span> AI / ML PROJECT MATRIX (HIGH-IMPORTANCE)
              </h3>
              <div style={{ display: 'flex', gap: '32px' }}>
                 <AiProjectCard level="Beginner" color={{ bg: 'rgba(16,185,129,0.1)', text: '#10b981' }} projects={aiContent.projects.beginner} />
                 <AiProjectCard level="Intermediate" color={{ bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' }} projects={aiContent.projects.intermediate} />
                 <AiProjectCard level="Advanced" color={{ bg: 'rgba(239,68,68,0.1)', text: '#ef4444' }} projects={aiContent.projects.advanced} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

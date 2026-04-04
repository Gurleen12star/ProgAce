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

// 🧊 v56.0 Development Sheet Card (Expert Path Style)
const DevSheetCard = ({ sheet }: { sheet: any }) => (
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
          background: sheet.categoryColor.bg, 
          borderRadius: '24px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '2.5rem',
          boxShadow: `0 10px 20px ${sheet.categoryColor.bg}`
       }}>
          {sheet.icon}
       </div>

       <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ 
                background: sheet.categoryColor.bg, color: sheet.categoryColor.text, 
                padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', 
                fontWeight: 900, letterSpacing: '0.1em' 
             }}>
                {sheet.category.toUpperCase()}
             </span>
             <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', fontWeight: 800 }}>• Use for: {sheet.useFor}</span>
          </div>
          
          <h4 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#000', marginBottom: '12px', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>{sheet.name}</h4>
          
          <p style={{ fontSize: '0.98rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600, maxWidth: '850px', lineHeight: '1.6' }}>
            {sheet.desc}
          </p>
       </div>
    </div>

    <div style={{ display: 'flex', gap: '60px', alignItems: 'center', marginLeft: '60px' }}>
       <a href={sheet.link} target="_blank" rel="noopener noreferrer" style={{ 
          padding: '20px 48px', background: '#000', color: '#fff', 
          borderRadius: '20px', textDecoration: 'none', fontSize: '1rem', 
          fontWeight: 900, boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap', transition: 'all 0.3s'
       }}
       onMouseOver={(e) => (e.currentTarget.style.background = '#a855f7')}
       onMouseOut={(e) => (e.currentTarget.style.background = '#000')}
       >OPEN RESOURCE ↗</a>
    </div>
  </div>
);

export default function PracticeDevPage() {
  const [initial, setInitial] = useState('U');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const devContent = {
    roadmaps: [
      { 
        name: "Developer Roadmap (Best Overall)", icon: '🧠', useFor: "Full Stack / Backend / Frontend",
        category: "Core Roadmap", categoryColor: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
        desc: "The gold standard for engineering paths. This roadmap provides a step-by-step master plan for different developer roles, explaining every tool and technology required to reach senior-level mastery. It’s like the Striver sheet, but for complete systems development.",
        link: "https://github.com/kamranahmedse/developer-roadmap"
      },
      { 
        name: "Frontend Developer Roadmap", icon: '🎨', useFor: "Frontend Developer",
        category: "Core Roadmap", categoryColor: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
        desc: "From HTML → CSS → JavaScript → React. This guide is a complete technical breakdown that walks you through basic layouts to advanced state management and architectural patterns. It includes curated resources for every tool in the frontend ecosystem.",
        link: "https://github.com/FADL285/Front-End-Development-Roadmap"
      },
      { 
        name: "Full Stack Developer Roadmap", icon: '🏢', useFor: "Full Stack Developer",
        category: "Core Roadmap", categoryColor: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
        desc: "The ultimate journey through Frontend + Backend + Database + Cloud. This path is designed for engineers who want to work on complete end-to-end applications, covering everything from UI design to complex backend deployment and scalability.",
        link: "https://roadmap.sh/full-stack"
      }
    ],
    projects: [
      { 
        name: "Frontend Projects Sheet", icon: '💻', useFor: "Beginner → Advanced UI Mastery",
        category: "Project Sheet", categoryColor: { bg: 'rgba(236,72,153,0.1)', text: '#ec4899' },
        desc: "A categorized challenge list ranging from simple Portfolio Websites and Weather Apps to advanced Code Editors and Expense Trackers. Perfect for building a high-fidelity portfolio and mastering UI components with real-world APIs.",
        link: "https://roadmap.sh/frontend/projects"
      },
      { 
        name: "Backend Project Sheet", icon: '⚙️', useFor: "Beginner → Advanced Logic Mastery",
        category: "Project Sheet", categoryColor: { bg: 'rgba(236,72,153,0.1)', text: '#ec4899' },
        desc: "Focus on logic, databases, and authentication. Challenges include building Blog APIs, Authentication Systems, and complex Ride Booking / Food Delivery backends. Crucial for understanding distributed systems and payment architecture.",
        link: "https://roadmap.sh/backend/project-ideas"
      },
      { 
        name: "50 Frontend Projects Masterlist", icon: '🚀', useFor: "Rapid Implementation Practice",
        category: "Project Sheet", categoryColor: { bg: 'rgba(236,72,153,0.1)', text: '#ec4899' },
        desc: "An exhaustive collection of 50 high-quality frontend projects including source code. This is a powerful resource for rapid implementation practice, helping you build muscle memory for common UI patterns and animations.",
        link: "https://github.com/SudeepAcharjee/The-50-Front-end-Project"
      }
    ]
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
               <SidebarSubLink href="/practice-dev" label="Dev Roadmaps" active />
               <SidebarSubLink href="/practice-ai" label="AI / ML / DL" />
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
            <h1 style={{ fontSize: '4.2rem', fontWeight: '950', marginBottom: '16px', letterSpacing: '-0.05em', fontFamily: 'Outfit', color: '#000' }}>Dev Hub</h1>
            <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.02em' }}>High-fidelity development roadmaps and project-based mastery.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            <section>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>🧠</span> STRATEGIC ROADMAPS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {devContent.roadmaps.map((s, i) => <DevSheetCard key={i} sheet={s} />)}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '40px', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Outfit' }}>
                <span style={{ transform: 'scale(1.4)' }}>💻</span> PROJECT SHEETS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {devContent.projects.map((s, i) => <DevSheetCard key={i} sheet={s} />)}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

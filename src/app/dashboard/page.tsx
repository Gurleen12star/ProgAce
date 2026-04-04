'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// 🔱 v51.0 (Restored) Premium Sidebar Component
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

// 🏰 v48.2 LeetCode Fidelity Contribution Heatmap (Truth-Based)
const ContributionGraph = () => {
  const [activityLog, setActivityLog] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const log = JSON.parse(localStorage.getItem('nexus_activity_log') || '{}');
    setActivityLog(log);
  }, []);

  const { history, stats } = useMemo(() => {
    const days = [];
    const now = new Date();
    const totalCells = 371;
    let totalSubmissions = 0, activeDays = 0, maxStreak = 0, tempStreak = 0;

    for (let i = 0; i < totalCells; i++) {
       const d = new Date();
       d.setDate(now.getDate() - (totalCells - 1 - i));
       const dateStr = d.toISOString().split('T')[0];
       const count = activityLog[dateStr] || 0;
       totalSubmissions += count;
       if (count > 0) {
         activeDays++; tempStreak++;
         if (tempStreak > maxStreak) maxStreak = tempStreak;
       } else { tempStreak = 0; }

       let intensity = 0;
       if (count > 0) {
          if (dateStr === now.toISOString().split('T')[0]) intensity = 4;
          else intensity = Math.min(3, Math.floor(count / 2) + 1);
       }
       days.push({ intensity, date: dateStr, month: d.getMonth(), day: d.getDay() });
    }
    return { history: days, stats: { totalSubmissions, activeDays, maxStreak } };
  }, [activityLog]);

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'rgba(0,0,0,0.03)';
      case 1: return 'rgba(168, 85, 247, 0.2)';
      case 2: return 'rgba(168, 85, 247, 0.45)';
      case 3: return 'rgba(168, 85, 247, 0.75)';
      case 4: return '#a855f7';
      default: return 'rgba(0,0,0,0.03)';
    }
  };

  const weeks: any[][] = [];
  let currentWeek: any[] = [];
  history.forEach((day, i) => {
    currentWeek.push(day);
    if (day.day === 6 || i === history.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="glass-container" style={{ padding: '32px', marginBottom: '48px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>{stats.totalSubmissions} <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontSize: '0.9rem' }}>submissions in the past year</span></span>
         </div>
         <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', fontWeight: 800, color: 'rgba(0,0,0,0.4)' }}>
            <span>Total active days: <span style={{ color: '#000' }}>{stats.activeDays}</span></span>
            <span>Max streak: <span style={{ color: '#000' }}>{stats.maxStreak}</span></span>
         </div>
      </div>

      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '24px' }}>
         <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 14px)', gap: '4px', marginRight: '16px', paddingTop: '18px' }}>
               {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                 <span key={i} style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(0,0,0,0.25)', height: '14px', display: 'flex', alignItems: 'center' }}>{d}</span>
               ))}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
               {weeks.map((week, weekIdx) => {
                 const firstDay = week[0];
                 const isNewMonth = firstDay.day === 0 && weekIdx > 0 && weeks[weekIdx-1][0].month !== firstDay.month;
                 return (
                   <div key={weekIdx} style={{ display: 'grid', gridTemplateRows: 'repeat(7, 14px)', gap: '4px', marginLeft: isNewMonth ? '16px' : '0' }}>
                      {week.map((day, dayIdx) => (
                        <div key={dayIdx} style={{ width: '14px', height: '14px', borderRadius: '3px', background: getColor(day.intensity) }} title={`${day.date}`} />
                      ))}
                      {isNewMonth && (
                        <span style={{ position: 'absolute', bottom: '0', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', fontWeight: 800 }}>{monthNames[firstDay.month].toUpperCase()}</span>
                      )}
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', fontWeight: 800 }}>
         <span>LESS</span>
         {[0, 1, 2, 3, 4].map(l => <div key={l} style={{ width: '12px', height: '12px', borderRadius: '3px', background: getColor(l) }}></div>)}
         <span>MORE</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('');
  const [initial, setInitial] = useState<string>('U');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [enrolledRoadmaps, setEnrolledRoadmaps] = useState<any[]>([]);
  const [stats, setStats] = useState({ problemsSolved: 12, accuracy: 88, dailyStreak: 3, skillLevel: 'Intermediate', totalHours: 24, totalProgress: 0 });
  const [recentActivity] = useState<any[]>([
    { id: 1, type: 'solve', title: 'Two Sum', diff: 'Easy', time: '2h ago' },
    { id: 2, type: 'solve', title: 'Merge Intervals', diff: 'Medium', time: '5h ago' }
  ]);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push('/login'); return; }
      const email = session.user.email ?? '';
      const meta = session.user.user_metadata;
      const displayName = meta?.full_name || meta?.name || email.split('@')[0];
      setUserName(displayName);
      setInitial(displayName.charAt(0).toUpperCase());
      try {
        const res = await fetch('/api/roadmap/enroll');
        const cloud = res.ok ? await res.json() : [];
        const local = JSON.parse(localStorage.getItem('proxied_roadmaps') || '[]');
        const combined = [...cloud, ...local];
        setEnrolledRoadmaps(combined);
        if (combined.length > 0) {
          let totalComp = 0, totalTasks = 0;
          combined.forEach((r: any) => {
            totalComp += r.metadata?.completed_tasks?.length || 0;
            totalTasks += (r.roadmap_data?.curriculum?.length || 1) * 5;
          });
          const avg = Math.round((totalComp / totalTasks) * 100) || 0;
          setStats(prev => ({ ...prev, totalProgress: avg, skillLevel: avg > 80 ? 'Elite' : avg > 50 ? 'Advanced' : 'Intermediate' }));
        }
      } catch (e) {} finally { setLoading(false); }
    };
    checkUser();
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff', color: '#000', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Restored Premium Header */}
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
        
        {/* Absolute Sidebar Link Restoration (v51.0) */}
        <aside style={{ width: '280px', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '32px 0', background: '#ffffff', position: 'fixed', bottom: 0, top: '80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 20px' }}>
            <SidebarLink href="/dashboard" label="Dashboard" active icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>} />
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

        <main style={{ flex: 1, marginLeft: '280px', padding: '60px 80px', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '56px' }}>
            <h1 style={{ fontSize: '3.2rem', fontWeight: '950', marginBottom: '12px', letterSpacing: '-0.04em', fontFamily: 'Outfit', color: '#000' }}>Mastery Dashboard</h1>
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '1.2rem', fontWeight: 600 }}>Welcome back, {userName}. Your high-fidelity control center.</p>
          </div>

          {/* Full Restored Metric Suite */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '56px' }}>
             {[
               { label: 'PROBLEMS', val: stats.problemsSolved, color: '#3b82f6', sub: 'Tasks Done' },
               { label: 'ACCURACY', val: `${stats.accuracy}%`, color: '#10b981', sub: 'Success Rate' },
               { label: 'STREAK', val: `${stats.dailyStreak}d`, color: '#f59e0b', sub: 'Days Direct' },
               { label: 'LEVEL', val: stats.skillLevel, color: '#a855f7', sub: 'Current Rank' },
               { label: 'HOURS', val: `${stats.totalHours}h`, color: '#ec4899', sub: 'Total Focus' }
             ].map((m, i) => (
                <div key={i} className="glass-container" style={{ padding: '32px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', marginBottom: '16px' }}>{m.label}</div>
                   <div style={{ fontSize: '2.2rem', fontWeight: 950, color: m.color, lineHeight: 1 }}>{m.val}</div>
                   <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginTop: '8px' }}>{m.sub}</div>
                </div>
             ))}
          </div>

          <ContributionGraph />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#000', fontFamily: 'Outfit' }}>Active Missions</h2>
                   <Link href="/roadmap?onboarding=true" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a855f7', textDecoration: 'none', padding: '8px 16px', background: 'rgba(168,85,247,0.05)', borderRadius: '10px' }}>+ New Journey</Link>
                </div>

                {enrolledRoadmaps.length === 0 ? (
                   <div style={{ padding: '80px', order: '2px dashed rgba(0,0,0,0.05)', borderRadius: '32px', textAlign: 'center' }}>No active blueprint initiated.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       {enrolledRoadmaps.map((r: any) => {
                          const comp = r.metadata?.completed_tasks?.length || 0;
                          const total = (r.roadmap_data?.curriculum?.length || 1) * 5;
                          const progress = Math.min(100, Math.round((comp / total) * 100));
                          const isExpert = r.metadata?.level === 'Expert' || r.roadmap_data?.isExpert;
                          
                          return (
                             <div key={r.id} style={{ 
                                padding: '40px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', 
                                borderRadius: '32px', display: 'flex', justifyContent: 'space-between', 
                                alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
                             }}>
                                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 1 }}>
                                   <div style={{ 
                                      width: '72px', height: '72px', 
                                      background: isExpert ? 'rgba(168,85,247,0.1)' : 'rgba(236,72,153,0.1)', 
                                      borderRadius: '20px', display: 'flex', alignItems: 'center', 
                                      justifyContent: 'center', fontSize: '2rem'
                                   }}>{isExpert ? '🏆' : '🎯'}</div>
                                   <div style={{ flex: 1 }}>
                                      <h4 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#000', marginBottom: '6px' }}>{r.metadata?.title}</h4>
                                      <span style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>{r.metadata?.role} @ {r.metadata?.company}</span>
                                   </div>
                                </div>
                                <div style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
                                   <div style={{ width: '220px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.75rem', fontWeight: 900, color: '#a855f7', letterSpacing: '0.05em' }}>
                                         <span>CURRENT MASTERY</span>
                                         <span>{progress}%</span>
                                      </div>
                                      <div style={{ height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                                         <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #ec4899, #a855f7)', borderRadius: '12px', transition: 'width 1s ease-in-out' }}></div>
                                      </div>
                                   </div>
                                   <Link href={`/roadmap?id=${r.id}`} style={{ padding: '16px 36px', background: '#000', color: '#fff', borderRadius: '16px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>RESUME</Link>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                )}
             </div>

             {/* Restored Activity Sidebar */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000', fontFamily: 'Outfit' }}>Recent Activity</h3>
                <div className="glass-container" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '32px', padding: '32px', minHeight: '440px' }}>
                   {recentActivity.map((act) => (
                      <div key={act.id} style={{ padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', gap: '16px' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                         <div>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{act.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)' }}>{act.diff} • {act.time}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

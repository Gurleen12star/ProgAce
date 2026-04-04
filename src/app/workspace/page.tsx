'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  ChevronLeft, Send, Sparkles, TerminalSquare, RotateCcw, 
  Lightbulb, User, Bot, Play, CheckCircle2, XCircle, 
  Terminal, BookOpen, Bug, CheckCircle, Clock, Settings, FileText, 
  Search, Code2, AlertCircle, Trophy, Bell, Share2, Award, 
  Package, FlaskConical, NotebookPen, LayoutGrid, ListOrdered, Share,
  BarChart3, Medal, ExternalLink, ArrowLeft, Gem, Users
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import AiTutor from '@/components/AiTutor';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// 🔱 Mock Contest Registry (v67.0 - ProgAce Branding)
const ACTIVE_CONTESTS = [
    { id: 496, type: 'Weekly', title: 'ProgAce Weekly 496', date: 'Sun, Apr 5, 08:00 GMT+05:30', startAt: 'Starts in 15:58:10', color: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)', bgIcon: <div style={{width:'80px',height:'80px',background:'rgba(255,255,255,0.2)',borderRadius:'12px',transform:'rotate(45deg)'}}></div> },
    { id: 180, type: 'Biweekly', title: 'ProgAce Biweekly 180', date: 'Sat, Apr 11, 20:00 GMT+05:30', startAt: '7d 03:58:17', color: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', bgIcon: <div style={{display:'flex',gap:'8px'}}><div style={{width:'60px',height:'60px',background:'rgba(255,255,255,0.15)',borderRadius:'8px',transform:'rotate(45deg)'}}></div><div style={{width:'60px',height:'60px',background:'rgba(255,255,255,0.15)',borderRadius:'8px',transform:'rotate(45deg)'}}></div></div> }
];

const LEADERBOARD = [
    { rank: 1, name: 'Miruu', rating: 3702, attended: 156, avatar: 'M', color: '#fbbf24' },
    { rank: 2, name: 'Neal Wu', rating: 3686, attended: 214, avatar: 'N', color: '#94a3b8' },
    { rank: 3, name: 'Yawn_Sean', rating: 3644, attended: 189, avatar: 'Y', color: '#b45309' }
];

const PAST_ROUNDS = [
    { id: 495, type: 'Weekly', title: 'ProgAce Weekly 495', date: 'Sun, Mar 29, 08:00 GMT+05:30', attended: '0/4' },
    { id: 179, type: 'Biweekly', title: 'ProgAce Biweekly 179', date: 'Sat, Mar 28, 20:00 GMT+05:30', attended: '0/4' },
    { id: 494, type: 'Weekly', title: 'ProgAce Weekly 494', date: 'Sun, Mar 22, 08:00 GMT+05:30', attended: '1/4' },
    { id: 493, type: 'Weekly', title: 'ProgAce Weekly 493', date: 'Sun, Mar 15, 08:00 GMT+05:30', attended: '0/4' }
];

type ArenaView = 'hub' | 'details' | 'coding';

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawId = searchParams.get('id');
  
  const [view, setView] = useState<ArenaView>('hub');
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Arena State
  const [problem, setProblem] = useState<any>(null);
  const [slug, setSlug] = useState(rawId || 'two-sum');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [codes, setCodes] = useState<Record<string, string>>({ javascript: '', python: '', cpp: '', java: '' });
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (rawId) {
        setSlug(rawId);
        setView('coding');
        fetchArenaProblem(rawId);
    } else {
        setView('hub');
    }
  }, [rawId]);

  async function fetchArenaProblem(id: string) {
    setLoading(true);
    const { data } = await supabase.from('problems').select('*').eq('slug', id).single();
    if (data) {
      setProblem(data);
      setCodes({
        javascript: data.starter_codes?.javascript || '// JS Starter',
        python: data.starter_codes?.python || '# Python Starter',
        cpp: data.starter_codes?.cpp || '// C++ Starter',
        java: data.starter_codes?.java || '// Java Starter'
      });
    } else {
        setProblem({ title: 'Standard Assessment Protocol', difficulty: 'Medium', category: 'General' });
    }
    setLoading(false);
  }

  const handleRun = async () => {
    setIsRunning(true);
    setActiveConsoleTab('result');
    setTimeout(() => {
        setTestResults([{ id: 1, status: 'success', output: '4', expected: '4' }]);
        setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
    }, 2000);
  };

  const enterContestDetail = (contest: any) => {
    setSelectedContest(contest);
    setView('details');
  };

  {/* 🔱 HUB VIEW (Merged Dashboard & Leaderboard for Visibility v67.0) */}
  const renderHub = () => (
    <div style={{ minHeight: '100vh', background: '#f9fafb url("https://www.transparenttextures.com/patterns/cubes.png")', paddingBottom: '100px' }} className="progace-hub">
       
       {/* Dashboard Header/Hero */}
       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
             <div style={{ display: 'inline-flex', padding: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                <Trophy size={64} color="#fbbf24" fill="#fbbf24" />
             </div>
             <h1 style={{ fontSize: '3.5rem', fontWeight: 950, color: '#1f2937', fontFamily: 'Outfit', letterSpacing: '-0.04em', marginBottom: '12px' }}>ProgAce Contest</h1>
             <p style={{ color: '#6b7280', fontSize: '1.25rem', fontWeight: 500 }}>Compete. Climb. Conquer. The ultimate technical arena.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '80px' }}>
             {ACTIVE_CONTESTS.map((c) => (
                <div key={c.id} onClick={() => enterContestDetail(c)} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                   <div style={{ height: '240px', background: c.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', top: '24px', right: '24px', padding: '8px 16px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.85rem', fontWeight: 900, display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <Clock size={16} /> {c.startAt}
                      </div>
                      {c.bgIcon}
                   </div>
                   <div style={{ padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#1f2937', marginBottom: '4px' }}>{c.title}</h3>
                         <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>{c.date}</p>
                      </div>
                      <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Bell size={20} color="#9ca3af" />
                      </div>
                   </div>
                </div>
             ))}
          </div>

          {/* 🔱 INTEGRATED LEADERBOARD (Now Globally Visible v67.0) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', marginTop: '100px' }}>
             
             {/* Left: Podium Section */}
             <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1f2937', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <Users color="#f97316" /> Global Standings
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '300px', marginBottom: '40px', padding: '0 20px' }}>
                   <div style={{ width: '100px', height: '140px', background: 'white', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', position: 'relative', border: '1px solid #e5e7eb' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, position: 'absolute', top: '-70px', border: '4px solid #f1f5f9' }}>N</div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginTop: '20px' }}>Neal Wu</h4>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>2nd Place</div>
                   </div>
                   <div style={{ width: '120px', height: '180px', background: 'white', margin: '0 15px', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', position: 'relative', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', border: '1px solid #fef3c7' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fbbf24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, position: 'absolute', top: '-100px', border: '6px solid #fff' }}>M</div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 950, marginTop: '40px' }}>Miruu</h4>
                      <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 900 }}>GRAND CHAMPION</div>
                   </div>
                   <div style={{ width: '100px', height: '120px', background: 'white', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', position: 'relative', border: '1px solid #e5e7eb' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#b45309', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, position: 'absolute', top: '-70px', border: '4px solid #fff7ed' }}>Y</div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginTop: '20px' }}>Yawn</h4>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>3rd Place</div>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   {LEADERBOARD.map((l) => (
                      <div key={l.rank} style={{ background: 'white', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #f3f4f6' }}>
                         <span style={{ width: '20px', fontSize: '0.9rem', fontWeight: 950, color: '#9ca3af' }}>{l.rank}</span>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: l.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{l.avatar}</div>
                         <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{l.name}</h4>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#1f2937' }}>{l.rating}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Right: History List */}
             <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #f3f4f6', marginBottom: '32px' }}>
                   <button style={{ paddingBottom: '16px', borderBottom: '3px solid #a855f7', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '0.9rem', fontWeight: 950, color: '#1f2937' }}>Recent Contests</button>
                   <button style={{ paddingBottom: '16px', background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 950, color: '#9ca3af' }}>Participation History</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   {PAST_ROUNDS.map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                         <div style={{ width: '120px', height: '70px', borderRadius: '16px', background: p.type === 'Weekly' ? '#fbbf24' : '#a855f7', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 950, fontSize: '0.65rem' }}>{p.type.toUpperCase()}</div>
                         <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1f2937' }}>{p.title}</h4>
                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>{p.date}</p>
                         </div>
                         <button style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 950, color: '#a855f7', cursor: 'pointer' }}>Virtual</button>
                      </div>
                   ))}
                </div>
                <button style={{ width: '100%', marginTop: '32px', padding: '16px', background: '#f3f4f6', border: 'none', borderRadius: '12px', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 800, cursor: 'not-allowed' }}>LOAD MORE HISTORY</button>
             </div>

          </div>
       </div>
    </div>
  );

  {/* 🔱 DETAILS VIEW (Rules & Prizes) */}
  const renderDetails = () => (
    <div style={{ minHeight: '100vh', background: 'white', paddingBottom: '100px' }}>
       <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          
          <button onClick={() => setView('hub')} style={{ background: '#f3f4f6', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '32px' }}>
             <ArrowLeft size={18} color="#6b7280" />
          </button>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 950, color: '#f97316', fontFamily: 'Outfit', letterSpacing: '-0.04em', marginBottom: '12px' }}>{selectedContest?.title}</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
             <span style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: 600 }}>{selectedContest?.date}</span>
             <div style={{ width: '6px', height: '6px', background: '#e5e7eb', borderRadius: '50%' }}></div>
             <span style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: 600 }}>{selectedContest?.startAt}</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
             <button onClick={() => setIsRegistered(true)} style={{ padding: '14px 28px', background: '#fff7ed', border: '1px solid #f97316', color: '#f97316', borderRadius: '16px', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{fontSize:'1.4rem'}}>👋</span> {isRegistered ? 'Registered' : 'Register'}
             </button>
             <button style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={20} color="#6b7280" />
             </button>
             <button style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Share size={20} color="#6b7280" />
             </button>
          </div>

          <div style={{ color: '#374151', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '64px' }}>
             Welcome to the {selectedContest?.title}. This contest is sponsored by ProgAce Intelligence.
          </div>

          {/* BONUS PRIZES SECTION */}
          <div style={{ marginBottom: '80px' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <Medal color="#fbbf24" fill="#fbbf24" /> ProgAce Bonus Prizes
             </h2>
             <div style={{ display: 'flex', gap: '30px' }}>
                {[
                    { rank: '1st - 3rd', label: 'ProgAce Professional Backpack', icon: <Package size={48} /> },
                    { rank: '4th - 10th', label: 'ProgAce Insulated Bottle', icon: <FlaskConical size={48} /> },
                    { rank: '96th, 496th+', label: 'ProgAce Mastery Notebook', icon: <NotebookPen size={48} /> }
                ].map((p, i) => (
                    <div key={i} style={{ width: '160px', textAlign: 'center' }}>
                       <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '4px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: '#fff7ed' }}>
                          <span style={{opacity:0.3}}>{p.icon}</span>
                       </div>
                       <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', marginBottom: '4px' }}>Rank: {p.rank}</p>
                       <p style={{ fontSize: '0.9rem', color: '#1f2937', fontWeight: 600 }}>{p.label}</p>
                    </div>
                ))}
             </div>
          </div>

          {/* RULES SECTION */}
          <div style={{ background: '#f9fafb', borderRadius: '24px', padding: '40px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.4rem' }}>📌</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#1f2937' }}>Important Notes</h3>
             </div>
             <ol style={{ paddingLeft: '20px', color: '#4b5563', fontSize: '0.95rem', lineHeight: 2 }}>
                <li>Penalty time of 5 minutes applies for each wrong submission.</li>
                <li>To ensure fairness, hidden test cases will not be shown during the contest.</li>
                <li>Ratings will be updated within 5 working days after evaluation.</li>
             </ol>
             {isRegistered && (
                <button onClick={() => setView('coding')} style={{ marginTop: '40px', width: '100%', padding: '20px', background: '#f97316', color: 'white', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 950, border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(249,115,22,0.2)' }}>
                   ENTER PROGACE AREANA
                </button>
             )}
          </div>

       </div>
    </div>
  );

  {/* 🔱 CODING ARENA */}
  const renderCoding = () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', overflow: 'hidden' }}>
      
      {submissionSuccess && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#161616', padding: '60px', borderRadius: '32px', border: '1px solid #22c55e', textAlign: 'center', maxWidth: '540px', width: '90%', boxShadow: '0 0 60px rgba(34,197,94,0.2)' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <CheckCircle2 size={60} color="#22c55e" />
            </div>
            <h1 style={{ color: '#22c55e', fontSize: '3rem', fontWeight: 950, marginBottom: '12px', fontFamily: 'Outfit' }}>Accepted</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '40px' }}>Your solution passed all validation metrics.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
               <button onClick={() => setSubmissionSuccess(false)} style={{ flex: 1, padding: '18px', background: '#333', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}>Close</button>
               <button onClick={() => setView('hub')} style={{ flex: 1, padding: '18px', background: 'var(--gradient-purple-pink)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: 950 }}>Back to Hub</button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="animate-spin" style={{ width: '60px', height: '60px', border: '4px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 28px' }}></div>
            <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 950 }}>Executing Tests...</h2>
          </div>
        </div>
      )}

      <header style={{ height: '56px', background: '#161616', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => setView('details')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
             <ChevronLeft size={18} /> Contest Detail
          </button>
          <div style={{ width: '1px', height: '20px', background: '#333' }}></div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{problem?.title || 'ProgAce Challenge'}</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
           <div style={{ color: '#ef4444', fontWeight: 950, fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Clock size={16} /> 00:45:00
           </div>
           <button onClick={() => setIsAiOpen(true)} style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
              <Sparkles size={16} /> Nexus AI
           </button>
           <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRun} disabled={isRunning} style={{ height: '32px', background: '#333', color: 'white', border: 'none', padding: '0 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Run</button>
              <button onClick={handleSubmit} disabled={isRunning} style={{ height: '32px', background: '#22c55e', color: 'black', border: 'none', padding: '0 18px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 950, cursor: 'pointer' }}>Submit</button>
           </div>
        </div>
      </header>

      <main style={{ flex: 1, position: 'relative' }}>
         <PanelGroup direction="horizontal">
            <Panel defaultSize={30}>
               <div style={{ height: '100%', background: '#0d0a15', borderRight: '1px solid #222', padding: '24px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 950, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', marginBottom: '16px' }}>{problem?.difficulty || 'Medium'}</div>
                  <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 950, marginBottom: '20px' }}>{problem?.title}</h2>
                  <div className="prose prose-invert prose-sm">
                     <ReactMarkdown>{problem?.description || 'Loading contest challenge description...'}</ReactMarkdown>
                  </div>
               </div>
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel defaultSize={70}>
               <PanelGroup direction="vertical">
                  <Panel defaultSize={65}>
                    <Editor height="100%" language={language} theme="vs-dark" value={codes[language]} onChange={(v) => setCodes(prev => ({ ...prev, [language]: v || '' }))} options={{ minimap: { enabled: false }, fontSize: 14 }} />
                  </Panel>
                  <PanelResizeHandle className="resize-handle-v" />
                  <Panel defaultSize={35}>
                    <div style={{ height: '100%', background: '#0d0a15', padding: '24px' }}>
                       <div style={{ color: '#22c55e', fontWeight: 950, fontSize: '0.8rem', marginBottom: '16px' }}>CONSOLE RESULT</div>
                       {testResults ? (
                          <pre style={{ color: '#22c55e' }}>{JSON.stringify(testResults, null, 2)}</pre>
                       ) : (
                          <span style={{ color: '#444' }}>Waiting for execution...</span>
                       )}
                    </div>
                  </Panel>
               </PanelGroup>
            </Panel>
         </PanelGroup>
         <AiTutor isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} problemContext={problem?.description || ''} currentCode={codes[language]} currentLanguage={language} />
      </main>
    </div>
  );

  return (
    <div>
        {view === 'hub' && renderHub()}
        {view === 'details' && renderDetails()}
        {view === 'coding' && renderCoding()}
        
        <style jsx global>{`
           .resize-handle { width: 2px; background: #222; cursor: col-resize; transition: background 0.2s; }
           .resize-handle:hover { background: #a855f7; }
           .resize-handle-v { height: 2px; background: #222; cursor: row-resize; transition: background 0.2s; }
           .resize-handle-v:hover { background: #22c55e; }
           @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
           .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div>Loading ProgAce Arena...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}

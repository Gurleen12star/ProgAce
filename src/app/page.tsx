'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ArrowRight, Play, Star, ShieldCheck, 
  Zap, Globe, Brain, Code2, Target, Users, Sparkles,
  Trophy, Activity, Mic2, Layout, Database, Terminal,
  Check, Mail, Phone, MapPin, Plus, Minus, HelpCircle
} from 'lucide-react';

// 🔱 High-Fidelity Mockup Components (v73.1)
const MockupInterview = () => (
    <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #333', padding: '24px', width: '100%', maxWidth: '300px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: 'perspective(1000px) rotateY(-5deg)' }}>
       <div style={{ background: '#222', borderRadius: '16px', aspectRatio: '16/9', height: '140px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#a855f7', opacity: 0.3, filter: 'blur(20px)' }}></div>
          <Users color="#a855f7" size={32} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900 }}>AI INTERVIEWER</div>
       </div>
       <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ flex: 1, height: '4px', background: i % 2 === 0 ? '#333' : '#a855f7', borderRadius: '2px' }}></div>)}
       </div>
       <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.5 }}>"Explain how you would optimize a Binary Search tree for read-heavy operations?"</p>
    </div>
);

const MockupArena = () => (
    <div style={{ background: '#0a0a0a', borderRadius: '24px', border: '1px solid #222', padding: '16px', width: '100%', maxWidth: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transform: 'perspective(1000px) rotateX(10deg)' }}>
       <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#ff5f56', borderRadius: '50%' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#ffbd2e', borderRadius: '50%' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#27c93f', borderRadius: '50%' }}></div>
       </div>
       <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#666', lineHeight: 1.6 }}>
          <p><span style={{ color: '#a855f7' }}>function</span> <span style={{ color: '#22d3ee' }}>solve</span>(nums) {'{'}</p>
          <p style={{ paddingLeft: '12px' }}>  <span style={{ color: '#a855f7' }}>const</span> map = <span style={{ color: '#eb4899' }}>new</span> Map();</p>
          <p style={{ paddingLeft: '12px' }}>  <span style={{ color: '#777' }}>// Optimization Phase...</span></p>
          <p>{'}'}</p>
       </div>
       <div style={{ marginTop: '16px', padding: '8px 12px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '0.65rem', fontWeight: 900, borderRadius: '8px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={14} /> TEST CASES PASSED
       </div>
    </div>
);

const MockupSWOT = () => (
    <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #333', padding: '24px', width: '100%', maxWidth: '280px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: 'perspective(1000px) rotateY(15deg)' }}>
       <div style={{ width: '140px', height: '140px', margin: '0 auto 24px', position: 'relative' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="100%" height="100%" viewBox="0 0 100 100">
                <polygon points="50,20 80,40 70,80 30,80 20,40" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2" />
             </svg>
          </div>
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#22d3ee', color: 'black', fontSize: '0.6rem', fontWeight: 950, padding: '2px 6px', borderRadius: '4px' }}>IQ: 142</div>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ height: '4px', background: '#22d3ee', borderRadius: '2px' }}></div>
          <div style={{ height: '4px', background: '#333', borderRadius: '2px' }}></div>
          <div style={{ height: '4px', background: '#a855f7', borderRadius: '2px' }}></div>
          <div style={{ height: '4px', background: '#eb4899', borderRadius: '2px' }}></div>
       </div>
    </div>
);

// 🔱 NEW: Workflow Section
const WorkflowSection = () => (
    <section id="workflow" style={{ maxWidth: '1200px', margin: '0 auto 200px', padding: '0 40px' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 950, textAlign: 'center', marginBottom: '80px', letterSpacing: '-0.04em' }}>Your Path to <span style={{ color: '#a855f7' }}>Mastery</span>.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
                { title: 'Diagnostic', desc: 'Identify gaps with AI-driven SWOT analysis.', icon: Brain, color: '#a855f7' },
                { title: 'Roadmap', desc: 'Get a personalized multi-stage career blueprint.', icon: Target, color: '#22d3ee' },
                { title: 'Training', desc: 'Master concepts in high-performance workspaces.', icon: Terminal, color: '#eb4899' },
                { title: 'Interview', desc: 'Secure the role with AI-powered mock simulations.', icon: Mic2, color: '#22c55e' }
            ].map((step, i) => (
                <div key={i} style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <div style={{ width: '48px', height: '48px', background: `${step.color}15`, border: `1px solid ${step.color}30`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <step.icon color={step.color} size={24} />
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 950, color: step.color, marginBottom: '8px' }}>STEP 0{i + 1}</div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '12px' }}>{step.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

// 🔱 NEW: Pricing Section (INR)
const PricingSection = () => (
    <section id="pricing" style={{ maxWidth: '1200px', margin: '0 auto 200px', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '20px' }}>Investment for <span style={{ color: '#a855f7' }}>Elite</span> Engineers.</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>Transparent pricing designed for every stage of your career.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
                { name: 'Starter', price: 'Free', features: ['Daily Diagnostic Quiz', 'Basic Roadmaps', 'Limited Code Arena'], highlight: false },
                { name: 'Pro-Career', price: '₹799', sub: '/month', features: ['AI Mock Interviews', 'Unlimited Roadmaps', 'Advanced SWOT Analysis', 'Priority Support'], highlight: true },
                { name: 'Elite-Vault', price: '₹1,999', sub: '/month', features: ['1-on-1 AI Mentorship', 'System Design Mastery', 'Mock Referrals', 'Career Accelerator Program'], highlight: false }
            ].map((plan, i) => (
                <div key={i} style={{ 
                    padding: '48px', 
                    background: plan.highlight ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.01)', 
                    borderRadius: '40px', 
                    border: plan.highlight ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    transform: plan.highlight ? 'scale(1.05)' : 'none',
                    zIndex: plan.highlight ? 2 : 1
                }}>
                    {plan.highlight && <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#a855f7', color: 'white', padding: '4px 16px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 950 }}>MOST POPULAR</div>}
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '12px' }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 950 }}>{plan.price}</span>
                        {plan.sub && <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>{plan.sub}</span>}
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        {plan.features.map((feat, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                                <Check size={16} color="#a855f7" />
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{feat}</span>
                            </div>
                        ))}
                    </div>
                    <Link href="/signup" style={{ 
                        display: 'block', 
                        textAlign: 'center', 
                        padding: '16px', 
                        background: plan.highlight ? '#a855f7' : 'rgba(255,255,255,0.05)', 
                        color: plan.highlight ? 'white' : 'rgba(255,255,255,0.8)', 
                        borderRadius: '16px', 
                        textDecoration: 'none', 
                        fontWeight: 950, 
                        fontSize: '0.9rem' 
                    }}>
                        Start Journey
                    </Link>
                </div>
            ))}
        </div>
    </section>
);

// 🔱 NEW: FAQ Section
const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState(0);
    
    const faqs = [
        { q: "How is ProgAce different from LeetCode?", a: "ProgAce isn't just a coding platform; it's a Career Intelligence OS. While LeetCode focuses on problems, we focus on your entire career trajectory, providing diagnostic SWOT analysis, personalized roadmaps, and AI-powered mock interviews that simulate real hiring environments." },
        { q: "Is the AI-powered interview truly voice-capable?", a: "Yes. Our platform uses state-of-the-art speech-to-text and text-to-speech to simulate a real-time conversational interview, giving you feedback on both your tone and technical accuracy." },
        { q: "Can I cancel my subscription at any time?", a: "Absolutely. You maintain full control over your billing and can pause or cancel your subscription at any point from your dashboard." },
        { q: "Do you offer placement assistance?", a: "The 'Elite-Vault' plan includes mock referrals and career accelerator programs that connect our top performers with hiring partners and industry experts." }
    ];

    return (
        <section id="faq" style={{ maxWidth: '800px', margin: '0 auto 200px', padding: '0 40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 950, textAlign: 'center', marginBottom: '60px', letterSpacing: '-0.04em' }}>Questions? <span style={{ color: '#a855f7' }}>Answered.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {faqs.map((faq, i) => (
                    <div key={i} onClick={() => setOpenIndex(i)} style={{ 
                        padding: '24px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: i === openIndex ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '24px', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{faq.q}</h4>
                            {i === openIndex ? <Minus size={20} color="#a855f7" /> : <Plus size={20} color="#888" />}
                        </div>
                        {i === openIndex && (
                            <p style={{ marginTop: '16px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{faq.a}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

// 🔱 NEW: Contact Section
const ContactSection = () => (
    <section id="contact" style={{ maxWidth: '1200px', margin: '0 auto 200px', padding: '0 40px' }}>
        <div style={{ 
            background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(34,211,238,0.1) 100%)', 
            borderRadius: '48px', 
            padding: '80px', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px',
            border: '1px solid rgba(255,255,255,0.05)' 
        }}>
            <div>
                <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '24px', letterSpacing: '-0.04em' }}>Let's talk <br /> <span style={{ color: '#eb4899' }}>Engineering.</span></h2>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '48px' }}>
                    Have questions about our training modules or enterprise solutions? <br />
                    Our technical team is ready to assist.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                        <span style={{ fontWeight: 600 }}>nexus@proace.ai</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} /></div>
                        <span style={{ fontWeight: 600 }}>+91 (011) 4567 8910</span>
                    </div>
                </div>
            </div>
            <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>FULL NAME</label>
                    <input type="text" placeholder="John Engineer" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontWeight: 600 }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>EMAIL ADDRESS</label>
                    <input type="email" placeholder="john@company.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontWeight: 600 }} />
                </div>
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>MESSAGE</label>
                    <textarea rows={4} placeholder="Tell us about your career goals..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontWeight: 600, resize: 'none' }}></textarea>
                </div>
                <button style={{ width: '100%', padding: '18px', background: 'white', color: 'black', borderRadius: '16px', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer' }}>Dispatch Packet</button>
            </div>
        </div>
    </section>
);

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: 'white', overflowX: 'hidden' }}>
      
      {/* 🔱 Navigation Overlay */}
      <header style={{ position: 'fixed', top: 0, width: '100%', height: '80px', zIndex: 1000, background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ width: '40px', height: '40px', background: 'var(--gradient-purple)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles color="white" size={24} />
             </div>
             <span style={{ fontSize: '1.5rem', fontWeight: 950, letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>ProgAce</span>
          </div>
          <nav style={{ display: 'flex', gap: '32px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 600 }}>
             <Link href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Solutions</Link>
             <Link href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Workflow</Link>
             <Link href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
             <Link href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link>
             <Link href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
          </nav>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem' }}>Login</Link>
             <Link href="/signup" style={{ padding: '12px 24px', background: 'white', color: 'black', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 950, textDecoration: 'none', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}>Get Started</Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '180px', position: 'relative' }}>
          
          {/* Background Ambient Glows */}
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: '#a855f7', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', right: '10%', width: '300px', height: '300px', background: '#22d3ee', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }}></div>

          {/* 🔱 HERO: Career Mastery Intelligence */}
          <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', textAlign: 'center', marginBottom: '160px' }}>
             <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '99px', color: '#a855f7', fontSize: '0.8rem', fontWeight: 950, marginBottom: '40px', gap: '8px', alignItems: 'center' }}>
                <Trophy size={14} /> THE NEW STANDARD FOR CAREER INTELLIGENCE
             </div>
             <h1 style={{ fontSize: '6rem', fontWeight: 950, lineHeight: 0.95, letterSpacing: '-0.06em', marginBottom: '32px', fontFamily: 'Outfit' }}>
               Master your <br />
               <span style={{ backgroundImage: 'linear-gradient(to right, #a855f7, #eb4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Path</span> with AI.
             </h1>
             <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 60px', fontWeight: 500 }}>
               ProgAce is your cognitive operating system for mastering technical skills, <br />
               acing interviews, and accelerating your growth as an engineer.
             </p>
             <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link href="/signup" style={{ padding: '20px 48px', background: 'white', color: 'black', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 950, textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 20px 40px rgba(255,255,255,0.1)' }}>
                   Build Your Roadmap <ArrowRight size={20} />
                </Link>
                <button style={{ padding: '20px 48px', background: 'rgba(255,255,255,0.03)', color: 'white', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 950, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                   <Play size={20} color="#a855f7" fill="#a855f7" /> Experience Demo
                </button>
             </div>
          </section>

          {/* 🔱 MOCKUP BENTO GRID (v73.1 - Stripe/Leeco Style) */}
          <section id="features" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', marginBottom: '200px' }}>
             <h2 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '80px', textAlign: 'center' }}>Engineered for <span style={{color: '#a855f7'}}>Elite</span> performance.</h2>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
                
                {/* Interview Mockup Card */}
                <div className="electric-neon-card" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '48px', padding: '60px', overflow: 'hidden', display: 'flex', gap: '60px', alignItems: 'center' }}>
                   <div style={{ flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', background: '#a855f7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                         <Mic2 color="white" />
                      </div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '20px', letterSpacing: '-0.02em' }}>AI Mock Interview Machine</h3>
                      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500 }}>High-fidelity voice and text simulations with real-time feedback on behavioral and technical accuracy.</p>
                   </div>
                   <div style={{ flex: 1, position: 'relative' }}>
                      <MockupInterview />
                   </div>
                </div>

                {/* SWOT IQ Card */}
                <div className="electric-neon-card" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '48px', padding: '60px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                   <div style={{ position: 'relative', height: '200px', display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                      <MockupSWOT />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '20px', letterSpacing: '-0.02em' }}>Performance SWOT IQ</h3>
                      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500 }}>Global benchmarking and diagnostic analysis of your roadmap velocity and arena score.</p>
                   </div>
                </div>

             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' }}>
                
                {/* Path Intelligence Card */}
                <div className="electric-neon-card" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '48px', padding: '60px', overflow: 'hidden' }}>
                    <div style={{ marginBottom: '60px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '20px', letterSpacing: '-0.02em' }}>Path Intelligence</h3>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500 }}>Automated career roadmaps that adapt to your progress and hiring trends.</p>
                    </div>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       {['Junior Engineer', 'System Architect', 'Staff CTO'].map((role, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: i === 1 ? '#a855f7' : '#555' }}>
                              <Layout size={18} />
                              <span style={{ fontSize: '0.9rem', fontWeight: 950 }}>{role}</span>
                              {i === 1 && <span style={{ fontSize: '0.6rem', color: '#a855f7', fontWeight: 950, padding: '2px 6px', border: '1px solid #a855f7', borderRadius: '4px' }}>Target</span>}
                           </div>
                       ))}
                    </div>
                </div>

                {/* Arena Mockup Card */}
                <div className="electric-neon-card" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '48px', padding: '60px', overflow: 'hidden', display: 'flex', gap: '60px', alignItems: 'center' }}>
                   <div style={{ flex: 1, position: 'relative' }}>
                      <MockupArena />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', background: '#22d3ee', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                         <Terminal color="white" />
                      </div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '20px', letterSpacing: '-0.02em' }}>ProgAce Arena Workspace</h3>
                      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500 }}>A high-performance IDE built for competitive problem solving and architectural training.</p>
                   </div>
                </div>
             </div>
          </section>

          <WorkflowSection />
          <PricingSection />
          <FAQSection />
          <ContactSection />

          {/* 🔱 CTA Footer */}
          <section style={{ textAlign: 'center', padding: '160px 40px', background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.05))' }}>
             <h2 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.06em', marginBottom: '40px' }}>The future of engineering is AI-Native.</h2>
             <Link href="/signup" style={{ padding: '24px 64px', background: 'white', color: 'black', borderRadius: '24px', fontSize: '1.2rem', fontWeight: 950, textDecoration: 'none', display: 'inline-flex', gap: '16px', alignItems: 'center' }}>
                Join the ProgAce Community <ChevronRight size={24} />
             </Link>
          </section>

      </main>

      <footer style={{ padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: 600 }}>
         &copy; 2026 ProgAce Career Intelligence. Build the future, or be the future.
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .gradient-text-purple { background: linear-gradient(to right, #a855f7, #6366f1); WebkitBackgroundClip: text; WebkitTextFillColor: transparent; }
        
        .electric-neon-card {
           position: relative;
           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
           border: 1px solid rgba(255,255,255,0.05) !important;
        }

        .electric-neon-card::before {
           content: '';
           position: absolute;
           inset: -1px;
           border-radius: inherit;
           padding: 1px;
           background: linear-gradient(45deg, #f97316, #a855f7, #eb4899);
           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
           mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
           -webkit-mask-composite: xor;
           mask-composite: exclude;
           opacity: 0.2;
           transition: opacity 0.4s ease;
        }

        .electric-neon-card:hover {
           transform: translateY(-8px) scale(1.02);
           box-shadow: 0 10px 40px -10px rgba(168,85,247,0.3), 
                       0 0 20px rgba(249,115,22,0.1), 
                       0 0 40px rgba(235,72,153,0.1);
        }

        .electric-neon-card:hover::before {
           opacity: 1;
        }

        @keyframes breathing-glow {
           0% { box-shadow: 0 0 5px rgba(168,85,247,0.2); }
           50% { box-shadow: 0 0 20px rgba(168,85,247,0.4); }
           100% { box-shadow: 0 0 5px rgba(168,85,247,0.2); }
        }
      `}</style>
    </div>
  );
}

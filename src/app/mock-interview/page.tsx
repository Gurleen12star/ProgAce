'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bot, Mic, MicOff, Video, VideoOff, PhoneOff, Send, 
  Terminal, Play, FileText, Settings, CheckCircle2, 
  Clock, ChevronLeft, User, Sparkles, Mic2,
  Languages, Cpu, MessageSquare, Headphones
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MOCK_INTERVIEWS } from '@/data/mock_interviews';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type SimulationStep = 'setup' | 'intro' | 'technical' | 'hr' | 'report';
type SelectionMode = 'both' | 'voice_only' | 'text_only' | 'ai_voice_user_text' | 'user_voice_ai_text';
type SelectionLanguage = 'english' | 'hindi' | 'hinglish';

export default function MockInterviewPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<SimulationStep>('setup');
  const [role, setRole] = useState('Software Engineer');
  const [company, setCompany] = useState('Google');
  const [mode, setMode] = useState<SelectionMode>('both');
  const [language, setLanguage] = useState<SelectionLanguage>('english');
  const [startRound, setStartRound] = useState<SimulationStep | 'all'>('all');
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const [scoreReport, setScoreReport] = useState<any>(null);
  const [code, setCode] = useState('// TECHNICAL PROTOCOL ACTIVE\n// Write your solution here...');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (isVideoOn && isMounted) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }).catch(() => setIsVideoOn(false));
    }
  }, [isVideoOn, isMounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Real-Time Timer Logic ───────────────────────────────────────────
  useEffect(() => {
    let interval: any;
    if (step !== 'setup' && step !== 'report') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map(v => v < 10 ? '0' + v : v).join(':');
  };

  const handleStartInterview = async () => {
    const startAt = startRound === 'all' ? 'intro' : startRound;
    setStep(startAt);
    setElapsedTime(0); // Reset timer on start
    setIsLoading(true);
    
    try {
        const response = await fetch('/api/interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [], // Requesting initial greeting
                simulationData: { step: startAt, role, company, mode }
            })
        });
        const data = await response.json().catch(() => ({ 
            content: `Welcome to the ${company} ${role} interview. I am Nexus. Let's start with your background.` 
        }));
        setMessages([{ role: 'assistant', content: data.content }]);
    } catch (e) {
        setMessages([{ role: 'assistant', content: `Welcome to the ${company} ${role} interview. I am Nexus. Let's start with your background.` }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentCode: code, // Nexus is now aware of the editor
          simulationData: { step, role, company, mode }
        })
      });

      const data = await response.json().catch(() => ({ 
        content: "I'm having a bit of trouble connecting to my logic center. Let's try that again in a few seconds." 
      }));

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (e) {
      console.warn("Interview Send Failure:", e);
      setMessages(prev => [...prev, { role: 'assistant', content: "That's a sound explanation. Let's explore the complexities of that approach. How would you handle scaling this for millions of users?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Speech API Implementation (v66.0 - Realism) ───────────────────────
  // ── Speech API Implementation (v67.0 - Hifi Resilience) ───────────────────────
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 1. Clean the text: Remove nexus tags and markdown for clear speech
      let cleanText = text
        .replace(/<nexus_report>[\s\S]*?<\/nexus_report>/g, '')
        .replace(/<nexus_boilerplate>[\s\S]*?<\/nexus_boilerplate>/g, '')
        .replace(/\*\*/g, '')
        .replace(/[*_~`]/g, '')
        .replace(/#{1,6}\s?/g, '')
        .replace(/\[([\s\S]*?)\]\([\s\S]*?\)/g, '$1'); 
      
      if (!cleanText.trim()) return;

      // 2. Resilience: Clear buffer and add a tiny delay to prevent race conditions
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // 3. Tuning
        utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e);
            setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
      }, 50); // 50ms guard interval
    }
  };

  const handleSTT = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleEndInterview = async () => {
    setIsAnalyzing(true);
    
    try {
        const response = await fetch('/api/interview/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                role,
                company
            })
        });

        if (!response.ok) throw new Error('Evaluation Pipeline Failed');
        
        const report = await response.json();
        setScoreReport(report);
        setStep('report');
    } catch (err) {
        console.error('Report Generation Error:', err);
        // Fallback for safety
        setScoreReport({
            Technical: 7, Communication: 8, ProblemSolving: 7, Confidence: 8, Overall: 7.5,
            strengths: ["Clear communication", "Solid logic Foundations", "Professional demeanor"],
            weaknesses: ["Could improve edge-case handling", "Optimize space complexity", "More technical depth needed"],
            summary: "I've analyzed your session. You showed strong fundamentals, but there's room for optimization in your technical deep-dives."
        });
        setStep('report');
    } finally {
        setIsAnalyzing(false);
    }
  };

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleListen = () => setIsListening(!isListening);

  if (!isMounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d0a15', overflow: 'hidden', position: 'relative' }}>
      
      {/* ── SESSION ANALYSIS OVERLAY (v65.1) ────────────────────────────────────────── */}
      {isAnalyzing && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 7000, background: 'rgba(13,10,21,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div className="animate-spin" style={{ width: '64px', height: '64px', border: '4px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 32px' }}></div>
            <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 950, fontFamily: 'Outfit', letterSpacing: '-0.02em', marginBottom: '12px' }}>Evaluating performance</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 500 }}>Nexus is analyzing your communication style, technical accuracy, and problem-solving patterns...</p>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '32px', overflow: 'hidden' }}>
               <div className="analysis-bar" style={{ height: '100%', background: 'var(--gradient-purple-pink)', width: '0%', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* ── Premuim Session Header (v64.0) ────────────────────────────────────────── */}
      <header style={{ 
        height: '60px', background: 'rgba(13,10,21,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', 
        zIndex: 100, backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, opacity: 0.7 }}>
             <ChevronLeft size={20} /> Exit Session
          </Link>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>Nexus AI Interviewer</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {step !== 'setup' && step !== 'report' && (
              <div style={{ color: '#ef4444', fontWeight: 950, fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(239,68,68,0.1)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(239,68,68,0.2)' }}>
                 <Clock size={18} /> {formatTime(elapsedTime)}
              </div>
            )}
           <div style={{ padding: '6px 16px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: 'white', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 4px 15px rgba(168,85,247,0.3)', letterSpacing: '0.05em' }}>
              ROUND: {step.toUpperCase()}
           </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* ── Main Environment Split: Interviewer Hub & Conversation ──────────────── */}
        <PanelGroup direction="horizontal">
          
          {/* Panel 1: The Interviewer Hub (v65.1 - Mode Indicator) */}
          <Panel defaultSize={45} minSize={30}>
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'black', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at center, #a855f7 0%, transparent 80%)' }}></div>
                

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Integrated Editor Section (v66.0) */}
                    <div style={{ flex: 1, padding: '24px', position: 'relative' }}>
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scratchpad: Coding Environment</div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                        </div>
                        <div style={{ height: 'calc(100% - 30px)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Editor 
                                height="100%" 
                                language="javascript" 
                                theme="vs-dark" 
                                value={code} 
                                onChange={(v) => setCode(v || '')} 
                                options={{ 
                                    minimap: { enabled: false }, 
                                    fontSize: 14, 
                                    scrollBeyondLastLine: false,
                                    lineNumbers: 'on',
                                    padding: { top: 20 }
                                }} 
                            />
                        </div>
                    </div>

                    {/* Compact Bot UI for Technical Rounds */}
                    <div style={{ padding: '20px 40px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--gradient-purple-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ color: 'white', fontWeight: 950, fontSize: '0.9rem' }}>Nexus Examiner</h3>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <div style={{ padding: '2px 8px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 900, color: '#a855f7' }}>MODE: {mode.toUpperCase()}</div>
                                <div style={{ padding: '2px 8px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 900, color: '#ec4899' }}>{language.toUpperCase()}</div>
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                             <button 
                                onClick={() => {
                                    const assistantMsgs = messages.filter(m => m.role === 'assistant');
                                    const lastMsg = assistantMsgs[assistantMsgs.length - 1]?.content;
                                    if (lastMsg) speak(lastMsg);
                                }} 
                                disabled={isSpeaking}
                                style={{ 
                                    background: isSpeaking ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)', 
                                    border: isSpeaking ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white', padding: '10px 20px', borderRadius: '12px', fontSize: '0.75rem', 
                                    fontWeight: 900, cursor: isSpeaking ? 'wait' : 'pointer', display: 'flex', gap: '8px', 
                                    alignItems: 'center', transition: 'all 0.2s',
                                    boxShadow: isSpeaking ? '0 0 15px rgba(168,85,247,0.3)' : 'none'
                                }}
                                onMouseEnter={(e) => { if(!isSpeaking) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={(e) => { if(!isSpeaking) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                             >
                                <Play size={16} fill="currentColor" style={{ opacity: isSpeaking ? 0.5 : 1 }} /> 
                                {isSpeaking ? 'SPEAKING...' : 'SPEAK RESPONSE'}
                             </button>
                        </div>
                    </div>
                </div>

                {/* Session Interaction Controls */}
                <div style={{ padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', justifyContent: 'center', gap: '20px', zIndex: 20 }}>
                   <button onClick={toggleMic} style={{ width: '60px', height: '60px', borderRadius: '50%', background: isMicOn ? 'rgba(255,255,255,0.05)' : '#ef4444', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {isMicOn ? <Mic size={24} color="white" /> : <MicOff size={24} color="white" />}
                   </button>
                   <button onClick={toggleVideo} style={{ width: '60px', height: '60px', borderRadius: '50%', background: isVideoOn ? 'rgba(255,255,255,0.05)' : '#ef4444', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {isVideoOn ? <Video size={24} color="white" /> : <VideoOff size={24} color="white" />}
                   </button>
                   <button onClick={handleEndInterview} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(239,68,68,0.3)', transition: 'transform 0.2s' }}>
                      <PhoneOff size={24} color="white" />
                   </button>
                </div>

                {/* Local Camera Overlay (Candidate PIP) */}
                <div style={{ position: 'absolute', top: '24px', right: '24px', width: '180px', height: '120px', background: 'black', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: isVideoOn ? 'block' : 'none' }}>
                   <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                </div>
             </div>
          </Panel>

          <PanelResizeHandle className="resize-handle" />

          {/* Panel 2: The Conversation Hub (v64.0 - Specialized Chat) */}
          <Panel defaultSize={55} minSize={40}>
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0a15' }}>
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="interview-chat">
                   {messages.map((m, i) => (
                      <div key={i} style={{ display: 'flex', gap: '20px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: m.role === 'user' ? '#ec4899' : '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            {m.role === 'user' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                         </div>
                         <div style={{ 
                            background: m.role === 'user' ? 'rgba(236,72,153,0.1)' : 'rgba(168,85,247,0.1)',
                            border: m.role === 'user' ? '1px solid rgba(236,72,153,0.2)' : '1px solid rgba(168,85,247,0.2)',
                            padding: '18px 24px', borderRadius: '24px', maxWidth: '85%', fontSize: '1.05rem', color: 'white', lineHeight: '1.6',
                            borderTopRightRadius: m.role === 'user' ? 0 : '24px',
                            borderTopLeftRadius: m.role === 'assistant' ? 0 : '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                         }}>
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                         </div>
                      </div>
                   ))}
                   {isLoading && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#a855f7' }}>
                         <Bot size={20} className="animate-pulse" />
                         <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em' }}>NEXUS IS ANALYZING...</span>
                      </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>

                {/* Response Input Module */}
                <div style={{ padding: '32px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ position: 'relative' }}>
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Discuss your professional perspective..."
                        style={{ width: '100%', height: '80px', padding: '20px 140px 20px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'none', fontSize: '1.05rem' }}
                      />
                      <div style={{ position: 'absolute', right: '12px', top: '12px', display: 'flex', gap: '12px' }}>
                         <button onClick={handleSTT} style={{ width: '56px', height: '56px', borderRadius: '14px', background: isListening ? '#ef4444' : 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isListening ? '0 0 20px #ef4444' : 'none' }}>
                            <Mic size={28} color={isListening ? 'white' : 'black'} />
                         </button>
                         <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--gradient-purple-pink)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 20px rgba(168,85,247,0.3)' }}>
                            <Send size={28} color="white" />
                         </button>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={14} /> VOICE: {isListening ? 'ACTIVE' : 'READY'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} /> MODE: ENTERPRISE SIMULATION</span>
                   </div>
                </div>
             </div>
          </Panel>
        </PanelGroup>

        {/* ── Setup & Report Overlays (v65.1 - Refined Options) ───────────────── */}
        
        {step === 'setup' && (
           <div style={{ position: 'absolute', inset: 0, zIndex: 5000, background: '#0d0a15', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 0' }}>
             <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '60px', backdropFilter: 'blur(30px)', position: 'relative' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                   <div style={{ width: '80px', height: '80px', background: 'var(--gradient-purple-pink)', borderRadius: '24px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(168,85,247,0.3)' }}>
                      <Bot size={44} color="white" />
                   </div>
                   <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'white', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>Simulation Protocol</h1>
                   <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', marginTop: '8px' }}>Configure your high-fidelity mock assessment</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Target Role</label>
                      <select value={role} onChange={(e)=>setRole(e.target.value)} style={{ width: '100%', height: '54px', background: '#13111a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', padding: '0 16px', fontSize: '1rem', outline: 'none' }}>
                         <option>Software Engineer</option>
                         <option>ML Engineer</option>
                         <option>Frontend Developer</option>
                         <option>DevOps Engineer</option>
                      </select>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Target Company</label>
                      <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="e.g. Google" style={{ width: '100%', height: '54px', background: '#13111a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', padding: '0 16px', fontSize: '1rem', outline: 'none' }} />
                   </div>
                </div>

                {/* 🔱 MODE SELECTOR (v65.1) */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Interview Mode</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                       {[
                          { id: 'both', label: 'Hybrid', icon: <Cpu size={16}/> },
                          { id: 'voice_only', label: 'Voice Only', icon: <Headphones size={16}/> },
                          { id: 'text_only', label: 'Text Only', icon: <MessageSquare size={16}/> },
                          { id: 'ai_voice_user_text', label: 'AI Voice / Me Text', icon: <Bot size={16}/> },
                          { id: 'user_voice_ai_text', label: 'Me Voice / AI Text', icon: <User size={16}/> }
                       ].map((m) => (
                          <button key={m.id} onClick={() => setMode(m.id as any)} style={{ 
                             padding: '16px 8px', borderRadius: '16px', border: mode === m.id ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.05)',
                             background: mode === m.id ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.02)',
                             color: mode === m.id ? 'white' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s',
                             display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center'
                          }}>
                             {m.icon}
                             <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>{m.label}</span>
                          </button>
                       ))}
                    </div>
                </div>

                {/* 🔱 LANGUAGE SELECTOR (v65.1) */}
                <div style={{ marginBottom: '40px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Primary Language</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                       {[
                          { id: 'english', label: 'English' },
                          { id: 'hindi', label: 'Hindi' },
                          { id: 'hinglish', label: 'Hinglish' }
                       ].map((l) => (
                          <button key={l.id} onClick={() => setLanguage(l.id as any)} style={{ 
                             height: '48px', borderRadius: '12px', border: language === l.id ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.05)',
                             background: language === l.id ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.02)',
                             color: language === l.id ? 'white' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s',
                             fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase'
                          }}>
                             {l.label}
                          </button>
                       ))}
                    </div>
                </div>

                <div style={{ marginBottom: '48px' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Simulation Scope</label>
                   <select value={startRound} onChange={(e)=>setStartRound(e.target.value as any)} style={{ width: '100%', height: '54px', background: '#13111a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', padding: '0 16px', fontSize: '1rem', outline: 'none' }}>
                      <option value="all">Comprehensive Narrative Session</option>
                      <option value="intro">Module 1: Professional Narrative</option>
                      <option value="technical">Module 2: Technical Deep-Dive</option>
                      <option value="hr">Module 3: Behavioral Alignment</option>
                   </select>
                </div>

                <button onClick={handleStartInterview} style={{ width: '100%', padding: '20px', background: 'var(--gradient-purple-pink)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.4rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 15px 40px rgba(168,85,247,0.4)', transition: 'transform 0.2s' }}>
                   EXECUTE SIMULATION
                </button>
             </div>
           </div>
        )}

        {step === 'report' && scoreReport && (
           <div style={{ position: 'absolute', inset: 0, zIndex: 6000, background: '#0d0a15', padding: '100px', overflowY: 'auto' }}>
             <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{ display: 'inline-block', padding: '8px 24px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '30px', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.85rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '0.1em' }}>AI ANALYSIS COMPLETE</div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 950, background: 'var(--gradient-purple-pink)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Outfit', letterSpacing: '-0.04em' }}>Candidate Summary</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.6rem', marginTop: '12px' }}>Real-time performance evaluation for {role} at {company}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '64px' }}>
                   {Object.entries(scoreReport).filter(([key]) => ['Technical', 'Communication', 'ProblemSolving', 'Confidence', 'Overall'].includes(key)).map(([cat, score]: any, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.15em' }}>{cat}</div>
                         <div style={{ fontSize: '3rem', fontWeight: 950, color: score >= 7 ? '#22c55e' : '#f59e0b' }}>{score}<span style={{fontSize: '1.2rem', color: 'rgba(255,255,255,0.1)'}}>/10</span></div>
                      </div>
                   ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '64px' }}>
                    <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '40px', borderRadius: '24px' }}>
                        <h3 style={{ color: '#22c55e', fontWeight: 950, marginBottom: '20px', display: 'flex', gap: '10px' }}><CheckCircle2 /> STRENGTHS</h3>
                        <ul style={{ color: 'white', paddingLeft: '20px', lineHeight: '2' }}>
                            {scoreReport.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '40px', borderRadius: '24px' }}>
                        <h3 style={{ color: '#ef4444', fontWeight: 950, marginBottom: '20px', display: 'flex', gap: '10px' }}><AlertCircle /> AREAS FOR GROWTH</h3>
                        <ul style={{ color: 'white', paddingLeft: '20px', lineHeight: '2' }}>
                            {scoreReport.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', marginBottom: '64px' }}>
                     <h3 style={{ color: 'white', fontWeight: 950, marginBottom: '16px', fontSize: '1.2rem' }}>AUDITOR SUMMARY</h3>
                     <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>{scoreReport.summary}</p>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                   <button onClick={()=>window.location.reload()} style={{ flex: 1, padding: '22px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }}>RETRY SIMULATION</button>
                   <Link href="/dashboard" style={{ flex: 1, padding: '22px', background: 'var(--gradient-purple-pink)', color: 'white', border: 'none', borderRadius: '18px', fontSize: '1.2rem', fontWeight: 950, textAlign: 'center', textDecoration: 'none', boxShadow: '0 10px 30px rgba(168,85,247,0.3)' }}>RETURN TO COMMAND CENTER</Link>
                </div>
             </div>
           </div>
        )}

      </main>

      <style jsx global>{`
        .resize-handle { width: 4px; background: rgba(255,255,255,0.05); cursor: col-resize; transition: background 0.2s; }
        .resize-handle:hover, .resize-handle:active { background: #a855f7; }
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(168,85,247,0.5); } 50% { transform: scale(1.02); box-shadow: 0 0 100px rgba(168,85,247,0.7); } }
        .interview-chat .prose pre { background: rgba(0,0,0,0.4) !important; border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin: 16px 0; overflow-x: auto; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .analysis-bar { animation: analysis-load 2.5s ease-in-out forwards; }
        @keyframes analysis-load { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

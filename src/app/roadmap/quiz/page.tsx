'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'SDE';
  const focus = searchParams.get('focus') || 'General';

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => { generateExam(); }, []);

  useEffect(() => {
    if (timeLeft > 0 && !finished && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !finished) { handleFinish(); }
  }, [timeLeft, finished, loading]);

  useEffect(() => {
    if (finished) {
       let start = 0;
       const duration = 1500;
       const interval = 20;
       const increment = Math.max(0.1, score / (duration / interval));
       const timer = setInterval(() => {
          start += increment;
          if (start >= score) { setDisplayScore(score); clearInterval(timer); } 
          else { setDisplayScore(Math.floor(start)); }
       }, interval);
       return () => clearInterval(timer);
    }
  }, [finished, score]);

  const generateExam = async () => {
     try {
       setLoading(true);
       const res = await fetch('/api/roadmap/quiz/generate', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, focus, goal: `Strategic ${role} - ${focus} Mastery` }) 
       });
       if (!res.ok) throw new Error('API_LOAD_FAIL');
       const data = await res.json();
       const fetchedQuestions = data.questions || [];
       setQuestions(fetchedQuestions);
       setUserAnswers(new Array(fetchedQuestions.length).fill(null));
       setFlagged(new Array(fetchedQuestions.length).fill(false));
     } catch (err) { 
        console.error(err);
        const fallbackQs = [
          { id: 1, question: "What is the time complexity of a Linear Search in an array of size N?", options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], correctAnswer: 2 },
          { id: 2, question: "Which data structure follows the LIFO (Last In First Out) principle?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correctAnswer: 1 },
          { id: 3, question: "What is the average case complexity of Quick Sort?", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], correctAnswer: 1 },
          { id: 4, question: "In a balanced BST like AVL, what is the maximum height?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctAnswer: 1 },
          { id: 5, question: "Which algorithm is used to find the shortest path in a weighted graph with no negative edges?", options: ["BFS", "DFS", "Dijkstra", "Kruskal"], correctAnswer: 2 }
        ];
        setQuestions(fallbackQs);
        setUserAnswers(new Array(fallbackQs.length).fill(null));
        setFlagged(new Array(fallbackQs.length).fill(false));
     } finally { setLoading(false); }
  };

  const handleSelectOption = (idx: number) => {
    if (finished || userAnswers[currentIdx] !== null) return;
    setSelectedAns(idx);
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = idx;
    setUserAnswers(newAnswers);

    // Auto-advance after a short delay
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAns(userAnswers[currentIdx + 1]);
    } else { handleFinish(); }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedAns(userAnswers[currentIdx - 1]);
    }
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentIdx] = !newFlagged[currentIdx];
    setFlagged(newFlagged);
  };

  const handleFinish = () => {
    let tempScore = 0;
    questions.forEach((q, i) => { if (userAnswers[i] === q.correctAnswer) tempScore++; });
    setScore(tempScore);
    setFinished(true);
  };

  if (loading) {
     return (
       <div className="masterpiece-splash">
         <div className="nebula-bg"></div>
         <div className="loader-pod glass shadow-extreme message-fade-in">
            <div className="neural-node"></div>
            <h1 className="l-txt">SYNCING <span className="pink-glow">PROGACE</span></h1>
            <div className="prog-track"><div className="prog-fill"></div></div>
            <p className="l-sub">DIAGNOSTIC_INIT_PA-9421</p>
         </div>
         <style jsx>{`
            .masterpiece-splash { min-height: 100vh; background: #050308; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; }
            .nebula-bg { position: fixed; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 70%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 70%); filter: blur(40px); opacity: 0.5; }
            .loader-pod { width: 340px; padding: 60px 40px; text-align: center; border-radius: 40px; position: relative; z-index: 10; border: 1px solid rgba(255,255,255,0.05); }
            .neural-node { width: 50px; height: 50px; background: #a855f7; border-radius: 16px; margin: 0 auto 30px; animation: nodePulse 2s infinite ease-in-out; box-shadow: 0 0 40px rgba(168, 85, 247, 0.5); }
            @keyframes nodePulse { 0%, 100% { transform: scale(1) rotate(0deg); border-radius: 16px; } 50% { transform: scale(1.15) rotate(180deg); border-radius: 50%; opacity: 0.6; } }
            .l-txt { font-size: 1.1rem; font-weight: 900; letter-spacing: 0.2rem; color: #fff; margin-bottom: 30px; }
            .pink-glow { color: #ec4899; text-shadow: 0 0 15px rgba(236, 72, 153, 0.5); }
            .prog-track { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 20px; }
            .prog-fill { width: 100%; height: 100%; background: #a855f7; animation: loadProg 4s infinite linear; transform-origin: left; }
            @keyframes loadProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
            .l-sub { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.3); letter-spacing: 0.1rem; }
            .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); }
            .shadow-extreme { box-shadow: 0 80px 150px -50px rgba(0, 0, 0, 1); }
            .message-fade-in { animation: flowUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes flowUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
         `}</style>
       </div>
     );
  }

  return (
    <div className="obsidian-app">
       <div className="nebula-atmos"></div>
       <div className="neural-particles">
          {[...Array(15)].map((_, i) => <div key={i} className="particle"></div>)}
       </div>

       {/* 🔝 Masterpiece HUD Header */}
       <header className="master-hud">
          <Link href="/" className="hud-brand">
             <img src="/logo.png" alt="P" className="brand-icon" />
             <div className="brand-stack">
                <span className="brand-h1">ProgAce <span className="p-accent">A.I.</span></span>
                <span className="brand-st">COMMAND_CHAMBER_v4.2</span>
             </div>
          </Link>

          <div className="hud-metrics">
             <div className="metric-box">
                <span className="m-label">CADENCE :</span>
                <span className="m-val pulse-cyan">STABLE</span>
             </div>
             <div className="metric-box timer">
                <span className="m-label">EXPIRE :</span>
                <span className={`m-val ${timeLeft < 180 ? 'critical' : ''}`}>
                   {Math.floor(timeLeft/60)}:{ (timeLeft%60).toString().padStart(2, '0') }
                </span>
             </div>
          </div>
       </header>

       <main className="master-body">
         {!finished ? (
           <div className="master-layout">
              
              <div className="stage-scroller message-fade-in">
                 <div className="stage-content">
                    <div className="q-badge">MODULE_0{currentIdx + 1} // SECURE_STATUS: PENDING</div>
                    <h2 className="q-heading">{questions[currentIdx]?.question}</h2>
                    
                    <div className="hologram-options">
                       {questions[currentIdx]?.options?.map((opt: string, i: number) => {
                         const isAnswered = userAnswers[currentIdx] !== null;
                         const isSelected = userAnswers[currentIdx] === i;
                         const isCorrect = questions[currentIdx].correctAnswer === i;
                         let statusClass = '';
                         if (isAnswered) {
                            if (isSelected) statusClass = isCorrect ? 'correct' : 'incorrect';
                            else if (isCorrect) statusClass = 'correct';
                         } else if (isSelected) {
                            statusClass = 'selected';
                         }
                         
                         return (
                           <button key={i} onClick={() => handleSelectOption(i)} className={`h-opt ${statusClass}`}>
                              <div className="scan-line"></div>
                              <div className="opt-meta">{String.fromCharCode(65 + i)}</div>
                              <span className="opt-text">{opt}</span>
                           </button>
                         );
                       })}
                    </div>
                 </div>
              </div>

              <aside className="hub-sidebar">
                 <div className="hub-glass glass shadow-extreme">
                    <div className="profile-hero">
                       <div className="avatar-capsule">
                          <img src="/logo.png" alt="U" />
                          <div className="halo"></div>
                       </div>
                       <h3>CANDIDATE_#421</h3>
                       <div className="hero-status">DIAGNOSTIC_ACTIVE</div>
                    </div>

                    <div className="hub-section-title">NEURAL_CIRCUIT_MAP</div>
                    <div className="circuit-hub">
                       {questions.map((_, i) => (
                         <div key={i} className={`hub-node ${i === currentIdx ? 'active' : ''} ${userAnswers[i] !== null ? 'secured' : ''} ${flagged[i] ? 'anom' : ''}`} onClick={() => { setCurrentIdx(i); setSelectedAns(userAnswers[i]); }}>
                            <div className="node-inner">{i + 1}</div>
                            {i < questions.length - 1 && <div className="node-path"></div>}
                         </div>
                       ))}
                    </div>

                    <div className="hub-legend">
                       <div className="lg-row">
                          <img src="/logo.png" alt="" className="lg-icon s" />
                          ATTEMPTED
                       </div>
                       <div className="lg-row">
                          <img src="/logo.png" alt="" className="lg-icon p" />
                          NOT ATTEMPTED
                       </div>
                    </div>

                    <button onClick={handleFinish} className="hub-submit-btn">PRODUCE_REPORT</button>
                 </div>
              </aside>

           </div>
         ) : (
           <div className="victory-suite message-fade-in">
              <div className="victory-card glass shadow-extreme">
                 <div className="v-icon">⚡</div>
                 <h1 className="v-h1">Diagnostic <span className="pink-glow">Complete</span></h1>
                 <p className="v-p">Your developer profile has been generated in the cloud.</p>
                 
                 <div className="v-orb-container">
                    <div className="v-orb" style={{ background: `conic-gradient(#a855f7 ${(score/questions.length)*360}deg, rgba(255,255,255,0.02) 0deg)` }}>
                       <div className="v-orb-core">
                          <span className="v-score">{displayScore}</span>
                          <span className="v-tot">/ {questions.length}</span>
                       </div>
                    </div>
                 </div>

                 <div className="v-actions">
                    <button onClick={() => setShowReview(!showReview)} className="m-btn secondary">VIEW_LOGS</button>
                                         <button onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('score', score.toString());
                        router.push(`/roadmap?${params.toString()}`);
                     }} className="m-btn primary">SYNC_TO_ROADMAP</button>

                 </div>

                 {showReview && (
                   <div className="review-hub message-fade-in">
                      {questions.map((q, idx) => (
                        <div key={idx} className="rev-box glass">
                           <p className="rev-qh">[{idx+1}] {q.question}</p>
                           <div className="rev-grid">
                              {q.options.map((opt: string, i: number) => {
                                const isCorrect = q.correctAnswer === i;
                                const isUser = userAnswers[idx] === i;
                                return (
                                  <div key={i} className={`rev-o ${isCorrect ? 'cor' : isUser ? 'err' : ''}`}>
                                     {opt} {isCorrect && <span className="v-lbl">VALIDATED</span>}
                                  </div>
                                );
                              })}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
         )}
       </main>

       {/* ⚓ Grounded Glass Control Bar */}
       {!finished && (
         <footer className="master-footer">
            <div className="footer-content">
               <div className="footer-left">
                  <button onClick={handlePrev} disabled={currentIdx === 0} className="nav-btn-sec">
                     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 10H5M10 15l-5-5 5-5"/></svg>
                     <span>PREVIOUS</span>
                  </button>
               </div>

               <div className="footer-center">
                  <div className="telemetry-pill glass">
                     <span className="t-id">PA-MODULE // 0{currentIdx + 1}</span>
                     <label className="flag-label">
                        <input type="checkbox" checked={flagged[currentIdx]} onChange={toggleFlag} />
                        <div className="flag-dot"></div>
                        FLAG
                     </label>
                  </div>
               </div>

               <div className="footer-right">
                  {currentIdx === questions.length - 1 && (
                     <button onClick={handleFinish} className="nav-btn-pri">
                        SUBMIT_EXAM
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 10h10M10 5l5 5-5 5"/></svg>
                     </button>
                  )}
                  {currentIdx < questions.length - 1 && (
                     <button onClick={handleFinish} className="nav-btn-alt">
                        SUBMIT_NOW
                     </button>
                  )}
               </div>
            </div>
         </footer>
       )}

       <style jsx global>{`
          .obsidian-app { display: flex; flex-direction: column; height: 100vh; background: #050308; color: white; font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; }
          
          /* 🌌 Atmosphere */
          .nebula-atmos { position: fixed; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.12) 0%, transparent 60%); z-index: 1; pointer-events: none; mix-blend-mode: screen; filter: blur(60px); }
          .neural-particles { position: absolute; width: 100%; height: 100%; z-index: 2; pointer-events: none; opacity: 0.15; }
          .particle { position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%; animation: pulseOpacity 5s infinite; }
          @keyframes pulseOpacity { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 0.5; transform: scale(1.5); } }
          ${[...Array(15)].map((_, i) => `.particle:nth-child(${i+1}) { top: ${(i * 17) % 100}%; left: ${(i * 23) % 100}%; animation-delay: ${(i * 0.7) % 5}s; }`).join('')}

          /* 🔝 Elite HUD Header */
          .master-hud { flex-shrink: 0; height: 50px; padding: 0 30px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.04); background: rgba(5, 3, 8, 0.85); backdrop-filter: blur(40px); z-index: 1000; }
          .hud-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
          .brand-icon { width: 24px; height: 24px; filter: drop-shadow(0 0 10px #a855f7); }
          .brand-h1 { font-size: 1.1rem; font-weight: 900; letter-spacing: -0.01em; color: #fff; }
          .p-accent { background: linear-gradient(135deg, #ec4899, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .brand-st { font-size: 0.5rem; font-weight: 800; color: rgba(255,255,255,0.25); letter-spacing: 0.15rem; margin-top: 2px; display: block; }
          
          .hud-metrics { display: flex; gap: 24px; }
          .metric-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 18px; border-radius: 12px; display: flex; gap: 10px; align-items: center; }
          .m-label { font-size: 0.55rem; font-weight: 900; color: rgba(255,255,255,0.2); letter-spacing: 0.1rem; }
          .m-val { font-size: 0.95rem; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; }
          .pulse-cyan { color: #22d3ee; animation: cyanGlow 2s infinite; }
          @keyframes cyanGlow { 50% { opacity: 0.5; text-shadow: 0 0 10px #22d3ee; } }
          .critical { color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }

          /* 🧪 Exam Main Body */
          .master-body { flex: 1; overflow: hidden; position: relative; z-index: 10; }
          .master-layout { display: grid; grid-template-columns: 1fr 360px; height: 100%; gap: 20px; }
          
          .stage-scroller { padding: 15px 40px; overflow-y: auto; height: 100%; scrollbar-width: none; }
          .stage-scroller::-webkit-scrollbar { display: none; }
          .stage-content { max-width: 800px; margin: 0 auto; }
          .q-badge { font-size: 0.5rem; font-weight: 900; color: #ec4899; opacity: 0.8; letter-spacing: 0.1rem; margin-bottom: 8px; }
          .q-heading { font-size: 1.1rem; font-weight: 700; line-height: 1.3; margin-bottom: 20px; color: #fff; }
          
          .hologram-options { display: grid; gap: 8px; }
          .h-opt { padding: 10px 20px; background: rgba(255, 255, 255, 0.012); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; text-align: left; color: white; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; gap: 14px; align-items: center; position: relative; overflow: hidden; width: 100%; }
          .h-opt:hover { background: rgba(168, 85, 247, 0.04); border-color: rgba(168, 85, 247, 0.2); transform: translateX(8px); }
          .h-opt.selected { background: rgba(168, 85, 247, 0.08); border-color: #a855f7; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
          .h-opt.correct { background: rgba(34, 197, 94, 0.1); border-color: #22c55e; box-shadow: 0 10px 40px rgba(34, 197, 94, 0.2); }
          .h-opt.incorrect { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; box-shadow: 0 10px 40px rgba(239, 68, 68, 0.2); }
          .scan-line { position: absolute; top: -100%; left: 0; width: 100%; height: 40px; background: linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.1), transparent); animation: scanLoop 4s infinite linear; pointer-events: none; }
          @keyframes scanLoop { to { top: 200%; } }
          
          .opt-meta { width: 32px; height: 32px; border-radius: 10px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; color: rgba(255,255,255,0.25); flex-shrink: 0; }
          .selected .opt-meta { background: #a855f7; color: white; box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
          .correct .opt-meta { background: #22c55e; color: white; box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          .incorrect .opt-meta { background: #ef4444; color: white; box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          .opt-text { font-size: 0.95rem; font-weight: 500; opacity: 0.7; }
          .selected .opt-text, .correct .opt-text, .incorrect .opt-text { opacity: 1; font-weight: 700; }

          /* 📊 Circuit Hub Sidebar */
          .hub-sidebar { padding: 30px; overflow: hidden; height: 100%; }
          .hub-glass { padding: 40px 35px; border-radius: 40px; height: 100%; display: flex; flex-direction: column; overflow-y: auto; scrollbar-width: none; border: 1px solid rgba(255,255,255,0.05); }
          .hub-glass::-webkit-scrollbar { display: none; }
          .profile-hero { text-align: center; margin-bottom: 25px; }
          .avatar-capsule { width: 70px; height: 70px; margin: 0 auto 12px; position: relative; border-radius: 24px; border: 1.5px solid rgba(168, 85, 247, 0.2); padding: 8px; }
          .avatar-capsule img { width: 100%; height: 100%; object-fit: contain; }
          .halo { position: absolute; inset: -4px; border: 2px solid #a855f7; border-radius: inherit; animation: haloPulse 3s infinite; }
          @keyframes haloPulse { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.3); } }
          .hero-status { font-size: 0.5rem; font-weight: 900; color: #22d3ee; opacity: 0.6; letter-spacing: 0.15rem; margin-top: 4px; }

          .hub-section-title { font-size: 0.55rem; font-weight: 900; color: rgba(255,255,255,0.2); letter-spacing: 0.2rem; margin-bottom: 12px; text-align: center; }
          .circuit-hub { display: flex; flex-direction: row; gap: 8px; margin-bottom: 25px; justify-content: center; align-items: center; }
          .hub-node { position: relative; width: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
          .node-inner { width: 34px; height: 34px; border-radius: 10px; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; color: rgba(255,255,255,0.1); transition: 0.3s; z-index: 2; }
          .node-path { position: absolute; left: 34px; top: 50%; width: 12px; height: 1px; background: rgba(255,255,255,0.05); z-index: 1; transform: translateY(-50%); }
          .hub-node.active .node-inner { border-color: #22d3ee; color: #22d3ee; background: rgba(34, 211, 238, 0.05); transform: scale(1.1); box-shadow: 0 0 15px rgba(34, 211, 238, 0.2); }
          .hub-node.secured .node-inner { background: #2563eb; border-color: transparent; color: white; box-shadow: 0 0 25px rgba(37, 99, 235, 0.4); }
          .hub-node.secured .node-path { background: #2563eb; opacity: 0.4; }

          .hub-submit-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #a855f7, #ec4899); border: none; border-radius: 16px; color: white; font-weight: 900; letter-spacing: 0.1rem; font-size: 0.8rem; cursor: pointer; transition: 0.4s; margin-top: auto; box-shadow: 0 15px 40px rgba(168, 85, 247, 0.3); }
          .hub-submit-btn:hover { transform: translateY(-5px); filter: brightness(1.1); box-shadow: 0 25px 60px rgba(236, 72, 153, 0.4); }

          /* ⚓ Grounded Footer Bar */
          .master-footer { position: fixed; bottom: 0; left: 0; width: 100%; height: 60px; background: rgba(10, 8, 15, 0.95); backdrop-filter: blur(40px); border-top: 1px solid rgba(255, 255, 255, 0.05); z-index: 2000; padding: 0 30px; }
          .footer-content { max-width: 1200px; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: space-between; }
          
          .nav-btn-sec { background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; color: rgba(255,255,255,0.4); font-size: 0.7rem; font-weight: 800; display: flex; gap: 10px; align-items: center; cursor: pointer; transition: 0.3s; }
          .nav-btn-sec:hover:not(:disabled) { border-color: #fff; color: #fff; }
          .nav-btn-sec:disabled { opacity: 0.1; cursor: default; }

          .telemetry-pill { padding: 6px 16px; border-radius: 20px; display: flex; gap: 16px; align-items: center; border: 1px solid rgba(255,255,255,0.04); }
          .t-id { font-size: 0.55rem; font-weight: 900; color: rgba(255,255,255,0.2); letter-spacing: 0.1rem; }
          .flag-label { display: flex; align-items: center; gap: 6px; font-size: 0.55rem; font-weight: 900; color: #ec4899; cursor: pointer; }
          .flag-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.1); }
          input:checked + .flag-dot { background: #ec4899; box-shadow: 0 0 10px #ec4899; }

          .footer-right { display: flex; gap: 12px; }
          .nav-btn-pri { background: #22d3ee; color: #050308; padding: 8px 24px; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 950; display: flex; gap: 10px; align-items: center; cursor: pointer; transition: 0.3s; }
          .nav-btn-pri:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34, 211, 238, 0.3); }
          .nav-btn-alt { background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2); padding: 8px 16px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
          .nav-btn-alt:hover { background: #a855f7; color: white; }

          /* 🏆 Victory Masterpiece */
          .victory-suite { max-width: 700px; margin: 20px auto; padding-bottom: 60px; }
          .victory-card { padding: 40px 40px; text-align: center; border-radius: 32px; border: 1px solid rgba(255,255,255,0.05); }
          .v-icon { font-size: 2.5rem; color: #fbbf24; margin-bottom: 20px; filter: drop-shadow(0 0 15px #fbbf24); }
          .v-h1 { font-size: 2rem; font-weight: 900; margin-bottom: 10px; }
          .v-p { font-size: 0.9rem; opacity: 0.6; }
          
          .v-orb-container { margin: 30px 0; }
          .v-orb { width: 150px; height: 150px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; position: relative; }
          .v-orb-core { width: 135px; height: 135px; background: #050308; border-radius: 50%; display: flex; align-items: baseline; justify-content: center; gap: 4px; padding-top: 35px; box-shadow: inset 0 0 30px rgba(0,0,0,1); z-index: 2; }
          .v-score { font-size: 4rem; font-weight: 900; color: #fff; text-shadow: 0 0 25px rgba(168, 85, 247, 0.6); }
          .v-tot { font-size: 1.2rem; font-weight: 800; opacity: 0.15; }

          .v-actions { display: flex; justify-content: center; gap: 12px; margin-top: 15px; }
          .m-btn { padding: 12px 24px; border-radius: 12px; font-weight: 900; font-size: 0.8rem; cursor: pointer; transition: 0.3s; }
          .m-btn.primary { background: #22d3ee; border: none; color: #050308; box-shadow: 0 10px 30px rgba(34, 211, 238, 0.3); }
          .m-btn.secondary { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }

          .review-hub { margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; padding-right: 10px; }
          .review-hub::-webkit-scrollbar { width: 4px; }
          .review-hub::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
          .review-hub::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
          
          .rev-box { margin-top: 8px; padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); background: rgba(255,255,255,0.01); }
          .rev-qh { font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; }
          .rev-grid { display: grid; gap: 6px; }
          .rev-o { font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.4); }
          .rev-o.cor { background: rgba(34, 197, 94, 0.05); border-color: #22c55e; color: #4ade80; }
          .v-lbl { font-size: 0.6rem; font-weight: 900; float: right; margin-top: 2px; }

          /* ✨ Global Effects */
          .glass { background: rgba(255, 255, 255, 0.015); backdrop-filter: blur(40px); }
          .shadow-extreme { box-shadow: 0 80px 150px -50px rgba(0, 0, 0, 1); }
          .shadow-box { box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 1); }
          .message-fade-in { animation: masterpieceSlide 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes masterpieceSlide { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
          .glass:hover { border-color: rgba(255, 255, 255, 0.08); }
       `}</style>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading Diagnostic Chamber...</div>}>
      <QuizContent />
    </Suspense>
  );
}

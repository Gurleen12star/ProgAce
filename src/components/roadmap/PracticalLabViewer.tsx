'use client';
import React, { useState } from 'react';

interface PracticalLabViewerProps {
  topic: string;
  tasks: string[];
  colabUrl: string;
  solution?: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export default function PracticalLabViewer({ topic, tasks, colabUrl, solution, onClose, onComplete }: PracticalLabViewerProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState<null | 'success' | 'fail'>(null);
  const [viewingSolution, setViewingSolution] = useState(false);

  const toggleTask = (index: number) => {
    const next = new Set(completedTasks);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedTasks(next);
  };

  const handleSubmitValue = (value: boolean) => {
    if (value && completedTasks.size === tasks.length) {
      setShowResult('success');
    } else {
      setShowResult('fail');
    }
  };

  const handleFinish = () => {
    const score = showResult === 'success' ? 100 : 0;
    onComplete(score);
    onClose();
  };

  return (
    <div className="lab-overlay">
      <div className="lab-card message-fade-in">
        <div className="lab-header">
          <div>
            <h2 className="lab-title">{topic}: Practical Mission</h2>
            <p className="lab-subtitle">Step 01: Open Colab → Step 02: Implement → Step 03: Verify below</p>
          </div>
          <button onClick={onClose} className="lab-close">✕</button>
        </div>

        <div className="lab-content">
          <a 
            href={colabUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`colab-cta-box ${colabUrl.includes('leetcode') ? 'leetcode' : colabUrl.includes('geeksforgeeks') ? 'gfg' : colabUrl.includes('docker') ? 'docker' : colabUrl.includes('godbolt') ? 'godbolt' : ''}`}
            style={{ textDecoration: 'none', display: 'flex' }}
          >
            <div className="colab-icon">
              {colabUrl.includes('leetcode') ? '⚡' : 
               colabUrl.includes('geeksforgeeks') ? '💡' : 
               colabUrl.includes('docker') ? '🐳' : 
               colabUrl.includes('godbolt') ? '⚙️' : 
               '🔬'}
            </div>
            <div className="colab-text-box">
              <div className="colab-label">EXTERNAL ENVIRONMENT</div>
              <div className="colab-link-name">
                {colabUrl.includes('leetcode') ? 'Solve on LeetCode' : 
                 colabUrl.includes('geeksforgeeks') ? 'Solve on GeeksForGeeks' : 
                 colabUrl.includes('docker') ? 'Open Docker Lab / Hub' :
                 colabUrl.includes('godbolt') ? 'Compiler Explorer (Godbolt)' :
                 'Open Interactive Sandbox'}
              </div>
              <div className="colab-hint">
                {colabUrl.includes('leetcode') || colabUrl.includes('geeksforgeeks') 
                  ? 'Submit your achievement on the external platform and verify below.' 
                  : colabUrl.includes('docker')
                  ? 'Set up your container environment and verify implementation below.'
                  : 'Implement the mission-critical systems requested in the tasks below.'}
              </div>
            </div>
            <div className="colab-arrow">→</div>
          </a>

          <div className="task-section">
            <h3 className="section-title">DAILY MISSION TASKS</h3>
            <div className="tasks-grid">
              {(tasks && tasks.length > 0 ? tasks : ['Implement logic from scratch', 'Optimize for time complexity']).map((task, i) => (
                <div key={i} className={`task-item ${completedTasks.has(i) ? 'completed' : ''}`} onClick={() => toggleTask(i)}>
                  <div className="task-checkbox">
                    {completedTasks.has(i) ? '✓' : ''}
                  </div>
                  <div className="task-text">{task}</div>
                </div>
              ))}
            </div>
          </div>

          {!showResult ? (
            <div className="decision-section">
              <h3 className="decision-title">WERE YOU ABLE TO SOLVE BOTH?</h3>
              <div className="decision-grid">
                <button 
                  onClick={() => handleSubmitValue(true)} 
                  className="decision-btn success"
                >
                  <span className="btn-icon">🏆</span>
                  <span className="btn-text">YES, MASTERED IT</span>
                </button>
                <button 
                  onClick={() => handleSubmitValue(false)} 
                  className="decision-btn fail"
                >
                  <span className="btn-icon">💡</span>
                  <span className="btn-text">NEED SOLUTION</span>
                </button>
              </div>
            </div>
          ) : showResult === 'success' ? (
            <div className="result-box success message-fade-in">
              <div className="result-icon">✨ CONGO! ✨</div>
              <h4 className="result-title">You've unlocked this skill!</h4>
              <p className="result-desc">Expert-level implementation verified. Keep building this momentum.</p>
              <button onClick={handleFinish} className="lab-finish-btn">PROCEED TO NEXT MISSION</button>
            </div>
          ) : (
            <div className="result-box fail message-fade-in">
              <div className="result-icon">🎯 FOCUS</div>
              <h4 className="result-title">Practical logic is tough.</h4>
              <p className="result-desc">Don't worry, even senior engineers use references. Check the solution below.</p>
              
              {!viewingSolution ? (
                <button onClick={() => setViewingSolution(true)} className="lab-solution-btn">VIEW EXPERT SOLUTION</button>
              ) : (
                <div className="solution-content message-fade-in">
                  <div className="solution-header">EXPERT IMPLEMENTATION GUIDE</div>
                  <pre className="solution-pre">
                    {solution || `// Expert Logic Pattern for ${topic}\n\n1. Define the parameters clearly.\n2. Use a optimized loop or vectorized operation.\n3. Verify against edge cases (null/empty inputs).\n4. Return the calculated model state.`}
                  </pre>
                  <button onClick={handleFinish} className="lab-finish-btn outline">NOTED, CONTINUE</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .lab-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px);
          z-index: 11000;
          display: flex;
          justify-content: center;
          padding: 40px 24px;
          overflow-y: auto;
          align-items: flex-start;
        }
        .lab-card {
          width: 100%;
          max-width: 800px;
          background: #fff;
          border-radius: 40px;
          box-shadow: 0 40px 120px rgba(0,0,0,0.6);
          margin-bottom: 40px;
          flex-shrink: 0;
        }
        .lab-header {
          padding: 40px 48px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafafa;
        }
        .lab-title {
          font-size: 1.8rem;
          font-weight: 900;
          font-family: 'Outfit';
          margin-bottom: 8px;
        }
        .lab-subtitle {
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.05em;
        }
        .lab-close {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.06);
          cursor: pointer;
          font-weight: 900;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lab-content {
          padding: 48px;
        }
        .colab-cta-box {
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 28px;
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          color: #fff;
          cursor: pointer;
          transition: 0.3s;
          margin-bottom: 48px;
        }
        .colab-cta-box:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
        }
        .colab-cta-box.leetcode {
          background: linear-gradient(135deg, #ffa116, #ff7a00);
        }
        .colab-cta-box.gfg {
          background: linear-gradient(135deg, #2f8d46, #1c5e2d);
        }
        .colab-icon {
          font-size: 2.5rem;
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .colab-label {
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .colab-link-name {
          font-size: 1.25rem;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .colab-hint {
          font-size: 0.9rem;
          opacity: 0.75;
        }
        .colab-arrow {
          font-size: 2rem;
          margin-left: auto;
          opacity: 0.6;
        }
        .section-title {
          font-size: 0.9rem;
          font-weight: 900;
          color: rgba(0,0,0,0.3);
          letter-spacing: 0.12em;
          margin-bottom: 24px;
        }
        .tasks-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 48px;
        }
        .task-item {
          padding: 28px 32px;
          border-radius: 24px;
          background: rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          gap: 20px;
          align-items: center;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .task-item:hover {
          background: #fff;
          border-color: #a855f7;
          transform: translateX(8px);
          box-shadow: 0 10px 25px rgba(168, 85, 247, 0.08);
        }
        .task-item.completed {
          background: rgba(168, 85, 247, 0.04);
          border-color: #a855f7;
        }
        .task-checkbox {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid rgba(0,0,0,0.1);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 900;
          color: #a855f7;
          flex-shrink: 0;
        }
        .completed .task-checkbox {
          border-color: #a855f7;
          background: #a855f7;
          color: #fff;
        }
        .task-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #000;
          line-height: 1.4;
        }
        .decision-title {
          font-size: 0.9rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 24px;
        }
        .decision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .decision-btn {
          padding: 20px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
        }
        .decision-btn.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .decision-btn.fail {
          background: rgba(168, 85, 247, 0.05);
          color: #a855f7;
        }
        .decision-btn:hover {
          transform: translateY(-2px);
          filter: brightness(0.95);
        }
        .btn-icon { font-size: 1.5rem; }
        .btn-text { font-size: 0.8rem; font-weight: 900; }
        
        .result-box {
          padding: 40px;
          border-radius: 24px;
          text-align: center;
        }
        .result-box.success { background: rgba(16, 185, 129, 0.05); }
        .result-box.fail { background: rgba(168, 85, 247, 0.02); }
        .result-icon { font-size: 1.2rem; font-weight: 900; margin-bottom: 12px; }
        .result-title { font-size: 1.4rem; font-weight: 900; margin-bottom: 8px; }
        .result-desc { font-size: 0.9rem; color: rgba(0,0,0,0.5); margin-bottom: 24px; }
        
        .lab-finish-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: #10b981;
          color: #fff;
          font-weight: 800;
          cursor: pointer;
        }
        .lab-solution-btn {
          padding: 12px 32px;
          border-radius: 12px;
          border: 1px solid #a855f7;
          background: #fff;
          color: #a855f7;
          font-weight: 800;
          cursor: pointer;
        }
        .solution-content { margin-top: 24px; text-align: left; }
        .solution-header { font-size: 0.7rem; font-weight: 900; color: #a855f7; margin-bottom: 12px; }
        .solution-pre { 
          background: #000; color: #fff; padding: 24px; border-radius: 16px; 
          font-family: 'Monaco', monospace; font-size: 0.8rem; overflow-x: auto;
          margin-bottom: 24px;
        }
        .lab-finish-btn.outline { background: #000; }
      `}</style>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { QuizSet, DATABASE_QUIZZES } from '@/data/quizzes';

interface AssessmentCenterProps {
  quizId: string;
  topic?: string;
  assessmentType?: 'code' | 'quiz';
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export default function AssessmentCenter({ quizId, topic = 'General Mastery', assessmentType = 'quiz', questions, onClose, onComplete }: AssessmentCenterProps) {
  const [quiz, setQuiz] = useState<QuizSet | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Code Assessment State
  const [code, setCode] = useState('// Start coding here...\nfunction solve() {\n  \n}');
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  useEffect(() => {
    if (assessmentType === 'quiz') {
      if (questions && questions.length > 0) {
        setQuiz({
          id: quizId,
          topic,
          questions: questions.map((q, i) => ({ ...q, id: `q-${i}` }))
        });
      } else {
        // 🧠 PLATINUM CATEGORY-AWARE FALLBACK
        const isML = topic.toLowerCase().includes('ml') || topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('data');
        const defaultId = isML ? 'quiz-ml_ai-1' : 'quiz-sde_dsa-1';
        
        const foundQuiz = DATABASE_QUIZZES[quizId] || DATABASE_QUIZZES[defaultId] || DATABASE_QUIZZES['quiz-sde_dsa-1'];
        setQuiz(foundQuiz);
      }
    }
  }, [quizId, assessmentType, questions, topic]);

  const handleNext = () => {
    if (!quiz) return;
    const isCorrect = selectedOption === quiz.questions[currentStep].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleCodeSubmit = async () => {
    setIsGrading(true);
    try {
      const res = await fetch('/api/roadmap/assessment/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, code, language: 'javascript' })
      });
      const data = await res.json();
      setGradeResult(data);
      setScore(data.score); // Set score for completion
      setIsFinished(true);
    } catch (err) {
      console.error('Grading Error:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const finalScore = assessmentType === 'quiz' ? Math.round((score / (quiz?.questions.length || 10)) * 100) : score;

  return (
    <div className="assessment-overlay">
       <div className={`assessment-card message-fade-in ${assessmentType === 'code' ? 'code-mode' : ''}`}>
          {!isFinished ? (
             <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>{assessmentType === 'code' ? 'AI Code Assessment' : (quiz?.topic || topic)}</h2>
                      <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>{assessmentType === 'code' ? `Challenge: implement elite ${topic}` : `Question ${currentStep + 1} of ${quiz?.questions.length}`}</p>
                   </div>
                   <button onClick={onClose} className="close-btn-mini">✕</button>
                </div>

                {assessmentType === 'quiz' ? (
                   <>
                      <div className="progress-bar-container" style={{ marginBottom: '40px' }}>
                         <div className="progress-bar-fill" style={{ width: `${((currentStep + 1) / (quiz?.questions.length || 10)) * 100}%` }}></div>
                      </div>

                      <div className="question-text" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px', lineHeight: 1.5 }}>
                         {quiz?.questions[currentStep].question}
                      </div>

                      <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         {quiz?.questions[currentStep].options.map((opt: string, i: number) => (
                            <button 
                               key={i} 
                               onClick={() => setSelectedOption(i)}
                               className={`option-btn ${selectedOption === i ? 'selected' : ''}`}
                               style={{ 
                                  padding: '16px 20px', 
                                  borderRadius: '16px', 
                                  border: '2px solid', 
                                  borderColor: selectedOption === i ? '#a855f7' : 'rgba(0,0,0,0.05)',
                                  background: selectedOption === i ? 'rgba(168, 85, 247, 0.05)' : '#fff',
                                  textAlign: 'left',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: '0.2s',
                                  color: '#000'
                               }}
                            >
                               {opt}
                            </button>
                         ))}
                      </div>

                      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                         {selectedOption !== null && !showExplanation && (
                            <button 
                               onClick={() => setShowExplanation(true)} 
                               style={{ background: 'rgba(0,0,0,0.05)', color: '#000', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
                            >
                               Check Answer
                            </button>
                         )}
                         {showExplanation && (
                            <div className="explanation-box message-fade-in" style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem', color: '#10b981' }}>
                               <strong>Result:</strong> {selectedOption === quiz?.questions[currentStep].correctAnswer ? 'Correct!' : 'Incorrect.'} <br/>
                               {quiz?.questions[currentStep].explanation}
                            </div>
                         )}
                         <button 
                            disabled={selectedOption === null}
                            onClick={handleNext}
                            className="primary-btn-nexus"
                            style={{ padding: '12px 32px', borderRadius: '12px' }}
                         >
                            {currentStep < (quiz?.questions.length || 10) - 1 ? 'Next Question' : 'Finish Quiz'}
                         </button>
                      </div>
                   </>
                ) : (
                   <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ flex: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
                         <Editor
                            height="100%"
                            language="javascript"
                            theme="light"
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            options={{ minimap: { enabled: false }, fontSize: 14 }}
                         />
                      </div>
                      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Task:</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a855f7' }}>Implement {topic}</span>
                         </div>
                         <button 
                            onClick={handleCodeSubmit}
                            disabled={isGrading}
                            className="primary-btn-nexus"
                            style={{ padding: '16px 48px', borderRadius: '16px' }}
                         >
                            {isGrading ? 'AI Evaluator Running...' : 'SUBMIT FOR GRADING'}
                         </button>
                      </div>
                   </div>
                )}
             </>
          ) : (
             <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>{finalScore >= 80 ? '🏆' : '🎯'}</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Assessment Complete</h2>
                <p style={{ opacity: 0.5, fontSize: '1.2rem', marginBottom: '32px' }}>You scored {finalScore}% mastery in {topic}</p>
                
                {gradeResult && (
                   <div className="grade-report" style={{ textAlign: 'left', padding: '32px', borderRadius: '24px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                         <div style={{ fontWeight: 800, color: '#a855f7' }}>AI EXPERT FEEDBACK</div>
                         <div style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '8px', background: '#000', color: '#fff' }}>{gradeResult.verdict}</div>
                      </div>
                      <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>{gradeResult.feedback}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                         <div style={{ padding: '12px', background: '#fff', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.65rem', opacity: 0.4 }}>COMPLEXITY</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{gradeResult.complexities}</div>
                         </div>
                         <div style={{ padding: '12px', background: '#fff', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.65rem', opacity: 0.4 }}>FINAL SCORE</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{gradeResult.score}/100</div>
                         </div>
                      </div>
                   </div>
                )}

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                   <button 
                      onClick={() => { onComplete(finalScore); onClose(); }} 
                      className="primary-btn-nexus"
                      style={{ padding: '16px 48px', borderRadius: '16px' }}
                   >
                      Return to Roadmap
                   </button>
                </div>
             </div>
          )}
       </div>

       <style jsx>{`
          .assessment-overlay {
             position: fixed;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: rgba(0,0,0,0.85);
             backdrop-filter: blur(12px);
             z-index: 10000;
             display: flex;
             justify-content: center;
             padding: 40px 20px;
             overflow-y: auto; /* Allow overlay to scroll if card is too big */
             align-items: flex-start; /* Start from top to avoid 'invisible' top cutoff */
          }
          .assessment-card {
             width: 100%;
             max-width: 800px;
             background: #fff;
             border-radius: 40px;
             padding: 48px 56px;
             box-shadow: 0 50px 100px rgba(0,0,0,0.7);
             position: relative;
             margin-bottom: 40px;
             flex-shrink: 0;
          }
          .assessment-card.code-mode {
             max-width: 1000px;
          }
          .option-btn {
             transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .option-btn:hover:not(.selected) {
             border-color: rgba(168, 85, 247, 0.3) !important;
             background: rgba(168, 85, 247, 0.02) !important;
             transform: translateX(4px);
          }
          .option-btn.selected {
             box-shadow: 0 8px 20px rgba(168, 85, 247, 0.15);
          }
          .progress-bar-container {
             height: 8px;
             background: rgba(0,0,0,0.04);
             border-radius: 4px;
             overflow: hidden;
          }
          .progress-bar-fill {
             height: 100%;
             background: linear-gradient(90deg, #a855f7, #6366f1);
             transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .close-btn-mini {
             border: none;
             background: rgba(0,0,0,0.06);
             width: 44px;
             height: 44px;
             border-radius: 50%;
             color: #000;
             font-weight: 800;
             cursor: pointer;
             display: flex;
             align-items: center;
             justify-content: center;
             transition: 0.2s;
          }
          .close-btn-mini:hover {
             background: rgba(0,0,0,0.1);
             transform: rotate(90deg);
          }
       `}</style>
    </div>
  );
}

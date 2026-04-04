'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Bot, User, MessageCircle, Bug, Lightbulb, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiTutorProps {
  isOpen: boolean;
  onClose: () => void;
  problemContext: string;
  currentCode: string;
  currentLanguage: string;
}

export default function AiTutor({ isOpen, onClose, problemContext, currentCode, currentLanguage }: AiTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm **Nexus AI**. I'm here to guide you through this DSA challenge — not just give answers. Ask me for a hint, explanation, or code review in " + currentLanguage + "! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          problemContext,
          currentCode,
          currentLanguage
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connection error. Make sure your API keys (Claude, DeepSeek, or Groq) are valid in `.env.local`." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-sidebar" style={{
      width: '400px',
      height: '100%',
      background: '#13111c',
      borderLeft: '1px solid var(--card-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 100,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <header style={{ padding: '20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--color-pink)" />
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>Nexus AI <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>Claude</span></span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            gap: '12px', 
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: msg.role === 'user' ? 'var(--color-pink)' : 'var(--color-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{ 
              background: msg.role === 'user' ? 'rgba(236,72,153,0.1)' : 'rgba(168,85,247,0.1)',
              padding: '12px 16px',
              borderRadius: '12px',
              maxWidth: '85%',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: 'var(--text-main)'
            }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)' }}>
             <Bot size={16} className="animate-pulse" />
             <span style={{fontSize: '0.85rem'}}>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => handleSend("Can you explain the main idea of this problem?")} className="ai-tool-btn">
            <GraduationCap size={14} /> Explain Idea
          </button>
          <button onClick={() => handleSend("I'm stuck. Can I have a hint without giving me the code?")} className="ai-tool-btn">
            <Lightbulb size={14} /> Get Hint
          </button>
          <button onClick={() => handleSend("Look at my current code and let me know if I'm on the right track or have logic errors.")} className="ai-tool-btn">
            <Bug size={14} /> Debug My Code
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => handleSend()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--gradient-purple-pink)',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
            <Send size={16} color="white" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .ai-tool-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .ai-tool-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          border-color: rgba(255,255,255,0.2);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

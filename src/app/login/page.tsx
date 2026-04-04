'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
       const supabase = createClient();
       const { data: { session } } = await supabase.auth.getSession();
       if (session?.user) {
          const meta = session.user.user_metadata;
          setUserName(meta?.full_name || meta?.name || session.user.email?.split('@')[0]);
       }
    };
    fetchUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (authData.user) {
      // 🛡️ v32.1 Strict Membership Check
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (!userData) {
        await supabase.auth.signOut();
        setError("No account found for this email. Please sign up first to access ProgAce.");
        setLoading(false);
        return;
      }

      // 🚀 Direct Redirect (v34.0 Logic)
      window.location.href = '/dashboard';
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    const supabase = createClient();
    // 🛡️ v35.2 Precision Redirection (Encoded to prevent 404)
    const nextPath = encodeURIComponent('/dashboard');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${nextPath}`,
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#ffffff', 
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '50px 40px', 
        background: '#ffffff', 
        borderRadius: '24px', 
        border: '1px solid rgba(0,0,0,0.08)', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        textAlign: 'center'
      }}>
        
        {/* Minimalist Logo-First Layout */}
        <div style={{ marginBottom: '32px' }}>
          <img src="/logo.png" alt="ProgAce" style={{ width: '56px', height: '56px', marginBottom: '20px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginBottom: '8px', letterSpacing: '-0.02em' }}>
             Welcome back{userName ? `, ${userName}` : ''}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Sign in to continue your mastery journey.</p>
        </div>

        {/* Branded Social Buttons (Fixed Transparency & 404) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => handleOAuthLogin('google')}
            style={{
              padding: '12px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0',
              color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('github')}
            style={{
              padding: '12px', borderRadius: '12px', background: '#000', border: '1px solid #000',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>OR LOGIN WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000' }}>Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #cbd5e1',
                color: '#000', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000' }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #cbd5e1',
                color: '#000', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {error && <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '8px', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 800, border: 'none', cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(168, 85, 247, 0.25)', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
          Don't have an account? <Link href="/signup" style={{ color: '#a855f7', fontWeight: 800, textDecoration: 'none' }}>Create account</Link>
        </div>
      </div>
    </div>
  );
}

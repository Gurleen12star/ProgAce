'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, BarChart3, TrendingUp, Target, AlertTriangle, 
  Lightbulb, Zap, Award, Brain, Code2, Globe, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Activity, PieChart, Info, Clock,
  CheckCircle, XCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// 🔱 Custom SVG Radar Chart (v68.1)
const RadarChart = ({ data, size = 300 }: { data: any[], size?: number }) => {
  const center = size / 2;
  const radius = center * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: d.axis
    };
  });

  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Background Hexagons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((step, i) => (
          <polygon
            key={i}
            points={data.map((_, idx) => {
              const angle = idx * angleStep - Math.PI / 2;
              const r = step * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {/* Axis Lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}
        {/* Data Polygon */}
        <path
          d={pathData}
          fill="rgba(168, 85, 247, 0.2)"
          stroke="#a855f7"
          strokeWidth="3"
          className="radar-path"
        />
        {/* Labels */}
        {points.map((p, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelR = radius + 30;
          const lx = center + labelR * Math.cos(angle);
          const ly = center + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// 🔱 Custom SVG Line Chart (v68.1)
const VelocityLineChart = ({ data, width = 600, height = 150 }: { data: number[], width?: number, height?: number }) => {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min;
  const stepX = width / (data.length - 1);
  
  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - ((d - min) / range) * height
  }));

  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
  const areaData = `${pathData} L ${points[points.length-1].x},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor="rgba(236, 72, 153, 0.3)" />
           <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
        </linearGradient>
      </defs>
      <path d={areaData} fill="url(#lineGrad)" />
      <path d={pathData} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ec4899" stroke="#0a0a0a" strokeWidth="2" />
      ))}
    </svg>
  );
};

export default function SwotPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    roadmapProgress: 64,
    arenaSolveRate: 0,
    mockScore: 6.5,
    nexCoins: 0
  });

  const [radarData, setRadarData] = useState([
    { axis: 'Coding', value: 30 },
    { axis: 'Resilience', value: 85 },
    { axis: 'Velocity', value: 20 },
    { axis: 'Behavioral', value: 65 },
    { axis: 'Problem Solving', value: 40 }
  ]);

  const [velocityData, setVelocityData] = useState([20, 35, 42, 38, 55, 68, 72, 65, 88, 95]);

  useEffect(() => {
    // Simulate real data binding logic
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
       <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '60px 80px', overflowX: 'hidden' }}>
      
      {/* 🔱 Header Analytics */}
      <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '8px', fontFamily: 'Outfit', letterSpacing: '-0.04em' }}>Performance Analytics</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>Comprehensive SWOT analysis from Roadmap & Arena metrics</p>
         </div>
         <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 800 }}>
            <ChevronLeft size={20} /> Back to Dashboard
         </Link>
      </header>

      {/* 🔱 Top Tier Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
         {[
            { label: 'Roadmap Depth', value: `${stats.roadmapProgress}%`, icon: <Activity color="#a855f7" />, trend: '+4% this wk' },
            { label: 'Arena Solve Rate', value: `${stats.arenaSolveRate}%`, icon: <Zap color="#fbbf24" />, trend: '+12% vs last contest' },
            { label: 'Mock Fluency', value: `${stats.mockScore}/10`, icon: <Brain color="#ec4899" />, trend: 'Stable' },
            { label: 'Vault Balance', value: stats.nexCoins, icon: <Award color="#22c55e" />, trend: 'Top 5% Global' }
         ].map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
               <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>{m.label}</div>
               <div style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '8px' }}>{m.value}</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>{m.trend}</span>
                  {m.icon}
               </div>
            </div>
         ))}
      </div>

      {/* 🔱 VISUAL ANALYTICS (RADAR + VELOCITY) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', marginBottom: '40px' }}>
         
         {/* Nexus Skill Radar */}
         <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ width: '100%', textAlign: 'left', fontSize: '1.1rem', fontWeight: 950, marginBottom: '40px', display: 'flex', gap: '10px', alignItems: 'center' }}>
               <Target size={20} color="#a855f7" /> Nexus Skill Matrix
            </h3>
            <RadarChart data={radarData} size={320} />
            <div style={{ width: '100%', marginTop: '40px', padding: '20px', background: 'rgba(168,85,247,0.05)', borderRadius: '16px', border: '1px solid rgba(168,85,247,0.1)' }}>
               <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Analysis: Your **Resilience** and **Coding** axes are exceptional. Focus on improving **Velocity** to reach the "Elite Predator" rank in Arena contests.</p>
            </div>
         </div>

         {/* Growth Velocity Line */}
         <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 950, display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <TrendingUp size={20} color="#ec4899" /> Growth Momentum
               </h3>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'rgba(255,255,255,0.3)', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>LAST 30 DAYS</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#ec4899', background: 'rgba(236,72,153,0.1)', padding: '4px 10px', borderRadius: '6px' }}>ACTIVE NODE: DYNAMIC PROGRAMMING</span>
               </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '20px' }}>
               <VelocityLineChart data={velocityData} width={800} height={200} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px' }}>
               {[
                  { label: 'Avg Node/Day', val: '1.8', icon: <Code2 size={16} /> },
                  { label: 'Time/Solution', val: '22m', icon: <Clock size={16} /> },
                  { label: 'Complexity Avg', val: 'O(N log N)', icon: <TrendingUp size={16} /> }
               ].map((x, i) => (
                  <div key={i} style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                     <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, marginBottom: '4px' }}>{x.label}</div>
                     <div style={{ fontSize: '1.2rem', fontWeight: 950 }}>{x.val}</div>
                  </div>
               ))}
            </div>
         </div>

      </div>

      {/* 🔱 THE SWOT GRID (v68.1) */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '32px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
         Strategic Standpoint <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#a855f7'}}></div>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
         
         {/* STRENGTHS - Cyan */}
         <div style={{ background: 'rgba(34,211,238,0.02)', border: '1px solid rgba(34,211,238,0.1)', padding: '40px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ color: '#22d3ee', fontSize: '1.3rem', fontWeight: 950, letterSpacing: '0.05em' }}>STRENGTHS</h3>
               <ArrowUpRight color="#22d3ee" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  "Advanced proficiency in Binary Search algorithms (98% Arena solve).",
                  "Consistent roadmap progression velocity (Top 4% global).",
                  "High resilience score in timed Mock Interviews.",
                  "Exceptional knowledge of Distributed System concepts in Roadmaps."
               ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                     <CheckCircle size={18} color="#22d3ee" style={{marginTop: '2px', flexShrink: 0}} />
                     <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>{s}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* WEAKNESSES - Crimson */}
         <div style={{ background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.1)', padding: '40px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ color: '#ef4444', fontSize: '1.3rem', fontWeight: 950, letterSpacing: '0.05em' }}>WEAKNESSES</h3>
               <ArrowDownRight color="#ef4444" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  "Stalled on Dynamic Programming Hub (0% solve rate in recursive patterns).",
                  "Lower communication score during technical behavioral rounds.",
                  "Frequent time-limit-exceed (TLE) issues in Arena Python challenges.",
                  "Inconsistent attendance for Weekly Contest rounds (40% missed)."
               ].map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                     <XCircle size={18} color="#ef4444" style={{marginTop: '2px', flexShrink: 0}} />
                     <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>{w}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* OPPORTUNITIES - Amber */}
         <div style={{ background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.1)', padding: '40px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: 950, letterSpacing: '0.05em' }}>OPPORTUNITIES</h3>
               <Lightbulb color="#f59e0b" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  "Next Roadmap Unlock: High-Scalability Systems (Matches your strengths).",
                  "Upcoming Biweekly Contest 180: Featured prizes for DP improvement.",
                  "Recommended Practice: Graph Theory foundations to boost Arena rank.",
                  "Potential Mentor Match: 1-on-1 session for communication coaching."
               ].map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                     <Zap size={18} color="#f59e0b" style={{marginTop: '2px', flexShrink: 0}} />
                     <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>{o}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* THREATS - Violet */}
         <div style={{ background: 'rgba(168,85,247,0.02)', border: '1px solid rgba(168,85,247,0.1)', padding: '40px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ color: '#a855f7', fontSize: '1.3rem', fontWeight: 950, letterSpacing: '0.05em' }}>THREATS</h3>
               <ShieldAlert color="#a855f7" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                  "Competitor Gap: Top 1% in Arena are solving DP problems 30% faster.",
                  "Upcoming hiring surge for roles requiring specialized Cloud DevOps skills.",
                  "Plagiarism detection risks if AI tools are over-utilized in Arena.",
                  "Technological shift: Rising demand for Rust/Go expertise over Python/JS."
               ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                     <AlertTriangle size={18} color="#a855f7" style={{marginTop: '2px', flexShrink: 0}} />
                     <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>{t}</p>
                  </div>
               ))}
            </div>
         </div>

      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .radar-path { animation: radar-grow 1s ease-out; }
        @keyframes radar-grow { from { transform: scale(0); transform-origin: center; } to { transform: scale(1); transform-origin: center; } }
      `}</style>
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';

interface Node {
  id: string;
  title: string;
  type: 'concept' | 'practice' | 'revision';
  duration: string;
  contentSummary?: string;
}

interface Edge {
  from: string;
  to: string;
}

interface RoadmapGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export default function RoadmapGraph({ nodes, edges }: RoadmapGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Layout Logic: Simple Layered Digraph
  const processedNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    const depthMap: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    nodes.forEach(n => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
      depthMap[n.id] = 0;
    });

    edges.forEach(e => {
      adj[e.from].push(e.to);
      inDegree[e.to]++;
    });

    // Topological sort to find depth
    const queue: string[] = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      adj[u].forEach(v => {
        depthMap[v] = Math.max(depthMap[v], depthMap[u] + 1);
        inDegree[v]--;
        if (inDegree[v] === 0) queue.push(v);
      });
    }

    // Group nodes by depth
    const layers: Record<number, string[]> = {};
    Object.entries(depthMap).forEach(([id, depth]) => {
      if (!layers[depth]) layers[depth] = [];
      layers[depth].push(id);
    });

    // Assign X, Y coordinates
    const NODE_WIDTH = 200;
    const NODE_HEIGHT = 100;
    const LAYER_GAP = 180;
    const HORIZONTAL_GAP = 240;

    return nodes.map(node => {
      const depth = depthMap[node.id];
      const itemsInLayer = layers[depth];
      const indexInLayer = itemsInLayer.indexOf(node.id);
      
      return {
        ...node,
        x: indexInLayer * HORIZONTAL_GAP + (1000 - itemsInLayer.length * HORIZONTAL_GAP) / 2, // Center layer
        y: depth * LAYER_GAP + 60,
        depth
      };
    });
  }, [nodes, edges]);

  const paths = useMemo(() => {
    if (!edges || !processedNodes || edges.length === 0) return [];
    return edges.map((edge, i) => {
      const fromNode = processedNodes.find(n => n.id === edge.from);
      const toNode = processedNodes.find(n => n.id === edge.to);

      if (!fromNode || !toNode) return null;

      const x1 = fromNode.x + 100; // Center offset
      const y1 = fromNode.y + 40;
      const x2 = toNode.x + 100;
      const y2 = toNode.y;

      const cp1y = y1 + (y2 - y1) / 2;
      const cp2y = y1 + (y2 - y1) / 2;

      const isPathHovered = hoveredNode === edge.from || hoveredNode === edge.to;

      return (
        <path
          key={i}
          d={`M ${x1} ${y1} C ${x1} ${cp1y}, ${x2} ${cp2y}, ${x2} ${y2}`}
          stroke={isPathHovered ? 'var(--color-pink)' : 'rgba(168, 85, 247, 0.2)'}
          strokeWidth={isPathHovered ? 3 : 1.5}
          fill="transparent"
          style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
        />
      );
    });
  }, [edges, processedNodes, hoveredNode]);

  return (
    <div style={{ padding: '40px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: '24px', overflowX: 'auto', minHeight: '600px' }}>
      <svg width="1100" height="800" style={{ margin: '0 auto', display: 'block' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {paths}

        {processedNodes && processedNodes.map((node, i) => {
          const isActive = hoveredNode === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              transform={`translate(${node.x}, ${node.y}) ${isActive ? 'scale(1.05)' : ''}`}
            >
              {/* Hexagon Placeholder or Stylized Card */}
              <rect
                width="200"
                height="70"
                rx="16"
                fill={isActive ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
                stroke={isActive ? 'var(--color-pink)' : 'var(--card-border)'}
                strokeWidth="1.5"
                style={{ backdropFilter: 'blur(10px)' }}
              />
              
              <text
                x="100"
                y="30"
                textAnchor="middle"
                fill="white"
                style={{ fontSize: '0.9rem', fontWeight: 700 }}
              >
                {node.title}
              </text>
              
              <text
                x="100"
                y="52"
                textAnchor="middle"
                fill="var(--text-muted)"
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                {node.duration} hrs • {node.type}
              </text>

              {isActive && (
                <text
                  x="100"
                  y="-10"
                  textAnchor="middle"
                  fill="var(--color-pink)"
                  style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}
                >
                  CLICK TO VIEW
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

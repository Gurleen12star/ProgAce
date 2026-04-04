export const MOCK_DSA_RESPONSES: Record<string, string> = {
  goal: "Got it! Your primary goal is {goal}. This is a solid starting point. Now, what programming language do you prefer to use for your DSA journey? (C++, Python, or Java?)",
  language: "Awesome! {language} is a great choice. Next, what's your preferred learning style? (Visual, Practice-heavy, Theory-first, or a Mix of all?)",
  style: "I hear you! A {style} approach works best for many. How much time are you planning to dedicate daily? (Chill: 2h, Balanced: 4h, or Aggressive: 6h?)",
  speed: "Perfect. Before we generate the roadmap, do you have any prior background? Have you covered specific topics like Arrays or Recursion already?",
  background: "I'll take that into account! Last step: Let's do a quick check. How would you solve a problem where you need to find a pair of numbers in an array that sum to a target?",
  assessment: "Great analysis! I've collected all the data. I'm building your 100% personalized roadmap now...",
  default: "I'm here! Tell me more about your journey and goals."
};

export const MOCK_GENERATE_ROADMAP = (prefs: any) => {
  const language = prefs.language || 'Python';
  const speed = prefs.speed || 'Balanced';
  
  return {
    nodes: [
      { id: "1", title: "Array Fundamentals", type: "concept", durationInHours: 4, contentSummary: "Basics of arrays, memory layout, and $O(1)$ access." },
      { id: "2", title: "Two Pointers Strategy", type: "practice", durationInHours: 3, contentSummary: "Solving pair sums and reverse operations efficiently." },
      { id: "3", title: "Sliding Window Pattern", type: "concept", durationInHours: 5, contentSummary: "Optimizing subarray problems from $O(N^2)$ to $O(N)$." },
      { id: "4", title: "Hashing & Maps", type: "practice", durationInHours: 4, contentSummary: "Using hash tables for lightning-fast lookups." },
      { id: "5", title: "Recursion Masterclass", type: "concept", durationInHours: 6, contentSummary: "Mastering the depth-first approach to complex problems." }
    ],
    edges: [
      { from: "1", to: "2" },
      { from: "2", to: "3" },
      { from: "3", to: "4" },
      { from: "4", to: "5" }
    ],
    dailyMicroPlan: [
      {
        day: 1,
        totalHours: speed === 'Chill' ? 2 : (speed === 'Balanced' ? 4 : 6),
        activities: [
          { title: `${language} Array Basics`, type: "video", duration: "45m", topic: "1" },
          { title: "Standard Library Basics", type: "reading", duration: "30m", topic: "1" },
          { title: "Practice Problem: Array Traversal", type: "practice", duration: "45m", topic: "1" }
        ]
      }
    ]
  };
};

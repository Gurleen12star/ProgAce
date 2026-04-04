export interface Resource {
  type: 'video' | 'practice' | 'quiz' | 'reading';
  title: string;
  url: string;
  thumbnail?: string;
  platform?: string;
}

export interface DayTask {
  id: string;
  day_num: number;
  title: string;
  type: 'video' | 'quiz' | 'practice' | 'code' | 'colab';
  url: string;
  isInternal?: boolean;
  duration?: string;
  tasks?: string[];
}

export interface WeeklyAssessment {
  id: string;
  title: string;
  url: string;
  questionCount: number;
}

export interface Topic {
  id: string;
  week_num: number;
  title: string;
  description: string;
  days: DayTask[];
  assessment?: WeeklyAssessment;
  assessmentType?: 'code' | 'quiz';
  colabUrl?: string;
  isInternal?: boolean;
}

export type Category = 'MAANG' | 'HFT' | 'Fintech' | 'Product-Based' | 'Big4' | 'Service-Based' | 'Banking';
export type EliteRole = 'Frontend Engineer' | 'Backend Engineer' | 'Fullstack Engineer' | 'Cloud Engineer' | 'DevOps Engineer' | 'ML Engineer' | 'AI Engineer' | 'Software Development Engineer (SDE)' | 'Software Engineer (SWE)' | 'Data Engineer' | 'Security Engineer' | 'Mobile Developer' | 'SRE' | 'Quant Developer' | 'Quant Researcher' | 'Low Latency C++ Engineer' | 'AI Engineer' | 'Tech Consultant' | 'Data Scientist' | 'Data Analyst' | 'System Engineer' | 'Software Engineer' | 'Support Engineer' | 'QA Testing' | 'Blockchain Developer' | 'QA Automation';

export interface PredefinedPath {
  id: string;
  title: string;
  company: string;
  companyType: Category;
  role: EliteRole;
  level: string;
  estimatedHours: number;
  videoCount: number;
  moduleCount: number;
  questionCount: number;
  learnerCount: number;
  logo: string;
  salaryRange: string;
  usaSalary?: string;
  targetJobRole: string;
  description: string;
  outcomes: string[];
  features: string[];
  curriculum: Topic[];
}

// 🏛️ PERFORMANCE RESOURCE DATABASE (V10.0 ROLE-SPECIFIC & ASSESSMENT-FIRST)
const AUTHENTIC_RESOURCES: Record<string, { videos: string[], practice: string[], sourceName: string, colab?: string }> = {
  'SDE_DSA': {
    videos: [
      'https://www.youtube.com/watch?v=RBSGKlAvoiM', 'https://www.youtube.com/watch?v=84V1Yp0Y4T8', 'https://www.youtube.com/watch?v=37E9ckMDdTk', 'https://www.youtube.com/watch?v=FfXoiwnnZxY', 'https://www.youtube.com/watch?v=0k_HIvzU3EU',
      'https://www.youtube.com/watch?v=EAR7De6G944', 'https://www.youtube.com/watch?v=yVdKa8dnKiE', 'https://www.youtube.com/watch?v=37E9ckMDdTk', 'https://www.youtube.com/watch?v=FfXoiwnnZxY', 'https://www.youtube.com/watch?v=0k_HIvzU3EU'
    ],
    practice: [
      'https://leetcode.com/problems/two-sum/', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'https://leetcode.com/problems/contains-duplicate/', 'https://leetcode.com/problems/valid-parentheses/', 'https://leetcode.com/problems/implement-stack-using-queues/'
    ],
    sourceName: 'Striver / NeetCode / Apna College'
  },
  'FRONTEND': {
    videos: [
      'https://www.youtube.com/watch?v=hQZue9afZ6k', 'https://www.youtube.com/watch?v=RVFAyFAtfUs', 'https://www.youtube.com/watch?v=vV9X_p7f6_Y', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'https://www.youtube.com/watch?v=asB-lzK-Jp4'
    ],
    practice: ['internal-mcq-fe', 'internal-code-fe', 'internal-mini-project', 'internal-ui-fix'],
    sourceName: 'Jack Herrington / Theo / Cosden Solution'
  },
  'BACKEND': {
    videos: [
      'https://www.youtube.com/watch?v=p4vMSu1gW2A', 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA', 'https://www.youtube.com/watch?v=-MTSQjw5DrM', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'https://www.youtube.com/watch?v=ztHopE5Wnpc'
    ],
    practice: ['internal-mcq-be', 'internal-code-be', 'internal-query-optimization', 'internal-middleware-task'],
    sourceName: 'Hussein Nasser / Primeagen / Node Official'
  },
  'SYS_DESIGN': {
    videos: [
      'https://www.youtube.com/watch?v=m8Icp_Cid5o', 'https://www.youtube.com/watch?v=I49_N6-M6As', 'https://www.youtube.com/watch?v=XvHOfN_LzAs', 'https://www.youtube.com/watch?v=ztHopE5Wnpc', 'https://www.youtube.com/watch?v=mGAtZ78-oP4'
    ],
    practice: ['https://bytebytego.com/'],
    sourceName: 'ByteByteGo / HLD Primer'
  },
  'DEVOPS': {
    videos: [
      'https://www.youtube.com/watch?v=js-v4v_7t-8', // Nana DevOps Roadmap
      'https://www.youtube.com/watch?v=3c-iBn73dDE', // Docker Intro
      'https://www.youtube.com/watch?v=X48VuDVv0do', // Kubernetes tutorial
      'https://www.youtube.com/watch?v=7xndT76-R-w', // Terraform
      'https://www.youtube.com/watch?v=hW6Daf-Aitc'  // CI/CD pipelines
    ],
    practice: ['https://labs.play-with-docker.com/', 'https://killercoda.com/'],
    colab: 'https://labs.play-with-docker.com/',
    sourceName: 'TechWorld with Nana / KodeKloud'
  },
  'QUANT': {
    videos: [
      'https://www.youtube.com/watch?v=m8Icp_Cid5o', // C++ Performance
      'https://www.youtube.com/watch?v=ztHopE5Wnpc', // Concurrency
      'https://www.youtube.com/watch?v=J_j8v_xI_d8', // Statistical Arbitrage
      'https://www.youtube.com/watch?v=VMj-3S1tku0', // Probability for Finance
      'https://www.youtube.com/watch?v=i_LwzRVP7bg'  // Linear Algebra
    ],
    practice: ['https://godbolt.org/', 'https://colab.research.google.com/'],
    colab: 'https://godbolt.org/',
    sourceName: 'Optiver / Citadel / Low-Latency Masterclass'
  },
  'ML_AI': {
    videos: [
      'https://www.youtube.com/watch?v=5bId3N7QZec', // Andrew Ng ML Intro (New)
      'https://www.youtube.com/watch?v=kCc8FmEb1nY', // Karpathy Zero to Hero (New)
      'https://www.youtube.com/watch?v=qT_vU-7A57c', // Scikit-Learn
      'https://www.youtube.com/watch?v=XnZ_D_Nis10', // CampusX ML (Hindi)
      'https://www.youtube.com/watch?v=ZuzHeX-5Tks', // Nitish ML Roadmap
      'https://www.youtube.com/watch?v=PaCmvoJ95uE', // Karpathy Backprop
      'https://www.youtube.com/watch?v=VMj-3S1tku0', // Andrew Ng Neural Networks
      'https://www.youtube.com/watch?v=i_LwzRVP7bg', // Stanford CS229
      'https://www.youtube.com/watch?v=aircAruvnKk', // 3Blue1Brown (Neural Nets)
      'https://www.youtube.com/watch?v=IHZwWFHWa-w'  // Karpathy GPT
    ],
    practice: ['internal-colab'],
    colab: 'https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/quickstart/beginner.ipynb',
    sourceName: 'Andrew Ng / Karpathy / CampusX'
  }
};

const DAY_SUBTOPICS: Record<string, string[]> = {
  'Language Core & Memory Model': ['Pointers & Memory Layout', 'Garbage Collection Internals', 'Concurrency & Threads', 'Standard Library Hacks', 'Build System Proficiency'],
  'Core Data Structures (Linear)': ['Array Internals', 'Dynamic Array Amortization', 'Space-Time Tradeoffs', 'Linked List Mastery', 'Edge Case Analysis'],
  'Advanced CSS Layouts': ['Flexbox & Grid Mastery', 'Responsive Breakpoints', 'CSS Variables & Themes', 'Animation performance', 'A11y Standards'],
  'JS Engine & Scope': ['V8 Compilation Flow', 'Closure & Context', 'Event Loop Mechanics', 'Prototypal Inheritance', 'ESNext Features'],
  'React Reconciliation': ['Virtual DOM & Diffing', 'Fiber Architecture', 'Hook Execution Order', 'Component Lifecycle', 'Memoization & Blending'],
  'State Management Patterns': ['React Context vs Redux', 'Zustand & Immer', 'Query/SWR Logic', 'Immutable Data flow', 'Server Components State'],
  'API Security & Auth': ['JWT vs Session Strategy', 'OAuth2 & PKCE Flow', 'CORS & CSP Headers', 'Rate Limiting Core', 'SQL Injection Guard'],
  'Database Internals & SQL': ['B-Tree Indexing Logic', 'ACID Transactions', 'SQL Joins & Optimizer', 'Connection Pooling', 'Sharding Strategies'],
  'Distributed Systems Architecture': ['CAP Theorem in practice', 'Eventual Consistency', 'gRPC vs REST performance', 'Service Discovery', 'Distributed Locking'],
  'Dynamic Programming Mastery': ['Recursion to Memoization', 'Tabulation vs Memoization', 'Bitmask DP Patterns', '2D DP Optimizations', 'Game Theory & DP'],
  'Graph Algorithms': ['DFS/BFS Traversal', 'Shortest Path (Dijkstra)', 'Cycle Detection Logic', 'Topological Sorting', 'Strongly Connected Components'],
  'High Level Design (Scale)': ['Load Balancing Algorithms', 'Consistent Hashing', 'Database Partitioning', 'Message Queues & Pub/Sub', 'CAP Theorem & Tradeoffs'],
  'Low Level Design (Patterns)': ['SOLID Principles Deep-Dive', 'Singleton & Factory Patterns', 'Strategy & Observer Patterns', 'Decorator & Proxy Logic', 'State Machine Implementation'],
  'Linear Algebra': ['Vector Spaces & Projections', 'Matrix Factorization (SVD)', 'Eigenvalues & Eigenvectors', 'Orthonormalization Steps', 'Tensors for Deep Learning'],
  'Neural Network Theory': ['Gradient Descent Mechanics', 'Backpropagation from Scratch', 'Activation functions (ReLU/Sigmoid)', 'Regularization (Dropout)', 'Loss Function Optimization'],
  'Deep Learning Architectures': ['CNNs & Convolution', 'LSTMs & RNN Recurrence', 'Attention Mechanisms', 'Transformer Blocks', 'Diffusion Models Intro'],
  'Linux Administration & Bash': ['Unix Permissions & Groups', 'Process Management (kill, top)', 'Shell Scripting Fundamentals', 'Cron Jobs & Automation', 'SSH & Key Management'],
  'Core Networking (TCP/IP)': ['OSI Model & Protocols', 'TCP vs UDP Deep-Dive', 'IP Addressing & Subnets', 'DNS & Resolution Flow', 'HTTP/HTTPS & TLS Handshake'],
  'Containerization (Docker)': ['Docker Architecture & Engine', 'Image Optimization Strategy', 'Docker Compose & Networks', 'Volume Persistence', 'Multi-stage Builds'],
  'Orchestration (Kubernetes)': ['Control Plane & Nodes', 'Pods, Deployments & ReplicaSets', 'Service Discovery & Ingress', 'K8s Storage (PVC)', 'Helm Chart Design'],
  'Infrastructure as Code': ['Terraform State Management', 'HCL Syntax & Modules', 'Providers & Backends', 'Ansible Playbooks', 'Immutable Infrastructure'],
  'Advanced C++ (Templates)': ['STL Container Internals', 'Template Metaprogramming', 'Move Semantics & RVO', 'Smart Pointer Mastery', 'C++20 Concepts'],
  'Low-Latency Architecture': ['Kernel Bypass (DPDK)', 'CPU Cache Optimization', 'Branch Prediction', 'Zero-Copy Networking', 'Lock-Free Queues'],
  'Stochastic Calculus & Risk': ['Black-Scholes Model', 'Monte Carlo Simulations', 'Value-at-Risk (VaR)', 'Geometric Brownian Motion', 'Risk Management Systems']
};

const DSA_PROBLEMS: Record<string, { title: string, url: string }[]> = {
  'Core Data Structures (Linear)': [
    { title: 'LC 1. Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
    { title: 'LC 121. Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { title: 'LC 217. Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/' },
    { title: 'LC 238. Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { title: 'LC 53. Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/' }
  ],
  'Dynamic Programming Mastery': [
    { title: 'LC 70. Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/' },
    { title: 'LC 322. Coin Change', url: 'https://leetcode.com/problems/coin-change/' },
    { title: 'LC 300. Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' }
  ],
  'Graph Algorithms': [
    { title: 'LC 200. Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/' },
    { title: 'LC 133. Clone Graph', url: 'https://leetcode.com/problems/clone-graph/' }
  ]
};

const getDetailedWeek = (week: number, title: string, domain: string = 'SDE_DSA', company: string = 'Elite'): Topic => {
  const days: DayTask[] = [];
  const res = AUTHENTIC_RESOURCES[domain] || AUTHENTIC_RESOURCES['SDE_DSA'];
  const isDev = domain === 'BACKEND' || domain === 'FRONTEND';
  const isSDE = domain === 'SDE_DSA' || isDev;
  const isML = domain === 'ML_AI';
  const isMathTopic = title.toLowerCase().includes('linear') || title.toLowerCase().includes('probab') || title.toLowerCase().includes('calculus');

  const companySeed = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = (week + companySeed) % 7;
  const daySubTopics = DAY_SUBTOPICS[title] || ['Advanced Concept Mastery', 'Practical Engineering', 'Performance Optimization', 'Scale & Efficiency', 'Final Industry Polish'];

  for (let d = 1; d <= 5; d++) {
     const subTopicTitle = daySubTopics[d-1];
     days.push({
        id: `w${week}-d${d}-v`,
        day_num: d,
        title: `${subTopicTitle}`,
        type: 'video',
        url: res.videos[(d + seed) % res.videos.length],
        duration: '45m'
     });
     
     const practiceCount = 1; // Merged Lab Missions
     for (let p = 1; p <= practiceCount; p++) {
       const isLeetCodeTarget = isSDE && domain === 'SDE_DSA' && DSA_PROBLEMS[title];
       const leetCodeProb = isLeetCodeTarget ? DSA_PROBLEMS[title][(d-1) % DSA_PROBLEMS[title].length] : null;

       days.push({
          id: `w${week}-d${d}-p${p}`,
          day_num: d,
          title: leetCodeProb ? `Elite Mission: ${leetCodeProb.title}` : `Elite Mission: ${subTopicTitle}`,
          type: 'practice',
          url: leetCodeProb ? leetCodeProb.url : (isDev ? '#assessment' : (res.practice[(p + d + seed) % res.practice.length] || res.practice[0])),
          isInternal: isDev,
          tasks: leetCodeProb ? [
            `Analyze Problem Requirements for ${leetCodeProb.title}`,
            `Solve on LeetCode/GFG and ensure optimized complexity`,
            `Verify achievement and click complete below`
          ] : [
            `Implement ${subTopicTitle} from scratch`,
            `Analyze performance and edge cases for ${subTopicTitle}`,
            `Optimize implementation for ${company} standards`
          ]
       });
     }
  }

  return {
    id: `w${week}-${Math.random().toString(36).substr(2, 5)}`,
    week_num: week,
    title: `${title}`,
    description: `Professional standards for ${title} at elite firms like ${company}. Curriculum vetted against ${res.sourceName} guidelines.`, 
    days,
    colabUrl: res.colab,
    assessmentType: (isSDE && !isMathTopic) ? 'code' : 'quiz',
    assessment: {
       id: `quiz-${domain.toLowerCase()}-${week}`,
       title: `${title} Mastery Quiz`,
       url: '#/assessment',
       questionCount: 10
    },
    isInternal: isDev
  };
};

export const getUniqueCurriculum = (role: EliteRole, company: string, totalMonths: number = 4): Topic[] => {
  let curriculum: Topic[] = [];
  const totalWeeks = totalMonths * 4;

  const isBE = role.includes('Backend') || role.includes('Server') || role.includes('Database');
  const isFE = role.includes('Frontend') || role.includes('UI') || role.includes('Mobile') || role.includes('Fullstack');
  const isFS = role.includes('Fullstack');
  const isML = role.includes('ML') || role.includes('AI') || role.includes('Data Scientist');
  const isQuant = role.includes('Quant') || role.includes('C++') || role.includes('Low Latency');
  const isDevOps = role.includes('DevOps') || role.includes('Cloud') || role.includes('SRE');
  const isSDE = role.includes('SDE') || role.includes('SWE') || (role.includes('Engineer') && !isML && !isDevOps && !isFE && !isBE);
  
  let domain = 'SDE_DSA';
  if (isFE) domain = 'FRONTEND';
  else if (isBE) domain = 'BACKEND';
  else if (isML) domain = 'ML_AI';
  else if (isQuant) domain = 'QUANT';
  else if (isDevOps) domain = 'DEVOPS';

  for (let w = 1; w <= totalWeeks; w++) {
    const p = w / totalWeeks;
    let currentDomain = domain;

    if (isFS && p > 0.4) currentDomain = 'BACKEND';
    if ((isBE || isFS) && p > 0.7) currentDomain = 'SYS_DESIGN';
    if (isFE && p > 0.7) currentDomain = 'SYS_DESIGN';
    
    if (p <= 0.25) { // Phase 01: Foundations
      if (isFE || (isFS && p <= 0.4)) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'JS Engine & Scope' : 'Advanced CSS Layouts', 'FRONTEND', company));
      } else if (isBE) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Language Core & Memory Model' : 'Database Internals & SQL', 'BACKEND', company));
      } else if (isML) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Linear Algebra' : 'Neural Network Theory', 'ML_AI', company));
      } else if (isDevOps) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Linux Administration & Bash' : 'Core Networking (TCP/IP)', 'DEVOPS', company));
      } else if (isQuant) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Advanced C++ (Templates)' : 'Language Core & Memory Model', 'QUANT', company));
      } else {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Language Core & Memory Model' : 'Core Data Structures (Linear)', 'SDE_DSA', company));
      }
    } 
    else if (p <= 0.50) { // Phase 02: Mastery
      if (isFE || (isFS && p <= 0.4)) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'React Reconciliation' : 'State Management Patterns', 'FRONTEND', company));
      } else if (isBE || (isFS && p > 0.4)) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'API Security & Auth' : 'Database Internals & SQL', 'BACKEND', company));
      } else if (isML) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Neural Network Theory' : 'Deep Learning Architectures', 'ML_AI', company));
      } else if (isDevOps) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Containerization (Docker)' : 'Orchestration (Kubernetes)', 'DEVOPS', company));
      } else if (isQuant) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Low-Latency Architecture' : 'Concurrency & Threads', 'QUANT', company));
      } else {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Dynamic Programming Mastery' : 'Graph Algorithms', 'SDE_DSA', company));
      }
    }
    else if (p <= 0.75) { // Phase 03: Architecture
      if (isBE || isFS || isFE) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Low Level Design (Patterns)' : 'High Level Design (Scale)', 'SYS_DESIGN', company));
      } else if (isDevOps) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Infrastructure as Code' : 'High Level Design (Scale)', 'DEVOPS', company));
      } else if (isQuant) {
         curriculum.push(getDetailedWeek(w, w % 2 === 1 ? 'Stochastic Calculus & Risk' : 'Low-Latency Architecture', 'QUANT', company));
      } else {
         curriculum.push(getDetailedWeek(w, 'Distributed Systems Architecture', currentDomain, company));
      }
    }
    else { // Phase 04: Expert specialization
      if (w === totalWeeks - 3) {
         if (company === 'Amazon' && isSDE) curriculum.push(getDetailedWeek(w, 'Amazon Leadership Principles', currentDomain, company));
         else if (isDevOps) curriculum.push(getDetailedWeek(w, 'Cloud Providers (AWS/GCP)', 'DEVOPS', company));
         else curriculum.push(getDetailedWeek(w, 'Advanced Industry Trends', currentDomain, company));
      }
      else if (w === totalWeeks - 2) curriculum.push(getDetailedWeek(w, 'Elite Final Project build', currentDomain, company));
      else if (w === totalWeeks - 1) curriculum.push(getDetailedWeek(w, 'Mock Behavioral & Code Review', currentDomain, company));
      else curriculum.push(getDetailedWeek(w, 'Final Expert Placement Strategy', currentDomain, company));
    }
  }

  return curriculum;
};

export const findBestPathId = (role: string, targetCompany?: string): string | null => {
  const normRole = (role || '').toLowerCase().replace(' engineer', '').replace(' developer', '').trim();
  const cleanCompInput = (targetCompany || '').toLowerCase().replace(/[^a-z0-9]/g, ''); // Aggressive: "j.p. morgan" -> "jpmorgan"
  
  // 🥇 Try exact role + company match
  const bestShot = PREDEFINED_PATHS.find(p => {
    const pRole = p.role.toLowerCase();
    const pComp = p.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    return (pComp === cleanCompInput || pComp.includes(cleanCompInput) || cleanCompInput.includes(cleanCompInput)) && 
           (pRole.includes(normRole) || normRole.includes(pRole));
  });
  if (bestShot) return bestShot.id;

  // 🥈 Try company match ONLY (Priority over generic role match)
  const companyOnlyShot = PREDEFINED_PATHS.find(p => {
    const pComp = p.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    return (pComp === cleanCompInput || pComp.includes(cleanCompInput) || (cleanCompInput.length > 3 && cleanCompInput.includes(pComp)));
  });
  if (companyOnlyShot) return companyOnlyShot.id;

  // 🥉 Fallback to Role Match (Synthetic Reskinning v28.0)
  const roleShotIndex = PREDEFINED_PATHS.findIndex(p => {
    const pRole = p.role.toLowerCase();
    return pRole.includes(normRole) || normRole.includes(pRole);
  });
  
  if (roleShotIndex !== -1) {
      // Return the ID but we will Reskin it in getAdaptedPath
      return PREDEFINED_PATHS[roleShotIndex].id;
  }

  return PREDEFINED_PATHS[0]?.id || null;
};

export const getAdaptedPath = (basePath: PredefinedPath, timelineStr: string, actualCompany?: string, actualRole?: string): PredefinedPath => {
  const t = timelineStr.toLowerCase();
  let months = 4;
  if (t.includes('1 month')) months = 1;
  else if (t.includes('3 month')) months = 3;
  else if (t.includes('6 month')) months = 6;
  else if (t.includes('1 year')) months = 12;
  else {
    const num = parseInt(t);
    if (!isNaN(num)) months = num;
  }

  // 📐 Universal Scaling Protocol (v11.0)
  let moduleCount = 12; // default
  if (months === 1) moduleCount = 6;
  else if (months <= 3) moduleCount = 12;
  else if (months <= 6) moduleCount = 18;
  else if (months >= 12) moduleCount = 24;

  // 🎭 SYNTHETIC RESKINNING (v28.0)
  // If the user's actual company doesn't match the basePath.company, we reskin it.
  const targetCompany = (actualCompany && actualCompany.trim()) || basePath.company;
  const targetRole = (actualRole && actualRole.trim()) || basePath.role;
  const targetLogo = LOGOS[targetCompany] || LOGOS[targetCompany.split(' ')[0]] || basePath.logo;

  return {
    ...basePath,
    title: `${targetCompany} ${targetRole} Elite Roadmap`,
    company: targetCompany,
    role: targetRole as EliteRole,
    logo: targetLogo,
    estimatedHours: months * 120,
    moduleCount: moduleCount,
    videoCount: months * 60,
    questionCount: months * 110,
    description: `Full ${months}-Month (${moduleCount} Modules) Precision-Curated career path for ${targetRole} aspirants at ${targetCompany}. Strictly matched to your corporate goals.`,
    curriculum: getUniqueCurriculum(targetRole as EliteRole, targetCompany, months)
  };
}

// 🏛️ SALARY & COMPANY MATRIX
const SALARIES: Record<Category, Partial<Record<EliteRole, string>>> = {
  'MAANG': { 
    'Software Development Engineer (SDE)': '₹25L - ₹60L', 
    'Frontend Engineer': '₹22L - ₹55L',
    'Fullstack Engineer': '₹24L - ₹58L',
    'ML Engineer': '₹30L - ₹70L', 
    'Data Engineer': '₹25L - ₹50L', 
    'DevOps Engineer': '₹20L - ₹45L', 
    'Cloud Engineer': '₹22L - ₹50L', 
    'Security Engineer': '₹25L - ₹55L', 
    'Mobile Developer': '₹20L - ₹40L', 
    'SRE': '₹30L - ₹65L' 
  },
  'HFT': { 
    'Quant Developer': '₹40L - ₹1.2 Cr', 
    'Quant Researcher': '₹50L - ₹1.5 Cr', 
    'Low Latency C++ Engineer': '₹40L - ₹1 Cr', 
    'ML Engineer': '₹35L - ₹80L', 
    'Data Engineer': '₹30L - ₹70L' 
  },
  'Fintech': { 
    'Backend Engineer': '₹18L - ₹45L', 
    'Fullstack Engineer': '₹15L - ₹35L', 
    'Data Scientist': '₹20L - ₹40L', 
    'ML Engineer': '₹25L - ₹50L', 
    'Security Engineer': '₹20L - ₹45L', 
    'Blockchain Developer': '₹20L - ₹50L' 
  },
  'Product-Based': { 
    'Software Development Engineer (SDE)': '₹12L - ₹35L', 
    'Frontend Engineer': '₹11L - ₹30L',
    'Fullstack Engineer': '₹10L - ₹30L', 
    'Backend Engineer': '₹15L - ₹35L', 
    'Mobile Developer': '₹12L - ₹28L', 
    'DevOps Engineer': '₹15L - ₹30L', 
    'QA Automation': '₹8L - ₹20L' 
  },
  'Service-Based': { 
    'Software Engineer': '₹3L - ₹10L', 
    'System Engineer': '₹3L - ₹8L', 
    'QA Automation': '₹3L - ₹7L', 
    'Data Analyst': '₹4L - ₹10L' 
  },
  'Big4': { 
    'Data Analyst': '₹6L - ₹15L', 
    'Data Scientist': '₹8L - ₹20L', 
    'Security Engineer': '₹8L - ₹22L', 
    'Cloud Engineer': '₹8L - ₹18L', 
    'AI Engineer': '₹10L - ₹22L', 
    'Tech Consultant': '₹7L - ₹18L' 
  },
  'Banking': {
    'Software Development Engineer (SDE)': '₹25L - ₹65L',
    'Frontend Engineer': '₹20L - ₹45L',
    'Fullstack Engineer': '₹22L - ₹50L',
    'Backend Engineer': '₹22L - ₹55L',
    'Data Engineer': '₹18L - ₹40L',
    'Security Engineer': '₹20L - ₹50L'
  }
};

const LOGOS: Record<string, string> = {
  'Google': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
  'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.svg',
  'Meta': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
  'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'LinkedIn': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  'Uber': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Uber_logo_2018.svg',
  'Airbnb': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg',
  'Stripe': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  'PayPal': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  'GitHub': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  'Salesforce': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
  'Adobe': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg',
  'Jane Street': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Jane_Street_Capital_logo.svg/1200px-Jane_Street_Capital_logo.svg.png',
  'Citadel': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Citadel_logo.svg',
  'Tower Research': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Tower_Research_Capital_Logo.svg/1200px-Tower_Research_Capital_Logo.svg.png',
  'HRT': 'https://pbs.twimg.com/profile_images/1458852654316310530/p9nC_6L2_400x400.jpg',
  'Jump Trading': 'https://pbs.twimg.com/profile_images/1691456545112223744/w_2O66iV_400x400.jpg',
  'Hudson River': 'https://pbs.twimg.com/profile_images/1458852654316310530/p9nC_6L2_400x400.jpg',
  'Optiver': 'https://pbs.twimg.com/profile_images/1585640306145615872/J_4c8qFf_400x400.png',
  'Citadel Securities': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Citadel_logo.svg',
  'Goldman Sachs': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs_logo.svg',
  'JPMorgan': 'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008.svg',
  'Citi': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Citibank.svg',
  'Morgan Stanley': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo.svg',
  'Razorpay': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Razorpay_logo.svg',
  'PhonePe': 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg',
  'TCS': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
  'Infosys': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
  'Wipro': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Logo.png',
  'Accenture': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
  'Capgemini': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg',
  'Deloitte': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
  'PwC': 'https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg',
  'EY': 'https://upload.wikimedia.org/wikipedia/commons/3/34/EY_logo_2019.svg',
  'KPMG': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg'
};

const CATEGORIES: Category[] = ['MAANG', 'HFT', 'Fintech', 'Product-Based', 'Big4', 'Service-Based', 'Banking'];
const COMPANIES: Record<Category, string[]> = {
  'MAANG': ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'LinkedIn', 'Uber', 'Salesforce', 'Adobe', 'Stripe', 'PayPal', 'Airbnb', 'GitHub', 'TikTok', 'Zoom', 'Discord'],
  'HFT': ['Jane Street', 'Tower Research', 'Citadel', 'Quadeye', 'Optiver', 'HRT', 'Jump Trading', 'Hudson River', 'Gravity', 'AlphaGrep', 'WorldQuant', 'Two Sigma', 'D.E. Shaw', 'Millennium', 'Point72', 'Balasny', 'Flow Traders', 'DRW', 'Virtu', 'G-Research'],
  'Fintech': ['Razorpay', 'PhonePe', 'Stripe', 'PayPal', 'Paytm', 'Cred', 'Groww', 'Zerodha', 'Robinhood', 'Revolut', 'Square', 'Adyen', 'Wise', 'Klarna', 'Wealthsimple', 'Coinbase', 'Binance', 'Uniswap', 'LendingKart', 'BharatPe'],
  'Product-Based': ['Atlassian', 'Adobe', 'Salesforce', 'Uber', 'Booking.com', 'Airbnb', 'Shopify', 'HubSpot', 'Splunk', 'Twilio', 'Okta', 'DataDog', 'Snowflake', 'MongoDB', 'Cloudflare', 'Elastic', 'Unity', 'Roblox', 'Palantir', 'Epic Games'],
  'Service-Based': ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Accenture', 'Capgemini', 'IBM', 'LTI', 'Mindtree', 'Tech Mahindra', 'DXC', 'Atos', 'EPAM', 'Globant', 'Zensar', 'Persistent', 'Oracle', 'NTT Data', 'UST'],
  'Big4': ['Deloitte', 'PwC', 'EY', 'KPMG', 'Mckinsey', 'BCG', 'Bain', 'Accenture Strategy', 'Oliver Wyman', 'L.E.K', 'Roland Berger', 'Grant Thornton', 'BDO', 'RSM', 'Mazars', 'Alvarez & Marsal', 'ZS Associates', 'Booz Allen', 'Gartner', 'Capco'],
  'Banking': ['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'Citibank', 'Deutsche Bank', 'Bank of America', 'Wells Fargo', 'Barclays', 'HSBC', 'Standard Chartered']
};

export const PREDEFINED_PATHS: PredefinedPath[] = [];
const seenPaths = new Set<string>();

CATEGORIES.forEach(cat => {
  const roles = Object.keys(SALARIES[cat]) as EliteRole[];
  const firms = COMPANIES[cat];

  firms.forEach(firm => {
    roles.forEach(role => {
      const pathId = `v4-${cat}-${firm}-${role}`.toLowerCase().replace(/ /g, '-');
      if (seenPaths.has(pathId)) return;
      seenPaths.add(pathId);

      const IndiaSal = SALARIES[cat][role] || '₹15L - ₹35L';
      const UsaSal = (cat === 'MAANG' || cat === 'HFT' || cat === 'Product-Based' || cat === 'Banking') ? '$130k - $220k' : '$90k - $160k';

      PREDEFINED_PATHS.push({
        id: pathId,
        title: `${firm} ${role} Elite Roadmap`,
        company: firm,
        companyType: cat,
        role: role,
        level: 'Advanced',
        estimatedHours: 480,
        videoCount: 240, 
        moduleCount: 16, 
        questionCount: 450, 
        learnerCount: 12000 + Math.floor(Math.random() * 5000),
        logo: LOGOS[firm] || '',
        salaryRange: IndiaSal,
        usaSalary: UsaSal,
        targetJobRole: `Principal ${role} at ${firm}`,
        description: `Precision-Curated career path for ${role} aspirants at ${firm}. Dynamic timeline support enabled.`,
        outcomes: [`Master ${role} standards at ${firm}`, 'Production-Grade Project Portfolio', 'Verified Interview Pattern Mastery'],
        features: [`Weekly Industry-Standard Deep Dives`, 'Strategic Mock Interview Simulations', 'Direct Path to Referral Standards'],
        curriculum: getUniqueCurriculum(role, firm, 4)
      });
    });
  });
});

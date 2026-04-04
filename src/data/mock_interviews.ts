export interface MockQuestion {
  text: string;
  type?: 'question' | 'instruction' | 'coding';
  boilerplate?: Record<string, string>;
  problemDescription?: string;
  testCases?: { input: string; output: string }[];
}

export interface MockRound {
  name: string;
  questions: MockQuestion[];
}

export interface RoleInterview {
  intro: MockRound;
  technical: MockRound;
  coding: MockRound;
  hr: MockRound;
}

export const MOCK_INTERVIEWS: Record<string, RoleInterview> = {
  "Software Engineer": {
    intro: {
      name: "Introduction",
      questions: [
        { text: "Welcome to the Software Engineering interview. To start, could you please introduce yourself and tell me about your most significant project?" },
        { text: "That's interesting. What was the biggest technical challenge you faced while building that project, and how did you resolve it?" }
      ]
    },
    technical: {
      name: "Technical Assessment",
      questions: [
        { text: "Let's dive into some core concepts. Can you explain the difference between a process and a thread? When would you use multi-threading?" },
        { text: "How does a database index work internally? Explain B-Trees vs Hash Indexes." },
        { text: "In System Design, what are the primary trade-offs between vertical and horizontal scaling? When should we prefer one over the other?" }
      ]
    },
    coding: {
      name: "Interactive Coding",
      questions: [
        { 
          text: "I'd like you to solve an LRU Cache problem. Please implement the class.",
          type: 'coding',
          problemDescription: `### 146. LRU Cache
Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.

**Example 1:**
\`\`\`
Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output
[null, null, null, 1, null, -1, null, -1, 3, 4]
\`\`\`

**Constraints:**
- \`1 <= capacity <= 3000\`
- \`0 <= key <= 10000\`
- \`0 <= value <= 10^5\`
- At most \`2 * 10^5\` calls will be made to \`get\` and \`put\`.`,
          testCases: [
            { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', output: '[null, null, null, 1, null, -1, null, -1, 3, 4]' }
          ],
          boilerplate: {
            javascript: `class LRUCache {\n  /**\n   * @param {number} capacity\n   */\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  /**\n   * @param {number} key\n   * @return {number}\n   */\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  /**\n   * @param {number} key\n   * @param {number} value\n   * @return {void}\n   */\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n  }\n}`,
            python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        # TODO: Implement O(1) get\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # TODO: Implement O(1) put\n        pass`,
            java: `class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n    }\n}`,
            cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n    }\n    \n    int get(int key) {\n        return -1;\n    }\n    \n    void put(int key, int value) {\n    }\n};`
          }
        }
      ]
    },
    hr: {
      name: "Behavioral Round",
      questions: [
        { text: "Tell me about a time you had a conflict with a teammate. How did you handle it and what was the outcome?" },
        { text: "Where do you see yourself in terms of technical growth over the next 5 years?" },
        { text: "Finally, why do you want to join our engineering team specifically?" }
      ]
    }
  },
  "ML Engineer": {
    intro: {
      name: "Introduction",
      questions: [
        { text: "Hi, let's start with your background in Machine Learning. Can you tell me about the most complex ML model you've deployed to production?" },
        { text: "How did you measure the success of that model? What metrics did you use?" }
      ]
    },
    technical: {
      name: "ML Foundations",
      questions: [
        { text: "Explain the Bias-Variance tradeoff. How does regularizing a model affect this tradeoff?" },
        { text: "What is the difference between Random Forest and Gradient Boosting? When would you use one over the other?" },
        { text: "How do you handle imbalanced datasets in classification tasks? Mention at least three techniques." }
      ]
    },
    coding: {
      name: "ML Coding",
      questions: [
        { 
          text: "Implement a Simple Linear Regression model from scratch.",
          type: 'coding',
          problemDescription: `### 1. Simple Linear Regression
Implement a basic Linear Regression model that fits a line to training data using Gradient Descent.

Your class should support:
- **__init__(learning_rate, iterations)**: Set hyperparameters.
- **fit(X, y)**: Optimize weights and bias using MSE gradient descent.
- **predict(X)**: Predict values for new inputs.

**Example:**
\`\`\`python
X = [1, 2, 3]
y = [2, 4, 6]
model = LinearRegression()
model.fit(X, y)
print(model.predict([4])) # Expected: ~8
\`\`\`

**Constraints:**
- Use only NumPy or raw arrays (no Scikit-learn).
- Time Complexity for fit: O(iterations * N).`,
          testCases: [
            { input: 'X=[1,2,3], y=[2,4,6], target=[4]', output: '8.0' }
          ],
          boilerplate: {
            python: `import numpy as np\n\nclass LinearRegression:\n    def __init__(self, lr=0.01, n_iters=1000):\n        self.lr = lr\n        self.n_iters = n_iters\n        self.weights = None\n        self.bias = None\n\n    def fit(self, X, y):\n        # TODO: Implement fit logic\n        pass\n\n    def predict(self, X):\n        # TODO: Implement predict logic\n        return None`,
            javascript: `class LinearRegression {\n  constructor(lr=0.01, nIters=1000) {\n    this.lr = lr;\n    this.nIters = nIters;\n    this.weights = null;\n    this.bias = null;\n  }\n\n  fit(X, y) {\n    // Implement fit logic\n  }\n\n  predict(X) {\n    // Implement predict logic\n  }\n}`
          }
        }
      ]
    },
    hr: {
      name: "Behavioral Round",
      questions: [
        { text: "The ML field moves fast. How do you stay updated with the latest research papers and techniques?" },
        { text: "Explain a time when you had to explain a complex ML model's decision to a non-technical stakeholder." }
      ]
    }
  }
};

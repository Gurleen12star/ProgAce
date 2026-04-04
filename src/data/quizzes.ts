export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  explanation: string;
}

export interface QuizSet {
  id: string;
  topic: string;
  questions: QuizQuestion[];
}

export const DATABASE_QUIZZES: Record<string, QuizSet> = {
  'quiz-sde_dsa-1': {
    id: 'quiz-sde_dsa-1',
    topic: 'Arrays & Time Complexity',
    questions: [
      {
        id: 'q1',
        question: 'What is the time complexity of searching an element in a sorted array using Binary Search?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'Binary Search repeatedly divides the search interval in half, leading to logarithmic time complexity.'
      },
      {
        id: 'q2',
        question: 'Which of the following is not a stable sorting algorithm?',
        options: ['Merge Sort', 'Insertion Sort', 'Quick Sort', 'Bubble Sort'],
        correctAnswer: 2,
        explanation: 'Quick Sort is generally not stable as it may swap equal elements during partitioning.'
      },
      {
         id: 'q3',
         question: 'Which data structure is best for implementing a LIFO (Last-In-First-Out) behavior?',
         options: ['Queue', 'Stack', 'Linked List', 'Tree'],
         correctAnswer: 1,
         explanation: 'Stacks follow LIFO principle where the last element added is the first one removed.'
      },
      {
         id: 'q4',
         question: 'What is the space complexity of an adjacency matrix representation of a graph with V vertices?',
         options: ['O(V)', 'O(E)', 'O(V^2)', 'O(V+E)'],
         correctAnswer: 2,
         explanation: 'An adjacency matrix is a V x V matrix, requiring O(V^2) space.'
      },
      {
         id: 'q5',
         question: 'Which approach is typically used to solve the Fractional Knapsack problem?',
         options: ['Dynamic Programming', 'Greedy Approach', 'Backtracking', 'Divide and Conquer'],
         correctAnswer: 1,
         explanation: 'Fractional Knapsack can be solved greedily by picking items with the highest value-to-weight ratio.'
      }
      // Scaling to 10 for production... truncated for demo brevity but logic remains same
    ]
  },
  'quiz-sys_design-1': {
    id: 'quiz-sys_design-1',
    topic: 'Scalability & Load Balancing',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary purpose of a Load Balancer?',
        options: ['Data Encryption', 'Distributing traffic across servers', 'Storing large files', 'Formatting database queries'],
        correctAnswer: 1,
        explanation: 'Load balancers distribute incoming network traffic across multiple servers to ensure high availability and reliability.'
      },
      {
        id: 'q2',
        question: 'Which of these is a technique for horizontal database scaling?',
        options: ['Adding more RAM', 'Database Sharding', 'Increasing CPU clock speed', 'Using SSDs'],
        correctAnswer: 1,
        explanation: 'Sharding involves partitioning data across multiple database instances (horizontal scaling).'
      }
    ]
  },
  'quiz-ml_ai-1': {
    id: 'quiz-ml_ai-1',
    topic: 'Foundations of Machine Learning',
    questions: [
      {
        id: 'q1',
        question: 'What does "Backpropagation" primarily do in a Neural Network?',
        options: ['Calculates the loss', 'Updates weights using gradients', 'Initializes the weights', 'Visualizes the data'],
        correctAnswer: 1,
        explanation: 'Backpropagation propagates the error gradient backwards through the network to update the weights.'
      },
      {
        id: 'q2',
        question: 'Which activation function is most commonly used in the hidden layers of modern deep networks?',
        options: ['Sigmoid', 'ReLU', 'Softmax', 'Identity'],
        correctAnswer: 1,
        explanation: 'ReLU (Rectified Linear Unit) is widely used because it helps mitigate the vanishing gradient problem.'
      }
    ]
  }
};

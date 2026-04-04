import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { goal, role, focus, language } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY Missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `You are a World-Class Technical Interviewer and Domain Expert. 
Generate exactly 5 multiple-choice questions (MCQs) with MIXED DIFFICULTY (Easy, Medium, Hard) to evaluate a student's expertise in a specific professional domain.

- Target Role: ${role || 'Software Engineer'}
- Focus Area: ${focus || 'General Computer Science'}
- Strategic Goal: ${goal || 'Skill Evaluation'}
- Language/Tech: ${language || 'Relevant Stacks'}

REQUIREMENTS:
1. Questions MUST BE SPECIFIC to the Focus Area (${focus}). If Focus is "Deep Learning", ask about Backprop, Tensors, or Transformers. If "Full Stack", ask about State Management, SSR, or API Design. 
2. Do NOT just ask generic DSA questions unless the role is "Competitive Programmer".
3. Difficulty: 1 Easy, 3 Medium, 1 Hard.

JSON Structure:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0
    }
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate a unique 5-question test paper with mixed difficulty. Ensure valid JSON format." }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    let quizData;
    try {
      quizData = JSON.parse(content);
      if (!quizData.questions || quizData.questions.length < 5) {
         throw new Error("INCOMPLETE_QUESTION_SET");
      }
    } catch (e) {
      console.error("Quiz Error (Parse or Length):", content);
      throw new Error("INVALID_LLM_OUTPUT");
    }

    return NextResponse.json(quizData);

  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    // STABLE 5-QUESTION FALLBACK
    return NextResponse.json({ 
      error: 'Using fallback diagnostic',
      questions: [
        { id: 1, question: "What is the time complexity of a Linear Search in an array of size N?", options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], correctAnswer: 2 },
        { id: 2, question: "Which data structure follows the LIFO (Last In First Out) principle?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correctAnswer: 1 },
        { id: 3, question: "What is the average case complexity of Quick Sort?", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], correctAnswer: 1 },
        { id: 4, question: "In a balanced BST like AVL, what is the maximum height?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctAnswer: 1 },
        { id: 5, question: "Which algorithm is used to find the shortest path in a weighted graph with no negative edges?", options: ["BFS", "DFS", "Dijkstra", "Kruskal"], correctAnswer: 2 }
      ]
    }, { status: 200 }); 
  }
}

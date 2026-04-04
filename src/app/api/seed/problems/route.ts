import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Pre-defined list of Top 100 LeetCode problems (Slugs)
// We use these to guide Gemini in generating the detailed problem data.
const PROBLEM_SEEDS = [
  "two-sum", "valid-parentheses", "merge-two-sorted-lists", "best-time-to-buy-and-sell-stock",
  "valid-palindrome", "invert-binary-tree", "valid-anagram", "binary-search", "flood-fill",
  "lowest-common-ancestor-of-a-binary-search-tree", "balanced-binary-tree", "linked-list-cycle",
  "implement-queue-using-stacks", "first-bad-version", "ransom-note", "climbing-stairs",
  "longest-palindrome", "reverse-linked-list", "majority-element", "add-binary",
  "diameter-of-binary-tree", "middle-of-the-linked-list", "maximum-depth-of-binary-tree",
  "contains-duplicate", "meeting-rooms", "roman-to-integer", "backspace-string-compare",
  "evaluate-reverse-polish-notation", "01-matrix", "k-closest-points-to-origin",
  "longest-substring-without-repeating-characters", "3sum", "binary-tree-level-order-traversal",
  "clone-graph", "evaluate-reverse-polish-notation", "course-schedule", "implement-trie-prefix-tree",
  "coin-change", "product-of-array-except-self", "min-stack", "validate-binary-search-tree",
  "number-of-islands", "rotting-oranges", "search-in-rotated-sorted-array", "combination-sum",
  "permutations", "merge-intervals", "lowest-common-ancestor-of-a-binary-tree",
  "time-based-key-value-store", "accounts-merge", "sort-colors", "word-break", "partition-equal-subset-sum",
  "string-to-integer-atoi", "spiral-matrix", "subsets", "binary-tree-right-side-view",
  "longest-palindromic-substring", "unique-paths", "construct-binary-tree-from-preorder-and-inorder-traversal",
  "container-with-most-water", "letter-combinations-of-a-phone-number", "word-search",
  "find-all-anagrams-in-a-string", "minimum-height-trees", "task-scheduler", "lru-cache",
  "kth-smallest-element-in-a-bst", "daily-temperatures", "house-robber", "gas-station",
  "next-permutation", "valid-sudoku", "group-anagrams", "maximum-product-subarray",
  "design-add-and-search-words-data-structure", "lfu-cache", "trapping-rain-water",
  "median-of-two-sorted-arrays", "serialize-and-deserialize-binary-tree", "word-ladder",
  "basic-calculator", "maximum-profit-in-job-scheduling", "merge-k-sorted-lists",
  "largest-rectangle-in-histogram", "binary-tree-maximum-path-sum", "regular-expression-matching",
  "n-queens", "minimum-window-substring", "longest-valid-parentheses", "edit-distance"
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get('count') || '5');
  const offset = parseInt(searchParams.get('offset') || '0');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // We use anon for now, assuming RLS allows insert for dev
  const geminiKey = process.env.GEMINI_API_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  const batch = PROBLEM_SEEDS.slice(offset, offset + count);
  const results = [];

  for (const slug of batch) {
    try {
      console.log(`Generating problem: ${slug}`);
      
      const prompt = `Generate a high-quality competitive programming challenge JSON for the topic "${slug}". 
      Requirements:
      - Title: Professional problem title.
      - Difficulty: Easy, Medium, or Hard.
      - Category: e.g., Arrays, Stacks, DP, Trees.
      - Description: Full Markdown description with Examples (Input/Output) and Constraints.
      - Starter Codes: Provide full function boilerplates for JavaScript, Python, C++, and Java.
      - Test Cases: Exactly 3 high-quality cases with input (array of args) and expected output.
      
      Output must be a single JSON object with these keys: slug, title, difficulty, category, description, starter_codes, test_cases.`;

      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { 
              temperature: 0.1, 
              maxOutputTokens: 2048
            },
          }),
        }
      );

      const aiData = await aiRes.json();
      
      if (aiData.error) {
        console.error("GEMINI API ERROR:", aiData.error);
        throw new Error(aiData.error.message);
      }

      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error("EMPTY AI RESPONSE:", JSON.stringify(aiData, null, 2));
        throw new Error("AI returned empty response (possibly safety block)");
      }
      
      // Better JSON extraction
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("AI failed to return valid JSON structure: " + rawText.substring(0, 100));
      }
      
      const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
      const problemData = JSON.parse(jsonStr);
      problemData.slug = slug; // Ensure slug matches our seed

      const { data, error } = await supabase
        .from('problems')
        .upsert(problemData, { onConflict: 'slug' })
        .select()
        .single();

      if (error) throw error;
      results.push({ slug, status: 'success', id: data.id });

    } catch (err: any) {
      console.error(`Failed ${slug}:`, err.message);
      results.push({ slug, status: 'failed', error: err.message });
    }
  }

  return NextResponse.json({ 
    message: `Seeding batch finished. Processed ${results.length} problems.`,
    results 
  });
}

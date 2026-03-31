// Unified AI service using Groq (primary) with OpenAI as fallback
// Groq is FREE at https://console.groq.com

export interface AnalysisResult {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionScores: {
    format: number;
    content: number;
    keywords: number;
    readability: number;
  };
}

// ────────────────────────────────────────────────
// Generic AI caller — tries Groq first, then OpenAI
// ────────────────────────────────────────────────
async function callAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  // 1️⃣ Try Groq (free tier)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.length > 20 && groqKey !== "your-groq-api-key-here") {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        console.warn("Groq API error:", res.status, await res.text());
      }
    } catch (err: any) {
      console.warn("Groq call failed:", err?.message);
    }
  }

  // 2️⃣ Try OpenAI as fallback
  const openaiKey = process.env.OPENAI_API_KEY;
  if (
    openaiKey &&
    openaiKey.length > 20 &&
    openaiKey !== "your-openai-api-key-here"
  ) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: openaiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
      const content = response.choices[0]?.message?.content;
      if (content) return content;
    } catch (err: any) {
      console.warn("OpenAI call failed:", err?.message);
    }
  }

  return null;
}

function parseJSON<T>(content: string, fallback: T): T {
  try {
    const clean = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(clean);
  } catch {
    console.error("Failed to parse AI JSON response");
    return fallback;
  }
}

// ────────────────────────────────────────────────
// Resume Analysis
// ────────────────────────────────────────────────
const MOCK_ANALYSIS: AnalysisResult = {
  atsScore: 72,
  strengths: [
    "Professional formatting with clear sections",
    "Good use of action verbs in experience",
    "Relevant technical skills listed",
  ],
  weaknesses: [
    "Missing quantifiable achievements (numbers/metrics)",
    "Could improve keyword optimization for ATS",
    "Summary section is too generic",
  ],
  missingKeywords: ["Project Management", "Agile", "Data Analysis", "Leadership"],
  suggestions: [
    "Add specific metrics: 'Increased sales by 25%' instead of 'Increased sales'",
    "Include more industry-specific keywords from job descriptions",
    "Expand your professional summary to 3-4 compelling sentences",
    "Add a certifications section if applicable",
  ],
  sectionScores: { format: 78, content: 68, keywords: 62, readability: 82 },
};

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  const systemPrompt =
    "You are an expert ATS resume analyzer. Always respond with valid JSON only.";
  const userPrompt = `
Analyze the following resume and return a JSON object:
{
  "atsScore": number (0-100),
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "missingKeywords": string[],
  "suggestions": string[],
  "sectionScores": { "format": number, "content": number, "keywords": number, "readability": number }
}

Resume:
${resumeText}

Return ONLY the JSON object, no extra text.
`;

  const content = await callAI(systemPrompt, userPrompt);
  if (!content) {
    console.warn("All AI providers failed — returning mock analysis");
    return MOCK_ANALYSIS;
  }
  return parseJSON(content, MOCK_ANALYSIS);
}

// ────────────────────────────────────────────────
// Job Match
// ────────────────────────────────────────────────
const MOCK_MATCH = {
  matchPercentage: 65,
  matchingSkills: ["JavaScript", "React", "Node.js", "Communication"],
  missingSkills: ["Python", "AWS", "Docker", "Kubernetes"],
  recommendations: [
    "Add Python to your skills section if you have experience",
    "Highlight any cloud platform experience (AWS/Azure/GCP)",
    "Include DevOps tools if applicable",
    "Emphasize relevant project experience",
  ],
};

export async function matchJobDescription(
  resumeText: string,
  jobDescription: string
): Promise<typeof MOCK_MATCH> {
  const systemPrompt =
    "You are an expert job matching analyzer. Always respond with valid JSON only.";
  const userPrompt = `
Compare the resume with the job description and return:
{
  "matchPercentage": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "recommendations": string[]
}

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY the JSON object, no extra text.
`;

  const content = await callAI(systemPrompt, userPrompt);
  if (!content) {
    console.warn("All AI providers failed — returning mock job match");
    return MOCK_MATCH;
  }
  return parseJSON(content, MOCK_MATCH);
}

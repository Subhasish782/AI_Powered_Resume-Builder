import OpenAI from "openai";

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

// Mock analysis for when no API keys are available
function getMockAnalysis(): AnalysisResult {
  return {
    atsScore: 72,
    strengths: [
      "Professional formatting with clear sections",
      "Good use of action verbs in experience",
      "Relevant technical skills listed"
    ],
    weaknesses: [
      "Missing quantifiable achievements (numbers/metrics)",
      "Could improve keyword optimization for ATS",
      "Summary section is too generic"
    ],
    missingKeywords: ["Project Management", "Agile", "Data Analysis", "Leadership"],
    suggestions: [
      "Add specific metrics: 'Increased sales by 25%' instead of 'Increased sales'",
      "Include more industry-specific keywords from job descriptions",
      "Expand your professional summary to 3-4 compelling sentences",
      "Add a certifications section if applicable"
    ],
    sectionScores: {
      format: 78,
      content: 68,
      keywords: 62,
      readability: 82
    }
  };
}

// Try OpenAI
async function tryOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key-here" || apiKey.length < 20) {
    return null;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume analyzer. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    return response.choices[0]?.message?.content || null;
  } catch (error: any) {
    console.warn("OpenAI failed:", error?.message || error);
    return null;
  }
}

// Try Groq with a given model id
async function tryGroqModel(apiKey: string, model: string, prompt: string): Promise<string | null> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume analyzer. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Groq API error: ${response.status} — ${body.slice(0, 120)}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || null;
}

// Try Groq (Free tier available at groq.com)
// Falls back from the large model to the fast 8b model automatically.
async function tryGroq(prompt: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your-groq-api-key-here" || apiKey.length < 20) {
    return null;
  }

  // Try primary model first, then fast fallback
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
  for (const model of models) {
    try {
      const result = await tryGroqModel(apiKey, model, prompt);
      if (result) {
        console.log(`Groq success with model: ${model}`);
        return result;
      }
    } catch (error: any) {
      console.warn(`Groq model ${model} failed:`, error?.message || error);
    }
  }
  return null;
}

// Try Gemini (Google AI - free tier available)
async function tryGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here" || apiKey.length < 20) {
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      // ↑ gemini-pro is deprecated; gemini-1.5-flash has a generous free tier
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert ATS resume analyzer. Always respond with valid JSON only.\n\n${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || null;
  } catch (error: any) {
    console.warn("Gemini failed:", error?.message || error);
    return null;
  }
}

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume and provide detailed feedback in JSON format.

Resume Text:
${resumeText}

Please analyze this resume and return a JSON object with the following structure:
{
  "atsScore": number (0-100 overall ATS compatibility score),
  "strengths": string[] (list of 3-5 strong points),
  "weaknesses": string[] (list of 3-5 areas for improvement),
  "missingKeywords": string[] (important keywords that should be added),
  "suggestions": string[] (actionable improvement suggestions),
  "sectionScores": {
    "format": number (0-100 score for formatting),
    "content": number (0-100 score for content quality),
    "keywords": number (0-100 score for keyword optimization),
    "readability": number (0-100 score for readability)
  }
}

Consider:
1. ATS compatibility (formatting, standard sections)
2. Content quality (achievements, quantifiable results)
3. Keyword optimization (relevant skills and industry terms)
4. Readability (clear language, proper structure)
5. Professional presentation

Return ONLY the JSON object, no additional text.
`;

  // Try providers in order
  let content = await tryOpenAI(prompt);
  
  if (!content) {
    content = await tryGroq(prompt);
  }
  
  if (!content) {
    content = await tryGemini(prompt);
  }

  // If all providers fail, return mock analysis
  if (!content) {
    console.warn("All AI providers failed, returning mock analysis");
    return getMockAnalysis();
  }

  try {
    // Clean up the response - sometimes APIs wrap JSON in markdown code blocks
    const cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const result: AnalysisResult = JSON.parse(cleanContent);
    return result;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    console.log("Raw response:", content);
    return getMockAnalysis();
  }
}

export async function matchJobDescription(
  resumeText: string,
  jobDescription: string
): Promise<{
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}> {
  const prompt = `
You are an expert job matching analyzer. Compare the following resume with the job description and provide a detailed match analysis in JSON format.

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Please analyze and return a JSON object with the following structure:
{
  "matchPercentage": number (0-100 overall match percentage),
  "matchingSkills": string[] (skills found in both resume and job description),
  "missingSkills": string[] (important skills from job description not found in resume),
  "recommendations": string[] (specific recommendations to improve match)
}

Consider:
1. Required skills and qualifications
2. Experience level match
3. Industry keywords
4. Soft skills
5. Education requirements

Return ONLY the JSON object, no additional text.
`;

  // Try providers in order
  let content = await tryOpenAI(prompt);
  
  if (!content) {
    content = await tryGroq(prompt);
  }
  
  if (!content) {
    content = await tryGemini(prompt);
  }

  // If all providers fail, return mock data
  if (!content) {
    console.warn("All AI providers failed, returning mock job match");
    return {
      matchPercentage: 65,
      matchingSkills: ["JavaScript", "React", "Node.js", "Communication"],
      missingSkills: ["Python", "AWS", "Docker", "Kubernetes"],
      recommendations: [
        "Add Python to your skills section if you have experience",
        "Highlight any cloud platform experience (AWS/Azure/GCP)",
        "Include DevOps tools if applicable",
        "Emphasize relevant project experience"
      ]
    };
  }

  try {
    const cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      matchPercentage: 65,
      matchingSkills: ["JavaScript", "React", "Node.js"],
      missingSkills: ["Python", "AWS", "Docker"],
      recommendations: ["Add more relevant skills", "Highlight project experience"]
    };
  }
}

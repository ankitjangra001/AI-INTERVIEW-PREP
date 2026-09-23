const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// ===============================
// AI JOB ANALYSIS
// ===============================

const analyzeJobWithAI = async (jobTitle, jobDescription, skills) => {

  const prompt = `
You are an expert job interview preparation assistant.

Analyze the following job information.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Existing Skills:
${skills?.join(", ") || "Not provided"}

Return ONLY valid JSON.

The JSON must follow exactly this structure:

{
  "jobRole": "string",
  "difficulty": "Beginner | Intermediate | Advanced",
  "skills": ["skill1", "skill2"],
  "topics": ["topic1", "topic2"],
  "interviewFocus": ["area1", "area2"]
}

Identify the important technical skills, interview topics,
and major interview focus areas from the job description.
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3
  });

  let text = response.choices[0].message.content.trim();

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
};


// ===============================
// AI INTERVIEW MCQ QUESTIONS
// ===============================

const generateInterviewQuestionsWithAI = async (
  jobTitle,
  jobDescription,
  skills
) => {

  const prompt = `
You are an expert technical interviewer.

Generate exactly 10 multiple-choice interview questions
for the following job.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Skills:
${skills?.join(", ") || "Not provided"}

Rules:

1. Generate exactly 10 questions.
2. Every question must have exactly 4 options.
3. Only ONE option must be correct.
4. Questions should be relevant to the job.
5. Mix technical concepts and practical interview knowledge.
6. Difficulty can be Easy, Medium or Hard.
7. Do NOT provide explanations.
8. Return ONLY valid JSON.
9. Do NOT use markdown.
10. correctAnswer must exactly match one of the options.

Return this exact structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option A",
      "type": "Technical",
      "difficulty": "Medium"
    }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4
  });

  let text = response.choices[0].message.content.trim();

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const result = JSON.parse(text);

  return result;
};


module.exports = {
  analyzeJobWithAI,
  generateInterviewQuestionsWithAI
};
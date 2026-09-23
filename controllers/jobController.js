const Job = require("../models/Job");
const {
  analyzeJobWithAI,
  generateInterviewQuestionsWithAI
} = require("../services/aiService");

// CREATE JOB
const createJob = async (req, res) => {
    try {
        const {
            jobTitle,
            companyName,
            experience,
            jobDescription,
            skills
        } = req.body;

        if (!jobTitle || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Job title and job description are required"
            });
        }

        const job = await Job.create({
            user: req.user.id,
            jobTitle,
            companyName,
            experience,
            jobDescription,
            skills
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL USER JOBS
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE JOB
const getJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.json({
            success: true,
            job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE JOB
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ANALYZE JOB USING AI
const analyzeJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const analysis = await analyzeJobWithAI(
      job.jobTitle,
      job.jobDescription,
      job.skills
    );

    job.aiAnalysis = {
      jobRole: analysis.jobRole,
      difficulty: analysis.difficulty,
      skills: analysis.skills,
      topics: analysis.topics,
      interviewFocus: analysis.interviewFocus,
      analyzedAt: new Date()
    };

    await job.save();

    res.json({
      success: true,
      message: "Job analyzed successfully",
      analysis: job.aiAnalysis
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze job",
      error: error.message
    });
  }
};

// GENERATE INTERVIEW QUESTIONS USING AI
const generateInterviewQuestions = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const analysis = job.aiAnalysis;

        const prompt = `
You are an expert technical interviewer.

Generate 5 interview questions for the following job.

Job Title:
${job.jobTitle}

Company:
${job.companyName || "Not specified"}

Experience:
${job.experience || "Not specified"}

Job Description:
${job.jobDescription}

Required Skills:
${job.skills?.join(", ") || "Not specified"}

AI Job Analysis:
Job Role: ${analysis?.jobRole || "Not available"}
Difficulty: ${analysis?.difficulty || "Not available"}
Important Topics: ${analysis?.topics?.join(", ") || "Not available"}
Interview Focus: ${analysis?.interviewFocus?.join(", ") || "Not available"}

Requirements:
1. Generate exactly 5 questions.
2. Questions should be relevant to this specific job.
3. Mix technical and conceptual questions.
4. Include questions from the required skills.
5. Difficulty should match the job.
6. Do not provide answers.
7. Return ONLY valid JSON.

JSON format:
{
  "questions": [
    {
      "question": "Question text",
      "type": "Technical",
      "difficulty": "Easy"
    }
  ]
}
`;

        const result = await generateInterviewQuestionsWithAI(prompt);

        res.json({
            success: true,
            questions: result.questions
        });

    } catch (error) {
        console.error("QUESTION GENERATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate interview questions",
            error: error.message
        });
    }
};
module.exports = {
    createJob,
    getJobs,
    getJob,
    deleteJob,
    analyzeJob,
    generateInterviewQuestions

};
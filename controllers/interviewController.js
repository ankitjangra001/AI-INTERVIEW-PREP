const Interview = require("../models/Interview");
const Job = require("../models/Job");

// ==========================================
// SAVE INTERVIEW RESULT
// ==========================================
const saveInterview = async (req, res) => {
  try {
    const {
      jobId,
      questions,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
    } = req.body;

    // Check job belongs to logged-in user
    const job = await Job.findOne({
      _id: jobId,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Create interview record
    const interview = await Interview.create({
      user: req.user.id,
      job: job._id,
      jobTitle: job.jobTitle,
      companyName: job.companyName || "",

      questions,

      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
    });

    res.status(201).json({
      success: true,
      message: "Interview saved successfully",
      interview,
    });
  } catch (error) {
    console.error("SAVE INTERVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save interview",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL INTERVIEW HISTORY
// ==========================================
const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("job", "jobTitle companyName");

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("GET INTERVIEW HISTORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE INTERVIEW DETAILS
// ==========================================
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("job", "jobTitle companyName");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
      error: error.message,
    });
  }
};


module.exports = {
  saveInterview,
  getInterviewHistory,
  getInterviewById,
};
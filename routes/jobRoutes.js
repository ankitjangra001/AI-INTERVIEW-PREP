const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createJob,
    getJobs,
    getJob,
    deleteJob,
    analyzeJob,
    generateInterviewQuestions

} = require("../controllers/jobController");

const router = express.Router();

// All routes are protected
router.use(protect);

// Create Job
router.post("/", createJob);

// Get All Jobs
router.get("/", getJobs);

// Get Single Job
router.get("/:id", getJob);

// Delete Job
router.delete("/:id", deleteJob);

router.post("/:id/analyze", analyzeJob);

router.post(
    "/:id/questions",
    protect,
    generateInterviewQuestions
);

module.exports = router;
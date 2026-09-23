const express = require("express");

const {
  saveInterview,
  getInterviewHistory,
  getInterviewById,
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SAVE INTERVIEW
// POST /api/interviews
// ==========================================
router.post("/", protect, saveInterview);


// ==========================================
// GET ALL INTERVIEW HISTORY
// GET /api/interviews
// ==========================================
router.get("/", protect, getInterviewHistory);


// ==========================================
// GET SINGLE INTERVIEW DETAILS
// GET /api/interviews/:id
// ==========================================
router.get("/:id", protect, getInterviewById);


module.exports = router;
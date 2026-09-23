const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        companyName: {
            type: String,
            trim: true
        },

        experience: {
            type: String,
            trim: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            default: []
        },
        aiAnalysis: {
  jobRole: {
    type: String
  },

  difficulty: {
    type: String
  },

  skills: {
    type: [String],
    default: []
  },

  topics: {
    type: [String],
    default: []
  },

  interviewFocus: {
    type: [String],
    default: []
  },

  analyzedAt: {
    type: Date
  }
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    experience: "",
    jobDescription: "",
    skills: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create Job
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobTitle: formData.jobTitle,
            companyName: formData.companyName,
            experience: formData.experience,
            jobDescription: formData.jobDescription,

            // Convert skills string into array
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
          }),
        }
      );

      const data = await response.json();

      console.log("CREATE JOB RESPONSE:", data);

      if (data.success) {
        setMessage("Job created successfully!");

        setTimeout(() => {
          navigate("/jobs");
        }, 800);
      } else {
        setMessage(
          data.message || "Failed to create job"
        );
      }
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">

      {/* HEADER */}

      <div className="create-job-header">
        <button
          className="back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <div className="create-job-brand">
          🤖 AI Interview Prep
        </div>
      </div>

      {/* FORM CONTAINER */}

      <div className="create-job-container">

        <div className="create-job-title">
          <div className="create-job-icon">
            💼
          </div>

          <div>
            <h1>Create New Job</h1>

            <p>
              Add a job to start your AI-powered
              interview preparation.
            </p>
          </div>
        </div>

        <form
          className="create-job-form"
          onSubmit={handleSubmit}
        >

          {/* JOB TITLE */}

          <div className="form-group">
            <label htmlFor="jobTitle">
              Job Title *
            </label>

            <input
              id="jobTitle"
              type="text"
              name="jobTitle"
              placeholder="e.g. Full Stack Developer"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* COMPANY */}

          <div className="form-group">
            <label htmlFor="companyName">
              Company Name
            </label>

            <input
              id="companyName"
              type="text"
              name="companyName"
              placeholder="e.g. Google"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          {/* EXPERIENCE */}

          <div className="form-group">
            <label htmlFor="experience">
              Experience
            </label>

            <input
              id="experience"
              type="text"
              name="experience"
              placeholder="e.g. 0-2 years"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* SKILLS */}

          <div className="form-group">
            <label htmlFor="skills">
              Required Skills
            </label>

            <input
              id="skills"
              type="text"
              name="skills"
              placeholder="e.g. React, Node.js, MongoDB, JavaScript"
              value={formData.skills}
              onChange={handleChange}
            />

            <small>
              Separate multiple skills using commas.
            </small>
          </div>

          {/* JOB DESCRIPTION */}

          <div className="form-group">
            <label htmlFor="jobDescription">
              Job Description *
            </label>

            <textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Paste the complete job description here..."
              rows="8"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>

          {/* MESSAGE */}

          {message && (
            <div className="create-job-message">
              {message}
            </div>
          )}

          {/* BUTTONS */}

          <div className="create-job-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading
                ? "Creating Job..."
                : "Create Job"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default CreateJob;
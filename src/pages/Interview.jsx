import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Interview.css";

function Interview() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("INTERVIEW JOB RESPONSE:", data);

      if (data.success) {
        setJob(data.job);
      } else {
        setMessage(data.message || "Unable to fetch job");
      }
    } catch (error) {
      console.error("FETCH INTERVIEW JOB ERROR:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleStartInterview = () => {
    navigate(`/questions/${jobId}`);
  };

  if (loading) {
    return (
      <div className="interview-page">
        <div className="interview-loading">
          <div className="interview-loading-icon">🤖</div>
          <h2>Loading Interview...</h2>
          <p>Preparing your interview session.</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="interview-page">
        <div className="interview-error">
          <div>⚠️</div>
          <h2>Unable to Load Interview</h2>
          <p>{message}</p>

          <button onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page">

      <header className="interview-header">

        <button
          className="interview-back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <div className="interview-brand">
          🤖 AI Interview Prep
        </div>

      </header>

      <main className="interview-container">

        <div className="interview-hero">

          <div className="interview-icon">
            🎤
          </div>

          <h1>AI Interview</h1>

          <p>
            Test your knowledge and prepare for your real interview
            with AI-generated questions.
          </p>

        </div>

        {job && (
          <div className="job-summary">

            <div className="job-summary-header">
              <div className="job-summary-icon">
                💼
              </div>

              <div>
                <h2>{job.jobTitle}</h2>
                <p>
                  {job.companyName || "Company not specified"}
                </p>
              </div>
            </div>

            <div className="job-summary-details">

              <div className="summary-item">
                <span>Experience</span>
                <strong>
                  {job.experience || "Not specified"}
                </strong>
              </div>

              <div className="summary-item">
                <span>Skills</span>
                <strong>
                  {job.skills?.length || 0} skills
                </strong>
              </div>

            </div>

          </div>
        )}

        <div className="interview-info">

          <h2>How the Interview Works</h2>

          <div className="steps">

            <div className="step">

              <div className="step-number">
                1
              </div>

              <div>
                <h3>AI Generates Questions</h3>

                <p>
                  Questions will be generated based on the
                  selected job and required skills.
                </p>
              </div>

            </div>

            <div className="step">

              <div className="step-number">
                2
              </div>

              <div>
                <h3>Answer Questions</h3>

                <p>
                  Answer each interview question as if you
                  were in a real interview.
                </p>
              </div>

            </div>

            <div className="step">

              <div className="step-number">
                3
              </div>

              <div>
                <h3>AI Evaluates Your Answer</h3>

                <p>
                  AI will analyze your answer and provide
                  feedback and a score.
                </p>
              </div>

            </div>

            <div className="step">

              <div className="step-number">
                4
              </div>

              <div>
                <h3>Get Your Result</h3>

                <p>
                  At the end, you will receive your overall
                  interview performance.
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="interview-rules">

          <h2>Before You Start</h2>

          <ul>
            <li>Make sure you understand the question before answering.</li>
            <li>Try to answer honestly without copying answers.</li>
            <li>Explain your technical concepts clearly.</li>
            <li>Take your time and think before submitting.</li>
          </ul>

        </div>

        <div className="interview-action">

          <button
            className="start-interview-button"
            onClick={handleStartInterview}
          >
            Start Interview →
          </button>

        </div>

      </main>

    </div>
  );
}

export default Interview;
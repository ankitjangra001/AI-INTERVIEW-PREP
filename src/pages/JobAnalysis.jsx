import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./JobAnalysis.css";

function JobAnalysis() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const analyzeJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("AI ANALYSIS RESPONSE:", data);

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setMessage(
          data.message || "Failed to analyze job"
        );
      }
    } catch (error) {
      console.error("AI ANALYSIS ERROR:", error);

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeJob();
  }, [jobId]);

  return (
    <div className="analysis-page">

      {/* HEADER */}

      <header className="analysis-header">

        <button
          className="analysis-back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <div className="analysis-brand">
          🤖 AI Interview Prep
        </div>

      </header>

      {/* MAIN */}

      <main className="analysis-container">

        <div className="analysis-heading">

          <div className="analysis-main-icon">
            🤖
          </div>

          <div>
            <h1>AI Job Analysis</h1>

            <p>
              AI-powered analysis of your selected
              job opportunity.
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="analysis-loading">

            <div className="loading-icon">
              🤖
            </div>

            <h2>Analyzing Job...</h2>

            <p>
              AI is analyzing the job requirements
              and preparing your interview strategy.
            </p>

            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>

          </div>
        )}

        {/* ERROR */}

        {!loading && message && (
          <div className="analysis-error">

            <div>⚠️</div>

            <h2>Analysis Failed</h2>

            <p>{message}</p>

            <button
              onClick={() => {
                setLoading(true);
                setMessage("");
                analyzeJob();
              }}
            >
              Try Again
            </button>

          </div>
        )}

        {/* ANALYSIS RESULT */}

        {!loading && analysis && (
          <div className="analysis-result">

            {/* OVERVIEW */}

            <section className="analysis-card">

              <div className="card-title">
                <span>🎯</span>
                <h2>Job Overview</h2>
              </div>

              <div className="overview-grid">

                <div className="overview-item">

                  <span>Job Role</span>

                  <strong>
                    {analysis.jobRole ||
                      "Not available"}
                  </strong>

                </div>

                <div className="overview-item">

                  <span>Difficulty</span>

                  <strong
                    className={`difficulty ${
                      analysis.difficulty
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {analysis.difficulty ||
                      "Not available"}
                  </strong>

                </div>

              </div>

            </section>

            {/* SKILLS */}

            <section className="analysis-card">

              <div className="card-title">
                <span>🛠️</span>
                <h2>Required Skills</h2>
              </div>

              {analysis.skills &&
              analysis.skills.length > 0 ? (
                <div className="analysis-tags">

                  {analysis.skills.map(
                    (skill, index) => (
                      <span
                        className="analysis-tag"
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="no-data">
                  No skills identified.
                </p>
              )}

            </section>

            {/* TOPICS */}

            <section className="analysis-card">

              <div className="card-title">
                <span>📚</span>
                <h2>Important Topics</h2>
              </div>

              {analysis.topics &&
              analysis.topics.length > 0 ? (
                <div className="topics-list">

                  {analysis.topics.map(
                    (topic, index) => (
                      <div
                        className="topic-item"
                        key={index}
                      >
                        <span className="topic-number">
                          {index + 1}
                        </span>

                        <span>{topic}</span>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <p className="no-data">
                  No topics identified.
                </p>
              )}

            </section>

            {/* INTERVIEW FOCUS */}

            <section className="analysis-card interview-focus-card">

              <div className="card-title">
                <span>🎤</span>
                <h2>Interview Focus</h2>
              </div>

              {analysis.interviewFocus &&
              analysis.interviewFocus.length > 0 ? (
                <ul className="focus-list">

                  {analysis.interviewFocus.map(
                    (focus, index) => (
                      <li key={index}>
                        {focus}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="no-data">
                  No interview focus available.
                </p>
              )}

            </section>

            {/* ACTION */}

            <div className="analysis-action">

              <button
                className="start-interview-button"
                onClick={() =>
                  navigate(
                    `/interview/${jobId}`
                  )
                }
              >
                Start Interview →
              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default JobAnalysis;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewHistory.css";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInterviewHistory();
  }, []);

  const fetchInterviewHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/interviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("INTERVIEW HISTORY RESPONSE:", data);

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to load interview history."
        );
        setLoading(false);
        return;
      }

      setInterviews(data.interviews || []);
      setLoading(false);
    } catch (error) {
      console.error("INTERVIEW HISTORY ERROR:", error);

      setMessage("Unable to connect to server.");
      setLoading(false);
    }
  };

  const getPerformance = (score) => {
    if (score >= 80) {
      return {
        text: "Excellent",
        className: "excellent",
      };
    }

    if (score >= 60) {
      return {
        text: "Good",
        className: "good",
      };
    }

    if (score >= 40) {
      return {
        text: "Average",
        className: "average",
      };
    }

    return {
      text: "Needs Practice",
      className: "needs-practice",
    };
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="history-page loading-page">
        <div className="history-loading">
          <div className="history-loader"></div>

          <h2>Loading Interview History...</h2>

          <p>
            Fetching your previous interview results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">

      {/* HEADER */}
      <header className="history-header">

        <div className="history-heading">

          <span className="history-label">
            AI INTERVIEW PREP
          </span>

          <h1>Interview History</h1>

          <p>
            Track your previous interviews and review your
            performance.
          </p>

        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/jobs")}
        >
          ← Dashboard
        </button>

      </header>


      {/* SUMMARY */}
      <section className="history-summary">

        <div className="summary-card">

          <div className="summary-icon purple">
            📊
          </div>

          <div>
            <span>Total Interviews</span>
            <strong>{interviews.length}</strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon green">
            ✓
          </div>

          <div>
            <span>Questions Attempted</span>

            <strong>
              {interviews.reduce(
                (total, interview) =>
                  total + (interview.totalQuestions || 0),
                0
              )}
            </strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon blue">
            🎯
          </div>

          <div>
            <span>Average Score</span>

            <strong>
              {interviews.length > 0
                ? Math.round(
                    interviews.reduce(
                      (total, interview) =>
                        total + (interview.score || 0),
                      0
                    ) / interviews.length
                  )
                : 0}
              %
            </strong>
          </div>

        </div>

      </section>


      {/* ERROR */}
      {message && (
        <div className="history-message">
          ⚠️ {message}
        </div>
      )}


      {/* EMPTY STATE */}
      {!message && interviews.length === 0 && (
        <div className="empty-history">

          <div className="empty-icon">
            📋
          </div>

          <h2>No Interviews Yet</h2>

          <p>
            You haven't completed any interviews yet.
            Start your first AI-powered interview and
            your results will appear here.
          </p>

          <button
            onClick={() => navigate("/jobs")}
          >
            Start an Interview →
          </button>

        </div>
      )}


      {/* INTERVIEW LIST */}
      {interviews.length > 0 && (
        <section className="history-section">

          <div className="history-section-header">

            <div>
              <span>YOUR ACTIVITY</span>
              <h2>Previous Interviews</h2>
            </div>

            <div className="interview-count">
              {interviews.length}{" "}
              {interviews.length === 1
                ? "Interview"
                : "Interviews"}
            </div>

          </div>


          <div className="interview-list">

            {interviews.map((interview, index) => {

              const performance =
                getPerformance(interview.score || 0);

              return (
                <div
                  className="interview-history-card"
                  key={interview._id}
                >

                  {/* CARD TOP */}

                  <div className="history-card-top">

                    <div className="history-job">

                      <div className="job-history-icon">
                        💼
                      </div>

                      <div>

                        <h3>
                          {interview.jobTitle ||
                            interview.job?.jobTitle ||
                            "Interview"}
                        </h3>

                        <p>
                          {interview.companyName ||
                            interview.job?.companyName ||
                            "Company not specified"}
                        </p>

                      </div>

                    </div>


                    <div
                      className={`performance-badge ${performance.className}`}
                    >
                      {performance.text}
                    </div>

                  </div>


                  {/* DATE */}

                  <div className="interview-date">

                    <span>📅</span>

                    <span>
                      {formatDate(interview.createdAt)}
                    </span>

                    <span className="date-separator">
                      •
                    </span>

                    <span>
                      {formatTime(interview.createdAt)}
                    </span>

                  </div>


                  {/* STATS */}

                  <div className="history-card-stats">

                    <div className="history-stat">

                      <span>Total</span>

                      <strong>
                        {interview.totalQuestions || 0}
                      </strong>

                    </div>


                    <div className="history-stat correct-history">

                      <span>Correct</span>

                      <strong>
                        {interview.correctAnswers || 0}
                      </strong>

                    </div>


                    <div className="history-stat wrong-history">

                      <span>Wrong</span>

                      <strong>
                        {interview.wrongAnswers || 0}
                      </strong>

                    </div>


                    <div className="history-score">

                      <span>Score</span>

                      <strong>
                        {interview.score || 0}%
                      </strong>

                    </div>

                  </div>


                  {/* PROGRESS */}

                  <div className="history-progress">

                    <div className="progress-track-history">

                      <div
                        className="progress-fill-history"
                        style={{
                          width: `${interview.score || 0}%`,
                        }}
                      ></div>

                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="history-card-footer">

                    <span>
                      Interview #{interviews.length - index}
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          `/interview-history/${interview._id}`
                        )
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </section>
      )}

    </div>
  );
}

export default InterviewHistory;
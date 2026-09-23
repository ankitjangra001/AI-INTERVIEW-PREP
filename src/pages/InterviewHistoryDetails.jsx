import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./InterviewHistoryDetails.css";

function InterviewHistoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInterviewDetails();
  }, [id]);

  const fetchInterviewDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/interviews/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("INTERVIEW DETAILS RESPONSE:", data);

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to load interview details."
        );
        setLoading(false);
        return;
      }

      setInterview(data.interview);
      setLoading(false);
    } catch (error) {
      console.error("INTERVIEW DETAILS ERROR:", error);

      setMessage("Unable to connect to server.");
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
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
      <div className="details-page loading-details">
        <div className="details-loader"></div>
        <h2>Loading Interview Details...</h2>
        <p>Please wait while we fetch your interview result.</p>
      </div>
    );
  }

  if (message || !interview) {
    return (
      <div className="details-page">
        <div className="details-error">
          <div className="error-icon">⚠️</div>

          <h2>Unable to Load Interview</h2>

          <p>{message || "Interview not found."}</p>

          <button onClick={() => navigate("/interview-history")}>
            ← Back to History
          </button>
        </div>
      </div>
    );
  }

  const score = interview.score || 0;

  return (
    <div className="details-page">

      {/* HEADER */}
      <header className="details-header">
        <div>
          <span className="details-label">
            AI INTERVIEW PREP
          </span>

          <h1>Interview Details</h1>

          <p>
            Review your answers, correct answers and
            performance.
          </p>
        </div>

        <div className="details-header-buttons">
          <button
            className="history-back-btn"
            onClick={() => navigate("/interview-history")}
          >
            ← History
          </button>

          <button
            className="dashboard-details-btn"
            onClick={() => navigate("/jobs")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* INTERVIEW INFO */}
      <section className="details-info-card">

        <div className="details-job-info">

          <div className="details-job-icon">
            💼
          </div>

          <div>
            <span>INTERVIEW</span>

            <h2>
              {interview.jobTitle ||
                interview.job?.jobTitle ||
                "Interview"}
            </h2>

            <p>
              {interview.companyName ||
                interview.job?.companyName ||
                "Company not specified"}
            </p>

            <div className="details-date">
              📅 {formatDate(interview.createdAt)}
              <span>•</span>
              {formatTime(interview.createdAt)}
            </div>
          </div>

        </div>

        <div className="details-score-box">

          <div
            className="score-circle-details"
            style={{
              "--score": `${score * 3.6}deg`,
            }}
          >
            <div>
              <strong>{score}%</strong>
              <span>Score</span>
            </div>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="details-stats">

        <div className="detail-stat-card">
          <span className="stat-icon purple">📋</span>
          <div>
            <span>Total Questions</span>
            <strong>
              {interview.totalQuestions || 0}
            </strong>
          </div>
        </div>

        <div className="detail-stat-card correct-card">
          <span className="stat-icon green">✓</span>
          <div>
            <span>Correct Answers</span>
            <strong>
              {interview.correctAnswers || 0}
            </strong>
          </div>
        </div>

        <div className="detail-stat-card wrong-card">
          <span className="stat-icon red">✕</span>
          <div>
            <span>Wrong Answers</span>
            <strong>
              {interview.wrongAnswers || 0}
            </strong>
          </div>
        </div>

      </section>

      {/* QUESTIONS */}
      <section className="questions-details-section">

        <div className="questions-details-heading">
          <div>
            <span>ANSWER REVIEW</span>
            <h2>Question-wise Analysis</h2>
          </div>

          <div className="question-count-details">
            {interview.questions?.length || 0} Questions
          </div>
        </div>

        <div className="details-question-list">

          {interview.questions?.map((item, index) => (

            <div
              className={`details-question-card ${
                item.isCorrect
                  ? "question-correct"
                  : "question-wrong"
              }`}
              key={index}
            >

              {/* QUESTION HEADER */}
              <div className="question-details-top">

                <div className="question-number">
                  Q{index + 1}
                </div>

                <div className="question-status">

                  {item.isCorrect ? (
                    <span className="correct-badge">
                      ✓ Correct
                    </span>
                  ) : (
                    <span className="wrong-badge">
                      ✕ Wrong
                    </span>
                  )}

                </div>

              </div>

              {/* QUESTION */}
              <h3 className="details-question-text">
                {item.question}
              </h3>

              {/* OPTIONS */}
              {item.options?.length > 0 && (
                <div className="details-options">

                  {item.options.map((option, optionIndex) => {

                    const isCorrect =
                      option === item.correctAnswer;

                    const isUserAnswer =
                      option === item.userAnswer;

                    let optionClass = "";

                    if (isCorrect) {
                      optionClass = "option-correct";
                    } else if (isUserAnswer) {
                      optionClass = "option-wrong";
                    }

                    return (
                      <div
                        className={`details-option ${optionClass}`}
                        key={optionIndex}
                      >

                        <span className="option-letter">
                          {String.fromCharCode(
                            65 + optionIndex
                          )}
                        </span>

                        <span className="option-text">
                          {option}
                        </span>

                        {isCorrect && (
                          <span className="option-label">
                            ✓ Correct Answer
                          </span>
                        )}

                        {!isCorrect &&
                          isUserAnswer && (
                            <span className="option-label">
                              ✕ Your Answer
                            </span>
                          )}

                      </div>
                    );
                  })}

                </div>
              )}

              {/* ANSWER SUMMARY */}
              <div className="answer-summary">

                <div className="answer-box your-answer">

                  <span>Your Answer</span>

                  <strong>
                    {item.userAnswer || "Not Answered"}
                  </strong>

                </div>

                <div className="answer-box correct-answer">

                  <span>Correct Answer</span>

                  <strong>
                    {item.correctAnswer}
                  </strong>

                </div>

              </div>

              {/* EXPLANATION */}
              {item.explanation && (
                <div className="explanation-box">

                  <div className="explanation-title">
                    💡 Explanation
                  </div>

                  <p>
                    {item.explanation}
                  </p>

                </div>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* BOTTOM BUTTONS */}
      <div className="details-bottom-actions">

        <button
          className="bottom-history-btn"
          onClick={() => navigate("/interview-history")}
        >
          ← Back to Interview History
        </button>

        <button
          className="bottom-dashboard-btn"
          onClick={() => navigate("/jobs")}
        >
          Go to Dashboard →
        </button>

      </div>

    </div>
  );
}

export default InterviewHistoryDetails;
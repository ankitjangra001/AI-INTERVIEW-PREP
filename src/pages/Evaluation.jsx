import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Evaluation.css";

function Evaluation() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEvaluationData();
  }, []);

  const loadEvaluationData = () => {
    try {
      const storedQuestions =
        localStorage.getItem("interviewQuestions");

      const storedAnswers =
        localStorage.getItem("interviewAnswers");

      if (!storedQuestions || !storedAnswers) {
        setMessage("Interview data not found.");
        setLoading(false);
        return;
      }

      const parsedQuestions = JSON.parse(storedQuestions);
      const parsedAnswers = JSON.parse(storedAnswers);

      setQuestions(parsedQuestions);
      setAnswers(parsedAnswers);

      let correctCount = 0;

      parsedQuestions.forEach((question, index) => {
        const userAnswer = parsedAnswers[index];

        if (
          userAnswer &&
          userAnswer === question.correctAnswer
        ) {
          correctCount++;
        }
      });

      const total = parsedQuestions.length;
      const wrongCount = total - correctCount;

      const calculatedPercentage =
        total > 0
          ? Math.round((correctCount / total) * 100)
          : 0;

      setCorrect(correctCount);
      setWrong(wrongCount);
      setPercentage(calculatedPercentage);

      setLoading(false);
    } catch (error) {
      console.error("EVALUATION DATA ERROR:", error);
      setMessage("Unable to load evaluation data.");
      setLoading(false);
    }
  };

  const saveInterviewResult = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login again.");
        return;
      }

      setSaving(true);
      setMessage("");

      const finalQuestions = questions.map(
        (question, index) => {
          const userAnswer = answers[index] || "";

          return {
            question: question.question,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            userAnswer: userAnswer,
            isCorrect:
              userAnswer === question.correctAnswer,
            explanation: question.explanation || "",
          };
        }
      );

      const response = await fetch(
        "http://localhost:5000/api/interviews",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobId: jobId,
            questions: finalQuestions,
            totalQuestions: questions.length,
            correctAnswers: correct,
            wrongAnswers: wrong,
            score: percentage,
          }),
        }
      );

      const data = await response.json();

      console.log("SAVE INTERVIEW RESPONSE:", data);

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Interview could not be saved."
        );

        setSaving(false);
        return;
      }

      setSaved(true);
      setSaving(false);
      setMessage("Interview saved successfully.");
    } catch (error) {
      console.error("SAVE INTERVIEW ERROR:", error);

      setMessage(
        "Server error while saving interview."
      );

      setSaving(false);
    }
  };

  const getPerformance = () => {
    if (percentage >= 80) {
      return {
        title: "Excellent Performance!",
        text: "You have demonstrated a strong understanding of the topics.",
        icon: "🏆",
      };
    }

    if (percentage >= 60) {
      return {
        title: "Good Performance!",
        text: "You have a good foundation. Keep practicing to improve further.",
        icon: "👍",
      };
    }

    if (percentage >= 40) {
      return {
        title: "Keep Practicing!",
        text: "You have the basics, but more practice will help you improve.",
        icon: "📚",
      };
    }

    return {
      title: "More Practice Needed",
      text: "Review the concepts and try another interview.",
      icon: "💪",
    };
  };

  if (loading) {
    return (
      <div className="evaluation-page loading-page">
        <div className="loading-card">
          <div className="loader"></div>
          <h2>Analyzing Your Interview...</h2>
          <p>Please wait while we prepare your results.</p>
        </div>
      </div>
    );
  }

  if (message === "Interview data not found.") {
    return (
      <div className="evaluation-page">
        <div className="error-card">
          <div className="error-icon">⚠️</div>

          <h2>Interview Data Not Found</h2>

          <p>
            We couldn't find your interview evaluation data.
          </p>

          <button onClick={() => navigate("/jobs")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const performance = getPerformance();

  return (
    <div className="evaluation-page">

      {/* HEADER */}
      <header className="evaluation-header">
        <div>
          <span className="header-label">
            AI INTERVIEW PREP
          </span>

          <h1>Interview Evaluation</h1>

          <p>
            Here's a detailed breakdown of your interview
            performance.
          </p>
        </div>

        <button
          className="header-dashboard-btn"
          onClick={() => navigate("/jobs")}
        >
          ← Dashboard
        </button>
      </header>


      {/* MAIN SCORE SECTION */}
      <section className="result-hero">

        <div className="score-section">

          <div
            className="score-circle"
            style={{
              "--score": `${percentage * 3.6}deg`,
            }}
          >
            <div className="score-inner">
              <span>{percentage}%</span>
              <small>Score</small>
            </div>
          </div>

          <div className="score-info">
            <div className="performance-icon">
              {performance.icon}
            </div>

            <div>
              <h2>{performance.title}</h2>

              <p>{performance.text}</p>
            </div>
          </div>

        </div>


        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon total-icon">
              📝
            </div>

            <div>
              <span>Total Questions</span>
              <strong>{questions.length}</strong>
            </div>
          </div>


          <div className="stat-card correct-card">
            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>Correct Answers</span>
              <strong>{correct}</strong>
            </div>
          </div>


          <div className="stat-card wrong-card">
            <div className="stat-icon">
              ✕
            </div>

            <div>
              <span>Wrong Answers</span>
              <strong>{wrong}</strong>
            </div>
          </div>

        </div>

      </section>


      {/* MESSAGE */}
      {message && (
        <div
          className={`save-message ${
            saved ? "success-message" : ""
          }`}
        >
          <span>{saved ? "✓" : "ℹ"}</span>
          {message}
        </div>
      )}


      {/* ACTION BUTTONS */}
      <section className="action-section">

        {!saved && (
          <button
            className="save-interview-btn"
            onClick={saveInterviewResult}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="button-loader"></span>
                Saving Interview...
              </>
            ) : (
              <>
                💾 Save Interview
              </>
            )}
          </button>
        )}

        {saved && (
          <button
            className="history-btn"
            onClick={() =>
              navigate("/interview-history")
            }
          >
            📊 View Interview History
          </button>
        )}

        <button
          className="retry-btn"
          onClick={() =>
            navigate(`/interview/${jobId}`)
          }
        >
          ↻ Try Again
        </button>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/jobs")}
        >
          Back to Dashboard
        </button>

      </section>


      {/* QUESTION ANALYSIS */}
      <section className="questions-section">

        <div className="section-heading">
          <div>
            <span>DETAILED ANALYSIS</span>
            <h2>Question-wise Performance</h2>
          </div>

          <div className="accuracy-badge">
            {percentage}% Accuracy
          </div>
        </div>


        {/* PROGRESS */}
        <div className="overall-progress">

          <div className="progress-header">
            <span>Overall Accuracy</span>
            <strong>{percentage}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>

        </div>


        {/* QUESTIONS */}
        <div className="question-list">

          {questions.map((question, index) => {

            const userAnswer =
              answers[index] || "";

            const isCorrect =
              userAnswer === question.correctAnswer;

            return (
              <div
                className={`question-card ${
                  isCorrect
                    ? "question-correct"
                    : "question-wrong"
                }`}
                key={question.id || index}
              >

                {/* QUESTION HEADER */}
                <div className="question-top">

                  <div className="question-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="question-title">
                    <span>
                      {question.type || "Technical"}
                    </span>

                    <span className="difficulty">
                      {question.difficulty || "Medium"}
                    </span>
                  </div>

                  <div
                    className={`result-badge ${
                      isCorrect
                        ? "correct-badge"
                        : "wrong-badge"
                    }`}
                  >
                    {isCorrect
                      ? "✓ Correct"
                      : "✕ Wrong"}
                  </div>

                </div>


                {/* QUESTION */}
                <h3>{question.question}</h3>


                {/* ANSWERS */}
                <div className="answer-grid">

                  <div
                    className={`answer-box ${
                      isCorrect
                        ? "your-correct"
                        : "your-wrong"
                    }`}
                  >

                    <div className="answer-label">
                      <span>Your Answer</span>

                      <span>
                        {isCorrect ? "✓" : "✕"}
                      </span>
                    </div>

                    <p>
                      {userAnswer ||
                        "Not Answered"}
                    </p>

                  </div>


                  <div className="answer-box correct-answer-box">

                    <div className="answer-label">
                      <span>Correct Answer</span>

                      <span>✓</span>
                    </div>

                    <p>
                      {question.correctAnswer}
                    </p>

                  </div>

                </div>


                {/* EXPLANATION */}
                {question.explanation && (
                  <div className="explanation-box">

                    <div className="explanation-title">
                      💡 Explanation
                    </div>

                    <p>
                      {question.explanation}
                    </p>

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </section>


      {/* BOTTOM CTA */}
      <section className="bottom-cta">

        <div>
          <span>READY FOR ANOTHER ROUND?</span>

          <h2>
            Keep improving your interview skills 🚀
          </h2>

          <p>
            Practice regularly and track your progress
            through Interview History.
          </p>
        </div>

        <button
          onClick={() => navigate("/jobs")}
        >
          Start Another Interview →
        </button>

      </section>

    </div>
  );
}

export default Evaluation;
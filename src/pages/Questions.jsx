import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Questions.css";

function Questions() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // GENERATE QUESTIONS
  // =========================
  const generateQuestions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/questions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("QUESTIONS RESPONSE:", data);

      if (data.success) {
        setQuestions(data.questions);

        // Initially no option selected
        setAnswers(new Array(data.questions.length).fill(""));
      } else {
        setMessage(
          data.message || "Failed to generate questions"
        );
      }
    } catch (error) {
      console.error("QUESTION ERROR:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [jobId]);

  // =========================
  // SELECT OPTION
  // =========================
  const handleOptionSelect = (option) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = option;

    setAnswers(updatedAnswers);
  };

  // =========================
  // NEXT
  // =========================
  const handleNext = () => {
    if (!answers[currentQuestion]) {
      alert("Please select an option first.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // =========================
  // PREVIOUS
  // =========================
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // =========================
  // FINISH
  // =========================
  const handleFinish = () => {
    if (!answers[currentQuestion]) {
      alert("Please select an option first.");
      return;
    }

    const emptyAnswer = answers.some(
      (answer) => !answer
    );

    if (emptyAnswer) {
      alert("Please answer all questions.");
      return;
    }

    localStorage.setItem(
      "interviewQuestions",
      JSON.stringify(questions)
    );

    localStorage.setItem(
      "interviewAnswers",
      JSON.stringify(answers)
    );

    navigate(`/evaluation/${jobId}`);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="questions-page">
        <div className="question-loading">
          <div className="question-loading-icon">
            🤖
          </div>

          <h2>Generating Interview Questions...</h2>

          <p>
            AI is preparing objective questions based
            on your job profile and required skills.
          </p>

          <div className="question-loading-bar">
            <div className="question-loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (message) {
    return (
      <div className="questions-page">
        <div className="question-error">
          <div>⚠️</div>

          <h2>Unable to Generate Questions</h2>

          <p>{message}</p>

          <button
            onClick={() =>
              navigate(`/interview/${jobId}`)
            }
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // NO QUESTIONS
  // =========================
  if (questions.length === 0) {
    return (
      <div className="questions-page">
        <div className="question-error">
          <h2>No Questions Generated</h2>

          <button
            onClick={() => {
              setLoading(true);
              generateQuestions();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="questions-page">

      {/* ================= NAVBAR ================= */}

      <header className="questions-navbar">

        <button
          className="questions-back-button"
          onClick={() =>
            navigate(`/interview/${jobId}`)
          }
        >
          ← Back
        </button>

        <div className="questions-brand">
          🤖 AI Interview Prep
        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="questions-container">

        {/* TITLE */}

        <div className="questions-title">

          <div className="questions-title-icon">
            🎯
          </div>

          <div>
            <h1>AI Interview Questions</h1>

            <p>
              Select the correct answer for each question.
            </p>
          </div>

        </div>

        {/* ================= PROGRESS ================= */}

        <div className="question-status">

          <div className="question-status-text">

            <span>
              Question {currentQuestion + 1}
            </span>

            <span>
              {currentQuestion + 1} /{" "}
              {questions.length}
            </span>

          </div>

          <div className="question-progress-bar">

            <div
              className="question-progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            ></div>

          </div>

        </div>

        {/* ================= QUESTION CARD ================= */}

        <div className="question-main-card">

          {/* TAGS */}

          <div className="question-tags">

            <span className="question-tag-blue">
              Question {currentQuestion + 1}
            </span>

            <span className="question-tag-grey">
              {question.type || "Technical"}
            </span>

            <span className="question-tag-yellow">
              {question.difficulty || "Medium"}
            </span>

          </div>

          {/* QUESTION */}

          <h2 className="question-text">
            {question.question}
          </h2>

          {/* ================= OPTIONS ================= */}

          <div className="question-options">

            {question.options?.map(
              (option, index) => {

                const isSelected =
                  answers[currentQuestion] === option;

                return (
                  <button
                    key={index}
                    className={`question-option ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleOptionSelect(option)
                    }
                  >

                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="option-text">
                      {option}
                    </span>

                    <span className="option-radio">
                      {isSelected ? "●" : "○"}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* ================= NAVIGATION ================= */}

        <div className="question-navigation">

          <button
            className="question-previous-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion <
          questions.length - 1 ? (

            <button
              className="question-next-button"
              onClick={handleNext}
            >
              Next Question →
            </button>

          ) : (

            <button
              className="question-finish-button"
              onClick={handleFinish}
            >
              Finish Interview →
            </button>

          )}

        </div>

      </main>

    </div>
  );
}

export default Questions;
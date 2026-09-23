import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Job.css";

function Job() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("User");

  // =========================
  // GET USER NAME
  // =========================
  const getUserName = () => {
  try {
    const userData = localStorage.getItem("user");

    console.log("STORED USER:", userData);

    if (!userData) {
      return;
    }

    const user = JSON.parse(userData);

    console.log("PARSED USER:", user);
    console.log("USER NAME:", user.name);

    if (user.name) {
      setUserName(user.name);
    }

  } catch (error) {
    console.error("USER DATA ERROR:", error);
  }
};
  // =========================
  // GET ALL JOBS
  // =========================
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("JOBS RESPONSE:", data);

      if (data.success) {
        setJobs(data.jobs);
      } else {
        setMessage(data.message || "Unable to fetch jobs");
      }
    } catch (error) {
      console.error("FETCH JOB ERROR:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE JOB
  // =========================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/job/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

      if (data.success) {
        setJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job._id !== jobId
          )
        );
      } else {
        setMessage(
          data.message || "Unable to delete job"
        );
      }
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      setMessage("Unable to connect to server");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // LOAD PAGE
  // =========================
  useEffect(() => {
    getUserName();
    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="jobs-navbar">

        {/* BRAND */}
        <div className="jobs-brand">

          <div className="jobs-logo">
            🤖
          </div>

          <div>
            <h2>AI Interview Prep</h2>

            <p>
              Interview preparation dashboard
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">

  <div className="user-profile">
    <div className="user-avatar">
      {userName.charAt(0).toUpperCase()}
    </div>

    <div className="user-details">
      <span>Welcome</span>
      <strong>{userName}</strong>
    </div>
  </div>

  <button
    className="history-dashboard-button"
    onClick={() => navigate("/interview-history")}
  >
    📊 Interview History
  </button>

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>

      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="jobs-content">

        {/* HEADER */}

        <div className="jobs-header">

          <div>

            <h1>
              My Jobs
            </h1>

            <p>
              Manage your job applications
              and prepare for interviews.
            </p>

          </div>

          <button
            className="add-job-button"
            onClick={() =>
              navigate("/create-job")
            }
          >
            + Create Job
          </button>

        </div>

        {/* =========================
            JOB COUNT
        ========================= */}

        <div className="job-count">

          Total Jobs:{" "}

          <strong>
            {jobs.length}
          </strong>

        </div>

        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <div className="jobs-message">
            {message}
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="jobs-loading">
            Loading jobs...
          </div>
        )}

        {/* =========================
            EMPTY JOBS
        ========================= */}

        {!loading &&
          jobs.length === 0 && (
            <div className="empty-jobs">

              <div className="empty-icon">
                💼
              </div>

              <h2>
                No Jobs Added Yet
              </h2>

              <p>
                Create your first job to
                start AI-powered interview
                preparation.
              </p>

              <button
                onClick={() =>
                  navigate("/create-job")
                }
              >
                Create Your First Job
              </button>

            </div>
          )}

        {/* =========================
            JOB CARDS
        ========================= */}

        {!loading &&
          jobs.length > 0 && (

            <div className="jobs-grid">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job._id}
                >

                  {/* CARD HEADER */}

                  <div className="job-card-header">

                    <div className="job-icon">
                      💼
                    </div>

                    <div>

                      <h2>
                        {job.jobTitle}
                      </h2>

                      <p>
                        {job.companyName ||
                          "Company not specified"}
                      </p>

                    </div>

                  </div>

                  {/* JOB INFO */}

                  <div className="job-info">

                    <div className="job-info-item">

                      <span>
                        Experience
                      </span>

                      <strong>
                        {job.experience ||
                          "Not specified"}
                      </strong>

                    </div>

                  </div>

                  {/* JOB DESCRIPTION */}

                  <div className="job-description">

                    <h3>
                      Job Description
                    </h3>

                    <p>
                      {job.jobDescription?.length >
                      160
                        ? `${job.jobDescription.substring(
                            0,
                            160
                          )}...`
                        : job.jobDescription}
                    </p>

                  </div>

                  {/* SKILLS */}

                  {job.skills &&
                    job.skills.length > 0 && (

                      <div className="job-skills">

                        <h3>
                          Skills
                        </h3>

                        <div className="skill-list">

                          {job.skills.map(
                            (skill, index) => (

                              <span
                                className="skill-badge"
                                key={index}
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}

                  {/* =========================
                      ACTION BUTTONS
                  ========================= */}

                  <div className="job-actions">

                    {/* AI ANALYSIS */}

                    <button
                      className="analysis-button"
                      onClick={() =>
                        navigate(
                          `/job-analysis/${job._id}`
                        )
                      }
                    >
                      AI Analysis
                    </button>

                    {/* START INTERVIEW */}

                    <button
                      className="interview-button"
                      onClick={() =>
                        navigate(
                          `/interview/${job._id}`
                        )
                      }
                    >
                      Start Interview
                    </button>

                    {/* DELETE */}

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(job._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}

export default Job;
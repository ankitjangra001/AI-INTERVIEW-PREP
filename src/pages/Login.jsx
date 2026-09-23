import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);
      
     console.log("USER DATA:", data.user);


      if (data.success) {
        // Save JWT token
        localStorage.setItem("token", data.token);
         // Save user information
  localStorage.setItem("user", JSON.stringify(data.user));

   console.log(
    "SAVED USER:",
    localStorage.getItem("user")
  );

        // Go to Job Dashboard
        navigate("/jobs");
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}

        <div className="login-logo">
          🤖
        </div>

        <h1>AI Interview Prep</h1>

        <p className="login-subtitle">
          Prepare smarter. Interview better.
        </p>


        {/* Login Heading */}

        <h2>Welcome Back</h2>

        <p className="login-description">
          Login to continue your interview preparation.
        </p>


        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div className="input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* Password */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>


          {/* Error / Success Message */}

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}


          {/* Login Button */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* Register */}

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;



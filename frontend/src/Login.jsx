
import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onBack }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const endpoint = isSignup ? "signup" : "login";

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(isSignup && { name }),
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      if (isSignup) {
        setMessage("Account created successfully! You can now log in.");
        setIsSignup(false);
        setName("");
        setPassword("");
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setMessage("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="login-logo">📖 PageTurner</div>

        <h1>{isSignup ? "Create an account" : "Welcome back"}</h1>

        <p className="login-subtitle">
          {isSignup
            ? "Join PageTurner and discover your next book"
            : "Sign in to continue to PageTurner"}
        </p>

        {error && <div className="login-error">{error}</div>}
        {message && (
          <div className="login-success">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="login-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        <p className="signup-switch">
          {isSignup
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            type="button"
            className="signup-link"
            onClick={switchMode}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

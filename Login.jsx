import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return setError("Email is required");
    }

    if (!emailPattern.test(email)) {
      return setError("Please enter a valid email address");
    }

    if (!password) {
      return setError("Password is required");
    }

    setError("");
    alert("Login Successful ✅");
  };

  return (
    <div className="login-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">CLEAN STREET</div>

        <ul className="nav-links">
          <li>HOME</li>
          <li>ABOUT</li>
          <li>REPORT ISSUE</li>
          <li>VIEW COMPLAINTS</li>
        </ul>

        <div className="nav-buttons">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
        </div>
      </nav>

      {/* LOGIN FORM */}
      <div className="login-box">
        <h2>LOGIN</h2>

        <form onSubmit={handleSubmit}>

          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn">
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
};

export default Login;

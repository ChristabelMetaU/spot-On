/** @format */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import { useState } from "react";
import "../styles/pages.css";
const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await signUp(username, email, password, role);
    if (response.user) navigate("/");
    else {
      setError(response.error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignUp} className="auth-form">
        <h2>Create an account</h2>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="category"
        >
          <option value="">select role</option>
          <option value="student">student</option>
          <option value="staff">staff</option>
        </select>
        <p className="error-message">{error}</p>
        <button type="sign up" className="btn-auth">
          Create account
        </button>
        <p className="link-text">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

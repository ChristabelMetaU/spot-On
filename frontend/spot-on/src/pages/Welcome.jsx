/** @format */

import { Link } from "react-router-dom";
import "../styles/pages.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <nav className="welcome-navbar">
        <h1 className="logo-title">SpotOn</h1>
        <div className="nav-buttons">
          <Link to="/signup" className="nav-btn filled">
            Sign Up
          </Link>
          <Link to="/login" className="nav-btn outlined">
            Log In
          </Link>
        </div>
      </nav>

      <div className="hero-section">
        <h2 className="hero-title">
          Find. Reserve. <span className="highlight">Park Smarter.</span>
        </h2>
        <p className="hero-subtitle">
          The smarter way to secure your campus parking. Discover real-time
          availability, reserve spots ahead, and skip the circling.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="hero-btn primary">
            Get Started
          </Link>
        </div>
      </div>

      <section className="features-section">
        <div className="feature-card">
          <h3>Real-Time Search</h3>
          <p>
            Find available parking spots near you instantly with our live map.
          </p>
        </div>
        <div className="feature-card">
          <h3>Smart Navigation</h3>
          <p>Navigate directly to open spots and avoid unnecessary detours.</p>
        </div>
        <div className="feature-card">
          <h3>Easy Reservation</h3>
          <p>Reserve your spot with one click and arrive stress-free.</p>
        </div>
      </section>

      <footer className="welcome-footer">
        <p>
          SpotOn © {new Date().getFullYear()} | Making campus parking effortless
        </p>
      </footer>
    </div>
  );
};

export default Welcome;

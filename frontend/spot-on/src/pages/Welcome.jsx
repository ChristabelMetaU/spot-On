/** @format */

import { Link } from "react-router-dom";
import "../styles/pages.css";

const Welcome = () => {
  return (
    <div className="overlay">
      <div className="welcome-page spotOn">
        <h1 className="logo-title">SpotOn</h1>
        <p className="tagline">
          Revolutionizing campus parking, one spot at a time.
        </p>
        <p className="description">
          Discover, reserve, and park smarter. Say goodbye to circling lots.
        </p>

        <ul className="features">
          <li>🔍 Search for nearby parking in real-time</li>
          <li>📍 Navigate directly to available spots</li>
          <li>🛡️ Reserve with confidence — no guesswork</li>
        </ul>

        <div className="button-group">
          <Link to="/signup">
            <button className="btn-start">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn-start secondary">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

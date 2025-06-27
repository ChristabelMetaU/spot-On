/** @format */

import { Link } from "react-router-dom";
import { useState } from "react";
const Nav = () => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <nav className="site-nav">
      <Link to="/">
        <button className={!showFilters ? "default" : "btn-nav"}>Map</button>
      </Link>
      <button
        className={showFilters ? "default" : "btn-nav"}
        onClick={() => {
          setShowFilters(!showFilters);
        }}
      >
        Filters
      </button>
      <Link to="/Profile">
        <button className="btn-nav">Profile</button>
      </Link>
      {showFilters && (
        <div>
          <h2>
            Filters
            <p>Green lot</p>
            <p>Wkite lot</p>
            <p>Red lot</p>
          </h2>
        </div>
      )}
    </nav>
  );
};

export default Nav;

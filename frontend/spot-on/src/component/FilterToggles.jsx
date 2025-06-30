/** @format */

import React from "react";
import "../styles/FilterToggles.css";
const filters = [
  { label: "red", color: "#b50000", key: "red" },
  { label: "green", color: "#058900", key: "green" },
  { label: "handicap", color: "#2196F3", key: "handicap" },
  { label: "white", color: "#ffe", key: "white" },
  { label: "housing", color: "#FF9800", key: "housing" },
  { label: "free", color: "#4CAF50", key: "free" },
  { label: "occupied", color: "#F44336", key: "occupied" },
];
const FilterToggles = ({ activeFilters, setActiveFilters }) => {
  const toggleFilter = (key) => {
    const upddated = { ...activeFilters, [key]: !activeFilters[key] };
    setActiveFilters(upddated);
  };
  return (
    <div className="filter-toggle-container">
      {filters.map(({ label, color, key }) => (
        <div className="toggle-wrapper" key={key}>
          <label className="switch">
            <input
              type="checkbox"
              checked={activeFilters[key] || false}
              onChange={() => toggleFilter(key)}
            />
            <span
              className="slider"
              style={{ backgroundColor: activeFilters[key] ? color : "#ccc" }}
            ></span>
          </label>
          <span className="filter-label" style={{ color: "black" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FilterToggles;

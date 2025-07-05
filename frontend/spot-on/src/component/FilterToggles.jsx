/** @format */

import React from "react";
import "../styles/FilterToggles.css";
const filters = [
  { label: "Lot Type ", color: "#", key: "lotType" },
  { label: "red", color: "#b50000", key: "red" },
  { label: "green", color: "#058900", key: "green" },
  { label: "white", color: "#ffe", key: "white" },
  { label: "Spot Type ", color: "#", key: "spotType" },
  { label: "handicap", color: "#2196F3", key: "handicap" },
  { label: "housing", color: "#FF9800", key: "housing" },
  { label: "Availability ", color: "#", key: "Avail" },
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
      {filters.map(({ label, color, key }) => {
        if (
          label === "Availability " ||
          label === "Spot Type " ||
          label === "Lot Type "
        ) {
          return <h3 key={key}>{label}</h3>;
        }
        return (
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
        );
      })}
    </div>
  );
};

export default FilterToggles;

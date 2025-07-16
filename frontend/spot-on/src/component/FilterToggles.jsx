/** @format */

import React from "react";
import { useState } from "react";
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
  const [collapsedSections, setCollapseSection] = useState({
    lotType: false,
    spotType: false,
    Avail: false,
  });

  const toggleSection = (key) => {
    setCollapseSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filterSections = {
    lotType: filters.filter(
      (f) => f.key === "red" || f.key === "green" || f.key === "white"
    ),
    spotType: filters.filter(
      (f) => f.key === "handicap" || f.key === "housing"
    ),
    Avail: filters.filter((f) => f.key === "free" || f.key === "occupied"),
  };
  return (
    <div className="filter-toggle-container">
      {Object.entries(filterSections).map(([sectionKey, sectionFilters]) => (
        <div key={sectionKey} className="filter-section">
          <h3
            onClick={() => toggleSection(sectionKey)}
            style={{ cursor: "pointer" }}
          >
            {collapsedSections[sectionKey] ? "▼" : "▶"}
            {sectionKey === "lotType"
              ? "Lot Type"
              : sectionKey === "spotType"
              ? "Spot Type"
              : "Availability"}
          </h3>

          {collapsedSections[sectionKey] &&
            sectionFilters.map(({ label, key, color }) => (
              <div className="toggle-wrapper" key={key}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={activeFilters[key] || false}
                    onChange={() => toggleFilter(key)}
                  />
                  <span
                    className="slider"
                    style={{
                      backgroundColor: activeFilters[key] ? color : "#ccc",
                    }}
                  />
                </label>
                <span className="filter-label" style={{ color: "black" }}>
                  {label}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default FilterToggles;

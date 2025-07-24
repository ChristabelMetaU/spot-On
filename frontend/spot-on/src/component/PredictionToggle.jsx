/** @format */

import React, { useState } from "react";
import "../styles/Prediction.css";
const PredictionToggle = ({ onSelect }) => {
  const [selected, setSelected] = useState("now");

  const handleClick = (value) => {
    setSelected(value);
    onSelect(value); // callback to parent
  };

  return (
    <div className="prediction-toggle-container">
      <button
        className={selected === "now" ? "toggle-btn selected" : "toggle-btn"}
        onClick={() => handleClick("now")}
      >
        Now
      </button>
      <button
        className={selected === "15" ? "toggle-btn selected" : "toggle-btn"}
        onClick={() => handleClick("15")}
      >
        In 15 mins
      </button>
      <button
        className={selected === "30" ? "toggle-btn selected" : "toggle-btn"}
        onClick={() => handleClick("30")}
      >
        In 30 mins
      </button>
      <button
        className={selected === "50" ? "toggle-btn selected" : "toggle-btn"}
        onClick={() => handleClick("50")}
      >
        In 50 mins
      </button>
    </div>
  );
};

export default PredictionToggle;

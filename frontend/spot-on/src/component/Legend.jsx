/** @format */

import React from "react";
import "../styles/Legend.css";

const Legend = () => {
  return (
    <div className="legend-container">
      <h4 className="legend-title">Spot Legend</h4>
      <div className="legend-item">
        <span className="legend-circle available" /> Available Spot
      </div>
      <div className="legend-item">
        <span className="legend-circle occupied-legend" /> Occupied Spot
      </div>
      <div className="legend-item">
        <span className="legend-circle reserved" /> Reserved Spot
      </div>
      <div className="legend-item">
        <span className="legend-circle unreliable" /> Updating Spot
      </div>
    </div>
  );
};

export default Legend;

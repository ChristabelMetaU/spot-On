/** @format */

import React from "react";
import "../styles/ToolTip.css";

const TooltipWrapper = ({ text, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-box">{text}</div>
    </div>
  );
};

export default TooltipWrapper;

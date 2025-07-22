/** @format */

import React from "react";
import { OverlayView } from "@react-google-maps/api";
import "./SpotStyles.css";

const SpotMarker = ({ spot, onClick }) => {
  const getClass = () => {
    if (spot.isUnreliable) return "spot-marker unreliable";
    if (spot.isReserved) return "spot-marker reserved";
    if (spot.isOccupied) return "spot-marker occupied";
    return "spot-marker available";
  };

  return (
    <OverlayView>
      <div
        className={getClass()}
        onClick={() => {
          onClick(spot);
        }}
        title={spot.id}
      ></div>
    </OverlayView>
  );
};

export default SpotMarker;

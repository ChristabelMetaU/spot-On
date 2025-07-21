/** @format */
import React from "react";
import "../styles/mapLoading.css";

const MapLoading = () => {
  return (
    <div className="map-skeleton-container">
      <div className="map-skeleton-pulse" />
      <div className="map-skeleton-pin" />
      <div className="map-skeleton-controls">
        <div className="map-skeleton-control" />
        <div className="map-skeleton-control" />
        <div className="map-skeleton-control short" />
      </div>
    </div>
  );
};

export default MapLoading;

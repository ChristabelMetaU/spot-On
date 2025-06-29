/** @format */
import React from "react";
import { useState } from "react";
import "../styles/Modal.css";
const SpotModal = ({
  spot,
  setShowModal,
  spotIndex,
  setSelectedSpot,
  setMessage,
  setIsVisible,
}) => {
  const handleGetDirections = () => {
    const { coordLat, coordLng, lotName } = spot;
    const label = `${lotName} spot ${spotIndex + 1}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${label} @ ${coordLat},${coordLng}`
    )}`;
    window.open(url, "_blank");
    setShowModal(false);
  };
  const updateIsOccupied = async (updatedIsOccupied) => {
    const response = await fetch(`http://localhost:3000/map/spots/${spot.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOccupied: updatedIsOccupied }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    setShowModal(false);
    setSelectedSpot(data);
    if (!data.isOccupied) {
      setMessage(`${spot.lotName} is now marked as free.`);
    } else {
      setMessage(`${spot.lotName} is now marked as occupied.`);
    }
    setIsVisible(true);
  };
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{spot.lotName}</h2>
          <div className="spotOccupied-btns">
            <button
              className="spot-free"
              onClick={() => {
                updateIsOccupied(false);
              }}
            >
              Confirm available
            </button>
            <button
              className="spot-taken"
              onClick={() => {
                updateIsOccupied(true);
              }}
            >
              Report occupied
            </button>
          </div>
          <textarea
            id="description"
            className="description"
            value={"Recent Spot Activity\nTBA"}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            cols={50}
            readOnly={true}
          />
          <div className="exit-btns">
            <button className="get-direction" onClick={handleGetDirections}>
              Get directions
            </button>
            <button className="close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotModal;

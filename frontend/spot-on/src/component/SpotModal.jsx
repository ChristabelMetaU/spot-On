/** @format */
import React, { useEffect } from "react";
import "../styles/Modal.css";
const SpotModal = ({
  spot,
  setShowModal,
  spotIndex,
  handleReportSubmit,
  id,
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
  const handleSubmit = (spot, isOccupied) => {
    const formData = {
      spot_name: spot.lotName,
      description: "No description",
      type: spot.type,
      user_id: id,
    };
    handleReportSubmit(formData, isOccupied);
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{spot.lotName}</h2>
          <div className="spotOccupied-btns">
            <button
              className="spot-free"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(spot, false);
              }}
            >
              Confirm available
            </button>
            <button
              className="spot-taken"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(spot, true);
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

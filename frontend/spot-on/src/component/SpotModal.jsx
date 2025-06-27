/** @format */

import React from "react";
import "../styles/Modal.css";
const SpotModal = ({ spot, setShowModal }) => {
  const exitModalToMap = () => {
    setShowModal(false);
  };
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{spot.lot_name}</h2>
          <p>Eecent reports</p>
          <div className="spotOccupied-btns">
            <button className="spot-free">Confirm available</button>
            <button className="spot-taken">Report occupied</button>
          </div>
          <div className="exit-btns">
            <button className="get-direction" onClick={exitModalToMap}>
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

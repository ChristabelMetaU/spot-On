/** @format */
import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import { getFormattedDate } from "../utils/getFormattedDate";
const SpotModal = ({
  spot,
  setShowModal,
  spotIndex,
  handleReportSubmit,
  id,
}) => {
  const [spotReport, setSpotReport] = useState([]);
  const handleGetDirections = () => {
    const { coordLat, coordLng, lotName } = spot;
    const label = `${lotName} spot ${spotIndex + 1}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${label} @ ${coordLat},${coordLng}`
    )}`;
    window.open(url, "_blank");
    setShowModal(false);
  };

  useEffect(() => {
    const fetchSpotReports = async () => {
      const response = await fetch(
        `http://localhost:3000/report/spot/${spot.lotName}`
      );
      const data = await response.json();
      setSpotReport(data);
    };
    fetchSpotReports();
  }, [spot, setSpotReport]);
  const handleSubmit = (spot, isOccupied) => {
    const formData = {
      spot_name: spot.lotName,
      description: "Auto non description",
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

          <div className="occupied">
            <div className="occupied-status">
              <div className={spot.isOccupied ? "red-dot" : "green-dot"}></div>
              <p>{spot.isOccupied ? "Occupied" : "Available "}</p>
            </div>
            <div className="spot-update">
              {spotReport.length > 0 ? <h3>Laat updated:</h3> : ""}
              <p>
                {spotReport.length > 0
                  ? getFormattedDate(
                      spotReport[spotReport.length - 1].updated_at
                    )
                  : ""}
              </p>
            </div>
          </div>
          <div className="spotOccupied-btns">
            <button
              className="spot-free"
              onClick={() => {
                handleSubmit(spot, false);
              }}
            >
              Confirm available
            </button>
            <button
              className="spot-taken"
              onClick={() => {
                handleSubmit(spot, true);
              }}
            >
              Report occupied
            </button>
          </div>
          <label>Spot's recent Activity </label>
          <textarea
            id="description"
            className="description"
            value={
              `Spot type: ${spot.type} \n` +
              (spotReport.length === 0
                ? "No recent reports"
                : spotReport
                    .map(
                      (report) =>
                        `Report made ${getFormattedDate(
                          report.created_at
                        )} \n Description: ${report.description}`
                    )
                    .join("\n"))
            }
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

/** @format */
import { useState } from "react";
const Report = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const handleShowReportForm = () => {
    setShowReportForm(!showReportForm);
  };
  return (
    <div className="reserve-container">
      <button className="report-btn" onClick={handleShowReportForm}>
        Report free spot
      </button>
      {showReportForm && (
        <div className="modal-overlay">
          <form className="modal-content">
            <h2>Report Parking spot </h2>
            <p>Help others find parking</p>
            <input
              type="text"
              name="spot"
              placeholder="Search for Parking spot"
              className="spot-search"
            />
            <div className="spotOccupied-btns">
              <button className="spot-free">Available</button>
              <button className="spot-taken">Occupied</button>
            </div>
            <input
              type="text"
              name="spot"
              placeholder="Enter lot type"
              className="spot-type"
            />
            <textarea
              id="description"
              className="description"
              value={"Additional Information "}
              rows={5}
              cols={50}
              readOnly={true}
            />
            <button className="close">Submit Report</button>
            <button
              className="close"
              onClick={() => {
                setShowReportForm(false);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Report;

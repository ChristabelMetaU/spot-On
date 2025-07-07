/** @format */
import { useState, useEffect } from "react";
import { sendWebSocket } from "../utils/websocket";
import { connectWebSocket } from "../utils/websocket";
const Report = ({
  spots,
  handleReportSubmit,
  user,
  setSelectedSpot,
  setIsVisible,
  setMessage,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [occupied, setOccupied] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [spotType, setSpotType] = useState("");
  const [description, setDescription] = useState("");
  const [occupiedText, setOccupiedText] = useState("");
  const [error, setError] = useState("");

  const handleShowReportForm = () => {
    setShowReportForm(!showReportForm);
  };
  const fetchLots = async (value) => {
    const searchedSpots = spots.filter((spot) => {
      return spot.lotName.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(searchedSpots);
    setShowResults(value.length > 0);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    fetchLots(value);
  };
  const handleInputFocus = (e) => {
    setShowResults(searchKeyword.length > 0);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 100);
  };

  const handleResultClick = (result) => {
    setSelectedSpot(result);
    setSearchKeyword(result.lotName);
    setShowResults(false);
    setSearchResults([]);
  };
  const handleSubmitSuccess = () => {
    const formData = {
      spot_name: searchKeyword,
      description: description,
      type: spotType,
      user_id: user.id,
    };
    const requiredData = {
      spot_name: formData.spot_name,
      typeof: formData.type,
    };
    const isEmptyField = Object.values(requiredData).some(
      (val) => typeof val === "string" && val.trim() === ""
    );
    if (isEmptyField) {
      setError("Please fill in all the fields");
      return;
    }
    setError("");
    setShowReportForm(false);
    handleReportSubmit(formData, occupied);
    setSearchKeyword("");
    setSpotType("");
    setDescription("");
  };
  useEffect(() => {
    if (showReportForm) {
      connectWebSocket((data) => {
        if (data.type === "REPORT_ERROR" && data.spotName === searchKeyword) {
          setShowReportForm(false);
          setIsVisible(true);
          setMessage(data.message);
          setSearchKeyword("");
          setSpotType("");
          setDescription("");
        }
        if (data.type === "REPORT_SUCCESS" && data.spotName == searchKeyword) {
          handleSubmitSuccess();
        }
      });
    }
  }, [searchKeyword, handleSubmitSuccess]);
  const handleSubmit = (e) => {
    e.preventDefault();
    sendWebSocket({
      type: "UPDATE_SPOT_BY_REPORT",
      spotName: searchKeyword,
      userId: user.id,
    });
  };

  return (
    <div className="reserve-container">
      <button className="report-btn" onClick={handleShowReportForm}>
        Report free spot
      </button>
      {showReportForm && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSubmit}>
            <h2>Report Parking spot </h2>
            <p>Help others find parking</p>
            <div className="search-container">
              <input
                type="text"
                name="spot"
                placeholder="Search for Parking spot"
                value={searchKeyword}
                onChange={handleSearch}
                onBlur={handleBlur}
                onFocus={handleInputFocus}
                className="spot-search"
              />
              {showResults && (
                <ul>
                  {searchResults.map((result) => {
                    return (
                      <li
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                      >
                        {result.lotName}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="spotOccupied-btns">
              <button
                className="spot-free"
                onClick={(e) => {
                  e.preventDefault();
                  setOccupiedText("This spot will be displayed as available");
                  setOccupied(false);
                }}
              >
                Available
              </button>
              <button
                className="spot-taken"
                onClick={(e) => {
                  e.preventDefault();
                  setOccupiedText("This spot  will be displayed as occupied");
                  setOccupied(true);
                }}
              >
                Occupied
              </button>
            </div>
            <p className="text"> {occupiedText}</p>
            <select
              className="spot-type"
              value={spotType}
              onChange={(e) => setSpotType(e.target.value)}
            >
              <option value=""> Select Lot Type</option>
              <option value="Red"> Red</option>
              <option value="Green"> Green</option>
              <option value="White"> White</option>
            </select>

            <textarea
              id="description"
              className="description"
              value={description}
              placeholder="Additional Information
Example: Spot is close To the Gym"
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              cols={50}
            />
            <p className="error">{error}</p>
            <button className="close" onClick={handleSubmit}>
              Submit Report
            </button>
            <button
              className="close"
              onClick={() => {
                setShowReportForm(false);
                setSearchKeyword("");
                setSpotType("");
                setDescription("");
                setError("");
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

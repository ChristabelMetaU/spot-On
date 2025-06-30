/** @format */
import { useState } from "react";
const Report = ({ spots }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
    setSearchKeyword(result.lotName);
    setShowResults(false);
    setSearchResults([]);
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

/** @format */
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import { use, useState } from "react";
const RouteDetails = ({
  spots,
  setSpots,
  setSelectedSpot,
  setShowModal,
  setActive,
  activeFilters,
  userLocation,
  locked,
  setLocked,
  lockedSpotId,
  setLockedSpotId,
  setFreeCount,
}) => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <div className="route-header">
        <div className="header-icon">
          <i
            className="fa fa-arrow-left fa-2x go-back"
            aria-hidden="true"
            onClick={() => {
              navigate("/");
            }}
          ></i>
        </div>
        <div className="header-text">
          <p>Find best route to your spot</p>
          <p>Your spot, yur way</p>
        </div>
      </div>
      <div className="router-toggle">
        <div
          className={!clicked ? "active" : "toggle-button"}
          onClick={() => {
            setClicked(false);
            setShowSearch(false);
          }}
        >
          From me to spot
        </div>
        <div
          className={clicked ? "active" : "toggle-button"}
          onClick={() => {
            setClicked((f) => !f);
            setShowSearch(true);
          }}
        >
          From destination to Spot
        </div>
      </div>
      {showSearch && (
        <div className="search-bar">
          <input type="text" placeholder="Search for a destination" />
        </div>
      )}
      <div className="site-main">
        <Body
          mode="route"
          name={"Your Smart Router"}
          spots={spots}
          setSpots={setSpots}
          setSelectedSpot={setSelectedSpot}
          setShowModal={setShowModal}
          setActive={setActive}
          activeFilters={activeFilters}
          userLocation={userLocation}
          locked={locked}
          setLocked={setLocked}
          lockedSpotId={lockedSpotId}
          setLockedSpotId={setLockedSpotId}
          setFreeCount={setFreeCount}
        />
      </div>
      <div className="route-summary">
        <div className="route-summary-header">
          <h2>Your navigation to </h2>
        </div>
        <div className="route-summary-body">
          <div className="route-summary-item">
            <p>distance</p>
            <h2>100 miles</h2>
          </div>

          <div className="route-summary-item">
            <p>ETA</p>
            <h2>12:00</h2>
          </div>

          <div className="route-summary-item">
            <p>Accuracy</p>
            <h2>100%</h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default RouteDetails;

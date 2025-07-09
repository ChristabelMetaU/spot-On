/** @format */
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import { useRef, useEffect, useState } from "react";
import { buildGraph } from "../utils/Huristic";
import DestSearch from "./DestSearch";
import { customPathFinder } from "../utils/Huristic";
import { getDaysInYear, set } from "date-fns";
const RouteDetails = ({
  spots,
  setSpots,
  setSelectedSpot,
  setShowModal,
  setActive,
  activeFilters,
  locked,
  setLocked,
  lockedSpotId,
  setLockedSpotId,
  setFreeCount,
}) => {
  const navigate = useNavigate();
  let userLocation = {
    lat: 35.8486,
    lng: -86.3669,
  };
  const [clicked, setClicked] = useState(false);
  const [mode, setMode] = useState("user-to-spot");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [routePath, setRoutePath] = useState([]);
  const [destSpots, setDestSpots] = useState(spots);

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
            setMode("user-to-spot");
          }}
        >
          From me to spot
        </div>
        <div
          className={clicked ? "active" : "toggle-button"}
          onClick={() => {
            setClicked((f) => !f);
            setMode("destination-to-spot");
          }}
        >
          From destination to Spot
        </div>
      </div>
      {mode === "destination-to-spot" && (
        <DestSearch onSelect={(loc) => setDestinationLocation(loc)} />
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
          routePath={routePath}
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

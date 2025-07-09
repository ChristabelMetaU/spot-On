/** @format */
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import { useRef, useEffect, useState, use } from "react";
import { buildGraph } from "../utils/Huristic";
import DestSearch from "./DestSearch";
import { customPathFinder } from "../utils/Huristic";
import { getDistance } from "../utils/Huristic";
import { set } from "date-fns";
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
  destinationLocation,
  setDestinationLocation,
}) => {
  const navigate = useNavigate();
  const userLocation = useRef({
    lat: 35.8486,
    lng: -86.3669,
  }).current;
  const directionsService = useRef(new window.google.maps.DirectionsService());
  const [clicked, setClicked] = useState(false);
  const [mode, setMode] = useState("user-to-spot");
  const [routePath, setRoutePath] = useState([]);
  const [startLocation, setStartLocation] = useState(userLocation);
  const [endLocation, setEndLocation] = useState(null);
  const [stats, setStats] = useState({});

  function getGoodleDirections(start, end) {
    directionsService.current.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const route = result.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }));

          setRoutePath([...route, end]);
        } else {
          throw new Error("Directions request failed due to " + status);
        }
      }
    );
  }
  function computeStats(path) {
    if (!path || path.length < 2) {
      return {
        totalDistance: 0,
        eta: 0,
      };
    }
    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += getDistance(
        path[i - 1].lat,
        path[i - 1].lng,
        path[i].lat,
        path[i].lng
      );
    }
    distance = distance * 16000; // convert to miles
    const avgWalkspeed = 1.4; // miles per second
    const etaSeconds = distance / avgWalkspeed;

    return {
      totalDistance: Math.round(distance),
      eta: Math.round(etaSeconds / 60),
    };
  }

  useEffect(() => {
    let nearByFreeSpots = [];
    const upsateRoute = async () => {
      if (destinationLocation) {
        const response = await fetch(
          `http://localhost:3000/map/spots?lat=${destinationLocation.lat}&lng=${destinationLocation.lng}&radius=200`
        );

        const data = await response.json();

        if (!data) {
          return;
        } else {
          setSpots(data);
          nearByFreeSpots = data.filter((spot) => spot.isOccupied === false);
        }
      }

      if (mode === "user-to-spot") {
        nearByFreeSpots = spots.filter((spot) => spot.isOccupied === false);
      }

      const { userNode, spotNodes } = buildGraph(
        startLocation,
        nearByFreeSpots
      );

      const path = customPathFinder(userNode, spotNodes);

      setEndLocation(path[path.length - 1]);
      getGoodleDirections(startLocation, path[path.length - 1]);
      const tempStats = computeStats(path);
      setStats(tempStats);
    };

    upsateRoute();
  }, [mode, destinationLocation, startLocation]);

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
          destinationLocation={destinationLocation}
          endLocation={endLocation}
        />
      </div>
      <div className="route-summary">
        <div className="route-summary-header">
          <h2>Your navigation to </h2>
        </div>
        <div className="route-summary-body">
          <div className="route-summary-item">
            <p>distance</p>
            <h2>
              {stats.totalDistance}
              cm
            </h2>
          </div>

          <div className="route-summary-item">
            <p>ETA</p>
            <h2>{stats.eta} sec</h2>
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

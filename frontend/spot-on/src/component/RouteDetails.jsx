/** @format */
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import { useRef, useEffect, useState } from "react";
import { buildGraph } from "../utils/Huristic";
import DestSearch from "./DestSearch";
import { customPathFinder } from "../utils/Huristic";
import { getDistance } from "../utils/Huristic";
import { formatTime } from "../utils/formatTime";
import { useMap } from "./MapContext";
import MakeReservation from "./MakeReservation";
import { use } from "react";
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
  setIsRoutingToHome,
  searchKeyword,
  setSearchKeyword,
  isReserveBtnClicked,
  setIsReserveBtnClicked,
}) => {
  const navigate = useNavigate();
  //for production
  const userLocation = useRef({
    lat: 35.8457602,
    lng: -86.3789569,
  }).current;
  const { map } = useMap();
  const directionsService = useRef(new window.google.maps.DirectionsService());
  const [originlalSpots, setOriginalSpots] = useState(spots);
  const [clicked, setClicked] = useState(false);
  const [mode, setMode] = useState("user-to-spot");
  const [routePath, setRoutePath] = useState([]);
  const [startLocation, setStartLocation] = useState(userLocation);
  const [endLocation, setEndLocation] = useState(null);
  const [stats, setStats] = useState({});
  const [isDriving, setIsDriving] = useState(true);
  const [heading, setHeading] = useState(0);
  const [reserved, setReserved] = useState(false);
  const [showMakeReservation, setShowMakeReservation] = useState(false);
  const [noReservationCnt, setNoReservationCnt] = useState(0);
  const [eta, setEta] = useState(0);
  const rotateMap = () => {
    const newHeading = (heading + 45) % 360;
    setHeading(newHeading);
    map.setHeading(newHeading);
  };

  const getGoogleDirections = (start, end) => {
    directionsService.current.route(
      {
        origin: start,
        destination: end,
        travelMode: isDriving
          ? google.maps.TravelMode.DRIVING
          : google.maps.TravelMode.WALKING,
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
  };

  function getSpeedWithMutiplier(hour) {
    if (hour >= 7 || hour <= 11) {
      return 0.6;
    }
    if (hour >= 11 || hour <= 14) {
      return 0.8;
    }
    return 1;
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
    distance = distance * 1000;
    let speedinMetersPerSecond = isDriving ? 10 : 1.4;
    const currentHour = new Date().getHours();
    speedinMetersPerSecond =
      speedinMetersPerSecond * getSpeedWithMutiplier(currentHour);
    speedinMetersPerSecond = (speedinMetersPerSecond * 1000) / 3600;
    let etaSeconds = distance / speedinMetersPerSecond;
    etaSeconds = Math.round(etaSeconds);
    setEta(etaSeconds);
    const eta = formatTime(etaSeconds);
    distance = Math.round(distance);
    distance = distance.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    distance = distance + "m";
    const accuracy = "90%";
    return {
      totalDistance: distance,
      eta: eta,
      accuracy: accuracy,
    };
  }

  const computeShortestPath = async (nearByFreeSpots) => {
    const { userNode, spotNodes } = await buildGraph(
      startLocation,
      nearByFreeSpots
    );
    const path = customPathFinder(userNode, spotNodes);
    if (path.length > 0) {
      setEndLocation(path[path.length - 1]);
      getGoogleDirections(startLocation, path[path.length - 1]);
      const tempStats = computeStats(path);
      setStats(tempStats);
    } else {
      setEndLocation(null);
      setStats({});
      setRoutePath([]);
    }
  };

  const displayMakeReservationModal = () => {
    const duration = 10000;
    setTimeout(() => {
      const TENMINUTES_AWAY = 600;
      if (eta > 0 && eta <= TENMINUTES_AWAY) {
        setShowMakeReservation(true);
      }
    }, duration);
  };

  useEffect(() => {
    let nearByFreeSpots = [];
    const upsateRoute = async () => {
      if (destinationLocation && clicked) {
        let tempSpots = [];
        let raduis = 200;
        while (tempSpots.length < 1) {
          const response = await fetch(
            `http://localhost:3000/map/spots?lat=${destinationLocation.lat}&lng=${destinationLocation.lng}&radius=${raduis}`
          );
          const data = await response.json();
          if (!data || data.length < 1) {
            raduis += 200;
            continue;
          } else if (data.length >= 1) {
            tempSpots = data;
            setSpots(data);
            nearByFreeSpots = data.filter((spot) => spot.isOccupied === false);
          }
        }
      }
      computeShortestPath(nearByFreeSpots);
    };
    upsateRoute();
  }, [mode, destinationLocation, startLocation, isDriving, clicked]);

  useEffect(() => {
    if (!clicked) {
      setMode("user-to-spot");
      setSpots(originlalSpots);
      const nearByFreeSpots = originlalSpots.filter(
        (spot) => spot.isOccupied === false
      );
      computeShortestPath(nearByFreeSpots);
      setDestinationLocation(null);
    }
  }, [clicked, originlalSpots, setSpots, setDestinationLocation, mode]);

  useEffect(() => {
    if (eta > 0) {
      if (!clicked && noReservationCnt < 3) {
        displayMakeReservationModal();
      } else if (clicked && destinationLocation && noReservationCnt < 3) {
        setNoReservationCnt(0);
        displayMakeReservationModal();
      }
    }
  }, [eta, clicked, destinationLocation, noReservationCnt]);

  useEffect(() => {
    if (reserved) {
      const spot = spots.find(
        (spot) =>
          spot.coordLat === endLocation.lat && spot.coordLng === endLocation.lng
      );
      if (spot) {
        setSelectedSpot(spot);
        setSearchKeyword(spot.lotName);
        navigate("/Home/ReserveDetails");
        setTimeout(() => {
          setIsReserveBtnClicked(true);
        }, 2000);
        setReserved(false);
      }
    }
  }, [
    reserved,
    navigate,
    endLocation,
    spots,
    setSelectedSpot,
    setSearchKeyword,
  ]);
  return (
    <>
      <div className="route-header">
        <div className="header-icon">
          <i
            className="fa fa-arrow-left fa-2x go-back"
            aria-hidden="true"
            onClick={() => {
              setIsRoutingToHome(true);
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
            setClicked(true);
            setMode("destination-to-spot");
          }}
        >
          From destination to Spot
        </div>
      </div>
      {mode === "destination-to-spot" && (
        <DestSearch onSelect={(loc) => setDestinationLocation(loc)} />
      )}
      <button className="fab-rotate" onClick={rotateMap}>
        Rotate Map
      </button>
      <button className="fab-route" onClick={() => setIsDriving(!isDriving)}>
        {isDriving ? (
          <i className="fas fa-car"></i>
        ) : (
          <i className="fas fa-walking"></i>
        )}
        <p>{isDriving ? "Driving" : "Walking"}</p>
      </button>
      <div className="site-main">
        <Body
          mode="route"
          routeMode={mode}
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
          heading={heading}
          setSearchKeyword={setSearchKeyword}
          setIsReserveBtnClicked={setIsReserveBtnClicked}
        />
      </div>
      <div className="route-summary">
        <div className="route-summary-header">
          <h2>Your navigation to </h2>
        </div>
        <div className="route-summary-body">
          <div className="route-summary-item">
            <p>distance</p>
            <h2>{stats.totalDistance}</h2>
          </div>

          <div className="route-summary-item">
            <p>ETA</p>
            <h2>{stats.eta}</h2>
          </div>

          <div className="route-summary-item">
            <p>Accuracy</p>
            <h2>99%</h2>
          </div>
        </div>
        {showMakeReservation && (
          <MakeReservation
            setReserve={setReserved}
            setShowMakeReservation={setShowMakeReservation}
            noReservationCnt={noReservationCnt}
            setNoReservationCnt={setNoReservationCnt}
          />
        )}
      </div>
    </>
  );
};
export default RouteDetails;

/** @format */
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import { useRef, useEffect, useState, use } from "react";
import { buildGraph } from "../utils/Huristic";
import DestSearch from "./DestSearch";
import { dynamicPathFinder } from "../utils/Huristic";
import { rankPaths } from "../utils/RankPath";
import { getDistance } from "../utils/Huristic";
import { formatTime } from "../utils/formatTime";
import { useMap } from "./MapContext";
import MakeReservation from "./MakeReservation";
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
  const [loaded, setLoaded] = useState(true);
  const [routePath, setRoutePath] = useState([]);
  const [endLocation, setEndLocation] = useState(null);
  const [stats, setStats] = useState({});
  const [isDriving, setIsDriving] = useState(true);
  const [reserved, setReserved] = useState(false);
  const [showMakeReservation, setShowMakeReservation] = useState(false);
  const [noReservationCnt, setNoReservationCnt] = useState(0);
  const [activePath, setActivePath] = useState(null);
  const [rankPathChoosen, setRankPathChoosen] = useState([]);
  const [rankedPaths, setRankedPaths] = useState([]);
  const [selectedRankType, setSelectedRankType] = useState("");
  const [eta, setEta] = useState(0);
  const [paths, setPaths] = useState([]);
  const [freeSpots, setFreeSpots] = useState([]);
  const [rankBy, setRankBy] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [rankValue, setRankValue] = useState("");
  const [sortByValue, setSortByValue] = useState("");
  const [error, setError] = useState("");
  const [showRouteList, setShowRouteList] = useState(false);
  const [hideViewed, setHideViewed] = useState(false);
  const [viewedSpots, setViewedSpots] = useState([]);

  const fetchSpotsCloseToDestination = async () => {
    let tempSpots = [];
    let radius = 200;
    while (tempSpots.length < 1) {
      const response = await fetch(
        `http://localhost:3000/map/spots?lat=${destinationLocation.lat}&lng=${destinationLocation.lng}&radius=${radius}`
      );
      const data = await response.json();
      if (!data || data.length < 1) {
        radius += 200;
        continue;
      }
      tempSpots = data;
      const nearByFreeSpots = data.filter((spot) => !spot.isOccupied);
      setFreeSpots(nearByFreeSpots);
      return nearByFreeSpots;
    }
  };

  const loadPaths = async (nearByFreeSpots, value) => {
    const { userNode, spotNodes } = await buildGraph(
      userLocation,
      nearByFreeSpots,
      destinationLocation
    );
    const allPaths = dynamicPathFinder(userNode, spotNodes);
    setPaths(allPaths);
    const ranked = rankPaths(allPaths, userLocation, destinationLocation);
    setRankedPaths(ranked);
    let bestPath = ranked[value];
    let sortedRanked;
    if (value === "cheapest") {
      if (sortByValue === "DistanceToUser") {
        sortedRanked = bestPath.sort(
          (a, b) =>
            a.goal.drivingMinutesFromUser - b.goal.drivingMinutesFromUser
        );
      } else if (sortByValue === "DistanceToDest") {
        sortedRanked = bestPath.sort(
          (a, b) =>
            a.goal.drivingMinutesFromDestination -
            b.goal.drivingMinutesFromDestination
        );
      } else {
        sortedRanked = bestPath;
      }
    } else {
      if (sortByValue === "price") {
        sortedRanked = bestPath.sort((a, b) => a.totalPrice - b.totalPrice);
      } else {
        sortedRanked = bestPath;
      }
    }
    sortedRanked = hideViewed
      ? sortedRanked.filter((path) => !viewedSpots.includes(path.goal.id))
      : sortedRanked;
    setRankPathChoosen(sortedRanked);
    setLoaded(true);
    setShowRouteList(true);
  };
  const handleRankTypeChange = async (e) => {
    if (sortByValue === "" || rankValue === "" || !destinationLocation) {
      setError("Please select a rank option first");
      return;
    }
    setError("");
    setLoaded(false);
    setSelectedRankType(rankValue);
    let nearByFreeSpots = [];
    if (rankValue.includes("Destination")) {
      nearByFreeSpots = await fetchSpotsCloseToDestination();
    } else {
      nearByFreeSpots = spots.filter((spot) => !spot.isOccupied);
      setFreeSpots(nearByFreeSpots);
    }
    loadPaths(nearByFreeSpots, rankValue);
  };
  useEffect(() => {
    if (eta > 0 && eta <= 600 && noReservationCnt < 3) {
      setShowMakeReservation(true);
    }
  }, [eta]);

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
  }, [reserved]);

  const computeStats = (path) => {
    if (!path || path.length < 2) return { totalDistance: 0, eta: 0 };
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
    let speed = isDriving ? 25 : 5;
    const currentHour = new Date().getHours();
    speed *= getSpeedWithMutiplier(currentHour);
    speed = (speed * 1000) / 3600;
    const etaSeconds = Math.round(distance / speed);
    setEta(etaSeconds);
    return {
      totalDistance: `${Math.round(distance)}m`,
      eta: formatTime(etaSeconds),
      accuracy: "90%",
    };
  };

  const getSpeedWithMutiplier = (hour) => {
    if (hour >= 7 && hour < 11) return 0.6;
    if (hour >= 11 && hour < 14) return 0.8;
    return 1;
  };

  const getGoogleDirections = (start, end, isDriving) => {
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
          return setStats(computeStats(route));
        } else {
          throw new Error("Directions request failed due to " + status);
        }
      }
    );
  };

  const handleToggle = () => {
    getGoogleDirections(userLocation, endLocation, !isDriving);
    setIsDriving(!isDriving);
  };
  const showRoute = (path) => {
    setActivePath(path);
    if (!viewedSpots.includes(path.goal.id)) {
      setViewedSpots([...viewedSpots, path.goal.id]);
    }
    getGoogleDirections(
      userLocation,
      path.path[path.path.length - 1],
      isDriving
    );
    setEndLocation(path.path[path.path.length - 1]);
    setShowRouteList(false);
  };
  return (
    <>
      <div className="route-header">
        <div
          className="header-icon"
          onClick={() => {
            setIsRoutingToHome(true);
            navigate("/");
          }}
        >
          <i className="fa fa-arrow-left fa-2x go-back" aria-hidden="true"></i>
        </div>
        <div className="header-text">
          <p>Find best route to your spot</p>
          <p>Your spot, yur way</p>
        </div>
      </div>

      <div className="site-main">
        <div className="route-filter">
          {<DestSearch onSelect={(loc) => setDestinationLocation(loc)} />}
          <div className="filter-button">
            <button
              className={`walk ${isDriving ? "active-toggle" : ""}`}
              onClick={handleToggle}
            >
              <i className="fas fa-car"></i>
              <p>Driving</p>
            </button>

            <button
              className={`walk ${!isDriving ? "active-toggle" : ""}`}
              onClick={handleToggle}
            >
              <i className="fas fa-walking"></i>
              <p>Walking</p>
            </button>
            <label>
              <input
                type="checkbox"
                checked={hideViewed}
                className="ranked-spot-checkbox"
                onChange={(e) => {
                  setHideViewed(!hideViewed);
                }}
              />
              Hide previously shown spots
            </label>
            <div className="site-select">
              <div
                onClick={() => {
                  setRankBy(!rankBy);
                  setSortBy(null);
                }}
              >
                <p>Rank spots by:{rankBy ? "▼" : "▶"}</p>
              </div>
            </div>
          </div>
          {rankBy && (
            <div className="rank-options">
              <p
                onClick={() => {
                  setSortBy("distance");
                  setRankValue("closestToUser");
                }}
                className={
                  rankValue === "closestToUser" ? "rank-options-active" : ""
                }
              >
                closest to you
              </p>
              <p
                value="closestToDestination"
                onClick={() => {
                  setSortBy("distance");
                  setRankValue("closestToDestination");
                }}
                className={
                  rankValue === "closestToDestination"
                    ? "rank-options-active"
                    : ""
                }
              >
                Closest to destination
              </p>
              <p
                value="cheapest"
                onClick={() => {
                  setSortBy("price");
                  setRankValue("cheapest");
                }}
                className={
                  rankValue === "cheapest" ? "rank-options-active" : ""
                }
              >
                All Cheapest
              </p>
            </div>
          )}
          {sortBy && sortBy === "distance" && (
            <div className="rank-options-sort">
              <p>Sort By: </p>
              <p
                onClick={() => {
                  setSortByValue("price");
                }}
                className={sortByValue === "price" ? "rank-options-active" : ""}
              >
                Price
              </p>
              <p
                onClick={() => {
                  setSortByValue("None");
                }}
                className={sortByValue === "None" ? "rank-options-active" : ""}
              >
                None
              </p>
            </div>
          )}

          {sortBy && sortBy === "price" && (
            <div className="rank-options-sort">
              <p
                onClick={() => {
                  setSortByValue("DistanceToUser");
                }}
                className={
                  sortByValue === "DistanceToUser" ? "rank-options-active" : ""
                }
              >
                closest to you
              </p>

              <p
                onClick={() => {
                  setSortByValue("DistanceToDest");
                }}
                className={
                  sortByValue === "DistanceToDest" ? "rank-options-active" : ""
                }
              >
                closest to your destination
              </p>
              <p
                onClick={() => {
                  setSortByValue("None");
                }}
                className={sortByValue === "None" ? "rank-options-active" : ""}
              >
                None
              </p>
            </div>
          )}
          <button onClick={handleRankTypeChange}>
            <p>Rank</p>
          </button>
          <p className="error-message">{error}</p>
        </div>
        {!loaded && (
          <div className="skeleton-wrapper">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton-spot-card" />
            ))}
          </div>
        )}
        {showRouteList &&
          loaded &&
          rankPathChoosen?.slice(0, 5).map((path, index) => (
            <div
              key={index}
              className="ranked-spot-item"
              onClick={() => showRoute(path)}
            >
              <p>
                Lot: {spots.find((spot) => spot.id === path.goal.id)?.lotName}
              </p>
              <p>Distance: {Math.round(path.totalcost)}m</p>
              <p>ETA: {Math.round(path.goal.drivingMinutesFromUser)} min</p>
              <p>Price: ${path.totalPrice}</p>
            </div>
          ))}
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
            <h2>{stats.accuracy}</h2>
          </div>
        </div>
        {showMakeReservation && (
          <MakeReservation
            setReserve={setReserved}
            setShowMakeReservation={setShowMakeReservation}
            noReservationCnt={noReservationCnt}
            setNoReservationCnt={setNoReservationCnt}
            id={endLocation?.id}
            spots={spots}
          />
        )}
      </div>
    </>
  );
};
export default RouteDetails;

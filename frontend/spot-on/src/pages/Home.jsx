/** @format */
import { useAuth } from "../component/AuthContext";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Body from "../component/Body";
import Footer from "../component/Footer";
import Report from "../component/Report";
import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Message from "../component/Message";
import QuickActions from "../component/QuickActions";
import LiveStatus from "../component/LiveStatus";
import RouteDetails from "../component/RouteDetails";
import Fab from "../component/Fab";
import SpotModal from "../component/SpotModal";
import MapLoading from "../component/MapLoading";
import "../styles/Home.css";
import { connectWebSocket, sendWebSocket } from "../utils/websocket";
const Home = ({
  spots,
  setSpots,
  selectedSpot,
  setSelectedSpot,
  showmodal,
  setShowModal,
  active,
  setActive,
  userLocation,
  setUserLocation,
  locked,
  setLocked,
  lockedSpotId,
  setLockedSpotId,
  freeCount,
  setFreeCount,
  activeFilters,
  setActiveFilters,
}) => {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [userLocationError, setUserLocationError] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setUserLocationError(error.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);
  useEffect(() => {
    const fetchSpots = async () => {
      if (!userLocation) {
        return;
      }
      const { lat, lng } = userLocation;
      if (!lat || !lng) {
        return;
      }
      const response = await fetch(
        `http://localhost:3000/map/spots?lat=${35.8465869577069}&lng=${-86.3668367808604}&radius=200`
      );
      const data = await response.json();
      if (!data) {
        setSpots([]);
      } else {
        setSpots(data);
        setFreeCount(data.filter((spot) => spot.isOccupied === false).length);
      }
    };
    // connectWebSocket
    fetchSpots();

    connectWebSocket((data) => {
      if (data.type === "SPOT_UPDATED") {
      }
      if (data.type === "SPOT_LOCKED") {
        setLocked(data.locked);
        setLockedSpotId(data.spotId);
      }
      if (data.type === "SPOT_UNLOCKED") {
        setLocked(data.locked);
      }
      if (data.type === "ERROR") {
        setShowModal(false);
        setIsVisible(true);
        setMessage(data.message);
      }
    });
  }, [user, userLocation, selectedSpot, locked, lockedSpotId]);

  const updateIsOccupied = async (Occupied) => {
    const id = Number(selectedSpot.id);
    const response = await fetch(`http://localhost:3000/map/spots/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isOccupied: Occupied }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    sendWebSocket({
      type: "UPDATE_SPOT",
      spot: data,
      spotId: data.id,
      userId: user.id,
    });

    setShowModal(false);
    setSelectedSpot(data);
    if (!data.isOccupied) {
      setMessage(`${selectedSpot.lotName} is now marked as free.`);
    } else {
      setMessage(`${selectedSpot.lotName} is now marked as occupied.`);
    }
    setIsVisible(true);
    sendWebSocket({
      type: "UNLOCK_SPOT",
      spotId: selectedSpot.id,
      userId: user.id,
    });
    setLocked(false);
  };
  const handleReportSubmit = async (formData, occupied) => {
    const response = await fetch("http://localhost:3000/report/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setIsVisible(true);
    if (!data) {
      setMessage("Something went wrong");
    }
    updateIsOccupied(occupied);
  };
  return (
    <div className="Home">
      <Header />
      <Nav
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      {!userLocation ? (
        <MapLoading />
      ) : (
        <main className="site-main">
          <LiveStatus freeCount={freeCount} />
          <Body
            mode="Home"
            name={"Your campus Parking Assistant"}
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

          <Report
            spots={spots}
            handleReportSubmit={handleReportSubmit}
            user={user}
            setSelectedSpot={setSelectedSpot}
            setIsVisible={setIsVisible}
            setMessage={setMessage}
            count={freeCount}
          />
          <QuickActions />

          <Fab />
        </main>
      )}
      {showmodal && (
        <SpotModal
          setShowModal={setShowModal}
          spot={selectedSpot}
          spotIndex={active.idx}
          handleReportSubmit={handleReportSubmit}
          id={user.id}
          setLocked={setLocked}
        />
      )}
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
      <Footer />
    </div>
  );
};

export default Home;

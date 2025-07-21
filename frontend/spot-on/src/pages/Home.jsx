/** @format */

import { useAuth } from "../component/AuthContext";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Body from "../component/Body";
import Footer from "../component/Footer";
import Report from "../component/Report";
import { useState, useEffect, useRef } from "react";
import Message from "../component/Message";
import QuickActions from "../component/QuickActions";
import LiveStatus from "../component/LiveStatus";
import Fab from "../component/Fab";
import SpotModal from "../component/SpotModal";
import MapLoading from "../component/MapLoading";
import SearchForSpot from "../component/SearchForSpot";
import { getDistance } from "../utils/Huristic";
import "../styles/Home.css";
import { connectWebSocket, sendWebSocket } from "../utils/websocket";
import { useTime } from "../component/ReserveContext";
import { getDeviceId } from "../utils/getDeviceId";

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
  setIsRoutingToHome,
  isRoutingToHome,
  searchKeyword,
  setSearchKeyword,
  showResults,
  setShowResults,
  searchResults,
  setSearchResults,
  message,
  setMessage,
  isVisible,
  setIsVisible,
  setIsReserveBtnClicked,
}) => {
  const mode = "Home";
  const { user, logout } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [userLocationError, setUserLocationError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const { setHasReserve, setReservedSpotId } = useTime();
  const MTSU_CENTER = {
    lat: 35.8486,
    lng: -86.3669,
  };
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
    if (user && userLocation) {
      sendWebSocket({
        type: "USER_ENTERED_MAP",
        userId: user.id,
        location: userLocation,
      });
    }
  }, [user, userLocation]);
  useEffect(() => {
    if (!user) {
      return;
    }
    sendWebSocket({
      type: "SESSION_STATE_UPDATE",
      userId: user.id,
      deviceId: getDeviceId(),
      state: {
        locked,
        lockedSpotId,
      },
    });
  }, [searchKeyword, selectedSpot, locked, lockedSpotId]);
  useEffect(() => {
    const fetchSpots = async () => {
      if (!userLocation) {
        return;
      }
      let { lat, lng } = userLocation;
      if (!lat || !lng) {
        return;
      }
      let tempSPots = [];
      let raduis = 200;
      while (tempSPots.length < 1) {
        const response = await fetch(
          `http://localhost:3000/map/spots?lat=${lat}&lng=${lng}&radius=${raduis}`
        );
        const data = await response.json();
        if (!data || data.length < 1) {
          setSpots([]);
          setFreeCount(0);
          if (getDistance(lat, lng, MTSU_CENTER.lat, MTSU_CENTER.lng) > 10) {
            raduis += 1000000;
          } else {
            raduis += 200;
          }
        } else {
          tempSPots = data;
          setSpots(data);
          setFreeCount(data.filter((spot) => spot.isOccupied === false).length);
        }
      }
    };
    fetchSpots();

    connectWebSocket(user, (data) => {
      if (
        data.type === "SESSION_STATE_SYNC" &&
        data.fromDevice !== getDeviceId
      ) {
        if (data.state.locked) {
          setLocked(data.state.locked);
        }
        if (data.state.lockedSpotId) {
          setLockedSpotId(data.state.lockedSpotId);
        }
      }
      if (data.type === "PRESENCE_UPDATE") {
        if (data.userId !== user.id) {
          setActiveUsers(data.users);
        }
      }
      if (data.type === "SPOT_LOCKED") {
        setLocked(data.locked);
        setLockedSpotId(data.spotId);
      }
      if (data.type === "SPOT_UNLOCKED") {
        setLocked(data.locked);
        setLockedSpotId(null);
        const index = spots.findIndex((spot) => spot.id === data.spotId);
        if (index !== -1) {
          const newSpots = [...spots];
          if (newSpots[index].isOccupied !== data.isOccupied) {
            newSpots[index].isOccupied = data.isOccupied;
            setSpots(newSpots);
          }
        }
      }
      if (data.type === "ERROR") {
        setShowModal(false);
        setIsVisible(true);
        setMessage(data.message);
      }
      if (data.type === "RESERVE_UPDATE") {
        setHasReserve(true);
        setReservedSpotId(data.spotId);
      }
      if (data.type === "SPOT_UNRESERVED") {
        setHasReserve(false);
        setReservedSpotId(null);
      }
    });
  }, [user, userLocation, selectedSpot, locked, lockedSpotId, mode]);

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
      isOccupied: data.isOccupied,
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
        setIsRoutingToHome={setIsRoutingToHome}
      />
      {!userLocation ? (
        <MapLoading />
      ) : (
        <main className="site-main">
          <LiveStatus freeCount={freeCount} activeUsers={activeUsers} />
          <SearchForSpot
            mode={mode}
            spots={spots}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            showResults={showResults}
            setShowResults={setShowResults}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setSelectedSpot={setSelectedSpot}
          />
          <Body
            mode={mode}
            name={"Your campus Parking Assistant"}
            spots={spots}
            setSpots={setSpots}
            selectedSpot={selectedSpot}
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
            isRoutingToHome={isRoutingToHome}
          />
          <Report
            spots={spots}
            handleReportSubmit={handleReportSubmit}
            user={user}
            setSelectedSpot={setSelectedSpot}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            showResults={showResults}
            setShowResults={setShowResults}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
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
          setSearchKeyword={setSearchKeyword}
          setSelectedSpot={setSelectedSpot}
          setIsReserveBtnClicked={setIsReserveBtnClicked}
        />
      )}
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
      <Footer />
    </div>
  );
};

export default Home;

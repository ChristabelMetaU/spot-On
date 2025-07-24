/** @format */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchForSpot from "./SearchForSpot";
import { useAuth } from "./AuthContext";
import Message from "./Message";
import { sendWebSocket, connectWebSocket } from "../utils/WebSocket";
import { getFormattedDate } from "../utils/getFormattedDate";
import Timer from "./Timer";
import { formatTime } from "../utils/formatTime";
import { useTime } from "./ReserveContext";
import "../styles/Reserve.css";
const Reserve = ({
  spots,
  searchKeyword,
  setSearchKeyword,
  showResults,
  setShowResults,
  searchResults,
  setSearchResults,
  selectedSpot,
  setSelectedSpot,
  message,
  setMessage,
  isVisible,
  setIsVisible,
  isReReserved,
  setIsReserved,
  showTimer,
  setShowTimer,
  userLocation,
  isReserveBtnClicked,
  setIsReserveBtnClicked,
  setIsRoutingToHome,
}) => {
  const { user } = useAuth();
  const {
    timeLeft,
    setTimeLeft,
    currentReservation,
    setCurrentReservation,
    setHasReserve,
  } = useTime();
  const [error, setError] = useState("");
  const [pastReservations, setPastReservations] = useState([]);
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);
  const limit = 5;
  let displayedReservations = showFullText
    ? pastReservations
    : pastReservations.slice(0, limit);
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch("http://localhost:3000/spots/get/reserve");
      const data = await response.json();
      if (data) {
        setPastReservations(
          data
            .filter(
              (reservation) =>
                new Date(reservation.reservedAt) > new Date() - 60480000
            )
            .sort((a, b) => {
              return new Date(b.reservedAt) - new Date(a.reservedAt);
            })
        );
      } else {
        setPastReservations([]);
      }
    };
    fetchReservations();
  }, []);
  useEffect(() => {
    const fetchCurrentReservation = async () => {
      const response = await fetch(
        `http://localhost:3000/spots/current/reserve/${user.id}`
      );
      const data = await response.json();
      if (data) {
        setCurrentReservation(data);
        const now = new Date();
        const reservedAt = new Date(data.reservedAt);
        const timeDiff = now.getTime() - reservedAt.getTime();
        const timeLeftNow = 600 - Math.round(timeDiff / 1000);
        setTimeLeft(timeLeftNow);
        setShowTimer(true);
      } else {
        setCurrentReservation([]);
      }
    };
    if (user.id) {
      fetchCurrentReservation();
    }
  }, [user.id]);

  const resetForm = () => {
    setSearchKeyword("");
    setShowResults(false);
    setSearchResults([]);
    setSelectedSpot([]);
  };

  const handleReservation = async () => {
    const formData = {
      lotName: searchKeyword,
      userId: user.id,
    };
    const response = await fetch("http://localhost:3000/spots/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data) {
      setCurrentReservation(data);
      setIsReserveBtnClicked(false);
      setMessage("Reservation successful");
      setIsVisible(true);
      resetForm();
    } else {
      setMessage("Reservation failed");
      setIsVisible(true);
      resetForm();
      setSelectedSpot({});
    }
  };
  useEffect(() => {
    if (isReserveBtnClicked) {
      connectWebSocket(user, (data) => {
        if (data.type === "RESERVE_SUCCESS") {
          setIsReserved(true);
          handleReservation();
          setTimeLeft(600);
          setShowTimer(true);
          setHasReserve(true);
        }
        if (data.type === "RESERVE_ERROR") {
          setMessage(data.message);
          setIsVisible(true);
          setIsReserveBtnClicked(false);
          setSearchKeyword("");
        }
      });
    }
  }, [searchKeyword, handleReservation]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmptyField = searchKeyword === "" || selectedSpot.length === 0;
    if (isEmptyField) {
      setError("Please fill in all the fields");
      return;
    }
    if (selectedSpot.isOccupied) {
      setIsReserveBtnClicked(false);
      setMessage(`${selectedSpot.lotName} is already occupied. `);
      setIsVisible(true);
      setSearchKeyword("");
      return;
    }
    sendWebSocket({
      type: "RESERVE_SPOT",
      lotName: searchKeyword,
      userId: user.id,
      spotId: selectedSpot.id,
    });
  };

  useEffect(() => {
    if (showTimer) {
      if (timeLeft <= 0) {
        setIsVisible(true);
        setMessage("Your Reservation  has expired");
        setIsVisible(true);
        setShowTimer(false);
        setCurrentReservation([]);
        sendWebSocket({
          type: "UNRESERVE_SPOT",
          spotId: currentReservation.spotId,
          userId: user.id,
        });
        setTimeLeft(0);
        return;
      }
      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const updateReservation = async (formData) => {
    const response = await fetch("http://localhost:3000/spots/cancel", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return data;
  };
  const handleCancelReservation = async () => {
    const now = new Date();
    const formData = {
      spotId: currentReservation.spotId,
      userId: user.id,
      cancelReservationAt: now,
    };
    const data = await updateReservation(formData);
    if (data) {
      setCurrentReservation([]);
      setMessage(data.message);
      setIsVisible(true);
      setShowTimer(false);
      sendWebSocket({
        type: "UNRESERVE_SPOT",
        spotId: currentReservation.spotId,
        userId: user.id,
      });
      setTimeLeft(0);
    } else {
      setMessage("Reservation updatelation failed");
      setIsVisible(true);
    }
  };
  const handleClose = () => {
    setIsReserveBtnClicked(false);
    resetForm();
  };
  return (
    <div>
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
          <p>Reserve Your Favorite Spot</p>
          <p>Your spot, yur way</p>
        </div>
      </div>
      <div className="site-main">
        <div className="reserve-spot">
          <button
            onClick={() => setIsReserveBtnClicked(true)}
            className="reserve-spot-btn"
          >
            Reserve a Spot
          </button>
          <p>Resserve your spot by searching</p>
        </div>
        {showTimer && <Timer timeLeft={timeLeft} />}
        {isReserveBtnClicked && (
          <form onSubmit={handleSubmit}>
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Reserve a Spot</h2>
                <p>For 10 minutes only</p>
                <SearchForSpot
                  setIsRoutingToHome={setIsRoutingToHome}
                  mode={"reserve"}
                  spots={spots}
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  showResults={showResults}
                  setShowResults={setShowResults}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  setSelectedSpot={setSelectedSpot}
                />
                <div className="reserve-icon">
                  <i className="fa-solid fa-clock fa-8x"></i>
                </div>
                <p>{error}</p>
                <button className="reserve-btn">Reserve spot</button>
                <button className="reserve-btn" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="reserve-container">
          <h2>Reservations</h2>
          <div className="reservation-card">
            <div className="reservation-header">
              <span className="status-dot"></span>
              <h3>Current Reservation</h3>
              <span className="timer">
                {currentReservation.reservedAt
                  ? `Time left: ${formatTime(timeLeft)}`
                  : ""}
              </span>
            </div>

            <div className="reservation-details">
              {currentReservation.reservedAt &&
              currentReservation.spotId &&
              spots ? (
                <div>
                  <p>
                    {
                      spots.find(
                        (spot) => spot.id === currentReservation.spotId
                      ).lotName
                    }
                  </p>
                  <p>
                    {`Reserved ${getFormattedDate(
                      currentReservation.reservedAt
                    )}`}
                  </p>
                  <p>ETA: 10 minutes</p>
                </div>
              ) : (
                <div className="reservation-details">
                  <p> No current reservation</p>
                </div>
              )}
            </div>
            <div className="reservation-action">
              {currentReservation.reservedAt && (
                <button onClick={handleCancelReservation} className="cancel">
                  Cancel Reservation
                </button>
              )}
            </div>
          </div>
          <div className="past">
            <h2>Past Reservations</h2>
            {pastReservations ? (
              <div>
                {displayedReservations.map((reservation) => (
                  <div key={reservation.id} className="reservation-past">
                    <p>{reservation.lotName}</p>
                    <p>
                      {`Reserved ${getFormattedDate(reservation.reservedAt)}`}
                    </p>
                  </div>
                ))}
                {pastReservations.length > limit && (
                  <p
                    onClick={() => setShowFullText(!showFullText)}
                    className="show-All"
                  >
                    {showFullText ? "Show Less" : "Show All"}
                  </p>
                )}
              </div>
            ) : (
              <div> No past reservations </div>
            )}
          </div>
        </div>
      </div>
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
    </div>
  );
};

export default Reserve;

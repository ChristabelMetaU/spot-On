/** @format */
import { useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import SearchForSpot from "./SearchForSpot";
import { useAuth } from "./AuthContext";
import Message from "./Message";
import { sendWebSocket, connectWebSocket } from "../utils/websocket";
import { getFormattedDate } from "../utils/getFormattedDate";
import Timer from "./Timer";
const Reserve = ({
  setIsRoutingToHome,
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
}) => {
  const [isReserveBtnClicked, setIsReserveBtnClicked] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [currentReservation, setCurrentReservation] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch("http://localhost:3000/spots/get/reserve");
      const data = await response.json();
      if (data) {
        setPastReservations(data);
      } else {
        setPastReservations([]);
      }
    };
    fetchReservations();
  }, []);
  const resetForm = () => {
    setSearchKeyword("");
    setSelectedSpot([]);
    setShowResults(false);
    setSearchResults([]);
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
    }
  };
  useEffect(() => {
    if (isReserveBtnClicked) {
      connectWebSocket((data) => {
        if (data.type === "RESERVE_SUCCESS") {
          setIsReserved(true);
          setShowTimer(true);
          setTimeLeft(600);
          handleReservation();
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
    });
  };
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimer(false);
      setCurrentReservation([]);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
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
        <button onClick={() => setIsReserveBtnClicked(true)}>
          Reserve a Spot
        </button>
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
                <button className="reserve-btn">Close</button>
              </div>
            </div>
          </form>
        )}

        <div>
          <h2>Reservations</h2>
          <div>
            <h2>Current Reservation</h2>
            {currentReservation.reservedAt ? (
              <div>
                <h2>
                  {
                    spots.find((spot) => spot.id === currentReservation.spotId)
                      .lotName
                  }
                </h2>
                <p>
                  {`Reserved ${getFormattedDate(
                    currentReservation.reservedAt
                  )}`}
                </p>
              </div>
            ) : (
              <div> No current reservation </div>
            )}
          </div>
          <div>
            <h2>Past Reservations</h2>
            {pastReservations &&
              pastReservations
                .filter(
                  (reservation) =>
                    new Date(reservation.reservedAt) > new Date() - 6048000
                )
                .map((reservation) => (
                  <div key={reservation.id}>
                    <h2>{reservation.lotName}</h2>
                    <p>
                      {`Reserved ${getFormattedDate(reservation.reservedAt)}`}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
    </div>
  );
};

export default Reserve;

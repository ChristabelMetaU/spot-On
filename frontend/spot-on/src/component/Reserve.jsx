/** @format */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchForSpot from "./SearchForSpot";
import { useAuth } from "./AuthContext";
import Message from "./Message";
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
}) => {
  const [isReserveBtnClicked, setIsReserveBtnClicked] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleReservation = async () => {
    const formData = {
      spotId: selectedSpot.id,
      userId: user.id,
    };
    const isEmptyField = searchKeyword === "" || selectedSpot.length === 0;
    if (isEmptyField) {
      setError("Please fill in all the fields");
      return;
    }
    // Make a POST request to the server
    const response = await fetch("http://localhost:3000/spots/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data) {
      setIsReserveBtnClicked(false);
      setMessage("Reservation successful");
      setIsVisible(true);
      setSearchKeyword("");
      setSelectedSpot([]);
      setShowResults(false);
      setSearchResults([]);
    } else {
      setMessage("Reservation failed");
      setIsVisible(true);
      setSearchKeyword("");
      setSelectedSpot([]);
      setShowResults(false);
      setSearchResults([]);
    }
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
        <button onClick={() => setIsReserveBtnClicked(true)}>
          Reserve a Spot
        </button>

        {isReserveBtnClicked && (
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
              <button className="reserve-btn" onClick={handleReservation}>
                Reserve spot
              </button>
              <button
                className="reserve-btn"
                onClick={() => setIsReserveBtnClicked(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div>
          <h2>Reservation History</h2>
          <div></div>
        </div>
      </div>
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
    </div>
  );
};

export default Reserve;

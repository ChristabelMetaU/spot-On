/** @format */
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Reserve = ({ setIsRoutingToHome }) => {
  const [isReserveBtnClicked, setIsReserveBtnClicked] = useState(false);
  const navigate = useNavigate();
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
          <di className="modal-overlay">
            <div className="modal-content">
              <h2>Reserve a Spot</h2>
              <p>For 10 minutes only</p>
              <p>PS: Reserving a spot does not mean you own it.</p>
              <p>st prevents others from navigating to it</p>
              <button>Reserve spot</button>
              <button onClick={() => setIsReserveBtnClicked(false)}>
                Close
              </button>
            </div>
          </di>
        )}

        <div>
          <h2>Reservation History</h2>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Reserve;

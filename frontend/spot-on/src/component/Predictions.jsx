/** @format */
import { useNavigate } from "react-router-dom";
const Predictions = ({ setIsRoutingToHome }) => {
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
        <h2>SpotOn</h2>
        <div className="header-text">
          <p>Availabiloty Predictions for You</p>
          <p>Your spot, yur way</p>
        </div>
      </div>
    </div>
  );
};

export default Predictions;

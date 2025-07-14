/** @format */
import { useNavigate } from "react-router-dom";
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="quick-actions">
      <h1>Quick Actions</h1>
      <div className="actions-body">
        <div
          className="actions-div"
          onClick={() => navigate("/Home/RouteDetails")}
        >
          <h3> Smart Routing</h3>
          <p>Find shortest path to closest spot </p>
          <p>Find shortest path from u to closest spot to dest</p>
        </div>

        <div
          className="actions-div"
          onClick={() => navigate("/Home/ReserveDetails")}
        >
          <h3>Reserve a Spot</h3>
          <p>Reserve any spot for 10 min</p>
        </div>

        <div className="actions-div">
          <h3>Analytics</h3>
          <p>Your parking pattern and more</p>
        </div>

        <div className="actions-div">
          <h3>Notifications</h3>
          <p>Personalozed notifications</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;

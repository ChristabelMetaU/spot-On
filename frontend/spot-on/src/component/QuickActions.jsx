/** @format */
import { useNavigate } from "react-router-dom";
import TooltipWrapper from "./ToolTipWrapper";
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="quick-actions">
      <h1>Quick Actions</h1>
      <div className="actions-body">
        <TooltipWrapper text="Heading to school? Find the best spot">
          <div
            className="actions-div"
            onClick={() => navigate("/Home/RouteDetails")}
          >
            <h3> Smart Routing</h3>
            <p>route to spots based on your destination </p>
            <p>Rank and sort spots for you </p>
          </div>
        </TooltipWrapper>

        <TooltipWrapper text="Reserve your favorite spot now">
          <div
            className="actions-div"
            onClick={() => navigate("/Home/ReserveDetails")}
          >
            <h3>Reserve a Spot</h3>
            <p>Reserve any spot for 10 min</p>
            <p>cancel reservation anytime</p>
          </div>
        </TooltipWrapper>

        <TooltipWrapper text="See if your spot might be free tomorrow.">
          <div
            className="actions-div"
            onClick={() => navigate("/Home/Predictions")}
          >
            <h3>Analytic DashBoard</h3>
            <p>Your parking pattern and more</p>
            <p>Your predictions</p>
          </div>
        </TooltipWrapper>

        <TooltipWrapper text="Find out spots you have not released.">
          <div
            className="actions-div"
            onClick={() => navigate("/Home/Notifications")}
          >
            <h3>Notifications</h3>
            <p>Personalozed notifications</p>
            <p>check if you have not unlocked a spot.</p>
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default QuickActions;

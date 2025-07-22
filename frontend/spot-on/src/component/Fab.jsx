/** @format */
import { useNavigate } from "react-router-dom";
import TooltipWrapper from "./ToolTipWrapper";
const Fab = () => {
  const navigate = useNavigate();
  return (
    <TooltipWrapper text="Find best route to spot of your choice">
      <button className="fab" onClick={() => navigate("/Home/RouteDetails")}>
        <i className="fa-solid fa-car"></i>
      </button>
    </TooltipWrapper>
  );
};

export default Fab;

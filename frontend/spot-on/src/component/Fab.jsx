/** @format */
import { useNavigate } from "react-router-dom";
import TooltipWrapper from "./ToolTipWrapper";
import "../styles/Fab.css";
const Fab = () => {
  const navigate = useNavigate();
  return (
    <button className="fab" onClick={() => navigate("/Home/RouteDetails")}>
      <i className="fa-solid fa-car"></i>
    </button>
  );
};

export default Fab;

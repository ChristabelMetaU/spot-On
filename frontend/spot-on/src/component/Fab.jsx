/** @format */
import { useNavigate } from "react-router-dom";
const Fab = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <button className="fab" onClick={() => navigate("/Home/RouteDetails")}>
      <i className="fa-solid fa-car"></i>
    </button>
  );
};

export default Fab;

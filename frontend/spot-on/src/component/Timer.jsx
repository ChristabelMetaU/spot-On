/** @format */
import { formatTime } from "../utils/formatTime";
import "../styles/Fab.css";
const Timer = ({ timeLeft }) => {
  return (
    <div className="fab-timer">
      <h2>Time Left: {formatTime(timeLeft)}</h2>
    </div>
  );
};

export default Timer;

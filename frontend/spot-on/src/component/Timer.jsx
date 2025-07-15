/** @format */
import { formatTime } from "../utils/formatTime";
const Timer = ({ timeLeft }) => {
  return (
    <div className="fab-timer">
      <h2>Time Ledt:</h2>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;

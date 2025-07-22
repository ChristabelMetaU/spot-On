/** @format */

const BestAvailabilityCard = ({
  lotName,
  availability,
  waitTime,
  peakTime,
}) => {
  return (
    <div className="best-card-container">
      <div className="best-card-header">
        <h3 className="best-card-title">Best Availability</h3>
        <span className="best-card-lot">
          {lotName} ({availability}%)
        </span>
      </div>
      <div className="best-card-details">
        <p>
          Avg Wait Time: <span className="detail-value">{waitTime}</span>
        </p>
        <p>
          Peak Predicted: <span className="detail-value">{peakTime}</span>
        </p>
      </div>
    </div>
  );
};

export default BestAvailabilityCard;

/** @format */

const LotPredictionCard = ({
  lotName,
  availabilityLevel,
  currentSpots,
  totalSpots,
  projectedFree,
  walkTime,
  lastReport,
}) => {
  const levelClass =
    {
      High: "lot-card-high",
      Medium: "lot-card-medium",
      Low: "lot-card-low",
    }[availabilityLevel] || "lot-card-low";

  const percent = Math.round((currentSpots / totalSpots) * 100);
  const projectedPercent = Math.round((projectedFree / totalSpots) * 100);

  return (
    <div className={`lot-card-container ${levelClass}`}>
      <div className="lot-card-header">
        <h4 className="lot-card-title">{lotName}</h4>
        <span className="lot-card-level">{availabilityLevel} Availability</span>
      </div>

      <div className="lot-card-body">
        <p>
          <strong>Available Spots:</strong> {currentSpots}/{totalSpots} (
          {percent}%)
        </p>
        <p>
          <strong>In 15 mins:</strong> {projectedFree}/{totalSpots} (
          {projectedPercent}%)
        </p>
        <p>
          <strong>Walk Time:</strong> {walkTime}
        </p>
        <p>
          <strong>Last Report:</strong> {lastReport}
        </p>
      </div>
    </div>
  );
};

export default LotPredictionCard;

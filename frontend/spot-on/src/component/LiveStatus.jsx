/** @format */

const LiveStatus = ({ freeCount }) => {
  return (
    <div className="live-stats">
      <h4>App status</h4>
      <div className="stat-numbers">
        <div className="stat-body">
          <p>{freeCount}</p>
          <p>Free Lots near u</p>
        </div>
        <div className="stat-body">
          <p>0</p>
          <p>average week max</p>
        </div>
        <div className="stat-body">
          <p>100%</p>
          <p>Accuracy</p>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;

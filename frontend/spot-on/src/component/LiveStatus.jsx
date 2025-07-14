/** @format */

const LiveStatus = ({ freeCount, activeUsers }) => {
  return (
    <div className="live-stats">
      <h4>App status</h4>
      <div className="stat-numbers">
        <div className="stat-body">
          <p>{freeCount}</p>
          <p>Free Lots near u</p>
        </div>
        <div className="stat-body">
          <p>{`${activeUsers.length} viewing`}</p>
          <i className="fa fa-eye" aria-hidden="true"></i>
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

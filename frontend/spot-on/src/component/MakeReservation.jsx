/** @format */

const MakeReservation = ({
  setReserve,
  setShowMakeReservation,
  noReservationCnt,
  setNoReservationCnt,
}) => {
  const handleClick = (bool) => {
    if (!bool) setNoReservationCnt(noReservationCnt + 1);
    setReserve(bool);
    setShowMakeReservation(false);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>You are less than 10 minutes from your Spot</p>
        <p>Do you Want to reserve your destination spot?</p>
        <div className="makeReservation-btns">
          <button onClick={() => handleClick(true)}>Yes</button>
          <button onClick={() => handleClick(false)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default MakeReservation;

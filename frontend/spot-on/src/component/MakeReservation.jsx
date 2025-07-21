/** @format */

const MakeReservation = ({
  setReserve,
  setShowMakeReservation,
  noReservationCnt,
  setNoReservationCnt,
  id,
  spots,
}) => {
  const handleClick = (bool) => {
    if (!bool) setNoReservationCnt(noReservationCnt + 1);
    setReserve(bool);
    setShowMakeReservation(false);
  };
  const spotName = spots.find((spot) => spot.id === id)?.lotName;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Your ETA is less than 10 minutes to {spotName}</p>
        <p>Do you Want to reserve your destination spot?</p>
        <div className="makeReservation-btns">
          <button onClick={() => handleClick(true)}>Click to Reserve</button>
          <button onClick={() => handleClick(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MakeReservation;

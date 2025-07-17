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
  //display spot name with the id
  const spotName = spots.find((spot) => spot.id === id)?.lotName;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>
          You ETA is less than 10 minutes, would you like to reserve {spotName}
        </p>
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

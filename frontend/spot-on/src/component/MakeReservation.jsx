/** @format */

const MakeReservation = ({ setReserve, setShowMakeReservation }) => {
  const handleClick = (bool) => {
    setReserve(bool);
    setShowMakeReservation(false);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Do you Want to reserve the closest spot?</p>
        <button onClick={() => handleClick(true)}>Yes</button>
        <button onClick={() => handleClick(false)}>No</button>
      </div>
    </div>
  );
};

export default MakeReservation;

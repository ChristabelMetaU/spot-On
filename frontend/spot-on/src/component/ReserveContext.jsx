/** @format */

import { useContext, createContext, useState } from "react";
const ReserveContext = createContext();

export const ReserveProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentReservation, setCurrentReservation] = useState([]);
  const [hasReserve, setHasReserve] = useState(false);
  const [reservedSpotId, setReservedSpotId] = useState(-1);
  return (
    <ReserveContext.Provider
      value={{
        timeLeft,
        setTimeLeft,
        currentReservation,
        setCurrentReservation,
        hasReserve,
        setHasReserve,
        reservedSpotId,
        setReservedSpotId,
      }}
    >
      {children}
    </ReserveContext.Provider>
  );
};

export const useTime = () => useContext(ReserveContext);

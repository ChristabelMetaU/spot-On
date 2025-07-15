/** @format */

import { useContext, createContext, useState } from "react";
const ReserveContext = createContext();

export const ReserveProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentReservation, setCurrentReservation] = useState([]);
  return (
    <ReserveContext.Provider
      value={{
        timeLeft,
        setTimeLeft,
        currentReservation,
        setCurrentReservation,
      }}
    >
      {children}
    </ReserveContext.Provider>
  );
};

export const useTime = () => useContext(ReserveContext);

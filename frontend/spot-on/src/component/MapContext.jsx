/** @format */

import { useContext, createContext, useState, useCallback } from "react";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  return (
    <MapContext.Provider value={{ map, onLoad }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

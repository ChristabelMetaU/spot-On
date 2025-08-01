/** @format */
import { useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "./AuthContext";
import { useState, useMemo, useCallback } from "react";
import { clusterSpots } from "../utils/clusterSpots";
import { sendWebSocket } from "../utils/WebSocket";
import { useMap } from "./MapContext";
import MapLoading from "./MapLoading";
import Map from "./Map";
import { useTime } from "./ReserveContext";
const LIBRARIES = ["geometry", "places", "routes"];

const Body = ({
  mode,
  name,
  spots,
  setSpots,
  selectedSpot,
  setSelectedSpot,
  setShowModal,
  setActive,
  activeFilters,
  userLocation,
  locked,
  setLocked,
  lockedSpotId,
  setLockedSpotId,
  routePath,
  destinationLocation,
  endLocation,
  isRoutingToHome,
  setSearchKeyword,
  setIsReserveBtnClicked,
}) => {
  const base_URL = import.meta.env.VITE_BACKEND_URL;
  const { map, onLoad } = useMap();
  const { loading, user } = useAuth();
  const [len, setLen] = useState(0);
  const { hasReserve, reservedSpotId } = useTime();
  let count = 0;
  const [zoom, setZoom] = useState(17);
  const CLUSTER_BREAKPOINT = 19;
  const isHome = mode === "Home" ? true : false;
  const onMapReady = useCallback(
    (map) => {
      onLoad(map);

      map.addListener("zoom_changed", () => {
        setZoom(map.getZoom());
      });
    },
    [onLoad]
  );

  const handleClusterClick = ({ centerLat, centerLng }) => {
    if (!map) return;

    map.panTo({ lat: centerLat, lng: centerLng });
    const newZoom = Math.min(23, map.getZoom() + 2);

    map.setZoom(newZoom);
  };

  const handleMapClick = async (e) => {
    if (isHome) {
      setLen(len + 1);
      const newSpot = {
        lotName: `Mary hall spot ${len}`,
        type: "red",
        Price: 2.0,
        coordLat: e.latLng.lat(),
        coordLng: e.latLng.lng(),
        isOccupied: false,
      };
      try {
        const response = await fetch(`${base_URL}/spots/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSpot),
        });
        if (!response.ok) {
          throw new Error("Error now adding new spot");
        }
        const savedSpot = await response.json();
        setSpots([...spots, savedSpot]);
      } catch (error) {
        throw new Error("Error adding new spot");
      }
    }
  };

  const displaySpotInfo = (spot, i) => {
    if (isHome) {
      setShowModal(true);
      setSelectedSpot(spot);

      setLockedSpotId(spot.id);
      setLocked(true);
      setActive({ spot, idx: i });

      sendWebSocket({
        type: "LOCK_SPOT",
        isOccupied: spot.isOccupied,
        spotId: spot.id,
        userId: user.id,
      });
    }
  };

  const filtered = useMemo(() => {
    if (isHome) {
      return spots.filter((spot) => {
        const types = spot.type.split(/\s+/);
        const typeOk = types.some((t) => activeFilters[t.toLowerCase()]);
        const occOk = spot.isOccupied
          ? activeFilters.occupied
          : activeFilters.free;
        return typeOk && occOk;
      });
    } else {
      return spots;
    }
  }, [activeFilters, spots]);

  const clustered = useMemo(() => {
    return clusterSpots(filtered, 80);
  }, [filtered]);

  const getIcon = (spot) => {
    if (!isHome) {
      if (endLocation && spot.coordLat === endLocation.lat) {
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }
    }
    if (hasReserve && reservedSpotId === spot.id) {
      return "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";
    }
    if (lockedSpotId === spot.id && locked) {
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    if (spot.isOccupied) {
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else {
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: LIBRARIES,
  });
  if (!isLoaded) {
    return <MapLoading />;
  }
  return (
    <section className="map-container">
      <div className="map-title"> {name}</div>
      <Map
        loading={loading}
        userLocation={userLocation}
        clustered={clustered}
        handleMapClick={handleMapClick}
        handleClusterClick={handleClusterClick}
        displaySpotInfo={displaySpotInfo}
        zoom={zoom}
        getIcon={getIcon}
        routePath={routePath}
        count={count}
        onLoad={onMapReady}
        CLUSTER_BREAKPOINT={CLUSTER_BREAKPOINT}
        map={map}
        isHome={isHome}
        destinationLocation={destinationLocation}
        endLocation={endLocation}
        isRoutingToHome={isRoutingToHome}
        selectedSpot={selectedSpot}
        setSelectedSpot={setSelectedSpot}
        setSearchKeyword={setSearchKeyword}
        setIsReserveBtnClicked={setIsReserveBtnClicked}
      />
    </section>
  );
};

export default Body;

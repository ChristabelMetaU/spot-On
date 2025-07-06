/** @format */
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import MapLoading from "./MapLoading";
import { useAuth } from "./AuthContext";
import React, { useState, useMemo, useCallback } from "react";
import { clusterSpots } from "../utils/clusterSpots";
import { set } from "date-fns";
import { sendWebSocket } from "../utils/websocket";
const containerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
  flex: "1 1 50%",
};

const Body = ({
  spots,
  setSpots,
  setSelectedSpot,
  setShowModal,
  setActive,
  activeFilters,
  userLocation,
  locked,
  setLocked,
  lockedSpotId,
  setLockedSpotId,
}) => {
  const { loading, user } = useAuth();
  const [len, setLen] = useState(0);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(17);
  const center = { lat: 35.8486, lng: -86.3669 };
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const CLUSTER_BREAKPOINT = 19;
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);

    mapInstance.addListener("zoom_changed", () => {
      setZoom(mapInstance.getZoom());
    });
  }, []);

  const handleClusterClick = ({ centerLat, centerLng }) => {
    if (!map) return;
    map.panTo({ lat: centerLat, lng: centerLng });
    const newZoom = Math.min(23, map.getZoom() + 2);

    map.setZoom(newZoom);
  };

  const handleMapClick = async (e) => {
    setLen(len + 1);
    const newSpot = {
      lotName: `East of Gree spot ${len}`,
      type: "white handicap",
      coordLat: e.latLng.lat(),
      coordLng: e.latLng.lng(),
      isOccupied: false,
    };
    try {
      const response = await fetch("http://localhost:3000/spots/", {
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
  };

  const displaySpotInfo = (spot, i) => {
    setShowModal(true);
    setSelectedSpot(spot);
    setLockedSpotId(spot.id);
    setLocked(true);
    setActive({ spot, idx: i });
    console.log(spot);
    sendWebSocket({
      type: "LOCK_SPOT",
      spotId: spot.id,
      userId: user.id,
    });
  };

  const filtered = useMemo(() => {
    return spots.filter((spot) => {
      const types = spot.type.split(/\s+/);
      const typeOk = types.some((t) => activeFilters[t.toLowerCase()]);
      const occOk = spot.isOccupied
        ? activeFilters.occupied
        : activeFilters.free;
      return typeOk && occOk;
    });
  }, [activeFilters, spots]);

  const clustered = useMemo(() => {
    return clusterSpots(filtered, 80);
  }, [filtered]);
  const getIcon = (spot) => {
    if (lockedSpotId === spot.id && locked) {
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    if (spot.isOccupied) {
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else {
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
  };
  return (
    <section className="map-container">
      <div className="map-title"> Campus Pakring assistant</div>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        {loading ? (
          <MapLoading />
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            zoom={zoom}
            center={userLocation}
            onDblClick={handleMapClick}
          >
            {clustered.map((cluster, idx) => {
              const { centerLat, centerLng, spots: group } = cluster;
              const position = { lat: centerLat, lng: centerLng };

              if (zoom > CLUSTER_BREAKPOINT) {
                map.panTo({ lat: centerLat, lng: centerLng });

                return group.map((spot, i) => {
                  const nameArr = spot.lotName.split(" ");
                  const name = nameArr[nameArr.length - 1];

                  return (
                    <React.Fragment key={spot.id}>
                      <Marker
                        key={spot.id}
                        position={{ lat: spot.coordLat, lng: spot.coordLng }}
                        icon={{ url: getIcon(spot) }}
                        onClick={() => {
                          displaySpotInfo(spot, i);
                        }}
                      />
                      <OverlayView
                        position={{ lat: spot.coordLat, lng: spot.coordLng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            border: "1px solid black",
                            paddingRight: "15px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            transform: "translate(10px -10px)",
                            space: "nowrap",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {name}
                        </div>
                      </OverlayView>
                    </React.Fragment>
                  );
                });
              }
              if (map) {
                map.panTo({ lat: centerLat, lng: centerLng });
              }
              const count = group.length;
              const radius = 24;
              const freePrcnt =
                (group.filter((spot) => !spot.isOccupied).length / count) * 100;
              const stroke = 6;
              const circumference = 2 * Math.PI * radius;
              const freeOffset =
                circumference - (freePrcnt / 100) * circumference;

              const svg = `<svg width="60" height="60" viewBox = "0 0 60 60 " xmlns="http://www.w3.org/2000/svg" >
                <circle cx="30" cy="30" r="${radius}" fill="none" stroke="red" stroke-width="${stroke}" />
                <circle cx="30" cy="30" r="${radius}" fill="white" stroke="#4CAF50" stroke-width="${stroke}" stroke-dasharray="${circumference}" stroke-dashoffset="${freeOffset}" stroke-linecap="round" transform="rotate(-90 30 30)" />
                <text x="30" y="35" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">${count}</text>
                </svg>`;
              const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                svg
              )}`;
              return (
                <React.Fragment key={idx}>
                  <Marker
                    key={`cluster-${idx}`}
                    position={position}
                    icon={{
                      url: iconUrl,
                      scaledSize: new window.google.maps.Size(
                        radius * 2,
                        radius * 2
                      ),
                    }}
                    onClick={(e) => {
                      handleClusterClick({ centerLat, centerLng });
                    }}
                  />
                  <OverlayView
                    position={{ lat: centerLat, lng: centerLng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        backgroundColor: "#1c2e46",
                        border: "1px solid white",
                        paddingRight: "45px",
                        paddingLeft: "8px",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "12px",
                        transform: "translate(10px -10px)",
                        space: "nowrap",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {`Lot has ${count} spots`}
                    </div>
                  </OverlayView>
                </React.Fragment>
              );
            })}
          </GoogleMap>
        )}
      </LoadScript>
    </section>
  );
};

export default Body;

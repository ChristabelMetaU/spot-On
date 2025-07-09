/** @format */
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
  Polyline,
} from "@react-google-maps/api";
import MapLoading from "./MapLoading";
import { useAuth } from "./AuthContext";
import React, { useState, useMemo, useCallback } from "react";
import { clusterSpots } from "../utils/clusterSpots";
import { sendWebSocket } from "../utils/websocket";
const LIBRARIES = ["geometry", "places", "routes"];
const containerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
  flex: "1 1 50%",
};
const Map = ({
  loading,
  userLocation,
  clustered,
  handleMapClick,
  handleClusterClick,
  displaySpotInfo,
  zoom,
  getIcon,
  routePath,
  onLoad,
  CLUSTER_BREAKPOINT,
  endLocation,
  isHome,
  map,
}) => {
  return (
    <>
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
                      animation={
                        !isHome && spot.coordLat === endLocation?.lat
                          ? window.google.maps.Animation.BOUNCE
                          : null
                      }
                    />
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                      />
                    )}
                    {routePath && routePath.length > 0 && (
                      <Polyline
                        path={routePath?.map((p) => ({
                          lat: p.lat,
                          lng: p.lng,
                        }))}
                        options={{
                          strokeColor: "#34A853",
                          strokeOpacity: 1,
                          strokeWeight: 5,
                          zIndex: 2,
                          geodesic: true,
                        }}
                      />
                    )}
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
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                    animation={window.google.maps.Animation.DROP}
                  />
                )}
                {routePath && routePath.length > 0 && (
                  <Polyline
                    path={routePath?.map((p) => ({
                      lat: p.lat,
                      lng: p.lng,
                    }))}
                    options={{
                      strokeColor: "#34A853",
                      strokeOpacity: 1,
                      strokeWeight: 5,
                      zIndex: 2,
                      geodesic: true,
                    }}
                  />
                )}
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
                    {`spots: ${count}`}
                  </div>
                </OverlayView>
              </React.Fragment>
            );
          })}
        </GoogleMap>
      )}
    </>
  );
};

const Body = ({
  mode,
  name,
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
  routePath,
  destinationLocation,
  endLocation,
}) => {
  const { loading, user } = useAuth();
  const [len, setLen] = useState(0);
  const [map, setMap] = useState(null);
  let count = 0;
  const [zoom, setZoom] = useState(17);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const CLUSTER_BREAKPOINT = 19;
  const isHome = mode === "Home" ? true : false;
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
    if (isHome) {
      setLen(len + 1);
      const newSpot = {
        lotName: `Mary hall spot ${len}`,
        type: "red",
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
      <div className="map-title"> {name}</div>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={LIBRARIES}>
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
          onLoad={onLoad}
          CLUSTER_BREAKPOINT={CLUSTER_BREAKPOINT}
          map={map}
          isHome={isHome}
          destinationLocation={destinationLocation}
        />
      </LoadScript>
    </section>
  );
};

export default Body;

/** @format */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapLoading from "./MapLoading";
import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Overlay from "./OverlayView";
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
  isRoutingToHome,
  selectedSpot,
  setSearchKeyword,
  setSelectedSpot,
  setIsReserveBtnClicked,
}) => {
  const polyLine = useRef(null);
  const [hasPanned, setHasPanned] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if ((map && !hasPanned && clustered.length > 0) || isRoutingToHome) {
      const firstCluster = clustered[0];
      if (firstCluster && firstCluster.centerLat && firstCluster.centerLng) {
        const center = {
          lat: firstCluster.centerLat,
          lng: firstCluster.centerLng,
        };
        map.panTo(center);
        setHasPanned(true);
      }
    }
    if (map) {
      if (
        selectedSpot &&
        selectedSpot.coordLat &&
        selectedSpot.coordLng &&
        !clustered.some((cluster) => cluster.spots.includes(selectedSpot))
      ) {
        const center = {
          lat: selectedSpot.coordLat,
          lng: selectedSpot.coordLng,
        };
        map.panTo(center);
      }
    }
  }, [hasPanned, map, clustered, isRoutingToHome, selectedSpot]);
  useEffect(() => {
    if (isHome || !map || routePath.length < 2 || !window.google) return;
    if (polyLine.current) {
      polyLine.current.setMap(null);
    }
    const glowline = new window.google.maps.Polyline({
      path: routePath,
      map: map,
      strokeColor: "#00ffff",
      strokeOpacity: 0.4,
      strokeWeight: 15,
      zIndex: 1,
      geodesic: true,
    });

    const newPolyLine = new window.google.maps.Polyline({
      path: routePath,
      map: map,
      strokeColor: "#1368d8",
      strokeOpacity: 0.9,
      strokeWeight: 6,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            strokeColor: "#1e90ff",
          },
          offset: "0%",
          repeat: "50px",
        },
      ],

      zIndex: 2,
      geodesic: true,
    });
    polyLine.current = newPolyLine;
    return () => {
      glowline.setMap(null);
      newPolyLine.setMap(null);
    };
  }, [routePath, map]);
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
                        animation={window.google.maps.Animation.BOUNCE}
                      />
                    )}

                    {!isHome &&
                      endLocation &&
                      spot.coordLat === endLocation.lat && (
                        <div
                          onClick={() => {
                            setSearchKeyword(spot.lotName);
                            setSelectedSpot(spot);
                            navigate("/Home/ReserveDetails");
                            setTimeout(() => {
                              setIsReserveBtnClicked(true);
                            }, 2000);
                          }}
                          styule={{ cursor: "pointer" }}
                        >
                          <Overlay
                            title={"Your spot: \n Click to Reserve"}
                            lat={spot.coordLat}
                            lng={spot.coordLng}
                          />
                        </div>
                      )}
                    {spot.coordLat !== endLocation?.lat && (
                      <Overlay
                        title={name}
                        mode="spot"
                        lat={spot.coordLat}
                        lng={spot.coordLng}
                      />
                    )}

                    {userLocation && (
                      <Overlay
                        title={"YOU"}
                        lat={userLocation.lat}
                        lng={userLocation.lng}
                      />
                    )}
                  </React.Fragment>
                );
              });
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
                    animation={window.google.maps.Animation.BOUNCE}
                  />
                )}
                {userLocation && (
                  <Overlay
                    title={"YOU"}
                    lat={userLocation.lat}
                    lng={userLocation.lng}
                  />
                )}

                <Overlay
                  title={`spots: ${count}`}
                  lat={centerLat}
                  lng={centerLng}
                />
              </React.Fragment>
            );
          })}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;

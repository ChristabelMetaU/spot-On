/** @format */

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import redDot from "../assets/redDot.jpg";
import greenDot from "../assets/greenDot.jpg";
const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = { lat: 35.8486, lng: -86.3669 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const Body = ({ spots, setSpots, setSelectedSpot, setShowModal }) => {
  const handleMapClick = async (e) => {
    const newSpot = {
      lot_name: `Lot ${spots.length + 1}`,
      coord_lat: e.latLng.lat(),
      coord_lng: e.latLng.lng(),
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
        throw new Error("Error adding new spot");
      }
      const savedSpot = await response.json();
      setSpots([...spots, savedSpot]);
    } catch (error) {
      throw new Error("Error adding new spot");
    }
  };
  const displaySpotInfo = (spot) => {
    setShowModal(true);
    setSelectedSpot(spot);
  };
  return (
    <main>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          onDblClick={handleMapClick}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.coord_lat, lng: spot.coord_lng }}
              icon={{
                url: spot.isOccupied ? { greenDot } : { redDot },
              }}
              onClick={() => {
                displaySpotInfo(spot);
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </main>
  );
};

export default Body;

/** @format */
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
  flex: "1 1 50%",
};

const center = { lat: 35.8486, lng: -86.3669 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const Body = ({
  spots,
  setSpots,
  setSelectedSpot,
  setShowModal,
  setActive,
}) => {
  const handleMapClick = async (e) => {
    const newSpot = {
      lotName: `SPOT ${spots.length + 1}`,
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
    setActive({ spot, idx: i });
  };
  return (
    <section className="map-container">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          onDblClick={handleMapClick}
        >
          {spots.map((spot, i) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.coordLat, lng: spot.coordLng }}
              icon={{
                url: spot.isOccupied
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              }}
              onClick={() => {
                displaySpotInfo(spot, i);
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </section>
  );
};

export default Body;

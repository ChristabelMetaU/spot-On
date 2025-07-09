/** @format */

import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import { Autocomplete } from "@react-google-maps/api";
const DestSearch = ({ onSelect }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const MTSU = { lat: 35.8486, lng: -86.3669 };
  const MTSU_BOUNDS = {
    north: MTSU.lat + 0.02,
    south: MTSU.lat - 0.02,
    east: MTSU.lng + 0.02,
    west: MTSU.lng - 0.02,
  };
  const inputRef = useRef(null);
  const handlePlaceChanged = () => {
    if (autocomplete != null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onSelect({ lat, lng, name: place.name });
    }
  };
  return (
    <Autocomplete
      onLoad={(ac) => setAutocomplete(ac)}
      onPlaceChanged={handlePlaceChanged}
      options={{
        bounds: MTSU_BOUNDS,
        strictBounds: true,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "name"],
      }}
    >
      <div className="search-bar">
        <input
          ref={inputRef}
          placeholder="Enter your Destination"
          type="text"
          style={{
            flex: 1,
            padding: "10px",
            marginLeft: "2rem",
            marginRight: "2rem",
          }}
        />
      </div>
    </Autocomplete>
  );
};

export default DestSearch;

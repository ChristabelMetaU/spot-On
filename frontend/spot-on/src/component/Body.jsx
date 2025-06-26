import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import redDot from '../assets/redDot.jpg';
import greenDot from '../assets/greenDot.jpg';
const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = { lat: 35.8486, lng: -86.3669 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const Body = ({ spots }) => {
  return (
    <main>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.coord_lat, lng: spot.coord_lng }}
              icon={{
                url: spot.isOccupied ? {redDot} : {greenDot},
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </main>
  );
};

export default Body;

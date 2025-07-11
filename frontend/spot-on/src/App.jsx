/** @format */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import Welcome from "./pages/Welcome";
import RouteDetails from "./component/RouteDetails";
import { AuthProvider } from "./component/AuthContext";
import { useAuth } from "./component/AuthContext";
import { MapProvider } from "./component/MapContext";
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/Welcome" />;
}
function AppRoutes() {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locked, setLocked] = useState(false);
  const [lockedSpotId, setLockedSpotId] = useState(null);
  const [freeCount, setFreeCount] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    red: true,
    green: true,
    white: true,
    handicap: true,
    free: true,
    occupied: true,
  });
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route
          path="/Welcome"
          element={!user ? <Welcome /> : <Navigate to="/" />}
        />
        <Route
          path="/SignUp"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/Login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Home
                spots={spots}
                setSpots={setSpots}
                selectedSpot={selectedSpot}
                setSelectedSpot={setSelectedSpot}
                showmodal={showModal}
                setShowModal={setShowModal}
                active={active}
                setActive={setActive}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                locked={locked}
                setLocked={setLocked}
                lockedSpotId={lockedSpotId}
                setLockedSpotId={setLockedSpotId}
                freeCount={freeCount}
                setFreeCount={setFreeCount}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                setIsMapLoaded={setIsMapLoaded}
                destinationLocation={destinationLocation}
              />
            }
          />

          <Route
            path="/Home/RouteDetails"
            element={
              <RouteDetails
                spots={spots}
                setSpots={setSpots}
                setSelectedSpot={setSelectedSpot}
                setShowModal={setShowModal}
                setActive={setActive}
                activeFilters={activeFilters}
                locked={locked}
                setLocked={setLocked}
                lockedSpotId={lockedSpotId}
                setLockedSpotId={setLockedSpotId}
                setFreeCount={setFreeCount}
                isMapLoaded={isMapLoaded}
                destinationLocation={destinationLocation}
                setDestinationLocation={setDestinationLocation}
                userLocation={userLocation}
              />
            }
          />

          <Route path="/Profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <MapProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </MapProvider>
  );
}

export default App;

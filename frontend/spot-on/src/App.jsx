/** @format */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/Welcome" />;
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
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
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home/RouteDetails"
          element={
            <ProtectedRoute>
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
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

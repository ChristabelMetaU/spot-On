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
import Reserve from "./component/Reserve";
import { ReserveProvider } from "./component/ReserveContext";
function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/Welcome" />;
}
function AppRoutes() {
  const [spots, setSpots] = useState([]);
  const [isRoutingToHome, setIsRoutingToHome] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locked, setLocked] = useState(false);
  const [lockedSpotId, setLockedSpotId] = useState(null);
  const [freeCount, setFreeCount] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isReserveBtnClicked, setIsReserveBtnClicked] = useState(false);
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
                isRoutingToHome={isRoutingToHome}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                showResults={showResults}
                setShowResults={setShowResults}
                message={message}
                setMessage={setMessage}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                isReserved={isReserved}
                setIsReserved={setIsReserved}
                showTimer={showTimer}
                setShowTimer={setShowTimer}
                isReserveBtnClicked={isReserveBtnClicked}
                setIsReserveBtnClicked={setIsReserveBtnClicked}
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
                setIsRoutingToHome={setIsRoutingToHome}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                isReserveBtnClicked={isReserveBtnClicked}
                setIsReserveBtnClicked={setIsReserveBtnClicked}
              />
            }
          />

          <Route
            path="/Profile"
            element={<UserProfile setIsRoutingToHome={setIsRoutingToHome} />}
          />

          <Route
            path="/Home/ReserveDetails"
            element={
              <Reserve
                setIsRoutingToHome={setIsRoutingToHome}
                spots={spots}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                showResults={showResults}
                setShowResults={setShowResults}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                selectedSpot={selectedSpot}
                setSelectedSpot={setSelectedSpot}
                message={message}
                setMessage={setMessage}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                isReserved={isReserved}
                setIsReserved={setIsReserved}
                showTimer={showTimer}
                setShowTimer={setShowTimer}
                userLocation={userLocation}
                isReserveBtnClicked={isReserveBtnClicked}
                setIsReserveBtnClicked={setIsReserveBtnClicked}
                isRoutingToHome={isRoutingToHome}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <MapProvider>
      <ReserveProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ReserveProvider>
    </MapProvider>
  );
}

export default App;

/** @format */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Loading from "./component/Loading";
import UserProfile from "./pages/UserProfile";
import Welcome from "./pages/Welcome";
import { AuthProvider } from "./component/AuthContext";
import { useAuth } from "./component/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/Welcome" />;
}
function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Loading />
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
              <Home />
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

/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./component/AuthContext.jsx";
import App from "./App.jsx";
import "react-tooltip/dist/react-tooltip.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

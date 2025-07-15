/** @format */

import { OverlayView } from "@react-google-maps/api";
const Overlay = ({ title, lat, lng }) => {
  return (
    <OverlayView
      position={{
        lat,
        lng,
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{
          cursor: "pointer",
          backgroundColor: "#1c2e46",
          border: "1px solid white",
          paddingRight: "40px",
          paddingLeft: "8px",
          paddingTop: "8px",
          paddingBottom: "8px",
          color: "white",
          borderRadius: "10px",
          fontSize: "12px",
          transform: "translate(10px -10px)",
          space: "nowrap",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        {title}
      </div>
    </OverlayView>
  );
};

export default Overlay;

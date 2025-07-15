/** @format */

import { OverlayView } from "@react-google-maps/api";
const Overlay = ({ title, lat, lng, mode }) => {
  let backgroundColor;
  let color;
  let paddingRight;
  let paddingLeft;
  if (mode === "spot") {
    backgroundColor = "white";
    color = "black";
    paddingRight = "20px";
    paddingLeft = "10px";
  } else {
    backgroundColor = "#1c2e46";
    color = "white";
    paddingRight = "40px";
    paddingLeft = "8px";
  }
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
          backgroundColor: backgroundColor,
          border: "1px solid white",
          paddingRight: paddingRight,
          paddingLeft: paddingLeft,
          paddingTop: "8px",
          paddingBottom: "8px",
          color: color,
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

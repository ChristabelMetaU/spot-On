/** @format */
import "../styles/MapLegend.css";
const MapLegend = () => {
  return (
    <div className="map-legend-container">
      <h4 className="legend-title">Availability Legend</h4>
      <div className="legend-row">
        <span className="legend-color high"></span>
        <span className="legend-label">High Availability</span>
      </div>
      <div className="legend-row">
        <span className="legend-color medium"></span>
        <span className="legend-label">Moderate Availability</span>
      </div>
      <div className="legend-row">
        <span className="legend-color low"></span>
        <span className="legend-label">Low or No Availability</span>
      </div>
      <div className="legend-row">
        <span className="legend-color unreported"></span>
        <span className="legend-label">No Reports Yet</span>
      </div>
    </div>
  );
};

export default MapLegend;

/** @format */

import { useEffect, useState } from "react";
import "../styles/legend.css";

const Legend = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 15000); //15 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="map-legend">
      <div>
        <span className="dot green" /> Available
      </div>
      <div>
        <span className="dot red" /> Occupied
      </div>
      <div>
        <span className="dot pink" /> Reserved
      </div>
      <div>
        <span className="dot yellow" />
        updating
      </div>
    </div>
  );
};

export default Legend;

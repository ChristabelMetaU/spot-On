/** @format */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { set } from "date-fns";

const Predictions = ({
  setIsRoutingToHome,
  spots,
  selectedSpot,
  setSelectedSpot,
}) => {
  const navigate = useNavigate();
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSpotID, setSelectedSpotID] = useState(1);

  const fetchForecast = async (selectedSpotID) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/predictions/${selectedSpotID}`
      );
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setForecastData(
        data.map((entry) => ({
          time: new Date(entry.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          availability: parseFloat(
            (entry.predictedAvailability * 100).toFixed(1)
          ),
        }))
      );
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (selectedSpot.id == null || selectedSpot.length === 0) {
      const randomNum = Math.random();
      const randomIndex = Math.floor(randomNum * spots.length);
      const randomSpot = spots[randomIndex];
      setSelectedSpot(randomSpot);
      setSelectedSpotID(randomSpot.id);
      fetchForecast(randomSpot.id);
    } else {
      const selectedSpotID = selectedSpot.id;
      setSelectedSpotID(selectedSpotID);
      fetchForecast(selectedSpotID);
    }
  }, []);
  return (
    <div>
      <div className="route-header">
        <div className="header-icon">
          <i
            className="fa fa-arrow-left fa-2x go-back"
            aria-hidden="true"
            onClick={() => {
              setIsRoutingToHome(true);
              navigate("/");
            }}
          ></i>
        </div>
        <h2>SpotOn</h2>
        <div className="header-text">
          <p>Availabiloty Predictions for You</p>
          <p>Your spot, yur way</p>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Availability Forecast</h2>

        <div className="mb-4">
          <label className="mr-2">Spot ID:</label>
          <input
            type="number"
            value={selectedSpotID}
            onChange={(e) => setSelectedSpotID(Number(e.target.value))}
            className="border p-1 rounded"
          />
          <button
            onClick={() => fetchForecast(selectedSpotID)}
            className="ml-3 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading forecast...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
              <Tooltip formatter={(val) => `${val}%`} />
              <Line
                type="monotone"
                dataKey="availability"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Predictions;

/** @format */

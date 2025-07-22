/** @format */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchForSpot from "./SearchForSpot";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Predictions = ({
  setIsRoutingToHome,
  spots,
  selectedSpot,
  setSelectedSpot,
  mode,
  searchKeyword,
  setSearchKeyword,
  showResults,
  setShowResults,
  searchResults,
  setSearchResults,
}) => {
  const navigate = useNavigate();
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSpotID, setSelectedSpotID] = useState(1);

  const fetchForecast = async () => {
    if (searchKeyword.length == 0) {
      console.log("No spot selected");
      return;
    }
    setLoading(true);
    console.log("Fetching forecast for spot: ", selectedSpot.lotName);
    try {
      const lotName = selectedSpot.lotName;
      const res = await fetch(`http://localhost:3000/predictions/${lotName}`);
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
    if (selectedSpot.length != 0) {
      setSelectedSpotID(selectedSpot.id);
      fetchForecast();
    }
  }, [searchKeyword, selectedSpot]);
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
          <SearchForSpot
            mode="prediction"
            spots={spots}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            showResults={showResults}
            setShowResults={setShowResults}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setSelectedSpot={setSelectedSpot}
          />
          <button
            onClick={() => fetchForecast()}
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

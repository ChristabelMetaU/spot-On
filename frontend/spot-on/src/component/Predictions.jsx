/** @format */
import { useEffect, useState } from "react";
import PredictionToggle from "./PredictionToggle";
import BestAvailabilityCard from "./BestAvailabilityCard";
import LotPredictionCard from "./LotPredictionCard";
import MapLegend from "./MapLegend";
import { clusterSpots } from "../utils/clusterSpots";
import { useNavigate } from "react-router-dom";

const Predictions = ({ setIsRoutingToHome, spots }) => {
  const [selectedTime, setSelectedTime] = useState("now");
  const [lots, setLots] = useState([]);
  const [bestLot, setBestLot] = useState(null);
  const [otherLots, setOtherLots] = useState([]);
  const navigate = useNavigate();

  const fetchPredictions = async () => {
    try {
      const res = await fetch("http://localhost:3000/predictions");
      const data = await res.json();
      setLots(data);

      const currentPredictions = data.map((lot) => ({
        ...lot,
        current: lot.predictions[selectedTime],
      }));
      const sortedLots = [...currentPredictions].sort(
        (a, b) => b.current.availability - a.current.availability
      );

      setBestLot(sortedLots[0]);
      setOtherLots(sortedLots.slice(1));
    } catch (err) {
      throw new Error(err);
    }
  };
  useEffect(() => {
    try {
      const clusteredLots = clusterSpots(spots);
      const sendClusteredLots = async () => {
        const response = await fetch(
          "http://localhost:3000/predictions/clusters",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clusteredLots),
          }
        );
        const data = await response.json();
        if (data.success) {
          fetchPredictions();
        } else {
          throw new Error(data.error);
        }
      };
      sendClusteredLots();
    } catch (err) {
      throw new Error(err);
    }
  }, []);
  useEffect(() => {
    fetchPredictions();
  }, [selectedTime]);
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
        <div className="header-text">
          <p>Availabiloty Predictions for You</p>
          <p>Your spot, yur way</p>
        </div>
      </div>
      <div className="prediction-dashboard">
        <h2 className="page-title">Prediction Dashboard</h2>

        <PredictionToggle onSelect={setSelectedTime} />
        {bestLot && (
          <BestAvailabilityCard
            lotName={bestLot.name}
            availability={bestLot.current.availability}
            waitTime={bestLot.current.waitTime}
            peakTime={bestLot.current.peak}
          />
        )}

        <div className="cards-section">
          {otherLots.map((lot) => (
            <div key={lot.name}>
              <LotPredictionCard
                lotName={lot.name}
                availabilityLevel="Medium"
                availability={lot.current.availability}
                peakTime={lot.current.peak}
                totalSpots={lot.current.totalSpots}
                currentSpots={lot.current.freeCount}
                projectedFree={lot.predictions[selectedTime].freeCount}
                walkTime={lot.walkTime}
                lastReport={lot.lastReported}
              />
            </div>
          ))}
        </div>

        <MapLegend />
      </div>
    </div>
  );
};

export default Predictions;

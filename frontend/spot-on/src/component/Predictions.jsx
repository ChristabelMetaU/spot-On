/** @format */
import { useEffect, useState } from "react";
import PredictionToggle from "./PredictionToggle";
import BestAvailabilityCard from "./BestAvailabilityCard";
import LotPredictionCard from "./LotPredictionCard";
import MapLegend from "./MapLegend";
const dummyLots = [
  {
    id: "lot1",
    name: "Lot A",
    predictions: {
      now: {
        availability: 85,
        waitTime: "2 mins",
        peak: "4:30 PM",
        freeCount: 17,
        totalSpots: 20,
      },
      15: {
        availability: 78,
        waitTime: "3 mins",
        peak: "4:45 PM",
        freeCount: 15,
        totalSpots: 20,
      },
      30: {
        availability: 60,
        waitTime: "5 mins",
        peak: "5:00 PM",
        freeCount: 12,
        totalSpots: 20,
      },
      50: {
        availability: 35,
        waitTime: "7 mins",
        peak: "5:30 PM",
        freeCount: 7,
        totalSpots: 20,
      },
    },
    lastReported: "2 mins ago",
    walkTime: "3 mins",
  },
  {
    id: "lot2",
    name: "Lot B",
    predictions: {
      now: {
        availability: 20,
        waitTime: "7 mins",
        peak: "5:15 PM",
        freeCount: 4,
        totalSpots: 20,
      },
      15: {
        availability: 25,
        waitTime: "6 mins",
        peak: "5:30 PM",
        freeCount: 5,
        totalSpots: 20,
      },
      30: {
        availability: 40,
        waitTime: "5 mins",
        peak: "5:45 PM",
        freeCount: 8,
        totalSpots: 20,
      },
      50: {
        availability: 60,
        waitTime: "4 mins",
        peak: "6:00 PM",
        freeCount: 12,
        totalSpots: 20,
      },
    },
    lastReported: "5 mins ago",
    walkTime: "5 mins",
  },
  {
    id: "lot3",
    name: "Lot C",
    predictions: {
      now: {
        availability: 55,
        waitTime: "4 mins",
        peak: "4:45 PM",
        freeCount: 11,
        totalSpots: 20,
      },
      15: {
        availability: 45,
        waitTime: "5 mins",
        peak: "5:00 PM",
        freeCount: 9,
        totalSpots: 20,
      },
      30: {
        availability: 30,
        waitTime: "6 mins",
        peak: "5:15 PM",
        freeCount: 6,
        totalSpots: 20,
      },
      50: {
        availability: 20,
        waitTime: "7 mins",
        peak: "5:30 PM",
        freeCount: 4,
        totalSpots: 20,
      },
    },
    lastReported: "1 min ago",
    walkTime: "2 mins",
  },
];
const Predictions = ({ setIsRoutingToHome, selectedSpot, searchKeyword }) => {
  const [selectedTime, setSelectedTime] = useState("now");
  const [lots, setLots] = useState([]);
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
    // In real app, this is where we fetch prediction results based on time window
    setLots(dummyLots); // Simulating load
  }, []);

  const currentPredictions = dummyLots.map((lot) => ({
    ...lot,
    current: lot.predictions[selectedTime],
  }));

  const sortedLots = [...currentPredictions].sort(
    (a, b) => b.current.availability - a.current.availability
  );
  const bestLot = sortedLots[0];
  const otherLots = sortedLots.slice(1);
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
      <div className="prediction-dashboard">
        <h2 className="page-title">Prediction Dashboard</h2>

        <PredictionToggle onSelect={setSelectedTime} />

        <BestAvailabilityCard
          lotName={bestLot.name}
          availability={bestLot.current.availability}
          waitTime={bestLot.current.waitTime}
          peakTime={bestLot.current.peak}
        />

        <div className="cards-section">
          {otherLots.map((lot) => (
            <LotPredictionCard
              key={lot.id}
              lotName={lot.name}
              availability={lot.current.availability}
              waitTime={lot.current.waitTime}
              peakTime={lot.current.peak}
              totalSpots={lot.current.totalSpots}
              freeSpots={lot.current.freeCount}
              walkTime={lot.walkTime}
              lastReported={lot.lastReported}
            />
          ))}
        </div>

        <MapLegend />
      </div>
    </div>
  );
};

export default Predictions;

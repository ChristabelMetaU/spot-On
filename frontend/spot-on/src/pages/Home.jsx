/** @format */

import { useAuth } from "../component/AuthContext";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Body from "../component/Body";
import Footer from "../component/Footer";
import Report from "../component/Report";
import { useState, useEffect } from "react";
import Message from "../component/Message";
import SpotModal from "../component/SpotModal";
import "../styles/Home.css";
const Home = () => {
  const [spots, setSpots] = useState([]);
  const [active, setActive] = useState([]);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const [selectedSpot, setSelectedSpot] = useState([]);
  const [showmodal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    red: true,
    green: true,
    white: true,
    handicap: true,
    free: true,
    occupied: true,
  });
  useEffect(() => {
    const fetchSpots = async () => {
      const response = await fetch("http://localhost:3000/map/spots");
      const data = await response.json();
      if (!data) {
        setSpots([]);
      } else {
        setSpots(data);
      }
    };
    fetchSpots();
  }, [user, selectedSpot]);
  const updateIsOccupied = async (updatedIsOccupied) => {
    const response = await fetch(
      `http://localhost:3000/map/spots/${selectedSpot.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isOccupied: updatedIsOccupied }),
      }
    );
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    setShowModal(false);
    setSelectedSpot(data);
    if (!data.isOccupied) {
      setMessage(`${selectedSpot.lotName} is now marked as free.`);
    } else {
      setMessage(`${selectedSpot.lotName} is now marked as occupied.`);
    }
    setIsVisible(true);
  };
  const handleReportSubmit = async (formData, occupied) => {
    const response = await fetch("http://localhost:3000/report/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setIsVisible(true);
    if (!data) {
      setMessage("Something went wrong");
    }
    setMessage(data.message);
    updateIsOccupied(occupied);
  };
  return (
    <div className="Home">
      <Header />
      <Nav
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <main className="site-main">
        <Body
          spots={spots}
          setSpots={setSpots}
          setSelectedSpot={setSelectedSpot}
          setShowModal={setShowModal}
          setActive={setActive}
          activeFilters={activeFilters}
        />

        <Report
          spots={spots}
          handleReportSubmit={handleReportSubmit}
          user={user}
        />
      </main>
      {showmodal && (
        <SpotModal
          setShowModal={setShowModal}
          spot={selectedSpot}
          spotIndex={active.idx}
          handleReportSubmit={handleReportSubmit}
          id={user.id}
        />
      )}
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
      <Footer />
    </div>
  );
};

export default Home;

/** @format */

import { useAuth } from "../component/AuthContext";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Body from "../component/Body";
import Footer from "../component/Footer";
import Report from "../component/Report";
import { useState, useEffect } from "react";
import SpotModal from "../component/SpotModal";
import "../styles/Home.css";
const Home = () => {
  const [spots, setSpots] = useState([]);
  const { user } = useAuth();
  const [selectedSpot, setSelectedSpot] = useState([{}]);
  const [showmodal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchSpots = async () => {
      const response = await fetch("http://localhost:3000/map/spots");
      const data = await response.json();
      if (!data) {
        setSpots([{}]);
      } else {
        setSpots(data);
      }
    };
    fetchSpots();
  }, [user]);
  return (
    <div>
      <Header />
      <Nav />
      <Body
        spots={spots}
        setSpots={setSpots}
        setSelectedSpot={setSelectedSpot}
        setShowModal={setShowModal}
      />
      {showmodal && (
        <SpotModal setShowModal={setShowModal} spot={selectedSpot} />
      )}
      <Report />
      <Footer />
    </div>
  );
};

export default Home;

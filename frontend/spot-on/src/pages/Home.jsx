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
  }, [user]);
  return (
    <div className="Home">
      <Header />
      <Nav />
      <main className="site-main">
        <Body
          spots={spots}
          setSpots={setSpots}
          setSelectedSpot={setSelectedSpot}
          setShowModal={setShowModal}
          setActive={setActive}
        />

        <Report />
      </main>
      {showmodal && (
        <SpotModal
          setShowModal={setShowModal}
          spot={selectedSpot}
          spotIndex={active.idx}
          setSelectedSpot={setSelectedSpot}
          setMessage={setMessage}
          setIsVisible={setIsVisible}
        />
      )}
      {isVisible && <Message message={message} setIsVisible={setIsVisible} />}
      <Footer />
    </div>
  );
};

export default Home;

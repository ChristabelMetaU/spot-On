import { useAuth } from "../component/AuthContext";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Body from "../component/Body";
import Footer from "../component/Footer";
import Report from "../component/Report";
import { useState, useEffect } from "react";
import "../styles/Home.css"
const Home = () => {
  const [spots, setSpots] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchSpots = async () => {
      const response = await fetch("http://localhost:3000/map/spots");
      const data = await response.json();
      if (!data) setSpots(["No spots found"]);
      else setSpots(data);
    }
    fetchSpots();
  }, [user]);
  return (
    <div>
      <Header />
      <Nav />
      <Body spots={spots} />
      <Report />
      <Footer />
    </div>
  )
}

export default Home;

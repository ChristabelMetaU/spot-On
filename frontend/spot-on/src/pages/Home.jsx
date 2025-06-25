import { useAuth } from "../component/AuthContext";
const Home = () => {
    const {user, logout} = useAuth();
  return <div>welcome, {user?.username}</div>;
}

export default Home;

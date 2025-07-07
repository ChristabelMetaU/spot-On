/** @format */

import { useAuth } from "./AuthContext";
import Icon from "../assets/Icon.png";
const Header = () => {
  const { user } = useAuth();
  return (
    <header className="site-header">
      <h1> Welcome {user?.username}</h1>
      <img src={Icon} alt="logo" />
    </header>
  );
};

export default Header;

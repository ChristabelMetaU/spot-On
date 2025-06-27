/** @format */

import { useAuth } from "./AuthContext";
const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="site-header">
      <h1> Welcome {user?.username}</h1>
      <h1>Spot On</h1>
    </header>
  );
};

export default Header;

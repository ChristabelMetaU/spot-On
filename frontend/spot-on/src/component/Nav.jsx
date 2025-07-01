/** @format */

import { Link } from "react-router-dom";
import FilterLoading from "./FilterLoading";
import { useAuth } from "./AuthContext";
import FilterToggles from "./FilterToggles";
const Nav = ({
  showFilters,
  setShowFilters,
  activeFilters,
  setActiveFilters,
}) => {
  const { loading } = useAuth();
  return (
    <nav className="site-nav">
      <Link to="/">
        <button
          className={!showFilters ? "default" : "btn-nav"}
          onClick={() => {
            setShowFilters(false);
          }}
        >
          Map
        </button>
      </Link>
      <button
        className={showFilters ? "default" : "btn-nav"}
        onClick={() => {
          setShowFilters((f) => !f);
        }}
      >
        Filters
      </button>
      <Link to="/Profile">
        <button className="btn-nav">Profile</button>
      </Link>

      {showFilters &&
        (loading ? (
          <FilterLoading />
        ) : (
          <div className="nav-filters-container">
            <FilterToggles
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </div>
        ))}
    </nav>
  );
};

export default Nav;

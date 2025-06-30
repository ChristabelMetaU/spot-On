/** @format */

import { Link } from "react-router-dom";
import FilterToggles from "./FilterToggles";
const Nav = ({
  showFilters,
  setShowFilters,
  activeFilters,
  setActiveFilters,
}) => {
  // const [showFilters, setShowFilters] = useState(false);
  return (
    <nav className="site-nav">
      <Link to="/">
        <button className={!showFilters ? "default" : "btn-nav"}>Map</button>
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
      {showFilters && (
        <div className="nav-filters-container">
          <FilterToggles
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        </div>
      )}
    </nav>
  );
};

export default Nav;

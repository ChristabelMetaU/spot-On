/** @format */

import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import FilterToggles from "./FilterToggles";
import TooltipWrapper from "./ToolTipWrapper";
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
        <TooltipWrapper text="Current page">
          <button
            className={!showFilters ? "default" : "btn-nav"}
            onClick={() => {
              setShowFilters(false);
            }}
          >
            Map
          </button>
        </TooltipWrapper>
      </Link>
      <TooltipWrapper text="Filter out spots">
        <button
          className={showFilters ? "default" : "btn-nav"}
          onClick={() => {
            setShowFilters((f) => !f);
          }}
        >
          Filters
        </button>
      </TooltipWrapper>
      <TooltipWrapper text="View your Profile">
        <Link to="/Profile">
          <button className="btn-nav">Profile</button>
        </Link>
      </TooltipWrapper>

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

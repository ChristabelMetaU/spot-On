/** @format */

const SearchForSpot = ({
  mode,
  spots,
  searchKeyword,
  setSearchKeyword,
  showResults,
  setShowResults,
  searchResults,
  setSearchResults,
  setSelectedSpot,
}) => {
  const fetchLots = (value) => {
    const searchedSpots = spots.filter((spot) => {
      return spot.lotName.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(searchedSpots);
    setShowResults(value.length > 0);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    fetchLots(value);
  };
  const handleInputFocus = (e) => {
    setShowResults(searchKeyword.length > 0);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 100);
  };

  const handleResultClick = (result) => {
    setSelectedSpot(result);
    setSearchKeyword(result.lotName);
    setShowResults(false);
    setSearchResults([]);
  };
  return (
    <div className="search-wrapper">
      <div className={"search-container"}>
        <input
          type="text"
          name="spot"
          placeholder={
            mode === "Home"
              ? "Search for your favorite spot"
              : "Search for a spot to update"
          }
          value={searchKeyword}
          onChange={handleSearch}
          onBlur={handleBlur}
          onFocus={handleInputFocus}
          className={"spot-search-input"}
        />
        {showResults && (
          <ul className="search-list">
            {searchResults.map((result) => {
              return (
                <li key={result.id} onClick={() => handleResultClick(result)}>
                  {result.lotName}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchForSpot;

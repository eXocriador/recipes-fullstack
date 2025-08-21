import Container from "../container/container";
import css from "./SearchBox.module.css";
import { useState } from "react";
const SearchBox = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  setIsSearched,
}) => {
  const [error, setError] = useState(false);

  const isValidQuery = (text) =>
    /^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s]+$/.test(text.trim());

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() !== "" && !isValidQuery(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    if (!searchQuery.trim() || !isValidQuery(searchQuery)) {
      setError(true);
      return;
    }

    setError(false);
    setFilter({ ...filter, title: searchQuery.trim(), page: 1 });
    setIsSearched(true);
  };

  const isButtonDisabled =
    error || !searchQuery.trim() || !isValidQuery(searchQuery);

  return (
    <section className={css.section}>
      <Container>
        <div className={css.searchDiv}>
          <h1 className={css.title}>Plan, Cook, and Share Your Flavors</h1>
          <div className={css.inputDiv}>
            <input
              type="text"
              value={searchQuery}
              className={`${css.input} ${error ? css.inputError : ""}`}
              placeholder="Search recipes"
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />

            {error && <p className={css.error}>Invalid characters!</p>}
            <button
              className={css.btnSearch}
              onClick={handleSearchClick}
              disabled={isButtonDisabled}
            >
              Search
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SearchBox;

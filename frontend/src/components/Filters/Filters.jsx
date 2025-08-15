import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import css from "./Filters.module.css";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import Svg from "../Svg/svg";
import { selectCategories } from "../../redux/categories/selectors";
import { selectIngredients } from "../../redux/ingredients/selectors";
import { fetchByFilters } from "../../redux/recipes/operations.js";

const Filters = ({ filter, setFilter, total, isSearched, setSearchQuery }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [size, setSize] = useState(window.innerWidth);
  const sizeDesktop = 1439;

  useEffect(() => {
    const resizeHandler = () => setSize(window.innerWidth);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const tag = target.tagName?.toLowerCase();
      if (["select", "option", "svg", "path"].includes(tag)) return;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (value) => {
    setFilter({ ...filter, category: value.name, page: 1 });
  };

  const handleIngredientChange = (value) => {
    setFilter({ ...filter, ingredient: value._id, page: 1 });
  };

  useEffect(() => {
    dispatch(fetchByFilters(filter));
  }, [filter]);

  const handleReset = () => {
    setFilter((prev) => ({
      ...prev,
      category: "",
      ingredient: "",
      title: "",
      page: 1,
    }));
    if (typeof setSearchQuery === "function") setSearchQuery("");
    setOpen(false);
  };

  return (
    <section>
      <div className={css.container}>
        {isMainPage && (
          <h2 className={css.title}>
            {isSearched && filter.title.trim()
              ? `Search Results for “${filter.title.trim()}”`
              : "Recepies"}
          </h2>
        )}
        <div className={css.divFilters}>
          <p className={css.count}>{total || 0} recipes</p>
          {isMainPage &&
            (size > sizeDesktop ? (
              <div className={css.dropdown}>
                <button
                  onClick={handleReset}
                  className={css.btnReset}
                  disabled={
                    !filter.category && !filter.ingredient && !filter.title
                  }
                >
                  Reset filters
                </button>
                <div className={css.divSelect}>
                  <CustomSelect
                    label="Category"
                    options={categories}
                    selected={filter.category}
                    onChange={handleCategoryChange}
                  />
                  <CustomSelect
                    label="Ingredient"
                    options={ingredients}
                    selected={
                      ingredients.find((item) => item._id === filter.ingredient)
                        ?.name || ""
                    }
                    onChange={handleIngredientChange}
                  />
                </div>
              </div>
            ) : (
              <div className={css.divDropdown} ref={containerRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className={`${css.btnDropdown} ${open ? css.btnNone : ""}`}
                >
                  Filters
                  <Svg
                    styles={`${css.svg} ${open ? css.svgNone : ""}`}
                    name={"filter"}
                  />
                </button>

                {open && (
                  <div className={css.dropdown}>
                    <button
                      onClick={handleReset}
                      className={css.btnReset}
                      disabled={
                        !filter.category && !filter.ingredient && !filter.title
                      }
                    >
                      Reset filters
                    </button>
                    <div className={css.divSelect}>
                      <CustomSelect
                        label="Category"
                        options={categories}
                        selected={filter.category}
                        onChange={handleCategoryChange}
                      />
                      <CustomSelect
                        label="Ingredient"
                        options={ingredients}
                        selected={
                          ingredients.find(
                            (item) => item._id === filter.ingredient
                          )?.name || ""
                        }
                        onChange={handleIngredientChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Filters;

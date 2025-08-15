import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import css from "./GeneralInfoRecipe.module.css";
import Svg from "../Svg/svg";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { selectFavoriteRecipes } from "../../redux/recipes/selectors";
import {
  deleteFavouriteRecipe,
  addFavouriteRecipe,
  fetchFavouriteRecipes,
} from "../../redux/recipes/operations";

export default function GeneralInfoRecipe({ category, time, calories, id }) {
  const [loading, setLoading] = useState(false);
  const [optimisticFav, setOptimisticFav] = useState(null); // null = sync with redux, true/false = override
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const favoriteRecipes = useSelector(selectFavoriteRecipes);

  // Fetch favorites on mount if logged in
  useEffect(() => {
    if (isLoggedIn && favoriteRecipes.length === 0) {
      dispatch(fetchFavouriteRecipes({ page: 1 }));
    }
  }, [dispatch, isLoggedIn]);

  // Determine if this recipe is in favorites
  const isFavRedux = favoriteRecipes.some((item) => item._id === id);
  const isFav = optimisticFav === null ? isFavRedux : optimisticFav;

  // Sync optimisticFav with redux when redux changes
  useEffect(() => {
    setOptimisticFav(null);
  }, [isFavRedux]);

  const handleToggle = async (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      toast("Please login to save recipes");
      navigate("/auth/login");
      return;
    }
    setLoading(true);
    try {
      if (isFav) {
        setOptimisticFav(false);
        await dispatch(deleteFavouriteRecipe(id)).unwrap();
        toast.success("Recipe removed from favorites");
      } else {
        setOptimisticFav(true);
        await dispatch(addFavouriteRecipe(id)).unwrap();
        toast.success("Recipe added to favorites");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      setOptimisticFav(null); // сбросить optimisticFav при ошибке
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.generalBox}>
      <div className={css.generalInfo}>
        <h3 className={css.recipeTitle}>General informations</h3>
        <p className={css.infoText}>
          Category:
          <span className={css.text}>{category}</span>
        </p>
        <p className={css.infoText}>
          Cooking time:
          <span className={css.text}>{time} minutes</span>
        </p>
        <p className={css.infoText}>
          Caloric content:
          <span className={css.text}>
            Approximately {calories || "-"} kcal per serving
          </span>
        </p>
      </div>
      <button
        className={css.saveBtn}
        onClick={handleToggle}
        type="button"
        disabled={loading}
      >
        {loading ? "Loading..." : isFav ? "Remove" : "Save"}
        <Svg styles={css.icon} name="bookmark" />
      </button>
    </div>
  );
}

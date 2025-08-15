import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import RecipeDetails from "../components/RecipeDetails/RecipeDetails";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Loader from "../components/Loader/Loader";

import { fetchById } from "../redux/recipes/operations";
import {
  selectCurrentRecipe,
  selectCurrentRecipeLoading,
  selectRecipesError,
} from "../redux/recipes/selectors";

export default function RecipeViewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const recipe = useSelector(selectCurrentRecipe);
  const isLoading = useSelector(selectCurrentRecipeLoading);
  const error = useSelector(selectRecipesError);

  useEffect(() => {
    if (id) dispatch(fetchById(id));
  }, [dispatch, id]);

  return isLoading ? (
    <Loader />
  ) : error || !recipe ? (
    <NotFoundPage />
  ) : (
    <RecipeDetails recipe={recipe} />
  );
}

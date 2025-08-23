import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import RecipeDetails from '../components/recipes/RecipeDetails/RecipeDetails';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import Loader from '../components/common/Loader/Loader';

import { fetchById } from '../redux/recipes/operations';
import {
  selectCurrentRecipe,
  selectCurrentRecipeLoading,
  selectRecipesError,
} from '../redux/recipes/selectors';

export default function RecipeViewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const recipe = useSelector(selectCurrentRecipe);
  const isLoading = useSelector(selectCurrentRecipeLoading);
  const error = useSelector(selectRecipesError);

  useEffect(() => {
    if (id) dispatch(fetchById(id));
  }, [dispatch, id]);

  // Condition 1: Show Loader
  // Show the loader if the request is in progress, OR if it hasn't even started yet
  // (i.e., we have no recipe and no error yet). This covers the initial render frame.
  if (isLoading || (!recipe && !error)) {
    return <Loader />;
  }

  // Condition 2: Show Not Found Page
  // Only show the 404 page if loading is complete AND there was an error,
  // OR if loading is complete and for some reason the recipe is still null.
  if (error || (!isLoading && !recipe)) {
    return <NotFoundPage />;
  }

  // Condition 3: Show Recipe Content
  // If neither of the above conditions are met, it's safe to render the recipe.
  return <RecipeDetails recipe={recipe} />;
}

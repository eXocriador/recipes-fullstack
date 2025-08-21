import RecipesList from "../RecipesList/RecipesList";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import Filters from "../Filters/Filters";
import css from "./ListWrapper.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavouriteRecipes,
  fetchOwnRecipes,
  fetchByFilters,
} from "../../redux/recipes/operations";
import { useLocation, useParams } from "react-router-dom";
import {
  selectRecipesError,
  selectRecipesLoading,
  selectFavoriteRecipes,
  selectOwnRecipes,
  selectFavoriteRecipesHasNextPage,
  selectOwnRecipesHasNextPage,
  selectOwnRecipesPage,
  selectFavoriteRecipesPage,
  selectOwnRecipesTotal,
  selectFavoriteRecipesTotal,
  selectFilteredRecipes,
  selectFilteredRecipesHasNextPage,
  selectFilteredRecipesPage,
  selectFilteredRecipesTotal,
} from "../../redux/recipes/selectors";
import Loader from "../Loader/Loader";
import { selectUserData } from "../../redux/auth/selectors";
import { getUserInfo } from "../../redux/auth/operations";
import { toast } from "react-hot-toast";

export default function ListWrapper({
  filter,
  setFilter,
  isSearched,
  isModalOpen,
  setSearchQuery,
}) {
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const data = useSelector(selectUserData);
  const favourites = data.favorites;
  const location = useLocation();
  const { recipeType } = useParams();
  const isMainPage = location.pathname === "/";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const items = useSelector(
    isMainPage
      ? selectFilteredRecipes
      : recipeType === "own"
      ? selectOwnRecipes
      : selectFavoriteRecipes
  );

  const total = useSelector(
    isMainPage
      ? selectFilteredRecipesTotal
      : recipeType === "own"
      ? selectOwnRecipesTotal
      : selectFavoriteRecipesTotal
  );

  const page = useSelector(
    isMainPage
      ? selectFilteredRecipesPage
      : recipeType === "own"
      ? selectOwnRecipesPage
      : selectFavoriteRecipesPage
  );

  const hasNextPage = useSelector(
    isMainPage
      ? selectFilteredRecipesHasNextPage
      : recipeType === "own"
      ? selectOwnRecipesHasNextPage
      : selectFavoriteRecipesHasNextPage
  );

  const isLoading = useSelector(selectRecipesLoading);
  const isError = useSelector(selectRecipesError);

  const isInitialLoad = isMainPage
    ? isLoading && filter.page === 1
    : isLoading && page === 1 && items.length === 0;

  const isLoadMore = isMainPage
    ? isLoading && filter.page > 1
    : isLoadMoreLoading;

  useEffect(() => {
    const fetch = async () => {
      if (isMainPage) {
        dispatch(fetchByFilters(filter));
      } else {
        if (recipeType === "own") {
          await dispatch(fetchOwnRecipes({ page }));
        } else if (recipeType === "favourites") {
          await dispatch(fetchFavouriteRecipes({ page }));
        }
      }
    };
    fetch();
  }, [dispatch, filter, page, isMainPage, recipeType]);

  // Показываем тост, если после клика на LoadMoreBtn больше нет страниц
  useEffect(() => {
    if (
      !hasNextPage &&
      items &&
      items.length > 0 &&
      (filter.page > 1 || page > 1)
    ) {
      toast("No more recipes");
    }
  }, [hasNextPage]);

  const handleLoadMore = async () => {
    if (isMainPage) {
      setFilter({ ...filter, page: filter.page + 1 });
    } else {
      const nextPage = page + 1;
      setIsLoadMoreLoading(true);

      if (recipeType === "own") {
        await dispatch(fetchOwnRecipes({ page: nextPage }));
      } else if (recipeType === "favourites") {
        await dispatch(fetchFavouriteRecipes({ page: nextPage }));
      }

      setIsLoadMoreLoading(false);
    }
  };

  return (
    <>
      {isError && <b>Whoops, there was an error. Please reload...</b>}

      <Filters
        filter={filter}
        setFilter={setFilter}
        total={total}
        isSearched={isSearched}
        setSearchQuery={setSearchQuery}
      />

      {isInitialLoad ? (
        <div style={{ paddingTop: "200px", paddingBottom: "200px" }}>
          <Loader />
        </div>
      ) : items && items.length > 0 ? (
        <>
          <RecipesList
            favourites={favourites}
            isModalOpen={isModalOpen}
            items={items}
          />

          {hasNextPage && (
            <>
              {isLoadMore && (
                <div style={{ marginBottom: "40px" }}>
                  <Loader />
                </div>
              )}
              {!isLoadMore && <LoadMoreBtn onClick={handleLoadMore} />}
            </>
          )}
        </>
      ) : (
        <p className={css.notFound}>Any recipes were found.</p>
      )}
    </>
  );
}

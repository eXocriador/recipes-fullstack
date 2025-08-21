export const selectRecipes = (state) => state.recipes.items;

export const selectRecipesLoading = (state) => state.recipes.loading;

export const selectCurrentRecipeLoading = (state) =>
  state.recipes.currentRecipeLoading;
export const selectFavoriteLoading = (state) => state.recipes.favoriteLoading;

export const selectRecipesError = (state) => state.recipes.error;

export const selectOwnRecipes = (state) => state.recipes.items.ownItems.items;

export const selectAllRecipes = (state) => state.recipes.items.allItems.items;

export const selectFavoriteRecipes = (state) =>
  state.recipes.items.favoriteItems.items;

export const selectOwnRecipesPage = (state) =>
  state.recipes.items.ownItems.page;
export const selectAllRecipesPage = (state) =>
  state.recipes.items.allItems.page;
export const selectFavoriteRecipesPage = (state) =>
  state.recipes.items.favoriteItems.page;

export const selectOwnRecipesHasNextPage = (state) =>
  state.recipes.items.ownItems.hasNextPage;
export const selectOwnRecipesHasPreviousPage = (state) =>
  state.recipes.items.ownItems.hasPreviousPage;
export const selectAllRecipesHasNextPage = (state) =>
  state.recipes.items.allItems.hasNextPage;
export const selectAllRecipesHasPreviousPage = (state) =>
  state.recipes.items.allItems.hasPreviousPage;
export const selectFavoriteRecipesHasNextPage = (state) =>
  state.recipes.items.favoriteItems.hasNextPage;
export const selectFavoriteRecipesHasPreviousPage = (state) =>
  state.recipes.items.favoriteItems.hasPreviousPage;

export const selectOwnRecipesTotal = (state) =>
  state.recipes.items.ownItems.totalItems;
export const selectFavoriteRecipesTotal = (state) =>
  state.recipes.items.favoriteItems.totalItems;

export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;

export const selectOwnRecipesObject = (state) => state.recipes.items.ownItems;

export const selectAllRecipesObject = (state) => state.recipes.items.allItems;

// Селекторы для filteredItems
export const selectFilteredRecipes = (state) =>
  state.recipes.items.filteredItems.items;
export const selectFilteredRecipesPage = (state) =>
  state.recipes.items.filteredItems.page;
export const selectFilteredRecipesHasNextPage = (state) =>
  state.recipes.items.filteredItems.hasNextPage;
export const selectFilteredRecipesHasPreviousPage = (state) =>
  state.recipes.items.filteredItems.hasPreviousPage;
export const selectFilteredRecipesTotal = (state) =>
  state.recipes.items.filteredItems.totalItems;
export const selectLastFilters = (state) =>
  state.recipes.items.filteredItems.lastFilters;

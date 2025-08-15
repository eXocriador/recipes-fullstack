import { createSlice } from "@reduxjs/toolkit";

import { logOut } from "../auth/operations";
import {
  addRecipe,
  fetchById,
  fetchByPages,
  fetchByFilters,
  fetchFavouriteRecipes,
  deleteFavouriteRecipe,
  fetchOwnRecipes,
  addFavouriteRecipe,
} from "./operations";

const slice = createSlice({
  name: "recipes",
  initialState: {
    items: {
      ownItems: {
        page: 1,
        items: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalItems: 0,
      },
      allItems: {
        page: 1,
        items: [],
        hasNextPage: false,
        hasPreviousPage: false,
      },
      favoriteItems: {
        page: 1,
        items: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalItems: 0,
      },
      filteredItems: {
        page: 1,
        items: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalItems: 0,
        lastFilters: {
          category: "",
          ingredient: "",
          title: "",
        },
      },
    },
    currentRecipe: null,
    loading: false,
    error: null,
    currentRecipeLoading: false,
    favoriteLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchByPages.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchByPages.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем allItems
        const newItems = action.payload.data.data;
        const page = action.payload.data.page;
        const hasNextPage = action.payload.data.hasNextPage;
        const hasPreviousPage = action.payload.data.hasPreviousPage;
        const existingIds = new Set(
          state.items.allItems.items.map((item) => item._id)
        );
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item._id)
        );
        state.items.allItems.items = [
          ...state.items.allItems.items,
          ...uniqueNewItems,
        ];
        state.items.allItems.page = page;
        state.items.allItems.hasNextPage = hasNextPage;
        state.items.allItems.hasPreviousPage = hasPreviousPage;
      })
      .addCase(fetchByPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.items.allItems.items = [];
      })
      .addCase(addRecipe.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items.ownItems.items.push(action.payload);
        state.items.allItems.items.push(action.payload);
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchById.pending, (state) => {
        state.currentRecipeLoading = true;
        state.error = false;
        state.currentRecipe = null;
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.currentRecipeLoading = false;
        state.error = false;
        state.currentRecipe = action.payload.data;
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.currentRecipe = null;
        state.currentRecipeLoading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOwnRecipes.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchOwnRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        // Проверка на наличие данных
        const payload =
          action.payload && action.payload.data ? action.payload.data : {};
        const newItems = Array.isArray(payload.data) ? payload.data : [];
        const page = payload.page || 1;
        state.items.ownItems.totalItems = payload.totalItems || 0;
        const hasNextPage = payload.hasNextPage || false;
        const hasPreviousPage = payload.hasPreviousPage || false;

        if (page === 1) {
          state.items.ownItems.items = newItems;
        } else {
          const existingIds = new Set(
            state.items.ownItems.items.map((i) => i._id)
          );
          const filteredNewItems = newItems.filter(
            (i) => !existingIds.has(i._id)
          );
          state.items.ownItems.items = [
            ...state.items.ownItems.items,
            ...filteredNewItems,
          ];
        }

        state.items.ownItems.page = page;
        state.items.ownItems.hasNextPage = hasNextPage;
        state.items.ownItems.hasPreviousPage = hasPreviousPage;
      })
      .addCase(fetchOwnRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items.ownItems.items = [];
      })
      .addCase(fetchFavouriteRecipes.pending, (state) => {
        state.favoriteLoading = true;
        state.error = false;
      })
      .addCase(fetchFavouriteRecipes.fulfilled, (state, action) => {
        state.favoriteLoading = false;
        state.error = false;
        const payload =
          action.payload && action.payload.data ? action.payload.data : {};
        const newItems = Array.isArray(payload.data) ? payload.data : [];
        const page = payload.page || 1;
        state.items.favoriteItems.totalItems = payload.totalItems || 0;
        const hasNextPage = payload.hasNextPage || false;
        const hasPreviousPage = payload.hasPreviousPage || false;

        if (page === 1) {
          state.items.favoriteItems.items = newItems;
        } else {
          const existingIds = new Set(
            state.items.favoriteItems.items.map((i) => i._id)
          );
          const filteredNewItems = newItems.filter(
            (i) => !existingIds.has(i._id)
          );
          state.items.favoriteItems.items = [
            ...state.items.favoriteItems.items,
            ...filteredNewItems,
          ];
        }

        state.items.favoriteItems.page = page;
        state.items.favoriteItems.hasNextPage = hasNextPage;
        state.items.favoriteItems.hasPreviousPage = hasPreviousPage;
      })
      .addCase(fetchFavouriteRecipes.rejected, (state, action) => {
        state.favoriteLoading = false;
        state.error = action.payload.message;
        state.items.favoriteItems.items = [];
      })
      .addCase(addFavouriteRecipe.pending, (state) => {
        state.error = false;
      })
      .addCase(addFavouriteRecipe.fulfilled, (state, action) => {
        state.favoriteLoading = false;
        state.error = false;
      })
      .addCase(addFavouriteRecipe.rejected, (state, action) => {
        state.favoriteLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFavouriteRecipe.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items.favoriteItems.items =
          state.items.favoriteItems.items.filter(
            (recipe) => recipe._id !== deletedId
          );
        state.items.favoriteItems.totalItems = Math.max(
          0,
          state.items.favoriteItems.totalItems - 1
        );
      })
      .addCase(deleteFavouriteRecipe.pending, (state) => {
        state.favoriteLoading = true;
        state.error = false;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.items.ownItems = {
          page: 1,
          items: [],
          hasNextPage: false,
          hasPreviousPage: false,
        };
        state.items.allItems = {
          page: 1,
          items: [],
          hasNextPage: false,
          hasPreviousPage: false,
        };
        state.items.favoriteItems = {
          page: 1,
          items: [],
          hasNextPage: false,
          hasPreviousPage: false,
        };
        state.items.filteredItems = {
          page: 1,
          items: [],
          hasNextPage: false,
          hasPreviousPage: false,
          totalItems: 0,
          lastFilters: {
            category: "",
            ingredient: "",
            title: "",
          },
        };
      })
      .addCase(fetchByFilters.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        const payload =
          action.payload && action.payload.data ? action.payload.data : {};
        const newItems = Array.isArray(payload.data) ? payload.data : [];
        const page = payload.page || 1;
        const hasNextPage = payload.hasNextPage || false;
        const hasPreviousPage = payload.hasPreviousPage || false;
        state.items.filteredItems.totalItems = payload.totalItems || 0;

        const currentFilters = {
          category: action.meta.arg.category || "",
          ingredient: action.meta.arg.ingredient || "",
          title: action.meta.arg.title || "",
        };

        const filtersChanged =
          currentFilters.category !==
            state.items.filteredItems.lastFilters.category ||
          currentFilters.ingredient !==
            state.items.filteredItems.lastFilters.ingredient ||
          currentFilters.title !== state.items.filteredItems.lastFilters.title;

        if (page === 1 || filtersChanged) {
          state.items.filteredItems.items = newItems;
          state.items.filteredItems.lastFilters = currentFilters;
        } else {
          const existingIds = new Set(
            state.items.filteredItems.items.map((item) => item._id)
          );
          const uniqueNewItems = newItems.filter(
            (item) => !existingIds.has(item._id)
          );
          state.items.filteredItems.items = [
            ...state.items.filteredItems.items,
            ...uniqueNewItems,
          ];
        }

        state.items.filteredItems.page = page;
        state.items.filteredItems.hasNextPage = hasNextPage;
        state.items.filteredItems.hasPreviousPage = hasPreviousPage;
      })
      .addCase(fetchByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && action.payload.message) ||
          (typeof action.payload === "string" && action.payload) ||
          action.error?.message ||
          "Something went wrong";
        state.items.filteredItems.items = [];
      });
    // .addCase(deleteRecipe.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.items = state.items.filter(
    //     (item) => item.id !== action.payload.id
    //   );
    // })
    // .addCase(deleteRecipe.rejected, (state) => {
    //   state.loading = false;
    //   state.error = true;
    // })
  },
});

export default slice.reducer;

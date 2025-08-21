import { createAsyncThunk } from "@reduxjs/toolkit";

import { authInstance } from "../auth/operations";
import { setAuthHeader } from "../auth/operations";

export const fetchByPages = createAsyncThunk(
  "recipes/fetchAll",
  async ({ page, perPage = 12 }, thunkAPI) => {
    try {
      const res = await authInstance.get(
        `/recipes?page=${page}&perPage=${perPage}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchByFilters = createAsyncThunk(
  "recipes/fetchByFilters",
  async (
    { page, perPage = 12, category = "", ingredient = "", title = "" },
    thunkAPI
  ) => {
    try {
      const res = await authInstance.get(
        `/recipes?page=${page}&perPage=${perPage}&category=${category}&title=${title}&ingredient=${ingredient}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchById = createAsyncThunk(
  "/recipes/:id",
  async (id, thunkAPI) => {
    try {
      const res = await authInstance.get(`/recipes/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOwnRecipes = createAsyncThunk(
  "recipes/fetchOwnRecipes",
  async ({ page = 1, perPage = 12 }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const persistedToken = state.auth.token;
      if (persistedToken) {
        setAuthHeader(persistedToken);
      }
      const res = await authInstance.get(
        `/recipes/own?page=${page}&perPage=${perPage}`
      );
      return res.data;
    } catch (error) {
      throw error;
    } finally {
    }
  }
);

export const fetchFavouriteRecipes = createAsyncThunk(
  "recipes/fetchFavouriteRecipes",
  async ({ page = 1, perPage = 12 }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const persistedToken = state.auth.token;
      if (persistedToken) {
        setAuthHeader(persistedToken);
      }
      const res = await authInstance.get(
        `/recipes/favorite?page=${page}&perPage=${perPage}`
      );
      return res.data;
    } catch (error) {
      throw error;
    } finally {
    }
  }
);

export const addRecipe = createAsyncThunk(
  "recipes/addrecipe",
  async (payload, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const persistedToken = state.auth.token;
      setAuthHeader(persistedToken);

      let requestData;
      let config = {};

      if (payload.thumb && payload.thumb instanceof File) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("category", payload.category);
        formData.append("instructions", payload.instructions);
        formData.append("description", payload.description);
        formData.append("time", payload.time);
        formData.append("ingredients", JSON.stringify(payload.ingredients));
        if (payload.calories) {
          formData.append("calories", payload.calories);
        }
        formData.append("thumb", payload.thumb);

        requestData = formData;
      } else {
        requestData = payload;
        config.headers = {
          "Content-Type": "application/json",
        };
      }

      const res = await authInstance.post("/recipes", requestData, config);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.data ||
        error.response?.data?.message ||
        error.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

//  NO DELETING... FOR NOW!
// export const deleterecipe = createAsyncThunk(
//   "recipes/deleterecipe",
//   async (taskId, thunkAPI) => {
//     try {
//       const res = await axios.delete(`recipes/${taskId}`);
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const addFavouriteRecipe = createAsyncThunk(
  "recipes/addFavouriteRecipe",
  async (recipeId, thunkAPI) => {
    try {
      const res = await authInstance.post(`/recipes/favorite`, { recipeId });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteFavouriteRecipe = createAsyncThunk(
  "recipes/deleteFavouriteRecipe",
  async (recipeId, thunkAPI) => {
    try {
      const res = await authInstance.delete(`/recipes/favorite/${recipeId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

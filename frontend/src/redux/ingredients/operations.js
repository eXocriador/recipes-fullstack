import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchIngredients = createAsyncThunk(
  "ingredients/fetchIngredients",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/ingredients");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

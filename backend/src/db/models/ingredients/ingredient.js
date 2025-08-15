import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: false,
    },

    img: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);

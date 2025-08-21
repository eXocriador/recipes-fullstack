import mongoose from 'mongoose';

const recipeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const RecipeCategory = mongoose.model(
  'Category',
  recipeCategorySchema,
);

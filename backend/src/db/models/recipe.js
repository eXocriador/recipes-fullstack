import mongoose from 'mongoose';

const ingredientInRecipeSchema = new mongoose.Schema({
    id: {
    type: String,
    ref: 'Ingredient',
    required: true,
  },
  measure: {
    type: String,
    required: true,
    maxlength: 64,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 64 },
    category: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    area: { type: String, maxlength: 64 },
    instructions: { type: String, required: true, maxlength: 1200 },
    description: { type: String, required: true, maxlength: 200 },
    thumb: { type: String, },               
    thumbPublicId: { type: String },
    time: { type: String, required: true, maxlength: 64 }, 
    ingredients: { type: [ingredientInRecipeSchema], required: true },
    calories: { type: Number, min: 1, max: 10000 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Recipe', recipeSchema);

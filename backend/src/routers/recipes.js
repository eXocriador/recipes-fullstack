import { Router } from 'express';
import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';
import { uploadRecipeImage } from '../middlewares/cloudinaryUpload.js';
import { createRecipe } from '../controllers/recipes/createRecipe.js';
import { getOwnRecipesController } from '../controllers/recipes/getRecipes.js';
//import { getRecipeById } from '../controllers/recipes/getRecipeById.js';
import { updateRecipe } from '../controllers/recipes/updateRecipe.js';
import { deleteRecipe } from '../controllers/recipes/deleteRecipe.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllRecipesController,
  getPublicRecipeByIdController,
} from '../controllers/recipes/getAllRecipesController.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  addFavoriteRecipeController,
  deleteFavoriteRecipeController,
  getFavoriteRecipeController,
} from '../controllers/recipes/favoritesControllers.js';
const router = Router();

function parseIngredients(req, res, next) {
  console.log('parseIngredients middleware - req.body:', req.body);
  if (req.body.ingredients && typeof req.body.ingredients === 'string') {
    try {
      req.body.ingredients = JSON.parse(req.body.ingredients);
      console.log('Parsed ingredients:', req.body.ingredients);
    } catch (error) {
      console.log('Failed to parse ingredients:', error);
      // Якщо не валідний JSON — Joi відловить помилку
    }
  }
  console.log('parseIngredients completed, req.body:', req.body);
  next();
}

router.get('/favorite', authenticate, ctrlWrapper(getFavoriteRecipeController));

router.post(
  '/favorite',
  authenticate,
  express.json(),
  ctrlWrapper(addFavoriteRecipeController),
);

router.delete(
  '/favorite/:recipeId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteFavoriteRecipeController),
);

router.get('/', ctrlWrapper(getAllRecipesController));
router.get('/own', authenticate, getOwnRecipesController);
router.get('/:recipeId', ctrlWrapper(getPublicRecipeByIdController));

//router.get('/:id', authenticate, getRecipeById);

router.post(
  '/',
  authenticate,
  uploadRecipeImage,
  parseIngredients,
  validateBody(recipeSchema),
  createRecipe,
);

router.patch(
  '/:id',
  authenticate,
  uploadRecipeImage,
  parseIngredients,
  validateBody(recipeSchema),
  updateRecipe,
);

router.delete('/:id', authenticate, deleteRecipe);

export default router;

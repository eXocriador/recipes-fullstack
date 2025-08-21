import { Router } from 'express';
import { getAllIngredientsController } from '../controllers/ingredients/getAllIngredients.js';

const ingredientsRouter = Router();

ingredientsRouter.get('/', getAllIngredientsController);

export default ingredientsRouter;

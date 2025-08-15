import express from 'express';
import { getAllRecipeCategoriesController } from '../controllers/categories/getAllRecipeCategories.js';

const router = express.Router();

router.get('/', getAllRecipeCategoriesController);

export default router;

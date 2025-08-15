import { getAllRecipes, getPublicRecipeById } from "../../services/recipes/getAllRecipes.js";
import { parsePaginationParams } from "../../utils/parsePaginationParams.js";
import { parseFilterParams } from "../../utils/parseFilterParams.js";
import createHttpError from 'http-errors';

export const getAllRecipesController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const filter = parseFilterParams(req.query);
    
    const recipes = await getAllRecipes({
        page,
        perPage,
        filter,
    });
    res.json({
        status: 200,
        message: "Successfully found recipes!",
        data: recipes,
    });

};

export const getPublicRecipeByIdController = async (req, res) => {
    const { recipeId } = req.params;
    const recipe = await getPublicRecipeById(recipeId);
    if (!recipe) {

        throw createHttpError(404, `Recipe with id ${recipeId} not found`);
    }
        res.status(200).json({
            status: 200,
            message: `Successfully found recipe with id ${recipeId}!`,
            data: recipe,
        });
};
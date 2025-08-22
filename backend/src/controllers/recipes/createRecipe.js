import Recipe from '../../db/models/recipe.js';

export const createRecipe = async (req, res, next) => {
  try {
    console.log('Creating recipe with data:', req.body);
    console.log('User ID:', req.user._id);

    const owner = req.user._id;
    const recipe = await Recipe.create({
      ...req.body,
      owner,
    });

    console.log('Recipe created successfully:', recipe);

    res.status(201).json({
      status: 201,
      message: 'Recipe created',
      data: recipe,
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    next(error);
  }
};

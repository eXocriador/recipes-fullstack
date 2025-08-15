const parseCategory = (category) => {
    const isString = typeof category === 'string';
    if (!isString) return;
    return category.trim();
};
const parseIngredient = (ingredient) => {
    const isString = typeof ingredient === 'string';
    if (!isString) return;
    return ingredient.trim().toLowerCase();
};
const parseTitle = (title) => {
    const isString = typeof title === 'string';
    if (!isString) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    return new RegExp(trimmed, 'i'); // пошук по частині назви
};

export const parseFilterParams = (query) => {
    const { category, ingredient, title } = query;
    const parsedCategory = parseCategory(category);
    const parsedIngredient = parseIngredient(ingredient);
    const parsedTitle = parseTitle(title);
    
    return {
        category: parsedCategory,
        ingredient: parsedIngredient,
        title: parsedTitle,
    };
};
import css from "./RecipeDetails.module.css";
import GeneralInfoRecipe from "../GeneralInfoRecipe/GeneralInfoRecipe";
import AboutRecipe from "../AboutRecipe/AboutRecipe";
import PreparationRecipe from "../PreparationRecipe/PreparationRecipe";
import RecipeIngredientsList from "../RecipeIngredientsList/RecipeIngredientsList";
import Container from "../container/container";

export default function RecipeDetails({ recipe }) {
  const {
    title,
    thumb,
    category,
    time,
    calories,
    description,
    ingredients,
    instructions,
    _id,
  } = recipe;

  return (
    <section className={css.section}>
      <Container className={css.container}>
        <div className={css.recipeContainer}>
          <div className={css.imageBox}>
            <h2 className={css.mainRecipeTitle}>{title}</h2>
            <img
              className={css.recipeImage}
              src={thumb}
              alt={`Photo of ${title}`}
            />
          </div>
          <div className={css.flexBox}>
            <GeneralInfoRecipe
              category={category}
              time={time}
              calories={calories}
              id={_id}
            />
            <div className={css.aboutBox}>
              <AboutRecipe description={description} />
              <RecipeIngredientsList ingredients={ingredients} />
              <PreparationRecipe instructions={instructions} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

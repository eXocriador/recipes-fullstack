import RecipeCard from "../RecipeCard/RecipeCard";
import style from "./RecipesList.module.css";

export default function RecipesList({ items, isModalOpen, favourites }) {
  return (
    <ul className={style.list}>
      {items &&
        items.map((recipeCard) => (
          <li className={style.item} key={recipeCard._id}>
            <RecipeCard
              favourites={favourites}
              isModalOpen={isModalOpen}
              recipeCard={recipeCard}
            />
          </li>
        ))}
    </ul>
  );
}

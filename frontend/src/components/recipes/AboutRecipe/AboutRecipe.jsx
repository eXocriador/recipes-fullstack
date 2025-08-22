import css from "./AboutRecipe.module.css";
export default function AboutRecipe({ description }) {
  return (
    <div className={css.aboutInfo}>
      <h3 className={css.aboutTitle}>About recipe</h3>
      <p className={css.aboutText}>{description}</p>
    </div>
  );
}

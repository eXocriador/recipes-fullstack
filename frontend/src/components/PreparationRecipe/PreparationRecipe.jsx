import css from "./PreparationRecipe.module.css";
export default function PreparationRecipe({ instructions }) {
  if (!instructions) return null;

  const steps = instructions.split("\n").filter((step) => step.trim() !== "");
  return (
    <div className={css.preparationBox}>
      <h3 className={css.preparationTitle}>Preparation Steps:</h3>
      {steps.map((step, index) => (
        <p className={css.preparationText} key={index}>
          {step}
        </p>
      ))}
    </div>
  );
}

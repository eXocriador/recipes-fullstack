import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import css from "./AddRecipeForm.module.css";
import Svg from "../Svg/svg.jsx";
import defaultImage from "../../img/default.jpg";

import { fetchCategories } from "../../redux/categories/operations";
import { selectCategories } from "../../redux/categories/selectors";

import { fetchIngredients } from "../../redux/ingredients/operations.js";
import { selectIngredients } from "../../redux/ingredients/selectors.js";

import { addRecipe } from "../../redux/recipes/operations.js";

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      time: "",
      calories: "",
      category: "",
      ingredients: [],
      instructions: "",
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    replace: replaceIngredients,
  } = useFieldArray({ control, name: "ingredients" });

  const [ingredient, setIngredient] = useState("");
  const [measure, setMeasure] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ingredientNameError, setIngredientNameError] = useState("");
  const [ingredientAmountError, setIngredientAmountError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState();
  const fileInputRef = useRef(null);
  const [ingredientsError, setIngredientsError] = useState("");
  const navigate = useNavigate(); 

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleAddIngredient = () => {
    let hasError = false;
    if (!ingredient.trim()) {
      setIngredientNameError("Required field!");
      hasError = true;
    } else {
      setIngredientNameError("");
    }
    if (!measure.trim()) {
      setIngredientAmountError("Required field!");
      hasError = true;
    } else if (measure.length > 64) {
      setIngredientAmountError("Amount must be 64 characters or less!");
      hasError = true;
    } else {
      setIngredientAmountError("");
    }
    if (hasError) return;

    const selectedIngredient = ingredients.find(
      (item) => item._id === ingredient
    );
    const ingredientName = selectedIngredient
      ? selectedIngredient.name
      : ingredient;

    const newIngredient = {
      ingredientId: ingredient,
      measure: measure,
      name: ingredientName,
    };

    appendIngredient(newIngredient);
    setIngredient("");
    setMeasure("");
  };

  const onSubmit = async (data) => {
    if (ingredientFields.length <= 1) {
      setIngredientsError(
        "Required field! There must be at least two ingredients!"
      );
      return;
    } else {
      setIngredientsError("");
    }

    setIsSubmitted(true);

    const selectedCategory = categories.find((cat) => cat.id === data.category);
    const categoryName = selectedCategory
      ? selectedCategory.name
      : data.category;

    const recipeData = {
      title: data.title,
      category: categoryName,
      instructions: data.instructions,
      description: data.description,
      time: String(data.time),
      ingredients: ingredientFields.map((field) => ({
        id: String(field.ingredientId),
        measure: String(field.measure),
      })),
      calories: data.calories ? Number(data.calories) : null,
    };

    if (photo) {
      recipeData.thumb = photo;
    } else {
      try {
        const response = await fetch(defaultImage);
        const blob = await response.blob();
        const defaultFile = new File([blob], "default.jpg", {
          type: "image/jpeg",
        });
        recipeData.thumb = defaultFile;
      } catch (error) {
        console.warn("Could not load default image:", error);
      }
    }

    try {
      const result = await dispatch(addRecipe(recipeData));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Recipe created successfully! 🎉");
        const recipeId =
          result.payload?.data?.id ||
          result.payload?.recipe?.id ||
          result.payload?.id ||
          result.payload?._id ||
          result.payload?.data?._id ||
          result.payload?.recipe?._id;
        
        if (recipeId) {
          navigate(`/recipes/${recipeId}`);
        } else {
          navigate("/recipes");
        }

        reset();
        replaceIngredients([]);
        setIngredient("");
        setMeasure("");
        setPhoto(null);
        setPhotoPreview(null);
      } else if (result.meta.requestStatus === "rejected") {
        const errorMessage =
          result.payload?.message || "Failed to create recipe";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <form className={css.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={css.formTitle}>Add Recipe</h2>
      <div className={css.mainRowContainer}>
        <section className={css.sectionPhoto}>
          <h3 className={css.sectionTitlePhoto}>Upload Photo</h3>

          <div
            className={css.noImage}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className={css.photoPreview}
                onClick={(event) => {
                  event.stopPropagation();
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
              />
            ) : (
              <Svg name="photo" styles={css.iconPhoto} />
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files[0];
              if (file) {
                const allowedTypes = [
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "image/webp",
                ];
                if (!allowedTypes.includes(file.type)) {
                  toast.error("Only JPG, PNG, or WEBP images are allowed.");
                  event.target.value = "";
                  return;
                }

                const maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                  toast.error("Image size must be less than 2MB.");
                  event.target.value = "";
                  return;
                }

                setPhoto(file);
                setPhotoPreview(URL.createObjectURL(file));
              }
            }}
          />
        </section>

        <div className={css.globalContainer}>
          <section className={css.sectionInformation}>
            <h3 className={css.sectionTitle}>General Information</h3>
            <div className={css.recipeParts}>
              <div className={css.recipeTitle}>
                <p className={css.titleText}> Recipe Title </p>
                <input
                  className={`${css.formInput} ${errors.title ? css.err : ""}`}
                  type="text"
                  placeholder="Enter the name of your recipe"
                  maxLength="64"
                  {...register("title", {
                    required: "Required field!",
                    maxLength: {
                      value: 64,
                      message: "Title must be 64 characters or less",
                    },
                  })}
                />
                {errors.title && (
                  <span className={css.error}>{errors.title.message}</span>
                )}
              </div>
              <div className={css.recipeDescription}>
                <p className={css.titleText}>Recipe Description</p>
                <textarea
                  className={`${css.textarea} ${
                    errors.description ? css.err : ""
                  }`}
                  placeholder="Enter a brief description of your recipe"
                  maxLength="200"
                  {...register("description", {
                    required: "Required field!",
                    maxLength: {
                      value: 200,
                      message: "Description must be 200 characters or less",
                    },
                  })}
                />
                {errors.description && (
                  <span className={css.error}>
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className={css.recipeCooking}>
                <p className={css.titleText}>Cooking time in minutes</p>
                <input
                  className={`${css.formInput} ${errors.time ? css.err : ""}`}
                  type="number"
                  placeholder="10"
                  min="1"
                  {...register("time", {
                    required: "Required field!",
                    min: {
                      value: 1,
                      message: "Time must be at least 1 minute",
                    },
                  })}
                />
                {errors.time && (
                  <span className={css.error}>{errors.time.message}</span>
                )}
              </div>
              <div className={css.recipeCalories}>
                <div className={css.caloriesPart}>
                  <p className={css.titleText}>Calories</p>
                  <input
                    className={`${css.formInput} ${
                      errors.calories ? css.err : ""
                    }`}
                    type="number"
                    placeholder="150 cals (optional)"
                    min="1"
                    max="10000"
                    {...register("calories", {
                      min: {
                        value: 1,
                        message: "Calories must be at least 1",
                      },
                      max: {
                        value: 10000,
                        message: "Calories cannot exceed 10000",
                      },
                    })}
                  />
                  {errors.calories && (
                    <span className={css.error}>{errors.calories.message}</span>
                  )}
                </div>
                <div className={css.categoryPart}>
                  <p className={css.titleText}>Category</p>
                  <select
                    className={`${css.formInput} ${
                      errors.category ? css.err : ""
                    }`}
                    {...register("category", {
                      required: "Required field!",
                    })}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className={css.error}>{errors.category.message}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={css.sectionIngredients}>
            <h3 className={css.sectionTitle}>Ingredients</h3>
            <div className={css.titleParts}>
              <div className={css.titlePartsItem}>
                <div className={css.itemName}>
                  <p className={css.titleText}>Name</p>
                  <select
                    className={`${css.formInput} ${
                      ingredientNameError ? css.err : ""
                    }`}
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  >
                    <option value="">Select ingredient</option>
                    {ingredients.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {ingredientNameError && (
                    <span className={css.error}>{ingredientNameError}</span>
                  )}
                </div>
                <div className={css.itemAmuont}>
                  <p className={css.titleText}>Amount</p>
                  <input
                    className={`${css.formInput} ${
                      ingredientAmountError ? css.err : ""
                    }`}
                    placeholder="100g"
                    maxLength="64"
                    value={measure}
                    onChange={(event) => setMeasure(event.target.value)}
                  />
                  {ingredientAmountError && (
                    <span className={css.error}>{ingredientAmountError}</span>
                  )}
                </div>
              </div>
              <div className={css.addBtn}>
                <button
                  className={`${css.button} ${css.addButton}`}
                  type="button"
                  onClick={handleAddIngredient}
                  disabled={isSubmitted}
                >
                  Add new ingredient
                </button>
              </div>
              <div className={css.addFieldForm}>
                <div
                  className={
                    ingredientFields.length > 0
                      ? css.statusVisible
                      : css.statusInvisible
                  }
                >
                  <p className={css.spanIngredientItem}>Name:</p>
                  <p className={css.spanMeasureItem}>Amount:</p>
                </div>
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className={css.ingredientRow}>
                    <span className={css.spanIngredient}>{field.name}</span>
                    <span className={css.spanMeasure}>{field.measure}</span>
                    {!isSubmitted && (
                      <Svg
                        name={"trash"}
                        styles={css.spanIcon}
                        onClick={() => removeIngredient(index)}
                      />
                    )}
                  </div>
                ))}
                {ingredientsError && (
                  <span className={css.error}>{ingredientsError}</span>
                )}
              </div>
            </div>
          </section>

          <section className={css.sectionInstructions}>
            <div>
              <h3 className={css.sectionTitle}>Instructions</h3>
              <textarea
                className={`${css.textarea} ${
                  errors.instructions ? css.err : ""
                }`}
                placeholder="Enter instructions"
                maxLength="1200"
                {...register("instructions", {
                  required: "Required field!",
                  maxLength: {
                    value: 1200,
                    message: "Instructions must be 1200 characters or less",
                  },
                })}
              />
              {errors.instructions && (
                <span className={css.error}>{errors.instructions.message}</span>
              )}
            </div>
          </section>

          <div className={css.bntContainer}>
            <button className={css.button} type="submit" disabled={isSubmitted}>
              {isSubmitted ? "Publishing..." : "Publish Recipe"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Svg from '../../common/Svg/Svg';
import { Spinner } from '../../common/Loader/Loader';
import style from './RecipeCard.module.css';
import { useDispatch, useSelector } from 'react-redux';

import {
  deleteFavouriteRecipe,
  addFavouriteRecipe,
} from '../../../redux/recipes/operations.js';
import { selectIsLoggedIn } from '../../../redux/auth/selectors.js';
import { useEffect, useState } from 'react';

export default function RecipeCard({ recipeCard, isModalOpen, favourites }) {
  const dispatch = useDispatch();
  const idLoggedIn = useSelector(selectIsLoggedIn);
  const { recipeType } = useParams();
  const [isFavouriteState, setIsFavouriteState] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const isFavourite = favourites?.some(fav => fav === recipeCard._id);

  useEffect(() => {
    isFavourite && setIsFavouriteState(true);
  }, [isFavourite]);

  const handleDeleteFavourite = async () => {
    setIsLoading(true);
    toast.error('Deleting');
    try {
      if (recipeCard._id) {
        await dispatch(deleteFavouriteRecipe(recipeCard._id))
          .unwrap()
          .catch(err => {})
          .then(() => {
            setIsFavouriteState(false);
          });
        toast.success('Removed from favourites');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFavourite = async () => {
    if (!idLoggedIn) {
      isModalOpen(true);
      return;
    }
    setIsLoading(true);
    toast.success('Adding');
    try {
      if (recipeCard._id) {
        await dispatch(addFavouriteRecipe(recipeCard._id))
          .unwrap()
          .then(() => {
            setIsFavouriteState(true);
          });
        toast.success('Added to favourites');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFavouriteButton = () => {
    if (isLoading) {
      return (
        <div className={style.svg1Wrapper}>
          <Spinner size='small' />
        </div>
      );
    }

    if (recipeType === 'own') {
      return null;
    }

    if (isFavouriteState) {
      return (
        <div
          onClick={handleDeleteFavourite}
          className={style.svg1WrapperActive}
        >
          <Svg styles={style.svg1Active} name='bookmark' />
        </div>
      );
    }

    return (
      <div onClick={handleAddFavourite} className={style.svg1Wrapper}>
        <Svg styles={style.svg1} name='bookmark' />
      </div>
    );
  };

  return (
    <div className={style.recipeCardWrapper}>
      <div className={style.imgWrapper}>
        <img className={style.img} src={recipeCard.thumb} alt='recipe' />
      </div>
      <div className={style.titleWrapper}>
        <h2 className={style.title}>{recipeCard.title}</h2>
        <div className={style.svgWrapper}>
          <Svg styles={style.svg} name='clock' />
          <p className={style.minutes}>{recipeCard.time}</p>
        </div>
      </div>
      <div className={style.textWrapper}>
        <p className={style.text}>{recipeCard.description}</p>
        {!recipeCard.time ? (
          <p className={style.text1}>-</p>
        ) : (
          <p className={style.text1}>~{recipeCard.time} cal</p>
        )}
      </div>
      <div className={style.btnWrapper}>
        <NavLink
          className={style.learnMoreBtn}
          to={`/recipes/${recipeCard._id}`}
        >
          Learn more
        </NavLink>
        {renderFavouriteButton()}
      </div>
    </div>
  );
}

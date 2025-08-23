import css from './App.module.css';
import { Layout } from './layout/Layout.jsx';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage.jsx';
import ListWrapper from './ui/ListWrapper/ListWrapper.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, refreshUser } from '../redux/auth/operations.js';
import {
  selectUserData,
  selectIsLoggedIn,
  selectToken,
} from '../redux/auth/selectors.js';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.jsx';
import { fetchCategories } from '../redux/categories/operations.js';
import { fetchIngredients } from '../redux/ingredients/operations.js';
import { fetchByPages } from '../redux/recipes/operations.js';

const AuthPage = lazy(() => import(`../pages/AuthPage.jsx`));
const AddRecipePage = lazy(() => import(`../pages/AddRecipePage.jsx`));
const ProfilePage = lazy(() => import(`../pages/ProfilePage/ProfilePage.jsx`));
const RecipeViewPage = lazy(() => import(`../pages/RecipeViewPage.jsx`));
const RestrictedRoute = lazy(() => import(`./routes/RestrictedRoute.jsx`));
const PrivateRoute = lazy(() => import(`./routes/PrivateRoute.jsx`));

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  useEffect(() => {
    dispatch(fetchByPages({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (token && !isLoggedIn) {
      dispatch(refreshUser()).then(action => {
        if (refreshUser.fulfilled.match(action)) {
          dispatch(getUserInfo());
        }
      });
    } else if (isLoggedIn) {
      dispatch(getUserInfo());
    }
  }, [dispatch, token, isLoggedIn]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchIngredients());
  }, [dispatch]);
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000,
          position: 'bottom-center',
          style: {
            background: 'var(--light-brown)',
            color: 'var(--white)',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      />
      <div className={css.mainApp}>
        <Suspense fallback={<span className={css.loader}></span>}>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<MainPage />} />

              <Route
                path='auth/:authType'
                element={
                  <RestrictedRoute component={<AuthPage />} redirectTo='/' />
                }
              />

              <Route
                path='add-recipe'
                element={
                  <PrivateRoute
                    component={<AddRecipePage />}
                    redirectTo='/auth/login'
                  />
                }
              />

              <Route
                path='profile'
                element={
                  <PrivateRoute
                    component={<ProfilePage />}
                    redirectTo='/auth/login'
                  />
                }
              >
                <Route
                  path=':recipeType'
                  element={
                    <ListWrapper
                      filter={{ page: 1 }}
                      setFilter={() => {}}
                      isSearched={false}
                      isModalOpen={false}
                      setSearchQuery={() => {}}
                    />
                  }
                />
                <Route path='*' element={<NotFoundPage />} />
              </Route>

              <Route path='recipes/:id' element={<RecipeViewPage />} />

              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

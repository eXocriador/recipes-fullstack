import css from "./App.module.css";
import Layout from "../components/Layout/Layout.jsx";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage.jsx";
import ListWrapper from "./ListWrapper/ListWrapper.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, refreshUser } from "../redux/auth/operations.js";
import {
  selectUserData,
  selectIsLoggedIn,
  selectToken,
} from "../redux/auth/selectors.js";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";
import { fetchCategories } from "../redux/categories/operations.js";
import { fetchIngredients } from "../redux/ingredients/operations.js";
import { fetchByPages } from "../redux/recipes/operations.js";

const AuthPage = lazy(() => import(`../pages/AuthPage.jsx`));
const AddRecipePage = lazy(() => import(`../pages/AddRecipePage.jsx`));
const ProfilePage = lazy(() => import(`../pages/ProfilePage/ProfilePage.jsx`));
const RecipeViewPage = lazy(() => import(`../pages/RecipeViewPage.jsx`));
const RestrictedRoute = lazy(() => import(`./RestrictedRoute.jsx`));
const PrivateRoute = lazy(() => import(`./PrivateRoute.jsx`));

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  useEffect(() => {
    dispatch(fetchByPages({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (token && !isLoggedIn) {
      dispatch(refreshUser()).then((action) => {
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
          position: "top-left",
          style: {
            background: "var(--light-brown)",
            color: "var(--white)",
            fontSize: "12px",
            borderRadius: "8px",
          },
        }}
      />
      <div className={css.mainApp}>
        <Suspense fallback={<span className={css.loader}></span>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainPage />} />

              <Route
                path="auth/:authType"
                element={
                  <RestrictedRoute component={<AuthPage />} redirectTo="/" />
                }
              />

              <Route
                path="add-recipe"
                element={
                  <PrivateRoute
                    component={<AddRecipePage />}
                    redirectTo="/auth/login"
                  />
                }
              />

              <Route
                path="profile"
                element={
                  <PrivateRoute
                    component={<ProfilePage />}
                    redirectTo="/auth/login"
                  />
                }
              >
                <Route path=":recipeType" element={<ListWrapper />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="recipes/:id" element={<RecipeViewPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

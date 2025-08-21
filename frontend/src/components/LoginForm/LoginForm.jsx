import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Svg from "../Svg/svg.jsx";

import { login, getUserInfo } from "../../redux/auth/operations";
import { selectIsLoading } from "../../redux/auth/selectors"; // ← додай свій селектор

import css from "./LoginForm.module.css";
import Loader from "../Loader/Loader.jsx"; // ← компонент лоадера

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .min(3, "Must be min 3 chars")
    .required("This field is required")
    .max(50, "Must be less than 50 chars"),
  password: Yup.string().required("This field is required"),
});

const initialValues = { email: "", password: "" };

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = (values, actions) => {
    dispatch(login(values))
      .unwrap()
      .then(() => dispatch(getUserInfo()))
      .then(() => {
        toast.success("Login successful! 👏");
        navigate("/");
      })
      .catch(() => {
        toast.error("Failed to log in. Please check your email or password.");
      });
    actions.resetForm();
  };

  return (
    <>
      {isLoading ? (
        <div className={css.loginForm}>
          <Loader />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={LoginSchema}
        >
          {({ errors }) => (
            <Form className={css.loginForm}>
              <h2 className={css.loginText}>Login</h2>
              <div className={css.inputForm}>
                <div className={css.passwordField}>
                  <label className={css.loginLabel}>
                    Enter your email address
                  </label>
                  <Field
                    className={`${css.loginInput} ${
                      errors.email ? css.err : ""
                    }`}
                    type="email"
                    name="email"
                    placeholder="email@gmail.com"
                  />
                  <ErrorMessage
                    className={css.error}
                    name="email"
                    component="span"
                  />
                </div>
                <div className={css.passwordField}>
                  <label
                    className={`${css.loginLabel} ${css.loginLabelWithSpace}`}
                  >
                    Enter your password
                  </label>
                  <Field
                    className={`${css.loginInput} ${
                      errors.password ? css.err : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="•••••••••••"
                  />
                  <Svg
                    name={showPassword ? "eye" : "close-eye"}
                    styles={css.iconEye}
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                  <ErrorMessage
                    className={css.errorPass}
                    name="password"
                    component="span"
                  />
                </div>
              </div>
              <div className={css.buttonForm}>
                <button className={css.loginBtn} type="submit">
                  Log In
                </button>
              </div>
              <p className={css.regText}>
                Don’t have an account?&nbsp;
                <Link className={css.regLink} to="/auth/register">
                  Register
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

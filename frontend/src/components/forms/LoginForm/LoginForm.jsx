import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-hot-toast";
import Svg from "../../common/Svg/svg.jsx";

import { login, getUserInfo } from "../../../redux/auth/operations";
import { selectIsLoading } from "../../../redux/auth/selectors"; // ← add your selector

import css from "./LoginForm.module.css";
import Loader from "../../common/Loader/Loader.jsx"; // ← loader component

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(3, "Must be min 3 chars")
    .max(50, "Must be less than 50 chars"),
  password: z.string()
});

const initialValues = { email: "", password: "" };

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = (values, actions) => {
    // Validate with Zod
    const validationResult = LoginSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      actions.setErrors(errors);
      return;
    }

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
          validate={(values) => {
            const result = LoginSchema.safeParse(values);
            if (!result.success) {
              const errors = {};
              result.error.errors.forEach((error) => {
                const field = error.path[0];
                errors[field] = error.message;
              });
              return errors;
            }
            return {};
          }}
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
              <button type="submit" className={css.loginBtn}>
                Login
              </button>
              <p className={css.loginTextBottom}>
                Don't have an account?{" "}
                <Link to="/register" className={css.loginLink}>
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

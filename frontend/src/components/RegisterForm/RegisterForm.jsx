import css from "./RegisterForm.module.css";
import Svg from "../Svg/svg";

import { Field, Form, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { register, getUserInfo, login } from "../../redux/auth/operations";
import Loader from "../Loader/Loader";

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Must be min 3 chars")
    .max(50, "Must be less then 50 chars")
    .required("This field is required"),
  email: Yup.string()
    .email("Invalid email format")
    .min(3, "Must be min 3 chars")
    .required("This field is required")
    .max(50, "Must be less then 50 chars"),
  password: Yup.string()
    .min(8, "Must be min 8 chars")
    .required("This field is required")
    .max(50, "Must be less then 50 chars"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});
const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};
export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfimrPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (values, actions) => {
    setIsLoading(true);
    const { confirmPassword, agree, ...filteredValues } = values;
    dispatch(register(filteredValues))
      .unwrap()
      .then(() => {
        return dispatch(
          login({
            email: filteredValues.email,
            password: filteredValues.password,
          })
        ).unwrap();
      })
      .then(() => {
        return dispatch(getUserInfo());
      })
      .then(() => {
        toast.success("Register successful!");
        navigate("/");
      })

      .catch((error) => {
        if (typeof error === "string" && error.includes("409")) {
          toast.error("This email address is already registered.");
        } else {
          toast.error("OOPS... Failed to register user.");
        }
      })
      .finally(() => {
        setIsLoading(false);
        actions.resetForm();
      });
  };

  return isLoading ? (
    <div className={css.loaderOverlay}>
      <Loader />
    </div>
  ) : (
    <div className={css.regContainer}>
      <div className={css.formRegContainer}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={UserSchema}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, errors }) => (
            <Form className={css.regForm}>
              <div className={css.newContainer}>
                {" "}
                <h2 className={css.regHeader}>Register</h2>
                <p className={css.regText}>
                  Join our community of culinary enthusiasts, save your favorite
                  recipes, and share your cooking creations
                </p>
                <div className={css.labelContainer}>
                  <label className={css.regLabel}>
                    <span className={css.regSpan}>Enter your name</span>
                    <Field
                      className={`${css.regField} ${
                        errors.name ? css.error : ""
                      }`}
                      name="name"
                      placeholder="Max"
                    />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className={css.errorMess}
                    />
                  </label>
                  <label className={css.regLabel}>
                    <span className={css.regSpan}>
                      Enter your email address
                    </span>
                    <Field
                      className={`${css.regField} ${
                        errors.email ? css.error : ""
                      }`}
                      name="email"
                      placeholder="email@gmail.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className={css.errorMess}
                    />
                  </label>
                  <label className={css.regLabel}>
                    <span className={css.regSpan}>
                      Create a strong password
                    </span>
                    <div className={css.iconContainer}>
                      <Field
                        className={`${css.regField} ${
                          errors.password ? css.error : ""
                        }`}
                        name="password"
                        placeholder="*********"
                        type={showPassword ? "text" : "password"}
                      />
                      <Svg
                        name={showPassword ? "eye" : "close-eye"}
                        styles={css.regEye}
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="span"
                      className={css.errorMess}
                    />
                  </label>
                  <label className={css.regLabel}>
                    <span className={css.regSpan}>Repeat your password</span>
                    <div className={css.iconContainer}>
                      <Field
                        className={`${css.regField} ${
                          errors.confirmPassword ? css.error : ""
                        }`}
                        name="confirmPassword"
                        placeholder="*********"
                        type={showConfirmPassword ? "text" : "password"}
                      />
                      <Svg
                        name={showConfirmPassword ? "eye" : "close-eye"}
                        styles={css.regEye}
                        onClick={() => setShowConfimrPassword((prev) => !prev)}
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="span"
                      className={css.errorMess}
                    />
                  </label>
                  <label className={css.checkboxContainer}>
                    <Field
                      className={css.checkbox}
                      type="checkbox"
                      name="agree"
                    />
                    <span className={css.checkmark}>
                      <Svg
                        name="check-alternative"
                        styles={css.checkAlternative}
                      />
                    </span>
                    <span className={css.regTextAgr}>
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </label>
                </div>
                <button
                  className={css.regButton}
                  type="submit"
                  disabled={!values.agree}
                >
                  Create account
                </button>
                <p className={css.regTextLastChild}>
                  Already have an account? <span> </span>
                  <Link className={css.regLogInLabel} to="/auth/login">
                    Log in
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

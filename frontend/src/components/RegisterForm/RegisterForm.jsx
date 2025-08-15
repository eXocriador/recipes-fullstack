import css from "./RegisterForm.module.css";
import Svg from "../Svg/svg";

import { Field, Form, Formik, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { register, getUserInfo, login } from "../../redux/auth/operations";
import Loader from "../Loader/Loader";

const UserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Must be min 3 chars")
      .max(50, "Must be less then 50 chars"),
    email: z
      .string()
      .email("Invalid email format")
      .min(3, "Must be min 3 chars")
      .max(50, "Must be less then 50 chars"),
    password: z
      .string()
      .min(8, "Must be min 8 chars")
      .max(50, "Must be less then 50 chars"),
    confirmPassword: z.string(),
    agree: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false
};
export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfimrPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (values, actions) => {
    // Validate with Zod
    const validationResult = UserSchema.safeParse(values);
    if (!validationResult.success) {
      const errors = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0];
        errors[field] = error.message;
      });
      actions.setErrors(errors);
      return;
    }

    setIsLoading(true);
    const { confirmPassword, agree, ...filteredValues } = values;
    dispatch(register(filteredValues))
      .unwrap()
      .then(() => {
        return dispatch(
          login({
            email: filteredValues.email,
            password: filteredValues.password
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
          validate={(values) => {
            const result = UserSchema.safeParse(values);
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
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, errors }) => (
            <Form className={css.regForm}>
              <div className={css.newContainer}>
                {" "}
                <h2 className={css.regHeader}>Register</h2>
                <p className={css.regText}>
                  To start enjoying all the features of our service, please
                  create your personal account
                </p>
                <div className={css.inputForm}>
                  <div className={css.nameField}>
                    <label className={css.regLabel}>Name</label>
                    <Field
                      className={`${css.regInput} ${
                        errors.name ? css.err : ""
                      }`}
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      className={css.error}
                      name="name"
                      component="span"
                    />
                  </div>
                  <div className={css.emailField}>
                    <label className={css.regLabel}>Email</label>
                    <Field
                      className={`${css.regInput} ${
                        errors.email ? css.err : ""
                      }`}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      className={css.error}
                      name="email"
                      component="span"
                    />
                  </div>
                  <div className={css.passwordField}>
                    <label className={css.regLabel}>Password</label>
                    <Field
                      className={`${css.regInput} ${
                        errors.password ? css.err : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
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
                  <div className={css.passwordField}>
                    <label className={css.regLabel}>Confirm password</label>
                    <Field
                      className={`${css.regInput} ${
                        errors.confirmPassword ? css.err : ""
                      }`}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                    />
                    <Svg
                      name={showConfirmPassword ? "eye" : "close-eye"}
                      styles={css.iconEye}
                      onClick={() => setShowConfimrPassword((prev) => !prev)}
                    />
                    <ErrorMessage
                      className={css.errorPass}
                      name="confirmPassword"
                      component="span"
                    />
                  </div>
                </div>
                <div className={css.agreeField}>
                  <Field
                    type="checkbox"
                    name="agree"
                    className={css.agreeCheckbox}
                  />
                  <label className={css.agreeLabel}>
                    I agree to the{" "}
                    <Link to="/terms" className={css.agreeLink}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className={css.agreeLink}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <button type="submit" className={css.regBtn}>
                  Register
                </button>
                <p className={css.regTextBottom}>
                  Already have an account?{" "}
                  <Link to="/login" className={css.regLink}>
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

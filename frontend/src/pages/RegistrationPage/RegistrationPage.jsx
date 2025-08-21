import RegisterForm from "../../components/RegisterForm/RegisterForm";
import css from "./RegistrationPage.module.css";

export default function RegistrationPage() {
  return (
    <div className={css.formContainer}>
      <RegisterForm />
    </div>
  );
}

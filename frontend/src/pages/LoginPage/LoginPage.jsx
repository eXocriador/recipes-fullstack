import LoginForm from '../../components/forms/LoginForm/LoginForm';

import css from './LoginPage.module.css';

export default function LoginPage () {
  return (
    <div className={css.formContainer}>
        <LoginForm />
    </div>
  );
};
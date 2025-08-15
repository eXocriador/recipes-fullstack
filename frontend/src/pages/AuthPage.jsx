import { useParams } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage";

export default function AuthPage() {
  const { authType } = useParams();

  if (authType === "login") {
    return <LoginPage />;
  }

  if (authType === "register") {
    return <RegistrationPage />;
  }

  return null;
}

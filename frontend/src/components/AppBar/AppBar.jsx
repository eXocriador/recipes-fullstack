import css from "./AppBar.module.css";
import UserMenu from "../UserMenu/UserMenu.jsx";
import AuthNav from "../AuthNav/AuthNav.jsx";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors.js";

export default function AppBar({ toggleModal }) {
  const getLinkStyles = ({ isActive }) => {
    return clsx(css.link, isActive && css.active);
  };
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <div className={css.container}>
      <nav>
        <NavLink to="/" className={getLinkStyles}>
          Recipes
        </NavLink>
      </nav>

      {isLoggedIn ? <UserMenu toggleModal={toggleModal} /> : <AuthNav />}
    </div>
  );
}

import { NavLink } from "react-router-dom";
import css from "./AuthNav.module.css";
import clsx from "clsx";
export default function AuthNav() {
  const getLinkStyles = ({ isActive }) => {
    return clsx(css.link, isActive && css.active);
  };
  return (
    <>
      <nav>
        <ul className={css.list}>
          <li>
            <NavLink className={getLinkStyles} to="/auth/login">
              Log In
            </NavLink>
          </li>
          <li>
            <NavLink className={getLinkStyles} to="/auth/register">
              Register
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
